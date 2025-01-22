import app from "./src/app";    

const startServer =() =>{
    const port = process.env.PORT || 3000;


    app.listen(port,()=>{
        console.log(`Listern on port: ${port}`)
    });
};

startServer();