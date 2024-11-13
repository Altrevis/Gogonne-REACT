const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

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

    // Insertion dans la base de données
    db.run(`INSERT INTO personnages (nom, prenom, race, classe, date_du_perso, rang, divitée, email, mot_de_passe) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
    [nom, prenom, race, classe, date_du_perso, rang, divitée, email, mot_de_passe], function(err) {
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

// Route pour la connexion d'un utilisateur
app.post('/api/login', (req, res) => {
  const { email, mot_de_passe } = req.body;

  // Requête pour vérifier si l'utilisateur existe avec cet e-mail et mot de passe
  db.get(`SELECT * FROM personnages WHERE email = ? AND mot_de_passe = ?`, [email, mot_de_passe], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (row) {
      // Si les identifiants sont corrects, afficher un message de succès
      return res.status(200).json({ message: 'Bravo' });
    } else {
      // Si l'utilisateur n'est pas trouvé, renvoyer un message d'erreur
      return res.status(400).json({ error: 'Identifiants incorrects.' });
    }
  });
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
