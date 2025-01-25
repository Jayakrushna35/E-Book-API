import { v2 as cloudinary } from 'cloudinary';
import { config } from './config';


// Configuration
cloudinary.config({ 
    cloud_name: config.cloudinary, 
    api_key: config.cloudinaryapikey, 
    api_secret: config.cloudinaryapisecret, // Click 'View API Keys' above to copy your API secret
});

export default cloudinary;