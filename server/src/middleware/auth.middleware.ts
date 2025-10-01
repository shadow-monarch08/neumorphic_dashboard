/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { envVariables } from "../config/env";
import User from "../models/user.model";

type decodeToken = {
  userId: string;
};

const authorize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const decoded = jwt.verify(token, envVariables.jwtSecret) as decodeToken;

    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    res.status(401).json({
      message: "Unauthorized",
      error: error.message,
    });
  }
};

export default authorize;
