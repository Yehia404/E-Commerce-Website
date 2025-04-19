import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import Hero from "../assets/hero.jpg";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const testimonials = [
  {
    name: "Sarah M.",
    message:
      "I'm blown away by the quality and style of the clothes I received! Definitely exceeded my expectations.",
  },
  {
    name: "Alex K.",
    message:
      "Great customer service and fast delivery. The clothes fit perfectly and look amazing.",
  },
  {
    name: "James L.",
    message:
      "Affordable prices for top-notch quality. I will definitely be shopping here again!",
  },
  {
    name: "Emma W.",
    message: "Stylish and comfy – my new go-to clothing brand!",
  },
  {
    name: "Liam G.",
    message:
      "Fast shipping and excellent customer support. Highly recommended!",
  },
  {
    name: "Olivia B.",
    message: "Loved the entire experience, from browsing to delivery!",
  },
];

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [collection, setCollection] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products/newarrivals"
        );
        setNewArrivals(response.data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      }
    };

    const fetchCollection = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products/collection"
        );
        setCollection(response.data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching collection items:", error);
      }
    };

    fetchNewArrivals();
    fetchCollection();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount) / 100;
  };

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };

  return (
    <div className="font-sans">
      <ToastContainer />
      <div className="bg-black text-white text-sm text-center py-2">
        Sign up now to get 20% off your first order!{" "}
        <span className="underline cursor-pointer">Sign Up Now</span>
      </div>

      <Navbar />

      <section className="bg-gray-100 py-12 px-6 lg:flex justify-between items-center">
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Find Clothes That Matches <br /> Your Style
          </h1>
          <p className="text-gray-600">
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>

          <div>
            <Link
              to="/shop"
              className="bg-black text-white px-12 py-2 rounded-full"
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
        <div className="hidden lg:block lg:w-1/2">
          <img src={Hero} alt="hero" className="rounded-xl" />
        </div>
      </section>

      <section className="px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">NEW ARRIVALS</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {newArrivals.map((item) => {
            const discountedPrice = calculateDiscountedPrice(
              item.price,
              item.discount
            );
            const averageRating = calculateAverageRating(item.reviews);

            return (
              <div
                key={item._id}
                className="border p-4 rounded-md cursor-pointer"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                <div className="relative pb-[100%] mb-4 overflow-hidden rounded-md">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute h-full w-full object-cover"
                  />
                </div>
                <p className="font-semibold">{item.name}</p>
                <div className="flex items-center text-yellow-500 text-sm">
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
                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  {item.price !== discountedPrice && (
                    <span className="text-gray-500 line-through">
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
          className="block mt-6 mx-auto bg-black text-white px-12 py-2 rounded-full"
        >
          View All
        </button>
      </section>

      <section className="px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">COLLECTION</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {collection.map((item) => {
            const discountedPrice = calculateDiscountedPrice(
              item.price,
              item.discount
            );
            const averageRating = calculateAverageRating(item.reviews);

            return (
              <div
                key={item._id}
                className="border p-4 rounded-md cursor-pointer"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                <div className="relative pb-[100%] mb-4 overflow-hidden rounded-md">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute h-full w-full object-cover"
                  />
                </div>
                <p className="font-semibold">{item.name}</p>
                <div className="flex items-center text-yellow-500 text-sm">
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
                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  {item.price !== discountedPrice && (
                    <span className="text-gray-500 line-through">
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
          className="block mt-6 mx-auto bg-black text-white px-12 py-2 rounded-full"
        >
          View All
        </button>
      </section>

      <section className="bg-gray-100 px-6 py-10">
        <h2 className="text-2xl font-bold mb-6 text-center">
          BROWSE BY DRESS STYLE
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Casual", "Formal", "Party", "Sport"].map((style, i) => (
            <div
              key={i}
              className="relative group h-40 bg-cover bg-center rounded-md shadow-md"
              style={{
                backgroundImage: `url(${require(`../assets/casual.jpg`)})`,
              }}
              onClick={() => navigate(`/shop?style=${style.toLowerCase()}`)}
            >
              <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-30 transition-all duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button className="bg-black text-white px-6 py-2 rounded-full shadow-md">
                  Shop Now
                </button>
              </div>
              <p className="absolute bottom-4 left-4 text-2xl font-semibold text-white">
                {style}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-10">
        <h2 className="text-2xl font-bold mb-6 text-center">
          OUR HAPPY CUSTOMERS
        </h2>
        <div className="grid md:grid-cols-3 gap-6 transition-all duration-500 ease-in-out">
          {getVisibleTestimonials().map((t, i) => (
            <div key={i} className="border rounded-md p-4 bg-white shadow-md">
              <div className="flex text-yellow-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="text-sm text-gray-600 mb-2">{t.name}</p>
              <p className="text-gray-700 text-sm">"{t.message}"</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
