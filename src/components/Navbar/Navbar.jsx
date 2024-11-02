import React from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import { MenuOutlined } from "@ant-design/icons";

const Navbar = () => {
  const { Header } = Layout;
  const menuItems = [
    {
      key: "1",
      label: (
        <>
          <SignedOut>
            <Link to="/login" className=" hover:text-gray-900">
              Login
            </Link>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard" className="hover:text-gray-900">
              Dashboard
            </Link>
          </SignedIn>
        </>
      ),
    },
    {
      key: "4",
      label: (
        <>
          <SignedOut>
            <Link to="/register" className="hover:text-gray-900">
              Register
            </Link>
          </SignedOut>
        </>
      ),
    },
  ];

  return (
    <>
      <Header className="bg-white flex items-center shadow-sm">
        <Link
          to="/"
          className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
        >
          <span className="ml-3 text-xl">QuickLator</span>
        </Link>
        <Menu
          theme="light"
          mode="horizontal"
          items={menuItems}
          className="flex-1 justify-end min-w-0"
          overflowedIndicator={<MenuOutlined />}
        />
        <div className="userAccount flex">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>
    </>
  );
};

export default Navbar;
