const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauce = require('../middleware/sauce');

const SauceCtrl = require('../controllers/sauce');


// intercepter les requetes post
// création d'une sauce
// vérification du format des images avant la création de la sauce via le middleware sauce
router.post('/', auth, multer, sauce, SauceCtrl.createSauce );

// intercepter les requetes get pour api/stuff 
// renvoie toutes les sauces de la base de donnees
router.get('/', auth, SauceCtrl.getAllSauces );

// renvoie une sauce specifique
router.get('/:id', auth, SauceCtrl.getOneSauce );

// modifier une sauce
// vérification du format des images avant la modification de la sauce via le middleware sauce
router.put('/:id', auth, multer, sauce, SauceCtrl.updateSauce );

// suppression d'une sauce
router.delete('/:id', auth, SauceCtrl.deleteSauce );

// Like/Dislike une sauce
router.post("/:id/like", auth, SauceCtrl.likeDislikeSauce);

module.exports = router;