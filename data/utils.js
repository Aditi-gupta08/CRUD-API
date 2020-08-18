var express = require('express');
var jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const user_path = path.join(__dirname, '/user.json');
var {to} = require('await-to-js');
var bcrypt = require('bcrypt');


// Verify token (middleware function)
const verifyToken = (req, res, next) => {

    let USERS = JSON.parse(fs.readFileSync(user_path));

    //console.log("\nVerying token: ");
    //console.log(USERS[0]);

    if(Object.keys(USERS[0]).length === 0)
    {
        return res.json({ "err": "No user exists!"});
    }

    if(USERS[0].login_status == false)
    {
        return res.status(400).json( {"err": "User is not logged in"});
    }

    // Get auth header value
    const bearerHeader = req.headers['authorization'];
  
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
  
        req.token = bearerToken;

        jwt.verify( req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.status(400).json({ "error": "Not verified successfully"}); 
            } 
            else {
                next();
            }
        })
        
    } else {
      res.status(400).json({error: 'Token not found'});
    } 
} 


const passwordHash = async (password) => {
    const saltRounds = 10;
    const [err, encrypted_pass ] = await to( bcrypt.hash(password, saltRounds));

    if(err)
    {
        return res.send( {"msg": "Error while generating password hash"});
    }

    console.log(encrypted_pass);
    return encrypted_pass;
};


module.exports = {
    verifyToken,
    passwordHash
};
