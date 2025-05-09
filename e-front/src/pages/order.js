import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  List,
  message,
  Tag,
  Card,
  Typography,
  Button,
  Spin,
  Empty,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import axios from "axios";
import { useUser } from "../context/usercontext";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const { Text, Title } = Typography;

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { token } = useUser();

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchUserOrders = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
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

  // Function to render order cards for mobile view
  const renderMobileOrderCards = () => {
    if (orders.length === 0) {
      return (
        <Empty
          description="No orders found"
          className="my-8"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    return (
      <div className="space-y-4">
        {orders.map((order) => (
          <Card
            key={order.orderId}
            className="shadow-sm"
            bodyStyle={{ padding: "16px" }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <Text strong>Order #{order.orderId}</Text>
                <div className="mt-1">{getStatusTag(order.status)}</div>
              </div>
              <Text strong>${order.totalPrice.toFixed(2)}</Text>
            </div>

            <div className="mb-3">
              <Text className="text-gray-500 text-sm block mb-1">
                Products:
              </Text>
              <Text className="text-sm">
                {order.products.map((product, idx) => (
                  <div key={idx}>
                    {product.name} (x{product.quantity}) - Size {product.size}
                  </div>
                ))}
              </Text>
            </div>

            <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-3">
              <Text className="text-xs text-gray-500">
                {order.paymentMethod}
              </Text>
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => showProductDetails(order)}
                className="bg-black border-black"
              >
                Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  // Generate columns based on screen width
  const getColumns = () => {
    // Tablet columns (medium screens)
    if (windowWidth < 1024 && windowWidth >= 768) {
      return [
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
            <Button
              type="link"
              onClick={() => showProductDetails(record)}
              className="p-0 text-left"
            >
              {record.products.length} items
            </Button>
          ),
        },
        {
          title: "Total",
          dataIndex: "totalPrice",
          key: "totalPrice",
          render: (price) => `$${price.toFixed(2)}`,
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          render: (status) => getStatusTag(status),
        },
      ];
    }

    // Desktop columns (full)
    return [
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
          <Button
            type="link"
            onClick={() => showProductDetails(record)}
            className="p-0 text-left"
          >
            View {record.products.length} item
            {record.products.length > 1 ? "s" : ""}
          </Button>
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
        ellipsis: true,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => getStatusTag(status),
      },
    ];
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold">My Orders</h2>
          <p className="text-gray-500 mt-1">
            View your order history and track deliveries
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Mobile view: Cards */}
            {windowWidth < 768 && renderMobileOrderCards()}

            {/* Tablet and Desktop view: Table */}
            {windowWidth >= 768 && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <Table
                  dataSource={orders}
                  columns={getColumns()}
                  rowKey="orderId"
                  pagination={{
                    pageSize: 5,
                    hideOnSinglePage: true,
                    position: ["bottomCenter"],
                  }}
                  locale={{ emptyText: "No orders found" }}
                  size={windowWidth < 1024 ? "small" : "middle"}
                />
              </div>
            )}
          </>
        )}
      </div>
      {/* Product Details Modal */}
      <Modal
        title={
          selectedOrder && (
            <div>
              <div className="text-lg">Order #{selectedOrder.orderId}</div>
              <div className="text-sm text-gray-500 mt-1 flex items-center">
                {getStatusTag(selectedOrder.status)}
                <span className="ml-2">
                  Total: ${selectedOrder.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          )
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={windowWidth < 768 ? "95%" : 600}
        centered
      >
        {selectedOrder && (
          <div>
            <div className="mb-4 pb-3 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Text type="secondary" className="block mb-1">
                    Shipping Address:
                  </Text>
                  <Text>{selectedOrder.shippingAddress}</Text>
                  {selectedOrder.area && (
                    <div className="mt-1">
                      <Text>{selectedOrder.area}</Text>
                    </div>
                  )}
                </div>
                <div>
                  <Text type="secondary" className="block mb-1">
                    Payment Method:
                  </Text>
                  <Text>{selectedOrder.paymentMethod}</Text>
                </div>
              </div>
            </div>

            <Text strong className="block mb-3">
              Order Items
            </Text>
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
                        className="w-16 h-16 object-cover rounded"
                      />
                    }
                    title={product.name}
                    description={
                      <div>
                        <div>Quantity: {product.quantity}</div>
                        <div>Size: {product.size}</div>
                        <div>Price: ${product.price}</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>
      <div className="py-16"></div> {/* Add extra space above the footer */}
      <Footer />
    </div>
  );
};

export default Order;
