'use strict';

const mongoose = require("mongoose");

module.exports = function (app) {
  
  mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  
  let 
  
  app.route('/api/threads/:board');
    
  app.route('/api/replies/:board');

};
