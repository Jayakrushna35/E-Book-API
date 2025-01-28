import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import createHttpError from 'http-errors';
import fs from 'node:fs';
import cloudinary from '../src/config/cloudinary';
import path from 'node:path';
import bookModel from './bookModel';
import { title } from 'node:process';
import  {AuthRequest} from '../src/middleware/authenticate';



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
   const bookfilePath = path.resolve(__dirname,"../../public/data/uploads",bookFileName);
    

   const bookFileUploadResult = await cloudinary.uploader.upload(bookfilePath,{
    resource_type:"raw",
    filename_override:bookFileName,
    folder:"book-pdfs",
    format:"pdf",
   })

   const _req = req as AuthRequest;
   
   const newBook = await bookModel.create({
    title,
    genre,
    author:_req.userId,
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

const updateBook = async(req:Request,res:Response,next:NextFunction)=>{
  const{ title , genre} = req.body;
  const bookId = req.params.bookId;

  const book = await bookModel.findOne({_id:bookId});

  if(!book){
    return next(createHttpError(404,"Book not found"));
  }

  const _req = req as AuthRequest;
  if (book.author.toString() !== _req.userId.toString()) {
    return next(createHttpError(403, "You are not authorized to update this book"));
  }
  const files = req.files as {[filename:string]: Express.Multer.File[];}
  let completeCoverImage = "";
  if (files.coverImage){
    const filename = files.coverImage[0].filename;
    const converMimeType = files.coverImage[0].mimetype.split("/").at(-1);
     
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads/" + filename
    );
    completeCoverImage = filename;
    const uploadResult = await cloudinary.uploader.upload(filePath,{
      filename_override: completeCoverImage,
      folder:"book-covers",
      format:"converMimeType "
    });
    completeCoverImage = uploadResult.secure_url;
    await fs.promises.unlink(filePath);


  }
  let completeFileName = "";
    if(files.file){
      const bookFilePath = path.resolve(
        __dirname,
        "../../public/data/uploads" + files.file[0].filename
      );

      const bookFileName = files.file[0].filename;
      completeFileName = `${bookFileName}.pdf`;


      const uploadResult = await cloudinary.uploader.upload(bookFilePath,{
        resource_type:"raw",
        filename_override: completeFileName,
        folder:"book-covers",
        format:"pdf"
      });
      completeFileName = uploadResultPdf.secure_url;
      await fs.promises.unlink(bookFilePath);
    }
    const updatedBook = await bookModel.findOneAndUpdate(
      {
        _id : bookId,
      },{
        title:bookId,
        genre:genre,
        coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
        file: completeFileName ? completeFileName : book.file,

      },
      {new:true}
    );

}; 
 const listBooks = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const book = await bookModel.find();
    res.json(book);
  }catch(err){
    return next(createHttpError(500,"Error while getting a book"));
  }
 };
const getsingleBook = async(req:Request,res:Response,next:NextFunction)=>{
   const bookId = req.params.bookId;
   try{
       const book = await bookModel.findOne({_id : bookId});
       if(!book){
        return next(createHttpError(404,"Book not found"))
       }
       return res.json(bookId);
   }catch(err){
    return next (createHttpError(500,"Error while getting a book"));
   }

};
export {createBook,updateBook,listBooks};