import express from "express";
import { PORT,mongoDBUrl } from "./config.js";
import { connect } from "./helpers/connection.js";
import pdfRouter from "./routes/pdfRouter.js"
import cors from "cors";
import multer from "multer";


const app=express();

app.use(cors());
//middleware for parsing request body
app.use(express.json());


app.use('/api',pdfRouter);

app.get('/',(req,res)=>{
    res.send("hi bro")
})


connect((err,data)=>{
    if(err){
        console.log("connection error occurred: ",err);
    }else{
        console.log("connected to atlas");
        app.listen(PORT,()=>{
                    console.log(`app is listening at port ${PORT}`);
                })
    }
});

// mongoose.connect(mongoDBUrl).then(()=>{
//     console.log("connected to atlas")
//     app.listen(PORT,()=>{
//         console.log(`app is listening at port ${PORT}`);
//     })
// }).catch((err)=>{
//     console.log(err);
// })
