import {
  Calendar,
  Car,
  FileText,
  HelpCircle,
  Sheet,
  Users,
  Verified,
} from "lucide-react";
import { useState } from "react";

const TabNavigation = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="container mx-auto px-4 mb-8">
      <div className="bg-white rounded-lg shadow-lg p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <IconComponent className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AuctionService = () => (
  <section>
    <h2 className="text-2xl font-bold mb-4">
      🚗 JAPAN AUTO AUCTION SERVICE – SHANTIX JAPAN
    </h2>
    <p className="mb-2">Buy Directly from Japan's Trusted Auction Houses</p>
    <p className="mb-4">
      ✅ We Are Official Members of All Major Japanese Auto Auctions! At Shantix
      Japan, we offer you direct access to Japan's largest and most reliable
      vehicle auction platforms. Whether you're a dealer or individual buyer,
      our auction service helps you secure high-quality, well-maintained
      Japanese vehicles at competitive wholesale prices — straight from the
      source.
    </p>
    <p className="font-semibold mb-2">
      We are proud members of all major auction networks in Japan including
    </p>
    <p className="mb-4">
      USS | TAA | ARAI | CAA | JU | AUCNET | ASNET | JAA | I-AUC and more
    </p>
    <h3 className="text-xl font-semibold mb-2">
      💼 What is a Japanese Auto Auction?
    </h3>
    <p className="mb-4">
      Japanese Auto Auctions are platforms where vehicles are sold through a
      transparent bidding system. Each vehicle comes with an auction inspection
      sheet detailing its exact condition. You can choose from over 150,000
      vehicles listed weekly across various auctions in Japan!
    </p>
    <h3 className="text-xl font-semibold mb-2">📲 How to Buy from Auction?</h3>
    <ol className="list-decimal list-inside space-y-1 mb-4">
      <li>
        Register for Auction Access (We'll provide you with ID and login to
        browse and bid)
      </li>
      <li>
        Select Your Desired Vehicle (We assist you in understanding condition,
        grade, and pricing)
      </li>
      <li>
        Place a Bid (Set your maximum budget and let us handle the bidding for
        you)
      </li>
      <li>
        Win and Purchase (Once successful, we will complete the purchase and
        handle export)
      </li>
    </ol>
  </section>
);

const MemberLogin = () => (
  <section>
    <h2 className="text-2xl font-bold mb-4">🔐 MEMBER LOGIN – SHANTIX JAPAN</h2>
    <p className="mb-2">Your Gateway to Japan's Largest Auto Auction Network</p>
    <p className="mb-4">
      🚗 Access Over 150,000 Cars Weekly from Japan's Top Auction Houses! Once
      registered, our customers can:
    </p>
    <p className="mb-4">
      At Shantix Japan, we are preparing to offer you exclusive live access to
      the top auction platforms in Japan. Once registered, our customers will be
      able to:
    </p>
    <ul className="list-disc list-inside space-y-1 mb-4">
      <li>
        🔍 Browse real-time vehicle listings from USS, TAA, ARAI, CAA, JU,
        AUCNET, I-AUC, and more
      </li>
      <li>• 📈 Place live or proxy bids through our portal</li>
      <li>🧾 View auction sheets and vehicle details before bidding</li>
      <li>• 💬 Get expert bidding support from our dedicated team</li>
      <li>• 🌐 Monitor bids live from anywhere in the world</li>
    </ul>
    <p className="font-semibold mb-2">
      🚧 COMING SOON: Full Auction Login Portal with Real-Time Access
    </p>
    <h4 className="font-semibold mb-2">📞 Need Help?</h4>
    <ul className="list-disc list-inside mb-4">
      <li>How to bid</li>
      <li>Auction rules</li>
      <li>Deposit & refund policies</li>
      <li>Translation & auction sheet explanation</li>
    </ul>
    <h4 className="font-semibold mb-2">📩 Contact us anytime for support.</h4>
  </section>
);

