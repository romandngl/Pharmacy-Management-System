import React from 'react';

const ContactPage = () => {
  return (
    <div className="container mx-auto p-8">
      {/* Header Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
          Contact Kushal Drug D
        </h1>
        <p className="text-gray-700 mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
          Reach out to us for inquiries about our premium medicines, healthcare services, or to schedule an appointment.
        </p>
      </section>

      {/* Contact Info & Form Section */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Information */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-indigo-600">Get in Touch</h2>
          <p className="text-gray-600 mt-4 text-lg">
            Visit us in Kathmandu or contact us directly for personalized assistance.
          </p>
          <ul className="mt-6 space-y-4 text-gray-600 text-lg">
            <li>
              <strong>Address:</strong> M8XW+M6J, Sinamangal Rd, Kathmandu 44600
            </li>
            <li>
              <strong>Phone:</strong> +977 1-1234567
            </li>
            <li>
              <strong>Email:</strong> contact@kushaldrugd.com
            </li>
            <li>
              <strong>Hours:</strong> Mon-Sat, 9:00 AM - 6:00 PM
            </li>
          </ul>
          {/* Social Media Links (Optional) */}
          <div className="mt-6 flex justify-start space-x-4">
            <a href="#" className="text-indigo-600 hover:text-indigo-800 transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
            <a href="#" className="text-indigo-600 hover:text-indigo-800 transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-indigo-600">Ask Us Anything</h2>
          <form className="mt-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                placeholder="Your Email"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 font-medium">
                Message
              </label>
              <textarea
                id="message"
                rows="4"
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                placeholder="Questions about medicines or services?"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 font-semibold"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Map Section */}
      <section className="mt-12">
        <h2 className="text-3xl font-semibold text-center text-gray-800">Visit Us</h2>
        <div className="mt-6 max-w-4xl mx-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.838576405349!2d85.34567821506247!3d27.69067898279445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1bda4a965d81%3A0x2f8f9c6b5e6f6e6e!2sSinamangal%20Rd%2C%20Kathmandu%2044600%2C%20Nepal!5e0!3m2!1sen!2sus!4v1677654321987!5m2!1sen!2sus"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg shadow-md"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;