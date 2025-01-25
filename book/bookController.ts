import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import createHttpError from 'http-errors';
import cloudinary from '../src/config/cloudinary';
import path from 'node:path';



const createBook = async(req:Request,res:Response,next:NextFunction)=>{
   const files = req.files as { [filename: string]: Express.Multer.file[]};
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

   

   res.json({});
};


export {createBook};