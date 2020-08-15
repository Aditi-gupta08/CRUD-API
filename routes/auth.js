var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var {to} = require('await-to-js');

let user = {};

const passwordHash = async (password) => {
    const saltRounds = 10;
    const [err, encrypted_pass ] = await to( bcrypt.hash(password, saltRounds));

    if(err)
    {
        return res.send( {"msg": "Error while generating password hash"});
    }

    return encrypted_pass;
};



router.post('/signup', async (req, res) => {

    let {userName, email, password} = req.body;


    try{
        const [tmp, encrypted_pass] = await to(passwordHash(password));
        
        //const encrypted_pass = password;
        const newStudent = {
            userName,
            email,
            encrypted_pass
        } 
    
        user = newStudent;
        
        res.json({
            "msg": "Signed Succesfully up !!",
            user
        });

    } catch{
        res.status(400).json({"err": "Error in encryting password! "});
    }

    

});


router.post('/login', async (req, res) => {

    let {email, password} = req.body;

    let [err, isValid] = await to( bcrypt.compare(password, user.encrypted_pass) );

    if(err){
        return res.status(400).json({ "error": "Some error occured in comparing password"});
    }

    if(!isValid){
        return res.status(400).json({ "error": "Incorrect Password !"});
    }

    const newStudent = {
        email,
        password
    } 

    jwt.sign( {newStudent}, 'secretkey', (err, token) => {
        res.json({
            "accessToken" : token,
            "errorrr": err
        });
    });

});


module.exports = router;
