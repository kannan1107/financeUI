import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { useFetchAllCustomersQuery, useMakePaymentMutation } from "../../features/ApplicationApi";
import { appApi } from "../../features/ApplicationApi";
import { useDispatch } from "react-redux";
import logoImg from "../../assets/LOG.png";

const defaultModal = {
  customID: "", receiptNo: "", paymentDate: new Date().toISOString().split("T")[0],
  dueDate: "", customName: "", vehicleRegNo: "", currentBalance: "0.00",
  monthlyEmi: "0.00", previousBalance: "0.00", lateFee: "0.00",
  otherCharges: "0.00", payableAmount: "0.00", billAmount: "0.00",
  amountPaid: "0.00", address: "", installmentNo: "1", totalInstallments: "24",
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

const parseMoney = (value) => parseFloat(value || 0) || 0;
const formatMoney = (value) => parseMoney(value).toFixed(2);
const getLoanStatus = (customer) => (
  customer.loan_status ||
  customer.payment_status ||
  ""
).toLowerCase();
const isClosedCustomer = (customer) => ["closed", "completed", "foreclosed"].includes(getLoanStatus(customer));

const Emi = () => {
  const { data: customersData, isLoading, isError, error, refetch } = useFetchAllCustomersQuery();
  const dispatch = useDispatch();
  const customers = Array.isArray(customersData)
    ? customersData
    : customersData?.data || customersData?.customers || [];
  const [makePayment] = useMakePaymentMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(defaultModal);
  const [submitting, setSubmitting] = useState(false);
  const [completedCustomer, setCompletedCustomer] = useState(null);

  const calculatePaymentDetails = (data) => {
    const payableAmount =
      parseMoney(data.previousBalance) +
      parseMoney(data.lateFee) +
      parseMoney(data.otherCharges) +
      parseMoney(data.monthlyEmi);
    const currentBalance = Math.max(0, payableAmount - parseMoney(data.amountPaid));

    return {
      payableAmount: payableAmount.toFixed(2),
      billAmount: payableAmount.toFixed(2),
      currentBalance: currentBalance.toFixed(2),
    };
  };

  const getPaymentStatus = (data) => {
    const installmentNo = parseInt(data.installmentNo || 0);
    const totalInstallments = parseInt(data.totalInstallments || 0);
    const balance = parseMoney(data.currentBalance);

    return installmentNo >= totalInstallments && balance <= 0 ? "Closed" : "Active";
  };

  const getCustomerStatus = (customer) => {
    return isClosedCustomer(customer) ? "Closed" : "Active";
  };

  const payableCustomers = customers.filter((c) => !isClosedCustomer(c));
  const searchQuery = searchTerm.trim().toLowerCase();

  const filteredCustomers = searchQuery
    ? payableCustomers.filter((c) =>
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchQuery) ||
      (c.customer_id || c.customerId || "").toLowerCase().includes(searchQuery) ||
      (c.registration_no || "").toLowerCase().includes(searchQuery)
    )
    : [];

  const openModal = async (customer) => {
    const emi = customer.emi_amount || "0.00";
    const customerId = customer.customer_id || customer.customerId || "";

    const result = await dispatch(
      appApi.endpoints.fetchNextReceiptNo.initiate(customerId, { forceRefetch: true })
    );
    const receiptNo = result?.data?.receiptNo ? String(result.data.receiptNo) : "";
    const installmentNo = result?.data?.installmentNo ? String(result.data.installmentNo) : "1";
    const lateFee = parseFloat(result?.data?.late_fee || 0).toFixed(2);
    const previousBalance = parseFloat(result?.data?.pre_balance || 0).toFixed(2);
    const rawDueDate = result?.data?.due_date || result?.data?.dueDate || customer.due_Date || "";
    const dueDate = rawDueDate ? new Date(rawDueDate).toISOString().split("T")[0] : "";

    const paymentData = {
      customID: customerId,
      receiptNo,
      paymentDate: new Date().toISOString().split("T")[0],
      dueDate: dueDate,
      customName: `${customer.first_name} ${customer.last_name}`,
      vehicleRegNo: customer.registration_no || "",
      currentBalance: "0.00",
      monthlyEmi: emi,
      previousBalance,
      lateFee,
      otherCharges: "0.00",
      payableAmount: "0.00",
      billAmount: "0.00",
      amountPaid: emi,
      address: customer.address || "",
      installmentNo,
      totalInstallments: customer.tenure_months || "24",
    };

    setFormData({
      ...paymentData,
      ...calculatePaymentDetails(paymentData),
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (["lateFee", "previousBalance", "monthlyEmi", "otherCharges", "amountPaid"].includes(name)) {
        return {
          ...updated,
          ...calculatePaymentDetails(updated),
        };
      }
      return updated;
    });
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

  const generatePDF = async (data) => {
    const watermarkBase64 = await toBase64(logoImg, 0.08, -45);
    const logoBase64 = await toBase64(logoImg, 1, 0);
    const doc = new jsPDF();
    const lh = 5, lx = 15, lv = 60, rx = 120, rv = 165;
    doc.addImage(watermarkBase64, "PNG", 40, 80, 120, 120);
    doc.setFont("courier", "bold");
    doc.setFontSize(13);
    // Logo at top-left
    doc.addImage(logoBase64, "PNG", lx, 5, 20, 15);
    // Company name beside logo
    doc.text("SRI VINAYAGA FINANCE", 105, 14, { align: "center" });
    // RECEIPT at top-right
    doc.setFontSize(11);
    doc.text("RECEIPT", 195, 10, { align: "right" });
    doc.setFontSize(9);
    let y = 25;
    const row = (l1, v1, l2, v2) => {
      doc.text(l1, lx, y); doc.text(`: ${v1}`, lv, y);
      doc.text(l2, rx, y); doc.text(`: ${v2}`, rv, y);
      y += lh;
    };
    row("Receipt No", data.receiptNo, "Monthly EMI", data.monthlyEmi);
    row("Receipt Date", data.paymentDate, "Pre. Balance", data.previousBalance);
    row("Due Date", data.dueDate, "Late Fee", data.lateFee);
    row("Customer Name", data.customName.toUpperCase(), "Other Charges", data.otherCharges);
    row("Regn. Number", data.vehicleRegNo, "Payable Amount", data.payableAmount);
    row("Cur. Balance", data.currentBalance, "Bill Amount", data.billAmount);
    doc.text("Address", lx, y);
    const addrLines = doc.splitTextToSize(`: ${data.address || "N/A"}`, 100);
    doc.text(addrLines, lv, y);
    y += addrLines.length * lh + 4;
    doc.setFontSize(9);
    doc.text("Dear Sir/Madam,", lx, y, { font: "bold" }); y += 5;
    const para = `Received with thanks from ${data.customName} the sum of rupees ${numberToWords(data.amountPaid)} only by Cash/Cheque/NEFT in part/full payment of the ${data.installmentNo} of ${data.totalInstallments} instalments of HP agreement of ${data.customID}.`;
    const split = doc.splitTextToSize(para, 180);
    doc.text(split, lx, y); y += split.length * lh + 5;
    doc.text("Thanking You,", 90, y); y += 5;
    doc.text("For SRI VINAYAGA FINANCE", 130, y); y += 20;
    doc.text("Authorised Signatory", 130, y);
    y = 97
    doc.setFontSize(12, "bold");;
    doc.text("SRI VINAYAKA FINANCE", lx, y); y += 5;
    doc.text("60/11, Ushwan Beevi Complex,", lx, y); y += 5;
    doc.text("K. K. Road, Sayalgudi - 623120", lx, y); y += 5;
    doc.text("Cell: 9840797266, 8190980810", lx, y); y += 5;

    y = 120;
    doc.setFontSize(7); ({ align: "left" });
    doc.text("Terms and Conditions:", lx, y); y += 5;
    doc.text("* Customer is advised to get receipt immediately for your EMI payments.", lx, y); y += 5;
    doc.text("* Customer is liable to pay penalty charges and penalty interest for delayed EMI payments.", lx, y); y += 5;
    doc.text("* Customer is advised to make payment in full of outstanding instalments along with charges if any.", lx, y); y += 10;
    doc.text("-- Customer Copy " + "-".repeat(100), lx, y);
    doc.save(`Receipt_${data.customName || data.customID}.pdf`);

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const paymentDetails = calculatePaymentDetails(formData);
      const finalFormData = { ...formData, ...paymentDetails };
      const paymentStatus = getPaymentStatus(finalFormData);
      const result = await makePayment({
        newCustomerId: finalFormData.customID,
        emi_amount: finalFormData.monthlyEmi,
        due_date: finalFormData.dueDate,
        payment_date: finalFormData.paymentDate,
        receiptNo: finalFormData.receiptNo,
        current_balance: finalFormData.currentBalance,
        payment_status: paymentStatus,
        loan_status: paymentStatus,
        pre_balance: finalFormData.previousBalance,
        lete_fee: finalFormData.lateFee,
        other_charge: finalFormData.otherCharges,
        payable_amount: finalFormData.payableAmount,
        bill_amount: finalFormData.billAmount,
        amount_paid: finalFormData.amountPaid,
        email: "",
      }).unwrap();
      const receiptNo = result?.receiptNo || finalFormData.receiptNo;
      await generatePDF({ ...finalFormData, receiptNo });
      refetch();
      setShowModal(false);
      if (result?.completed || parseInt(finalFormData.installmentNo || 0) >= parseInt(finalFormData.totalInstallments || 0)) {
        setCompletedCustomer({
          name: finalFormData.customName,
          id: finalFormData.customID,
          tenure: result?.tenure_months || finalFormData.totalInstallments,
          balance: finalFormData.currentBalance,
          status: paymentStatus,
        });
      }
    } catch (err) {
      alert("Payment failed: " + (err?.data?.message || err.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  const Field = ({ label, name, type = "text", readOnly }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type={type} name={name} value={formData[name]} onChange={handleChange}
        readOnly={readOnly}
        className={`w-full border border-gray-300 rounded p-2 text-sm ${readOnly ? "bg-gray-100 font-bold" : ""}`}
      />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 shadow-lg rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">EMI Management</h2>

      <input
        type="text" placeholder="Search by name, customer ID, or registration number..."
        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="bg-white p-4 rounded shadow-sm">
        <h3 className="font-bold text-blue-600 mb-3 border-b pb-2">All Customers</h3>
        {isLoading ? <p>Loading...</p> : isError ? (
          <p className="text-red-500">Failed to load: {error?.status}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm">
              <thead>
                <tr className="bg-gray-100">
                  {["Customer ID", "Name", "EMI Amount", "Due Date", "Vehicle Reg No", "Balance", "Loan Status", "Action"].map(h => (
                    <th key={h} className="px-4 py-2 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length > 0 ? filteredCustomers.map((c) => (
                  <tr key={c.customer_id || c.customerId} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{c.customer_id || c.customerId}</td>
                    <td className="px-4 py-2">{c.first_name} {c.last_name}</td>
                    <td className="px-4 py-2">{c.emi_amount}</td>
                    <td className="px-4 py-2">{c.due_Date}</td>
                    <td className="px-4 py-2">{c.registration_no}</td>
                    <td className="px-4 py-2 font-semibold">₹{formatMoney(c.current_balance)}</td>
                    <td className="px-4 py-2">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${getCustomerStatus(c) === "Closed"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                        }`}>
                        {getCustomerStatus(c)}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => openModal(c)}
                        disabled={getCustomerStatus(c) === "Closed"}
                        className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 text-sm disabled:cursor-not-allowed disabled:bg-gray-400"
                      >
                        {getCustomerStatus(c) === "Closed" ? "Closed" : "EMI Payment"}
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      No active EMI accounts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {completedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className={`text-2xl font-bold mb-2 ${completedCustomer.status === "Closed" ? "text-green-600" : "text-orange-600"}`}>
              {completedCustomer.status === "Closed" ? "Loan Closed!" : "EMI Completed"}
            </h2>
            <p className="text-gray-700 mb-1">
              <span className="font-semibold">{completedCustomer.name}</span> ({completedCustomer.id})
            </p>
            <p className="text-gray-500 text-sm mb-6">
              All <span className="font-semibold">{completedCustomer.tenure}</span> instalments are completed.
              {parseMoney(completedCustomer.balance) > 0
                ? ` Balance amount: ₹${formatMoney(completedCustomer.balance)}. Loan Status: Active.`
                : " Loan Status: Closed."}
            </p>
            <button
              onClick={() => setCompletedCustomer(null)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold text-gray-800">EMI Payment — {formData.customName}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-800 text-xl font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <p className="text-sm font-semibold text-blue-600 border-b pb-1 mb-3">Payment Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Receipt No" name="receiptNo" />
                  <Field label="Payment Date" name="paymentDate" type="date" />
                  <Field label="Due Date" name="dueDate" type="date" />
                  <Field label="Agreement No / Customer ID" name="customID" readOnly />
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-600 border-b pb-1 mb-3">Customer Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Customer Name" name="customName" />
                  <Field label="Vehicle Reg No" name="vehicleRegNo" />
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Installments</label>
                    <div className="flex items-center gap-2">
                      <input type="number" name="installmentNo" value={formData.installmentNo} onChange={handleChange}
                        className="w-20 border border-gray-300 rounded p-2 text-sm" />
                      <span className="text-sm">of</span>
                      <input type="number" name="totalInstallments" value={formData.totalInstallments} onChange={handleChange}
                        className="w-20 border border-gray-300 rounded p-2 text-sm" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-600 border-b pb-1 mb-3">Financial Breakdown</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Monthly EMI" name="monthlyEmi" type="number" />
                  <Field label="Late Fee" name="lateFee" type="number" />
                  <Field label="Other Charges" name="otherCharges" type="number" />
                  <Field label="Payable Amount" name="payableAmount" type="number" readOnly />
                  <Field label="Previous Balance" name="previousBalance" type="number" />
                  <Field label="Amount Paid" name="amountPaid" type="number" />
                  <Field label="Current Balance" name="currentBalance" type="number" readOnly />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 text-sm h-16" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-5 py-2 border border-gray-300 rounded text-sm hover:bg-gray-100">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="px-6 py-2 bg-blue-800 text-white rounded text-sm font-bold hover:bg-blue-900 disabled:opacity-50">
                  {submitting ? "Processing..." : "Submit & Print Bill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Emi;
