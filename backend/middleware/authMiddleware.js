import jwt from "jsonwebtoken";

export const authenticate =
  (allowedRoles = []) =>
  (req, res, next) => {
    const auth = req.headers.authorization || "";
    if (!auth.startsWith("Bearer ")) {
      return res
        .status(403)
        .json({ error: "Missing or invalid Authentication header" });
    }
    try {
      const payLoad = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
      req.auth = payLoad;
      if (allowedRoles.length && !allowedRoles.includes(payLoad.role)) {
        return res.status(403).json({ error: "Forbidden: Insufficient Role" });
      }
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };

export const requireAuth =
  (...allowedRoles) =>
  (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.sendStatus(401);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (allowedRoles.length && !allowedRoles.includes(decoded.role))
        return res.sendStatus(403);
      req.auth = decoded;
      next();
    } catch (err) {
      return res.sendStatus(403);
    }
  };
