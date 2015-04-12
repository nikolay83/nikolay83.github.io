'use strict';

var mongoose = require('../datasource').getMongoose(),
  Schema = mongoose.Schema;

var BusinessTypeSchema = new Schema({
  _id: {
    type: Number,
    required: true,
    index: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  }
});

/**
 * Module exports
 */
module.exports = {
  BusinessTypeSchema: BusinessTypeSchema
};