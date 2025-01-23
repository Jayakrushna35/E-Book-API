import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import createHttpError from 'http-errors';

const createUser = async(req:Request,res:Response,next:NextFunction) =>{
    console.log(req.body);
    const  {name , email , password } = req.body;
    if( !name || !email || !password){
        const error = createHttpError(400,"All fields are required");
        return next(error);
    }

    res.json({message:"user created"})    

};

export {createUser};
