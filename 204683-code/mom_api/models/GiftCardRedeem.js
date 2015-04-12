/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents Gift Card Redeem.
 * This schema is internal schema to GiftCard. This should not be used independently
 *
 * @version 1.1
 * @author TCSASSEMBLER, TCCODER
 */
'use strict';

var mongoose = require('../datasource').getMongoose(),
    Schema = mongoose.Schema;

// Define  schema
var GiftCardRedeemSchema = new Schema({
    amount: Number,
    redeemQRCode: {
        type: String,
        required: true
    },
    redeemQRCodePicture: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    redeemed: Boolean
});

/**
 * Module exports
 */
module.exports = {
  GiftCardRedeemSchema: GiftCardRedeemSchema
};
