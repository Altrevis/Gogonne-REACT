import React, { useState, useEffect } from 'react';
import './FloatingCard.css';  // Assurez-vous d'importer votre fichier CSS

const FloatingCard = () => {
  const [offset, setOffset] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 1 });

  // Animation de flottement
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

  // Gestion du parallaxe
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.1;
    const y = (e.clientY - rect.top) / rect.height - 1.5;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 1 });
  };

  return (
    <div className="floating-card-container" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div 
        className="card"
        style={{
          transform: `
            translateY(${offset}px)
            rotateX(${15 - mousePosition.y * 20}deg)
            rotateY(${-15 + mousePosition.x * 20}deg)
            perspective(1000px)
          `,
          transformStyle: 'preserve-3d'
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

export default FloatingCard;
