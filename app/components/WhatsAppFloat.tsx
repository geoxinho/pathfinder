"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const WhatsAppFloat = () => {
  const phoneNumber = "2348168303357"; // Replace with actual school phone number
  const message = "Hello Pathfinder College, I would like to make an inquiry.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1.5 
      }}
      className="fixed bottom-6 right-6 z-50"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-[#25D366]/40 transition-all duration-300 hover:-translate-y-1"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={32} />
        
        {/* Tooltip */}
        <span className="absolute right-full mr-4 px-3 py-1 bg-white text-[#0E539C] text-sm font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-slate-100">
          Chat with us!
        </span>

        {/* Pulse effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-0" />
      </a>
    </motion.div>
  );
};

export default WhatsAppFloat;
