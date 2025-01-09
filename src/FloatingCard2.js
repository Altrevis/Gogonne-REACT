// Importation des modules nécessaires depuis React
import React, { useState, useEffect } from 'react';
import './FloatingCard.css';

const FloatingCard2 = () => {
  // Déclaration des états : un pour les personnages et un pour le décalage (offset) de l'animation
  const [personnages, setPersonnages] = useState([]);
  const [offset, setOffset] = useState(0);

  // Hook useEffect pour créer l'animation de flottement
  useEffect(() => {
    // Initialiser l'heure de départ
    let startTime = Date.now();
    let animationFrameId;

    // Fonction d'animation qui modifie l'offset pour créer un effet de flottement
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000; // Temps écoulé en secondes
      const newOffset = Math.sin(elapsed * 2) * 8; // Appliquer un mouvement sinusoïdal
      setOffset(newOffset); // Mettre à jour l'offset avec la nouvelle valeur
      animationFrameId = requestAnimationFrame(animate); // Appeler animate de manière récursive pour continuer l'animation
    };

    animate(); // Démarrer l'animation

    // Nettoyage de l'animation lorsque le composant est démonté
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId); // Annuler l'animation pour éviter les fuites de mémoire
      }
    };
  }, []); // Le tableau vide [] garantit que ce hook ne sera exécuté qu'une seule fois lors du montage du composant

  // Hook useEffect pour récupérer les données des personnages depuis l'API
  useEffect(() => {
    // Effectuer la requête fetch pour récupérer les personnages
    fetch('http://localhost:3000/api/personnages')
      .then((response) => response.json()) // Convertir la réponse en format JSON
      .then((data) => setPersonnages(data)) // Mettre à jour l'état des personnages avec les données récupérées
      .catch((error) => console.error('Erreur :', error)); // Gérer les erreurs éventuelles
  }, []); // Le tableau vide [] garantit que cette requête sera effectuée une seule fois lors du montage du composant

  return (
    <div className="cards-container">
      {/* Afficher chaque personnage dans une carte flottante */}
      {personnages.map((personnage, index) => (
        <div
          key={index} // Utilisation de l'index comme clé unique
          className="floating-card"
          style={{ transform: `translateY(${offset}px)` }} // Appliquer l'offset comme transformation pour le flottement
        >
          {/* Affichage des informations du personnage */}
          <h3>{personnage.nom} {personnage.prenom}</h3>
          <p><strong>Race:</strong> {personnage.race}</p>
          <p><strong>Classe:</strong> {personnage.classe}</p>
          <p><strong>Date de création:</strong> {personnage.date_du_perso}</p>
          <p><strong>Rang:</strong> {personnage.rang}</p>
          <p><strong>Divinité:</strong> {personnage.divitée}</p>
          <p><strong>Email:</strong> {personnage.email}</p>
        </div>
      ))}
    </div>
  );
};

export default FloatingCard2;