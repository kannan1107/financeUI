import React, { useState } from "react";
import { useRegisterMutation } from "../../features/ApplicationApi";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const [register, { isLoading, error }] = useRegisterMutation();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending registration data:", formData);
    try {
      const result = await register(formData).unwrap();
      console.log("Registration successful:", result);
      alert("User Registered Successfully!");
      setFormData({ name: "", email: "", password: "", role: "" });
    } catch (err) {
      console.error("Registration failed:", err);

      let errorMessage = err.data?.message || err.error || err.message || "Unknown error";

      if (err.status === "PARSING_ERROR" && err.originalStatus === 404) {
        errorMessage = "Server endpoint not found (404). Please check if the backend server is running and the route exists.";
      } else {
        console.error("Error details:", err.data);
      }

      alert("Registration failed: " + errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">User Registration</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error.status === "PARSING_ERROR" && error.originalStatus === 404
              ? "Server endpoint not found (404). Please check if the backend server is running and the route exists."
              : error.data?.message || "Registration failed"}
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;