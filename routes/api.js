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
      console.log(req.params, req.params.board)
    }
    //newThread.board = 
    newThread.created_on = new Date();
    newThread.bumped_on = new Date();
    newThread.reported = false;
    newThread.replies = [];
    console.log(newThread)
    
    newThread.save((err, data)=>{
      if(!err && data){
        //console.log(data)
        return res.redirect("/b/" + data.board + "/" + data._id)
      }
    })
    /*
    let board = req.params.board;

    let newThread = await Message.create({
      board: board,
      text: req.body.text,
      created_on: new Date(),
      bumped_on: new Date(),
      reported: false,
      delete_password: req.body.delete_password,
      replies: []
    });

    return res.redirect("/b/" + board);
  } catch (err) {
    return res.json("error");
  }
    */
  })
  
  app.post("/api/replies/:board", (req, res)=>{
    console.log("test1")
    
    let newReply = new Reply(req.body)
    console.log(req.body)
    
    newReply.created_on = new Date().toUTCString();
    newReply.reported = false;
    
    Thread.findByIdAndUpdate(
      req.body.thread_id, 
      {$push: {replies: newReply}, bumped_on: new Date().toUTCString()},
      {new: true},
      (err, updatedData)=>{
        if (!err && updatedData){
          res.redirect("/b/" + updatedData.board + "/" + updatedData._id + "?new_reply_id=" + newReply._id)
        }
      }
  
    )
    
  })
};
