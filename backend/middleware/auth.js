import { clerkClient, verifyToken } from "@clerk/clerk-sdk-node";

const requireClerkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const payload = await verifyToken(token);
    req.userId = payload.sub;

    // gets user metadata
    const user = await clerkClient.users.getUser(req.userId);
    req.user = user;
    next();
  } catch (err) {
    console.log("Error verifying clerk login");
    return res.status(401).json({ error: "Unathorized" });
  }
};

const requireAdmin = (req, res, next) => {
  const role = req.user?.publicMetadata.role;
  if (role !== "admin") {
    return res.status(403).json({ error: "Admin access only" });
  }
  next();
};

module.exports = { requireClerkAuth, requireAdmin };
