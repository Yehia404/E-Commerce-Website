import React, { useState, useEffect } from "react";
import { Table, Modal, List, message, Tag } from "antd";
import axios from "axios";
import { useUser } from "../context/usercontext";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { token } = useUser();

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/user/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching user orders:", error);
        message.error("Failed to fetch orders");
      }
    };

    if (token) {
      fetchUserOrders();
    }
  }, [token]);

  const showProductDetails = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const getStatusTag = (status) => {
    const colorMap = {
      confirmed: "green",
      cancelled: "red",
      refunded: "gold",
      shipping: "blue",
    };
    return <Tag color={colorMap[status]}>{status.toUpperCase()}</Tag>;
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      width: 100,
    },
    {
      title: "Products",
      key: "products",
      render: (_, record) => (
        <a onClick={() => showProductDetails(record)}>
          {record.products
            .map(
              (product) =>
                `${product.name} (x${product.quantity}) - Size ${product.size}`
            )
            .join(", ")}
        </a>
      ),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Shipping Address",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
    },
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-semibold mb-4">My Orders</h2>
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="orderId"
          className="bg-white rounded shadow"
          pagination={{ pageSize: 5 }}
        />

        <Modal
          title="Product Details"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          {selectedOrder && (
            <List
              itemLayout="horizontal"
              dataSource={selectedOrder.products}
              renderItem={(product) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: 50 }}
                      />
                    }
                    title={product.name}
                    description={`Quantity: ${product.quantity}, Size: ${product.size}, Price: $${product.price}`}
                  />
                </List.Item>
              )}
            />
          )}
        </Modal>
      </div>
      <div className="py-24"></div> {/* Add extra space above the footer */}
      <Footer />
    </div>
  );
};

export default Order;
