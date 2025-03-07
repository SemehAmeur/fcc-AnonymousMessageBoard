'use strict';

const mongoose = require("mongoose");

module.exports = function (app) {
  
  mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  
  let replySchema = new mongoose.Schema({
    text: {type: String, required: true},
    delete_password: {type: String, required: true},
    created_on: {type: Date, required: true},
    reported: {type: Boolean, required: true}
  })
  
  let threadSchema = new mongoose.Schema({
    text: {type: String, required: true},
    delete_password: {type: String, required: true},
    board: {type: String, required: true},
    created_on: {type: Date, required: true},
    bumped_on: {type: Date, required: true},
    reported: {type: Boolean, required: true},
    replies: [replySchema]
  })
  
  let Reply = mongoose.model("Reply", replySchema);
  let Thread = mongoose.model("Thread", threadSchema);
  
  //app.route('/api/threads/:board');
    
  //app.route('/api/replies/:board');
  app.post("/api/threads/:board", (req, res)=>{
    let newThread = new Thread(req.body);
    if(!newThread.board || newThread.board ==""){
      newThread.board= req.params.board;
    }
    newThread.created_on = new Date().toUTCString();
    newThread.bumped_on = new Date().toUTCString();
    newThread.reported = false;
    newThread.replies = [];
    newThread.save((err, data)=>{
      if(!err && data){
        console.log(data)
        return res.redirect("/b/" + data.board + "/" + data._id)
      }
    })
  })
};
