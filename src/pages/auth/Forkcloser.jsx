import React, { useState } from "react";
import { useFetchAllCustomersQuery, useFetchCustomerTransactionsQuery, useForecloseLoanMutation } from "../../features/ApplicationApi";
import logoImg from "../../assets/LOG.png";
import { FaSearch, FaCalculator, FaTimes, FaCheckCircle, FaUser, FaInfoCircle, FaWallet, FaHistory, FaFilePdf } from "react-icons/fa";

const Forkcloser = () => {
  const { data: customers = [], isLoading } = useFetchAllCustomersQuery();
  const [forecloseLoan, { isLoading: isProcessing }] = useForecloseLoanMutation();

  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [foreclosureData, setForeclosureData] = useState({
    discount: 0,
    additionalCharges: 0,
    remarks: ""
  });

  const selectedCustomerId = selectedCustomer?.customer_id || "";
  const { data: transactionData, isFetching: isTransactionsLoading } = useFetchCustomerTransactionsQuery(
    selectedCustomerId,
    { skip: !selectedCustomerId }
  );

  const transactions = Array.isArray(transactionData)
    ? transactionData
    : transactionData?.data || [];

  const emiPayments = transactions.filter((transaction) => {
    const status = (transaction.payment_status || "").toLowerCase();
    const paidAmount = parseFloat(transaction.amount_paid || transaction.payable_amount || transaction.emi_amount || 0);

    return status !== "closed" && paidAmount > 0;
  });

  const searchQuery = search.trim().toLowerCase();
  const filteredCustomers = searchQuery
    ? customers.filter(c => {
      const status = (c.loan_status || c.payment_status || "").toLowerCase();
      const isClosed = ["closed", "completed", "foreclosed"].includes(status);
      if (isClosed) return false;

      return `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchQuery) ||
        (c.customer_id || "").toLowerCase().includes(searchQuery);
    })
    : [];

  const handleSelect = (customer) => {
    setSelectedCustomer(customer);
    setForeclosureData({ discount: 0, additionalCharges: 0, remarks: "" });
  };

  const calculatePaidEmis = () => {
    if (!selectedCustomer) return 0;
    const tenure = parseInt(selectedCustomer.tenure_months || 0);
    return Math.min(tenure, emiPayments.length);
  };

  const calculateRemainingEmis = () => {
    if (!selectedCustomer) return 0;
    const tenure = parseInt(selectedCustomer.tenure_months || 0);
    return Math.max(0, tenure - calculatePaidEmis());
  };

  const calculateBalanceEmiAmount = () => {
    if (!selectedCustomer) return 0;
    const emiAmount = parseFloat(selectedCustomer.emi_amount || 0);
    return calculateRemainingEmis() * emiAmount;
  };

  const calculateSubtotal = () => {
    const balanceEmiAmount = calculateBalanceEmiAmount();
    const foreclosureCharge = parseFloat(foreclosureData.additionalCharges || 0);
    return balanceEmiAmount + foreclosureCharge;
  };

  const calculateTotal = () => {
    if (!selectedCustomer) return 0;
    const discountPercent = Math.min(100, Math.max(0, parseFloat(foreclosureData.discount || 0)));
    const subtotal = calculateSubtotal();
    const discountAmount = (subtotal * discountPercent) / 100;
    return Math.max(0, subtotal - discountAmount).toFixed(2);
  };

  const calculateDiscountAmount = () => {
    if (!selectedCustomer) return "0.00";
    const discountPercent = Math.min(100, Math.max(0, parseFloat(foreclosureData.discount || 0)));
    return ((calculateSubtotal() * discountPercent) / 100).toFixed(2);
  };

  const numberToWords = (amount) => {
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const toWords = (n) => {
      if (n === 0) return "";
      if (n < 20) return ones[n] + " ";
      if (n < 100) return tens[Math.floor(n / 10)] + " " + ones[n % 10] + " ";
      if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred " + toWords(n % 100);
      if (n < 100000) return toWords(Math.floor(n / 1000)) + "Thousand " + toWords(n % 1000);
      if (n < 10000000) return toWords(Math.floor(n / 100000)) + "Lakh " + toWords(n % 100000);
      return toWords(Math.floor(n / 10000000)) + "Crore " + toWords(n % 10000000);
    };
    const num = parseFloat(amount);
    if (isNaN(num) || num === 0) return "Zero";
    const rupees = Math.floor(num);
    const paise = Math.round((num - rupees) * 100);
    let result = toWords(rupees).trim() + " Rupees";
    if (paise > 0) result += " and " + toWords(paise).trim() + " Paise";
    return `${num} (${result})`;
  };

  const formatDate = (dateValue) => {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString('en-GB');
  };

  const toBase64 = (url, alpha = 1, rotation = 0) => new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const radians = rotation * Math.PI / 180;
      const cos = Math.abs(Math.cos(radians));
      const sin = Math.abs(Math.sin(radians));
      const width = img.width * cos + img.height * sin;
      const height = img.width * sin + img.height * cos;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.globalAlpha = alpha;
      ctx.translate(width / 2, height / 2);
      ctx.rotate(radians);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      resolve(canvas.toDataURL("image/png"));
    };
    img.src = url;
  });

  const generatePDF = async (customer, settlementAmount, remarks) => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const watermarkBase64 = await toBase64(logoImg, 0.08, -45);
    const logoBase64 = await toBase64(logoImg, 1, 0);
    const today = new Date();
    const settlementDate = formatDate(today);

    doc.addImage(watermarkBase64, "PNG", 25, 70, 140, 140);
    doc.addImage(logoBase64, "PNG", 15, 10, 30, 30);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("SRI VINAYAGA FINANCE", 105, 14, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("60/11, Ushwan Beevi Complex, K.K. Road, Sayalgudi - 623120", 105, 20, { align: "center" });
    doc.text("Cell: 9840797266, 8190980810 | Email: info@vinayagafinance.com", 105, 25, { align: "center" });
    doc.setLineWidth(0.5);
    doc.line(15, 34, 195, 34);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Loan Foreclosure Statement", 105, 44, { align: "center" });

    let y = 54;
    const addRowAt = (label, value, x, rowY) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, x, rowY);
      doc.setFont("helvetica", "normal");
      doc.text(`${value}`, x + 45, rowY);
    };

    y += 4;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Customer & Vehicle Details", 15, y);
    doc.text("Loan & Settlement Details", 110, y);
    y += 8;

    const leftX = 15;
    const rightX = 110;
    const lineHeight = 7;
    const leftRows = [
      ["Customer Name", `${customer.first_name} ${customer.last_name}`],
      ["Customer ID", customer.customer_id || "N/A"],
      ["Phone", customer.phone || "N/A"],
      ["Address", customer.address || "N/A"],
      ["Vehicle Reg No", customer.registration_no || customer.vehicle_reg_no || "N/A"],
      ["Vehicle Model", customer.vehicle_model || customer.vehicle_name || "N/A"],
    ];
    const rightRows = [
      ["Closure Date", settlementDate],
      ["Printed On", settlementDate],
      ["Loan Amount", `₹${parseFloat(customer.loan_amount || 0).toFixed(2)}`],
      ["EMI Amount", `₹${parseFloat(customer.emi_amount || 0).toFixed(2)}`],
      ["Tenure", `${customer.tenure_months || 0} months`],
      ["Paid Amount", `₹${(parseFloat(customer.loan_amount || 0) - parseFloat(customer.current_balance || 0)).toFixed(2)}`],
      ["Current Balance", `₹${parseFloat(customer.current_balance || 0).toFixed(2)}`],
      ["Balance EMI Amount", `₹${calculateBalanceEmiAmount().toFixed(2)}`],
      ["Foreclosure Charges", `₹${parseFloat(foreclosureData.additionalCharges || 0).toFixed(2)}`],
      ["Discount / Waiver", `${parseFloat(foreclosureData.discount || 0).toFixed(2)}% (₹${calculateDiscountAmount()})`],
      ["Settlement Amount", `₹${settlementAmount}`],
    ];

    let leftY = y;
    let rightY = y;
    leftRows.forEach(([label, value]) => {
      addRowAt(label, value, leftX, leftY);
      leftY += lineHeight;
    });
    rightRows.forEach(([label, value]) => {
      addRowAt(label, value, rightX, rightY);
      rightY += lineHeight;
    });

    y = Math.max(leftY, rightY) + 8;
    doc.setFont("helvetica", "bold");
    doc.text("Remarks", 15, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    const remarkLines = doc.splitTextToSize(remarks || "-", 170);
    doc.text(remarkLines, 15, y);

    y += remarkLines.length * 7 + 10;
    doc.setFontSize(10);
    doc.text("This foreclosure statement confirms the loan account closure and settlement for the customer listed above.", 15, y);
    y += 7;
    doc.text("Please retain this document for your records.", 15, y);

    y += 18;
    doc.setFont("helvetica", "bold");
    doc.text("Authorized Signatory", 150, y);

    doc.save(`Foreclosure_${customer.customer_id || 'statement'}.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to proceed with Foreclosure? This will permanently close the loan account.")) return;

    try {
      const totalSettlement = parseFloat(calculateTotal());
      await forecloseLoan({
        customer_id: selectedCustomer.customer_id,
        customerId: selectedCustomer.customer_id,
        loanId: selectedCustomer?.loan_id || selectedCustomer.customer_id,
        amount_paid: totalSettlement,
        current_balance: 0, // Ensure backend handles number
        payment_status: "Closed",
        loan_status: "Closed",
        payment_date: new Date().toISOString().split("T")[0],
        other_charge: parseFloat(foreclosureData.additionalCharges || 0),
        remarks: foreclosureData.remarks || "Foreclosure settlement"
      }).unwrap();
      await generatePDF(selectedCustomer, totalSettlement, foreclosureData.remarks);

      alert("Loan Foreclosed and Account Closed Successfully!");
      setSelectedCustomer(null);
      setSearch("");
    } catch (err) {
      alert("Foreclosure failed: " + (err?.data?.message || "Server error"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          <FaCalculator className="text-blue-600" /> Loan Foreclosure
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Selection Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Find Customer</h2>
            <div className="relative mb-4">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search Name or ID..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="max-h-[500px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {isLoading ? (
                <p className="text-center text-gray-500 py-4">Loading customers...</p>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => (
                  <button
                    key={c.customer_id}
                    onClick={() => handleSelect(c)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${selectedCustomer?.customer_id === c.customer_id
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white hover:bg-blue-50 border-gray-100"
                      }`}
                  >
                    <p className="font-bold flex items-center gap-2"><FaUser className="text-xs" /> {c.first_name} {c.last_name}</p>
                    <p className="text-xs opacity-80 mt-1">{c.customer_id} | Balance: ₹{c.current_balance}</p>
                  </button>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No records found</p>
              )}
            </div>
          </div>

          {/* Calculation Form */}
          <div className="lg:col-span-2">
            {selectedCustomer ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-wider">{selectedCustomer.first_name} {selectedCustomer.last_name}</h2>
                    <p className="text-sm opacity-90">{selectedCustomer.customer_id}</p>
                  </div>
                  <button onClick={() => setSelectedCustomer(null)} className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors">
                    <FaTimes size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                  {/* Pre-calculate corrected values */}
                  {(() => {
                    const tenure = parseInt(selectedCustomer.tenure_months || 0);
                    const paidEmis = calculatePaidEmis();
                    const remainingEmis = calculateRemainingEmis();
                    const totalPaid = emiPayments.reduce((sum, transaction) => {
                      return sum + parseFloat(transaction.amount_paid || transaction.payable_amount || transaction.emi_amount || 0);
                    }, 0).toFixed(2);

                    return (
                      <>
                        {/* Detailed Loan Summary */}
                        <div className="mb-8">
                          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <FaInfoCircle /> Loan Summary Details
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                              <p className="text-xs text-gray-500 font-medium">Total Loan Amount</p>
                              <p className="text-xl font-bold text-gray-800">₹{selectedCustomer.loan_amount || "0"}</p>
                              <p className="text-[10px] text-gray-400 mt-1">Contract Value</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                              <p className="text-xs text-green-600 font-medium">Paid Amount</p>
                              <p className="text-xl font-bold text-green-700">₹{totalPaid}</p>
                              <p className="text-[10px] text-green-400 mt-1">Est. Total Collected</p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                              <p className="text-xs text-orange-600 font-medium">EMIs Status</p>
                              <div className="flex items-end gap-1">
                                <p className="text-xl font-bold text-orange-700">
                                  {isTransactionsLoading ? "..." : paidEmis}
                                </p>
                                <p className="text-sm font-medium text-orange-600 mb-1">/ {tenure}</p>
                              </div>
                              <p className="text-[10px] text-orange-400 mt-1">Installments Paid</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                          <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                            <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                              <FaHistory className="text-gray-400" /> Balance EMI
                            </p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">
                              {remainingEmis}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Remaining Installments</p>
                          </div>
                          <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                            <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                              <FaWallet className="text-gray-400" /> Balance EMI Amount
                            </p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">₹{calculateBalanceEmiAmount().toFixed(2)}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {remainingEmis} × ₹{parseFloat(selectedCustomer.emi_amount || 0).toFixed(2)}
                            </p>
                          </div>
                          <div className="p-5 bg-blue-50 rounded-xl border border-blue-200">
                            <p className="text-sm text-blue-600 font-medium">Foreclosure Amount</p>
                            <p className="text-3xl font-bold text-blue-700 mt-1">₹{calculateTotal()}</p>
                            <p className="text-xs text-blue-400 mt-1">Balance EMI + Charge - Discount</p>
                          </div>
                        </div>
                      </>
                    );
                  })()}

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Foreclosure Charge (+)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                          value={foreclosureData.additionalCharges}
                          onChange={(e) => setForeclosureData({ ...foreclosureData, additionalCharges: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Discount / Waiver (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                          value={foreclosureData.discount}
                          onChange={(e) => setForeclosureData({ ...foreclosureData, discount: e.target.value })}
                        />
                        <p className="mt-1 text-xs text-gray-400">Discount Amount: ₹{calculateDiscountAmount()}</p>
                      </div>
                    </div>
                    <p className="rounded-lg bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
                      Foreclosure Amount = Balance EMI Amount ({calculateRemainingEmis()} × ₹{parseFloat(selectedCustomer.emi_amount || 0).toFixed(2)} = ₹{calculateBalanceEmiAmount().toFixed(2)}) + Foreclosure Charge ₹{parseFloat(foreclosureData.additionalCharges || 0).toFixed(2)} - Discount Amount ₹{calculateDiscountAmount()} = ₹{calculateTotal()}
                    </p>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Closure Remarks</label>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg h-28 focus:ring-2 focus:ring-blue-400 outline-none resize-none"
                        placeholder="Note reason for foreclosure or settlement details..."
                        value={foreclosureData.remarks}
                        onChange={(e) => setForeclosureData({ ...foreclosureData, remarks: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mt-10">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg transition-all transform hover:-translate-y-1 disabled:bg-gray-400 disabled:transform-none"
                    >
                      <FaCheckCircle className="text-xl" />
                      {isProcessing ? "Processing Closure..." : "Confirm & Finalize Loan Closure"}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-4 italic">
                      This action will update the loan status to "Closed" and set the outstanding balance to zero.
                    </p>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-16 text-center border-2 border-dashed border-gray-200">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCalculator className="text-4xl text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-400">Ready to Close an Account?</h3>
                <p className="text-gray-400 mt-3 max-w-md mx-auto">
                  Search and select a customer from the left panel to begin the final settlement and foreclosure process.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forkcloser;
