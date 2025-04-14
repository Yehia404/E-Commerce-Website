import React from "react";
import { Slider } from "antd";
import "../styles/slider.css";

const FilterPanel = ({
  priceRange,
  setPriceRange,
  selectedSize,
  handleSizeClick,
  selectedStyle,
  handleStyleClick,
}) => {
  const sizes = ["XS", "S", "M", "L", "XL", "2XL"];
  const dressStyles = ["Casual", "Formal", "Party", "Gym"];

  return (
    <div className="w-64 bg-white p-6 rounded-lg shadow-md">
      <h3 className="font-semibold mb-4">Filters</h3>

      {/* Price Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Price</h4>
        <Slider
          range
          min={50}
          max={250}
          step={5}
          value={priceRange}
          onChange={(value) => setPriceRange(value)}
          tipFormatter={(value) => `$${value}`}
          className="price-slider"
        />
        <div className="flex justify-between mt-2">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Size Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Size</h4>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              className={`px-2 py-1 border rounded-md text-sm ${
                size === selectedSize
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleSizeClick(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Style Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Dress Style</h4>
        <div className="grid grid-cols-3 gap-2">
          {dressStyles.map((style) => (
            <button
              key={style}
              className={`px-2 py-1 border rounded-md text-sm ${
                selectedStyle.includes(style)
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleStyleClick(style)}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
