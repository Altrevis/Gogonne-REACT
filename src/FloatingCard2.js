// Importation des modules nécessaires depuis React
import React, { useState, useEffect } from 'react';
import './FloatingCard.css';

const FloatingCard2 = () => {
  // Déclaration des états : un pour l'offset de l'animation et un autre pour la position de la souris
  const [offset, setOffset] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 1 });

  // Hook useEffect pour l'animation de flottement
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

  // Fonction pour gérer le déplacement de la souris sur la carte
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect(); // Obtenir les dimensions de l'élément
    // Calculer la position relative de la souris par rapport à l'élément
    const x = (e.clientX - rect.left) / rect.width - 0.1; 
    const y = (e.clientY - rect.top) / rect.height - 1.5;
    setMousePosition({ x, y }); // Mettre à jour la position de la souris
  };

  // Réinitialiser la position de la souris lorsque celle-ci quitte la carte
  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 1 });
  };

  return (
    <div className="floating-card-container" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div 
        className="card"
        style={{
          transform: `
            translateY(${offset}px) // Flottement vertical
            rotateX(${15 - mousePosition.y * 20}deg) // Rotation horizontale en fonction de Y
            rotateY(${-15 + mousePosition.x * 20}deg) // Rotation verticale en fonction de X
            perspective(1000px) // Perspective pour un effet 3D
          `,
          transformStyle: 'preserve-3d' // Préserver la 3D pour l'élément
        }}
      >
        {/* Arrière-plan de la carte */}
        <div className="card-background" />
        {/* Contenu de la carte */}
        <div className="card-content">
          <div className="left-column">
            <h2 className="text-2xl font-bold text-blue-800">Titre Principal</h2>
            <p className="text-lg text-blue-600">Description détaillée du contenu...</p>
            <p className="text-sm text-blue-500">Informations complémentaires...</p>
          </div>
          <div className="right-column">
            <img src="/api/placeholder/400/320" alt="placeholder" /> {/* Image de l'élément */}
          </div>
        </div>
        {/* Réflexion sur la carte lorsqu'elle est survolée */}
        <div className="card-hover-reflection" />
      </div>
    </div>
  );
};

export default FloatingCard2;