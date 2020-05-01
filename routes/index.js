var express = require('express');
var router = express.Router();
const journeyModel = require('../models/journey')
const userModel = require('../models/users')

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]

/* GET home page. */
router.get('/',function(req, res, next) {
  res.render('login');
});
/* POST sign up. */
router.post('/sign-up', async function(req,res,next){
try{
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
  
    res.redirect('/research')
  } else {
    res.redirect('/')
  }
} catch (error) {
  console.log(error)
  }
})

/*  POST sign in. */
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
    res.render('research')
  } else {
    res.render('login')
  }
})
/*  POST research. */

router.post('/research', async function (req, res, next) {
  //console.log(req.body)

  var data = await journeyModel.find({
    departure: req.body.departure,
    arrival: req.body.arrival,
    date: req.body.birthday,
    //departureTime: req.body.departureTime,
    //price: req.body.price,
  })

  //console.log(data)
  res.render('resultats', {data})
})

router.get('/resultats', async function (req, res, next) {
  if(req.session.data == undefined) {
    req.session.data = []
  }

  req.session.data.push({
    departure: req.query.departure,
    arrival: req.query.arrival,
    date: req.query.date,
    departureTime: req.query.departureTime,
    price: Number(req.query.price),
  })
  
  //console.log('bonjour', req.query)
  res.render("tickets", {data: req.session.data})
})

router.get('/tickets', async function (req, res, next) {
  console.log('coucou');

  for( var i=0; i < req.session.data.length; i++){
    req.session.data.push({
      departure: req.query.departure,
      arrival: req.query.arrival,
      date: req.query.date,
      departureTime: req.query.departureTime,
      price: Number(req.query.price),
  })
}
  
  console.log('bonjour', req.session.data)
  res.render("tickets", {data: req.session.data})
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
