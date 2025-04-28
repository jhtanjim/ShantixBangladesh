import  { useState, FormEvent } from 'react';

interface FormData {
  name: string;
  country: string;
  email: string;
  tel: string;
  message: string;
  captcha: string;
}

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    country: '',
    email: '',
    tel: '',
    message: '',
    captcha: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Contact Us Header with underline */}
      <div className="text-center mb-6">
      <h1 className="font-extrabold text-center text-red-600 text-3xl sm:text-4xl md:text-6xl lg:text-6xl mb-2 md:mb-4">
          Contact Us
        </h1>
        <div className="h-px bg-gray-300 mt-1"></div>
      </div>
      
      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        {/* Name Field with Mr. prefix */}
        <div className="mb-4 flex items-start">
          <label htmlFor="name" className="w-24 pt-2 text-sm font-medium">Name</label>
          <div className="flex-1">
            <div className="flex">
              <div className="bg-gray-100 border border-gray-300 px-2 py-1 text-sm flex items-center rounded-l">
                Mr. ▼
              </div>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter Your Name"
                className="flex-1 border border-gray-300 p-2 rounded-r"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        
        {/* Country Field */}
        <div className="mb-4 flex items-start">
          <label htmlFor="country" className="w-24 pt-2 text-sm font-medium">Country</label>
          <div className="flex-1">
            <select
              id="country"
              name="country"
              className="w-full border border-gray-300 p-2 rounded appearance-none bg-white"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Bangladesh">Bangladesh</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
            </select>
          </div>
        </div>
        
        {/* Email Field */}
        <div className="mb-4 flex items-start">
          <label htmlFor="email" className="w-24 pt-2 text-sm font-medium">Email</label>
          <div className="flex-1">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter Your Email"
              className="w-full border border-gray-300 p-2 rounded"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>
        
        {/* Tel/Mobile Field */}
        <div className="mb-4 flex items-start">
          <label htmlFor="tel" className="w-24 pt-2 text-sm font-medium">Tel/Mobile</label>
          <div className="flex-1">
            <input
              type="tel"
              id="tel"
              name="tel"
              placeholder="Enter Your Tel/Mobile"
              className="w-full border border-gray-300 p-2 rounded"
              value={formData.tel}
              onChange={handleChange}
            />
          </div>
        </div>
        
        {/* Message Field */}
        <div className="mb-4 flex items-start">
          <label htmlFor="message" className="w-24 pt-2 text-sm font-medium">Message</label>
          <div className="flex-1">
            <textarea
              id="message"
              name="message"
              placeholder="Write 0-250 words"
              className="w-full border border-gray-300 p-2 rounded"
              rows={5}
              value={formData.message}
              onChange={handleChange}
            />
          </div>
        </div>
        
        {/* Security Captcha */}
        <div className="mb-4 flex items-start">
          <label htmlFor="captcha" className="w-24 pt-2 text-sm font-medium">Security</label>
          <div className="flex-1">
            <div className="mb-1 font-medium text-red-600">2+3=?</div>
            <input
              type="text"
              id="captcha"
              name="captcha"
              placeholder="Write Your Answer"
              className="w-full border border-gray-300 p-2 rounded"
              value={formData.captcha}
              onChange={handleChange}
            />
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex">
          <div className="w-24"></div>
          <div className="flex-1">
            <button 
              type="submit" 
              className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
      
      {/* Company Info Box */}
      <div className="w-full mb-8">
        <div className="text-center text-red-600 font-bold text-xl mb-2">SHANTIX Corporation</div>
        <div className="bg-blue-600 text-white p-4 rounded">
          <div className="space-y-1">
            <div className="flex items-start">
              <span className="inline-block w-6 shrink-0">📍</span>
              <div>
                <p className="text-sm">Dhaka, Bangladesh</p>
                <p className="text-sm">Chattogram, Bangladesh</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="inline-block w-6 shrink-0">📞</span>
              <div>
                <p className="text-sm">+81-45-936-0778</p>
                <p className="text-sm">+81-45-932-2376</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="inline-block w-6 shrink-0">📧</span>
              <p className="text-sm">sales@shantix.info</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;