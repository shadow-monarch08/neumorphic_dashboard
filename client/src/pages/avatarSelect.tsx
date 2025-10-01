import React, { useState } from "react";
import { motion } from "framer-motion";
import CustomButton from "../components/button/CustomButton";
import avatars from "../constants/avatars";

const avatarsArray = [
  "avatar_1",
  "avatar_2",
  "avatar_3",
  "avatar_4",
  "avatar_5",
  "avatar_6",
  "avatar_7",
  "avatar_8",
  "avatar_9",
  "avatar_10",
];

const AvatarSelect: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleConfirm = () => {
    if (selected !== null) {
      console.log("Selected Avatar:", avatarsArray[selected]);
      // TODO: Save avatar choice to backend or context
    }
  };

  return (
    <section className="min-h-screen w-full flex justify-center items-center">
      <div className="min-h-[85%] w-[55rem] rounded-2xl neumorphic-flat-sm py-12 px-10 flex flex-col items-center bg-primary/90 backdrop-blur-md">
        {/* Title */}
        <motion.h1
          className="text-center text-[1.8rem] text-tertiary-100 font-psemibold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Pick Your Avatar
        </motion.h1>
        <motion.p
          className="text-center text-black-100 font-plight mt-2 text-[0.95rem]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          This will represent you across the app ✨
        </motion.p>

        {/* Avatar Grid */}
        <motion.div
          className="grid grid-cols-5 gap-8 mt-12"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {avatarsArray.map((avatar, index) => (
            <motion.div
              key={index}
              onClick={() => setSelected(index)}
              className={`relative cursor-pointer flex items-center justify-center rounded-full p-3 transition-all duration-300 
              ${
                selected === index
                  ? "ring-4 ring-secondary-100 shadow-xl"
                  : "hover:ring-2 hover:ring-secondary-200"
              }`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <motion.img
                src={avatars[avatar as keyof typeof avatars]}
                alt={`avatar-${index}`}
                className="h-[6rem] w-[6rem] rounded-full object-cover neumorphic-flat-xs"
                animate={
                  selected === index
                    ? {
                        y: [0],
                        scale: [1, 1.15, 1],
                        boxShadow: "0px 0px 25px rgba(147,165,119,0.8)",
                      }
                    : { y: [0, -4, 0] } // floating effect
                }
                transition={
                  selected === index
                    ? { duration: 0.6, repeat: Infinity }
                    : { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }
              />
            </motion.div>
          ))}
        </motion.div>
        <div className="h-12 w-full mt-12">
          {/* Confirm Button */}
          {selected !== null && (
            <motion.div
              className="w-full flex justify-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CustomButton
                text="Confirm Avatar"
                moreStyle="w-[55%] py-3 rounded-full bg-gradient-to-r from-secondary-100 to-tertiary text-white font-pmedium"
                isDisabled={false}
                onClick={handleConfirm}
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AvatarSelect;
