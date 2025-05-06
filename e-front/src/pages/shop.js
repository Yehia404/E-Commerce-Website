import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import FilterPanel from "../components/filterpanel";
import axios from "axios";
import "../styles/slider.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState([]);
  const [selectedGender, setSelectedGender] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("lowToHigh");
  const [search, setSearch] = useState("");
  const productsPerPage = 4;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const gender = queryParams.get("gender");
    const style = queryParams.get("style");
    setSearch(queryParams.get("search"));

    if (location.pathname === "/shop" && !gender && !style && !search) {
      setSelectedSize(null);
      setSelectedStyle([]);
      setSelectedGender(null);
    } else {
      if (gender) {
        setSelectedGender(gender);
      }
      if (style) {
        setSelectedStyle([style.charAt(0).toUpperCase() + style.slice(1)]);
      }
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products/allproducts"
        );
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.pathname, location.search]);

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

  const handleGenderClick = (gender) => {
    setSelectedGender(gender === selectedGender ? null : gender);
  };

  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount) / 100;
  };

  // Use the search variable here
  const filteredProducts = products
    .filter((product) => product.available === true) // Only show products that are available
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
    .filter(
      (product) =>
        !selectedGender ||
        product.gender.toLowerCase() === selectedGender.toLowerCase()
    )
    .filter(
      (product) =>
        !search || // Ensure search is used within the same scope
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "lowToHigh" ? a.price - b.price : b.price - a.price
    );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="block md:hidden mb-4">
          <button
            onClick={() => setShowFilters(true)}
            className="px-4 py-2 bg-black text-white rounded-md"
          >
            Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="hidden md:block">
            <FilterPanel
              selectedSize={selectedSize}
              handleSizeClick={handleSizeClick}
              selectedStyle={selectedStyle}
              handleStyleClick={handleStyleClick}
              selectedGender={selectedGender}
              handleGenderClick={handleGenderClick}
            />
          </div>

          <div className="flex-1 w-full">
            {loading ? (
              <div>Loading products...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div>
                <div className="flex justify-end mb-4">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="px-4 py-2 border rounded-md bg-white"
                  >
                    <option value="lowToHigh">Price: Low to High</option>
                    <option value="highToLow">Price: High to Low</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => {
                    const discountedPrice = calculateDiscountedPrice(
                      product.price,
                      product.discount
                    );
                    const totalReviews = product.reviews.length;
                    const averageRating =
                      product.reviews.reduce(
                        (acc, curr) => acc + curr.rating,
                        0
                      ) / totalReviews;

                    return (
                      <div
                        key={product._id}
                        className="group cursor-pointer"
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        <div className="w-full pb-[100%] relative mb-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                          />
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
            )}
          </div>
        </div>

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
              selectedSize={selectedSize}
              handleSizeClick={handleSizeClick}
              selectedStyle={selectedStyle}
              handleStyleClick={handleStyleClick}
              selectedGender={selectedGender}
              handleGenderClick={handleGenderClick}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Shop;
