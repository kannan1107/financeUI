import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUpdateCustomerMutation } from "../../features/ApplicationApi";

const UpdateCustomer = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [updateCustomer] = useUpdateCustomerMutation();

  const [form, setForm] = useState({
    customer_id: state?.customer_id || "",
    first_name: state?.first_name || "",
    last_name: state?.last_name || "",
    email: state?.email || "",
    phone: state?.phone || "",
    loan_id: state?.loan_id || "",
    loan_amount: state?.loan_amount || "",
    loan_status: state?.loan_status || "",
    vehicle_loan_id: state?.vehicle_loan_id || "",
    vehicle_model: state?.vehicle_model || "",
    vehicle_type: state?.vehicle_type || "",
    emi_id: state?.emi_id || "",
    emi_amount: state?.emi_amount || "",
    due_date: state?.due_date ? new Date(state.due_date).toISOString().split("T")[0] : "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCustomer({ id: form.customer_id, ...form }).unwrap();
      alert("Customer updated successfully");
      navigate("/list");
    } catch (err) {
      alert("Update failed: " + (err?.data?.message || "Server error"));
    }
  };

  const fields = [
    { label: "Customer ID", name: "customer_id", disabled: true },
    { label: "First Name", name: "first_name" },
    { label: "Last Name", name: "last_name" },
    { label: "Email", name: "email", type: "email" },
    { label: "Phone", name: "phone" },
    { label: "Loan ID", name: "loan_id", disabled: true },
    { label: "Loan Amount", name: "loan_amount", type: "number" },
    { label: "Loan Status", name: "loan_status", type: "select", options: ["Active", "Closed", "Defaulted"] },
    { label: "Vehicle Loan ID", name: "vehicle_loan_id", disabled: true },
    { label: "Vehicle Model", name: "vehicle_model" },
    { label: "Vehicle Type", name: "vehicle_type" },
    { label: "EMI ID", name: "emi_id", disabled: true },
    { label: "EMI Amount", name: "emi_amount", type: "number" },
    { label: "Due Date", name: "due_date", type: "date" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-20">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Update Customer
        </h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {fields.map(({ label, name, type = "text", disabled, options }) => (
            <div key={name} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">{label}</label>
              {type === "select" ? (
                <select
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  disabled={disabled}
                  className={`border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${disabled ? "bg-gray-100 text-gray-500" : ""}`}
                />
              )}
            </div>
          ))}
          <div className="col-span-2 flex gap-4 mt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => navigate("/list")}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCustomer;
