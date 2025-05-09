import React, { useState, useEffect } from "react";
import {
  Modal,
  Table,
  Tag,
  message,
  Button,
  Dropdown,
  Space,
  Spin,
} from "antd";
import axios from "axios";
import { useUser } from "../context/usercontext";
import {
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";

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
    gender: "",
  });
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const { token } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const allowedSizes = ["XS", "S", "M", "L", "XL"];
  const allowedStyles = ["Casual", "Formal", "Party", "Sport"];
  const allowedGenders = ["Men", "Women", "Unisex"];

  // Track window resize for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search text
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchText.toLowerCase()) ||
        product.description.toLowerCase().includes(searchText.toLowerCase()) ||
        product.style.toLowerCase().includes(searchText.toLowerCase()) ||
        product.gender.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredProducts(filtered);
  }, [searchText, products]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products/allproducts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
      message.error("Failed to load products");
    } finally {
      setLoading(false);
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
      gender: "",
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      message.error("Only image files are allowed!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      message.error("File size must be less than 5MB!");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setProduct((prev) => ({
      ...prev,
      image: file,
      preview: previewUrl,
    }));
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
    if (!product.style.trim()) err.style = "Style is required.";
    if (!product.gender.trim()) err.gender = "Gender is required.";
    if (!product.image && !isEditMode) {
      err.image = "Image is required.";
    }

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSaving(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("details", product.details);
    formData.append("style", product.style);
    formData.append("gender", product.gender);
    formData.append("sizes", JSON.stringify(product.sizes));

    if (product.image instanceof File) {
      formData.append("image", product.image);
    } else if (typeof product.image === "string") {
      formData.append("image", product.image);
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (isEditMode) {
        await axios.put(
          `http://localhost:5000/api/products/${product.name}`,
          formData,
          config
        );
        message.success("Product updated successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/products/addproduct",
          formData,
          config
        );
        message.success("Product added successfully");
      }

      fetchProducts();
      resetForm();
      setIsModalVisible(false);
    } catch (err) {
      console.error("Error saving product:", err.response?.data || err.message);
      setBackendError(err.response?.data?.error || "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async (name) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${name}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  // Mobile-specific action menu item
  const getActionMenu = (record) => ({
    items: [
      {
        key: "1",
        label: "Edit",
        icon: <EditOutlined />,
        onClick: () => showModal(record),
      },
      {
        key: "2",
        label: "Remove",
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => handleRemove(record.name),
      },
    ],
  });

  // Dynamic columns based on screen size
  const getColumns = () => {
    // Mobile columns (simplified)
    if (windowWidth < 768) {
      return [
        {
          title: "Product",
          key: "product",
          render: (_, record) => (
            <div className="flex items-center space-x-2">
              <img
                src={record.image}
                alt={record.name}
                className="w-12 h-12 rounded object-cover"
              />
              <div>
                <div className="font-semibold">{record.name}</div>
                <div className="text-xs text-gray-600">${record.price}</div>
                <div className="text-xs mt-1">
                  {record.sizes.slice(0, 3).map((s, idx) => (
                    <Tag key={idx} color="blue" className="mr-1">
                      {s.size}
                    </Tag>
                  ))}
                  {record.sizes.length > 3 && (
                    <Tag>+{record.sizes.length - 3}</Tag>
                  )}
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Actions",
          key: "action",
          width: 50,
          render: (_, record) => (
            <Dropdown menu={getActionMenu(record)} trigger={["click"]}>
              <Button type="text" icon={<EllipsisOutlined />} />
            </Dropdown>
          ),
        },
      ];
    }

    // Tablet columns
    if (windowWidth < 1024) {
      return [
        {
          title: "Name",
          dataIndex: "name",
          ellipsis: true,
        },
        {
          title: "Price ($)",
          dataIndex: "price",
          width: 80,
        },
        {
          title: "Sizes",
          dataIndex: "sizes",
          render: (sizes) =>
            sizes.map((size, idx) => (
              <Tag key={idx} color="blue" className="mr-1 mb-1">
                {size.size}
              </Tag>
            )),
        },
        {
          title: "Image",
          dataIndex: "image",
          width: 80,
          render: (img) => (
            <img
              src={img}
              alt="Product"
              style={{ width: 50, height: 50, objectFit: "cover" }}
              className="rounded"
            />
          ),
        },
        {
          title: "Actions",
          width: 120,
          render: (_, record) => (
            <Space>
              <Button
                type="primary"
                size="small"
                onClick={() => showModal(record)}
                className="bg-black"
              >
                Edit
              </Button>
              <Button
                danger
                size="small"
                onClick={() => handleRemove(record.name)}
              >
                Delete
              </Button>
            </Space>
          ),
        },
      ];
    }

    // Desktop columns (full)
    return [
      {
        title: "Name",
        dataIndex: "name",
        ellipsis: true,
      },
      {
        title: "Description",
        dataIndex: "description",
        ellipsis: true,
      },
      {
        title: "Price ($)",
        dataIndex: "price",
        width: 80,
      },
      {
        title: "Sizes",
        dataIndex: "sizes",
        render: (sizes) =>
          sizes.map((size, idx) => (
            <Tag key={idx} color="blue" className="mr-1 mb-1">
              {size.size}
            </Tag>
          )),
      },
      {
        title: "Style",
        dataIndex: "style",
      },
      {
        title: "Gender",
        dataIndex: "gender",
      },
      {
        title: "Image",
        dataIndex: "image",
        render: (img) => (
          <img
            src={img}
            alt="Product"
            style={{ width: 60, height: 60, objectFit: "cover" }}
            className="rounded"
          />
        ),
      },
      {
        title: "Actions",
        render: (_, record) => (
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
  };

  return (
    <div className="bg-gray-50 md:bg-transparent">
      <div className="mb-4">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">
          Product Management
        </h2>
        <p className="text-gray-600">Manage your product catalog</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Search and Filter Bar */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => showModal()}
                className="inline-flex items-center gap-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <PlusOutlined />{" "}
                <span className="hidden md:inline">Add Product</span>
                <span className="md:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 flex justify-center">
              <Spin size="large" />
            </div>
          ) : (
            <Table
              columns={getColumns()}
              dataSource={filteredProducts.map((p, idx) => ({
                ...p,
                key: p._id || idx,
              }))}
              pagination={{
                pageSize: windowWidth < 768 ? 8 : 5,
                simple: windowWidth < 768,
                position: ["bottomCenter"],
              }}
              scroll={{ x: windowWidth < 768 ? 400 : "max-content" }}
              size={windowWidth < 768 ? "small" : "middle"}
              locale={{ emptyText: "No products found" }}
              className="ant-table-striped"
            />
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      <Modal
        title={isEditMode ? "Edit Product" : "Add New Product"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={windowWidth < 768 ? "95%" : 520}
        centered
        destroyOnClose={true}
      >
        {backendError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{backendError}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              disabled={isEditMode}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              rows={3}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium">Price ($)</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block font-medium">Style</label>
              <select
                name="style"
                value={product.style}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              >
                <option value="">Select a style</option>
                {allowedStyles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
              {errors.style && (
                <p className="text-red-500 text-xs mt-1">{errors.style}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block font-medium">Gender</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {allowedGenders.map((gender) => (
                <label key={gender} className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={product.gender === gender}
                    onChange={handleChange}
                    className="mr-1"
                  />
                  {gender}
                </label>
              ))}
            </div>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Sizes</label>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {allowedSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-3 py-1 rounded ${
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
              <p className="text-red-500 text-xs mt-1">{errors.sizes}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Details</label>
            <textarea
              name="details"
              value={product.details}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              rows={3}
            />
            {errors.details && (
              <p className="text-red-500 text-xs mt-1">{errors.details}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-2">Product Image</label>
            <div className="flex items-center gap-3">
              {(product.preview || product.image) && (
                <img
                  src={product.preview || product.image}
                  alt="Product preview"
                  className="w-20 h-20 object-cover rounded"
                />
              )}
              <label className="flex-1 flex flex-col items-center cursor-pointer py-2 px-4 border-2 border-dashed border-gray-300 rounded hover:bg-gray-50">
                <span className="text-center text-gray-600">
                  {product.image ? "Change Image" : "Upload Image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isSaving}
                />
              </label>
            </div>
            {errors.image && (
              <p className="text-red-500 text-xs mt-1">{errors.image}</p>
            )}
          </div>

          <div className="pt-3 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="mt-2 sm:mt-0 py-2 px-4 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="py-2 px-4 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
            >
              {isSaving
                ? "Saving..."
                : isEditMode
                ? "Update Product"
                : "Add Product"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProdManage;
