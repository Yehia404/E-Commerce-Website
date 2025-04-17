import React, { useState } from "react";
import { Modal, Table, Input, Button, Select, message, Tag } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const initialOrders = [
  {
    id: 1,
    orderNumber: "ORD-001",
    items: [{ product: "T-shirt", quantity: 2, size: "M" }],
    price: "$40",
    buyer: "Alice Smith",
    name: "Alice Smith",
    address: "123 Main St",
    phone: "123-456-7890",
    email: "alice@example.com",
    status: "confirmed",
  },
  {
    id: 2,
    orderNumber: "ORD-002",
    items: [{ product: "Sneakers", quantity: 1, size: "L" }],
    price: "$70",
    buyer: "John Doe",
    name: "John Doe",
    address: "456 Oak St",
    phone: "987-654-3210",
    email: "john@example.com",
    status: "refunded",
  },
  {
    id: 3,
    orderNumber: "ORD-003",
    items: [{ product: "Hoodie", quantity: 1, size: "L" }],
    price: "$50",
    buyer: "Jane Williams",
    name: "Jane Williams",
    address: "789 Pine St",
    phone: "555-555-5555",
    email: "jane@example.com",
    status: "cancelled",
  },
  {
    id: 4,
    orderNumber: "ORD-004",
    items: [{ product: "Jacket", quantity: 1, size: "L" }],
    price: "$80",
    buyer: "Tom Lee",
    name: "Tom Lee",
    address: "123 Maple St",
    phone: "555-123-4567",
    email: "tom@example.com",
    status: "confirmed",
  },
  {
    id: 5,
    orderNumber: "ORD-005",
    items: [{ product: "Jeans", quantity: 2, size: "M" }],
    price: "$60",
    buyer: "Sarah Brown",
    name: "Sarah Brown",
    address: "456 Birch St",
    phone: "555-987-6543",
    email: "sarah@example.com",
    status: "cancelled",
  },
  {
    id: 6,
    orderNumber: "ORD-006",
    items: [{ product: "Shirt", quantity: 1, size: "S" }],
    price: "$30",
    buyer: "David Green",
    name: "David Green",
    address: "789 Oak St",
    phone: "555-555-1234",
    email: "david@example.com",
    status: "confirmed",
  },
];

export default function OrderManagementPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = (order) => {
    setSelectedOrder({ ...order, items: [...order.items] });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...selectedOrder.items];
    newItems[index][field] = value;
    setSelectedOrder((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setSelectedOrder((prev) => ({
      ...prev,
      items: [...prev.items, { product: "", quantity: 1, size: "" }],
    }));
  };

  const removeItem = (index) => {
    const newItems = selectedOrder.items.filter((_, i) => i !== index);
    setSelectedOrder((prev) => ({ ...prev, items: newItems }));
  };

  const handleConfirm = () => {
    const requiredFields = [
      "orderNumber",
      "price",
      "buyer",
      "name",
      "address",
      "phone",
      "email",
    ];
    const hasEmptyFields = requiredFields.some(
      (field) => !selectedOrder[field]
    );

    if (hasEmptyFields) {
      message.error("Please fill in all the required fields.");
      return;
    }

    for (const item of selectedOrder.items) {
      if (!item.product || !item.quantity || !item.size) {
        message.error("Please complete all item fields.");
        return;
      }
    }

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === selectedOrder.id ? selectedOrder : order
      )
    );
    setIsModalOpen(false);
  };

  const getStatusTag = (status) => {
    const colorMap = {
      confirmed: "green",
      cancelled: "red",
      refunded: "gold",
    };
    return <Tag color={colorMap[status]}>{status.toUpperCase()}</Tag>;
  };

  const columns = [
    {
      title: "Order Number",
      dataIndex: "orderNumber",
      key: "orderNumber",
      width: 120,
    },
    {
      title: "Content",
      key: "content",
      render: (_, record) =>
        record.items
          .map(
            (item) => `${item.product} (x${item.quantity}) - Size ${item.size}`
          )
          .join(", "),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Buyer",
      dataIndex: "buyer",
      key: "buyer",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          className="bg-black text-white hover:text-black hover:bg-white transition duration-300"
          onClick={() => handleEditClick(record)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4">Order Management</h2>
      <br />

      <Table
        dataSource={orders}
        columns={columns}
        rowKey="id"
        className="bg-white rounded shadow"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Edit Order"
        open={isModalOpen}
        onOk={handleConfirm}
        onCancel={() => setIsModalOpen(false)}
        okButtonProps={{ style: { color: "black" } }}
      >
        <div className="space-y-3">
          <Input
            name="price"
            value={selectedOrder?.price || ""}
            onChange={handleInputChange}
            placeholder="Price"
          />
          <Input
            name="address"
            value={selectedOrder?.address || ""}
            onChange={handleInputChange}
            placeholder="Address"
          />
          <Select
  value={selectedOrder?.status}
  onChange={(value) =>
    setSelectedOrder((prev) => ({ ...prev, status: value }))
  }
  placeholder="Select Status"
  className="w-full"
>
  <Option value="Pending">Pending</Option>
  <Option value="Processing">Processing</Option>
  <Option value="Shipped">Shipped</Option>
  <Option value="Delivered">Delivered</Option>
  <Option value="Cancelled">Cancelled</Option>
</Select>

          {selectedOrder?.items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder="Product"
                value={item.product}
                onChange={(e) =>
                  handleItemChange(index, "product", e.target.value)
                }
              />
              <Input
                placeholder="Quantity"
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
              />
              <Select
                value={item.size}
                onChange={(value) => handleItemChange(index, "size", value)}
                className="w-24"
              >
                <Option value="XS">XS</Option>
                <Option value="S">S</Option>
                <Option value="M">M</Option>
                <Option value="L">L</Option>
                <Option value="XL">XL</Option>
              </Select>
              <MinusCircleOutlined
                onClick={() => removeItem(index)}
                className="text-red-500 cursor-pointer"
              />
            </div>
          ))}

          <Button type="dashed" onClick={addItem} block icon={<PlusOutlined />}>
            Add Item
          </Button>

          <Select
            value={selectedOrder?.status || ""}
            onChange={(value) =>
              setSelectedOrder((prev) => ({ ...prev, status: value }))
            }
            className="w-full mt-4"
          >
            <Option value="confirmed">
              <span className="text-green-600 font-semibold">● Confirmed</span>
            </Option>
            <Option value="cancelled">
              <span className="text-red-600 font-semibold">● Cancelled</span>
            </Option>
            <Option value="refunded">
              <span className="text-yellow-500 font-semibold">● Refunded</span>
            </Option>
          </Select>
        </div>
      </Modal>
    </div>
  );
}
