import React, { useState } from "react";
import { useAddCustomerMutation } from "../../features/ApplicationApi";

const NewCustomer = () => {
  const [addCustomer, { isLoading }] = useAddCustomerMutation();
  const [formData, setFormData] = useState({
    customerId: "",
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    date_of_birth: "",
    phone: "",
    address: "",
    photo: "",
    aadhaar: "",
    secureMobile: "",
    GuarantorName: "",
    GuarantorMobile: "",
    GuarantorAddress: "",
    GuarantorAathaar: "",
    total_amount: "",
    down_amount: "",
    loan_amount: "",
    interest_rate: "",
    tenure_months: "",
    emi_amount: "",
    repayment_frequency: "",
    due_date: "",
    vehicle_type: "",
    vehicle_model: "",
    vehicle_version: "",
    vehicle_color: "",
    vehicle_engine: "",
    vehicle_chassis: "",
    vehicle_dealer: "",
    registration_number: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-calculate loan amount when total_amount or down_amount changes
      if (name === 'total_amount' || name === 'down_amount') {
        const total = parseFloat(name === 'total_amount' ? value : updated.total_amount) || 0;
        const down = parseFloat(name === 'down_amount' ? value : updated.down_amount) || 0;
        updated.loan_amount = Math.max(0, total - down).toString();
      }
      
      // Auto-calculate EMI when loan_amount, interest_rate, or tenure_months changes
      if (name === 'loan_amount' || name === 'interest_rate' || name === 'tenure_months' || 
          (name === 'total_amount' || name === 'down_amount')) {
        const principal = parseFloat(updated.loan_amount) || 0;
        const rate = parseFloat(updated.interest_rate) || 0;
        const tenure = parseInt(updated.tenure_months) || 0;
        
        if (principal > 0 && rate > 0 && tenure > 0) {
          const monthlyRate = rate / 100 / 12;
          const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                     (Math.pow(1 + monthlyRate, tenure) - 1);
          updated.emi_amount = Math.round(emi).toString();
        }
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await addCustomer(formData).unwrap();
      console.log("Customer created successfully:", result);
      alert("Customer created successfully!");
      // Reset form
      setFormData({
        customerId: "", first_name: "", last_name: "", email: "", gender: "",
        date_of_birth: "", phone: "", address: "", photo: "", aadhaar: "",
        secureMobile: "", GuarantorName: "", GuarantorMobile: "", GuarantorAddress: "",
        GuarantorAathaar: "", total_amount: "", down_amount: "", loan_amount: "",
        interest_rate: "", tenure_months: "", emi_amount: "", repayment_frequency: "",
        due_date: "", vehicle_type: "", vehicle_model: "", vehicle_version: "",
        vehicle_color: "", vehicle_engine: "", vehicle_chassis: "", vehicle_dealer: "",
        registration_number: ""
      });
    } catch (err) {
      console.error("Failed to create customer:", err);
      alert("Failed to create customer: " + (err.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">New Customer Registration</h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
          {/* Personal Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select name="customerId" value={formData.customerId} onChange={handleChange} className="p-3 border rounded" required>
                <option value="">Select Customer ID Type</option>
                <option value={`N2W${new Date().getFullYear()}`}>N2W{new Date().getFullYear()}</option>
                <option value={`O2W${new Date().getFullYear()}`}>O2W{new Date().getFullYear()}</option>
                <option value={`N3W${new Date().getFullYear()}`}>N3W{new Date().getFullYear()}</option>
                <option value={`O3W${new Date().getFullYear()}`}>O3W{new Date().getFullYear()}</option>
                <option value={`N4W${new Date().getFullYear()}`}>N4W{new Date().getFullYear()}</option>
                <option value={`O4W${new Date().getFullYear()}`}>O4W{new Date().getFullYear()}</option>
              </select>
              <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" className="p-3 border rounded" required />
              <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" className="p-3 border rounded" required />
              <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="p-3 border rounded" required />
              <select name="gender" value={formData.gender} onChange={handleChange} className="p-3 border rounded" required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} className="p-3 border rounded" required />
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="p-3 border rounded" required />
              <input name="secureMobile" value={formData.secureMobile} onChange={handleChange} placeholder="Secure Mobile" className="p-3 border rounded" />
              <input name="aadhaar" value={formData.aadhaar} onChange={handleChange} placeholder="Aadhaar Number" className="p-3 border rounded" />
              <input name="photo" value={formData.photo} onChange={handleChange} placeholder="Photo URL" className="p-3 border rounded" />
            </div>
            <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full p-3 border rounded mt-4" rows="3"></textarea>
          </div>

          {/* Guarantor Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-green-600">Guarantor Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="GuarantorName" value={formData.GuarantorName} onChange={handleChange} placeholder="Guarantor Name" className="p-3 border rounded" />
              <input name="GuarantorMobile" value={formData.GuarantorMobile} onChange={handleChange} placeholder="Guarantor Mobile" className="p-3 border rounded" />
              <input name="GuarantorAathaar" value={formData.GuarantorAathaar} onChange={handleChange} placeholder="Guarantor Aadhaar" className="p-3 border rounded" />
            </div>
            <textarea name="GuarantorAddress" value={formData.GuarantorAddress} onChange={handleChange} placeholder="Guarantor Address" className="w-full p-3 border rounded mt-4" rows="2"></textarea>
          </div>

          {/* Loan Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">Loan Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="total_amount" type="number" value={formData.total_amount} onChange={handleChange} placeholder="Total Amount" className="p-3 border rounded" />
              <input name="down_amount" type="number" value={formData.down_amount} onChange={handleChange} placeholder="Down Payment" className="p-3 border rounded" />
              <input name="loan_amount" type="number" value={formData.loan_amount} onChange={handleChange} placeholder="Loan Amount" className="p-3 border rounded bg-gray-100" readOnly />
              <input name="interest_rate" type="number" step="0.01" value={formData.interest_rate} onChange={handleChange} placeholder="Interest Rate %" className="p-3 border rounded" />
              <input name="tenure_months" type="number" value={formData.tenure_months} onChange={handleChange} placeholder="Tenure (Months)" className="p-3 border rounded" />
              <input name="emi_amount" type="number" value={formData.emi_amount} onChange={handleChange} placeholder="EMI Amount" className="p-3 border rounded bg-gray-100" readOnly />
              <select name="repayment_frequency" value={formData.repayment_frequency} onChange={handleChange} className="p-3 border rounded">
                <option value="">Repayment Frequency</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
              <input name="due_date" type="date" value={formData.due_date} onChange={handleChange} className="p-3 border rounded" />
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-orange-600">Vehicle Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} placeholder="Vehicle Type" className="p-3 border rounded" />
              <input name="vehicle_model" value={formData.vehicle_model} onChange={handleChange} placeholder="Vehicle Model" className="p-3 border rounded" />
              <input name="vehicle_version" value={formData.vehicle_version} onChange={handleChange} placeholder="Vehicle Version" className="p-3 border rounded" />
              <input name="vehicle_color" value={formData.vehicle_color} onChange={handleChange} placeholder="Vehicle Color" className="p-3 border rounded" />
              <input name="vehicle_engine" value={formData.vehicle_engine} onChange={handleChange} placeholder="Engine Number" className="p-3 border rounded" />
              <input name="vehicle_chassis" value={formData.vehicle_chassis} onChange={handleChange} placeholder="Chassis Number" className="p-3 border rounded" />
              <input name="vehicle_dealer" value={formData.vehicle_dealer} onChange={handleChange} placeholder="Dealer Name" className="p-3 border rounded" />
              <input name="registration_number" value={formData.registration_number} onChange={handleChange} placeholder="Registration Number" className="p-3 border rounded" />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50" disabled={isLoading}>
            {isLoading ? "Creating Customer..." : "Create Customer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewCustomer;
