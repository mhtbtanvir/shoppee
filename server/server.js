const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

connectDB();




const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
    origin: "http://localhost:5174",
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: 
        [
        "Content-Type", 
        "Authorization", 
        "Cache-Control", 
        "Expires", 
        "Pragma"
        ],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.listen(PORT,()=>
    console.log(`Server is running on port ${PORT}`)
);
