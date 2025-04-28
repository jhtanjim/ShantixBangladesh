
import { Check, Lightbulb, DollarSign, HeadphonesIcon, Users, Headset } from 'lucide-react';
import banner2 from "../../assets/images/Banner2.jpg";

const Services = () => {
  const serviceItems = [
    {
      icon: <Check color="#ff5959" size={50} />,
      title: "Reliable",
      description: "We are a member of JUMVEA which is a government-approved organization, Chamber of Commerce and Industry of Yokohama, and major auctions in Japan."
    },
    {
      icon: <Lightbulb color="#ff5959" size={50} />,
      title: "Innovation",
      description: "Always try our best to be better. Since we expand our business worldwide, the number of our partnerships who we cooperate with are increasing every year."
    },
    {
      icon: <DollarSign color="#ff5959" size={50} />,
      title: "Low Cost & High Quality",
      description: "No additional shipping charge or handling charge. You can search for a vehicle you need from Japanese auction or we will check as per your requirements."
    },
    {
      icon: <Headset color="#ff5959" size={50} />,
      title: "Personal Advice",
      description: "Once we confirm your request, we check the vehicle carefully and suggest you if anything is not good or there is a better option available in your budget."
    },
    {
      icon: <HeadphonesIcon color="#ff5959" size={50} />,
      title: "After Sale Support",
      description: "Auto Parts are available after your purchase. We will try our best to find them in Japan. Our sales team is always ready to provide you complete support and 100% satisfaction."
    },
    {
      icon: <Users color="#ff5959" size={50} />,
      title: "Happy Clients",
      description: "We have exported thousands of used cars & vehicles all around the world. We give our best to make customers happy for having long-term relations."
    }
  ];

  return (
    <div className="relative py-20 px-6 bg-black overflow-hidden">
      {/* Background Image */}
      <img
        src={banner2}
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-80"
      />
      
      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-70"></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto">
       
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {serviceItems.map((service, index) => (
            <div key={index} className="flex items-start space-x-4  p-6 rounded-lg hover:scale-105 transition-transform duration-300">
              <div className="flex-shrink-0 my-auto">
                {service.icon}
              </div>
              <div>
                <h3 className="text-4xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-gray-300">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
