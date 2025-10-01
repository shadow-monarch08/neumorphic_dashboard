import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import CustomInputField from "../components/inputs/CustomInputField";
import CustomButton from "../components/button/CustomButton";
import { icons, images, lottie, phrases } from "../constants";
import { motion } from "framer-motion";
import type { SignInPayload } from "../types/auth";
import { signIn } from "../api/auth";
import { useAuthStore } from "../store/auth.store";

const AuthWidget = ({ icon }: { icon: string }) => {
  return (
    <div className="h-[2.7rem] w-[2.7rem] p-3 neumorphic-flat-xs rounded-xl flex items-center justify-center">
      <img
        src={icon}
        alt="widgetIcon"
        className="h-full w-full object-contain"
      />
    </div>
  );
};

const SignIn: React.FC = () => {
  // Form state
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Validation/status state
  const [status, setStatus] = useState<
    Record<string, "none" | "error" | "success">
  >({
    email: "none",
    password: "none",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Email validation
  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasError = false;
    const newStatus = { ...status };

    if (!validateEmail(formData.email)) {
      newStatus.email = "error";
      hasError = true;
    } else if (status.name === "error") {
      newStatus.email = "success";
    }

    if (!formData.password) {
      newStatus.password = "error";
      hasError = true;
    } else if (status.name === "error") {
      newStatus.password = "success";
    }

    setStatus(newStatus);

    if (!hasError) {
      setIsLoading(true);
      // Simulate API call
      setIsLoading(true);
      // Simulate API call
      const payload: SignInPayload = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      const res = await signIn(payload);

      // res.data: { token, user }
      const { token, user } = res.data;

      // persist auth
      setAuth(token, user);
      // redirect to dashboard
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div className="h-[100svh] w-full flex items-center justify-center bg-primary px-6">
      <motion.div
        className="flex w-full max-w-6xl h-[38rem] rounded-2xl overflow-hidden neumorphic-flat"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left Side Illustration */}
        <div className="hidden md:flex w-1/2 h-full bg-secondary items-center justify-center">
          <motion.img
            src={images.signinIllustration}
            alt="Sign in illustration"
            className="object-contain h-[75%] drop-shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 h-full bg-primary flex flex-col justify-center px-10 py-12">
          <div>
            <h1 className="text-center text-[1.8rem] text-tertiary-100 font-psemibold">
              Welcome Back
            </h1>
            <p className="text-center text-black-100 font-plight text-[0.95rem] mt-2">
              Sign in to continue your journey 🌟
            </p>
          </div>

          <form className="mt-10" onSubmit={handleSubmit}>
            {/* Email */}
            <CustomInputField
              icon={lottie.email}
              type="email"
              name="email"
              label="Your Email"
              placeholder="example@email.com"
              status={status.email}
              errorMessage="Please enter a valid email"
              successMessage="Looks Good"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (status.email === "error") {
                  validateEmail(e.target.value)
                    ? setStatus({ ...status, email: "success" })
                    : setStatus({ ...status, email: "error" });
                }
              }}
            />

            {/* Password */}
            <CustomInputField
              icon={lottie.lock}
              type="password"
              name="password"
              label="Password"
              placeholder="Password"
              status={status.password}
              errorMessage="Please enter your password"
              successMessage="Looks Good"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (status.password === "error")
                  setStatus({ ...status, password: "success" });
              }}
              containerClassName="mt-6"
            />

            {/* Lost Password */}
            <p
              onClick={() => {}}
              className="font-plight text-[0.9rem] mt-6 cursor-pointer text-tertiary-100 hover:underline"
            >
              Lost password?
            </p>

            {/* Submit Button */}
            <CustomButton
              text="Sign In"
              type="submit"
              moreStyle="w-full mt-8 text-tertiary-100"
              isDisabled={isLoading}
            />

            {/* Social Login */}
            <p className="font-plight text-[0.9rem] mt-6 text-center text-tertiary-100">
              or login with
            </p>
            <div className="mt-6 flex justify-center gap-3">
              {phrases.footer[1].icon.map((item: string, index: number) => (
                <AuthWidget icon={icons[item]} key={index} />
              ))}
            </div>

            {/* Redirect to Sign Up */}
            <div className="flex mt-6 justify-center gap-1">
              <p className="font-plight text-[0.9rem] text-tertiary-100">
                Don’t have an account?
              </p>
              <Link
                className="text-[0.9rem] font-pregular text-tertiary-100 hover:underline"
                to="/sign-up"
              >
                Sign up here
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
