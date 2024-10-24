const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 5000;

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
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  race TEXT,
  classe TEXT,
  date_du_perso TEXT,
  rang TEXT,
  divitée TEXT,
  email TEXT,
  mot_de_passe TEXT
)`);

// Route pour ajouter un personnage
app.post('/api/personnages', (req, res) => {
  const { nom, prenom } = req.body;

  // Insertion dans la base de données
  db.run(`INSERT INTO personnages (nom, prenom) VALUES (?, ?)`, [nom, prenom], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Afficher "Bienvenue" dans le terminal
    console.log(`Bienvenue ${nom} ${prenom}!`);

    // Retourner l'id du personnage ajouté
    res.status(201).json({ id: this.lastID, nom, prenom });
  });
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
