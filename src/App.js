import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import './App.css';

function Cube() {
  const meshRef = useRef();

  // Utilisation de useFrame pour animer le cube
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01; // Rotation sur l'axe X
      meshRef.current.rotation.y += 0.01; // Rotation sur l'axe Y
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="brown" />
    </mesh>
  );
}

function App() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [race, setRace] = useState('');
  const [classe, setClasse] = useState('');
  const [dateDuPerso, setDateDuPerso] = useState('');
  const [rang, setRang] = useState('');
  const [divitee, setDivitee] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Réinitialiser l'erreur avant la soumission
    try {
      const response = await axios.post('http://localhost:5000/api/personnages', {
        nom,
        prenom,
        race,
        classe,
        date_du_perso: dateDuPerso,
        rang,
        divitée: divitee,
        email,
        mot_de_passe: motDePasse,
      });
      console.log('Personnage ajouté avec succès :', response.data);
      // Réinitialisez les champs si nécessaire
      setNom('');
      setPrenom('');
      setRace('');
      setClasse('');
      setDateDuPerso('');
      setRang('');
      setDivitee('');
      setEmail('');
      setMotDePasse('');
    } catch (error) {
      if (error.response && error.response.data.error) {
        setError(error.response.data.error); // Affichez l'erreur du serveur
      } else {
        setError('Erreur lors de l\'ajout du personnage.');
      }
      console.error('Erreur lors de l\'ajout du personnage:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // Implémentez votre logique d'authentification ici
    // Exemple : vérifier si l'email et le mot de passe sont corrects
    setIsLoggedIn(true); // Changez cela selon votre logique d'authentification
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <>
          <header className="App-header">
            <h1>3D Cube Showcase</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Affichez l'erreur ici */}
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Nom" 
                value={nom} 
                onChange={(e) => setNom(e.target.value)} 
                required 
              />
              <input 
                type="text" 
                placeholder="Prénom" 
                value={prenom} 
                onChange={(e) => setPrenom(e.target.value)} 
                required 
              />
              <input 
                type="text" 
                placeholder="Race" 
                value={race} 
                onChange={(e) => setRace(e.target.value)} 
              />
              <input 
                type="text" 
                placeholder="Classe" 
                value={classe} 
                onChange={(e) => setClasse(e.target.value)} 
              />
              <input 
                type="date" 
                placeholder="Date du personnage" 
                value={dateDuPerso} 
                onChange={(e) => setDateDuPerso(e.target.value)} 
              />
              <input 
                type="text" 
                placeholder="Rang" 
                value={rang} 
                onChange={(e) => setRang(e.target.value)} 
              />
              <input 
                type="text" 
                placeholder="Divitée" 
                value={divitee} 
                onChange={(e) => setDivitee(e.target.value)} 
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <input 
                type="password" 
                placeholder="Mot de passe" 
                value={motDePasse} 
                onChange={(e) => setMotDePasse(e.target.value)} 
                required 
              />
              <button type="submit">Ajouter Personnage</button>
            </form>
          </header>
          <section className="App-content">
            <Canvas>
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <Cube />
              <OrbitControls enableZoom={true} />
            </Canvas>
          </section>
        </>
      ) : (
        <header className="App-header">
          <h1>Connexion</h1>
          <form onSubmit={handleLogin}>
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Mot de passe" 
              value={motDePasse} 
              onChange={(e) => setMotDePasse(e.target.value)} 
              required 
            />
            <button type="submit">Se connecter</button>
          </form>
        </header>
      )}
    </div>
  );
}

export default App;
