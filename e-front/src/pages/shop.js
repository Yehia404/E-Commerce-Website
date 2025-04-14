import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import FilterPanel from "../components/filterpanel";
import "../styles/slider.css";

// Updated products with size and style
const products = [
  {
    id: 1,
    name: "Gradient Graphic T-shirt",
    price: 145,
    originalPrice: 160,
    rating: 4.5,
    reviews: 180,
    size: "M",
    style: "Party",
  },
  {
    id: 2,
    name: "Oversized Hoodie",
    price: 90,
    originalPrice: 120,
    rating: 4.2,
    reviews: 132,
    size: "L",
    style: "Gym",
  },
  {
    id: 3,
    name: "Slim Fit Jeans",
    price: 110,
    originalPrice: 140,
    rating: 4.8,
    reviews: 98,
    size: "S",
    style: "Casual",
  },
  {
    id: 4,
    name: "Cotton Shirt",
    price: 75,
    originalPrice: 95,
    rating: 4.0,
    reviews: 65,
    size: "M",
    style: "Formal",
  },
  {
    id: 5,
    name: "Denim Jacket",
    price: 130,
    originalPrice: 160,
    rating: 4.6,
    reviews: 240,
    size: "XL",
    style: "Casual",
  },
];

const Shop = () => {
  const [priceRange, setPriceRange] = useState([50, 250]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSizeClick = (size) => {
    setSelectedSize(size === selectedSize ? null : size);
  };

  const handleStyleClick = (style) => {
    setSelectedStyle((prevStyles) =>
      prevStyles.includes(style)
        ? prevStyles.filter((s) => s !== style)
        : [...prevStyles, style]
    );
  };

  const filteredProducts = products
    .filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    .filter((product) => !selectedSize || product.size === selectedSize)
    .filter(
      (product) =>
        selectedStyle.length === 0 ||
        selectedStyle.some((style) =>
          product.style.toLowerCase().includes(style.toLowerCase())
        )
    )
    .sort((a, b) => b.price - a.price);

  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile Filters Button */}
        <div className="block md:hidden mb-4">
          <button
            onClick={() => setShowFilters(true)}
            className="px-4 py-2 bg-black text-white rounded-md"
          >
            Filters
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block">
            <FilterPanel
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedSize={selectedSize}
              handleSizeClick={handleSizeClick}
              selectedStyle={selectedStyle}
              handleStyleClick={handleStyleClick}
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group">
                  <div className="w-full pb-[100%] relative mb-4">
                    <div className="absolute top-0 left-0 w-full h-full bg-gray-300 rounded-lg" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 fill-current ${
                              i < Math.floor(product.rating)
                                ? "text-yellow-400"
                                : i < product.rating
                                ? "text-yellow-300"
                                : "text-gray-300"
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.148c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.95c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.286-3.95a1 1 0 00-.364-1.118l-3.36-2.44c-.783-.57-.38-1.81.588-1.81h4.148a1 1 0 00.951-.69l1.285-3.95z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">
                        ({product.reviews})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      {showFilters && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center md:hidden">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md max-h-[90vh] overflow-y-auto shadow-xl relative">
            <button
              onClick={() => setShowFilters(false)}
              className="absolute top-3 right-3 text-gray-500 text-xl"
            >
              ✕
            </button>
            <FilterPanel
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedSize={selectedSize}
              handleSizeClick={handleSizeClick}
              selectedStyle={selectedStyle}
              handleStyleClick={handleStyleClick}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Shop;
