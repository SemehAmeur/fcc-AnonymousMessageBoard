const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let testThread_id;
  let testReply_id;
  let testPass = "testpass";
  test("Creating a new thread", done =>{
    chai.request(server).post("/api/threads/test").send({
      board: 'test555',
      test: "func test thread",
      delete_password: testPass
    }).end((err, res)=>{
      assert.equal(res.status, 200)
      let createdThread_id = res.redirects[0].split("/")[res.redirects[0].split("/").length - 1]
      testThread_id = createdThread_id
      done()
    })
  })
  
});
