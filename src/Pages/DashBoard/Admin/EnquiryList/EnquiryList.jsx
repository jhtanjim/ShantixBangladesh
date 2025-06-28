import React, { useState } from 'react';
import { Search, Eye, MessageCircle, Calendar, User, Car, Phone, Mail, MapPin, Filter, Download, Trash2, Edit3 } from 'lucide-react';

const EnquiryList = () => {
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [enquiryTypeFilter, setEnquiryTypeFilter] = useState('all');

  // Mock enquiry data
  const [enquiries, setEnquiries] = useState([
    {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
      steering: 'right',
      yearFrom: '2018',
      yearTo: '2022',
      country: 'us',
      port: 'Los Angeles',
      email: 'john.doe@email.com',
      mobile: '+1-555-0123',
      userType: 'individual',
      message: 'Looking for a reliable Toyota Camry in good condition. Prefer lower mileage.',
      enquiryFor: 'car',
      status: 'pending',
      submittedAt: '2024-06-25T10:30:00Z',
      replies: []
    },
    {
      id: 2,
      make: 'Honda',
      model: 'Civic',
      steering: 'left',
      yearFrom: '2020',
      yearTo: '2024',
      country: 'jp',
      port: 'Tokyo',
      email: 'sarah.wilson@email.com',
      mobile: '+81-90-1234-5678',
      userType: 'carDealer',
      message: 'Need multiple Honda Civic units for dealership. Looking for bulk pricing.',
      enquiryFor: 'car',
      status: 'replied',
      submittedAt: '2024-06-24T14:20:00Z',
      replies: [
        {
          id: 1,
          message: 'Thank you for your enquiry. We have several Honda Civic units available. Please find the detailed quotation attached.',
          repliedAt: '2024-06-24T16:45:00Z',
          repliedBy: 'Admin'
        }
      ]
    },
    {
      id: 3,
      make: 'Ford',
      model: 'Transit',
      steering: 'right',
      yearFrom: '2019',
      yearTo: '2023',
      country: 'uk',
      port: 'Southampton',
      email: 'mike.transport@email.com',
      mobile: '+44-7700-900123',
      userType: 'individual',
      message: 'Looking for Ford Transit van for my delivery business.',
      enquiryFor: 'bus',
      status: 'closed',
      submittedAt: '2024-06-23T09:15:00Z',
      replies: [
        {
          id: 1,
          message: 'We have a perfect Ford Transit 2021 model available. FOB price: $25,000',
          repliedAt: '2024-06-23T11:30:00Z',
          repliedBy: 'Admin'
        }
      ]
    }
  ]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'replied': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'closed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleReply = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowReplyModal(true);
    setReplyText('');
  };

  const submitReply = () => {
    if (!replyText.trim()) return;

    const updatedEnquiries = enquiries.map(enquiry => {
      if (enquiry.id === selectedEnquiry.id) {
        return {
          ...enquiry,
          status: 'replied',
          replies: [
            ...enquiry.replies,
            {
              id: enquiry.replies.length + 1,
              message: replyText,
              repliedAt: new Date().toISOString(),
              repliedBy: 'Admin'
            }
          ]
        };
      }
      return enquiry;
    });

    setEnquiries(updatedEnquiries);
    setShowReplyModal(false);
    setSelectedEnquiry(null);
    setReplyText('');
  };

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch = 
      enquiry.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter;
    const matchesType = enquiryTypeFilter === 'all' || enquiry.enquiryFor === enquiryTypeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const userEnquiries = filteredEnquiries;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard - Enquiry Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage customer enquiries and send replies
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by make, model, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="replied">Replied</option>
              <option value="closed">Closed</option>
            </select>

            {/* Type Filter */}
            <select
              value={enquiryTypeFilter}
              onChange={(e) => setEnquiryTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="car">Car</option>
              <option value="bus">Bus</option>
              <option value="trucks">Trucks</option>
              <option value="bikes">Bikes</option>
              <option value="parts">Parts</option>
            </select>

            {/* Export Button */}
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Enquiries</p>
                  <p className="text-2xl font-bold text-gray-900">{enquiries.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {enquiries.filter(e => e.status === 'pending').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Replied</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {enquiries.filter(e => e.status === 'replied').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Closed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {enquiries.filter(e => e.status === 'closed').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Car className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
       

        {/* Enquiries List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {enquiry.make} {enquiry.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          {enquiry.yearFrom}-{enquiry.yearTo} • {enquiry.steering} hand • {enquiry.enquiryFor}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="w-4 h-4 mr-1 text-gray-400" />
                          {enquiry.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="w-4 h-4 mr-1 text-gray-400" />
                          {enquiry.mobile}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          {enquiry.port}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(enquiry.status)}`}>
                        {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                      </span>
                      {enquiry.replies.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {enquiry.replies.length} replies
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(enquiry.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleReply(enquiry)}
                          className="text-green-600 hover:text-green-900 flex items-center gap-1"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Reply
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enquiry Details Modal */}
        {selectedEnquiry && !showReplyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Enquiry Details</h2>
                  <button
                    onClick={() => setSelectedEnquiry(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Vehicle Details */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 border-b pb-2">Vehicle Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Make:</span>
                        <p className="font-medium">{selectedEnquiry.make}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Model:</span>
                        <p className="font-medium">{selectedEnquiry.model}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Year Range:</span>
                        <p className="font-medium">{selectedEnquiry.yearFrom} - {selectedEnquiry.yearTo}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Steering:</span>
                        <p className="font-medium">{selectedEnquiry.steering} hand</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <p className="font-medium">{selectedEnquiry.enquiryFor}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedEnquiry.status)}`}>
                          {selectedEnquiry.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 border-b pb-2">Customer Information</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="font-medium">{selectedEnquiry.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Mobile:</span>
                        <p className="font-medium">{selectedEnquiry.mobile}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Country:</span>
                        <p className="font-medium">{selectedEnquiry.country}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Port:</span>
                        <p className="font-medium">{selectedEnquiry.port}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">User Type:</span>
                        <p className="font-medium">{selectedEnquiry.userType}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 border-b pb-2 mb-3">Customer Message</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedEnquiry.message}</p>
                </div>

                {/* Replies */}
                {selectedEnquiry.replies.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 border-b pb-2 mb-3">Replies</h3>
                    <div className="space-y-3">
                      {selectedEnquiry.replies.map((reply) => (
                        <div key={reply.id} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-blue-900">{reply.repliedBy}</span>
                            <span className="text-sm text-gray-500">{formatDate(reply.repliedAt)}</span>
                          </div>
                          <p className="text-gray-700">{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleReply(selectedEnquiry)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Send Reply
                  </button>
                  <button
                    onClick={() => setSelectedEnquiry(null)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reply Modal */}
        {showReplyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Send Reply</h2>
                  <button
                    onClick={() => setShowReplyModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Replying to enquiry for:</p>
                  <p className="font-medium">{selectedEnquiry.make} {selectedEnquiry.model} ({selectedEnquiry.yearFrom}-{selectedEnquiry.yearTo})</p>
                  <p className="text-sm text-gray-600">Customer: {selectedEnquiry.email}</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Reply
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Type your reply here..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={submitReply}
                    disabled={!replyText.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Send Reply
                  </button>
                  <button
                    onClick={() => setShowReplyModal(false)}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquiryList;