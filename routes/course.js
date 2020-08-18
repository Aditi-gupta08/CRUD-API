const express = require('express');
const router = express.Router();
const fs = require('fs')
const path = require('path');
const utils = require('../data/utils');
const stu_path = path.join(__dirname, '..', 'data/STUDENTS.json');
const cour_path = path.join(__dirname, '..', 'data/COURSES.json');
let user = require('../data/user');
const { fstat } = require('fs');


/* GET all courses */

router.get('/', function(req, res, next) {

  let COURSES = JSON.parse(fs.readFileSync(cour_path));
  res.json(COURSES);
});


// GET a course by id 
router.get('/:c_id', (req, res, next) => {

    let COURSES = JSON.parse(fs.readFileSync(cour_path));
    const found = COURSES.some( course => course.id === parseInt(req.params.c_id));

    if(found){
      res.json( COURSES.filter( course => course.id === parseInt(req.params.c_id)));
    } else {
      res.status(400).json( {error: `No course found with the id ${req.params.c_id}`});
    }
});


// Add course
router.post( '/', utils.verifyToken, (req, res) => {

    let {id, name, description, availableSlots} = req.body;

    if( !id || !name || !description || !availableSlots)
      return res.status(400).json({error: 'Please provide all 4 details of the course: id, name, desciption, available slots'});

    availableSlots = parseInt( availableSlots );
    id = parseInt(id);

    if( availableSlots < 0)
      return res.status(400).json({error: 'Available slots should be positive'});

    let COURSES = JSON.parse(fs.readFileSync(cour_path));
    const c_found = COURSES.some( course => course.id == parseInt(id));

    if(c_found)
    {
      return res.status(400).json({"error": "A course with same id already exists !!"});
    }

    const newCourse = {
        id,
        name,
        description,
        "enrolledStudents": [],
        availableSlots
    }

    COURSES.push(newCourse);
    fs.writeFileSync(cour_path, JSON.stringify(COURSES, null, 2));
    res.json( {success: true} );
});



// Enroll a student into a course
router.put( '/:c_id/enroll', utils.verifyToken, (req, res) => {

  let {student_id} = req.body;
  
  try{

        let COURSES = JSON.parse(fs.readFileSync(cour_path));
        let STUDENTS = JSON.parse(fs.readFileSync(stu_path));

        var c_id = req.params.c_id;
        const c_found = COURSES.some( course => course.id === parseInt(req.params.c_id));

        // Check if that course do not exist
        if( !c_found)
            throw {error: `No course found with the id ${c_id}`};


        var choosed_course = COURSES.filter( course => course.id === parseInt(c_id));
        choosed_course = choosed_course[0];
        var enrolled = choosed_course.enrolledStudents;
            
        // Check available slots in that course
        if( choosed_course["availableSlots"] <= 0)
          throw {error: 'No available slots left in this course'};


        if( !student_id)
            throw {error: 'Please provide a student id to enroll in the course.'};
            
        // Check if the student with that id is present or not
        const s_found = STUDENTS.find( stud => stud.id === parseInt(student_id));

        if( !s_found)
        {
            throw {error: `No student with the id ${student_id} is present`};
        }  


        // Check if student is already enrolled in the course or not 
        var ind = enrolled.indexOf(parseInt(student_id));

        if( ind !=-1)
          throw {error: "Student is already registered!" } ;
        else
        {
          if(res.cur_user.email != s_found.email)
              res.status(400).json({"err": "Students can only enroll themselves !" });

          choosed_course.availableSlots-=1;
          enrolled.push( student_id );
          fs.writeFileSync(cour_path, JSON.stringify(COURSES, null, 2));

          res.send( {success: true});
        }
  } 

  catch(error) {
    res.status(400).json( error );
  }

});



// Deregister a student from a course
router.put( '/:c_id/deregister', utils.verifyToken, (req, res) => {

  let {student_id} = req.body;

  try {
      let c_id = req.params.c_id;

      let COURSES = JSON.parse(fs.readFileSync(cour_path));
      let STUDENTS = JSON.parse(fs.readFileSync(stu_path));

      const c_found = COURSES.some( course => course.id === parseInt(req.params.c_id));

      // Check if that course do not exist
      if( !c_found)
      { 
        throw {error: `No course found with the id ${c_id}`};
      }


      var choosed_course = COURSES.filter( course => course.id === parseInt(c_id));
      choosed_course = choosed_course[0];
      var enrolled = choosed_course.enrolledStudents;


      if( !student_id)
          throw {error: 'Please provide a student id to deregister from the course.'};
          
      // Check if the student with that id is present or not
      const s_found = STUDENTS.find( stud => stud.id === parseInt(student_id));

      if( !s_found)
      {
        throw {error: `No student with the id ${student_id} is present`};
      }  

      // Check if student is already enrolled in the course or not 

      var ind = enrolled.indexOf(parseInt(student_id));

      if( ind==-1)
        throw {error: `Student wasn't registered in this course`} ;
      else
      {
        if(res.cur_user.email != s_found.email)
          res.status(400).json({"err": "Students can only deregister themselves !" });

        choosed_course.availableSlots+=1;
        enrolled.splice(ind, 1);
        fs.writeFileSync(cour_path, JSON.stringify(COURSES, null, 2));

        res.send( {success: true});
      }
  }
  catch(error)
  {
    res.status(400).json( error );
  }


});
 

module.exports = router;
