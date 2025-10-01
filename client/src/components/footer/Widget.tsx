import React, { useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";

interface WidgetProps {
  icon: string; // path to icon image
  modalText: string;
}

const toggleWidgetModal: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 0.9 },
  exit: { opacity: 0 },
};

const Widget: React.FC<WidgetProps> = ({ icon, modalText }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  return (
    <motion.div
      className="h-[3rem] w-[3rem] neumorphic-flat-xs rounded-full flex justify-center items-center cursor-pointer relative"
      whileHover={{
        boxShadow: "inset 2px 2px 4px #bebebe, inset -2px -2px 4px #ffffff",
      }}
      onMouseEnter={() => setIsModalVisible(true)}
      onMouseLeave={() => setIsModalVisible(false)}
    >
      <img className="w-[55%] h-[55%]" src={icon} alt="widgetIcon" />

      <AnimatePresence initial={false} mode="wait">
        {isModalVisible && (
          <motion.div
            className="py-1 px-2 w-[13rem] h-fit neumorphic-in-xs origin-top opacity-90 rounded-lg absolute top-[-130%] left-1/2 -translate-x-1/2"
            variants={toggleWidgetModal}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="relative">
              <p className="text-center font-pregular text-sm">{modalText}</p>
              <div className="triangle3 absolute scale-50 rotate-180 left-1/2 -translate-x-1/2"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Widget;
