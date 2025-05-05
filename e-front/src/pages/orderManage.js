import React, { useState, useEffect } from "react";
import { Table, Select, message, Tag, Modal, List } from "antd";
import axios from "axios";
import { useUser } from "../context/usercontext";

const { Option } = Select;

export default function OrderManagementPage() {
  const [orders, setOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { token } = useUser();

  useEffect(() => {
    const fetchOrders = async () => {
      console.log("Fetching orders...");
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Orders fetched:", response.data);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        message.error("Failed to fetch orders");
      }
    };

    if (token) {
      fetchOrders();
    } else {
      console.warn("No token available");
    }
  }, [token]);

  const handleStatusChange = async (orderId, newStatus) => {
    console.log(`Changing status for order ${orderId} to ${newStatus}`);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Status update response:", response.data);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      message.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error("Failed to update order status");
    }
  };

  const getStatusTag = (status, orderId) => {
    const colorMap = {
      confirmed: "green",
      cancelled: "red",
      refunded: "gold",
      shipping: "blue",
    };
    return (
      <Select
        value={status}
        onChange={(value) => handleStatusChange(orderId, value)}
        style={{ width: 120 }}
      >
        <Option value="confirmed">
          <Tag color={colorMap["confirmed"]}>Confirmed</Tag>
        </Option>
        <Option value="cancelled">
          <Tag color={colorMap["cancelled"]}>Cancelled</Tag>
        </Option>
        <Option value="refunded">
          <Tag color={colorMap["refunded"]}>Refunded</Tag>
        </Option>
        <Option value="shipping">
          <Tag color={colorMap["shipping"]}>Shipping</Tag>
        </Option>
      </Select>
    );
  };

  const showProductDetails = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      width: 100,
    },
    {
      title: "Customer",
      key: "customer",
      render: (_, record) => `${record.firstname} ${record.lastname}`,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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
      render: (price) => `$${price}`,
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
      render: (status, record) => getStatusTag(status, record._id),
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4">Order Management</h2>
      <br />

      <Table
        dataSource={orders}
        columns={columns}
        rowKey="_id"
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
  );
}
