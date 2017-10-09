const express = require('express');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ThingsToDo = require('../models/thingsToDo').ThingsToDo;
const User = require("../models/user").User;

const ReviewSchema = new Schema({
  creator_id: { type: Schema.Types.ObjectId, ref: "User"},
  activity_id: { type: Schema.Types.ObjectId, ref: "ThingsToDo"},
  rating: {
    type: Number,
    required: [true, 'Rate between 1 and 5']
  },
  comment: String,

});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = {
  Review
};
