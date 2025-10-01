import React, { useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

import { icons, lottie, avatars, images } from "../../constants";
import LordIconPlayer from "../../utils/LordIconPlayer";
import type { User } from "../../types/user";
// import { UserData } from "@/src/types"; // Define your own type for user data

interface DashboardHeaderProps {
  userData: User | null;
  loading: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userData,
  loading,
}) => {
  const navigate = useNavigate();
  const iconRef = useRef<any[]>([]);

  // Loading animation variants
  const loadingVariant = {
    initial: { opacity: 0.4 },
    animate: {
      opacity: [0.4, 1, 0.4],
      transition: { repeat: Infinity, duration: 1.5 },
    },
  };

  const handleHover = (index: number) => {
    if (iconRef.current[index]) {
      iconRef.current[index].playFromBeginning?.();
    }
  };

  return (
    <div className="relative w-full h-fit">
      {/* Background strip with image */}
      <div className="flex flex-row-reverse w-full h-[11em] bg-secondary-200 neumorphic-flat-xs">
        <img
          src={images.dashboard_header_decoration}
          alt="dashImage"
          className="h-full w-[45%] object-cover no-selection"
        />
      </div>

      {/* Spacer */}
      <div className="h-[11em]" />

      {/* Profile section */}
      <div className="h-[12em] w-fit absolute top-1/2 left-[10%] -translate-y-1/2 flex items-center">
        {/* Avatar */}
        <div className="h-[13em] w-[13em] neumorphic-in-xs relative rounded-full p-5">
          {loading ? (
            <motion.div
              className="gradient-effect2 h-full w-full rounded-full"
              variants={loadingVariant}
              initial="initial"
              animate="animate"
            />
          ) : (
            <div className="h-full w-full neumorphic-flat-xs flex justify-center items-center rounded-full bg-secondary overflow-hidden p-4">
              {userData?.avatar ? (
                <img
                  src={userData.avatar}
                  alt="user avatar"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="relative h-fit w-fit">
                  <img
                    src={avatars.avatar_1}
                    alt="placeholder avatar"
                    className="h-full w-full object-contain rounded-full"
                  />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full">
                    {/* <p className="text-center text-tertiary-100 font-psemibold text-[1.3rem]">
                      No Profile
                    </p> */}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Edit Avatar Button */}
          <div
            className="h-[2rem] w-[2rem] absolute right-[10%] top-[75%] neumorphic-flat-xs rounded-full cursor-pointer p-2 bg-secondary-200"
            onClick={() => navigate("/selectAvatar", { replace: false })}
          >
            <img src={icons.edit} alt="edit icon" className="h-full w-full" />
          </div>
        </div>

        {/* User Info */}
        <div className="h-full px-9">
          <div className="h-1/2 flex flex-col text-secondary">
            {loading ? (
              <>
                <motion.div
                  className="gradient-effect2 h-[3rem] w-[19rem] mb-3 rounded-full"
                  variants={loadingVariant}
                  initial="initial"
                  animate="animate"
                />
                <motion.div
                  className="gradient-effect2 h-[1.5rem] w-[17rem] rounded-full"
                  variants={loadingVariant}
                  initial="initial"
                  animate="animate"
                />
              </>
            ) : (
              <>
                {/* Name */}
                <div
                  className="flex gap-2 items-center"
                  onMouseEnter={() => handleHover(0)}
                >
                  <LordIconPlayer
                    icon={lottie.account}
                    size={24}
                    color="#cbccbe"
                    ref={(el) => {
                      iconRef.current[0] = el;
                    }}
                  />
                  <h1 className="text-[2.4rem] font-pmedium">
                    {userData?.user.name}
                  </h1>
                </div>
                {/* Email */}
                <div
                  className="flex gap-2 items-center"
                  onMouseEnter={() => handleHover(1)}
                >
                  <LordIconPlayer
                    icon={lottie.email}
                    size={24}
                    color="#cbccbe"
                    ref={(el) => {
                      iconRef.current[1] = el;
                    }}
                  />
                  <p className="font-plight text-[1.3rem]">
                    {userData?.user.email}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="h-1/2 flex items-start py-8 gap-10">
            {loading ? (
              <>
                <motion.div
                  className="gradient-effect h-[2.5rem] neumorphic-flat-xs w-[12rem] rounded-full"
                  variants={loadingVariant}
                  initial="initial"
                  animate="animate"
                />
                <motion.div
                  className="gradient-effect h-[2.5rem] neumorphic-flat-xs w-[12rem] rounded-full"
                  variants={loadingVariant}
                  initial="initial"
                  animate="animate"
                />
              </>
            ) : (
              <>
                <div
                  className="neumorphic-flat-xs py-2 px-3 flex gap-2 items-center rounded-3xl"
                  onMouseEnter={() => handleHover(2)}
                >
                  <LordIconPlayer
                    icon={lottie.home_2}
                    size={20}
                    color="#526459"
                    ref={(el) => {
                      iconRef.current[2] = el;
                    }}
                  />
                  <p className="text-secondary-200 font-pregular">
                    Tasks: {userData?.taskSummary.totalTasks ?? 0}
                  </p>
                </div>
                <div
                  className="neumorphic-flat-xs py-2 px-3 flex gap-2 items-center rounded-3xl"
                  onMouseEnter={() => handleHover(3)}
                >
                  <LordIconPlayer
                    icon={lottie.settings}
                    size={20}
                    color="#526459"
                    ref={(el) => {
                      iconRef.current[3] = el;
                    }}
                  />
                  <p className="text-secondary-200 font-pregular">
                    Completed: {userData?.taskSummary.completedTasks ?? 0}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
