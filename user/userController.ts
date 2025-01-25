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
        res.json({ accessToken: token });   
    }catch(err) {
        return next (createHttpError(500,"Error while getting user"));
    }    
        
};

export {createUser};
