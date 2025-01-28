import  express  from "express";
import { createBook, listBooks, updateBook, getsingleBook } from "./bookController";
import multer from "multer";
import path from "node:path";
import authenticate from "../src/middleware/authenticate";


const bookRouter = express.Router();
const upload = multer({
    dest:path.resolve(__dirname,'../public/data/uploads'),
    limits:{fileSize:1e7}
});

bookRouter.post("/",authenticate, upload.fields([
    { name: 'converImage', maxCount: 1 },
    { name: 'file', maxCount: 1 }
]), createBook);
bookRouter.patch("/:bookId",authenticate, upload.fields([
    { name: 'converImage', maxCount: 1 },
    { name: 'file', maxCount: 1 }
]), updateBook);

bookRouter.get("/",listBooks);
bookRouter.get("/:bookId",getsingleBook);

export default bookRouter;


