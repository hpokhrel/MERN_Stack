const express = require('express');
const app = express();
const PORT = 3000;

const mongoose = require('mongoose');

require('./models/user_model');


app.use(express.json());
app.use(require('./routes/authentication'));

mongoose.connection.on('connected' , ()=>{
    console.log("Connected Successfully");
});

mongoose.connection.on("Error", (error)=>{
    console.log("Error", error)
});

const {MONGODB_URI} = require('./config');

mongoose.connect(MONGODB_URI)

// const customMiddleware = (request, response, next) => {
//     console.log("customMiddleware");
//     next();
// }

// app.use(customMiddleware); 

// app.get('/' ,  (request, response) => {
//     console.log("Welcome");
//     response.send("WELCOME");
// });

// app.get('/home' , (request, response)=>{
//     console.log("Home");
//     response.send("Home");
// })




app.listen (PORT , () => {
    console.log("Server Started Successfully");
});