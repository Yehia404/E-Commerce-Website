import React, { useState, useEffect } from "react";
import { FaUser, FaShoppingCart, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Drawer, Button, Input, Dropdown, Menu } from "antd";
import { MenuOutlined, DownOutlined } from "@ant-design/icons";
import { useUser } from "../context/usercontext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const navigate = useNavigate();

  const { isLoggedIn, isAdmin, logout } = useUser();

  // Track window size for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);

      // Auto-close the user dropdown when switching to desktop
      if (window.innerWidth >= 1024) {
        setUserDropdownVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleIconClick = () => {
    if (isLoggedIn) {
      // On mobile: toggle dropdown instead of navigation
      if (isMobile) {
        setUserDropdownVisible(!userDropdownVisible);
      } else {
        navigate("/profile");
      }
    } else {
      navigate("/login");
    }
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
      closeMenu(); // Close the menu if open
    }
  };

  const handleMenuClick = (path) => {
    navigate(path);
    setUserDropdownVisible(false);
  };

  // Mobile dropdown that appears below the user icon
  const MobileUserDropdown = () => {
    if (!isLoggedIn || !userDropdownVisible) return null;

    return (
      <div className="absolute right-16 top-16 bg-white shadow-lg rounded-md py-2 z-20 w-32 lg:hidden">
        <div
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => handleMenuClick("/profile")}
        >
          Profile
        </div>
        <div
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => handleMenuClick("/order")}
        >
          Orders
        </div>
        <div
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
          onClick={handleLogout}
        >
          Logout
        </div>
      </div>
    );
  };

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

          {/* Mobile: Use custom dropdown with absolute positioning */}
          <div className="lg:hidden">
            <div
              onClick={handleIconClick}
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

      {/* Mobile user dropdown */}
      <MobileUserDropdown />

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

          {/* Admin Panel button only on mobile (using the state instead of media query) */}
          {isAdmin && isMobile && (
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
