import { Request, Response, NextFunction } from "express";

export function isAdmin (req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  if (user.rol !== "administrador") {
    return res.status(403).json({ message: "Acceso denegado. Solo administradores pueden realizar esta acción." });
  }

  next();
};