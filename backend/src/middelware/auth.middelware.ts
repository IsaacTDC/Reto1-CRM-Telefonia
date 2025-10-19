import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function verifyToken (req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded; // guardo datos del usuario en la request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};