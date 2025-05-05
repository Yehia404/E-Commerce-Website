import React, { useState } from "react";
import { FaUser, FaShoppingCart, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Drawer, Button, Input, Dropdown, Menu } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useUser } from "../context/usercontext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { isLoggedIn, isAdmin, logout } = useUser();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleIconClick = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      navigate(`/shop?search=${searchQuery}`);
    }
  };

  const dropdownMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate("/profile")}>
        Profile
      </Menu.Item>
      <Menu.Item key="orders" onClick={() => navigate("/order")}>
        Orders
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <nav className="flex items-center justify-between p-6 shadow-md relative z-10">
        <Button
          className="text-2xl"
          icon={<MenuOutlined />}
          onClick={toggleMenu}
          type="text"
        />

        <Link
          to="/home"
          className="absolute left-1/2 transform -translate-x-1/2 text-5xl font-extrabold"
          style={{ fontFamily: "Dancing Script, cursive" }}
        >
          VibeWear
        </Link>

        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block">
            <Input
              placeholder="Search for products..."
              prefix={<FaSearch className="text-gray-500" />}
              className="lg:w-64 rounded-full bg-gray-100 text-sm border border-gray-300"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleSearchSubmit}
            />
          </div>

          {isAdmin && (
            <Link
              to="/admin"
              className="hidden lg:inline-block bg-black text-white text-sm px-4 py-1 rounded-full hover:bg-gray-800 transition"
            >
              Admin Panel
            </Link>
          )}

          <Dropdown
            overlay={dropdownMenu}
            trigger={isLoggedIn ? ["hover"] : []}
          >
            <div
              onClick={handleIconClick}
              className="text-xl cursor-pointer flex items-center"
            >
              <FaUser />
            </div>
          </Dropdown>

          <Link to="/cart" className="text-xl">
            <FaShoppingCart />
          </Link>
        </div>
      </nav>

      <Drawer
        placement="left"
        closable={false}
        onClose={closeMenu}
        visible={isOpen}
        width={250}
      >
        <ul className="flex flex-col gap-6 text-lg">
          <Link to="/home">
            <li className="cursor-pointer hover:bg-gray-300 p-2 rounded">
              Home
            </li>
          </Link>
          <Link to="/shop">
            <li className="cursor-pointer hover:bg-gray-300 p-2 rounded">
              Shop All
            </li>
          </Link>
          <Link to="/shop?gender=Men">
            <li className="cursor-pointer hover:bg-gray-300 p-2 rounded">
              Men
            </li>
          </Link>
          <Link to="/shop?gender=Women">
            <li className="cursor-pointer hover:bg-gray-300 p-2 rounded">
              Women
            </li>
          </Link>

          {isAdmin && (
            <Link to="/admin">
              <li className="cursor-pointer hover:bg-gray-300 hover:text-black p-2 rounded font-semibold bg-black text-white">
                Admin Panel
              </li>
            </Link>
          )}

          <div className="mt-4 lg:hidden">
            <Input
              placeholder="Search for products..."
              prefix={<FaSearch className="text-gray-500" />}
              className="w-full rounded-lg border border-gray-300"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleSearchSubmit}
            />
          </div>
        </ul>
      </Drawer>
    </>
  );
};

export default Navbar;
