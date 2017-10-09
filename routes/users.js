const express = require('express');
const router = express.Router();
const Layover = require('../models/layover').Layover;
const User = require('../models/user').User;
const Airports = require('airportsjs');
const airlines = require('airline-codes/airlines.json');
const _ = require('lodash');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads' });

/* GET users listing. */
router.get('/:id/layovers', function(req, res, next) {

  Layover.find({'creator_id': req.params.id},(err,data)=>{
    if (err) {
      return res.status(500).json(err);
    }
    let orderedData = _.sortBy(data, ['arrival']);
    return res.status(200).json(orderedData);
  });
});

router.post('/:id/layovers', function(req, res, next) {
  let airportCode =req.body.station.toUpperCase();
  let airport = Airports.lookupByIataCode(airportCode);
  if (airport === undefined && req.body.dateOfArrival > req.body.dateOfDeparture ) {
      return res.status(400).json({message:"Enter valid airport code and dates"});
  }
  const newLayover = new Layover({
    station: airportCode,
    city: airport.city,
    arrival: req.body.arrival,
    departure: req.body.departure,
    creator_id: req.params.id
  });

  newLayover.save((err)=>{
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(newLayover);
  });
});

router.get('/layovers/:id', function(req, res, next) {

  Layover.findById((req.params.id), (err, myLayover) => {
    if (err)  return status(400).json(err);
      Layover.find({$and:[{creator_id:{$ne:myLayover.creator_id}},
                   {city:myLayover.city},
                   {arrival:{$lte:myLayover.departure}},
                   {departure:{$gte:myLayover.arrival}}]})
                  .populate('creator_id', 'name')
                   .exec((err, matches) => {
                     if (err) next(err);
                     let orderedMatches = _.sortBy(matches, ['arrival']);
                           console.log(orderedMatches);
                     return res.status(200).json(matches);
                   });
  });
});

router.get('/:userId/layovers/:id/delete', function(req,res,next){
  Layover.deleteOne({id:req.params.id},(err,data)=>{
    if (err) {
      return res.status(500).json(err);
    }
  });
});

router.get('/:id', function(req, res, next){
  User.findById((req.params.id),(err,data)=>{
    if(err) return res.status(400).json({message:'User not found'});
    return res.status(200).json(data);
  });
});

router.post('/:id',upload.single("imageURL"),function (req, res, next){

  let airportCode='';
  if(req.body.base !== undefined){
    airportCode =req.body.base.toUpperCase();
    const airport = Airports.lookupByIataCode(airportCode);
    if(airport===undefined) return res.status(400).json({message:"Enter valid airport code for Base"});
  }
  // if(req.body.airlineCode !== undefined){
  //   const airlineCode =req.body.airlineCode.toUpperCase();
  //   airlines.find({'iata':airlineCode},(err,data)=>{
  //     if (err) return res.status(400).json({message:"Enter valid airline code"});
  //     const airline = data.iata;
  //   }).get('name');
  //}
  const nationality = req.body.nationality.charAt(0).toUpperCase()+req.body.nationality.slice(1);
  const profileInfo = {
    username:req.body.username,
    contactNumber:req.body.contactNumber,
    name:req.body.name,
    gender:req.body.gender,
    dateOfBirth: req.body.dateOfBirth,
    nationality: nationality,
    languagesSpoken:req.body.languagesSpoken,
    airlineCode: req.body.airlineCode.toUpperCase(),
    base: airportCode,
  };
  if (req.file!==undefined){
      profileInfo.pic_path=`/uploads/${req.file.filename}`;
      profileInfo.pic_name=req.file.originalname;
   }
  User.findByIdAndUpdate(req.params.id, profileInfo , (err,user) => {
     if (err) {return res.status(500).json(err);}
     return res.status(200).json({message:'Profile updated succesfully'});
  });
});

module.exports = router;
