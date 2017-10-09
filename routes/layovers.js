const express = require('express');
const router = express.Router();

const Layover = require('../models/layover').Layover;
const User = require('../models/user').User;


/* GET home page. */
router.get('/:id/layovers', function(req, res, next) {

  User.findById(req.params.id,(err,data)=>{
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(data.layovers);
  }).populate('Layover.layovers');

});

router.post('/:id/layovers', function(req, res, next) {

  const newLayover = new Layover({
    station: req.body.station,
    arrival: req.body.arrival,
    departure: req.body.departure,
    creator_id: req.params.id
  });

  newLayover.save((err)=>{
    if (err) {
      return res.status(500).json(err);
    }
    User.findById(req.params.id,(err,data)=>{
      data.layovers.push(newLayover._id);
      return res.status(200).json(data.layovers);
    }).populate('Layover.layovers');
  });

});

router.delete('/:userId/layovers/:id', function(req,res,next){
  Layover.remove({id:req.params.id},(err,data)=>{
    if (err) {
      return res.status(500).json(err);
    }
    User.findById(req.params.userId,(err,user)=>{
      if (err) {
        return res.status(500).json(err);
      }
      let index = user.layovers.indexof(req.params.id);
      user.layovers.splice(index,1);
      return res.status(200).json(user.layovers);
    });
  });
});


module.exports = router;
