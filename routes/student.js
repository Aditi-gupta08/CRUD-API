const express = require('express');
const router = express.Router();
const path = require('path');
const utils = require('../data/utils');
const fs = require('fs');
const stu_path = path.join(__dirname, '..', 'data/STUDENTS.json');
const uuid = require('uuid');


/* GET all students. */
router.get( '/', (req, res) => {
  let STUDENTS = JSON.parse(fs.readFileSync(stu_path));
  res.json(STUDENTS); 
});


/* Add student */
router.post( '/', utils.verifyToken, (req, res) => {

  var {name, email} = req.body;

  if( !name || !email)
    return res.status(400).json({error: 'Please provide both details: name, email of the student'});


  let STUDENTS = JSON.parse(fs.readFileSync(stu_path));
  const s_found_email = STUDENTS.some( stud => stud.email == email);

  if(s_found_email)
  {
     return res.status(400).json( {"error": "A student with this Email ID already exists" });   
  }

  let newStudent = 
  {
    id: uuid.v4(),
    name,
    email 
  }

  STUDENTS.push(newStudent);
  fs.writeFileSync( stu_path, JSON.stringify(STUDENTS, null, 2));
  res.json( {success: true} );
});



module.exports = router;
