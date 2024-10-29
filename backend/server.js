const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer'); // Importer nodemailer

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
  email TEXT UNIQUE,  // Changer pour rendre l'email unique
  mot_de_passe TEXT
)`);

// Route pour ajouter un personnage
app.post('/api/personnages', (req, res) => {
  const { nom, prenom, email } = req.body;

  // Vérification si l'email existe déjà
  db.get(`SELECT * FROM personnages WHERE email = ?`, [email], (err, row) => {
    if (row) {
      return res.status(400).json({ error: 'Cette adresse e-mail est déjà utilisée.' });
    }

    // Insertion dans la base de données
    db.run(`INSERT INTO personnages (nom, prenom, email) VALUES (?, ?, ?)`, [nom, prenom, email], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Envoyer un e-mail de confirmation
      sendConfirmationEmail(email);

      // Afficher "Bienvenue" dans le terminal
      console.log(`Bienvenue ${nom} ${prenom}!`);

      // Retourner l'id du personnage ajouté
      res.status(201).json({ id: this.lastID, nom, prenom });
    });
  });
});

// Fonction pour envoyer un e-mail de confirmation
const sendConfirmationEmail = (recipientEmail) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Utiliser Gmail
    auth: {
      user: 'altrevis.benazeth@gmail.com',
      pass: 'votre_mot_de_passe', // Remplacez par le mot de passe de l'adresse e-mail
    },
  });

  const mailOptions = {
    from: 'altrevis.benazeth@gmail.com',
    to: recipientEmail,
    subject: 'Confirmation d\'inscription',
    text: 'Merci de vous être inscrit !',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Erreur lors de l\'envoi de l\'email:', error);
    }
    console.log('Email envoyé:', info.response);
  });
};

// Lancer le serveur
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
