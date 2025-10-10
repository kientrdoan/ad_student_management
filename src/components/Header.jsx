import { FiUser } from "react-icons/fi"

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-white px-6 h-16 flex-shrink-0 shadow-sm border-b border-gray-200">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center">
            <FiUser className="text-white text-sm" />
          </div>
          <span className="text-gray-700 text-sm font-medium">Admin</span>
        </div>
      </div>
    </header>
  )
}
