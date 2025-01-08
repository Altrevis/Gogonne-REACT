import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FloatingCard from './FloatingCard'; 
import FloatingCard2 from './FloatingCard2';  
import './App.css';

function App() {
  const [authChoice, setAuthChoice] = useState('login');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);  // Position du scroll

  const handleAuthChoice = (choice) => {
    setAuthChoice(choice);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:3000/api/personnages', {
        nom,
        prenom,
        email,
        mot_de_passe: motDePasse,
      });
      setNom('');
      setPrenom('');
      setEmail('');
      setMotDePasse('');
    } catch (error) {
      setError('Erreur lors de l\'ajout du personnage.');
    }
  };
  
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

  // Gestion du défilement pour affecter la position des cartes
  useEffect(() => {
    const handleWheel = (e) => {
      const scrollY = e.deltaY;
      setScrollPosition((prevPosition) => Math.max(prevPosition + scrollY / 50, 0));  // Assurez-vous que la position ne devienne pas négative
    };

    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);  // L'effet ne sera exécuté qu'une seule fois lors du montage du composant

  return (
    <div className="App">
      {isLoggedIn ? (
        <>
          <header className="App-header">
            <h1>Bienvenue !</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </header>
          <section className="App-content">
            {/* Cartes flottantes avec effet de défilement pour les déplacer vers le centre */}
            <div
              className="floating-card-container"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                width: '100%',
                height: '100vh',
                perspective: '1000px',  // Ajout de la perspective pour l'effet de profondeur 3D
                transformStyle: 'preserve-3d', // Nécessaire pour appliquer la 3D sur les éléments enfants
              }}
            >
              {/* Cartes flottantes à gauche */}
              {[...Array(6)].map((_, index) => (
                <FloatingCard
                  key={index}
                  style={{
                    position: 'absolute',
                    left: `${(index % 2 === 0 ? 10 : 60)}%`, // Alternance entre gauche et droite
                    top: `${20 * index}%`,
                    zIndex: index + 1,  // Le zIndex augmente à chaque carte pour créer un effet de profondeur
                    transform: `translateZ(${(scrollPosition * 10 + index * 100)}px)`,  // Effet de profondeur en 3D
                    transition: 'transform 0.1s',
                    willChange: 'transform',  // Optimisation des performances
                  }}
                />
              ))}
              
              {/* Cartes flottantes à droite */}
              {[...Array(6)].map((_, index) => (
                <FloatingCard2
                  key={index}
                  style={{
                    position: 'absolute',
                    right: `${(index % 2 === 0 ? 10 : 60)}%`, // Alternance entre gauche et droite
                    top: `${20 * index}%`,
                    zIndex: index + 1,
                    transform: `translateZ(${(scrollPosition * 10 + index * 100)}px)`,  // Effet de profondeur en 3D
                    transition: 'transform 0.1s',
                    willChange: 'transform',  // Optimisation des performances
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
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Mot de passe" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required />
            <button type="submit">{authChoice === 'login' ? 'Se connecter' : 'S\'inscrire'}</button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </header>
      )}
    </div>
  );
}

export default App;
