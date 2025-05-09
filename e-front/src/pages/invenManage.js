import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  Button,
  Checkbox,
  Row,
  Col,
  Space,
  Tag,
  Card,
  Spin,
  message,
  Empty,
  Dropdown,
  Typography,
  Pagination,
} from "antd";
import {
  EditOutlined,
  WarningOutlined,
  SyncOutlined,
  FilterOutlined,
  SearchOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useUser } from "../context/usercontext";

const { Text } = Typography;

const InvenManage = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState({ discount: "", stock: {} });
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterLowStock, setFilterLowStock] = useState(false);
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

  // Filter products based on search text and filters
  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply low stock filter
    if (filterLowStock) {
      filtered = filtered.filter((product) => {
        const totalStock = product.sizes.reduce(
          (acc, size) => acc + size.stock,
          0
        );
        return totalStock < 10;
      });
    }

    setFilteredProducts(filtered);
  }, [searchText, filterLowStock, products]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
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
      setFilteredProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products", err);
      message.error("Failed to load inventory data");
      setLoading(false);
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

      // Check if any errors in stock
      const hasStockErrors = Object.values(errors.stock).some((error) => error);
      if (hasStockErrors) {
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
      message.success("Inventory updated successfully");
    } catch (error) {
      console.error("Error updating product inventory:", error);
      message.error("Failed to update inventory");
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

  const handleRefresh = () => {
    fetchProducts();
    setSearchText("");
    setFilterLowStock(false);
  };

  const toggleLowStockFilter = () => {
    setFilterLowStock(!filterLowStock);
  };

  // Mobile action menu
  const getActionMenu = (record) => ({
    items: [
      {
        key: "1",
        label: "Edit Inventory",
        icon: <EditOutlined />,
        onClick: () => showModal(record),
      },
    ],
  });

  // For mobile, we'll use a card-based layout instead of a table
  const renderMobileList = () => {
    // Calculate startIndex and endIndex for pagination
    const pageSize = 8;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredProducts.length);
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return (
      <div className="px-2 py-1">
        {/* Add this section for mobile table headers */}
        <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200 mb-2 font-medium text-gray-700">
          <div>Product</div>
          <div>Action</div>
        </div>

        {paginatedProducts.map((product) => (
          <Card
            key={product._id}
            className="mb-3 overflow-hidden"
            bodyStyle={{ padding: "12px" }}
          >
            <div className="flex items-start">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 rounded object-cover mr-3 flex-shrink-0"
              />

              <div className="flex-grow min-w-0">
                <div className="font-semibold truncate">{product.name}</div>
                <div className="mt-1">
                  {product.sizes.map((size) => (
                    <Tag key={size.size} className="mr-1 mb-1">
                      {size.size}: {size.stock}
                    </Tag>
                  ))}
                </div>
                <div className="flex items-center mt-1 flex-wrap">
                  {product.available ? (
                    <Tag color="green" className="mr-1 mb-1">
                      Available
                    </Tag>
                  ) : (
                    <Tag color="red" className="mr-1 mb-1">
                      Unavailable
                    </Tag>
                  )}
                  {product.discount > 0 && (
                    <Tag color="blue" className="mr-1 mb-1">
                      {product.discount}% off
                    </Tag>
                  )}
                  {product.sizes.reduce((acc, size) => acc + size.stock, 0) <
                    10 && (
                    <Tag
                      color="red"
                      icon={<WarningOutlined />}
                      className="mb-1"
                    >
                      Low Stock
                    </Tag>
                  )}
                </div>
              </div>

              <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                onClick={() => showModal(product)}
                className="bg-black ml-2 flex-shrink-0"
              />
            </div>
          </Card>
        ))}
      </div>
    );
  };

  // Get columns based on screen size (for tablet and desktop)
  const getColumns = () => {
    // Tablet columns
    if (windowWidth < 1024 && windowWidth >= 768) {
      return [
        {
          title: "Product",
          key: "product",
          render: (_, record) => (
            <div className="flex items-center space-x-3">
              <img
                src={record.image}
                alt={record.name}
                className="w-10 h-10 rounded object-cover"
              />
              <span className="font-medium">{record.name}</span>
            </div>
          ),
        },
        {
          title: "Stock",
          key: "stock",
          render: (_, record) => {
            const totalStock = record.sizes.reduce(
              (acc, size) => acc + size.stock,
              0
            );
            return (
              <div>
                <div>{totalStock} total</div>
                {totalStock < 10 && (
                  <Tag color="red" className="mt-1">
                    Low Stock
                  </Tag>
                )}
              </div>
            );
          },
        },
        {
          title: "Status",
          key: "status",
          render: (_, record) => (
            <Space direction="vertical" size="small">
              {record.available ? (
                <Tag color="green">Available</Tag>
              ) : (
                <Tag color="red">Unavailable</Tag>
              )}
              {record.discount > 0 && (
                <Tag color="blue">{record.discount}% off</Tag>
              )}
            </Space>
          ),
        },
        {
          title: "Action",
          key: "action",
          width: 80,
          render: (_, record) => (
            <Button
              type="primary"
              size="small"
              onClick={() => showModal(record)}
              className="bg-black"
            >
              Edit
            </Button>
          ),
        },
      ];
    }

    // Desktop columns (full)
    return [
      {
        title: "Product Name",
        dataIndex: "name",
        key: "name",
        render: (text, record) => (
          <div className="flex items-center space-x-3">
            <img
              src={record.image}
              alt={text}
              className="w-10 h-10 rounded object-cover"
            />
            <span>{text}</span>
          </div>
        ),
      },
      {
        title: "Sizes and Stock",
        dataIndex: "sizes",
        key: "sizes",
        render: (sizes) => (
          <div className="flex flex-wrap gap-1">
            {sizes.map((size) => (
              <Tag key={size.size}>
                {size.size}: {size.stock}
              </Tag>
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
            <Tag color="red" icon={<WarningOutlined />}>
              Low Stock
            </Tag>
          ) : (
            <Tag color="green">In Stock</Tag>
          );
        },
      },
      {
        title: "Available",
        dataIndex: "available",
        key: "available",
        render: (available) =>
          available ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>,
      },
      {
        title: "Discount",
        dataIndex: "discount",
        key: "discount",
        render: (discount) =>
          discount > 0 ? <Tag color="blue">{discount}%</Tag> : "0%",
      },
      {
        title: "Action",
        key: "action",
        render: (_, record) => (
          <Button
            type="primary"
            onClick={() => showModal(record)}
            className="bg-black text-white hover:text-white hover:bg-gray-800"
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
          Inventory Management
        </h2>
        <p className="text-gray-600">
          Manage product stock, availability, and discounts
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Filters and Actions */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between gap-3">
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent w-full"
                />
                <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <Button
                type={filterLowStock ? "primary" : "default"}
                icon={<WarningOutlined />}
                onClick={toggleLowStockFilter}
                className={filterLowStock ? "bg-red-500 border-red-500" : ""}
              >
                {windowWidth > 640 && "Low Stock"}
              </Button>

              <Button icon={<SyncOutlined />} onClick={handleRefresh}>
                {windowWidth > 640 && "Refresh"}
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              {filteredProducts.length} products
            </div>
          </div>
        </div>

        {/* Table/List - Use card-based layout for mobile, table for larger screens */}
        {loading ? (
          <div className="py-16 flex justify-center">
            <Spin size="large" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <Empty description="No inventory items found" className="my-12" />
        ) : (
          <>
            {windowWidth < 768 ? (
              <>
                {renderMobileList()}
                <div className="py-4 flex justify-center">
                  <Pagination
                    current={currentPage}
                    pageSize={8}
                    total={filteredProducts.length}
                    onChange={(page) => setCurrentPage(page)}
                    size="small"
                    simple
                  />
                </div>
              </>
            ) : (
              <Table
                columns={getColumns()}
                dataSource={filteredProducts.map((p, idx) => ({
                  ...p,
                  key: p._id || idx,
                }))}
                pagination={{
                  current: currentPage,
                  pageSize: 5,
                  showSizeChanger: false,
                  showQuickJumper: windowWidth >= 768,
                  showTotal:
                    windowWidth >= 768
                      ? (total) => `Total ${total} items`
                      : false,
                  onChange: (page) => setCurrentPage(page),
                  position: ["bottomCenter"],
                }}
                scroll={{ x: windowWidth < 1024 ? 650 : "max-content" }}
                size={windowWidth < 1024 ? "small" : "middle"}
              />
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        title={`Edit ${selectedProduct?.name}`}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="ok"
            type="primary"
            onClick={handleOk}
            className="bg-black"
          >
            Save Changes
          </Button>,
        ]}
        width={windowWidth < 768 ? "95%" : 520}
        centered
      >
        {selectedProduct && (
          <Form layout="vertical">
            <div className="mb-4 flex items-center">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-16 h-16 rounded object-cover mr-3"
              />
              <div>
                <h3 className="font-semibold">{selectedProduct.name}</h3>
                <p className="text-gray-500 text-sm">
                  Update inventory details
                </p>
              </div>
            </div>

            <Form.Item label="Sizes and Stock">
              {selectedProduct.sizes.map((size, index) => (
                <div key={index} className="mb-2">
                  <Row gutter={12} align="middle">
                    <Col span={6}>
                      <Text strong>{size.size}</Text>
                    </Col>
                    <Col span={18}>
                      <Input
                        type="number"
                        min={0}
                        value={size.stock}
                        onChange={(e) => handleStockChange(e, index)}
                        addonAfter="units"
                      />
                      {errors.stock[index] && (
                        <div className="text-red-500 text-xs mt-1">
                          {errors.stock[index]}
                        </div>
                      )}
                    </Col>
                  </Row>
                </div>
              ))}

              <div className="mt-3 pt-3 border-t border-gray-200">
                <Text className="text-gray-600">
                  Total Stock:{" "}
                  <Text strong>
                    {selectedProduct.sizes.reduce(
                      (acc, size) => acc + size.stock,
                      0
                    )}
                  </Text>
                </Text>
                {selectedProduct.sizes.reduce(
                  (acc, size) => acc + size.stock,
                  0
                ) < 10 && (
                  <div className="text-red-500 text-sm mt-1 flex items-center">
                    <WarningOutlined className="mr-1" /> Low stock alert!
                  </div>
                )}
              </div>
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Discount">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={selectedProduct.discount}
                    onChange={(e) => handleInputChange(e, "discount")}
                    suffix="%"
                  />
                  {errors.discount && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.discount}
                    </div>
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Availability">
                  <Checkbox
                    checked={selectedProduct.available}
                    onChange={handleAvailabilityChange}
                  >
                    Available for purchase
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default InvenManage;
