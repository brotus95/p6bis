const validator = require("validator");

// permettra de vérifier que le format email est correct au moment de l'inscription via la fonction isEmail de validator
module.exports = (req, res, next) => {
    const valideEmail = validator.isEmail(req.body.email)
    if (valideEmail !== true) {
        res.status(400).json({ message: 'Adresse mail non conforme.' });
    } else {
        next();
    }
};