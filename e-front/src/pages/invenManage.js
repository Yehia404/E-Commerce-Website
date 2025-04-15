import React, { useState } from "react";
import { Table, Modal, Form, Input, Button, Checkbox, Row, Col } from "antd";

// Sample data for products
const initialProducts = [
  {
    key: 1,
    name: "Product A",
    sizes: [
      { size: "S", stock: 3 },
      { size: "M", stock: 5 },
      { size: "L", stock: 2 },
    ],
    available: true,
  },
  {
    key: 2,
    name: "Product B",
    sizes: [
      { size: "S", stock: 15 },
      { size: "M", stock: 12 },
      { size: "L", stock: 8 },
      { size: "XL", stock: 8 },
    ],
    available: true,
  },
];

const InvenManage = () => {
  const [products, setProducts] = useState(initialProducts);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Column configuration for the table
  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Sizes and Stock",
      dataIndex: "sizes",
      key: "sizes",
      render: (sizes) => (
        <div>
          {sizes.map((size) => (
            <div key={size.size}>
              {size.size}: {size.stock}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Total Stock",
      dataIndex: "sizes",
      key: "totalStock",
      render: (sizes) => sizes.reduce((acc, size) => acc + size.stock, 0),
    },
    {
      title: "Stock Alert",
      dataIndex: "sizes",
      key: "alert",
      render: (sizes) => {
        const totalStock = sizes.reduce((acc, size) => acc + size.stock, 0);
        return totalStock < 10 ? (
          <span className="text-red-500">Low Stock!</span>
        ) : null;
      },
    },
    {
      title: "Available",
      dataIndex: "available",
      key: "available",
      render: (available) => (available ? "Yes" : "No"),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button
          className="bg-black text-white hover:text-black hover:bg-white transition duration-300"
          type="primary"
          onClick={() => showModal(record)}
        >
          Edit
        </Button>
      ),
    },
  ];

  // Show modal with product data
  const showModal = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  // Handle form submission
  const handleOk = () => {
    const updatedProducts = [...products];
    const index = updatedProducts.findIndex(
      (p) => p.key === selectedProduct.key
    );
    updatedProducts[index] = selectedProduct;

    setProducts(updatedProducts);
    setIsModalVisible(false);
  };

  // Handle form cancel
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Handle input change for product properties
  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setSelectedProduct({
      ...selectedProduct,
      [field]: value,
    });
  };

  // Handle stock change
  const handleStockChange = (e, index) => {
    const newSizes = [...selectedProduct.sizes];
    newSizes[index].stock = Number(e.target.value);
    setSelectedProduct({
      ...selectedProduct,
      sizes: newSizes,
    });
  };

  // Handle availability toggle
  const handleAvailabilityChange = (e) => {
    setSelectedProduct({
      ...selectedProduct,
      available: e.target.checked,
    });
  };

  // Calculate the total stock
  const totalStock = selectedProduct?.sizes.reduce(
    (acc, size) => acc + size.stock,
    0
  );

  // Handle pagination changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4">Inventory Management</h2>
      <br />
      {/* Ant Design Table */}
      <Table
        columns={columns}
        dataSource={products}
        className="bg-white rounded shadow"
        pagination={{
          current: currentPage,
          pageSize: 5,
          showSizeChanger: false,
          showQuickJumper: true,
          showFirstLastPage: true,
          onChange: handlePageChange,
        }}
        scroll={{ y: 400 }}
      />

      {/* Modal for editing product details */}
      <Modal
        title={`Edit ${selectedProduct?.name}`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="ok" onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Product Name">
            <Input
              name="name"
              value={selectedProduct?.name}
              onChange={(e) => handleInputChange(e, "name")}
            />
          </Form.Item>

          <Form.Item label="Sizes and Stock">
            {selectedProduct?.sizes.map((size, index) => (
              <Row
                key={index}
                gutter={16}
                align="middle"
                style={{ marginBottom: 8 }}
              >
                <Col span={6}>
                  <span style={{ fontWeight: 500 }}>{size.size}</span>
                </Col>
                <Col span={18}>
                  <Input
                    type="number"
                    value={size.stock}
                    onChange={(e) => handleStockChange(e, index)}
                    style={{ width: "100%" }}
                  />
                </Col>
              </Row>
            ))}
          </Form.Item>

          <Form.Item label="Available">
            <Checkbox
              checked={selectedProduct?.available}
              onChange={handleAvailabilityChange}
            >
              Mark as available
            </Checkbox>
          </Form.Item>

          {/* Display stock alert */}
          {totalStock < 10 && (
            <div style={{ color: "red", fontWeight: "bold" }}>Low Stock!</div>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default InvenManage;