const AuctionCalendar = () => (
  <section>
    <h2 className="text-2xl font-bold mb-4">📅 JAPAN CAR AUCTION CALENDAR</h2>
    <h2 className="text-2xl font-bold mb-4">
      📩 Contact us anytime for support.
    </h2>
    <h2 className="text-2xl font-bold mb-4">
      🔧 Powered by Shantix Japan – Member of All Leading Auction Halls.
    </h2>
    <p className="mb-4">
      At Shantix Japan, we provide access to all major vehicle auctions held
      throughout Japan. Our upcoming Auction Calendar will help you:
    </p>
    <ul className="list-disc list-inside mb-4">
      <li>✅ Know which auction happens on which day</li>
      <li>✅ Plan your bidding in advance</li>
      <li>
        ✅ Stay updated with auction schedules for USS, TAA, JU, ARAI, AUCNET,
        HONDA, CAA and more
      </li>
      <li>
        ✅ Browse auctions by region – Hokkaido, Tohoku, Kanto, Chubu, Kansai,
        Kyushu, etc.
      </li>
    </ul>
    <h2 className="text-2xl font-bold mb-4">
      📦 With hundreds of auctions happening weekly, you’ll never miss a deal
      again!
    </h2>
    <p className="font-semibold mb-2">
      🔜 Coming Soon: An easy-to-use Live Auction Calendar Table with
    </p>
    <ul className="list-disc list-inside mb-4">
      <li>Auction House Name</li>
      <li>Location</li>
      <li>Auction Day(s)</li>
      <li>Special Sales & Closures</li>
    </ul>
    <h2 className="text-2xl font-bold mb-4">📌 Stay Informed, Bid Smart! </h2>
    <p className="font-semibold mb-2">
      Our team constantly updates the calendar with any schedule changes from
      auction houses. You’ll be able to:
    </p>
    <ul className="list-disc list-inside mb-4">
      <li>View weekly events</li>
      <li>Check upcoming major sales</li>
      <li>Plan deposits & bidding accordingly</li>
      <li>Access VIP events and priority lots</li>
    </ul>

    <p className="italic">
      💡 Tip from Shantix Japan: “The key to getting the best vehicle at the
      best price is knowing when and where to bid.”
    </p>
    <p className="font-semibold mb-2">
      Our team constantly updates the calendar with any schedule changes from
      auction houses. You’ll be able to:
    </p>
  </section>
);

