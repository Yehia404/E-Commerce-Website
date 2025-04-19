import React, { useState, useEffect } from "react";
import { Table, Modal, Form, Input, Button, Checkbox, Row, Col } from "antd";
import axios from "axios";
import { useUser } from "../context/usercontext";

const InvenManage = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState({ discount: "", stock: {} });
  const { token } = useUser();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products/inventory",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  const showModal = (product) => {
    setSelectedProduct(product);
    setErrors({ discount: "", stock: {} });
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const { _id, sizes, available, discount } = selectedProduct;

      if (discount < 0 || discount > 100) {
        setErrors((prev) => ({
          ...prev,
          discount: "Discount must be between 0 and 100",
        }));
        return;
      }

      const res = await axios.put(
        `http://localhost:5000/api/products/inventory/${_id}`,
        {
          sizes,
          available,
          discount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedProducts = products.map((product) =>
        product._id === _id ? res.data : product
      );

      setProducts(updatedProducts);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating product inventory:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleInputChange = (e, field) => {
    let value = Number(e.target.value);
    let error = "";

    if (field === "discount") {
      if (value < 0) {
        value = 0;
        error = "Minimum is 0";
      }
      if (value > 100) {
        value = 100;
        error = "Maximum is 100";
      }
      setErrors((prev) => ({ ...prev, discount: error }));
    }

    setSelectedProduct({
      ...selectedProduct,
      [field]: value,
    });
  };

  const handleStockChange = (e, index) => {
    let value = Number(e.target.value);
    if (value < 0) value = 0;

    const newSizes = [...selectedProduct.sizes];
    newSizes[index].stock = value;

    setSelectedProduct({
      ...selectedProduct,
      sizes: newSizes,
    });

    setErrors((prev) => ({
      ...prev,
      stock: {
        ...prev.stock,
        [index]: value < 0 ? "Stock can't be negative" : "",
      },
    }));
  };

  const handleAvailabilityChange = (e) => {
    setSelectedProduct({
      ...selectedProduct,
      available: e.target.checked,
    });
  };

  const totalStock = selectedProduct?.sizes.reduce(
    (acc, size) => acc + size.stock,
    0
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (discount) => `${discount}%`,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (img) => (
        <img
          src={img}
          alt="Product"
          style={{ width: 60, height: 60, objectFit: "cover" }}
        />
      ),
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

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4">Inventory Management</h2>
      <br />
      <Table
        columns={columns}
        dataSource={products.map((p, idx) => ({ ...p, key: p._id || idx }))}
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
          <Form.Item label="Sizes and Stock">
            {selectedProduct?.sizes.map((size, index) => (
              <div key={index} style={{ marginBottom: 12 }}>
                <Row gutter={16} align="middle">
                  <Col span={6}>
                    <span style={{ fontWeight: 500 }}>{size.size}</span>
                  </Col>
                  <Col span={18}>
                    <Input
                      type="number"
                      min={0}
                      value={size.stock}
                      onChange={(e) => handleStockChange(e, index)}
                      style={{ width: "100%" }}
                    />
                    {errors.stock[index] && (
                      <div style={{ color: "red", fontSize: 12 }}>
                        {errors.stock[index]}
                      </div>
                    )}
                  </Col>
                </Row>
              </div>
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

          <Form.Item label="Discount">
            <Input
              type="number"
              min={0}
              max={100}
              value={selectedProduct?.discount}
              onChange={(e) => handleInputChange(e, "discount")}
              style={{ width: "100%" }}
            />
            {errors.discount && (
              <div style={{ color: "red", fontSize: 12 }}>
                {errors.discount}
              </div>
            )}
          </Form.Item>

          {totalStock < 10 && (
            <div style={{ color: "red", fontWeight: "bold" }}>Low Stock!</div>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default InvenManage;
