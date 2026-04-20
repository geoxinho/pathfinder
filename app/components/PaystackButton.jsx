// components/PaystackButton.jsx
"use client";
import { usePaystackPayment } from "react-paystack";

const config = {
  reference: new Date().getTime().toString(),
  email: "parent@email.com",
  amount: 50000 * 100, // ₦50,000 in kobo
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  currency: "NGN",
};

export default function PaystackButton() {
  const initializePayment = usePaystackPayment(config);

  return (
    <button
      onClick={() =>
        initializePayment({
          onSuccess: (res) => console.log("Payment successful", res),
          onClose: () => console.log("Payment closed"),
        })
      }
    >
      Pay School Fees
    </button>
  );
}
