import React, { useEffect, useState } from "react";
import { useFetchAllCustomersQuery, useDeleteCustomerMutation } from "../../features/ApplicationApi";
import { useNavigate } from "react-router-dom";
import { appApi } from "../../features/ApplicationApi";
import { useDispatch } from "react-redux";
import logoImg from "../../assets/LOG.png";

const ListOut = () => {
  const { data, isLoading, isError, error, refetch } = useFetchAllCustomersQuery();
  const [deleteCustomer] = useDeleteCustomerMutation();

  useEffect(() => {
    refetch();
    
  }, []);
  
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handlePrint = async (item) => {
    let transactions = [];
    try {
      const result = await dispatch(
        appApi.endpoints.fetchCustomerTransactions.initiate(item.customer_id)
      );
      transactions = result?.data?.data || result?.data || [];
    } catch (_) {}

    const txRows = transactions.length > 0
      ? transactions.map((t, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${t.bill_no || "-"}</td>
            <td>${t.bill_date ? new Date(t.bill_date).toLocaleDateString() : "-"}</td>
            <td>${t.due_date ? new Date(t.due_date).toLocaleDateString() : "N/A"}</td>
            <td>₹ ${t.emi_amount || "0"}</td>
            <td>₹ ${t.late_fee || "0"}</td>
            <td>₹ ${t.other_charge || "0"}</td>
            <td>₹ ${t.payable_amount || "0"}</td>
            <td>₹ ${t.current_balance || "0"}</td>
            <td><span style="color:${t.payment_status === 'Completed' ? '#7c3aed' : t.payment_status === 'Active' ? 'orange' : 'green'};font-weight:bold">${t.payment_status || "Active"}</span></td>
          </tr>`).join("")
      : `<tr><td colspan="10" style="text-align:center;color:#999">No transactions found</td></tr>`;

    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Transactions - ${item.first_name} ${item.last_name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; color: #333; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .watermark { position: fixed; top: 20%; left: 25%; width: 300px; opacity: 0.08; transform: rotate(-45deg); pointer-events: none; z-index: 0; }
          .wrapper { position: relative; z-index: 1; }
          .header { text-align: center; border-bottom: 2px solid #1d4ed8; padding-bottom: 12px; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #1d4ed8; }
          .info { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; margin-bottom: 20px; font-size: 13px; }
          .info span { font-weight: bold; color: #555; }
          .section-title { font-size: 14px; font-weight: bold; background: #1d4ed8; color: white; padding: 6px 12px; border-radius: 4px; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th { background: #1d4ed8; color: white; padding: 8px 6px; text-align: left; }
          td { padding: 7px 6px; border-bottom: 1px solid #eee; }
          tr:nth-child(even) { background: #f8f9ff; }
          .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 10px; }
          @media print { body { padding: 15px; } }
        </style>
      </head>
      <body>
        <img class="watermark" src="${logoImg}" alt="Logo watermark" />
        <div class="wrapper">
          <div class="header">
            <div class="logo">SRI VINAYAGA FINANCE</div>
            <div style="font-size:13px;color:#666;margin-top:4px">Customer Transaction History</div>
          </div>
        <div class="info">
          <div><span>Customer ID:</span> ${item.customer_id || "N/A"}</div>
          <div><span>Name:</span> ${item.first_name || ""} ${item.last_name || ""}</div>
          <div><span>Phone:</span> ${item.phone || "N/A"}</div>
          <div><span>Vehicle Reg No:</span> ${item.vehicle_reg_no || "N/A"}</div>
          <div><span>Loan Amount:</span> ₹ ${item.loan_amount || "0"}</div>
          <div><span>EMI Amount:</span> ₹ ${item.emi_amount || "0"}</div>
          <div><span>Tenure:</span> ${item.tenure_months || "N/A"} months</div>
          <div><span>Current Balance:</span> ₹ ${item.current_balance || "0"}</div>
          <div><span>Loan Status:</span> <b style="color:${item.loan_status?.toLowerCase() === 'active' ? 'green' : 'red'}">${item.loan_status || "N/A"}</b></div>
          <div><span>Printed On:</span> ${new Date().toLocaleString()}</div>
        </div>
        <div class="section-title">Transaction List (${transactions.length} records)</div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Receipt No</th>
              <th>Payment Date</th>
              <th>Due Date</th>
              <th>EMI Amount</th>
              <th>Late Fee</th>
              <th>Other Charges</th>
              <th>Payable Amount</th>
              <th>Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${txRows}</tbody>
        </table>
        <div class="footer">SRI VINAYAGA FINANCE &copy; ${new Date().getFullYear()} &nbsp;|&nbsp; 60/11, Ushwan Beevi Complex, K.K. Road, Sayalgudi - 623120</div>
        </div>
        <script>window.onload = () => { window.print(); }<\/script>
      </body>
      </html>
    `);
    win.document.close();
  };
  


  const [search, setSearch] = useState("");
  const customers = data || [];
  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.customer_id || "").toLowerCase().includes(q) ||
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(q) ||
      (c.phone || "").toLowerCase().includes(q) ||
      (c.registration_no || "").toLowerCase().includes(q)
    );
  });

  if (isLoading) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">
        Loading customers...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        {error?.data?.message || "Failed to fetch data"}
      </div>
    );
  }

  const handleActionChange = async (e, item) => {
    const value = e.target.value;
    e.target.value = "";

    if (value === "update") {
      navigate("/edit-customer/" + item.customer_id, { state: item });
      return;
    }

    if (value === "print") {
      handlePrint(item);
      return;
    }

    if (value === "delete") {
      if (!window.confirm(`Delete ${item.first_name} ${item.last_name}?`)) return;
      try {
        await deleteCustomer(item.customer_id).unwrap();
        refetch();
      } catch (err) {
        alert("Failed to delete: " + (err?.data?.message || "Server error"));
      }
    }
  };
  

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Customer Complete Details
      </h1>

      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search by name, ID, phone, reg no..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 px-4 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">Customer ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">email</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">Loan Amount</th>
              <th className="p-3">Balance</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="p-3">{item.customer_id || "N/A"}</td>

                  

                  <td className="p-3 font-medium">
                    {item.first_name || ""} {item.last_name || ""}
                  </td>

                  <td className="p-3">{item.phone || "N/A"}</td>
                  <td className="p-3">{item.email || "N/A"}</td>


                  <td className="p-3">
                    {item.vehicle_model || "N/A"} {item.vehicle_color || "N/A"} {item.vehicle_version || "N/A"} {item.registration_no || "N/A"}
                  </td>

                  <td className="p-3">₹ {item.loan_amount || "0"}</td>


                  

                 


                  <td className="p-3 font-semibold">
                    ₹ {item.current_balance || "0"}
                  </td>
                  <td className="p-3">
                  <select 
                    className="p-2 border rounded text-sm bg-gray-50"
                    onChange={(e) => handleActionChange(e, item)}
                    defaultValue=""
                  >
                    <option value="" disabled>Actions</option>
                    <option value="update" className="text-blue-600">Update</option>
                    <option value="print" className="text-green-600">Print Details</option>
                    <option value="delete" className="text-red-600">Delete</option>
                  </select>
                </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="p-4 text-center text-gray-500">
                  {search ? `No results for "${search}"` : "No customers found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListOut;