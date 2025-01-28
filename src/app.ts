import express from 'express';
import createHttpError,{ HttpError } from 'http-errors';
import globalErrorHandler from './middleware/globalErrorHandler';
import userRouter from '../user/userRouter';
import bookRouter from '../book/bookRouter';
import cors from 'cors';
import { config } from './config/config'


const app = express();

app.get('/', (req, res, next) => {
   const error = createHttpError(400,"Something went wrong");
   throw error;
   res.json({ message: "Welcome to elib apis" });
});
app.use(express.json());
app.use(cors({
   origin : config.localHostDomain,
}));
app.use('/api/users',userRouter);
app.use('/api/books',bookRouter);
app.use(globalErrorHandler);

export default app;