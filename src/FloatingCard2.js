import React, { useState, useEffect } from 'react';
import './FloatingCard.css';

const FloatingCard2 = () => {
  // Déclare les états pour le décalage de la carte et la position de la souris
  const [offset, setOffset] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 1 });

  useEffect(() => {
    // Initialisation du temps de départ pour l'animation
    let startTime = Date.now();
    let animationFrameId;

    // Fonction d'animation pour le mouvement de la carte
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000; // Temps écoulé en secondes
      const newOffset = Math.sin(elapsed * 2) * 8; // Calcul de l'offset sinusoïdal
      setOffset(newOffset); // Mise à jour de l'offset
      animationFrameId = requestAnimationFrame(animate); // Appel récursif de l'animation
    };

    animate(); // Démarre l'animation

    // Cleanup pour annuler l'animation lorsque le composant est démonté
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []); // Effet exécuté une seule fois lors du montage du composant

  // Gère le mouvement de la souris pour ajuster la position de la carte
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect(); // Récupère les coordonnées du conteneur
    const x = (e.clientX - rect.left) / rect.width - 0.1; // Position horizontale de la souris
    const y = (e.clientY - rect.top) / rect.height - 1.5; // Position verticale de la souris
    setMousePosition({ x, y }); // Mise à jour de la position de la souris
  };

  // Réinitialise la position de la souris lorsque la souris quitte la carte
  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 1 }); // Réinitialisation de la position de la souris
  };

  return (
    <div className="floating-card-container" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div 
        className="card"
        style={{
          transform: `
            translateY(${offset}px)  /* Déplacement vertical de la carte */
            rotateX(${15 - mousePosition.y * 20}deg)  /* Rotation sur l'axe X basée sur la position de la souris */
            rotateY(${-15 + mousePosition.x * 20}deg)  /* Rotation sur l'axe Y basée sur la position de la souris */
            perspective(1000px)  /* Applique la perspective 3D */
          `,
          transformStyle: 'preserve-3d' // Préserve les transformations 3D
        }}
      >
        <div className="card-background" />
        <div className="card-content">
          <div className="left-column">
            <h2 className="text-2xl font-bold text-blue-800">Titre Principal</h2>
            <p className="text-lg text-blue-600">Description détaillée du contenu...</p>
            <p className="text-sm text-blue-500">Informations complémentaires...</p>
          </div>
          <div className="right-column">
            <img src="/api/placeholder/400/320" alt="placeholder" />
          </div>
        </div>
        <div className="card-hover-reflection" />
      </div>
    </div>
  );
};

export default FloatingCard2;  // Export du composant pour l'utiliser ailleurs
