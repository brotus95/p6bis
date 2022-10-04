// import express
const express = require('express');

// import mongoose
const mongoose = require('mongoose');

// on importe path, donne accés au chemin du système de fichiers
const path = require('path');

// appel de dotenv qui stocke des variables d'environnement et ça servira pour l'appel mongodb en dessous. 
// permet d'éviter d'expliciter des données sensibles dans le code
require('dotenv').config();

// appel de helmet, il est utilisé pour sécuriser vos en-têtes
const helmet = require("helmet");

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//creer une application express
const app = express();

//connexion api a base de donnees
mongoose.connect(process.env.SECRET_DB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(helmet({crossOriginResourcePolicy: false}));

//middlewares

//pour le CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//intercepte les requetes qui contiennent du json et le mettent à disposition dans req.body
app.use(express.json());

// pour cette route la on utilise le router de saucesRoutes
// racine du chemin + routeur
app.use('/api/sauces', sauceRoutes);
// pour cette route la on utilise le router de userRoutes
app.use('/api/auth', userRoutes);
// pour cette route utiliser le fichier statique
app.use('/images', express.static(path.join(__dirname, 'images')));

// on exporte cette constante pour pouvoir y acceder depuis d'autres fichiers
module.exports = app;