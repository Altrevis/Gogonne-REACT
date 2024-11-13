const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');  // Importer bcrypt pour le hachage des mots de passe

const app = express();
const port = 3000;
const saltRounds = 10; // Nombre de tours pour le hachage du mot de passe

app.use(cors());
app.use(bodyParser.json());

// Initialiser la base de données SQLite
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

// Créer la table si elle n'existe pas
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
  const { nom, prenom, race, classe, date_du_perso, rang, divitée, email, mot_de_passe } = req.body;

  // Vérifier si un personnage avec le même email existe déjà
  db.get(`SELECT * FROM personnages WHERE email = ?`, [email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (row) {
      return res.status(400).json({ error: 'Un compte avec cet e-mail existe déjà.' });
    }

    // Hashage du mot de passe avant de l'enregistrer dans la base de données
    bcrypt.hash(mot_de_passe, saltRounds, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Insertion dans la base de données avec le mot de passe haché
      db.run(`INSERT INTO personnages (nom, prenom, race, classe, date_du_perso, rang, divitée, email, mot_de_passe) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [nom, prenom, race, classe, date_du_perso, rang, divitée, email, hashedPassword], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Afficher "Bienvenue" dans le terminal
        console.log(`Bienvenue ${nom} ${prenom}!`);

        // Retourner l'id du personnage ajouté
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
      return res.status(500).json({ error: err.message });
    }

    if (row) {
      // Comparer le mot de passe envoyé avec celui stocké (haché)
      bcrypt.compare(mot_de_passe, row.mot_de_passe, (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (result) {
          // Si les mots de passe correspondent, afficher un message de succès
          return res.status(200).json({ message: 'Bravo' });
        } else {
          // Si le mot de passe ne correspond pas
          return res.status(400).json({ error: 'Identifiants incorrects.' });
        }
      });
    } else {
      // Si l'utilisateur n'est pas trouvé
      return res.status(400).json({ error: 'Identifiants incorrects.' });
    }
  });
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
