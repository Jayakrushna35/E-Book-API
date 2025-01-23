import mongoose  from "mongoose";
import {config} from "./config"

const connectDB = async() =>{
    try{
        mongoose.connection.on("connected", () =>{
            console.log("connected to database successfully");
        });

        mongoose.connection.on("err",(err)=>{
            console.log("Error in connectiong to database." , err);
        })
        await mongoose.connect(config.databaseurl as string);

    }
    catch(err){
        console.log("failed to connect to database.", err);

        process.exit(1);
    }
        
};

export default connectDB;