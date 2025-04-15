import React, { useState } from 'react';
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Link } from 'react-router-dom';
import { TbTruckDelivery } from "react-icons/tb";
import { SlLocationPin } from "react-icons/sl";

function CheckoutPage() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    cardNumber: '',
    expiration: '',
    cvv: '',
    delivery: '',
    method: '',
  });

  const [errors, setErrors] = useState({});

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
      case 'name':
      case 'address':
        if (!value.trim()) errs[field] = 'Required';
        else delete errs[field];
        break;
      case 'cardNumber':
        if (!/^\d{16}$/.test(value.replace(/\s/g, ''))) errs.cardNumber = 'Must be 16 digits';
        else delete errs.cardNumber;
        break;
      case 'expiration':
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) errs.expiration = 'Format MM/YY';
        else delete errs.expiration;
        break;
      case 'cvv':
        if (!/^\d{3,4}$/.test(value)) errs.cvv = 'Must be 3 digits';
        else delete errs.cvv;
        break;
      case 'delivery':
        if (!value) errs.delivery = 'Choose one';
        else delete errs.delivery;
        break;
      case 'method':
        if (!value) errs.method = 'Select payment method';
        else delete errs.method;
        break;
      default:
        break;
    }

    setErrors(errs);
  };

  const validate = () => {
    const errs = {};

    if (!formData.name.trim()) errs.name = 'Required';
    if (!formData.address.trim()) errs.address = 'Required';
    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, '')))
      errs.cardNumber = 'Must be 16 digits';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiration))
      errs.expiration = 'Format MM/YY';
    if (!/^\d{3,4}$/.test(formData.cvv)) errs.cvv = 'Must be 3 or 4 digits';
    if (!formData.delivery) errs.delivery = 'Choose one';
    if (!formData.method) errs.method = 'Select payment method';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirm = () => {
    if (validate()) {
      alert('Payment info is valid and submitted!');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-5 sm:p-10">
        <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl w-full max-w-3xl grid grid-cols-1 gap-8 mt-10 mb-10">

          {/* Delivery Options */}
          <div className="space-y-3">
            <p className="text-lg font-medium text-gray-700">Choose delivery option:</p>
            <div
              className={`border rounded-lg p-4 flex items-center gap-3 cursor-pointer ${
                formData.delivery === 'fast' ? 'border-slate-100 bg-slate-100 text-black' : 'text-gray-600'
              }`}
              onClick={() => handleChange('delivery', 'fast')}
              onBlur={() => handleBlur('delivery')}
            >
              <span className="text-lg"><TbTruckDelivery /></span>
              Fast delivery in 3-4 days ($90)
            </div>
            <div
              className={`border rounded-lg p-4 flex items-center gap-3 cursor-pointer ${
                formData.delivery === 'pickup' ? 'border-slate-100 bg-slate-100 text-black' : 'text-gray-600'
              }`}
              onClick={() => handleChange('delivery', 'pickup')}
              onBlur={() => handleBlur('delivery')}
            >
              <span className="text-lg"><SlLocationPin /></span>
              Normal delivery in 7-10 days ($50)
            </div>
            {errors.delivery && <p className="text-red-500 text-sm">{errors.delivery}</p>}
          </div>

          {/* Payment Section */}
          <div>
            <h2 className="font-semibold text-lg mb-4 text-gray-700">Payment Information</h2>

            {/* Payment Methods */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => handleChange('method', 'mastercard')}
                className={`border p-2 rounded-md ${
                  formData.method === 'mastercard' ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <img src="https://img.icons8.com/color/48/mastercard-logo.png" alt="Mastercard" className="w-8 h-8" />
              </button>
              <button
                onClick={() => handleChange('method', 'visa')}
                className={`border p-2 rounded-md ${
                  formData.method === 'visa' ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="w-8 h-8" />
              </button>
            </div>
            {errors.method && <p className="text-red-500 text-sm">{errors.method}</p>}

            {/* Form Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Name on card</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Shipping Address</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  placeholder="Street, City, ZIP Code"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  onBlur={() => handleBlur('address')}
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Card number</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => handleChange('cardNumber', e.target.value)}
                  onBlur={() => handleBlur('cardNumber')}
                />
                {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="sm:w-1/2">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Expiration</label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    placeholder="MM/YY"
                    value={formData.expiration}
                    onChange={(e) => handleChange('expiration', e.target.value)}
                    onBlur={() => handleBlur('expiration')}
                  />
                  {errors.expiration && <p className="text-red-500 text-sm">{errors.expiration}</p>}
                </div>
                <div className="sm:w-1/2">
                  <label className="block mb-1 text-sm font-medium text-gray-700">CVV</label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => handleChange('cvv', e.target.value)}
                    onBlur={() => handleBlur('cvv')}
                  />
                  {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4">
            <Link to="/cart" className="border bg-black text-white p-2 px-10 hover:bg-gray-500 rounded-full w-full sm:w-auto text-center">Back</Link>
            <button
              className="bg-black text-white p-2 px-6 rounded-full hover:bg-gray-500 w-full sm:w-auto"
              onClick={handleConfirm}
            >
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CheckoutPage;
