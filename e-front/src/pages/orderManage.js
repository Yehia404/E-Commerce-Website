import React, { useState, useEffect } from "react";
import {
  Table,
  Select,
  message,
  Tag,
  Modal,
  List,
  Spin,
  Typography,
  Button,
  Dropdown,
  Card,
  Pagination,
} from "antd";
import {
  EyeOutlined,
  SyncOutlined,
  MenuOutlined,
  EditOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useUser } from "../context/usercontext";

const { Option } = Select;
const { Text } = Typography;

export default function OrderManagementPage() {
  const [orders, setOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState(null);
  const { token } = useUser();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentPage, setCurrentPage] = useState(1);

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  const getStatusTag = (status) => {
    const colorMap = {
      confirmed: "green",
      cancelled: "red",
      refunded: "gold",
      shipping: "blue",
    };
    return (
      <Tag color={colorMap[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Tag>
    );
  };

  const showProductDetails = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const filteredOrders = filterStatus
    ? orders.filter((order) => order.status === filterStatus)
    : orders;

  // Get status options for filter
  const statusOptions = [...new Set(orders.map((order) => order.status))].map(
    (status) => ({
      text: status.charAt(0).toUpperCase() + status.slice(1),
      value: status,
    })
  );

  // Mobile action menu for each order
  const getActionMenu = (record) => ({
    items: [
      {
        key: "1",
        label: "View Details",
        icon: <EyeOutlined />,
        onClick: () => showProductDetails(record),
      },
      {
        key: "2",
        label: "Change Status",
        icon: <MenuOutlined />,
        children: [
          {
            key: "status-confirmed",
            label: "Confirmed",
            onClick: () => handleStatusChange(record._id, "confirmed"),
          },
          {
            key: "status-shipping",
            label: "Shipping",
            onClick: () => handleStatusChange(record._id, "shipping"),
          },
          {
            key: "status-cancelled",
            label: "Cancelled",
            onClick: () => handleStatusChange(record._id, "cancelled"),
          },
          {
            key: "status-refunded",
            label: "Refunded",
            onClick: () => handleStatusChange(record._id, "refunded"),
          },
        ],
      },
    ],
  });

  // Render mobile order list with cards
  const renderMobileOrderList = () => {
    // Calculate pagination
    const pageSize = 5;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredOrders.length);
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    return (
      <div className="px-2 py-1">
        {/* Table Headers */}
        <div className="flex justify-between items-center px-4 py-2 mb-2 bg-gray-100 rounded font-medium text-sm">
          <div className="text-gray-800">Order</div>
          <div className="text-gray-800">Actions</div>
        </div>

        {paginatedOrders.map((order) => (
          <Card
            key={order._id}
            className="mb-3 overflow-hidden"
            bodyStyle={{ padding: "12px" }}
          >
            <div className="flex justify-between items-start">
              {/* Order Info */}
              <div className="flex-grow">
                <div className="font-bold">#{order.orderId}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {order.firstname} {order.lastname}
                </div>
                <div className="flex items-center mt-1 flex-wrap">
                  {getStatusTag(order.status)}
                  <Text className="ml-2 text-sm">${order.totalPrice}</Text>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {order.products.length}{" "}
                  {order.products.length > 1 ? "items" : "item"}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2 ml-3">
                <Button
                  type="primary"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => showProductDetails(order)}
                  className="bg-black"
                />
                <Dropdown menu={getActionMenu(order)} trigger={["click"]}>
                  <Button size="small" icon={<EditOutlined />} />
                </Dropdown>
              </div>
            </div>
          </Card>
        ))}

        {/* Pagination */}
        {filteredOrders.length > pageSize && (
          <div className="flex justify-center mt-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredOrders.length}
              onChange={setCurrentPage}
              size="small"
              simple
            />
          </div>
        )}
      </div>
    );
  };

  // Generate columns based on screen width
  const getColumns = () => {
    // Tablet columns (medium)
    if (windowWidth < 1200 && windowWidth >= 768) {
      return [
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
          title: "Products",
          key: "products",
          render: (_, record) => (
            <Button type="link" onClick={() => showProductDetails(record)}>
              View ({record.products.length})
            </Button>
          ),
        },
        {
          title: "Total",
          dataIndex: "totalPrice",
          key: "totalPrice",
          render: (price) => `$${price}`,
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          render: (status, record) => (
            <Select
              value={status}
              onChange={(value) => handleStatusChange(record._id, value)}
              style={{ width: 120 }}
              size="small"
            >
              <Option value="confirmed">Confirmed</Option>
              <Option value="shipping">Shipping</Option>
              <Option value="cancelled">Cancelled</Option>
              <Option value="refunded">Refunded</Option>
            </Select>
          ),
        },
      ];
    }

    // Desktop (full)
    return [
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
        ellipsis: true,
      },
      {
        title: "Products",
        key: "products",
        render: (_, record) => (
          <Button type="link" onClick={() => showProductDetails(record)}>
            View ({record.products.length})
          </Button>
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
        ellipsis: true,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status, record) => (
          <Select
            value={status}
            onChange={(value) => handleStatusChange(record._id, value)}
            style={{ width: 120 }}
          >
            <Option value="confirmed">
              <Tag color="green">Confirmed</Tag>
            </Option>
            <Option value="cancelled">
              <Tag color="red">Cancelled</Tag>
            </Option>
            <Option value="refunded">
              <Tag color="gold">Refunded</Tag>
            </Option>
            <Option value="shipping">
              <Tag color="blue">Shipping</Tag>
            </Option>
          </Select>
        ),
      },
    ];
  };

  return (
    <div className="bg-gray-50 md:bg-transparent">
      <div className="mb-4">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">
          Order Management
        </h2>
        <p className="text-gray-600">Manage and update customer orders</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Filters and Actions */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Select
                placeholder="Filter by status"
                style={{ width: windowWidth < 768 ? 140 : 180 }}
                allowClear
                onChange={(value) => setFilterStatus(value)}
                value={filterStatus}
              >
                {statusOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.text}
                  </Option>
                ))}
              </Select>
              <Button
                icon={<SyncOutlined />}
                onClick={fetchOrders}
                size={windowWidth < 768 ? "small" : "middle"}
              >
                {windowWidth < 768 ? "" : "Refresh"}
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              {filteredOrders.length} orders found
            </div>
          </div>
        </div>

        {/* Table or Cards depending on screen size */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center p-10">
              <Spin size="large" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No orders found</div>
          ) : (
            <>
              {windowWidth < 768 ? (
                renderMobileOrderList()
              ) : (
                <Table
                  dataSource={filteredOrders}
                  columns={getColumns()}
                  rowKey="_id"
                  pagination={{
                    pageSize: 7,
                    position: ["bottomCenter"],
                  }}
                  size={windowWidth < 1024 ? "small" : "middle"}
                  scroll={{ x: windowWidth < 1024 ? 650 : "max-content" }}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      <Modal
        title={
          selectedOrder && (
            <div>
              <div className="text-lg">Order #{selectedOrder.orderId}</div>
              <div className="text-sm text-gray-500 mt-1">
                {selectedOrder.firstname} {selectedOrder.lastname} •{" "}
                {getStatusTag(selectedOrder.status)}
              </div>
            </div>
          )
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={
          selectedOrder && [
            <div key="footer-info" className="text-right mb-3 mr-2">
              <div className="text-gray-600">
                Total:{" "}
                <span className="font-bold">${selectedOrder.totalPrice}</span>
              </div>
              <div className="text-sm text-gray-500">
                {selectedOrder.paymentMethod}
              </div>
            </div>,
          ]
        }
        width={windowWidth < 768 ? "95%" : 600}
      >
        {selectedOrder && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-semibold mb-1">
                  Customer Information
                </h4>
                <p className="text-sm">
                  {selectedOrder.firstname} {selectedOrder.lastname}
                  <br />
                  {selectedOrder.email}
                  <br />
                  {selectedOrder.phone}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Shipping Address</h4>
                <p className="text-sm">
                  {selectedOrder.shippingAddress}
                  <br />
                  {selectedOrder.area}
                </p>
              </div>
            </div>

            <h4 className="text-sm font-semibold mb-2 border-b pb-2">
              Products
            </h4>
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
                        className="w-12 h-12 object-cover rounded"
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

            {windowWidth < 768 && (
              <div className="mt-4 pt-3 border-t">
                <h4 className="text-sm font-semibold mb-2">Update Status</h4>
                <Select
                  value={selectedOrder.status}
                  onChange={(value) =>
                    handleStatusChange(selectedOrder._id, value)
                  }
                  style={{ width: "100%" }}
                >
                  <Option value="confirmed">Confirmed</Option>
                  <Option value="shipping">Shipping</Option>
                  <Option value="cancelled">Cancelled</Option>
                  <Option value="refunded">Refunded</Option>
                </Select>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
