import express from 'express';
import createHttpError,{ HttpError } from 'http-errors';
import globalErrorHandler from './middleware/globalErrorHandler';


const app = express();

app.get('/', (req, res, next) => {
   const error = createHttpError(400,"Something went wrong");
   throw error;
    res.json({ message: "Welcome to elib apis" });
});


app.use(globalErrorHandler);

export default app;