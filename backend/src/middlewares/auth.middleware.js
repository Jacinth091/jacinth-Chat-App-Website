import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async(req, res, next) =>{
  try {
    const token = req.cookies.jwt;

    if(!token){
      res.status(401).json({message: "Unauthorized! - No token provided!"});
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if(!decoded){
      res.status(401).json({message: "Unauthorized! - Invalid token provided!"});
    }

    const user = await User.findOne(decoded.userId).select("-password");
    if(!user){
      res.status(401).json({message: "No user found!"});
    }

    req.user = user;

    next();
    


  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    res.status(500).json({message: "Internal Server Error!"});

  }
}