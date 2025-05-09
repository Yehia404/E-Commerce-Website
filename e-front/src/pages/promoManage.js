import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/usercontext";

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
  Card,
  Pagination,
  Spin,
  Typography,
  Space,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  CalendarOutlined,
  PercentageOutlined,
  NumberOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

export default function PromoCodeManagement() {
  const { token } = useUser();
  const [promoCodes, setPromoCodes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentPage, setCurrentPage] = useState(1);
  const [newPromo, setNewPromo] = useState({
    code: "",
    discountValue: 0,
    expirationDate: null,
    usageLimit: null,
    usedCount: 0,
    isActive: false,
  });

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!token) return;
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchPromoCodes();
  }, [token]);

  const fetchPromoCodes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/promocodes/all"
      );
      setPromoCodes(response.data);
    } catch (error) {
      message.error("Failed to fetch promo codes");
      console.error("Error fetching promo codes:", error);
    } finally {
      setLoading(false);
    }
  };

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
    // Validate required fields
    if (!newPromo.code || !newPromo.discountValue || !newPromo.expirationDate) {
      message.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/promocodes/create",
        {
          ...newPromo,
        }
      );
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

  // For mobile, we'll use a card-based layout instead of a table
  const renderMobilePromoList = () => {
    // Calculate pagination
    const pageSize = 5;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, promoCodes.length);
    const paginatedCodes = promoCodes.slice(startIndex, endIndex);

    return (
      <div className="px-2 py-1">
        {/* Table Headers */}
        <div className="flex justify-between items-center px-4 py-2 mb-2 bg-gray-100 rounded font-medium text-sm">
          <div className="text-gray-800">Promo Code</div>
          <div className="text-gray-800">Actions</div>
        </div>

        {paginatedCodes.map((promo) => (
          <Card
            key={promo._id}
            className="mb-3 overflow-hidden"
            bodyStyle={{ padding: "12px" }}
          >
            <div className="flex justify-between items-start">
              {/* Promo Info */}
              <div className="flex-grow">
                <div className="font-bold">{promo.code}</div>
                <div className="flex items-center mt-1">
                  <PercentageOutlined className="mr-1 text-blue-500" />
                  <Text className="text-sm">{promo.discountValue}% off</Text>
                </div>
                <div className="flex items-center mt-1">
                  <CalendarOutlined className="mr-1 text-orange-500" />
                  <Text className="text-sm">
                    Expires:{" "}
                    {new Date(promo.expirationDate).toLocaleDateString()}
                  </Text>
                </div>
                <div className="flex items-center mt-1">
                  <NumberOutlined className="mr-1 text-purple-500" />
                  <Text className="text-sm">
                    Used: {promo.usedCount} /{" "}
                    {promo.usageLimit === null ? "∞" : promo.usageLimit}
                  </Text>
                </div>
                <div className="mt-1">
                  {promo.isActive ? (
                    <Tag color="green">Active</Tag>
                  ) : (
                    <Tag color="red">Inactive</Tag>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => handleEdit(promo)}
                className="bg-black ml-2"
                size="small"
              >
                Edit
              </Button>
            </div>
          </Card>
        ))}

        {/* Pagination */}
        {promoCodes.length > pageSize && (
          <div className="flex justify-center mt-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={promoCodes.length}
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
    if (windowWidth < 1024 && windowWidth >= 768) {
      return [
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
              month: "short",
              day: "numeric",
            }),
        },
        {
          title: "Status",
          key: "status",
          render: (_, record) => (
            <Space direction="vertical" size="small">
              {record.isActive ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">Inactive</Tag>
              )}
              <Text className="text-xs">
                Used: {record.usedCount}/
                {record.usageLimit === null ? "∞" : record.usageLimit}
              </Text>
            </Space>
          ),
        },
        {
          title: "Actions",
          key: "actions",
          render: (_, record) => (
            <Button
              onClick={() => handleEdit(record)}
              className="bg-black text-white border-none"
              size="small"
            >
              Edit
            </Button>
          ),
        },
      ];
    }

    // Desktop (full)
    return [
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
            className="bg-black text-white border-none"
          >
            Edit
          </Button>
        ),
      },
    ];
  };

  return (
    <div className="bg-gray-50 md:bg-transparent">
      <div className="mb-4">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">
          PromoCode Management
        </h2>
        <p className="text-gray-600">
          Create and manage promotional discount codes
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Table or Cards depending on screen size */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center p-10">
              <Spin size="large" />
            </div>
          ) : promoCodes.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No promo codes found
            </div>
          ) : (
            <>
              {windowWidth < 768 ? (
                renderMobilePromoList()
              ) : (
                <Table
                  dataSource={promoCodes}
                  columns={getColumns()}
                  rowKey="_id"
                  pagination={{
                    pageSize: 5,
                    position: ["bottomCenter"],
                  }}
                  size={windowWidth < 1024 ? "small" : "middle"}
                />
              )}
            </>
          )}
        </div>

        {/* Add Button */}
        <div className="flex justify-end p-4 border-t border-gray-200">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAddModalVisible(true)}
            className="bg-black text-white"
          >
            Add Promo Code
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        title="Edit Promo Code"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
        okText="Save"
        okButtonProps={{ className: "bg-black text-white" }}
        centered
        width={windowWidth < 768 ? "95%" : 520}
      >
        {editingPromo && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code
              </label>
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Percentage
              </label>
              <InputNumber
                min={1}
                max={100}
                value={editingPromo.discountValue}
                onChange={(value) =>
                  setEditingPromo({ ...editingPromo, discountValue: value })
                }
                addonAfter="%"
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date
              </label>
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usage Limit
              </label>
              <InputNumber
                min={0}
                value={editingPromo.usageLimit}
                onChange={(value) =>
                  setEditingPromo({
                    ...editingPromo,
                    usageLimit: value === 0 ? null : value,
                  })
                }
                placeholder="Leave empty for unlimited"
                style={{ width: "100%" }}
              />
              <Text className="text-xs text-gray-500 mt-1 block">
                Set to 0 for unlimited usage
              </Text>
            </div>

            <div className="mt-2">
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
          </div>
        )}
      </Modal>

      {/* Add Modal */}
      <Modal
        title="Add Promo Code"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={handleAdd}
        okText="Add"
        okButtonProps={{ className: "bg-black text-white" }}
        centered
        width={windowWidth < 768 ? "95%" : 520}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code <span className="text-red-500">*</span>
            </label>
            <Input
              value={newPromo.code}
              onChange={(e) =>
                setNewPromo({
                  ...newPromo,
                  code: e.target.value.toUpperCase(),
                })
              }
              placeholder="e.g. SUMMER20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Percentage <span className="text-red-500">*</span>
            </label>
            <InputNumber
              min={1}
              max={100}
              value={newPromo.discountValue}
              onChange={(value) =>
                setNewPromo({ ...newPromo, discountValue: value })
              }
              addonAfter="%"
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiration Date <span className="text-red-500">*</span>
            </label>
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usage Limit
            </label>
            <InputNumber
              min={0}
              value={newPromo.usageLimit}
              onChange={(value) =>
                setNewPromo({
                  ...newPromo,
                  usageLimit: value === 0 ? null : value,
                })
              }
              placeholder="Leave empty for unlimited"
              style={{ width: "100%" }}
            />
            <Text className="text-xs text-gray-500 mt-1 block">
              Set to 0 for unlimited usage
            </Text>
          </div>

          <div className="mt-2">
            <Checkbox
              checked={newPromo.isActive}
              onChange={(e) =>
                setNewPromo({ ...newPromo, isActive: e.target.checked })
              }
            >
              Active
            </Checkbox>
          </div>
        </div>
      </Modal>
    </div>
  );
}
