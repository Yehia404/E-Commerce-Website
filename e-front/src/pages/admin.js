import React, { useState } from "react";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("products");

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Product Catalog Management
            </h2>
            <p>
              Add, update, and remove products with details like name,
              description, price, and images.
            </p>
          </div>
        );
      case "orders":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Order Management</h2>
            <p>
              View and manage orders, update order status, send order
              confirmations, and issue refunds.
            </p>
          </div>
        );
      case "inventory":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Inventory Management
            </h2>
            <p>
              Track product availability, manage stock levels, and provide
              alerts for low stock.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white p-6 flex flex-col">
        <h1
          className="text-4xl font-bold mb-8 text-center"
          style={{ fontFamily: "Dancing Script, cursive" }}
        >
          VibeWear
        </h1>
        <ul className="space-y-4">
          <li
            onClick={() => setActiveTab("products")}
            className={`cursor-pointer hover:bg-gray-700 p-3 rounded ${
              activeTab === "products" ? "bg-gray-800" : ""
            }`}
          >
            Product Management
          </li>
          <li
            onClick={() => setActiveTab("orders")}
            className={`cursor-pointer hover:bg-gray-700 p-3 rounded ${
              activeTab === "orders" ? "bg-gray-800" : ""
            }`}
          >
            Order Management
          </li>
          <li
            onClick={() => setActiveTab("inventory")}
            className={`cursor-pointer hover:bg-gray-700 p-3 rounded ${
              activeTab === "inventory" ? "bg-gray-800" : ""
            }`}
          >
            Inventory Management
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">{renderContent()}</div>
    </div>
  );
};

export default Admin;
