"use client";

// Main AboutUs component - fixed
import {
  Award,
  Banknote,
  Calendar,
  Car,
  CheckCircle,
  Globe,
  Heart,
  Phone,
  Shield,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useGallery } from "../../hooks/useGallery";
import { useGetActiveTeam } from "../../hooks/useTeam";
import { useTestimonials } from "../../hooks/useTestimonial";
import BackgroundTab from "./BackgroundTab";
import BankDetailsTab from "./BankDetailsTab";
import ContactTab from "./ContactTab";
import GalleryTab from "./GalleryTab";
import HeroSection from "./HeroSection";
import TabNavigation from "./TabNavigation";
import TeamTab from "./TeamTab";
import TestimonialsTab from "./TestimonialsTab";
import WhyChooseTab from "./WhyChooseTab";

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState("background");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Team API
  const {
    data: teamData,
    isLoading: teamLoading,
    error: teamError,
  } = useGetActiveTeam();
  const teamMembers = teamData?.data || [];
  // testimonial

  const {
    data: testimonialData,
    isLoading: testimonialLoading,
    error: testimonialError,
  } = useTestimonials();
  const testimonials = testimonialData;
  console.log(testimonialData);
  // Gallery API - Use the same hook as admin component
  const { useGetAllGallery } = useGallery();
  const {
    data: galleryData,
    isLoading: galleryLoading,
    error: galleryError,
  } = useGetAllGallery();

  // console.log("Gallery Data:", galleryData);

  // Filter only active gallery items for public display
  const galleryImages = (galleryData || [])
    .filter((item) => item.isActive) // Only show active items
    .sort((a, b) => (a.order || 0) - (b.order || 0)); // Sort by order

  // console.log("Filtered Gallery Images:", galleryImages);

  // Image carousel functions
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  // Tabs
  const tabs = [
    { id: "background", label: "Company Background", icon: Globe },
    { id: "contact", label: "Contact Details", icon: Phone },
    { id: "team", label: "Our Team", icon: Users },
    { id: "gallery", label: "Photo Gallery", icon: Car },
    { id: "why-choose", label: "Why Choose Us", icon: Award },
    { id: "testimonials", label: "Testimonials", icon: Heart },
    { id: "bank-details", label: "Bank Details", icon: Banknote },
  ];

  // Stats
  const stats = [
    { icon: Calendar, number: "15+", label: "Years Experience" },
    { icon: Globe, number: "50+", label: "Countries Served" },
    { icon: Car, number: "25,000+", label: "Vehicles Exported" },
    { icon: Users, number: "15,000+", label: "Happy Customers" },
  ];

  const brands = [
    "Toyota",
    "Honda",
    "Nissan",
    "Mazda",
    "Mitsubishi",
    "Subaru",
    "Suzuki",
    "Daihatsu",
    "Lexus",
    "Infiniti",
    "Acura",
    "Isuzu",
  ];

  const whyChooseFeatures = [
    {
      icon: Shield,
      title: "Quality Assurance",
      description:
        "Every vehicle undergoes rigorous inspection and quality checks before export.",
      color: "blue",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "We serve customers in over 50 countries with reliable shipping networks.",
      color: "green",
    },
    {
      icon: Award,
      title: "15+ Years Experience",
      description:
        "Over a decade of expertise in Japanese vehicle exports and international trade.",
      color: "purple",
    },
    {
      icon: Users,
      title: "Expert Team",
      description:
        "Our skilled professionals provide personalized service and expert guidance.",
      color: "red",
    },
    {
      icon: CheckCircle,
      title: "Transparent Process",
      description:
        "Clear communication and transparent pricing with no hidden fees.",
      color: "yellow",
    },
    {
      icon: Heart,
      title: "Customer Focused",
      description:
        "Your satisfaction is our priority with dedicated support throughout the process.",
      color: "pink",
    },
  ];

  // const testimonials = [
  //   {
  //     name: "Ahmed Hassan",
  //     country: "UAE",
  //     vehicle: "Toyota Prius 2019",
  //     rating: 5,
  //     text: "Excellent service from start to finish. The team was professional, and the vehicle arrived exactly as described. Highly recommended!",
  //     image: "/api/placeholder/50/50",
  //   },
  //   {
  //     name: "Maria Rodriguez",
  //     country: "Chile",
  //     vehicle: "Honda CR-V 2020",
  //     rating: 5,
  //     text: "Shantix Corporation made the entire process seamless. Great communication and the vehicle quality exceeded my expectations.",
  //     image: "/api/placeholder/50/50",
  //   },
  //   {
  //     name: "David Thompson",
  //     country: "New Zealand",
  //     vehicle: "Nissan X-Trail 2021",
  //     rating: 5,
  //     text: "Professional service and competitive pricing. The documentation was handled perfectly, and shipping was faster than expected.",
  //     image: "/api/placeholder/50/50",
  //   },
  //   {
  //     name: "Priya Sharma",
  //     country: "India",
  //     vehicle: "Mazda CX-5 2020",
  //     rating: 5,
  //     text: "Outstanding experience! The team guided me through every step and delivered exactly what was promised. Will definitely use again.",
  //     image: "/api/placeholder/50/50",
  //   },
  // ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "background":
        return <BackgroundTab stats={stats} brands={brands} />;
      case "contact":
        return <ContactTab />;
      case "team":
        return (
          <TeamTab
            teamMembers={teamMembers}
            teamLoading={teamLoading}
            teamError={teamError}
          />
        );
      case "gallery":
        return (
          <GalleryTab
            galleryImages={galleryImages}
            currentImageIndex={currentImageIndex}
            setCurrentImageIndex={setCurrentImageIndex}
            nextImage={nextImage}
            prevImage={prevImage}
            galleryLoading={galleryLoading}
            galleryError={galleryError}
          />
        );
      case "why-choose":
        return <WhyChooseTab whyChooseFeatures={whyChooseFeatures} />;
      case "testimonials":
        return (
          <TestimonialsTab
            testimonials={testimonials}
            testimonialLoading={testimonialLoading}
            testimonialError={testimonialError}
          />
        );

      case "bank-details":
        return <BankDetailsTab />;
      default:
        return <BackgroundTab stats={stats} brands={brands} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">{renderTabContent()}</div>
    </div>
  );
};

export default AboutUs;
