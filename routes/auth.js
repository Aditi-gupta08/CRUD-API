var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var {to} = require('await-to-js');
let user = require('../data/user');

//let user = {};

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
            encrypted_pass,
            login_status: false
        } 
    
        user = newStudent;
        console.log(user);
        
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

    user["login_status"] = true;

    // console.log(user);

    jwt.sign( {newStudent}, 'secretkey', (err, token) => {
        res.json({
            "accessToken" : token,
            "errorrr": err
        });
    });

});


/* router.post('/logout', (req, res) => {
    if( user.login_status)
    {
        user.login_status = false;
        res.json({"msg": "Logged out succesfully !!"});
    }
    else
    {
        res.json( { "msg": "User is not logged in!!"});
    }
});


router.get('/try', (req, res) => {
    res.json({"user": user});
}); */


module.exports = router;
