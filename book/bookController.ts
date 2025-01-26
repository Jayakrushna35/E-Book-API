import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import createHttpError from 'http-errors';
import fs from 'node:fs';
import cloudinary from '../src/config/cloudinary';
import path from 'node:path';
import bookModel from './bookModel';
import { title } from 'node:process';



const createBook = async(req:Request,res:Response,next:NextFunction)=>{
    const {title,genre} = req.body;
   const files = req.files as { [filename: string]: Express.Multer.File[]};
   const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
   const filename = files.coverImage[0].filename;
   const filePath = path.resolve(__dirname,"../../public/data/uploads",filename);

   const uploadResult = await cloudinary.uploader.upload(filePath,{
     filename_override: filename,
     folder:"book-cover",
     format: coverImageMimeType,

   });
    
   const bookFileName = files.file[0].filename;
   const bookfilePath = path.resolve(__dirname,"../../public/data/uploads",filename);
    
   const bookFileUploadResult = await cloudinary.uploader.upload(bookfilePath,{
    resource_type:"raw",
    filename_override:bookFileName,
    folder:"book-pdfs",
    format:"pdf",
   })
   
   const newBook = await bookModel.create({
    title,
    genre,
    author:"",
    coverImage: uploadResult.secure_url,
    file:bookFileUploadResult.secure_url,
   });
   try{
     await fs.promises.unlink(filePath);
     await fs.promises.unlink(bookfilePath);
     res.status(201).json({id: newBook._id});
   }catch(err){
     return next(createHttpError(400,"file is not deleted"));
   }

 

   res.json({});
};


export {createBook};