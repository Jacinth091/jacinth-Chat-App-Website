import bcrypt from "bcryptjs";
import { clearToken, generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";

export const signup = async (req,res) =>{
  const {firstName, lastName, middleName, email, password, dateOfBirth} = req.body;
  try{
    
    if(!firstName || !lastName || !email || !password){

      return res.status(400).json({message: "All field are required to proceed!"});
    }

    if(password.length < 6){
      return res.status(400).json({message: "Password must contain atleast 6 characters!"});
    }

    const user = await User.findOne({email});
    // console.log(user._id);

    if(user) {return req.status(400).json({message: "This email already exist!"})};


    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      middleName,
      lastName,
      email,
      dateOfBirth,
      password: hashedPass

    });


    if(newUser){
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id:newUser._id,
        firstName: newUser.firstName,
        middleName: newUser.middleName,
        lastName: newUser.lastName,
        email : newUser.email,
        dateOfBirth: newUser.dateOfBirth,
        profilePic: newUser.profilePic,
        password: newUser.password
      })

    }else{
      res.status(400).json({message: "Invalid user credentials!"});
    }


  }catch(error){
    console.log(error);
    console.log("Error in the signup controller", error.message);
    res.status(500).json({message: "Internal Server Error!"});
  }

}

export const login = async(req,res) =>{
  const {email, password} = req.body;
  try {
    if(!email || !password){

      return res.status(400).json({message: "All field are required to proceed!"});
    }

    if(password.length < 6){
      return res.status(400).json({message: "Password must contain atleast 6 characters!"});
    }

    const user = await User.findOne({email});
    // console.log(user._id);

    if(!user) {return req.status(400).json({message: "Invalid email or password!"})};


    const isCredentialsValid = await bcrypt.compare(password, user.password);
    if(!isCredentialsValid){
      res.status(400).json({message: "Invalid email or password!"});
    }

    generateToken(user._id, res);

    res.status(200).json({
      message : "Successfully logged in",
      _id: user._id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      profilePic: user.profilePic,
    })



    
  } catch (error) {
    console.log("Error in the login controller", error.message);
    res.status(500).json({message: "Internal Server Error!"});
  }


}

export const logout =  (req,res) =>{
  try {
    if(clearToken(req,res)){
      res.status(200).json({message: "Logged out successfully!"});
    }
    else{
      res.status(400).json({message: "Unable to logout account!"});
  
    }
  } catch (error) {
    console.log("Error in the logout controller", error.message);
    res.status(500).jsn({message:"Internal Server Error!"});

  }
}


export const updateProfile = async(req, res) =>{
  
}