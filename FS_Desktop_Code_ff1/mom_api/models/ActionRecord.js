'use strict';

var mongoose = require('../datasource').getMongoose(),
  Schema = mongoose.Schema;

var ActionRecordSchema = new Schema({
  userId: { type: String, required: String },
  timestamp: { type: Date, required: String },
  type: { type: String, required: String },
  details: { type: String, required: String }
});
var mongoosePaginate = require('mongoose-paginate');
// add paginate plugin to ActionRecord model
ActionRecordSchema.plugin(mongoosePaginate);

/**
 * Module exports
 */
module.exports = {
  ActionRecordSchema: ActionRecordSchema
};