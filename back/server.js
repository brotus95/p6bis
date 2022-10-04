// import package htpp de node
const http = require('http');
// import de l'application. Extension js pas obligatoire avec require
const app = require('./app');

const cors = require('cors');
// app.use(cors()) 

// normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// definition du port de l'application
const port = normalizePort(process.env.PORT || '3000');
// dis à l'application express de passer par ce port
app.set('port', port);


// errorHandler  recherche les différentes erreurs et les gère de manière appropriée
const errorHandler = error => {
  // si le serveur n'entend rien alors il lance une erreur
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    // EACCES est autorisation refusée
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      // process.exit(1) signifie mettre fin au processus avec un échec. process.exit(0) signifie mettre fin au processus sans échec
      process.exit(1);
      break;
    // EADDRINUSE veut dire que l'adresse cherchée est en cour d'utilisation
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//création du serveur. Cette méthode prend en argument la fonction qui sera appelée à chaque requete recue par le serveur
const server = http.createServer(app);

// si le server est en erreur appelle la fonction errorHandler qui gère les erreurs
server.on('error', errorHandler);

// un écouteur d'évènements est également enregistré, consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console.
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

//utilise le port 3000 par défaut ou la variable environnement a utilisée envoyée par le serveur
server.listen(port);                    