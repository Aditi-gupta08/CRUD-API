var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var {to} = require('await-to-js');
const path = require('path');
const fs = require('fs');
const user_path = path.join(__dirname, '..', 'data/user.json');
const stu_path = path.join(__dirname, '..', 'data/STUDENTS.json');
const utils = require('../data/utils');


router.post('/signup', async (req, res) => {

    let {userName, email, password} = req.body;
    

    try{
        let STUDENTS = JSON.parse(fs.readFileSync(stu_path));
        const s_found = STUDENTS.some( stud => stud.email == email);
        if( !s_found)
        {
            // throw {error: `No student with this email ${email} is present`};
            res.status(400).json({ "err": "No student with this email exist"});
        }

        const [tmp, encrypted_pass] = await to( utils.passwordHash(password));
        
        let USERS = JSON.parse(fs.readFileSync(user_path));
    
        const newStudent = {
            userName,
            email,
            encrypted_pass,
            login_status: false
        } 
    
        USERS[0] = newStudent;
        //console.log(USERS[0]);

        //USERS.push( newStudent );

        fs.writeFileSync( user_path, JSON.stringify( USERS, null, 2));
        
        res.json({
            "msg": "Signed Succesfully up !!"
        });


    } catch{
        res.status(400).json({"err": "Error in encryting password! "});
    }

});



router.put('/login', async (req, res) => {

    let {email, password} = req.body;
    let USERS = JSON.parse(fs.readFileSync(user_path));

    let [err, isValid] = await to( bcrypt.compare(password, USERS[0].encrypted_pass) );

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

    USERS[0]["login_status"] = true;

    console.log(USERS[0]);
    fs.writeFileSync( user_path, JSON.stringify( USERS, null, 2));

    jwt.sign( {newStudent}, 'secretkey', (err, token) => {
        res.json({
            "accessToken" : token,
            "errorrr": err
        });
    });

});


router.put('/logout', (req, res) => {
    let USERS = JSON.parse(fs.readFileSync(user_path));

    if( USERS[0].login_status)
    {
        USERS[0].login_status = false;
        fs.writeFileSync( user_path, JSON.stringify( USERS, null, 2));
        res.json({"msg": "Logged out succesfully !!"});
    }
    else
    {
        res.json( { "msg": "User is not logged in!!"});
    }
});


router.get('/try', (req, res) => {
    res.json({"user": user});
});


module.exports = router;
