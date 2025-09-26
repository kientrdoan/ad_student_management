import React from "react";
import { FiMenu, FiMail } from "react-icons/fi";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-gray-100 px-4 h-14 shadow">

    <div></div>

      {/* Khu vực bên phải */}
      <div className="flex items-center space-x-4">
        {/* Icon thông báo / mail */}
        {/* <div className="relative">
          <FiMail size={20} className="text-gray-600 hover:text-gray-800" />
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            6
          </span>
        </div> */}

        {/* Avatar + tên */}
        <div className="flex items-center space-x-2 cursor-pointer">
          {/* <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover"
          /> */}
          <span className="text-gray-700 text-sm font-medium">Admin</span>
        </div>
      </div>
    </header>
  );
}
