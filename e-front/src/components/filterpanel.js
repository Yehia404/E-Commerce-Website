import React from "react";

const FilterPanel = ({
  selectedSize,
  handleSizeClick,
  selectedStyle,
  handleStyleClick,
  selectedGender,
  handleGenderClick,
}) => {
  const sizes = ["XS", "S", "M", "L", "XL", "2XL"];
  const dressStyles = ["Casual", "Formal", "Party", "Sport"];
  const genders = ["Men", "Women", "Unisex"];

  return (
    <div className="w-64 bg-white p-6 rounded-lg shadow-md">
      <h3 className="font-semibold mb-4">Filters</h3>

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

      {/* Gender Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Gender</h4>
        <div className="grid grid-cols-3 gap-2">
          {genders.map((gender) => (
            <button
              key={gender}
              className={`px-2 py-1 border rounded-md text-sm ${
                selectedGender === gender
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleGenderClick(gender)}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
