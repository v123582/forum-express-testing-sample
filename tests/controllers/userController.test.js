const assert = require('assert')
const moment = require('moment')
const chai = require('chai')
const request = require('supertest')
const should = chai.should()
const { expect } = require('chai')

const app = require('../../app')
const db = require('../../models')

describe('# User controller', function() {
    
    it("GET /signup", (done) => {
      request(app)
        .get('/signup')
        .end(function(err, res) {
          expect(res.statusCode).to.be.equal(200) 
          expect(res.text).to.contain('Sign Up') 
          done()
        })
    });

    it("POST /signup", (done) => {
        request(app)
          .post('/signup')
          .send('name=name&email=email&password=password&passwordCheck=password')
          .end(function(err, res) {
            expect(res.statusCode).to.be.equal(302) 
            db.User.findOne({
              where: {
                email: 'email'
              }
            }).then((user) => {  
              expect(user.email).to.be.equal('email')
              done()
            })
        });
    });
})

describe('/api/signup', () => {

    before(async function() {
      // 在所有測試開始前會執行的程式碼區塊
      await db.User.destroy({where: {},truncate: { cascade: true }})
    });

    after(async function() {
      // 在所有測試結束後會執行的程式碼區塊
      await db.User.destroy({where: {},truncate: { cascade: true }})
    });

    it("(O) 註冊帳號成功", (done) => {
        request(app)
          .post('/signup')
          .send('name=name&email=email&password=password&passwordCheck=password')
          .redirects(1)
          .end(function(err, res) {
            
            // 條件一：成功回傳資料
            expect(res.statusCode).to.be.equal(200) 
            expect(res.text).to.contain('<h1 class="h3 mb-3 font-weight-normal">Sign In</h1>')

            db.User.findOne({
              where: {
                email: 'email'
              }
            }).then((user) => {  
              // 條件二：成功寫入資料庫
              expect(user.email).to.be.equal('email')
              done()
            })
        });
    });

    it("(X) 兩次密碼輸入不同", (done) => {
        request(app)
          .post('/signup')
          .send('name=name1&email=email1&password=password1&passwordCheck=password')
          .redirects(1)
          .end(function(err, res) {
            
            // 條件一
            expect(res.text).to.contain('<h1 class="h3 mb-3 font-weight-normal">Sign Up</h1>')


            db.User.findOne({
              where: {
                email: 'email1'
              }
            }).then((user) => {  
              // 條件二：不會寫入資料庫
              expect(user).to.be.equal(null)
              done()
            })
        });
    });

    it("(X) 信箱重複", (done) => {
        request(app)
          .post('/signup')
          .send('name=name&email=email&password=password&passwordCheck=password')
          .redirects(1)
          .end(function(err, res) {

            // 條件一
            expect(res.text).to.contain('<h1 class="h3 mb-3 font-weight-normal">Sign Up</h1>')
            done()
        });
    });
})

describe('/api/signin', () => {

    before(async function() {
      // 在所有測試開始前會執行的程式碼區塊
      await db.User.destroy({where: {},truncate: { cascade: true }})
    });

    after(async function() {
      // 在所有測試結束後會執行的程式碼區塊
      await db.User.destroy({where: {},truncate: { cascade: true }})
    });

    it("(O) 先註冊，再登入成功", (done) => {
        let cookie;
        request(app)
          .post('/signup')
          .send('name=name&email=email&password=password&passwordCheck=password')
          .end(function(err, res) {
            
            // 條件一：成功註冊
            expect(res.statusCode).to.be.equal(302) 
            cookie = res.headers['set-cookie'];

            request(app)
              .post('/signIn')
              .send('email=email&password=password')
              .set('cookie', cookie)
              .redirects(1)
              .end(function(err, res) {
                
                expect(res.text).to.contain('成功登入！') 
                done()
            });
        });
    });

    it("(X) 找不到用戶", (done) => {
        request(app)
          .post('/signIn')
          .send('email=email2&password=password')
          .redirects(1)
          .end(function(err, res) {
            expect(res.statusCode).to.be.equal(200) 
            expect(res.text).to.contain('<h1 class="h3 mb-3 font-weight-normal">Sign In</h1>') 
            done()
        });
    });
})

