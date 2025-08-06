const Auction = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-12 text-gray-800">
      {/* 1. Auction Service */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          🚗 JAPAN AUTO AUCTION SERVICE – SHANTIX JAPAN
        </h2>
        <p className="mb-2">Buy Directly from Japan’s Trusted Auction Houses</p>
        <p className="mb-4">
          ✅ We Are Official Members of All Major Japanese Auto Auctions! At
          Shantix Japan, we offer you direct access to Japan’s largest and most
          reliable vehicle auction platforms. Whether you’re a dealer or
          individual buyer, our auction service helps you secure high-quality,
          well-maintained Japanese vehicles at competitive wholesale prices —
          straight from the source.
        </p>
        <p className="font-semibold mb-2">We are proud members of:</p>
        <p className="mb-4">
          USS | TAA | ARAI | CAA | JU | AUCNET | ASNET | JAA | I-AUC and more
        </p>
        <h3 className="text-xl font-semibold mb-2">
          💼 What is a Japanese Auto Auction?
        </h3>
        <p className="mb-4">
          Japanese Auto Auctions are platforms where vehicles are sold through a
          transparent bidding system. Each vehicle comes with an auction
          inspection sheet detailing its exact condition. You can choose from
          over 150,000 vehicles listed weekly across various auctions in Japan!
        </p>
        <h3 className="text-xl font-semibold mb-2">
          📲 How to Buy from Auction?
        </h3>
        <ol className="list-decimal list-inside space-y-1 mb-4">
          <li>
            Register for Auction Access (We’ll provide you with ID and login to
            browse and bid)
          </li>
          <li>
            Select Your Desired Vehicle (We assist you in understanding
            condition, grade, and pricing)
          </li>
          <li>
            Place a Bid (Set your maximum budget and let us handle the bidding)
          </li>
          <li>Win and Purchase (We complete the purchase and handle export)</li>
        </ol>
      </section>

      {/* 2. Live Auction */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          🔐 MEMBER LOGIN – SHANTIX JAPAN
        </h2>
        <p className="mb-2">
          Your Gateway to Japan’s Largest Auto Auction Network
        </p>
        <p className="mb-4">
          🚗 Access Over 150,000 Cars Weekly from Japan’s Top Auction Houses!
          Once registered, our customers can:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>🔍 Browse real-time vehicle listings</li>
          <li>📈 Place live or proxy bids</li>
          <li>🧾 View auction sheets and details</li>
          <li>💬 Get expert bidding support</li>
          <li>🌐 Monitor bids from anywhere in the world</li>
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
      </section>

      {/* 3. Auction Calendar */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          📅 JAPAN CAR AUCTION CALENDAR
        </h2>
        <p className="mb-4">
          We provide access to all major vehicle auctions held throughout Japan.
          Our upcoming Auction Calendar will help you:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>✅ Know auction days</li>
          <li>✅ Plan your bidding</li>
          <li>✅ Stay updated with schedules</li>
          <li>✅ Browse by region (e.g., Kanto, Kansai, Kyushu...)</li>
        </ul>
        <p className="font-semibold mb-2">
          🔜 Coming Soon: Live Auction Calendar Table
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Auction House Name</li>
          <li>Location</li>
          <li>Auction Day(s)</li>
          <li>Special Sales & Closures</li>
        </ul>
        <p className="italic">
          💡 Tip from Shantix Japan: “The key to getting the best vehicle at the
          best price is knowing when and where to bid.”
        </p>
      </section>

      {/* 4. Auction Terms */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          📜 AUCTION TERMS & CONDITIONS
        </h2>
        <p className="mb-2">🏢 Operated by Shantix Japan</p>
        <ul className="space-y-3 mb-4">
          <li>
            <strong>1️⃣ Registration & Membership</strong>
            <br />
            • Clients must register.
            <br />
            • A refundable deposit is required.
            <br />• Login credentials provided upon verification.
          </li>
          <li>
            <strong>2️⃣ Security Deposit</strong>
            <br />
            <table className="table-auto border border-gray-400 mt-2 mb-2 text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-2 py-1">FOB Price</th>
                  <th className="border px-2 py-1">Deposit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-2 py-1">Up to JPY 1,000,000</td>
                  <td className="border px-2 py-1">JPY 100,000</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">1,010,000 – 1,500,000</td>
                  <td className="border px-2 py-1">JPY 200,000</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">1,510,000 – 2,000,000</td>
                  <td className="border px-2 py-1">JPY 300,000</td>
                </tr>
              </tbody>
            </table>
            • Fully refundable before winning a car.
          </li>
          <li>
            <strong>3️⃣ Bidding Rules</strong>
            <br />
            • All bids are final.
            <br />
            • Max bid limit allowed.
            <br />• Submit before the deadline.
          </li>
          <li>
            <strong>4️⃣ Vehicle Condition</strong>
            <br />
            • Sold as-is based on inspection report.
            <br />• No claims accepted post-purchase.
          </li>
          <li>
            <strong>5️⃣ Payment Terms</strong>
            <br />
            • Full payment within 5 business days.
            <br />• Late payment may result in penalties.
          </li>
          <li>
            <strong>6️⃣ Cancellation Policy</strong>
            <br />
            • Penalties: JPY 80,000 to 150,000.
            <br />• In some cases, full payment still required.
          </li>
          <li>
            <strong>7️⃣ Shipping & Documentation</strong>
            <br />
            • Shipping after payment.
            <br />• We provide all export documents.
          </li>
          <li>
            <strong>8️⃣ Refund Policy</strong>
            <br />
            • Deposits refundable if no car is won.
            <br />• Processed within 3–5 working days.
          </li>
        </ul>
        <p className="text-red-600 font-medium">
          ❗Important: Buying from auction is a serious commitment.
        </p>
        <p className="mt-2">
          📧 info@shantix.jp | 📞 +8170 8393 1325 | 📱 WhatsApp Support: [Link
          Here]
        </p>
      </section>

      {/* 5. Auction FAQ */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          ❓ Auction FAQ – Shantix Japan
        </h2>
        <ul className="space-y-2">
          <li>
            🔹 <strong>Who can buy?</strong> Anyone – dealers or individuals.
          </li>
          <li>
            🔹 <strong>License needed?</strong> No – we buy on your behalf.
          </li>
          <li>
            🔹 <strong>How to register?</strong> Fill out the form, get
            approved, and receive login.
          </li>
          <li>
            🔹 <strong>Registration fee?</strong> None. It’s free.
          </li>
          <li>
            🔹 <strong>Deposit needed?</strong> Yes – refundable.
          </li>
          <li>
            🔹 <strong>Deposit amount?</strong> JPY 100K–300K depending on car
            value.
          </li>
          <li>
            🔹 <strong>Deposit refundable?</strong> Yes, unless you win a car.
          </li>
          <li>
            🔹 <strong>Can I cancel bid?</strong> No. Bids are final.
          </li>
          <li>
            🔹 <strong>Condition info?</strong> Yes – auction sheet + our
            translation.
          </li>
          <li>
            🔹 <strong>Live auction?</strong> Yes, after deposit and
            registration.
          </li>
          <li>
            🔹 <strong>How often?</strong> Daily, across Japan. Use our
            calendar.
          </li>
          <li>
            🔹 <strong>Payment timeline?</strong> Within 5 working days after
            winning.
          </li>
          <li>
            🔹 <strong>Photos before bidding?</strong> Yes – photos and full
            specs.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Auction;
