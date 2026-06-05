import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add your form submission logic
    console.log("Form Data:", formData);
    setSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-blue-100">
            We'd love to hear from you. Get in touch with us today!
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Get in Touch</h2>

            {/* Contact Details */}
            <div className="space-y-8">
              {/* Address */}
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  📍
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-800">Address</h3>
                  <p className="text-gray-600 mt-2">
                    Vinayaga Finance Ltd.<br />
                    123 Finance Street<br />
                    Business District, City<br />
                    PIN: 123456
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  📞
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-800">Phone</h3>
                  <p className="text-gray-600 mt-2">
                    +91 9876543210<br />
                    +91 8765432109<br />
                    <span className="text-sm">Available: 9 AM - 6 PM (Mon-Fri)</span>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  ✉️
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-800">Email</h3>
                  <p className="text-gray-600 mt-2">
                    <a href="mailto:info@vinayagafinance.com" className="text-blue-600 hover:text-blue-800">
                      info@vinayagafinance.com
                    </a><br />
                    <a href="mailto:support@vinayagafinance.com" className="text-blue-600 hover:text-blue-800">
                      support@vinayagafinance.com
                    </a>
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  🕐
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-800">Working Hours</h3>
                  <p className="text-gray-600 mt-2">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Send us a Message</h2>

            {submitted && (
              <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg border border-green-300">
                ✓ Thank you! Your message has been sent successfully. We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="john@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="+91 9876543210"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="How can we help?"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Map Section (Optional) */}
      <div className="bg-gray-100 py-12 px-4 mt-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Find Us On Map</h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden h-96">
            <iframe
              title="Vinayaga Finance Location in Sayalgudi, Tamil Nadu"
              src="https://www.google.com/maps?q=Sayalgudi,%20Tamil%20Nadu&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
