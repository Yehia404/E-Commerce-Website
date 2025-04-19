import React, { useState, useEffect } from "react";
import { Modal, Table, Tag, message } from "antd";
import axios from "axios";

const ProdManage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    sizes: [],
    details: "",
    style: "",
  });
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const allowedSizes = ["XS", "S", "M", "L", "XL"];
  const allowedStyles = ["Casual", "Formal", "Party", "Sport"];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products/allproducts"
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  const showModal = (product = null) => {
    if (product) {
      setProduct(product);
      setIsEditMode(true);
    } else {
      resetForm();
      setIsEditMode(false);
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setProduct({
      name: "",
      description: "",
      price: "",
      image: "",
      sizes: [],
      details: "",
      style: "",
    });
    setErrors({});
    setBackendError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSizeToggle = (size) => {
    setProduct((prevProduct) => {
      const sizes = prevProduct.sizes.some((s) => s.size === size)
        ? prevProduct.sizes.filter((s) => s.size !== size)
        : [...prevProduct.sizes, { size, stock: 0 }];
      return { ...prevProduct, sizes };
    });
  };

  const validate = () => {
    let err = {};
    if (!product.name.trim()) err.name = "Product name is required.";
    if (!product.description.trim())
      err.description = "Description is required.";
    if (!product.price || isNaN(product.price) || Number(product.price) <= 0)
      err.price = "Valid price is required.";
    if (!product.sizes.length) err.sizes = "At least one size is required.";
    if (!product.details.trim()) err.details = "Details are required.";
    if (!product.image.trim()) err.image = "Image URL is required.";
    if (!product.style.trim()) err.style = "Style is required.";
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const finalProduct = {
      ...product,
      price: Number(product.price),
    };

    try {
      if (isEditMode) {
        await axios.put(
          `http://localhost:5000/api/products/${product.name}`,
          finalProduct
        );
        message.success("Product updated successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/products/addproduct",
          finalProduct
        );
        message.success("Product added successfully");
      }
      fetchProducts();
      resetForm();
      setIsModalVisible(false);
    } catch (err) {
      console.error("Error saving product:", err.response?.data || err.message);
      setBackendError(err.response?.data?.error || "An error occurred");
    }
  };

  const handleRemove = async (name) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${name}`);
      message.success("Product removed successfully");
      fetchProducts();
    } catch (err) {
      console.error(
        "Error removing product:",
        err.response?.data || err.message
      );
      message.error("Failed to remove product");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Price ($)",
      dataIndex: "price",
    },
    {
      title: "Sizes",
      dataIndex: "sizes",
      render: (sizes) =>
        sizes.map((size, idx) => (
          <Tag key={idx} color="blue">
            {size.size}
          </Tag>
        )),
    },
    {
      title: "Style",
      dataIndex: "style",
    },
    {
      title: "Details",
      dataIndex: "details",
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (img) => (
        <img
          src={img}
          alt="Product"
          style={{ width: 60, height: 60, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div className="flex space-x-2">
          <button
            onClick={() => showModal(record)}
            className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
          >
            Edit
          </button>
          <button
            onClick={() => handleRemove(record.name)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-3xl font-semibold mb-4">Product Management</h2>

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Product Catalog</h2>
        <Table
          columns={columns}
          dataSource={products.map((p, idx) => ({ ...p, key: p._id || idx }))}
          pagination={{ pageSize: 4 }}
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={() => showModal()}
            className="px-5 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Add Product
          </button>
        </div>
      </div>

      <Modal
        title={isEditMode ? "Edit Product" : "Add New Product"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {backendError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{backendError}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-2 text-sm">
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full mt-1 p-1 border rounded-sm"
              disabled={isEditMode} // Disable name editing in edit mode
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full mt-1 p-1 border rounded-sm"
            />
            {errors.description && (
              <p className="text-red-500 text-xs">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Price ($)</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full mt-1 p-1 border rounded-sm"
            />
            {errors.price && (
              <p className="text-red-500 text-xs">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Image URL</label>
            <input
              type="text"
              name="image"
              value={product.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full mt-1 p-1 border rounded-sm"
            />
            {errors.image && (
              <p className="text-red-500 text-xs">{errors.image}</p>
            )}
            {product.image && (
              <img
                src={product.image}
                alt="Preview"
                className="mt-2 w-24 h-24 object-cover rounded"
              />
            )}
          </div>

          <div>
            <label className="block font-medium">Sizes</label>
            <div className="flex items-center gap-2 mt-1">
              {allowedSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-3 py-1 rounded-sm ${
                    product.sizes.some((s) => s.size === size)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {errors.sizes && (
              <p className="text-red-500 text-xs">{errors.sizes}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Style</label>
            <select
              name="style"
              value={product.style}
              onChange={handleChange}
              className="w-full mt-1 p-1 border rounded-sm"
            >
              <option value="">Select a style</option>
              {allowedStyles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
            {errors.style && (
              <p className="text-red-500 text-xs">{errors.style}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Details</label>
            <textarea
              name="details"
              value={product.details}
              onChange={handleChange}
              className="w-full mt-1 p-1 border rounded-sm"
            />
            {errors.details && (
              <p className="text-red-500 text-xs">{errors.details}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-sm hover:bg-gray-800"
          >
            {isEditMode ? "Update Product" : "Save Product"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ProdManage;
