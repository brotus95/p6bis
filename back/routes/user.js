const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const checkPassword = require("../middleware/password")
const checkEmail = require("../middleware/email")

// inscription
// vérification des formats de l'email et du password via les middleware email et password avant inscription
router.post('/signup', checkEmail, checkPassword,  userCtrl.signup);

// connexion
router.post('/login', userCtrl.login);

module.exports = router;