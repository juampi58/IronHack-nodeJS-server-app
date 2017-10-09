const express = require('express');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Review = require('../models/review').Review;

const ThingsToDoSchema = new Schema({
  city: {
    type: String,
    required: [true, 'Type a valid airport code']
  },
  establishment: {
    type: String,
    required: [true, 'Select a valid date']
  },
  category: {
    type: String,
    required: [true, 'Select a valid date']
  },
  review: [{ type: Schema.Types.ObjectId, ref: "Review"},]
});

// taskSchema.methods.asData = function() {
//   return {
//     id: this._id,
//     status: this.status,
//     priority: this.priority
//   };
// };

const ThingsToDo = mongoose.model('ThingsToDo', ThingsToDoSchema);

module.exports = {
  ThingsToDo
};
