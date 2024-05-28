const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');

const mongoose = require('mongoose');
const UserModel = mongoose.model('UserModel'); 

module.exports = (request, response, next) => {
    const {authorization} = request.headers;
    // authorization -> Bearer hjhjc879scjkh98u9023cnsd0
    if(!authorization){
        return response.status(401).json({error: "User not logged in"});
    }
    const token = authorization.replace("Bearer " , "");
    jwt.verify(token,JWT_SECRET,(error, payload)=>{
        if(error){
            return response.status(401).json({error: "User Not logged in"});
        }
        const {_id} = payload;

        UserModel.findById(_id)
        .then(dbUser => {
            request.dbUser = dbUser;
        });
        next();
    });
}