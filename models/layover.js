const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require("../models/user").User;

const LayoverSchema = new Schema({
  station: {
    type: String,
    required: [true, 'Type a valid airport code']
  },
  arrival: {
    type: String,
    required: [true, 'Select a valid date']
  },
  departure: {
    type: String,
    required: [true, 'Select a valid date']
  },
  creator_id: { type: Schema.Types.ObjectId, ref: "User"},
  city: String
});

// taskSchema.methods.asData = function() {
//   return {
//     id: this._id,
//     status: this.status,
//     priority: this.priority
//   };
// };

const Layover = mongoose.model('Layover', LayoverSchema);

module.exports = {
  Layover
};
