// on appelle le modèle de la sauce
const Sauce = require('../models/sauce');
// on appelle fs (filesystem) qui permet d'aller dans les fichiers
const fs = require('fs');

// création sauce
exports.createSauce = (req, res, next) => {
    // on extrait le sauce de la requete via le parse
    // dans req.body.sauce le sauce correspont à la key de postman pour ajouter les infos en texte
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    // déclaration de sauce qui sera une nouvelle instance du modele Sauce qui contient toutes les informations dont on a besoin
    const sauce = new Sauce({
        // raccourci spread pour récupérer toutes les données de req.body ( title description...)
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [' '],
        usersdisLiked: [' ']
    });
  
    sauce.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
 };

// accède à une sauce
// une personne avec un webtokenvalide accède à ces informations puisque seulement le token identifie et donne accès
exports.getOneSauce = (req, res, next) => {
    // on utilise le modele mangoose et findOne pour trouver un objet via la comparaison req.params.id
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
}

// accède à toutes les sauces
// une personne avec un webtokenvalide accède à ces informations puisque seulement le token identifie et donne accès
exports.getAllSauces = (req, res, next) => {
    // on veut la liste complète de Sauce alors on utilise find() sans argument
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
}

// modifie une sauce
exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete sauceObject._userId;
    // l'id de la sauce est l'id inscrit dans l'url
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            // l'id du créateur de la sauce doit etre le meme que celui identifié par le token
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };

// supprime une sauce
exports.deleteSauce = (req, res, next) => {
    // trouve dans les sauce un _id correspondant à l'id de la requete
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            // l'id du créateur de la sauce doit etre le meme que celui identifié par le token
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                // unlink va supprimer le fichier image de la sauce concernée dans le dossier image
                fs.unlink(`images/${filename}`, () => {
                    // effacera un sauce et son _id sera la comparaison avec l'id des paramètres de la requete (paramètre de route)
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
};

// like/dislike une sauce
exports.likeDislikeSauce = (req, res, next) => {
    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id
    
    // 3 cas : like/neutre ie soit annuler son like soit annuler son dislike/dislike
    switch (like) {
        //like
        case 1 :
            Sauce.findOne({ _id: sauceId })
                .then((sauce) => {
                    if (sauce.usersLiked.includes(userId)) { 
                        res.status(400).json({ message: `L'utilisateur a déjà aimé la sauce` });
                    } else {
                        Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
                        .then(() => res.status(200).json({ message: `J'aime` }))
                        .catch((error) => res.status(400).json({ error }))
                    }
                })
                .catch((error) => res.status(404).json({ error }))
        break;
        
        //neutre
        case 0 :
            Sauce.findOne({ _id: sauceId })
                .then((sauce) => {
                if (sauce.usersLiked.includes(userId)) { 
                    Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
                        .then(() => res.status(200).json({ message: `Neutre` }))
                        .catch((error) => res.status(400).json({ error }))
                }
                if (sauce.usersDisliked.includes(userId)) { 
                    Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                        .then(() => res.status(200).json({ message: `Neutre` }))
                        .catch((error) => res.status(400).json({ error }))
              }
            })
            .catch((error) => res.status(404).json({ error }))
        break;
    
        //dislike
        case -1 :

            Sauce.findOne({ _id: sauceId })
                .then((sauce) => {
                    if (sauce.usersDisliked.includes(userId)) { 
                        res.status(400).json({ message: `L'utilisateur n'aime déjà pas la sauce` });
                    } else {
                        Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
                        .then(() => res.status(200).json({ message: `Je n'aime pas` }))
                        .catch((error) => res.status(400).json({ error }))
                    }
                })
                .catch((error) => res.status(404).json({ error }))
        break;
        
        default:
            res.status(400).json({ message: `Seulement 1 vote par utilisateur pour chaque sauce` });
    }
  };