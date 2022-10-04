// verifie que le fichier choisis par l'utilisateur est bien une image qui correspond aux formats que nous avons prédéfinis
module.exports = (req, res, next) => {
    if (req.file) {
        if (
            req.file.mimetype === "image/jpeg" ||
            req.file.mimetype === "image/png" ||
            req.file.mimetype === "image/jpg" 
        ) {
            next();
        } else {
            res.status(400).json({ message: 'Merci de respecter le format de l\'image : jpg, jpeg ou png.' });
            
        }
    }
    else {
        next();
    }
};