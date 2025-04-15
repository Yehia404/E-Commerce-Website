// src/pages/Product.jsx
import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import img1 from "../assets/casual.jpg";
import img2 from "../assets/hero.jpg";
import img3 from "../assets/casual.jpg";

const productData = {
  name: "Gradient Graphic T-shirt",
  description: "A trendy t-shirt perfect for parties and casual wear.",
  price: 145,
  discount: 20,
  images: [img1, img2, img3],
  sizes: [
    { size: "XS", stock: 2 },
    { size: "S", stock: 3 },
    { size: "M", stock: 1 },
    { size: "L", stock: 0 },
    { size: "XL", stock: 0 },
  ],
  details: "Made of 100% cotton. Breathable, soft, and stylish.",
  reviews: [
    { user: "John", comment: "Great quality!", rating: 5 },
    { user: "Jane", comment: "Loved the color!", rating: 3 },
  ],
};

const Product = () => {
  const [selectedImage, setSelectedImage] = useState(productData.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

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
    productData.reviews.reduce((acc, r) => acc + r.rating, 0) /
    productData.reviews.length;

  const totalStock = productData.sizes.reduce(
    (acc, size) => acc + size.stock,
    0
  );
  const lowStockThreshold = 10;
  const isLowStock = totalStock < lowStockThreshold;

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
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
          <img
            src={selectedImage}
            alt="Selected"
            className="w-[400px] h-[400px] object-cover rounded-lg"
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
