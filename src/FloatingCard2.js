// Importation des modules nécessaires depuis React
import React, { useState, useEffect } from 'react';
import './FloatingCard.css';

const FloatingCard2 = () => {
  const [personnages, setPersonnages] = useState([]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let startTime = Date.now();
    let animationFrameId;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000;
      const newOffset = Math.sin(elapsed * 2) * 8;
      setOffset(newOffset);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  useEffect(() => {
    fetch('http://localhost:3000/api/personnages')
      .then((response) => response.json())
      .then((data) => setPersonnages(data))
      .catch((error) => console.error('Erreur :', error));
  }, []);

  return (
    <div className="cards-container">
      {personnages.map((personnage, index) => (
        <div
          key={index}
          className="floating-card"
          style={{ transform: `translateY(${offset}px)` }}
        >
          <h3>{personnage.nom} {personnage.prenom}</h3>
          <p><strong>Race:</strong> {personnage.race}</p>
          <p><strong>Classe:</strong> {personnage.classe}</p>
          <p><strong>Date de création:</strong> {personnage.date_du_perso}</p>
          <p><strong>Rang:</strong> {personnage.rang}</p>
          <p><strong>Divinité:</strong> {personnage.divinitée}</p>
        </div>
      ))}
    </div>
  );
};

export default FloatingCard2;