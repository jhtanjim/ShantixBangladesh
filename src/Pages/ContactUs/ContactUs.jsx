import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    title: 'Mr.',
    name: '',
    country: '',
    email: '',
    mobile: '',
    message: '',
    security: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.security !== '5') {
      alert('Please solve the security question correctly (2+3=5)');
      return;
    }
    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');
  };

  return (
    <div className="max-w-screen-lg mx-auto bg-white p-8 my-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-red-600 text-center mb-8 border-b-2 border-gray-300 pb-2">
        Contact Us
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name with Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <div className="flex gap-2">
            <select
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-20 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Ms.">Ms.</option>
          
            </select>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter Your Name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          >
            <option value="">Select Country</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Japan">Japan</option>
            <option value="India">India</option>
            <option value="China">China</option>
            <option value="Brazil">Brazil</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter Your Email"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        {/* Tel/Mobile */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Tel/Mobile</label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            placeholder="Enter Your Tel/Mobile"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Write 0/250 words"
            rows={4}
            maxLength={250}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            required
          />
          <div className="text-sm text-gray-500 mt-1">
            {formData.message.length}/250 words
          </div>
        </div>

        {/* Security */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Security</label>
          <div className="mb-2">
            <span className="text-red-600 font-bold text-lg">2+3=?</span>
          </div>
          <input
            type="text"
            name="security"
            value={formData.security}
            onChange={handleInputChange}
            placeholder="Write Your Answer"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200 font-medium"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactUs;