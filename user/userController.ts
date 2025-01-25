import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import createHttpError from 'http-errors';
import userModel from './userModel';
import bcrypt from'bcrypt';
import { sign } from 'jsonwebtoken';
import { config }  from '../src/config/config';
import { User } from './userTypes';


const createUser = async(req:Request,res:Response,next:NextFunction) =>{
    console.log(req.body);
    const  {name , email , password } = req.body;
    if( !name || !email || !password){
        const error = createHttpError(400,"All fields are required");
        return next(error);
    }

    try{
       
        const user = await userModel.findOne({email:email});
        if(user){
            const error = createHttpError(400, "User already exists with this email.");
            return next(error);
        }
    }catch(err){
       return next(createHttpError(500,"Error while getting user"));
    }

    const hashPassword =  await bcrypt.hash(password,10);
    let newUser: User;
    try{
        newUser = await userModel.create({
            name,
            email,
            password:hashPassword,
        });
    } catch(err){
        return next (createHttpError(500,"Error while getting user"));
    }
    try{

        const token = sign({ sub: newUser._id }, config.jwtSerect as string,{ expiresIn : "7d",algorithm:'HS256'}); 
        res.status(201).json({ accessToken: token });   
    }catch(err) {
        return next (createHttpError(500,"Error while getting user"));
    }    
        
};
const loginUser = async(req:Request,res:Response,next:NextFunction)=>{
   const{email, password} = req.body;

   if(!email || !password){
    return next(createHttpError(400,"All fields are required"));
   }

   const user = await userModel.findOne({email:email});
   if (!user) {
     return next(createHttpError(404, "User not found"));
    }
    
   const isMatch = await bcrypt.compare(password, user.password as string);

   if(!isMatch){
    return next(createHttpError(400,"Username or password incorrect"));
   }
   try{
    const token = sign({ sub: user._id }, config.jwtSerect as string,{ expiresIn : "7d",algorithm:'HS256'}); 
    res.status(201).json({ accessToken: token }); 
   }catch(err){
    return next (createHttpError(500,"Error while getting user"));
   }
};


export {createUser,loginUser};
