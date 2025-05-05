import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/cartcontext";
import { useUser } from "../context/usercontext";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51RGWIO2Mm0DbrXihYk4y69hmAJ6eQ3BMVAjy9q7eKOdnWqugGxBzTGEfbXGHPa3dR5dQWIDfmEikaxfq7PdERdhT00kuMfYcGD"
);
const cardStyle = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: "Arial, sans-serif",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#32325d",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

//
const PaymentForm = ({
  formData,
  total,
  deliveryFee,
  handlePaymentSuccess,
  validate,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { token } = useUser();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!validate()) {
      setProcessing(false);
      setError("Please fill in all required fields correctly");
      return;
    }
    if (!stripe || !elements) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: {
        name: formData.cardName,
        email: formData.email,
      },
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/users/payment/process",
        {
          paymentMethodId: paymentMethod.id,
          amount: total + deliveryFee,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.status === "succeeded") {
        await handlePaymentSuccess();
        console.log("Payment succeeded, calling handlePaymentSuccess");
        setError(null);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment failed. Please try again.");
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <CardElement options={cardStyle} />
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <button
        type="submit"
        disabled={processing}
        className={`w-full bg-black text-white p-2 rounded-full`}
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

function CheckoutPage() {
  const {
    cart,
    subtotal,
    discount,
    total,
    discountPercentage,
    setCart,
    setTotal,
    setDiscount,
    setSubtotal,
  } = useCart();
  const { user, token } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.firstname || "",
    lastName: user?.lastname || "",
    phoneNumber: user?.phone || "",
    address: "",
    email: user?.email || "",
    area: "",
    cardName: "",
    cardNumber: "",
    expiration: "",
    cvv: "",
    method: "",
  });

  const [errors, setErrors] = useState({});
  const [deliveryFee, setDeliveryFee] = useState(0);

  const areaList = [
    { name: "Cairo", fee: 20 },
    { name: "Giza", fee: 30 },
    { name: "Qalyubia", fee: 40 },
  ];

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        firstName: user.firstname || "",
        lastName: user.lastname || "",
        phoneNumber: user.phone || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    if (errors[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field) => {
    validateField(field, formData[field]);
  };

  const validateField = (field, value) => {
    const errs = { ...errors };

    switch (field) {
      case "firstName":
      case "lastName":
      case "address":
      case "email":
      case "cardName":
        if (!value.trim()) errs[field] = "Required";
        else delete errs[field];
        break;
      case "phoneNumber":
        if (!/^\d{11}$/.test(value)) errs.phoneNumber = "Must be 11 digits";
        else delete errs.phoneNumber;
        break;
      case "cardNumber":
        if (!/^\d{16}$/.test(value.replace(/\s/g, "")))
          errs.cardNumber = "Must be 16 digits";
        else delete errs.cardNumber;
        break;
      case "expiration":
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value))
          errs.expiration = "Format MM/YY";
        else delete errs.expiration;
        break;
      case "cvv":
        if (!/^\d{3,4}$/.test(value)) errs.cvv = "Must be 3 or 4 digits";
        else delete errs.cvv;
        break;
      case "area":
        if (!value) errs.area = "Select an area";
        else delete errs.area;
        break;
      case "method":
        if (!value) errs.method = "Select payment method";
        else delete errs.method;
        break;
      default:
        break;
    }

    setErrors(errs);
  };

  const validate = () => {
    const errs = {};

    if (!formData.firstName.trim()) errs.firstName = "Required";
    if (!formData.lastName.trim()) errs.lastName = "Required";
    if (!formData.address.trim()) errs.address = "Required";
    if (!/^\d{11}$/.test(formData.phoneNumber))
      errs.phoneNumber = "Must be 11 digits";
    if (!formData.email.trim()) errs.email = "Required";
    if (formData.method === "mastercard" || formData.method === "visa") {
      if (!formData.cardName.trim()) errs.cardName = "Required";
    }
    if (!formData.area) errs.area = "Select an area";
    if (!formData.method) errs.method = "Select payment method";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirm = async () => {
    if (validate()) {
      let paymentMethod;
      if (formData.method === "mastercard" || formData.method === "visa") {
        paymentMethod = "Credit Card";
      } else if (formData.method === "cod") {
        paymentMethod = "COD";
      }

      const orderData = {
        firstname: formData.firstName,
        lastname: formData.lastName,
        phone: formData.phoneNumber,
        email: formData.email,
        products: cart.map((item) => ({
          name: item.name,
          price: item.price,
          size: item.size,
          image: item.image,
          quantity: item.quantity,
          discount: item.discount,
        })),
        totalPrice: total + deliveryFee,
        paymentMethod: paymentMethod,
        shippingAddress: formData.address,
        area: formData.area,
      };

      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/orders",
          orderData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Clear the cart and related local storage items
        setCart([]);
        setSubtotal(0);
        setDiscount(0);
        setTotal(0);
        localStorage.removeItem("cart");
        localStorage.removeItem("subtotal");
        localStorage.removeItem("discount");
        localStorage.removeItem("total");

        // Navigate to home and pass state for toast notification
        navigate("/home", { state: { showToast: true } });
      } catch (error) {
        console.error("Error creating order:", error);
        alert("There was an error processing your order. Please try again.");
      }
    }
  };

  const handleAreaChange = (value) => {
    const selectedArea = areaList.find((area) => area.name === value);
    setDeliveryFee(selectedArea ? selectedArea.fee : 0);
    handleChange("area", value);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-5 sm:p-10">
        <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl w-full max-w-3xl grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10 mb-10">
          {/* Delivery Information */}
          <div className="space-y-4">
            <h2 className="font-semibold text-lg mb-4 text-gray-700">
              Delivery Information
            </h2>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                onBlur={() => handleBlur("firstName")}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                onBlur={() => handleBlur("lastName")}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">{errors.lastName}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                placeholder="1234567890"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                onBlur={() => handleBlur("phoneNumber")}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full border rounded-md p-2"
                placeholder="example@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Shipping Address
              </label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                placeholder="Street, City, ZIP Code"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                onBlur={() => handleBlur("address")}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Area
              </label>
              <select
                className="w-full border rounded-md p-2"
                value={formData.area}
                onChange={(e) => handleAreaChange(e.target.value)}
                onBlur={() => handleBlur("area")}
              >
                <option value="">Select Area</option>
                {areaList.map((area) => (
                  <option key={area.name} value={area.name}>
                    {area.name} (${area.fee})
                  </option>
                ))}
              </select>
              {errors.area && (
                <p className="text-red-500 text-sm">{errors.area}</p>
              )}
            </div>
          </div>

          {/* Order Summary and Payment */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Discount ({discountPercentage}%)</span>
                  <span className="text-red-500">-${discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${(total + deliveryFee).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h2 className="font-semibold text-lg mb-4 text-gray-700">
                Payment Information
              </h2>
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => handleChange("method", "mastercard")}
                  className={`border p-2 rounded-md ${
                    formData.method === "mastercard"
                      ? "ring-2 ring-purple-500"
                      : ""
                  }`}
                >
                  <img
                    src="https://img.icons8.com/color/48/mastercard-logo.png"
                    alt="Mastercard"
                    className="w-8 h-8"
                  />
                </button>
                <button
                  onClick={() => handleChange("method", "visa")}
                  className={`border p-2 rounded-md ${
                    formData.method === "visa" ? "ring-2 ring-purple-500" : ""
                  }`}
                >
                  <img
                    src="https://img.icons8.com/color/48/000000/visa.png"
                    alt="Visa"
                    className="w-8 h-8"
                  />
                </button>
                <button
                  onClick={() => handleChange("method", "cod")}
                  className={`border p-2 rounded-md ${
                    formData.method === "cod" ? "ring-2 ring-purple-500" : ""
                  }`}
                >
                  COD
                </button>
              </div>
              {errors.method && (
                <p className="text-red-500 text-sm">{errors.method}</p>
              )}

              {/* Stripe Card Element */}
              {(formData.method === "mastercard" ||
                formData.method === "visa") && (
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      placeholder="Name on Card"
                      value={formData.cardName}
                      onChange={(e) => handleChange("cardName", e.target.value)}
                      onBlur={() => handleBlur("cardName")}
                    />
                    {errors.cardName && (
                      <p className="text-red-500 text-sm">{errors.cardName}</p>
                    )}
                  </div>
                  <Elements stripe={stripePromise}>
                    <PaymentForm
                      formData={formData}
                      total={total}
                      deliveryFee={deliveryFee}
                      handlePaymentSuccess={handleConfirm}
                      validate={validate}
                    />
                  </Elements>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link
                to="/cart"
                className="border bg-black text-white p-2 px-10 hover:bg-gray-500 rounded-full w-full sm:w-auto text-center"
              >
                Back
              </Link>
              {formData.method === "cod" && (
                <button
                  className="bg-black text-white p-2 px-6 rounded-full hover:bg-gray-500 w-full sm:w-auto"
                  onClick={handleConfirm}
                >
                  Confirm Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CheckoutPage;
