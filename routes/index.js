var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const journeyModel = require('../models/journey')
const userModel = require ('../models/users')


var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('coucou')
  res.render('index', { title: 'Express' });
});

router.post('/sign-up', async function(req,res,next){

  var searchUser = await userModel.findOne({
    email: req.body.emailFromFront
  })
  
  if(!searchUser){
    var newUser = new userModel({
      firstname: req.body.firstnameFromFront,
      name: req.body.nameFromFront,
      email: req.body.emailFromFront,
      password: req.body.passwordFromFront,
    })
  
    var newUserSave = await newUser.save();
  
    req.session.user = {
      name: newUserSave.name,
      id: newUserSave._id,
    }
  
    console.log(req.session.user)
  
    res.redirect('/homepage')
  } else {
    res.redirect('/')
  }
})
router.get('/homepage', async function (req, res, next) {
  res.render('homepage')
})

router.post('/sign-in', async function(req,res,next){

  var searchUser = await userModel.findOne({
    email: req.body.emailFromFront,
    password: req.body.passwordFromFront
  })

  if(searchUser!= null){
    req.session.user = {
      name: searchUser.name,
      id: searchUser._id,
    }
    res.redirect('/homepage')
  } else {
    res.render('/')
  }

})

// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newUser = new journeyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
       
       await newUser.save();
      
    }

  }
  console.log('TU APPELLES LA ROUTE SAVE !!')
  res.render('index', { title: 'Express' });
});


// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get('/result', function(req, res, next) {

  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    journeyModel.find( 
      { departure: city[i] } , //filtre
  
      function (err, journey) {

          console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )
  }


  res.render('index', { title: 'Express' });
});

module.exports = router;
