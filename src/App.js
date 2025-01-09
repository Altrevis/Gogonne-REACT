import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FloatingCard from './FloatingCard'; 
import FloatingCard2 from './FloatingCard2';  
import './App.css';

function App() {
  // États pour l'authentification et les données utilisateur
  const [authChoice, setAuthChoice] = useState('login'); // Détermine si l'utilisateur choisit de se connecter ou de s'inscrire
  const [nom, setNom] = useState(''); // État pour le nom de l'utilisateur
  const [prenom, setPrenom] = useState(''); // État pour le prénom de l'utilisateur
  const [email, setEmail] = useState(''); // État pour l'email de l'utilisateur
  const [motDePasse, setMotDePasse] = useState(''); // État pour le mot de passe
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Indique si l'utilisateur est connecté
  const [error, setError] = useState(''); // Message d'erreur à afficher en cas de problème
  const [scrollPosition, setScrollPosition] = useState(0); // Position actuelle du défilement vertical

  // États pour les champs de l'inscription (menu déroulant)
  const [race, setRace] = useState(''); // Sélection de la race
  const [classe, setClasse] = useState(''); // Sélection de la classe
  const [rang, setRang] = useState(''); // Sélection du rang
  const [divitee, setDivitee] = useState(''); // Sélection de la divinité

  // Modifie le choix d'authentification entre connexion et inscription
  const handleAuthChoice = (choice) => {
    setAuthChoice(choice); // Met à jour l'état de choix
    setError(''); // Réinitialise les messages d'erreur
  };

  // Envoie les données d'inscription au serveur
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError(''); // Réinitialise les messages d'erreur
    try {
      // Requête POST pour envoyer les informations d'inscription
      await axios.post('http://localhost:3000/api/personnages', {
        nom,
        prenom,
        email,
        mot_de_passe: motDePasse,
        race,
        classe,
        rang,
        divitée: divitee,
      });

      // Réinitialise les champs après une inscription réussie
      setNom('');
      setPrenom('');
      setEmail('');
      setMotDePasse('');
      setRace('');
      setClasse('');
      setRang('');
      setDivitee('');
    } catch (error) {
      setError('Erreur lors de l\'ajout du personnage.'); // Affiche un message d'erreur en cas d'échec
    }
  };

  // Envoie les données de connexion au serveur
  const handleLogin = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError(''); // Réinitialise les messages d'erreur
    try {
      // Requête POST pour envoyer les informations de connexion
      await axios.post('http://localhost:3000/api/login', {
        email,
        mot_de_passe: motDePasse,
      });
      setIsLoggedIn(true); // Passe l'état de connexion à "vrai" si succès
    } catch (error) {
      setError('Identifiants incorrects.'); // Affiche un message d'erreur si les identifiants sont incorrects
    }
  };

  // Gère le défilement de la page et met à jour l'état de la position de défilement
  useEffect(() => {
    const handleWheel = (e) => {
      const scrollY = e.deltaY; // Obtient la valeur du défilement
      setScrollPosition((prevPosition) => Math.max(prevPosition + scrollY / 50, 0)); // Met à jour la position
    };

    // Ajoute un écouteur pour l'événement de défilement
    window.addEventListener('wheel', handleWheel);
    return () => {
      // Nettoie l'écouteur lors du démontage du composant
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className="App">
      {/* Contenu affiché si l'utilisateur est connecté */}
      {isLoggedIn ? (
        <>
          <header className="App-header">
            <h1>Bienvenue !</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Affiche les messages d'erreur */}
          </header>
          <section className="App-content">
            {/* Section contenant des cartes flottantes animées */}
            <div
              className="floating-card-container"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                width: '100%',
                height: '100vh',
                perspective: '1000px',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Génère des cartes flottantes à gauche et à droite */}
              {[...Array(6)].map((_, index) => (
                <FloatingCard
                  key={index}
                  style={{
                    position: 'absolute',
                    left: `${(index % 2 === 0 ? 10 : 60)}%`,
                    top: `${20 * index}%`,
                    zIndex: index + 1,
                    transform: `translateZ(${(scrollPosition * 10 + index * 100)}px)`,
                    transition: 'transform 0.1s',
                    willChange: 'transform',
                  }}
                />
              ))}
              {[...Array(6)].map((_, index) => (
                <FloatingCard2
                  key={index}
                  style={{
                    position: 'absolute',
                    right: `${(index % 2 === 0 ? 10 : 60)}%`,
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
        // Contenu affiché pour la connexion/inscription
        <header className="App-header">
          <h1>{authChoice === 'login' ? 'Connexion' : 'Inscription'}</h1>
          <div>
            {/* Boutons pour basculer entre les modes connexion et inscription */}
            <button onClick={() => handleAuthChoice('login')}>Connexion</button>
            <button onClick={() => handleAuthChoice('register')}>Inscription</button>
          </div>
          <form onSubmit={authChoice === 'login' ? handleLogin : handleSubmit}>
            {/* Champs pour l'email et le mot de passe */}
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              id="password"
              type="password"
              placeholder="Mot de passe"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
            />

            {/* Champs supplémentaires pour l'inscription */}
            {authChoice === 'register' && (
              <>
                <input
                  id="Nom"
                  type="text"
                  placeholder="Nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
                <input
                  id="Prénom"
                  type="text"
                  placeholder="Prénom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  required
                />
                <select value={race} onChange={(e) => setRace(e.target.value)} required>
                  <option value="">Choisir une race</option>
                  <option value="1">Race 1</option>
                  <option value="2">Race 2</option>
                  <option value="3">Race 3</option>
                </select>
                <select value={classe} onChange={(e) => setClasse(e.target.value)} required>
                  <option value="">Choisir une classe</option>
                  <option value="1">Classe 1</option>
                  <option value="2">Classe 2</option>
                  <option value="3">Classe 3</option>
                </select>
                <select value={rang} onChange={(e) => setRang(e.target.value)} required>
                  <option value="">Choisir un rang</option>
                  <option value="1">Rang 1</option>
                  <option value="2">Rang 2</option>
                  <option value="3">Rang 3</option>
                </select>
                <select value={divitee} onChange={(e) => setDivitee(e.target.value)} required>
                  <option value="">Choisir une divinité</option>
                  <option value="1">Divinité 1</option>
                  <option value="2">Divinité 2</option>
                  <option value="3">Divinité 3</option>
                </select>
              </>
            )}

            <button type="submit">
              {authChoice === 'login' ? 'Se connecter' : 'S\'inscrire'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Affiche les erreurs */}
          </form>
        </header>
      )}
    </div>
  );
}

export default App;