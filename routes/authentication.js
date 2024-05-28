const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserModel = mongoose.model("UserModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {JWT_SECRET} = require('../config.js');

router.get('/', (request, response) => {
    response.send("Welcome to MERN Stack World");
});

// router.post('/register', (request, response)=>{
//     console.log(request.body);
//     const {fullName, email, password} = request.body; //object destructuring

//     if(!fullName || !email || !password){
//        return response.status(400).json({error :"one or more field can't be null"})
//     }
//     else{
//         response.json({result: "Registered successfully"})
//     }
// });

router.post('/login', (request ,response)=>{
    const {email, password} = request.body;

    if(!email || !password){
        return response.status(500).json({error: "one or more field can't be empty"});
    }
    UserModel.findOne({email: email}).then((dbUser)=>{
        if(!dbUser){
            //user not found
            return response.status(400).json({error: "User Not found"});
        }
        bcrypt.compare(password, dbUser.password).then((didMatch)=>{
            if(didMatch){
                // response.status(200).json({result: "User logged in successfully"});
                const jwtToken = jwt.sign({_id : dbUser._id}, JWT_SECRET);
                response.json({token: jwtToken});
            }else{
                return response.status(400).json({ error: "Invalid Credentials"});
            }
        })
    })
    .catch((error)=>{
        console.log(error);
    })

})

router.post('/register' , (request, response) =>{
    console.log(request.body);
    const {fullName, email, password} = request.body; //object destructuring

    if(!fullName || !email || !password){
        return response.status(400).json({error: "one or more field can't be null"});
    }

    //avoid duplication

    UserModel.findOne({email : email})
    .then((dbUser)=>{
        if (dbUser) {
            return response.status(500).json({error: "User already exists with same email address"});
        }
        bcrypt.hash(password, 16).then((hashedpassword)=>{
            const user = new UserModel ({fullName, email, password : hashedpassword});

            user.save().then((user)=>{
                response.status(201).json({result: "User Registration is successfull"});
            })
            .catch((error) => {
                console.log(error);
            })
        })      
    })
    .catch((error) => {
        console.log(error);
    })
})

module.exports = router;