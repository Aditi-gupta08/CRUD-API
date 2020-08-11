var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

/* 
// Verify token (middleware function)
const verifyToken = (req, res, next) => {

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
            } else {

                next();
            }
        })
        
    } else {
      res.status(400).json({error: 'Token not found'});
    }
} */



router.post('/login', (req, res) => {

    const newStudent = {
        userName: req.body.userName,
        password: req.body.password
    } 
   

    jwt.sign( {newStudent}, 'secretkey', (err, token) => {
        res.json({
            "accessToken" : token,
            "errorrr": err
        });
       
    });

});


router.post('/signup', (req, res) => {

    const newStudent = {
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
    } 
    

    jwt.sign( {newStudent}, 'secretkey', (err, token) => {
        res.json({
            "accessToken" : token,
            "error": err
        });
    });

});



router.post( '/try', (req, res) => {

    res.send({
        "msg": "tryy"
    });
})


module.exports = router;