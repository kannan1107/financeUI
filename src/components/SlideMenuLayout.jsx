import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "New Customer", path: "/customer" },
    { name: "EMI Paying", path: "/emi" },
    { name: "Loan Status", path: "/loan" },
    { name: "Customer Update", path: "/update" },
    { name: "Foreclosure", path: "/close" },
    { name: "List Out", path: "/list" },
];

const SlideMenuLayout = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const activePath = location.pathname;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="md:flex">
                <aside className="hidden md:block md:w-72 shrink-0 bg-white border-r border-gray-200 min-h-screen">
                    <div className="sticky top-0 p-6">
                        <div className="mb-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">Menu</p>
                            <h2 className="mt-3 text-2xl font-bold text-slate-900">Slide Menu</h2>
                            <p className="mt-2 text-sm text-slate-500">Quick access to finance workflows.</p>
                        </div>
                        <nav className="space-y-1">
                            {menuItems.map((item) => {
                                const isActive = activePath === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${isActive
                                            ? "bg-emerald-600 text-white shadow-md"
                                            : "text-slate-700 hover:bg-slate-100"
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                <div className="flex-1 min-h-screen">
                    <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
                        <button
                            type="button"
                            onClick={() => setIsOpen((prev) => !prev)}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                        >
                            <span>Menu</span>
                            <span className="text-xl">{isOpen ? "×" : "☰"}</span>
                        </button>
                        {isOpen && (
                            <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                                {menuItems.map((item) => {
                                    const isActive = activePath === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${isActive
                                                ? "bg-emerald-600 text-white"
                                                : "text-slate-700 hover:bg-slate-100"
                                                }`}
                                        >
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <main className="p-4 md:p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SlideMenuLayout;
