import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useFetchAllCustomersQuery } from "../../features/ApplicationApi";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler,
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import { FaUser, FaMoneyBillWave, FaChartLine, FaIdCard } from "react-icons/fa";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement, Filler);

const StatCard = ({ icon, label, value, color }) => (
  <div className={`bg-white rounded-xl shadow p-5 flex items-center gap-4 border-l-4 ${color}`}>
    <div className="text-3xl text-gray-500">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const { data: customers = [], isLoading } = useFetchAllCustomersQuery();

  const stats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.loan_status?.toLowerCase() === "active").length;
    const closed = customers.filter((c) => c.loan_status?.toLowerCase() === "closed" || c.loan_status?.toLowerCase() === "completed").length;
    const totalLoan = customers.reduce((s, c) => s + parseFloat(c.loan_amount || 0), 0);
    const totalBalance = customers.reduce((s, c) => s + parseFloat(c.current_balance || 0), 0);
    const collected = totalLoan - totalBalance;

    // EMI collection by month (last 6 months based on due_Date)
    const monthMap = {};
    customers.forEach((c) => {
      const d = c.due_Date || c.due_date;
      if (d) {
        const key = new Date(d).toLocaleString("default", { month: "short", year: "2-digit" });
        monthMap[key] = (monthMap[key] || 0) + parseFloat(c.emi_amount || 0);
      }
    });
    const emiMonths = Object.keys(monthMap).slice(-6);
    const emiValues = emiMonths.map((k) => monthMap[k]);

    // Loan amount distribution buckets
    const buckets = { "0-50k": 0, "50k-1L": 0, "1L-2L": 0, "2L+": 0 };
    customers.forEach((c) => {
      const amt = parseFloat(c.loan_amount || 0);
      if (amt <= 50000) buckets["0-50k"]++;
      else if (amt <= 100000) buckets["50k-1L"]++;
      else if (amt <= 200000) buckets["1L-2L"]++;
      else buckets["2L+"]++;
    });

    return { total, active, closed, totalLoan, totalBalance, collected, emiMonths, emiValues, buckets };
  }, [customers]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-lg font-semibold">Loading Dashboard...</div>;

  const loanStatusChart = {
    labels: ["Active", "Closed", "Others"],
    datasets: [{
      data: [stats.active, stats.closed, stats.total - stats.active - stats.closed],
      backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
      borderWidth: 0,
    }],
  };

  const emiCollectionChart = {
    labels: stats.emiMonths.length ? stats.emiMonths : ["No Data"],
    datasets: [{
      label: "EMI Collection (₹)",
      data: stats.emiValues.length ? stats.emiValues : [0],
      backgroundColor: "#6366f1",
      borderRadius: 6,
    }],
  };

  const loanDistChart = {
    labels: Object.keys(stats.buckets),
    datasets: [{
      label: "Customers",
      data: Object.values(stats.buckets),
      borderColor: "#f59e0b",
      backgroundColor: "rgba(245,158,11,0.15)",
      tension: 0.4,
      fill: true,
      pointBackgroundColor: "#f59e0b",
    }],
  };

  const collectionChart = {
    labels: ["Collected", "Outstanding"],
    datasets: [{
      data: [stats.collected, stats.totalBalance],
      backgroundColor: ["#10b981", "#ef4444"],
      borderWidth: 0,
    }],
  };

  const chartOpts = { responsive: true, plugins: { legend: { position: "bottom" } } };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-20">

         {/* User Profile */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-semibold text-gray-700 mb-4 flex items-center gap-2"><FaUser /> Logged In User Profile</h2>
        {user ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {[
              ["Name", user.name || user.username || "N/A"],
              ["Email", user.email || "N/A"],
              ["Role", user.role || "N/A"],
              ["User ID", user.id || user._id || "N/A"],
            ].map(([label, val]) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">{label}</p>
                <p className="font-semibold text-gray-800 truncate">{val}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No user logged in.</p>
        )}
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<FaUser />} label="Total Customers" value={stats.total} color="border-blue-500" />
        <StatCard icon={<FaChartLine />} label="Active Loans" value={stats.active} color="border-green-500" />
        <StatCard icon={<FaMoneyBillWave />} label="Total Loan (₹)" value={`₹${(stats.totalLoan / 100000).toFixed(1)}L`} color="border-purple-500" />
        <StatCard icon={<FaIdCard />} label="Collected (₹)" value={`₹${(stats.collected / 100000).toFixed(1)}L`} color="border-yellow-500" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Loan Status Distribution</h2>
          <div className="max-w-xs mx-auto">
            <Doughnut data={loanStatusChart} options={chartOpts} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold text-gray-700 mb-4">EMI Collection by Month</h2>
          <Bar data={emiCollectionChart} options={chartOpts} />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Loan Amount Distribution</h2>
          <Line data={loanDistChart} options={chartOpts} />
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Collection vs Outstanding</h2>
          <div className="max-w-xs mx-auto">
            <Doughnut data={collectionChart} options={chartOpts} />
          </div>
        </div>
      </div>

   
    </div>
  );
};

export default Dashboard;
