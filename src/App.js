import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FloatingCard from './FloatingCard'; 
import FloatingCard2 from './FloatingCard2';  
import './App.css';

function App() {
  // États pour l'inscription
  const [authChoice, setAuthChoice] = useState('login');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);

  // États pour les menus déroulants
  const [race, setRace] = useState('');
  const [classe, setClasse] = useState('');
  const [rang, setRang] = useState('');
  const [divitee, setDivitee] = useState('');

  // Fonction pour gérer les choix entre login/inscription
  const handleAuthChoice = (choice) => {
    setAuthChoice(choice);
    setError('');
  };

  // Fonction pour envoyer l'inscription au serveur
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
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
      setNom('');
      setPrenom('');
      setEmail('');
      setMotDePasse('');
      setRace('');
      setClasse('');
      setRang('');
      setDivitee('');
    } catch (error) {
      setError('Erreur lors de l\'ajout du personnage.');
    }
  };

  // Fonction pour gérer la connexion
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:3000/api/login', {
        email,
        mot_de_passe: motDePasse,
      });
      setIsLoggedIn(true);
    } catch (error) {
      setError('Identifiants incorrects.');
    }
  };

  useEffect(() => {
    const handleWheel = (e) => {
      const scrollY = e.deltaY;
      setScrollPosition((prevPosition) => Math.max(prevPosition + scrollY / 50, 0));
    };

    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className="App">
      {isLoggedIn ? (
        <>
          <header className="App-header">
            <h1>Bienvenue !</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </header>
          <section className="App-content">
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
        <header className="App-header">
          <h1>{authChoice === 'login' ? 'Connexion' : 'Inscription'}</h1>
          <div>
            <button onClick={() => handleAuthChoice('login')}>Connexion</button>
            <button onClick={() => handleAuthChoice('register')}>Inscription</button>
          </div>
          <form onSubmit={authChoice === 'login' ? handleLogin : handleSubmit}>
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

            {/* Menus déroulants pour l'inscription uniquement */}
            {authChoice === 'register' && (
              <>
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
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </form>
        </header>
      )}
    </div>
  );
}

export default App;
