import { Quote, Star } from "lucide-react";

const TestimonialCard = ({ testimonial }) => {
  const totalStars = 5;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start space-x-4">
        <img
          src={testimonial.avatarUrl || "/default-avatar.png"}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Quote className="w-5 h-5 text-blue-600 mr-2" />
            <div className="flex">
              {[...Array(totalStars)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < testimonial.rating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
          <div className="border-t pt-4">
            <p className="font-semibold text-gray-800">{testimonial.name}</p>
            <p className="text-sm text-gray-600">{testimonial.country}</p>
            <p className="text-sm text-blue-600 font-medium">
              {testimonial.carModel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
