import express from "express";
import bodyParser from "body-parser";
import configViewEngine from "./config/viewEngine"
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import cors from 'cors';

require('dotenv').config();

let app = express();
const corsOptions = [
  {
    origin: 'http://localhost:3000', // Thay đổi thành URL của client của bạn
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức HTTP mà bạn cho phép
    allowedHeaders: ['Content-Type', 'Authorization'], // Các header mà bạn cho phép
    credentials: true // Cho phép thông tin xác thực
  },
  {
    origin: 'https://booking-care-deploy-fe.vercel.app', // Thay đổi thành URL của client của bạn
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức HTTP mà bạn cho phép
    allowedHeaders: ['Content-Type', 'Authorization'], // Các header mà bạn cho phép
    credentials: true // Cho phép thông tin xác thực
  }
];
  
  app.use(cors(corsOptions));
//config

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
configViewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 8080;
app.listen(port, () => {
    //callback function
    console.log("backend node js is running on the port: " + port);
});

