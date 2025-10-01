import React, { useRef } from "react";
import { motion } from "framer-motion";
import LordIconPlayer from "../../utils/LordIconPlayer";
import { lottie } from "../../constants";

interface ButtonProps {
  text: string;
  scale?: number;
  moreStyle?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isDisabled?: boolean;
  icon?: any; // lottie JSON object
}

const CustomButton: React.FC<ButtonProps> = ({
  text,
  scale = 1,
  moreStyle = "text-tertiary-100",
  type = "button",
  onClick,
  isDisabled = false,
  icon,
}) => {
  const iconRef = useRef<any>(null);

  const handleHover = () => {
    if (icon && iconRef.current) {
      iconRef.current.playFromBeginning?.();
    }
  };

  return (
    <motion.button
      className={`neumorphic-flat-xs py-3 px-4 rounded-lg cursor-pointer h-fit text-base font-pregular w-full flex-1 overflow-hidden relative flex justify-center items-center gap-3 ${moreStyle} `}
      whileHover={{
        boxShadow: "inset 2px 2px 4px #bebebe, inset -2px -2px 4px #ffffff",
        scale: scale,
      }}
      whileTap={!isDisabled ? { scale: 0.9 } : {}}
      onClick={onClick}
      type={type}
      disabled={isDisabled}
      onMouseEnter={handleHover}
    >
      <span
        className={`no-selection text-tertiary-100 ${
          isDisabled ? "blur-sm" : ""
        }`}
      >
        {text}
      </span>

      {icon && (
        <div
          className={`
        ${isDisabled ? "blur-sm" : ""}
        `}
        >
          <LordIconPlayer
            size={24}
            icon={icon}
            color={"#645b52"}
            ref={iconRef}
          />
        </div>
      )}

      {isDisabled && (
        <div className="h-[4rem] w-[4rem] flex justify-center items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <LordIconPlayer
            icon={lottie.spinner_circle_loop}
            size={24}
            color={"#645b52"}
            infinite={true}
          />
        </div>
      )}
    </motion.button>
  );
};

export default CustomButton;
