// components/AboutUs/TestimonialsTab.jsx
import TestimonialCard from "./TestimonialCard";

const TestimonialsTab = ({ testimonials }) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          What Our Customers Say
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Don't just take our word for it. Here's what our satisfied customers
          from around the world have to say about their experience with Shantix
          Corporation.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            testimonial={testimonial}
            index={index}
          />
        ))}
      </div>

      {/* Customer Satisfaction Stats */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-6 text-center">
          Customer Satisfaction
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">98%</div>
            <p className="text-green-100">Customer Satisfaction Rate</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">15,000+</div>
            <p className="text-green-100">Happy Customers</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">4.9/5</div>
            <p className="text-green-100">Average Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsTab;
