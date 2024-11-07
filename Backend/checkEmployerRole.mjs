// middleware/checkEmployerRole.mjs
import jwt from "jsonwebtoken";

const JWT_SECRET = "this_secret_should_be_longer_than_it_is";

export function checkEmployerRole(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  
  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded.role !== "employer") {
      return res.status(403).json({ message: "Access denied. Employer role required." });
    }

    req.userData = decoded; // Attach user data to request object
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
}
