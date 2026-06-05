import { useState, useEffect } from "react";

// 1. Move the slides array OUTSIDE the component to prevent 
// unnecessary re-renders and Fix the useEffect dependency.
const slides = [
  { id: 1, image: "/slide1.jpg", text: "Welcome to Vinayaga Finance" },
  { id: 2, image: "/slide2.avif", text: "Secure Your Financial Future" },
  { id: 3, image: "/slide3.avif", text: "Investment Solutions" },
  { id: 4, image: "/slide4.avif", text: "Grow Your Wealth" },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []); // Empty dependency array is fine since slides is now outside

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

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
    <div className="w-full ">
      {/* Image Slider - Fixed typo 'bg-gray-90' to 'bg-gray-900' */}
      <div className="relative w-full h-[400px] md:h-170 overflow-hidden bg-gray-900">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat"
            }}
          >
            {/* Text Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h2 className="text-4xl md:text-6xl font-bold text-white text-center px-4 drop-shadow-2xl">
                {slide.text}
              </h2>
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white w-10 h-10 flex items-center justify-center rounded-full z-20 transition-all"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white w-10 h-10 flex items-center justify-center rounded-full z-20 transition-all"
        >
          ❯
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 transition-all rounded-full ${
                index === currentSlide ? "bg-white w-8" : "bg-white/50 w-2"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          Welcome to VINAYAGA FINANCE
        </h1>
        <p className="text-center text-lg text-gray-600">
          Experience our premium services and financial solutions.
        </p>
      </div>

      {/* About Us Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">About Vinayaga Finance</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6 text-center max-w-4xl mx-auto">
            Vinayaga Finance was established with a vision to provide accessible and reliable financial solutions 
            to individuals and businesses. With years of experience in the financial industry, we have built a strong 
            reputation for transparency, reliability, and customer-centric services.
          </p>

          {/* Core Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
              <h3 className="text-xl font-bold text-blue-600 mb-3">Integrity</h3>
              <p className="text-gray-600">
                We maintain the highest standards of honesty and transparency in all our dealings.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
              <h3 className="text-xl font-bold text-green-600 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously innovate to meet the evolving needs of our customers.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600">
              <h3 className="text-xl font-bold text-purple-600 mb-3">Customer Focus</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We're committed to exceptional service.
              </p>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Why Choose Us?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white font-bold">
                  ✓
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-800">Expert Team</h4>
                  <p className="text-gray-600 text-sm mt-1">Experienced professionals dedicated to your success.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white font-bold">
                  ✓
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-800">Competitive Rates</h4>
                  <p className="text-gray-600 text-sm mt-1">Best interest rates and flexible payment options.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white font-bold">
                  ✓
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-800">Quick Processing</h4>
                  <p className="text-gray-600 text-sm mt-1">Fast and hassle-free loan approval process.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white font-bold">
                  ✓
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-800">24/7 Support</h4>
                  <p className="text-gray-600 text-sm mt-1">Customer support team always ready to assist.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default Home;
