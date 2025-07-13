// components/AboutUs/BankDetailsTab.jsx

const BankDetailsTab = () => {
  return (
    <div className="space-y-8 bg-[#E5E5E5] py-10 px-4 rounded-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#003366] mb-4">
          Bank Details for Transactions
        </h2>
        <p className="text-[#003366]/80 max-w-2xl mx-auto">
          For secure transactions, please use the following bank details. Ensure
          all payments are made in accordance with our terms and conditions.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 border border-[#0072BC] max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-[#0072BC] mb-6 text-center">
          Bank Details
        </h3>
        <div className="text-[#003366] space-y-3 text-center leading-relaxed">
          <p>
            <span className="font-semibold">Beneficiary's Name:</span> SHANTIX
            CORPORATION
          </p>
          <p>
            <span className="font-semibold">Beneficiary's Bank:</span> MUFG
            Bank, LTD.
          </p>
          <p>
            <span className="font-semibold">Branch Name:</span> MITAKA BRANCH
          </p>
          <p>
            <span className="font-semibold">Account Number:</span> 222-1580332
          </p>
          <p>
            <span className="font-semibold">SWIFT Code:</span> BOTKJPJT
          </p>
          <p>
            <span className="font-semibold">Bank Address:</span> 3-26-12,
            Shimorenjaku, Mitaka-shi, Tokyo, Japan
          </p>
        </div>
      </div>
    </div>
  );
};

export default BankDetailsTab;
