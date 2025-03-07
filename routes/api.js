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
  let BoardSchema = new mongoose.Schema({
    name: { type: String },
    threads: { type: [threadSchema] },
  });

  let Reply = mongoose.model("Reply", replySchema);
  let Thread = mongoose.model("Thread", threadSchema)
  let Board = mongoose.model("Board", BoardSchema);

  //app.route('/api/threads/:board');
    
  //app.route('/api/replies/:board');
  app.post("/api/threads/:board", (req, res)=>{
    const { text, delete_password } = req.body;
      let board = req.body.board;
      if (!board) {
        board = req.params.board;
      }
      console.log("post", req.body);
      const newThread = new threadSchema({
        text: text,
        delete_password: delete_password,
        replies: [],
      });
      console.log("newThread", newThread);
      Board.findOne({ name: board }, (err, Boarddata) => {
        if (!Boarddata) {
          const newBoard = new Board({
            name: board,
            threads: [],
          });
          console.log("newBoard", newBoard);
          newBoard.threads.push(newThread);
          newBoard.save((err, data) => {
            console.log("newBoardData", data);
            if (err || !data) {
              console.log(err);
              res.send("There was an error saving in post");
            } else {
              res.json(newThread);
            }
          });
        } else {
          Boarddata.threads.push(newThread);
          Boarddata.save((err, data) => {
            if (err || !data) {
              res.send("There was an error saving in post");
            } else {
              res.json(newThread);
            }
          });
        }
      });
    /*let newThread = new Thread(req.body);
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
    try{
      newThread.save((err, data)=>{
      if(!err && data){
        //console.log(data)
        return res.redirect("/b/" + data.board + "/" + data._id)
      }
    })
    } catch(e){
      console.log(e)
    }
    */
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
