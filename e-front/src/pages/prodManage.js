import React, { useState } from "react";
import { Modal, Table, Tag } from "antd";

const dummyProducts = [
  {
    key: "1",
    name: "Gradient Graphic T-shirt",
    description: "A trendy t-shirt perfect for parties and casual wear.",
    price: 145,
    sizes: ["XS", "S", "M", "L", "XL"],
    details: "Made of 100% cotton. Breathable, soft, and stylish.",
  },
  {
    key: "2",
    name: "Denim Jacket",
    description: "Classic and rugged. Ideal for winter layering.",
    price: 220,
    sizes: ["S", "M", "L"],
    details: "High-quality denim with fleece lining.",
  },
];

const ProdManage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [products, setProducts] = useState(dummyProducts);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    images: [],
    sizes: [],
    details: "",
  });
  const [errors, setErrors] = useState({});
  const [sizeInput, setSizeInput] = useState("");

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => {
    setIsModalVisible(false);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProduct({ ...product, images: files });
  };

  const handleAddSize = () => {
    const allowedSizes = ["XS", "S", "M", "L", "XL"];
    const size = sizeInput.trim().toUpperCase();

    if (size && allowedSizes.includes(size)) {
      const alreadyAdded = product.sizes.some((s) => s.size === size);
      if (!alreadyAdded) {
        setProduct({
          ...product,
          sizes: [...product.sizes, { size }],
        });
      }
    }

    setSizeInput("");
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
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedProduct = {
      ...product,
      key: editingProduct ? editingProduct.key : Date.now(),
      sizes: product.sizes.map((s) => s.size),
    };

    if (isEditMode) {
      const updatedList = products.map((p) =>
        p.key === editingProduct.key ? updatedProduct : p
      );
      setProducts(updatedList);
    } else {
      setProducts([...products, updatedProduct]);
    }

    setProduct({
      name: "",
      description: "",
      price: "",
      images: [],
      sizes: [],
      details: "",
    });
    setErrors({});
    setSizeInput("");
    setEditingProduct(null);
    setIsEditMode(false);
    setIsModalVisible(false);
  };

  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const handleEdit = (productToEdit) => {
    setProduct({
      ...productToEdit,
      sizes: productToEdit.sizes.map((s) => ({ size: s })),
      images: [],
    });
    setEditingProduct(productToEdit);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const handleRemove = (key) => {
    const filtered = products.filter((item) => item.key !== key);
    setProducts(filtered);
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
            {size}
          </Tag>
        )),
    },
    {
      title: "Details",
      dataIndex: "details",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(record)}
            className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
          >
            Edit
          </button>
          <button
            onClick={() => handleRemove(record.key)}
            className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
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
          dataSource={products}
          pagination={{ pageSize: 4 }}
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={showModal}
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
        <form onSubmit={handleSubmit} className="space-y-2 text-sm">
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full mt-1 p-1 border rounded-sm"
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
            <label className="block font-medium">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1"
            />
          </div>

          <div>
            <label className="block font-medium">Sizes</label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                placeholder="Enter size (e.g., M)"
                className="flex-1 p-1 border rounded-sm"
              />
              <button
                type="button"
                onClick={handleAddSize}
                className="px-3 py-1 bg-black text-white rounded-sm hover:bg-gray-800"
              >
                Add
              </button>
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {product.sizes.map((s, idx) => (
                <span
                  key={idx}
                  className="bg-gray-200 px-2 py-0.5 rounded-full text-xs"
                >
                  {s.size}
                </span>
              ))}
            </div>
            {errors.sizes && (
              <p className="text-red-500 text-xs">{errors.sizes}</p>
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
