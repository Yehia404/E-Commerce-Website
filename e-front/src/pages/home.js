import React from "react";
import { FaStar } from "react-icons/fa";
import Hero from "../assets/hero.jpg";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
const Home = () => {
  return (
    <div className="font-sans">
      {/* Top Discount Banner */}
      <div className="bg-black text-white text-sm text-center py-2">
        Sign up now to get 20% off your first order!{" "}
        <span className="underline cursor-pointer">Sign Up Now</span>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
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
          <button className="bg-black text-white px-12 py-2 rounded-full">
            Shop Now
          </button>
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

      {/* Brand Logos
      <div className="flex justify-around items-center py-6 bg-white border-y">
        {["VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein"].map(
          (brand, i) => (
            <span key={i} className="text-lg font-semibold">
              {brand}
            </span>
          )
        )}
      </div> */}

      {/* New Arrivals */}
      <section className="px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">NEW ARRIVALS</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[120, 240, 180, 130].map((price, i) => (
            <div key={i} className="border p-4 rounded-md">
              <div className="h-40 bg-gray-200 mb-4"></div>
              <p className="font-semibold">Item {i + 1}</p>
              <div className="flex items-center text-yellow-500 text-sm">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="font-bold">${price}</p>
            </div>
          ))}
        </div>
        <button className="block mt-6 mx-auto  bg-black text-white px-12 py-2 rounded-full">
          View All
        </button>
      </section>

      {/* Top Selling */}
      <section className="px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">TOP SELLING</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[212, 145, 80, 210].map((price, i) => (
            <div key={i} className="border p-4 rounded-md">
              <div className="h-40 bg-gray-200 mb-4"></div>
              <p className="font-semibold">Top Item {i + 1}</p>
              <div className="flex items-center text-yellow-500 text-sm">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="font-bold">${price}</p>
            </div>
          ))}
        </div>
        <button className="block mt-6 mx-auto  bg-black text-white px-12 py-2 rounded-full">
          View All
        </button>
      </section>

      {/* Browse by Dress Style */}
      <section className="bg-gray-100 px-6 py-10">
        <h2 className="text-2xl font-bold mb-6 text-center">
          BROWSE BY DRESS STYLE
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Casual", "Formal", "Party", "Gym"].map((style, i) => (
            <div
              key={i}
              className="h-40 bg-white rounded-md shadow-md flex items-center justify-center text-lg font-semibold"
            >
              {style}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-10">
        <h2 className="text-2xl font-bold mb-6 text-center">
          OUR HAPPY CUSTOMERS
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {["Sarah M.", "Alex K.", "James L."].map((name, i) => (
            <div key={i} className="border rounded-md p-4 bg-white">
              <div className="flex text-yellow-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="text-sm text-gray-600 mb-2">{name}</p>
              <p className="text-gray-700 text-sm">
                "I'm blown away by the quality and style of the clothes I
                received! Definitely exceeded my expectations."
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
