import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import Hero from "../assets/hero.jpg";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useUser } from "../context/usercontext";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [collection, setCollection] = useState([]);
  const [topReviews, setTopReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useUser();

  useEffect(() => {
    // Check if we have a successful order state and show toast
    if (location.state?.showToast) {
      toast.success("Your order has been placed successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Clear the state after showing the toast
      window.history.replaceState({}, document.title);
    }

    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products/newarrivals"
        );
        // Filter products where available is true
        const availableProducts = response.data.filter(
          (product) => product.available
        );
        setNewArrivals(availableProducts.slice(0, 4));
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      }
    };

    const fetchCollection = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products/collection"
        );
        // Filter products where available is true
        const availableProducts = response.data.filter(
          (product) => product.available
        );
        setCollection(availableProducts.slice(0, 4));
      } catch (error) {
        console.error("Error fetching collection items:", error);
      }
    };

    fetchNewArrivals();
    fetchCollection();
  }, [location.state]);

  useEffect(() => {
    const aggregateReviews = () => {
      const allReviews = collection
        .flatMap((product) => product.reviews || []) // Ensure reviews is an array
        .sort((a, b) => b.rating - a.rating);

      setTopReviews(allReviews.slice(0, 6)); // Get top 6 reviews
    };

    aggregateReviews();
  }, [collection]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (topReviews.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % topReviews.length);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [topReviews]);

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      if (topReviews.length > 0) {
        visible.push(topReviews[(currentIndex + i) % topReviews.length]);
      }
    }
    return visible;
  };

  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount) / 100;
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };

  return (
    <div className="font-sans">
      <ToastContainer />
      {!isLoggedIn && (
        <div className="bg-black text-white text-sm text-center py-2">
          Sign up now to get 20% off your first order!{" "}
          <Link to="/register" className="underline cursor-pointer">
            Sign Up Now
          </Link>
        </div>
      )}

      <Navbar />

      {/* Hero Section - Responsive with image behind text on mobile */}
      <section className="relative">
        {/* Background Image for Mobile and Tablet */}
        <div className="lg:hidden w-full h-[500px] relative">
          <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
          <img src={Hero} alt="hero" className="w-full h-full object-cover" />
        </div>

        {/* Content that sits on top of the background on mobile/tablet */}
        <div className="lg:hidden absolute inset-0 z-20 flex flex-col justify-center px-6 py-12">
          <div className="text-white space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Find Clothes That Matches <br /> Your Style
            </h1>
            <p className="text-gray-200">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense
              of style.
            </p>

            <div>
              <Link
                to="/shop"
                className="inline-block bg-black text-white px-12 py-2 rounded-full border border-white"
              >
                Shop Now
              </Link>
            </div>

            <div className="flex gap-6 pt-4">
              <div>
                <p className="font-bold text-lg">200+</p>
                <p className="text-sm">International Brands</p>
              </div>
              <div>
                <p className="font-bold text-lg">2,000+</p>
                <p className="text-sm">High-Quality Products</p>
              </div>
              <div>
                <p className="font-bold text-lg">30,000+</p>
                <p className="text-sm">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout with side-by-side content and image */}
        <div className="hidden lg:flex bg-gray-100 justify-between items-center px-6 py-12">
          <div className="w-1/2 space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Find Clothes That Matches <br /> Your Style
            </h1>
            <p className="text-gray-600">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense
              of style.
            </p>

            <div>
              <Link
                to="/shop"
                className="bg-black text-white px-12 py-2 rounded-full inline-block"
              >
                Shop Now
              </Link>
            </div>

            <div className="flex gap-6 pt-4">
              <div>
                <p className="font-bold text-lg">200+</p>
                <p className="text-sm">International Brands</p>
              </div>
              <div>
                <p className="font-bold text-lg">2,000+</p>
                <p className="text-sm">High-Quality Products</p>
              </div>
              <div>
                <p className="font-bold text-lg">30,000+</p>
                <p className="text-sm">Happy Customers</p>
              </div>
            </div>
          </div>
          <div className="w-1/2">
            <img src={Hero} alt="hero" className="rounded-xl" />
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">NEW ARRIVALS</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.map((item) => {
            const discountedPrice = calculateDiscountedPrice(
              item.price,
              item.discount
            );
            const averageRating = calculateAverageRating(item.reviews);

            return (
              <div
                key={item._id}
                className="border p-3 md:p-4 rounded-md cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                <div className="relative pb-[100%] mb-3 md:mb-4 overflow-hidden rounded-md">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute h-full w-full object-cover"
                  />
                </div>
                <p className="font-semibold text-sm md:text-base line-clamp-1">
                  {item.name}
                </p>
                <div className="flex items-center text-yellow-500 text-xs md:text-sm">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < Math.floor(averageRating)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm md:text-base">
                  <span className="font-bold">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  {item.price !== discountedPrice && (
                    <span className="text-gray-500 line-through text-xs md:text-sm">
                      ${item.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => navigate("/shop")}
          className="block mt-6 mx-auto bg-black text-white px-10 md:px-12 py-2 rounded-full"
        >
          View All
        </button>
      </section>

      <section className="px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">COLLECTION</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {collection.map((item) => {
            const discountedPrice = calculateDiscountedPrice(
              item.price,
              item.discount
            );
            const averageRating = calculateAverageRating(item.reviews);

            return (
              <div
                key={item._id}
                className="border p-3 md:p-4 rounded-md cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                <div className="relative pb-[100%] mb-3 md:mb-4 overflow-hidden rounded-md">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute h-full w-full object-cover"
                  />
                </div>
                <p className="font-semibold text-sm md:text-base line-clamp-1">
                  {item.name}
                </p>
                <div className="flex items-center text-yellow-500 text-xs md:text-sm">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < Math.floor(averageRating)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm md:text-base">
                  <span className="font-bold">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  {item.price !== discountedPrice && (
                    <span className="text-gray-500 line-through text-xs md:text-sm">
                      ${item.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => navigate("/shop")}
          className="block mt-6 mx-auto bg-black text-white px-10 md:px-12 py-2 rounded-full"
        >
          View All
        </button>
      </section>

      <section className="px-6 py-10">
        <h2 className="text-2xl font-bold mb-6 text-center">
          OUR HAPPY CUSTOMERS
        </h2>
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 transition-all duration-500 ease-in-out">
          {getVisibleTestimonials().map(
            (review, i) =>
              review && (
                <div
                  key={i}
                  className="border rounded-md p-4 bg-white shadow-md"
                >
                  <div className="flex text-yellow-500 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < review.rating
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{review.user}</p>
                  <p className="text-gray-700 text-sm">"{review.comment}"</p>
                </div>
              )
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
