import React, { useState, useEffect, useRef } from "react";
import { FaUser, FaShoppingCart, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Drawer, Button, Input, Dropdown, Menu } from "antd";
import { MenuOutlined, DownOutlined } from "@ant-design/icons";
import { useUser } from "../context/usercontext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const { isLoggedIn, isAdmin, logout } = useUser();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Close user dropdown when opening menu drawer
    setUserDropdownVisible(false);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleIconClick = () => {
    if (isLoggedIn) {
      // On mobile: toggle dropdown instead of navigation
      if (window.innerWidth < 1024) {
        setUserDropdownVisible(!userDropdownVisible);
      } else {
        navigate("/profile");
      }
    } else {
      navigate("/login");
    }
  };

  // Direct navigation functions without event parameters
  const goToProfile = () => {
    navigate("/profile");
    setUserDropdownVisible(false);
  };

  const goToOrders = () => {
    navigate("/order");
    setUserDropdownVisible(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setUserDropdownVisible(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      navigate(`/shop?search=${searchQuery}`);
      closeMenu();
    }
  };

  // Close dropdown when clicking anywhere on document
  useEffect(() => {
    const handleDocumentClick = () => {
      if (userDropdownVisible) {
        setUserDropdownVisible(false);
      }
    };

    // Use setTimeout to allow the current click event to finish
    // before adding the document click listener
    let timeoutId;
    if (userDropdownVisible) {
      timeoutId = setTimeout(() => {
        document.addEventListener("click", handleDocumentClick);
      }, 0);
    }

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [userDropdownVisible]);

  // Standard dropdown for desktop view
  const dropdownMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate("/profile")}>
        Profile
      </Menu.Item>
      <Menu.Item key="orders" onClick={() => navigate("/order")}>
        Orders
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        <span className="text-red-500">Logout</span>
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

          {/* Desktop: Use Ant Design Dropdown */}
          <div className="hidden lg:block">
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
          </div>

          {/* Mobile: User icon */}
          <div className="lg:hidden">
            <div
              onClick={(e) => {
                e.stopPropagation(); // Stop event from bubbling
                handleIconClick();
              }}
              className="text-xl cursor-pointer flex items-center relative"
            >
              <FaUser />
            </div>
          </div>

          <Link to="/cart" className="text-xl">
            <FaShoppingCart />
          </Link>
        </div>
      </nav>

      {/* Mobile user dropdown - completely separate from other components */}
      {isLoggedIn && userDropdownVisible && (
        <div
          className="fixed top-16 right-16 bg-white shadow-lg rounded-md py-2 w-32 z-50"
          onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling up
        >
          <Link to="/profile" className="block">
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={goToProfile}
            >
              Profile
            </div>
          </Link>

          <Link to="/order" className="block">
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={goToOrders}
            >
              Orders
            </div>
          </Link>

          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
            onClick={handleLogout}
          >
            Logout
          </div>
        </div>
      )}

      <Drawer
        placement="left"
        closable={false}
        onClose={closeMenu}
        open={isOpen}
        width={250}
      >
        <ul className="flex flex-col gap-6 text-lg">
          <Link to="/home" onClick={closeMenu}>
            <li className="cursor-pointer hover:bg-gray-300 p-2 rounded">
              Home
            </li>
          </Link>
          <Link to="/shop" onClick={closeMenu}>
            <li className="cursor-pointer hover:bg-gray-300 p-2 rounded">
              Shop All
            </li>
          </Link>
          <Link to="/shop?gender=Men" onClick={closeMenu}>
            <li className="cursor-pointer hover:bg-gray-300 p-2 rounded">
              Men
            </li>
          </Link>
          <Link to="/shop?gender=Women" onClick={closeMenu}>
            <li className="cursor-pointer hover:bg-gray-300 p-2 rounded">
              Women
            </li>
          </Link>

          {isAdmin && (
            <Link to="/admin" onClick={closeMenu}>
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
