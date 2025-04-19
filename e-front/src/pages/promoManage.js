import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/usercontext"; // assuming this provides { token }

import {
  Table,
  Modal,
  Input,
  InputNumber,
  DatePicker,
  Checkbox,
  Button,
  message,
  Tag,
} from "antd";
import dayjs from "dayjs";

export default function PromoCodeManagement() {
  const { token } = useUser(); // ✅ get token from context
  const [promoCodes, setPromoCodes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newPromo, setNewPromo] = useState({
    code: "",
    discountValue: 0,
    expirationDate: null,
    usageLimit: null,
    usedCount: 0,
    isActive: false,
  });

  useEffect(() => {
    if (!token) return;
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchPromoCodes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/promocodes/all");
        setPromoCodes(response.data);
      } catch (error) {
        message.error("Failed to fetch promo codes");
        console.error("Error fetching promo codes:", error);
      }
    };
    fetchPromoCodes();
  }, [token]);

  const handleEdit = (record) => {
    setEditingPromo({ ...record });
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/promocodes/update/${editingPromo._id}`,
        { ...editingPromo }
      );
      setPromoCodes((prev) =>
        prev.map((promo) =>
          promo._id === editingPromo._id ? response.data.promoCode : promo
        )
      );
      message.success("Promo code updated");
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to update promo code");
      console.error("Error updating promo code:", error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/promocodes/create", {
        ...newPromo,
      });
      setPromoCodes([...promoCodes, response.data.promoCode]);
      message.success("Promo code added");
      setIsAddModalVisible(false);
      setNewPromo({
        code: "",
        discountValue: 0,
        expirationDate: null,
        usageLimit: null,
        usedCount: 0,
        isActive: false,
      });
    } catch (error) {
      message.error("Failed to add promo code");
      console.error("Error adding promo code:", error);
    }
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Discount",
      dataIndex: "discountValue",
      key: "discountValue",
      render: (val) => `${val}%`,
    },
    {
      title: "Expiration",
      dataIndex: "expirationDate",
      key: "expirationDate",
      render: (date) =>
        new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
    },
    {
      title: "Usage Limit",
      dataIndex: "usageLimit",
      key: "usageLimit",
      render: (val) => (val === null ? "Unlimited" : val),
    },
    {
      title: "Used",
      dataIndex: "usedCount",
      key: "usedCount",
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (val) =>
        val ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          onClick={() => handleEdit(record)}
          style={{ backgroundColor: "black", color: "white", border: "none" }}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4">PromoCode Management</h2>

      <Table
        dataSource={promoCodes}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        className="bg-white rounded shadow"
      />

      <div className="flex justify-end mt-4">
        <Button
          type="primary"
          style={{ backgroundColor: "black", color: "white" }}
          onClick={() => setIsAddModalVisible(true)}
        >
          Add Promo Code
        </Button>
      </div>

      <Modal
        title="Edit Promo Code"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
        okText="Save"
        okButtonProps={{ style: { backgroundColor: "black", color: "white" } }}
      >
        {editingPromo && (
          <div className="flex flex-col gap-4">
            <Input
              value={editingPromo.code}
              onChange={(e) =>
                setEditingPromo({
                  ...editingPromo,
                  code: e.target.value.toUpperCase(),
                })
              }
              placeholder="Code"
            />
            <InputNumber
              min={1}
              value={editingPromo.discountValue}
              onChange={(value) =>
                setEditingPromo({ ...editingPromo, discountValue: value })
              }
              addonAfter="%"
              style={{ width: "100%" }}
            />
            <DatePicker
              value={
                editingPromo.expirationDate
                  ? dayjs(editingPromo.expirationDate)
                  : null
              }
              onChange={(date) =>
                setEditingPromo({
                  ...editingPromo,
                  expirationDate: date ? date.toDate() : null,
                })
              }
              style={{ width: "100%" }}
              disabledDate={(current) =>
                current && current < dayjs().endOf("day")
              }
            />
            <InputNumber
              min={1}
              value={editingPromo.usageLimit}
              onChange={(value) =>
                setEditingPromo({
                  ...editingPromo,
                  usageLimit: value === 0 ? null : value,
                })
              }
              placeholder="Usage Limit"
              style={{ width: "100%" }}
            />
            <Checkbox
              checked={editingPromo.isActive}
              onChange={(e) =>
                setEditingPromo({
                  ...editingPromo,
                  isActive: e.target.checked,
                })
              }
            >
              Active
            </Checkbox>
          </div>
        )}
      </Modal>

      <Modal
        title="Add Promo Code"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={handleAdd}
        okText="Add"
        okButtonProps={{ style: { backgroundColor: "black", color: "white" } }}
      >
        <div className="flex flex-col gap-4">
          <Input
            value={newPromo.code}
            onChange={(e) =>
              setNewPromo({
                ...newPromo,
                code: e.target.value.toUpperCase(),
              })
            }
            placeholder="Code"
          />
          <InputNumber
            min={1}
            value={newPromo.discountValue}
            onChange={(value) =>
              setNewPromo({ ...newPromo, discountValue: value })
            }
            addonAfter="%"
            style={{ width: "100%" }}
          />
          <DatePicker
            value={
              newPromo.expirationDate ? dayjs(newPromo.expirationDate) : null
            }
            onChange={(date) =>
              setNewPromo({
                ...newPromo,
                expirationDate: date ? date.toDate() : null,
              })
            }
            style={{ width: "100%" }}
            disabledDate={(current) =>
              current && current < dayjs().endOf("day")
            }
          />
          <InputNumber
            min={1}
            value={newPromo.usageLimit}
            onChange={(value) =>
              setNewPromo({
                ...newPromo,
                usageLimit: value === 0 ? null : value,
              })
            }
            placeholder="Usage Limit"
            style={{ width: "100%" }}
          />
          <Checkbox
            checked={newPromo.isActive}
            onChange={(e) =>
              setNewPromo({ ...newPromo, isActive: e.target.checked })
            }
          >
            Active
          </Checkbox>
        </div>
      </Modal>
    </div>
  );
}
