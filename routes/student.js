var express = require('express');
var router = express.Router();
var STUDENTS = require('../data/STUDENTS');
var verifyToken = require('../data/verifyToken');
//var uuid = require('uuid');


/* GET all students. */
router.get( '/', (req, res) => {
  res.json({'data': STUDENTS});
});


/* Add student */
router.post( '/', verifyToken, (req, res) => {

  var newStudent = req.body;

  if( !newStudent.id)
    return res.status(400).json({error: 'New student\'s ID isn\'t provided'});

  if( !newStudent.name)
    return res.status(400).json({error: 'New student\'s NAME isn\'t provided'});

  const s_found = STUDENTS.some( stud => stud.id == parseInt(newStudent.id));

  if(s_found)
  {
     return res.status(400).json( {"error": "A student with this ID already exists" });   
  }  


  STUDENTS.push(newStudent);
  //res.json(STUDENTS);
  res.json( {success: true} );
});


module.exports = router;
