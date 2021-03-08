const express = require('express');
const mongoose = require('mongoose');
const app = express();
const ejs = require('ejs');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const { Db } = require('mongodb');

mongoose.connect('mongodb+srv://admin:lucasthomas@gashop.bnze7.mongodb.net/GaShop?retryWrites=true&w=majority', { useNewUrlParser: true }, { useUnifiedTopology: true });

const accSchema = {
  email: {type: String, unique: [true, 'Email déjà prise']},
  pseudo: {type: String, unique: [true, 'Pseudo déjà pris']},
  password: String
}

const Account = mongoose.model("Acc", accSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('views'))

app.get('/', (req, res) => {
  res.render(__dirname + '/views/index.ejs')
})

app.get('/register', (req, res) => {
  res.render(__dirname + '/views/register/index.ejs')
})

app.get('/login', (req, res) => {
  res.render(__dirname + '/views/login/index.ejs')
})

app.get('/regerror', (req, res) => {
  res.render(__dirname + '/views/regerror/index.ejs')
})

app.post("/register", async function(req, res) {
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        let newAccount = new Account({
        email: req.body.email,
        pseudo: req.body.pseudo,
        password: hash
      });
      newAccount.save(function(err, doc) {
        if(err) {
          res.redirect('/regerror') 
        } else {
          res.redirect('/login');  
        }
      });
    })
})

app.post("/regerror", async function(req, res) {
  bcrypt.hash(req.body.password, 10, function(err, hash) {
      let newAccount = new Account({
      email: req.body.email,
      pseudo: req.body.pseudo,
      password: hash
    });
    newAccount.save(function(err, doc) {
      if(err) {
        res.redirect('/regerror');
      } else {
        res.redirect('/login');  
      }
    });
  })
})

app.post("/login", async function(req, res) {
  bcrypt.hash(req.body.password, 10 , async function(err, hash) {
    await Account.findOne({pseudo: req.body.username}, {}, function(err, doc)  {
      if(doc) {
        bcrypt.compare(req.body.password, doc.password, function(err, res) {
          if(res === true) {
            res.redirect('/');
            console.log(res)
          } else if (res === false) {
            res.redirect('/regerror');
          }
        })
      } else if (!doc) {
        res.redirect('/regerror');
        console.log(doc)
      } else if(err) {
        res.redirect('/regerror');
        console.log(doc)
      }
    })
  })
})

app.set('view engine', 'ejs');

app.listen(4000, function() {
  console.log('########server is running########');
})
