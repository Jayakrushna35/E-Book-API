import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

const createUser = async(req:Request,res:Response,next:NextFunction) =>{
    res.json({message:"user created"})    

};

export {createUser};
