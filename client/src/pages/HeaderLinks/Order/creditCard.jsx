import React from "react";
import { usePaymentInputs } from "react-payment-inputs";
import images from "react-payment-inputs/images";
import "./styles.css";
import { FaCcVisa, FaMicrochip } from "react-icons/fa";

const CreditCard = ({ number, setNumber, name, setName, date, setDate, cvc, setCvc }) => {
  const { getCardNumberProps, getExpiryDateProps, getCVCProps, meta } = usePaymentInputs();

  // Format number into groups of 4 for display
  const formatNumber = (num) => {
    if (!num) return "•••• •••• •••• ••••";
    return num.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Card Preview */}
      <div className="back3 rounded-2xl w-full h-48 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 flex flex-col justify-between h-full p-6 text-white">
          {/* Top Row: Title + Chip + Brand */}
          <div className="flex justify-between items-center">
            <FaMicrochip className="text-yellow-400 text-2xl" />
            <span className="font-bold text-lg tracking-widest">Card Preview</span>
            <FaCcVisa className="text-blue-400 text-2xl" />
          </div>

          {/* Card Number */}
          <div className="mt-4 text-xl font-mono tracking-widest">
            {formatNumber(number)}
          </div>

          {/* Bottom Row: Cardholder, Expiry, CVC */}
          <div className="flex justify-between mt-6">
            <div className="flex flex-col">
              <span className="text-xs text-gray-300">Card Holder</span>
              <span className="font-semibold">{name || "FULL NAME"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-300">Expires</span>
              <span className="font-semibold">{date || "MM/YY"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-300">CVC</span>
              <span className="font-semibold">{cvc || "•••"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Inputs */}
      <form className="space-y-4">
        {/* Card Number */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Card Number</label>
          <input
            {...getCardNumberProps({
              value: number,
              onChange: (e) => {
                // remove non-digits
                const value = e.target.value.replace(/\D/g, "");
                setNumber(value);
              },
              name: "number",
            })}
            placeholder="XXXX XXXX XXXX XXXX"
            className="w-full rounded-md border border-gray-400 bg-gray-900
                       text-white placeholder-gray-400 p-4
                       focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400
                       shadow-md transition"
          />
          {meta.error && <small className="text-red-500 mt-1">{meta.error}</small>}
        </div>

        {/* Card Name */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Card Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            placeholder="Full Name"
            className="w-full rounded-md border border-gray-400 bg-gray-900
                       text-white placeholder-gray-400 p-4
                       focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400
                       shadow-md transition"
          />
        </div>

        {/* Expiry Date */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Expiration Date</label>
          <input
            {...getExpiryDateProps({
              value: date,
              onChange: (e) => setDate(e.target.value),
              name: "expiry",
            })}
            placeholder="MM/YY"
            className="w-full rounded-md border border-gray-400 bg-gray-900
                       text-white placeholder-gray-400 p-4
                       focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400
                       shadow-md transition"
          />
        </div>

        {/* CVC */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">CVC</label>
          <input
            {...getCVCProps({
              value: cvc,
              onChange: (e) => setCvc(e.target.value),
              name: "cvc",
            })}
            placeholder="XXX"
            className="w-full rounded-md border border-gray-400 bg-gray-900
                       text-white placeholder-gray-400 p-4
                       focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400
                       shadow-md transition"
          />
        </div>
      </form>
    </div>
  );
};

export default CreditCard;
