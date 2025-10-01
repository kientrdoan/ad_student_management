import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/" },
  { name: "Departments", path: "/departments" },
  { name: "Majors", path: "/majors" },
  { name: "Class", path: "/class" },
  { name: "Students", path: "/students" },
  { name: "Teachers", path: "/teachers" },
  { name: "courses", path: "/courses" },
  { name: "semester", path: "/semester" },
];

export default function SlideBar() {
 
  return (
    <div className="flex">
      <div
        className={`bg-gray-800 text-white h-screen p-4 pt-6 transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-xl font-bold`}>Admin</h1>
        </div>

        {/* Menu list */}
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block p-2 rounded-md hover:bg-gray-700 transition ${
                    isActive ? "bg-gray-700 font-semibold" : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
