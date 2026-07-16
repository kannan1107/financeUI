import { Route, Routes } from "react-router-dom";
import Home from "../pages/auth/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutUs from "../pages/auth/AboutUs";
import Contact from "../pages/auth/Contact";
import SlideMenuLayout from "../components/SlideMenuLayout";

import Forkcloser from "../pages/auth/Forkcloser";


import NewCustomer from "../pages/auth/NewCustomer";
import ListOut from "../pages/auth/ListOut";
import UpdateCustomer from "../pages/auth/UpdateCustomer";
import Emi from "../pages/auth/Emi";
import Dashboard from "../pages/auth/Dashboard";

const Loan = () => <div className="min-h-screen p-10 pt-20"><h1 className="text-3xl font-bold">Loan Status</h1></div>;
const Update = () => <div className="min-h-screen p-10 pt-20"><h1 className="text-3xl font-bold">Customer Update</h1></div>;


const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />

            <Route element={<SlideMenuLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customer" element={<NewCustomer />} />
              <Route path="/emi" element={<Emi />} />
              <Route path="/list" element={<ListOut />} />
              <Route path="/loan" element={<Loan />} />
              <Route path="/update" element={<Update />} />
              <Route path="/close" element={<Forkcloser />} />
              <Route path="/forkclose" element={<Forkcloser />} />
            </Route>

            <Route path="/edit-customer/:id" element={<UpdateCustomer />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </>
  )
};

export default AppRoutes;