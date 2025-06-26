import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, FileText, Globe, Truck, CreditCard, Scale } from 'lucide-react';

const TermsAndConditions = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: 'definitions',
      title: 'Definitions and Interpretation',
      icon: <FileText className="w-5 h-5" />,
      content: `
        • "Company", "we", "us", "our" refers to Shantix Corporation Japan
        • "Customer", "you", "your" refers to the person or entity purchasing vehicles
        • "Vehicle" refers to any motor vehicle, parts, or accessories sold by the Company
        • "Auction" refers to Japanese auto auctions we participate in on your behalf
        • "CIF" refers to Cost, Insurance, and Freight pricing
        • "RHD" refers to Right-Hand Drive vehicles
        • "LHD" refers to Left-Hand Drive vehicles
      `
    },
    {
      id: 'services',
      title: 'Our Services',
      icon: <Truck className="w-5 h-5" />,
      content: `
        Shantix Corporation Japan provides:
        • Export of premium Japanese used vehicles (RHD and LHD)
        • Auto parts and accessories export
        • Japanese auction bidding services
        • Global shipping and logistics coordination
        • Quality inspection and documentation services
        • Stock vehicle sales from our inventory
        
        We serve customers in 50+ countries with 15+ years of experience and access to 300,000+ vehicles.
      `
    },
    {
      id: 'auction-process',
      title: 'Auction Process Terms',
      icon: <Scale className="w-5 h-5" />,
      content: `
        Deposit Requirements:
        • A refundable deposit of 100,000 JPY is required before bidding
        • Deposits accepted via Telegraphic Transfer or PayPal
        • All transfer fees must be covered by the customer
        • Refunds processed within 2 business days upon request
        
        Bidding Process:
        • Customers receive limited access to our auction search engine
        • Maximum bid amounts must be specified in advance
        • Auction results are final and binding
        • Successful bidders must complete payment as per invoice terms
        
        Payment After Winning:
        • Pro forma invoice issued immediately after successful bid
        • Full payment required before shipping arrangements
        • Payment methods: Bank transfer, other approved methods
      `
    },
    {
      id: 'stock-purchases',
      title: 'Stock Vehicle Purchase Terms',
      icon: <CreditCard className="w-5 h-5" />,
      content: `
        Stock Purchase Process:
        • Vehicles reserved for maximum 12 days from order date
        • Pro forma invoice issued upon purchase confirmation
        • Full payment required before shipping
        • Vehicle availability subject to prior sale
        
        Pricing and Payment:
        • All prices quoted as CIF (Cost, Insurance, Freight) to destination port
        • Prices subject to change until payment confirmation
        • Additional charges may apply for special requests or modifications
      `
    },
    {
      id: 'quality-inspection',
      title: 'Quality Assurance and Inspection',
      icon: <Shield className="w-5 h-5" />,
      content: `
        Quality Standards:
        • 100% of vehicles undergo strict quality inspection
        • Detailed inspection reports provided upon request
        • Photos and condition reports available for most vehicles
        • We guarantee accurate representation of vehicle condition
        
        Limitations:
        • Inspections based on visual assessment and available information
        • Some wear and minor defects are normal for used vehicles
        • Customer accepts vehicles "as-is" unless otherwise specified
        • Hidden defects discovered after shipment are not covered
      `
    },
    {
      id: 'shipping',
      title: 'Shipping and Delivery',
      icon: <Globe className="w-5 h-5" />,
      content: `
        Shipping Arrangements:
        • We coordinate shipping to your nearest destination port
        • Shipping schedules subject to vessel availability
        • All necessary import documents provided before arrival
        • Customer responsible for customs clearance and local delivery
        
        Risk and Responsibility:
        • Risk transfers to customer upon loading at Japanese port
        • Marine insurance coverage included in CIF pricing
        • Delays due to weather, port congestion, or customs are not our responsibility
        • Customer must arrange timely pickup at destination port
      `
    },
    {
      id: 'warranties',
      title: 'Warranties and Disclaimers',
      icon: <FileText className="w-5 h-5" />,
      content: `
        Limited Warranty:
        • We warrant accurate representation of vehicle condition at time of inspection
        • Warranty covers major undisclosed mechanical issues only
        • Warranty period: 30 days from vehicle receipt at destination port
        • Warranty claims must be supported by professional mechanic assessment
        
        Disclaimers:
        • No warranty on normal wear items (tires, batteries, filters, etc.)
        • No warranty on modifications or aftermarket parts
        • All vehicles sold "as-is" regarding cosmetic condition
        • We are not responsible for compliance with local import regulations
      `
    },
    {
      id: 'cancellation',
      title: 'Cancellation and Refund Policy',
      icon: <CreditCard className="w-5 h-5" />,
      content: `
        Before Shipping:
        • Orders may be cancelled before vehicle shipment
        • Cancellation fees may apply depending on stage of preparation
        • Auction deposits fully refundable if auction unsuccessful
        • Stock vehicle reservations may be cancelled within 12 days
        
        After Shipping:
        • Orders cannot be cancelled once vehicle has departed Japan
        • No refunds for change of mind after shipping
        • Returns only accepted for major undisclosed defects
        • Return shipping costs borne by customer unless our error
      `
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      icon: <Scale className="w-5 h-5" />,
      content: `
        Liability Limits:
        • Our total liability limited to the purchase price of the vehicle
        • We are not liable for indirect, consequential, or punitive damages
        • Not liable for delays, customs issues, or local import problems
        • Not liable for third-party services (shipping, insurance, customs)
        
        Customer Responsibilities:
        • Verify import regulations in destination country
        • Arrange proper insurance coverage
        • Comply with all local laws and requirements
        • Inspect vehicles promptly upon receipt
      `
    },
    {
      id: 'governing-law',
      title: 'Governing Law and Disputes',
      icon: <FileText className="w-5 h-5" />,
      content: `
        Jurisdiction:
        • These terms governed by Japanese law
        • Disputes subject to Tokyo District Court jurisdiction
        • Alternative dispute resolution encouraged before litigation
        • English language version of terms takes precedence
        
        Contact for Disputes:
        Japan Office: Shin-Okubo Building 2, 3rd floor, 1-11-1, Hyakunincho, Shinjuku-ku, Tokyo 169-0073, Japan
        Bangladesh Office: 533/659, Standard City Plaza (2nd floor), Sk Mujib Road, Dewanhat, Chattogram
        Phone: +81 70 8393 1325
      `
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Please read these terms carefully before using our services. By purchasing from Shantix Corporation Japan, you agree to be bound by these terms and conditions.
        </p>
        <div className="mt-4 text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="text-blue-600">{section.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
              </div>
              {expandedSection === section.id ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {expandedSection === section.id && (
              <div className="px-6 pb-6">
                <div className="prose max-w-none text-gray-700">
                  {section.content.split('\n').map((line, index) => (
                    <p key={index} className={line.trim().startsWith('•') ? 'ml-4' : 'mb-3'}>
                      {line.trim()}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Contact Information</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium">Japan Office</h4>
            <p>Shin-Okubo Building 2, 3rd floor</p>
            <p>1-11-1, Hyakunincho, Shinjuku-ku</p>
            <p>Tokyo 169-0073, Japan</p>
          </div>
          <div>
            <h4 className="font-medium">Bangladesh Office</h4>
            <p>533/659, Standard City Plaza (2nd floor)</p>
            <p>Sk Mujib Road, Dewanhat</p>
            <p>Chattogram</p>
            <p className="mt-2 font-medium">Phone: +81 70 8393 1325</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PrivacyPolicy = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: 'collection',
      title: 'Information We Collect',
      icon: <FileText className="w-5 h-5" />,
      content: `
        Personal Information:
        • Name, address, phone number, email address
        • Payment information and banking details
        • Identification documents for vehicle registration
        • Communication records and correspondence
        
        Vehicle Preference Information:
        • Vehicle specifications and preferences
        • Budget and financing information
        • Shipping destination details
        • Import documentation requirements
        
        Technical Information:
        • IP address and browser information
        • Website usage patterns and preferences
        • Device information and operating system
        • Cookies and similar tracking technologies
      `
    },
    {
      id: 'usage',
      title: 'How We Use Your Information',
      icon: <Truck className="w-5 h-5" />,
      content: `
        Service Delivery:
        • Process vehicle orders and auction bids
        • Coordinate shipping and logistics
        • Provide customer support and communication
        • Generate invoices and payment processing
        
        Business Operations:
        • Maintain customer relationships
        • Improve our services and website functionality
        • Conduct market research and analysis
        • Comply with legal and regulatory requirements
        
        Marketing and Communication:
        • Send service updates and notifications
        • Provide information about new inventory
        • Share industry news and market updates
        • Promotional offers (with your consent)
      `
    },
    {
      id: 'sharing',
      title: 'Information Sharing and Disclosure',
      icon: <Globe className="w-5 h-5" />,
      content: `
        We share information with:
        
        Service Providers:
        • Shipping and logistics companies
        • Payment processors and financial institutions
        • Insurance providers
        • IT service providers and cloud hosting
        
        Business Partners:
        • Japanese auction houses (for bidding services)
        • Vehicle inspection services
        • Documentation and customs brokers
        • Local dealers and partners
        
        Legal Requirements:
        • Government authorities when required by law
        • Regulatory bodies for compliance purposes
        • Legal proceedings when necessary
        • Protection of our rights and safety
        
        We do not sell personal information to third parties for marketing purposes.
      `
    },
    {
      id: 'security',
      title: 'Data Security and Protection',
      icon: <Shield className="w-5 h-5" />,
      content: `
        Security Measures:
        • SSL encryption for all data transmission
        • Secure servers with regular security updates
        • Access controls and authentication systems
        • Regular security audits and monitoring
        
        Data Storage:
        • Personal data stored in secure, encrypted databases
        • Payment information processed through secure gateways
        • Regular backups with encryption
        • Limited access on need-to-know basis
        
        Employee Training:
        • Staff trained on privacy and security protocols
        • Confidentiality agreements with all employees
        • Regular privacy and security awareness training
        • Incident response procedures in place
      `
    },
    {
      id: 'retention',
      title: 'Data Retention and Deletion',
      icon: <FileText className="w-5 h-5" />,
      content: `
        Retention Periods:
        • Customer account information: 7 years after last transaction
        • Transaction records: 7 years for tax and legal compliance
        • Communication records: 3 years after last contact
        • Website usage data: 2 years from collection
        
        Deletion Process:
        • Automatic deletion after retention periods expire
        • Manual deletion upon customer request (where legally permitted)
        • Secure deletion methods to prevent data recovery
        • Notification to third parties when applicable
        
        Legal Requirements:
        • Some data retained longer for legal compliance
        • Tax records maintained per Japanese regulations
        • Dispute-related information retained until resolution
        • Safety and security incidents documented permanently
      `
    },
    {
      id: 'rights',
      title: 'Your Privacy Rights',
      icon: <Scale className="w-5 h-5" />,
      content: `
        Access Rights:
        • Request copies of your personal information
        • Review how your data is being used
        • Obtain information about data sharing
        • Access transaction and communication history
        
        Control Rights:
        • Update or correct personal information
        • Request data deletion (subject to legal requirements)
        • Opt-out of marketing communications
        • Withdraw consent where applicable
        
        Portability Rights:
        • Request data in machine-readable format
        • Transfer data to another service provider
        • Obtain structured data export
        • Receive data within reasonable timeframe
        
        To exercise these rights, contact us using the information provided below.
      `
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking Technologies',
      icon: <Globe className="w-5 h-5" />,
      content: `
        Types of Cookies:
        • Essential cookies for website functionality
        • Analytics cookies to understand usage patterns
        • Preference cookies to remember your settings
        • Marketing cookies for relevant advertisements
        
        Cookie Management:
        • Browser settings to control cookie acceptance
        • Opt-out options for non-essential cookies
        • Regular review and cleanup of stored cookies
        • Third-party cookie policies apply to their services
        
        Other Tracking:
        • Web beacons and pixel tags for email tracking
        • Server logs for security and performance monitoring
        • Social media integration tracking
        • Third-party analytics and advertising tools
      `
    },
    {
      id: 'international',
      title: 'International Data Transfers',
      icon: <Globe className="w-5 h-5" />,
      content: `
        Cross-Border Transfers:
        • Data transferred between Japan and customer countries
        • Adequate protection measures in place
        • Compliance with local data protection laws
        • Standard contractual clauses where required
        
        Safeguards:
        • Encryption during transmission and storage
        • Due diligence on international partners
        • Regular compliance monitoring
        • Incident response procedures across jurisdictions
        
        Legal Basis:
        • Contractual necessity for service delivery
        • Legitimate business interests
        • Legal compliance requirements
        • Customer consent where required
      `
    },
    {
      id: 'children',
      title: 'Children\'s Privacy',
      icon: <Shield className="w-5 h-5" />,
      content: `
        Age Restrictions:
        • Services intended for users 18 years and older
        • No intentional collection of children's information
        • Parental consent required for users under 18
        • Special protection for minors' personal data
        
        If we discover information from children under 13:
        • Immediate deletion of the information
        • Notification to parents/guardians
        • Enhanced verification procedures
        • Compliance with children's privacy laws
      `
    },
    {
      id: 'updates',
      title: 'Policy Updates and Changes',
      icon: <FileText className="w-5 h-5" />,
      content: `
        Notification Process:
        • Email notification of significant changes
        • Website banner for policy updates
        • Reasonable notice period before changes take effect
        • Clear explanation of what has changed
        
        Your Choices:
        • Continue using services indicates acceptance
        • Right to discontinue services if you disagree
        • Contact us with questions about changes
        • Access to previous policy versions upon request
        
        We recommend reviewing this policy periodically for updates.
      `
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          At Shantix Corporation Japan, we are committed to protecting your privacy and ensuring the security of your personal information. This policy explains how we collect, use, and protect your data.
        </p>
        <div className="mt-4 text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="text-green-600">{section.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
              </div>
              {expandedSection === section.id ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {expandedSection === section.id && (
              <div className="px-6 pb-6">
                <div className="prose max-w-none text-gray-700">
                  {section.content.split('\n').map((line, index) => (
                    <p key={index} className={line.trim().startsWith('•') ? 'ml-4' : 'mb-3'}>
                      {line.trim()}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-green-50 rounded-lg">
        <h3 className="text-lg font-semibold text-green-900 mb-3">Contact Us About Privacy</h3>
        <p className="text-green-800 mb-4">
          If you have any questions about this Privacy Policy or how we handle your personal information, please contact us:
        </p>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-green-800">
          <div>
            <h4 className="font-medium">Japan Office</h4>
            <p>Shin-Okubo Building 2, 3rd floor</p>
            <p>1-11-1, Hyakunincho, Shinjuku-ku</p>
            <p>Tokyo 169-0073, Japan</p>
          </div>
          <div>
            <h4 className="font-medium">Bangladesh Office</h4>
            <p>533/659, Standard City Plaza (2nd floor)</p>
            <p>Sk Mujib Road, Dewanhat</p>
            <p>Chattogram</p>
            <p className="mt-2 font-medium">Phone: +81 70 8393 1325</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export both components
export { TermsAndConditions, PrivacyPolicy };
export default PrivacyPolicy