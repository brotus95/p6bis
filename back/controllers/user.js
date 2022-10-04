// appel de bcrypt
const bcrypt = require('bcrypt');
// appel de jsonwebtoken
const jwt = require('jsonwebtoken');
require('dotenv').config();

// appel de modele user
const User = require('../models/user');

//inscription de nouveaux utilisateurs via signup
exports.signup = (req, res, next) => {
    // fonction pour hasher/crypter le mot de passe en 10 tours pour le sel
    bcrypt.hash(req.body.password, 10)
    // créer un modele User avec email et mot de pase hashé une fois le salage terminé
    .then(hash => {
        const user = new User({
        email: req.body.email,
        password: hash
    });
    // sauvegarde le user dans la base de donnée
    user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// connexion via login
exports.login = (req, res, next) => {
    // on trouve l'adresse qui est rentrée par un utilisateur (requete)
    User.findOne({ email: req.body.email })
        .then(user => {
            // si la requete email ne correspond pas à un utisateur
            if (!user) {
                // message d'erreur neutre pour ne pas donner l'information de si l'utilisateur utilise bel et bien notre produit ou non
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            // si c'est ok bcrypt compare le mot de passe de user avec celui rentré par l'utilisateur dans sa request
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // pas de correspondance
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    // correspondance
                    res.status(200).json({
                        // renvoi l'user id
                        userId: user._id,
                        // renvoi un token traité/encodé : userid + clé secrette pour encodage
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.SECRET_TOKEN,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };