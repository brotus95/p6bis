// on importe multer
const multer = require('multer');

// on définit les images/formats reçu en appartenance de format ( comme un dictionnaire)
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// multer.diskStorage on va enregistrer sur le disque
const storage = multer.diskStorage({
  // on choisit la destination
  destination: (req, file, callback) => {
    // null dit qu'il n'y a pas eu d'erreur à ce niveau la et 'images' c'est le nom du dossier
    callback(null, 'images');
  },
  // on choisit le nom
  filename: (req, file, callback) => {
    // nom d'origine du fichier que l'ont transforme si il y a des espaces, on crée un tableau et on join ses éléments par _
    const name = file.originalname.split(' ').join('_');
    // permet de créer une extension de fichiers correspondant au mimetype (via dictionnaire) envoyé par le frontend
    const extension = MIME_TYPES[file.mimetype];
    // aura son nom associé à une date (pour le rendre le plus unique possible) et un point et son extension
    callback(null, name + Date.now() + '.' + extension);

  }
});

// on exporte le fichier via multer qui possede l'objet storage puis .single signifie fichier unique (pas un groupe de fichiers) en disant que c'est un fichier 'image'
// ce nom de fichier sera la key dans form-data de postman (insert File)
module.exports = multer({storage: storage}).single('image');