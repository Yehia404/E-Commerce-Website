import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import FilterPanel from "../components/filterpanel";
import "../styles/slider.css";

const products = [
  {
    id: 1,
    name: "Gradient Graphic T-shirt",
    description: "A trendy t-shirt perfect for parties and casual wear.",
    price: 145,
    discount: 20,
    images: ["img1.jpg", "img2.jpg", "img3.jpg"],
    sizes: [
      { size: "XS", stock: 2 },
      { size: "S", stock: 3 },
      { size: "M", stock: 1 },
      { size: "L", stock: 0 },
      { size: "XL", stock: 0 },
    ],
    style: "Casual",
    details: "Made of 100% cotton. Breathable, soft, and stylish.",
    reviews: [
      { user: "John", comment: "Great quality!", rating: 5 },
      { user: "Jane", comment: "Loved the color!", rating: 3 },
    ],
  },
  {
    id: 2,
    name: "Oversized Hoodie",
    description: "Comfortable oversized hoodie for casual wear.",
    price: 90,
    discount: 25,
    images: ["img1.jpg", "img2.jpg"],
    sizes: [
      { size: "M", stock: 2 },
      { size: "L", stock: 4 },
    ],
    style: "Gym",
    details: "Made of soft, high-quality fabric for all-day comfort.",
    reviews: [
      { user: "Alex", comment: "Love the hoodie!", rating: 4 },
      { user: "Sara", comment: "Very comfortable!", rating: 5 },
    ],
  },
];

const Shop = () => {
  const [priceRange, setPriceRange] = useState([50, 250]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

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

  // Calculate discounted price
  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount) / 100;
  };

  const filteredProducts = products
    .filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    .filter(
      (product) =>
        !selectedSize ||
        product.sizes.some((s) => s.size === selectedSize && s.stock > 0)
    )
    .filter(
      (product) =>
        selectedStyle.length === 0 ||
        selectedStyle.some((style) =>
          product.style.toLowerCase().includes(style.toLowerCase())
        )
    )
    .sort((a, b) => b.price - a.price);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

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
              {paginatedProducts.map((product) => {
                const discountedPrice = calculateDiscountedPrice(
                  product.price,
                  product.discount
                );
                const totalReviews = product.reviews.length;
                const averageRating =
                  product.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
                  totalReviews;

                return (
                  <div key={product.id} className="group">
                    <div className="w-full pb-[100%] relative mb-4">
                      <div className="absolute top-0 left-0 w-full h-full bg-gray-300 rounded-lg" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium">{product.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          ${discountedPrice.toFixed(2)}
                        </span>
                        {product.price !== discountedPrice && (
                          <span className="text-gray-500 line-through">
                            ${product.price}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(averageRating)
                                  ? "text-yellow-400"
                                  : i < averageRating
                                  ? "text-yellow-300"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-2">
                          ({totalReviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border bg-white disabled:opacity-50"
          >
            ←
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === index + 1 ? "bg-black text-white" : "bg-white"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border bg-white disabled:opacity-50"
          >
            →
          </button>
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
