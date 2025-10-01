import { Request, Response, NextFunction } from "express";
import aj from "../config/arcjet";

const arcjetMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).send({ error: "Rate limit exceeded" });
        return;
      }
      if (decision.reason.isBot()) {
        res.status(403).send({ error: "Bot detected" });
        return;
      }

      res.status(403).json({ error: "Access denied" });
      return;
    }

    next();
  } catch (error) {
    console.error("Arcjet middleware error: ", error);
    next(error);
  }
};


export default arcjetMiddleware