import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FloatingCard from './FloatingCard'; 
import FloatingCard2 from './FloatingCard2';  
import './App.css';

function App() {
  // Déclaration des états nécessaires
  const [authChoice, setAuthChoice] = useState('login'); // Choix entre inscription et connexion
  const [nom, setNom] = useState(''); // Nom de l'utilisateur
  const [prenom, setPrenom] = useState(''); // Prénom de l'utilisateur
  const [email, setEmail] = useState(''); // Email de l'utilisateur
  const [motDePasse, setMotDePasse] = useState(''); // Mot de passe de l'utilisateur
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Statut de connexion
  const [error, setError] = useState(''); // Message d'erreur
  const [scrollPosition, setScrollPosition] = useState(0); // Position du scroll

  // Fonction pour gérer le choix de connexion ou d'inscription
  const handleAuthChoice = (choice) => {
    setAuthChoice(choice); // Met à jour le choix d'authentification
    setError(''); // Réinitialise le message d'erreur
  };

  // Fonction pour envoyer l'inscription
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError(''); // Réinitialise l'erreur
    try {
      // Envoi des données d'inscription au serveur
      await axios.post('http://localhost:3000/api/personnages', {
        nom,
        prenom,
        email,
        mot_de_passe: motDePasse,
      });
      // Réinitialisation des champs après soumission
      setNom('');
      setPrenom('');
      setEmail('');
      setMotDePasse('');
    } catch (error) {
      setError('Erreur lors de l\'ajout du personnage.'); // Affiche une erreur si l'envoi échoue
    }
  };

  // Fonction pour gérer la connexion
  const handleLogin = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError(''); // Réinitialise l'erreur
    try {
      // Envoi des données de connexion au serveur
      await axios.post('http://localhost:3000/api/login', {
        email,
        mot_de_passe: motDePasse,
      });
      setIsLoggedIn(true); // Change l'état de connexion en 'true'
    } catch (error) {
      setError('Identifiants incorrects.'); // Affiche une erreur si les identifiants sont incorrects
    }
  };

  // Effet de gestion du défilement pour affecter la position des cartes flottantes
  useEffect(() => {
    // Fonction pour capturer l'événement de défilement de la souris
    const handleWheel = (e) => {
      const scrollY = e.deltaY; // Récupère le mouvement de la souris
      // Mise à jour de la position de défilement, ne devient pas négatif
      setScrollPosition((prevPosition) => Math.max(prevPosition + scrollY / 50, 0));
    };

    // Ajout d'un écouteur d'événements pour le défilement
    window.addEventListener('wheel', handleWheel);

    // Nettoyage de l'écouteur d'événements lors du démontage du composant
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []); // L'effet s'exécute une seule fois lors du montage du composant

  return (
    <div className="App">
      {isLoggedIn ? (
        // Si l'utilisateur est connecté, on affiche la page d'accueil
        <>
          <header className="App-header">
            <h1>Bienvenue !</h1>
            {/* Affichage du message d'erreur s'il y en a un */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </header>
          <section className="App-content">
            <div
              className="floating-card-container"
              style={{
                display: 'flex', // Utilisation de flexbox pour centrer les cartes
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative', // Positionnement relatif des cartes
                width: '100%',
                height: '100vh', // Hauteur de la section à 100% de la vue
                perspective: '1000px',  // Perspective 3D pour l'effet de profondeur
                transformStyle: 'preserve-3d', // Nécessaire pour appliquer la 3D sur les enfants
              }}
            >
              {/* Génère des cartes flottantes à gauche */}
              {[...Array(6)].map((_, index) => (
                <FloatingCard
                  key={index}
                  style={{
                    position: 'absolute',
                    left: `${(index % 2 === 0 ? 10 : 60)}%`, // Positionnement alterné à gauche et droite
                    top: `${20 * index}%`, // Décalage vertical des cartes
                    zIndex: index + 1, // Augmente l'index Z pour la superposition
                    transform: `translateZ(${(scrollPosition * 10 + index * 100)}px)`, // Applique l'effet de profondeur basé sur le défilement
                    transition: 'transform 0.1s', // Transition douce pour l'effet de profondeur
                    willChange: 'transform',  // Optimisation des performances
                  }}
                />
              ))}
              {/* Génère des cartes flottantes à droite */}
              {[...Array(6)].map((_, index) => (
                <FloatingCard2
                  key={index}
                  style={{
                    position: 'absolute',
                    right: `${(index % 2 === 0 ? 10 : 60)}%`, // Positionnement alterné à gauche et droite
                    top: `${20 * index}%`,
                    zIndex: index + 1,
                    transform: `translateZ(${(scrollPosition * 10 + index * 100)}px)`,
                    transition: 'transform 0.1s',
                    willChange: 'transform',
                  }}
                />
              ))}
            </div>
          </section>
        </>
      ) : (
        // Si l'utilisateur n'est pas connecté, on affiche le formulaire de connexion ou d'inscription
        <header className="App-header">
          <h1>{authChoice === 'login' ? 'Connexion' : 'Inscription'}</h1>
          <div>
            {/* Boutons pour basculer entre la connexion et l'inscription */}
            <button onClick={() => handleAuthChoice('login')}>Connexion</button>
            <button onClick={() => handleAuthChoice('register')}>Inscription</button>
          </div>
          {/* Formulaire d'authentification */}
          <form onSubmit={authChoice === 'login' ? handleLogin : handleSubmit}>
            {/* Champs de saisie pour l'email */}
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Met à jour l'email
              required
            />
            {/* Champs de saisie pour le mot de passe */}
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              placeholder="Mot de passe"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)} // Met à jour le mot de passe
              required
            />
            <button type="submit">{authChoice === 'login' ? 'Se connecter' : 'S\'inscrire'}</button>
          </form>
          {/* Affichage du message d'erreur si nécessaire */}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </header>
      )}
    </div>
  );
}

export default App;