import nodemailer from "nodemailer";
import { envVariables } from "./env";

export const accountEmail = "jackiechank23@gmail.com"

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: accountEmail,
        pass: envVariables.emailPassword
    }
})
