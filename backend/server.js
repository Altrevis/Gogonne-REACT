// Importation des modules nécessaires
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt'); // Importer bcrypt pour le hachage des mots de passe

// Création de l'application Express
const app = express();
const port = 3000;
const saltRounds = 10; // Nombre de tours pour le hachage du mot de passe

// Middleware pour autoriser les requêtes CORS (Cross-Origin Resource Sharing)
app.use(cors());
// Middleware pour analyser les données JSON dans les requêtes
app.use(bodyParser.json());

// Initialiser la base de données SQLite
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error(err.message); // Affichage d'une erreur si la connexion échoue
  }
  console.log('Connected to the database.'); // Confirmation de la connexion à la base de données
});

// Créer la table des personnages si elle n'existe pas déjà
db.run(`CREATE TABLE IF NOT EXISTS personnages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  mot_de_passe TEXT,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  race TEXT,
  classe TEXT,
  date_du_perso TEXT,
  rang TEXT,
  divitée TEXT
)`);

// Route pour ajouter un personnage
app.post('/api/personnages', (req, res) => {
  // Récupérer les données envoyées dans la requête
  const { nom, prenom, race, classe, date_du_perso, rang, divitée, email, mot_de_passe } = req.body;

  // Vérifier si un personnage avec le même email existe déjà
  db.get(`SELECT * FROM personnages WHERE email = ?`, [email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message }); // Erreur de base de données
    }

    if (row) {
      return res.status(400).json({ error: 'Un compte avec cet e-mail existe déjà.' }); // Si l'email est déjà pris
    }

    // Hachage du mot de passe avant de l'enregistrer dans la base de données
    bcrypt.hash(mot_de_passe, saltRounds, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: err.message }); // Erreur de hachage
      }

      // Insertion du personnage dans la base de données avec le mot de passe haché
      db.run(`INSERT INTO personnages (nom, prenom, race, classe, date_du_perso, rang, divitée, email, mot_de_passe) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [nom, prenom, race, classe, date_du_perso, rang, divitée, email, hashedPassword], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message }); // Erreur d'insertion dans la base de données
        }

        // Affichage d'un message de bienvenue dans la console
        console.log(`Bienvenue ${nom} ${prenom}!`);

        // Retourne l'ID du personnage ajouté
        res.status(201).json({ id: this.lastID, nom, prenom });
      });
    });
  });
});

// Route pour la connexion d'un utilisateur
app.post('/api/login', (req, res) => {
  const { email, mot_de_passe } = req.body;

  // Requête pour récupérer le personnage avec l'e-mail donné
  db.get(`SELECT * FROM personnages WHERE email = ?`, [email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message }); // Erreur de base de données
    }

    if (row) {
      // Comparer le mot de passe envoyé avec celui stocké (haché)
      bcrypt.compare(mot_de_passe, row.mot_de_passe, (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message }); // Erreur de comparaison de mot de passe
        }

        if (result) {
          // Si les mots de passe correspondent, afficher un message de succès
          return res.status(200).json({ message: 'Bravo' });
        } else {
          // Si les mots de passe ne correspondent pas
          return res.status(400).json({ error: 'Identifiants incorrects.' });
        }
      });
    } else {
      // Si l'utilisateur n'est pas trouvé
      return res.status(400).json({ error: 'Identifiants incorrects.' });
    }
  });
});

// Route pour récupérer tous les personnages sans afficher le mot de passe et l'ID
app.get('/api/personnages', (req, res) => {
  // Requête pour récupérer les informations des personnages
  db.all(`SELECT nom, prenom, race, classe, date_du_perso, rang, divitée, email FROM personnages`, [], (err, rows) => {
    if (err) {
      console.error('Erreur SQL:', err.message); // Vérifie les erreurs SQL dans la console
      return res.status(500).json({ error: err.message }); // Erreur de récupération des données
    }
    
    console.log('Données récupérées:', rows); // Affiche les données dans la console pour vérification
    
    // Retourne les données des personnages sous forme de réponse JSON
    res.status(200).json(rows);
  });
});

// Lancer le serveur sur le port spécifié
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});