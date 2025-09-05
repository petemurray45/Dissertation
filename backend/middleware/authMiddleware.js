import jwt from "jsonwebtoken";

export const authenticate =
  (allowedRoles = []) =>
  (req, res, next) => {
    // checks authorization headers and sets to empty string if empty
    const auth = req.headers.authorization || "";
    // if the header doesnt start with "Bearer" returns 403
    if (!auth.startsWith("Bearer ")) {
      return res
        .status(403)
        .json({ error: "Missing or invalid Authentication header" });
    }
    try {
      // slices "Bearer" from token to verify only the secret key
      const payLoad = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
      req.auth = payLoad;
      // if role in token doesnt match allowed roles passed returns 403
      if (allowedRoles.length && !allowedRoles.includes(payLoad.role)) {
        return res.status(403).json({ error: "Forbidden: Insufficient Role" });
      }
      // if it does it lets the token pass through
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };

export const requireAuth =
  (...allowedRoles) =>
  (req, res, next) => {
    // splits header in two and selects second index
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "No auth token" });
    try {
      // decodes token to find out role associated
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // if role doesnt match role passed returns 403
      if (allowedRoles.length && !allowedRoles.includes(decoded.role))
        return res.sendStatus(403);
      req.auth = decoded;
      // if it does it passes through
      next();
    } catch (err) {
      return res.sendStatus(403);
    }
  };
