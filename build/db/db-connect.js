"use strict";
const mongoose = require('mongoose');
const { url } = require('../config/database');
const connectDb = () => mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
module.exports = connectDb;
