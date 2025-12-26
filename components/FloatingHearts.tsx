
import React, { useEffect, useState } from 'react';

const FloatingHearts: React.FC = () => {
  const [elements, setElements] = useState<{ id: number; left: number; duration: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    // Reduced count on mobile for a cleaner, more efficient feel
    const count = window.innerWidth < 768 ? 12 : 25;
    const newElements = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 15 + Math.random() * 20,
      size: window.innerWidth < 768 ? (8 + Math.random() * 12) : (10 + Math.random() * 20),
      delay: Math.random() * 20, // Increased delay range for better staggered start
    }));
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute bottom-[-50px] text-pink-200/30 animate-float-up"
          style={{
            left: `${el.left}%`,
            fontSize: `${el.size}px`,
            animationDuration: `${el.duration}s`,
            animationDelay: `-${el.delay}s`,
          }}
        >
          {el.id % 2 === 0 ? '💗' : '✨'}
        </div>
      ))}
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
        }
        .animate-float-up {
          animation: float-up linear infinite;
        }
      `}</style>
    </div>
  );
};

export default FloatingHearts;
