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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/personnages', {
        nom,
        prenom,
      });
      console.log('Personnage ajouté avec succès :', response.data);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du personnage:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>3D Cube Showcase</h1>
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
    </div>
  );
}

export default App;
