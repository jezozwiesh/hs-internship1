const router = require('express').Router();
const passport = require('passport');
const { Hash_Password } = require('../lib/hash_utilities');
const User = require('../models/user');

router.post('/login', passport.authenticate('local', {failureRedirect: '/fail', successRedirect: '/board'}), (req, res) => {});

let msg = '';

router.post('/register', (req, res) => {
    const salt_hash = Hash_Password(req.body.password);
    const username = req.body.username.trim();

    const new_user = new User({
        username: username,
        hash: salt_hash.hash,
        salt: salt_hash.salt
    });

    if (User.exists({username: username})) res.send('Podana nazwa użytkownika już istnieje');
    else
    {
        new_user.save()
        .then(user => console.log('Nowy uzytkownik: ' + user))
        .catch(err => console.log(err));

        res.redirect('/login');
    }
    
});

///////////////////////////////////////////////////////////////////

router.get('/', (req, res) => {
    res.redirect('/register');
});

router.get('/register', (req, res) => {
    res.render('account-form', {message: msg});
});

router.get('/login', (req, res) => {
    res.render('account-form', {message: msg});
});

router.get('/success', (req, res) => 
{
    res.send('success');
});

router.get('/fail', (req, res) =>
{
    res.send('fail');
});

router.get('/board', (req, res) => {
    res.render('board');
});

module.exports = router;