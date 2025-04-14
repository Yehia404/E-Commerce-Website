import React, { useState } from "react";
import { FaUser, FaShoppingCart, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Drawer, Button, Input } from "antd";
import { MenuOutlined } from "@ant-design/icons";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the side menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when clicked outside
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 shadow-md relative z-10">
        {/* Hamburger Menu Icon (Visible on all screen sizes) */}
        <Button
          className="text-2xl"
          icon={<MenuOutlined />}
          onClick={toggleMenu}
          type="text"
        />

        {/* Logo */}
        <Link
          to="/home"
          className="absolute left-1/2 transform -translate-x-1/2 text-5xl font-extrabold"
          style={{
            fontFamily: "Dancing Script, cursive",
          }}
        >
          VibeWear
        </Link>

        {/* Search + Icons*/}
        <div className="flex items-center gap-6">
          {/* Search Bar */}
          <div className="relative hidden lg:block">
            <Input
              placeholder="Search for products..."
              prefix={<FaSearch className="text-gray-500" />}
              className="lg:w-64 rounded-full bg-gray-100 text-sm border border-gray-300"
            />
          </div>

          {/* User Icon */}
          <Link to="/login" className="text-xl">
            <FaUser />
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="text-xl">
            <FaShoppingCart />
          </Link>
        </div>
      </nav>

      {/* Drawer Menu*/}
      <Drawer
        placement="left"
        closable={false}
        onClose={closeMenu}
        visible={isOpen}
        width={250}
      >
        <ul className="flex flex-col gap-6 text-lg">
          <li className="cursor-pointer hover:bg-gray-300 p-2 rounded">
            <Link to="/shop">Shop All</Link>
          </li>
          <li className="cursor-pointer hover:bg-gray-300 p-2 rounded">
            <Link to="/on-sale">On Sale</Link>
          </li>
          <li className="cursor-pointer hover:bg-gray-300 p-2 rounded">
            <Link to="/new-arrivals">Men</Link>
          </li>
          <li className="cursor-pointer hover:bg-gray-300 p-2 rounded">
            <Link to="/brands">Women</Link>
          </li>

          {/* Search Bar Inside the Drawer*/}
          <div className="mt-4 lg:hidden">
            <Input
              placeholder="Search for products..."
              prefix={<FaSearch className="text-gray-500" />}
              className="w-full rounded-lg border border-gray-300"
            />
          </div>
        </ul>
      </Drawer>
    </>
  );
};

export default Navbar;
