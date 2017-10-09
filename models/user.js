const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const Layover = require('../models/layover').Layover;
const ThingsToDo = require("../models/thingsToDo").ThingsToDo;

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  contactNumber: String,
  name: String,
  gender: String,
  dateOfBirth: Date,
  nationality: String,
  languagesSpoken:[String],
  airlineCode: String,
  base: String,
  friends: [{ type: Schema.Types.ObjectId, ref: "User"},],
  friendsRequests: [{ type: Schema.Types.ObjectId, ref: "User"},],
  pic_path : String,
  pic_name : String,
  },{
  	timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
	}
);

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
 return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.asData = function() {
  return {
    id: this._id,
    username: this.username,
  };
};

const User = mongoose.model('User', UserSchema);

module.exports = {
  User
};
