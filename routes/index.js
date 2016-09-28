'use strict'

const { Router } = require('express')
const router = Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')


router.get('/', (req, res) =>
  res.render('index')
)

router.get('/login', (req, res) =>
  res.render('login')
)

router.get('/register', (req, res) =>
  res.render('register')
)



// router.post('/register',  ({body: {email, password}}, res, error) => {
//   User
//   .create({
//       email,
//       password
//     })
//     .then(() => res.redirect('/login'))
//     .catch(console.error);
// })


router.post('/login', ({session, body: {email, password}}, res, err) => {
  User.findOne({email})
    .then(user => {
      if (user) {
        return new Promise((resolve, reject)=> {
          bcrypt.compare(password, user.password, (err, matches) => {
            if (err){
              reject(err)
            } else {
              resolve(matches)
            }
          })
        })
      } else {
        res.render('login', {msg: 'Email is not found'})
      }
    })
    .then((matches) => {
      if (matches) {
        session.email = email
        res.redirect('/')
      } else {
        res.render('login', {msg:'Password does not match'})
      }
    })
    .catch(err)
})

router.post('/register', ({ body: { email, password, confirmation } }, res, err) => {
  if (password === confirmation) {
    User.findOne({ email })
      .then(user => {
        if (user) {
          res.render('register', { msg: 'Email is already registered' })
        } else {
          return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
              if (err) {
                reject(err)
              } else {
                resolve(hash)
              }
            })
          })
        }
      })
      .then(hash => User.create({ email, password: hash }))
      .then(() => res.redirect('/login'))
      .catch(err)
  } else { 
    res.render('register', { msg: 'Password & password confirmation do not match' })
  }
})

// do i have to have a get route and a post route?  if i want to logout on click, 
// how do i route that?  want to not have a separate pug file for logout.

router.get('/logout', (req,res) => {
  res.render('logout')
})

router.post('/logout', (req,res) => {
  req.session.destroy( err => {
    if (err) throw err
    res.redirect('/')
  })
})

module.exports = router;