const AuctionTerms = () => (
  <section className="max-w-4xl mx-auto px-4 py-6">
    <h2 className="text-2xl font-bold mb-4">📜 AUCTION TERMS & CONDITIONS</h2>
    <p className="mb-4">🏢 Operated by Shantix Japan</p>
    <p className="mb-6">
      We act as your trusted agent in Japan, giving you access to bid on
      vehicles directly from Japan’s leading auction houses including USS, TAA,
      ARAI, JU, AUCNET, and more.
    </p>
    <p className="mb-6">
      Participation in our auction service is subject to the following terms and
      conditions:
    </p>

    <ul className="space-y-6 mb-8">
      <li>
        <strong>1️⃣ Registration & Membership</strong>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>
            Clients must register with Shantix Japan to access bidding services.
          </li>
          <li>
            A refundable security deposit is required before bidding (see
            deposit table below).
          </li>
          <li>Login credentials will be provided once verified.</li>
        </ul>
      </li>

      <li>
        <strong>2️⃣ Security Deposit</strong>
        <div className="overflow-x-auto mt-2 mb-2">
          <table className="table-auto border border-gray-400 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-3 py-2">FOB Price Range</th>
                <th className="border px-3 py-2">Required Deposit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-3 py-2">Up to JPY 1,000,000</td>
                <td className="border px-3 py-2">JPY 100,000</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">JPY 1,010,000 – 1,500,000</td>
                <td className="border px-3 py-2">JPY 200,000</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">JPY 1,510,000 – 2,000,000</td>
                <td className="border px-3 py-2">JPY 300,000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ul className="list-disc ml-5 space-y-1">
          <li>
            This deposit is fully refundable before a car is won or confirmed
            for purchase.
          </li>
          <li>
            If the bid is successful, the deposit will be adjusted towards the
            payment upon request.
          </li>
        </ul>
      </li>

      <li>
        <strong>3️⃣ Bidding Rules</strong>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>All bids are final and cannot be cancelled once placed.</li>
          <li>Bids must be submitted before the auction deadline.</li>
          <li>
            You may submit a maximum bid limit, and our system/agents will bid
            on your behalf.
          </li>
        </ul>
      </li>

      <li>
        <strong>4️⃣ Vehicle Condition</strong>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>
            All vehicles are sold as-is, based on the auction sheet inspection
            report.
          </li>
          <li>
            Shantix Japan provides translation and guidance, but final decisions
            are made by the buyer.
          </li>
          <li>
            No claims will be accepted once the vehicle is won, unless clear
            auction fraud is proven.
          </li>
        </ul>
      </li>

      <li>
        <strong>5️⃣ Payment Terms</strong>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>
            Full payment (FOB or CIF) must be made within 5 business days after
            winning the auction.
          </li>
          <li>Late payments may result in penalties or loss of the deposit.</li>
          <li>Bank details will be provided on the invoice.</li>
        </ul>
      </li>

      <li>
        <strong>6️⃣ Cancellation Policy</strong>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>
            Bidding cancellations after a win will result in penalty charges by
            the auction house.
          </li>
          <li>
            Penalties vary from JPY 80,000 to 150,000, depending on the vehicle
            and auction policy.
          </li>
          <li>
            In some cases, cancellation is not allowed, and full payment may
            still be required.
          </li>
        </ul>
      </li>

      <li>
        <strong>7️⃣ Shipping & Documentation</strong>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>Shipping will be arranged once full payment is received.</li>
          <li>
            We provide all export documents: Invoice, Export Certificate, Bill
            of Lading, and Translation (if needed).
          </li>
          <li>Estimated shipping time: 1–3 weeks after auction win.</li>
        </ul>
      </li>

      <li>
        <strong>8️⃣ Refund Policy</strong>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>Deposits are fully refundable if you decide not to purchase.</li>
          <li>Refund requests will be processed within 3–5 working days.</li>
          <li>No refund is applicable after a successful bid or purchase.</li>
        </ul>
      </li>
    </ul>

    <p className="text-red-600 font-semibold mb-4">
      ❗Important Notice: Buying from auction is a serious commitment. Make sure
      to review vehicle condition and be confident about your bid.
    </p>

    <p className="text-sm">
      📩 Questions or Need Help?
      <br />
      📧{" "}
      <a href="mailto:info@shantix.jp" className="text-blue-600 underline">
        info@shantix.jp
      </a>
      <br />
      📞{" "}
      <a href="tel:+817083931325" className="text-blue-600 underline">
        +81 70 8393 1325
      </a>
      <br />
      📱 WhatsApp Support:{" "}
      <a
        href="https://wa.me/817083931325"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        Chat on WhatsApp
      </a>
    </p>
  </section>
);

