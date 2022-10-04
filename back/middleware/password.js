const passwordSchema = require('../models/password');

// permettra de vérifier que le mot de passe respecte le format décrit dans le schéma password au moment de l'inscription
module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.status(400).json({ message: 'le MDP doit avoir au moins 8 caractères dont au moins une majuscule, une minuscule, un chiffre et un symbole.' });
    } else {
        next();
    }
};