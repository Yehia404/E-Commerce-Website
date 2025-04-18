import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axios from "axios";

const Product = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewInput, setReviewInput] = useState({
    user: "",
    comment: "",
    rating: 5,
  });
  const [reviewErrors, setReviewErrors] = useState({
    user: "",
    comment: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        const product = response.data;

        // Repeat the single image URL to simulate multiple images
        const repeatedImages = Array(3).fill(product.image);

        setProductData({
          ...product,
          images: repeatedImages,
        });

        // Set the initial selected image
        setSelectedImage(repeatedImages[0]);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  if (!productData) {
    return <div>Loading...</div>;
  }

  const increaseQty = () => {
    if (quantity < 3) setQuantity(quantity + 1);
  };

  const decreaseQty = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }

    console.log("Added to cart:", {
      product: productData.name,
      size: selectedSize,
      quantity,
    });

    alert(`Added ${quantity} item(s) of size ${selectedSize} to cart!`);
  };

  const discountedPrice = productData.discount
    ? productData.price - (productData.price * productData.discount) / 100
    : productData.price;

  const avgRating =
    productData.reviews.length > 0
      ? productData.reviews.reduce((acc, r) => acc + r.rating, 0) /
        productData.reviews.length
      : 0;

  const totalStock = productData.sizes.reduce(
    (acc, size) => acc + size.stock,
    0
  );
  const lowStockThreshold = 10;
  const isLowStock = totalStock < lowStockThreshold;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    let errors = { user: "", comment: "" };

    // Validate inputs
    if (!reviewInput.user) {
      errors.user = "Name is required.";
    }
    if (!reviewInput.comment) {
      errors.comment = "Review comment is required.";
    }

    // If there are errors, don't submit the form
    if (errors.user || errors.comment) {
      setReviewErrors(errors);
      return;
    }

    try {
      // Send the review to the backend
      const response = await axios.post(
        `http://localhost:5000/api/products/${id}/reviews`,
        reviewInput
      );

      // Update the product data with the new review
      setProductData(response.data);
      setShowReviewForm(false); // Close the modal
      setReviewInput({
        user: "",
        comment: "",
        rating: 5,
      });
      setReviewErrors({
        user: "",
        comment: "",
      }); // Reset error messages
      alert("Review submitted!");
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-10">
        {/* Image Section */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-4">
            {productData.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Thumbnail ${i}`}
                className={`w-16 h-16 object-cover cursor-pointer border ${
                  selectedImage === img ? "border-black" : "border-gray-300"
                } sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
          <img
            src={selectedImage}
            alt="Selected"
            className="w-full sm:w-[300px] md:w-[350px] lg:w-[400px] lg:h-[400px] h-auto object-cover rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-6">
          <h2 className="text-2xl font-bold">{productData.name}</h2>
          <p className="text-gray-600">{productData.description}</p>

          <div className="flex items-center gap-2 mt-2">
            <div className="text-yellow-500 text-lg leading-none">
              {"★".repeat(Math.round(avgRating))}
              {"☆".repeat(5 - Math.round(avgRating))}
            </div>
            <span className="text-sm text-gray-600">
              {avgRating.toFixed(1)}/5
            </span>
          </div>

          <p className="text-xl font-semibold text-black flex items-center gap-3">
            {productData.discount > 0 && (
              <span className="line-through text-gray-500">
                ${productData.price.toFixed(2)}
              </span>
            )}
            <span>${discountedPrice.toFixed(2)}</span>
            {productData.discount > 0 && (
              <span className="text-red-500 text-sm">
                ({productData.discount}% OFF)
              </span>
            )}
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-medium">Size:</span>
            {productData.sizes.map(({ size, stock }) => (
              <button
                key={size}
                disabled={stock === 0}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded-md ${
                  selectedSize === size
                    ? "bg-black text-white"
                    : "bg-white text-black"
                } ${
                  stock === 0
                    ? "opacity-50 line-through cursor-not-allowed"
                    : ""
                }`}
              >
                {size}
              </button>
            ))}
            {isLowStock && (
              <div className="ml-4 p-2 text-red-500 bg-red-100 rounded-full text-xs font-semibold">
                Low Stock
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="font-medium">Quantity:</span>
            <button
              onClick={decreaseQty}
              className="px-3 py-1 border rounded-md text-lg"
            >
              −
            </button>
            <span>{quantity}</span>
            <button
              onClick={increaseQty}
              className="px-3 py-1 border rounded-md text-lg"
              disabled={quantity === 3}
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="px-6 py-3 bg-black text-white rounded-md"
          >
            Add to Cart
          </button>

          <div className="mt-8">
            <div className="flex border-b mb-4">
              {["details", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium border-b-2 ${
                    activeTab === tab
                      ? "border-black text-black"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  {tab === "details" ? "Product Details" : "Reviews"}
                </button>
              ))}
            </div>

            <div>
              {activeTab === "details" && (
                <p className="text-gray-700">{productData.details}</p>
              )}
              {activeTab === "reviews" && (
                <div className="space-y-4">
                  {/* Display Reviews */}
                  {productData.reviews.map((review, i) => (
                    <div key={i} className="border-b pb-2">
                      <p className="font-semibold">{review.user}</p>
                      <div className="flex text-yellow-500 text-sm">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                        ))}
                      </div>
                      <p>{review.comment}</p>
                    </div>
                  ))}

                  {/* Write Review Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="mt-4 text-sm text-white bg-black px-4 py-2 rounded-md hover:bg-gray-800"
                    >
                      Write a Review
                    </button>
                  </div>

                  {/* Modal for Review Form */}
                  {showReviewForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-lg">
                        {/* Close Button */}
                        <button
                          onClick={() => setShowReviewForm(false)}
                          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
                        >
                          &times;
                        </button>

                        <h3 className="text-lg font-semibold mb-4">
                          Write a Review
                        </h3>

                        <form
                          onSubmit={handleReviewSubmit}
                          className="space-y-4"
                        >
                          <input
                            type="text"
                            placeholder="Your Name"
                            value={reviewInput.user}
                            onChange={(e) =>
                              setReviewInput({
                                ...reviewInput,
                                user: e.target.value,
                              })
                            }
                            className="w-full border rounded-md p-2"
                          />
                          {/* Error message for user */}
                          {reviewErrors.user && (
                            <p className="text-red-500 text-sm">
                              {reviewErrors.user}
                            </p>
                          )}

                          <textarea
                            placeholder="Your Review"
                            value={reviewInput.comment}
                            onChange={(e) =>
                              setReviewInput({
                                ...reviewInput,
                                comment: e.target.value,
                              })
                            }
                            className="w-full border rounded-md p-2"
                          />
                          {/* Error message for comment */}
                          {reviewErrors.comment && (
                            <p className="text-red-500 text-sm">
                              {reviewErrors.comment}
                            </p>
                          )}

                          <select
                            value={reviewInput.rating}
                            onChange={(e) =>
                              setReviewInput({
                                ...reviewInput,
                                rating: e.target.value,
                              })
                            }
                            className="w-full border rounded-md p-2"
                          >
                            {[5, 4, 3, 2, 1].map((r) => (
                              <option key={r} value={r}>
                                {r} Star{r > 1 ? "s" : ""}
                              </option>
                            ))}
                          </select>

                          <button
                            type="submit"
                            className="w-full mt-4 py-2 text-white bg-black rounded-md"
                          >
                            Submit Review
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Product;