const AuctionFAQ = () => (
  <section className="space-y-4">
    <h2 className="text-2xl font-bold mb-2">🧾 Auction FAQ – Shantix Japan</h2>
    <p className="text-lg mb-4">Everything You Need to Know Before Bidding</p>

    <ul className="space-y-3">
      <li>
        🔹 <strong>1. Who can buy from the Japanese car auctions?</strong>
        <br />
        Anyone! Whether you’re a dealer or individual, you can register and buy
        through Shantix Japan.
      </li>
      <li>
        🔹 <strong>2. Do I need a license to buy from auction?</strong>
        <br />
        No, you don’t need a license. We buy on your behalf.
      </li>
      <li>
        🔹 <strong>3. How do I register?</strong>
        <br />
        Fill out our online form. After approval, we’ll send you your auction
        login.
      </li>
      <li>
        🔹 <strong>4. Is there any registration fee?</strong>
        <br />
        No. Registration is 100% free.
      </li>
      <li>
        🔹 <strong>5. Do I need to pay before bidding?</strong>
        <br />
        Yes. A refundable deposit is required to activate bidding access.
      </li>
      <li>
        🔹 <strong>6. How much is the deposit?</strong>
        <br />• JPY 100,000 for cars under 1 million
        <br />• JPY 200,000–300,000 for higher value vehicles
      </li>
      <li>
        🔹 <strong>7. Is the deposit refundable?</strong>
        <br />
        Yes. Fully refundable if you don’t win or purchase any vehicle.
      </li>
      <li>
        🔹 <strong>8. Can I cancel my bid?</strong>
        <br />
        No. Once placed, bids cannot be canceled.
      </li>
      <li>
        🔹 <strong>9. How do I know the condition of the car?</strong>
        <br />
        Each vehicle has an auction sheet with full inspection details. We
        translate and explain it for you.
      </li>
      <li>
        🔹 <strong>10. Can I join live auction?</strong>
        <br />
        Yes. After registration and deposit, we give you live auction access
        (USS, TAA, ARAI, JU etc.)
      </li>
      <li>
        🔹 <strong>11. How often do auctions happen?</strong>
        <br />
        Every day, across different auction houses. Check our upcoming Auction
        Calendar.
      </li>
      <li>
        🔹 <strong>12. What is the payment timeline after a win?</strong>
        <br />
        Payment must be completed within 5 working days of winning the vehicle.
      </li>
      <li>
        🔹 <strong>13. Can I see car photos before bidding?</strong>
        <br />
        Yes. You’ll see photos, auction sheet, and full specs before bidding.
      </li>
      <li>
        🔹 <strong>14. What happens after I win a car?</strong>
        <br />
        We send the invoice, collect payment, and arrange shipping to your port.
      </li>
      <li>
        🔹 <strong>15. Can I choose CIF or FOB?</strong>
        <br />
        Yes, we offer both FOB and CIF pricing. You choose what works for you.
      </li>
      <li>
        🔹 <strong>16. How long does shipping take?</strong>
        <br />
        Usually 2–3 weeks after auction win, depending on port availability.
      </li>
      <li>
        🔹 <strong>17. Do you provide all export documents?</strong>
        <br />
        Yes. You’ll receive Invoice, Export Certificate, Bill of Lading, and
        Translation.
      </li>
      <li>
        🔹 <strong>18. How do I contact support?</strong>
        <br />
        📧 info@shantix.jp
        <br />
        📞 +81 70-8393-1325
        <br />
        📱 WhatsApp Support:{" "}
        <a
          href="https://wa.me/817083931325"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Chat on WhatsApp
        </a>
      </li>
    </ul>
  </section>
);
const AuctionSheet = () => (
  <section className="max-w-4xl mx-auto px-4 py-6 text-sm md:text-base leading-relaxed">
    <h2 className="text-2xl font-bold mb-4">📄 AUCTION SHEET EXPLANATION</h2>
    <p className="mb-4 font-semibold">
      Understand What You're Bidding On – With Confidence
    </p>
    <p className="mb-4">
      When buying a vehicle from a Japanese auto auction, the auction sheet is
      your most important tool. It provides a full inspection report by a
      certified inspector, including:
    </p>
    <ul className="list-disc list-inside mb-6 space-y-1">
      <li>✅ Vehicle condition</li>
      <li>✅ Accident history</li>
      <li>✅ Exterior & interior marks</li>
      <li>✅ Mileage verification</li>
      <li>✅ Mechanical notes</li>
    </ul>
    <p className="mb-6">
      At Shantix Japan, we help you analyze and translate the sheet so you make
      informed decisions before bidding.
    </p>

    <h3 className="text-xl font-semibold mb-2">
      🧭 Auction Grade (Overall Condition)
    </h3>
    <table className="w-full mb-6 border text-left">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 border">Grade</th>
          <th className="p-2 border">Meaning</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-2 border">5</td>
          <td className="p-2 border">Excellent condition, near-new</td>
        </tr>
        <tr>
          <td className="p-2 border">4.5</td>
          <td className="p-2 border">Very good condition</td>
        </tr>
        <tr>
          <td className="p-2 border">4</td>
          <td className="p-2 border">Good condition, minor wear/tear</td>
        </tr>
        <tr>
          <td className="p-2 border">3.5</td>
          <td className="p-2 border">Average condition, some scratches</td>
        </tr>
        <tr>
          <td className="p-2 border">3</td>
          <td className="p-2 border">Fair, visible signs of use/damage</td>
        </tr>
        <tr>
          <td className="p-2 border">2</td>
          <td className="p-2 border">Poor condition, needs repair</td>
        </tr>
        <tr>
          <td className="p-2 border">R / RA</td>
          <td className="p-2 border">Repaired or accident history</td>
        </tr>
        <tr>
          <td className="p-2 border">***</td>
          <td className="p-2 border">Ungraded or dealer-submitted sheet</td>
        </tr>
      </tbody>
    </table>

    <h3 className="text-xl font-semibold mb-2">🚗 Exterior Condition Marks</h3>
    <table className="w-full mb-6 border text-left">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 border">Symbol</th>
          <th className="p-2 border">Meaning</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-2 border">A1, A2, A3</td>
          <td className="p-2 border">Scratch (small to large)</td>
        </tr>
        <tr>
          <td className="p-2 border">U1, U2, U3</td>
          <td className="p-2 border">Dent (small to large)</td>
        </tr>
        <tr>
          <td className="p-2 border">W1, W2</td>
          <td className="p-2 border">Wavy panel / repaired paint</td>
        </tr>
        <tr>
          <td className="p-2 border">S1, S2</td>
          <td className="p-2 border">Rust (light to moderate)</td>
        </tr>
        <tr>
          <td className="p-2 border">X</td>
          <td className="p-2 border">Panel needs replacement</td>
        </tr>
        <tr>
          <td className="p-2 border">XX</td>
          <td className="p-2 border">Entire panel replaced</td>
        </tr>
        <tr>
          <td className="p-2 border">C1, C2</td>
          <td className="p-2 border">Corrosion</td>
        </tr>
        <tr>
          <td className="p-2 border">P</td>
          <td className="p-2 border">Paint faded/peeling</td>
        </tr>
      </tbody>
    </table>

    <h3 className="text-xl font-semibold mb-2">🪑 Interior Condition</h3>
    <table className="w-full mb-4 border text-left">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 border">Grade</th>
          <th className="p-2 border">Meaning</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-2 border">A</td>
          <td className="p-2 border">Excellent (like new)</td>
        </tr>
        <tr>
          <td className="p-2 border">B</td>
          <td className="p-2 border">Good, some minor wear</td>
        </tr>
        <tr>
          <td className="p-2 border">C</td>
          <td className="p-2 border">Average, visible stains or marks</td>
        </tr>
        <tr>
          <td className="p-2 border">D</td>
          <td className="p-2 border">Dirty or damaged interior</td>
        </tr>
        <tr>
          <td className="p-2 border">E</td>
          <td className="p-2 border">Major interior issues</td>
        </tr>
      </tbody>
    </table>
    <p className="mb-6">
      <span className="font-semibold">Inspector Notes May Include:</span>
      <br />
      • Cigarette burns
      <br />
      • Stains
      <br />
      • Dashboard cracks
      <br />• Missing parts
    </p>

    <h3 className="text-xl font-semibold mb-2">🛞 Wheel & Tire Condition</h3>
    <p className="mb-2">Auction sheets may also show:</p>
    <ul className="list-disc list-inside mb-4 space-y-1">
      <li>Tire Tread Level (in mm)</li>
      <li>Uneven wear or cracking</li>
      <li>Scratches on alloy rims</li>
      <li>Wheel replacement or upgrade info</li>
    </ul>
    <p className="mb-6">
      <span className="font-semibold">Common Wheel Notes:</span>
      <br />
      • AW = Alloy Wheels
      <br />
      • SC = Scratched
      <br />
      • RW = Replaced Wheels
      <br />• W1/W2 = Wheel scratches (minor/medium)
    </p>

    <h3 className="text-xl font-semibold mb-2">
      🔍 What We Do at Shantix Japan
    </h3>
    <ul className="list-disc list-inside mb-6 space-y-1">
      <li>✅ Translate every auction sheet into Japanese to English</li>
      <li>✅ Highlight important defects</li>
      <li>✅ Provide recommendations before bidding</li>
      <li>✅ Offer video or image-based explanations upon request</li>
    </ul>

    <hr className="my-6" />

    <h3 className="text-xl font-semibold mb-2">
      📞 Need Help Reading a Sheet?
    </h3>
    <p className="mb-1">Contact our auction support team:</p>
    <p>
      📧{" "}
      <a href="mailto:info@shantix.jp" className="text-blue-600 underline">
        info@shantix.jp
      </a>
    </p>
    <p>📞 +81 70-8393-1325</p>
    <a
      href="https://wa.me/+81708391325"
      target="_blank"
      rel="noopener noreferrer"
    >
      WhatsApp Support
    </a>
  </section>
);

