const mongoose = require('mongoose');

// creation d'un schema de donnees qui contient les champs pour chaque "Thing" ainsi que leur type et leur eventuel caractere obligatoire
// id généré automatiquement Mongoose
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true},
    description: { type: String, required: true },
    mainPepper: { type: String, required: true},
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true},
    likes: { type: Number, required: true }, 
    dislikes: { type: Number, required: true}, 
    usersLiked: { type: [String], required: true }, 
    usersDisliked: { type: [String], required: true}, 
  });

// exporte le schema en tant que modèle Mongoose appelé "Thing" et utilisable par Express 
module.exports = mongoose.model('Sauce', sauceSchema);