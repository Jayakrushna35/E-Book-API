import { config as conf} from "dotenv";


conf();

const _config ={
    port: process.env.PORT,
    databaseurl: process.env.MONGO_CONNECTION_STRING,
    env:process.env.NODE_ENV,
    jwtSerect: process.env.JWT_SECRET,
    cloudinary: process.env.CLOUDINARY_CLOUD,
    cloudinaryapikey: process.env.CLOUDINARY_API_KEY,
    cloudinaryapisecret: process.env.CLOUDINARY_API_SECRET,
};
export const config = Object.freeze(_config);