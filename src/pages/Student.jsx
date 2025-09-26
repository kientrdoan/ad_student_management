import React, { useState } from "react";

export default function Student() {
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    identity_number: "",
    date_of_birth: "",
    password_hash: "",
    gender: "",
    role: "",
    url: "",
    vector_embedding: "",
    is_active: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data to send:", formData);
    // TODO: gọi API POST để lưu dữ liệu vào DB
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Thêm Student</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="border p-2 rounded"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          className="border p-2 rounded"
          name="first_name"
          placeholder="First name"
          value={formData.first_name}
          onChange={handleChange}
        />
        <input
          className="border p-2 rounded"
          name="last_name"
          placeholder="Last name"
          value={formData.last_name}
          onChange={handleChange}
        />
        <input
          className="border p-2 rounded"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          className="border p-2 rounded"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />
        <input
          className="border p-2 rounded"
          name="identity_number"
          placeholder="Identity Number"
          value={formData.identity_number}
          onChange={handleChange}
        />
        <input
          className="border p-2 rounded"
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
        />
        <input
          className="border p-2 rounded"
          type="password"
          name="password_hash"
          placeholder="Password"
          value={formData.password_hash}
          onChange={handleChange}
        />
        <input
          className="border p-2 rounded"
          name="gender"
          placeholder="Gender"
          value={formData.gender}
          onChange={handleChange}
        />
        <input
          className="border p-2 rounded"
          name="role"
          placeholder="Role"
          value={formData.role}
          onChange={handleChange}
        />
        <input
          className="border p-2 rounded"
          name="url"
          placeholder="URL"
          value={formData.url}
          onChange={handleChange}
        />
        <input
          className="border p-2 rounded"
          name="vector_embedding"
          placeholder="Vector Embedding"
          value={formData.vector_embedding}
          onChange={handleChange}
        />
        <label className="flex items-center space-x-2 col-span-2">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
          />
          <span>Is Active</span>
        </label>

        <button
          type="submit"
          className="col-span-2 bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded"
        >
          Lưu
        </button>
      </form>
    </div>
  );
}
