import React from 'react';

export const AboutPage = () => {
  return (
    <div className="container mx-auto p-8">
      {/* Header Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
          About Kushal Drug D
        </h1>
        <p className="text-gray-700 mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
          Your trusted pharmacy in Kathmandu, committed to delivering premium medicines and outstanding healthcare services.
        </p>
      </section>

      {/* About Kushal Drug D Section */}
      <section className="mt-12 bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-semibold text-indigo-600">Kushal Drug D</h2>
        <p className="text-gray-600 mt-2 text-lg">Pharmacy in Kathmandu</p>
        <p className="text-gray-600 mt-1">
          <span className="font-bold text-yellow-500">5.0 ★★★★★</span> (2 Google Reviews)
        </p>
        <p className="text-gray-600 mt-1">
          <strong>Address:</strong> M8XW+M6J, Sinamangal Rd, Kathmandu 44600
        </p>
        {/* Google Maps Iframe */}
        <div className="mt-6 max-w-3xl mx-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.838576405349!2d85.34567821506247!3d27.69067898279445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1bda4a965d81%3A0x2f8f9c6b5e6f6e6e!2sSinamangal%20Rd%2C%20Kathmandu%2044600%2C%20Nepal!5e0!3m2!1sen!2sus!4v1677654321987!5m2!1sen!2sus"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg shadow-md"
          ></iframe>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="relative">
          <img
            src="/poster/about_mission.jpg"
            alt="Pharmacy"
            className="rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
          />
        </div>
        <div className="text-left">
          <h2 className="text-3xl font-semibold text-gray-800 relative inline-block">
            Our Mission
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-indigo-600 rounded"></span>
          </h2>
          <p className="text-gray-600 mt-4 text-lg leading-relaxed">
            At Kushal Drug D, our mission is to provide the highest quality medicines and compassionate care, ensuring every customer’s health needs are met with excellence.
          </p>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="text-left order-2 md:order-1">
          <h2 className="text-3xl font-semibold text-gray-800 relative inline-block">
            Why Choose Kushal Drug D?
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-indigo-600 rounded"></span>
          </h2>
          <p className="text-gray-600 mt-4 text-lg leading-relaxed">
            We offer exceptional service, a wide selection of trusted medicines, and a friendly team dedicated to your well-being, making us Kathmandu’s preferred pharmacy.
          </p>
        </div>
        <div className="relative order-1 md:order-2">
          <img
            src="/poster/about_choose_us.jpg"
            alt="Medicine"
            className="rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
          />
        </div>
      </section>
    </div>
  );
};