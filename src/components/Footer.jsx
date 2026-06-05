import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
    <div className="max-w-8xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 gap-8">

      {/* Brand / About */}
      <div>
        <h2 className="text-sl  text-white">All CopyRights By Vinayaga Finance</h2>
       
      </div>
      <p className="mt-3 text-sm text-center">
          Developet by KannanM
        </p>
      {/* Social */}
      <div className="flex flex-col items-end">
        <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
        <div className="flex space-x-4 text-xl">
          <a href="#" className="hover:text-white"><FaFacebook /></a>
          <a href="#" className="hover:text-white"><FaInstagram /></a>
          <a href="#" className="hover:text-white"><FaTwitter /></a>
        </div>
      </div>
    </div>

    {/* Bottom */}
    <div className="text-center text-gray-400 text-sm mt-10 border-t border-gray-700 pt-5">
      © {new Date().getFullYear()} MyCompany. All rights reserved.
    </div>
  </footer>
  );
};

export default Footer;