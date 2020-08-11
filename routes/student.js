var express = require('express');
var router = express.Router();
var STUDENTS = require('../data/STUDENTS');
//var uuid = require('uuid');

/* GET all students. */
router.get( '/', (req, res) => {
  res.json({'data': STUDENTS});
});


/* Add student */
router.post( '/', (req, res) => {

  var newStudent = req.body;

  if( !newStudent.id)
    return res.status(400).json({error: 'New student\'s ID isn\'t provided'});

  if( !newStudent.name)
    return res.status(400).json({error: 'New student\'s NAME isn\'t provided'});


  STUDENTS.push(newStudent);
  //res.json(STUDENTS);
  res.json( {success: true} );
});


router.post( '/try', (req, res) => {
  res.json({
      "msg": "tryy"
  });
})


module.exports = router;
