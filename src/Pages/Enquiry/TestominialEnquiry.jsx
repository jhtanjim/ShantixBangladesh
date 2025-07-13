const TestominialEnquiry = () => {
  return (
    <div>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-gray-200 h-64 lg:h-full w-full rounded-lg overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/5428833/pexels-photo-5428833.jpeg"
                  alt="Support agent"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-2xl text-blue-600 font-bold mb-6">
                HOW IT WORKS
              </h3>
              <div className="space-y-6">
                {[
                  {
                    icon: "📝",
                    title: "SUBMIT INQUIRY FORM",
                    desc: "Fill in the inquiry form with your vehicle requirements and submit it to us. We'll process your inquiry and match it with the most suitable options available in our inventory.",
                  },
                  {
                    icon: "🔍",
                    title: "GET BEST OFFERS",
                    desc: "Our team will send you the best vehicle matches within 24 hours. You'll receive competitive offers from our trusted dealer network.",
                  },
                  {
                    icon: "🚗",
                    title: "CHOOSE VEHICLE & GET PROFORMA",
                    desc: "Select your preferred vehicle and receive a detailed proforma invoice with full pricing breakdown including shipping and other costs.",
                  },
                  {
                    icon: "💰",
                    title: "NEGOTIATE & MAKE PAYMENT",
                    desc: "Discuss pricing details if needed and complete the payment securely. We offer various payment methods for your convenience.",
                  },
                  {
                    icon: "🚢",
                    title: "SHIPPING & DOCUMENTS",
                    desc: "Once payment is received, we'll arrange shipping and prepare all necessary export documents for smooth customs clearance at destination.",
                  },
                  {
                    icon: "✅",
                    title: "RECEIVE YOUR VEHICLE",
                    desc: "Track your shipment online and receive your vehicle at your local port. Our team will assist with any post-delivery support you might need.",
                  },
                ].map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="text-blue-600 text-2xl flex-shrink-0">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                      <p className="text-gray-600 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestominialEnquiry;
