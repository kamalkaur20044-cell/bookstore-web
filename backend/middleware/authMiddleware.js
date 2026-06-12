import jwt from "jsonwebtoken";

// Verify JWT and attach decoded payload to req.user
export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { _id, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Must be used after protect
export const isAdmin = (req, res, next) => {
  protect(req, res, () => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }
    next();
  });
};
