
export const fuelTypes = ["Gasoline", "Diesel", "Hybrid", "Electric", "CNG", "LPG"];
export const transmissionTypes = ["AT ", "MT", "SEMI AT"];
export const driveTypes = ["2WD", "4WD", "AWD", ];
export const exteriorColors = [
  "Pearl White",
  "Jet Black",
  "Silver Metallic",
  "Gun Metallic",
  "Deep Blue",
  "Crimson Red",
  "Forest Green",
  "Golden Bronze",
  "Charcoal Gray",
  "Alpine White",
  "Midnight Black",
  "Storm Gray",
  "Ruby Red",
  "Ocean Blue",
  "Sunset Orange",
  "Ivory Pearl",
];
export const interiorColors = [
  "Black Leather",
  "Beige Leather",
  "Brown Leather",
  "Gray Fabric",
  "Black Fabric",
  "Tan Leather",
  "White Leather",
  "Red Leather",
  "Navy Fabric",
  "Charcoal Leather",
  "Cream Leather",
  "Saddle Brown",
];
export const featureOptions = {
  Safety: [
    "ABS Brakes",
    "Airbags (Front)",
    "Airbags (Side)",
    "Airbags (Curtain)",
    "Electronic Stability Control",
    "Traction Control",
    "Blind Spot Monitoring",
    "Lane Departure Warning",
    "Forward Collision Warning",
    "Automatic Emergency Braking",
    "Backup Camera",
    "Parking Sensors",
  ],
  Interior: [
    "Leather Seats",
    "Heated Seats",
    "Ventilated Seats",
    "Power Seats",
    "Memory Seats",
    "Massage Seats",
    "Premium Audio System",
    "Navigation System",
    "Dual Zone Climate Control",
    "Tri-Zone Climate Control",
    "Heated Steering Wheel",
    "Wireless Charging",
  ],
  Exterior: [
    "Sunroof",
    "Panoramic Sunroof",
    "LED Headlights",
    "HID Headlights",
    "Fog Lights",
    "Roof Rails",
    "Running Boards",
    "Tow Package",
    "Alloy Wheels",
    "Chrome Trim",
  ],
  Technology: [
    "Apple CarPlay",
    "Android Auto",
    "Bluetooth Connectivity",
    "USB Ports",
    "WiFi Hotspot",
    "Remote Start",
    "Keyless Entry",
    "Push Button Start",
    "Digital Dashboard",
    "Head-Up Display",
  ],
  Performance: [
    "Turbo Engine",
    "Supercharged Engine",
    "Sport Mode",
    "Paddle Shifters",
    "Limited Slip Differential",
    "Performance Suspension",
    "Sport Exhaust",
    "Launch Control",
  ],
  Comfort: [
    "Cruise Control",
    "Adaptive Cruise Control",
    "Rain Sensing Wipers",
    "Auto Dimming Mirrors",
    "Power Liftgate",
    "Hands-Free Liftgate",
    "Third Row Seating",
    "Folding Rear Seats",
  ],
  Entertainment: [
    "Premium Sound System",
    "Subwoofer",
    "Rear Entertainment System",
    "DVD Player",
    "Satellite Radio",
    "HD Radio",
    "Multiple USB Ports",
    "Wireless Audio Streaming",
  ],
};
export const driveTypeOptions = [
  { value: "", label: "Select Drive Type" },
  { value: "FWD", label: "Front-Wheel Drive (FWD)" },
  { value: "RWD", label: "Rear-Wheel Drive (RWD)" },
  { value: "AWD", label: "All-Wheel Drive (AWD)" },
  { value: "FOUR_WD", label: "Four-Wheel Drive (4WD)" },
  { value: "OTHER", label: "Other" },
];


   export const transmissionOptions = [
    { value: "", label: "Select Transmission" },
    { value: "MANUAL", label: "Manual" },
    { value: "AUTOMATIC", label: "Automatic" },
    { value: "CVT", label: "CVT" },
    { value: "SEMI_AUTOMATIC", label: "Semi-Automatic" },
  ];

  export const driveOptions = [
    { value: "", label: "Select Drive Type" },
    { value: "2WD", label: "2WD" },
    { value: "4WD", label: "4WD" },
    { value: "AWD", label: "AWD" },
    { value: "FWD", label: "FWD" },
    { value: "RWD", label: "RWD" },
  ];

 export const colorOptions = [
    { value: "", label: "Select Color" },
    { value: "WHITE", label: "White" },
    { value: "BLACK", label: "Black" },
    { value: "SILVER", label: "Silver" },
    { value: "GRAY", label: "Gray" },
    { value: "RED", label: "Red" },
    { value: "BLUE", label: "Blue" },
    { value: "GREEN", label: "Green" },
    { value: "YELLOW", label: "Yellow" },
    { value: "BROWN", label: "Brown" },
    { value: "GOLD", label: "Gold" },
    { value: "PURPLE", label: "Purple" },
    { value: "ORANGE", label: "Orange" },
    { value: "OTHER", label: "Other" },
  ];

 export const seatsOptions = [
    { value: "2", label: "2 Seats" },
    { value: "4", label: "4 Seats" },
   
  ];
export const vehicleTypeOptions = [
  { value: "", label: "Select Vehicle Type" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "NON_HYBRID", label: "Non-Hybrid" },
  { value: "ELECTRIC", label: "Electric" },
  { value: "PLUG_IN_HYBRID", label: "Plug-in Hybrid" },
  { value: "OTHER", label: "Other" },
];
