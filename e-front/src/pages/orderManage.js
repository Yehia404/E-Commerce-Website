import React, { useState } from "react";
import { Modal, Table, Input, Button as AntButton, Select, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const initialOrders = [
  {
    id: 1,
    orderNumber: "ORD-001",
    items: [
      { product: "T-shirt", quantity: 2, size: "M" },
    ],
    price: "$40",
    buyer: "Alice Smith",
    name: "Alice Smith",
    address: "123 Main St",
    phone: "123-456-7890",
    email: "alice@example.com",
    status: "Shipped",
  },
  {
    id: 2,
    orderNumber: "ORD-002",
    items: [
      { product: "Sneakers", quantity: 1, size: "10" },
    ],
    price: "$70",
    buyer: "John Doe",
    name: "John Doe",
    address: "456 Oak St",
    phone: "987-654-3210",
    email: "john@example.com",
    status: "Pending",
  },
  {
    id: 3,
    orderNumber: "ORD-003",
    items: [
      { product: "Hoodie", quantity: 1, size: "L" },
    ],
    price: "$50",
    buyer: "Jane Williams",
    name: "Jane Williams",
    address: "789 Pine St",
    phone: "555-555-5555",
    email: "jane@example.com",
    status: "Processing",
  },
  {
    id: 4,
    orderNumber: "ORD-004",
    items: [
      { product: "Jacket", quantity: 1, size: "L" },
    ],
    price: "$80",
    buyer: "Tom Lee",
    name: "Tom Lee",
    address: "123 Maple St",
    phone: "555-123-4567",
    email: "tom@example.com",
    status: "Delivered",
  },
  {
    id: 5,
    orderNumber: "ORD-005",
    items: [
      { product: "Jeans", quantity: 2, size: "M" },
    ],
    price: "$60",
    buyer: "Sarah Brown",
    name: "Sarah Brown",
    address: "456 Birch St",
    phone: "555-987-6543",
    email: "sarah@example.com",
    status: "Cancelled",
  },
  {
    id: 6,
    orderNumber: "ORD-006",
    items: [
      { product: "Shirt", quantity: 1, size: "S" },
    ],
    price: "$30",
    buyer: "David Green",
    name: "David Green",
    address: "789 Oak St",
    phone: "555-555-1234",
    email: "david@example.com",
    status: "Pending",
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
    const requiredFields = ["orderNumber", "price", "buyer", "name", "address", "phone", "email"];
    const hasEmptyFields = requiredFields.some((field) => !selectedOrder[field]);

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

  const columns = [
    {
      title: "Order Number",
      dataIndex: "orderNumber",
      key: "orderNumber",
      width: 120
    },
    {
      title: "Content",
      key: "content",
      render: (_, record) =>
        record.items.map((item, i) => `${item.product} (x${item.quantity}) - Size ${item.size}`).join(", "),
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
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <AntButton type="default" style={{ color: "black" }} onClick={() => handleEditClick(record)}>
          Edit
        </AntButton>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        let color;
        if (text === "Delivered") color = "green";
        else if (text === "Cancelled") color = "red";
        else color = "orange";
    
        return (
          <span style={{ color, fontWeight: "bold" }}>
            {text}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="id"
        className="bg-white rounded shadow"
        pagination={{ pageSize: 5 }} // Set pagination to 5 orders per page
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
                onChange={(e) => handleItemChange(index, "product", e.target.value)}
              />
              <Input
                placeholder="Quantity"
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
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
              
              <MinusCircleOutlined onClick={() => removeItem(index)} className="text-red-500 cursor-pointer" />
            </div>
          ))}
          <AntButton type="dashed" onClick={addItem} block icon={<PlusOutlined />}>
            Add Item
          </AntButton>
        </div>
      </Modal>
    </div>
  );
}
