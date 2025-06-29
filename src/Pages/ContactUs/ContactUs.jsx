import React, { useState, useEffect } from 'react';
import { useCreateContactInquiry } from '../../hooks/useContact';
import Swal from 'sweetalert2';

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

  const [securityQuestion, setSecurityQuestion] = useState({ question: '', answer: '' });
  const createContactMutation = useCreateContactInquiry();

  // Generate random security question
  const generateSecurityQuestion = () => {
    const questions = [
      { q: '5 + 3 = ?', a: '8' },
      { q: '10 - 4 = ?', a: '6' },
      { q: '2 × 4 = ?', a: '8' },
      { q: '15 ÷ 3 = ?', a: '5' },
      { q: '7 + 2 = ?', a: '9' },
      { q: '12 - 5 = ?', a: '7' },
      { q: '3 × 3 = ?', a: '9' },
      { q: '20 ÷ 4 = ?', a: '5' },
      { q: '6 + 4 = ?', a: '10' },
      { q: '14 - 6 = ?', a: '8' }
    ];
    
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setSecurityQuestion({ question: randomQuestion.q, answer: randomQuestion.a });
  };

  useEffect(() => {
    generateSecurityQuestion();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name || !formData.country || !formData.email || !formData.mobile || !formData.message) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in all required fields',
        confirmButtonColor: '#C9252B',
        background: '#fff',
        color: '#003366'
      });
      return;
    }
    
    // Validate security question
    if (formData.security !== securityQuestion.answer) {
      Swal.fire({
        icon: 'error',
        title: 'Security Check Failed',
        text: `Please solve the math problem correctly: ${securityQuestion.question}`,
        confirmButtonColor: '#C9252B',
        background: '#fff',
        color: '#003366'
      });
      return;
    }

    try {
      // Show loading
      Swal.fire({
        title: 'Sending Message...',
        text: 'Please wait while we process your inquiry',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        background: '#fff',
        color: '#003366',
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Prepare data for API (exclude security field)
      const { security, ...submitData } = formData;
      
      await createContactMutation.mutateAsync(submitData);
      
      // Reset form on success
      setFormData({
        title: 'Mr.',
        name: '',
        country: '',
        email: '',
        mobile: '',
        message: '',
        security: ''
      });
      
      // Generate new security question
      generateSecurityQuestion();
      
      // Success message
      Swal.fire({
        icon: 'success',
        title: 'Message Sent Successfully!',
        text: 'Thank you for contacting us. We will get back to you soon.',
        confirmButtonColor: '#0072BC',
        background: '#fff',
        color: '#003366'
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'There was an error sending your message. Please try again.',
        confirmButtonColor: '#C9252B',
        background: '#fff',
        color: '#003366'
      });
    }
  };

  const refreshSecurityQuestion = () => {
    generateSecurityQuestion();
    setFormData(prev => ({ ...prev, security: '' }));
  };

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#E5E5E5' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#003366' }}>
            Contact Us
          </h1>
          <p className="text-lg" style={{ color: '#003366' }}>
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-10">
            <div className="space-y-6">
              {/* Name with Title */}
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: '#003366' }}>
                  Full Name *
                </label>
                <div className="flex gap-3">
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ '--tw-border-opacity': 1, borderColor: '#E5E5E5' }}
                    disabled={createContactMutation.isPending}
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                  </select>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ 
                      '--tw-border-opacity': 1, 
                      borderColor: formData.name ? '#0072BC' : '#E5E5E5',
                      color: '#003366'
                    }}
                    required
                    disabled={createContactMutation.isPending}
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: '#003366' }}>
                  Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ 
                    '--tw-border-opacity': 1, 
                    borderColor: formData.country ? '#0072BC' : '#E5E5E5',
                    color: '#003366'
                  }}
                  required
                  disabled={createContactMutation.isPending}
                >
                  <option value="">Select your country</option>
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
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: '#003366' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ 
                    '--tw-border-opacity': 1, 
                    borderColor: formData.email ? '#0072BC' : '#E5E5E5',
                    color: '#003366'
                  }}
                  required
                  disabled={createContactMutation.isPending}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: '#003366' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ 
                    '--tw-border-opacity': 1, 
                    borderColor: formData.mobile ? '#0072BC' : '#E5E5E5',
                    color: '#003366'
                  }}
                  required
                  disabled={createContactMutation.isPending}
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: '#003366' }}>
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us how we can help you..."
                  rows={5}
                  maxLength={500}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  style={{ 
                    '--tw-border-opacity': 1, 
                    borderColor: formData.message ? '#0072BC' : '#E5E5E5',
                    color: '#003366'
                  }}
                  required
                  disabled={createContactMutation.isPending}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs" style={{ color: '#003366' }}>
                    {formData.message.length}/500 characters
                  </span>
                </div>
              </div>

              {/* Security Question */}
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: '#003366' }}>
                  Security Check *
                </label>
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="px-4 py-2 rounded-lg font-bold text-lg"
                    style={{ backgroundColor: '#E5E5E5', color: '#C9252B' }}
                  >
                    {securityQuestion.question}
                  </div>
                  <button
                    type="button"
                    onClick={refreshSecurityQuestion}
                    className="px-3 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: '#0072BC', color: 'white' }}
                    disabled={createContactMutation.isPending}
                  >
                    🔄 New Question
                  </button>
                </div>
                <input
                  type="text"
                  name="security"
                  value={formData.security}
                  onChange={handleInputChange}
                  placeholder="Enter the answer"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ 
                    '--tw-border-opacity': 1, 
                    borderColor: formData.security ? '#0072BC' : '#E5E5E5',
                    color: '#003366'
                  }}
                  required
                  disabled={createContactMutation.isPending}
                />
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={createContactMutation.isPending}
                className="w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                style={{ 
                  backgroundColor: '#C9252B', 
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(201, 37, 43, 0.3)'
                }}
              >
                {createContactMutation.isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending Message...
                  </div>
                ) : (
                  '✉️ Send Message'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center">
          <p className="text-sm" style={{ color: '#003366' }}>
            Need immediate assistance? Call us or email us directly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;