import React from "react";
import { motion } from "framer-motion";

const LoadingScreen: React.FC<{ text?: string }> = ({
  text = "Loading...",
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary bg-opacity-10 backdrop-blur-sm">
      <motion.div
        className="w-24 h-24 rounded-2xl bg-tertiary-100 neumorphic-flat-sm flex items-center justify-center"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="w-6 h-6 rounded-full bg-primary"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Loading Text */}
      <motion.p
        className="mt-4 text-tertiary-100 font-plight text-lg"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
      >
        {text}
      </motion.p>
    </div>
  );
};

export default LoadingScreen;
