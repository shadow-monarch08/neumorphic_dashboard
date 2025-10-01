import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import CustomInputField from "../components/inputs/CustomInputField";
import { motion } from "framer-motion";
import { lottie, icons, images } from "../constants";
import phrases from "../constants/phrases";
import CustomButton from "../components/button/CustomButton";
import { useAuthStore } from "../store/auth.store";
import type { SignUpPayload } from "../types/auth";
import { signUp } from "../api/auth";

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

const SignUp: React.FC = () => {
  // Form state
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Validation/status state
  const [status, setStatus] = useState<
    Record<string, "none" | "error" | "success">
  >({
    name: "none",
    email: "none",
    password: "none",
    confirmPassword: "none",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Email validation
  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      // Example validation
      let hasError = false;
      const newStatus = { ...status };

      if (!formData.name.trim()) {
        newStatus.name = "error";
        hasError = true;
      } else if (status.name === "error") {
        newStatus.name = "success";
      }

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

      if (
        formData.confirmPassword !== formData.password ||
        !formData.confirmPassword
      ) {
        newStatus.confirmPassword = "error";
        hasError = true;
      } else if (status.name === "error") {
        newStatus.confirmPassword = "success";
      }

      setStatus(newStatus);
      console.log(hasError);

      if (!hasError) {
        setIsLoading(true);
        // Simulate API call
        const payload: SignUpPayload = {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        };

        const res = await signUp(payload);

        // res.data: { token, user }
        const { token, user } = res.data;

        // persist auth
        setAuth(token, user);
        // redirect to dashboard
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100svh] w-full flex items-center justify-center bg-primary px-6">
      <motion.div
        className="flex w-full max-w-6xl h-[42rem] rounded-2xl overflow-hidden neumorphic-flat"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left Side Image */}
        <div className="hidden md:flex w-1/2 h-full bg-secondary items-center justify-center">
          <motion.img
            src={images.signupIllustration}
            alt="Sign up illustration"
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
              Create Account
            </h1>
            <p className="text-center text-black-100 font-plight text-[0.95rem] mt-2">
              Join us and start your journey 🚀
            </p>
          </div>

          <form className="mt-10" onSubmit={handleSubmit}>
            {/* Name & Email Row */}
            <div className="flex flex-col md:flex-row gap-3">
              <CustomInputField
                icon={lottie.account}
                type="text"
                name="name"
                label="Your Name"
                placeholder="e.g. Bonnie Green"
                status={status.name}
                errorMessage="Please enter your name"
                successMessage="Looks Good"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (status.name === "error")
                    setStatus({ ...status, name: "success" });
                }}
              />
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
            </div>

            {/* Password */}
            <CustomInputField
              icon={lottie.lock}
              type="password"
              name="password"
              label="Password"
              placeholder="Password"
              status={status.password}
              errorMessage="Please enter a valid password"
              successMessage="Looks Good"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (status.password === "error")
                  setStatus({ ...status, password: "success" });
              }}
              containerClassName="mt-4"
            />

            {/* Confirm Password */}
            <CustomInputField
              icon={lottie.lock}
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Password"
              status={status.confirmPassword}
              errorMessage="Passwords do not match"
              successMessage="Looks Good"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                });
                if (status.confirmPassword === "error")
                  setStatus({ ...status, confirmPassword: "success" });
              }}
              containerClassName="mt-4"
            />

            {/* Submit Button */}
            <CustomButton
              text="Sign Up"
              type="submit"
              moreStyle="w-full mt-6 text-tertiary-100"
              isDisabled={isLoading}
            />

            {/* Social Login */}
            <p className="font-plight text-[0.9rem] mt-6 text-center text-tertiary-100">
              or sign up with
            </p>
            <div className="mt-6 flex justify-center gap-3">
              {phrases.footer[1].icon.map((item: string, index: number) => (
                <AuthWidget icon={icons[item]} key={index} />
              ))}
            </div>

            {/* Redirect to Login */}
            <div className="flex mt-6 justify-center gap-1">
              <p className="font-plight text-[0.9rem] text-tertiary-100">
                Already have an account?
              </p>
              <Link
                className="text-[0.9rem] font-pregular text-tertiary-100"
                to="/sign-in"
              >
                Login here
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