const AuctionVerification = () => (
  <section className="max-w-4xl mx-auto px-4 py-6 text-sm md:text-base leading-relaxed">
    <h2 className="text-2xl font-bold mb-4">🧾 Auction Sheet Verification</h2>
    <p className="mb-4 font-semibold">
      Buy With Confidence — Verify Before You Buy!
    </p>
    <p className="mb-4">
      At Shantix Japan, we are committed to full transparency when it comes to
      Japanese used cars. We understand how important it is for our customers to
      know the true condition and history of a vehicle before making a purchase.
    </p>
    <p className="mb-6">
      That’s why we’re introducing our Auction Sheet Verification service — a
      simple and secure way for you to confirm the authenticity of auction
      sheets directly from the Japanese auction houses.
    </p>

    <h3 className="text-xl font-semibold mb-2">✅ What is an Auction Sheet?</h3>
    <p className="mb-2">
      An auction sheet is an official document issued by Japanese auto auction
      houses. It contains detailed information such as:
    </p>
    <ul className="list-disc list-inside mb-6 space-y-1">
      <li>• Vehicle condition (interior/exterior)</li>
      <li>• Mileage verification</li>
      <li>• Accident or repair history</li>
      <li>• Equipment and features</li>
      <li>• Grading and inspection summary</li>
    </ul>

    <h3 className="text-xl font-semibold mb-2">
      🔍 Why Verify an Auction Sheet?
    </h3>
    <p className="mb-2">
      Unfortunately, in the used car market, fake or altered auction sheets are
      common. Our verification system ensures that:
    </p>
    <ul className="list-disc list-inside mb-6 space-y-1">
      <li>• The auction sheet you received is 100% authentic</li>
      <li>• All vehicle details match the official auction record</li>
      <li>• You avoid scams and make safe, informed decisions</li>
    </ul>

    <h3 className="text-xl font-semibold mb-2">
      🔒 How It Works (Coming Soon)
    </h3>
    <ol className="list-decimal list-inside mb-4 space-y-1">
      <li>Upload the auction sheet or input the Auction Lot Number</li>
      <li>
        Our system will cross-check it with official data from Japanese auctions
      </li>
      <li>You’ll get a confirmation result within minutes</li>
    </ol>
    <p className="mb-6">
      💡 <span className="font-semibold">Note:</span> This service will be
      available soon — stay tuned!
    </p>

    <h3 className="text-xl font-semibold mb-2">📞 Need Help?</h3>
    <p>
      If you want us to manually verify an auction sheet, contact us on
      WhatsApp: <span className="font-semibold">+81 70 8393 1325</span> or email
      us at{" "}
      <span className="text-blue-600 underline">
        <a href="mailto:info@shantix.jp" className="text-blue-600 underline">
          info@shantix.jp
        </a>
      </span>
      . Our team will assist you promptly.
    </p>
  </section>
);

const Auction = () => {
  const [activeTab, setActiveTab] = useState("service");

  const tabs = [
    {
      id: "service",
      label: "Auction Service",
      icon: Car,
      component: <AuctionService />,
    },
    {
      id: "login",
      label: "Live Auction",
      icon: Users,
      component: <MemberLogin />,
    },
    {
      id: "calendar",
      label: "Auction Calendar",
      icon: Calendar,
      component: <AuctionCalendar />,
    },
    {
      id: "terms",
      label: " Auction Terms  ",
      icon: FileText,
      component: <AuctionTerms />,
    },
    {
      id: "faq",
      label: " Auction FAQ ",
      icon: HelpCircle,
      component: <AuctionFAQ />,
    },
    {
      id: "sheet",
      label: " Auction Sheet Explanation ",
      icon: Sheet,
      component: <AuctionSheet />,
    },
    {
      id: "verification",
      label: " Auction Sheet Verification ",
      icon: Verified,
      component: <AuctionVerification />,
    },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Japan Auto Auction Service
          </h1>
          <p className="text-xl opacity-90">
            Your trusted partner for Japanese vehicle auctions
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 pb-10">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="text-gray-800">{activeTabData?.component}</div>
        </div>
      </div>
    </div>
  );
};

export default Auction;
