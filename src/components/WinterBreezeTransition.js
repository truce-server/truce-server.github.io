import React, { useState, useEffect } from 'react';
import { Box } from '@mantine/core';

function WinterBreezeTransition({ onTransitionComplete }) {
  const [phase, setPhase] = useState('breeze'); // 'breeze', 'snowfall', 'fade'

  useEffect(() => {
    // Breeze phase for 1s
    const breezeTimer = setTimeout(() => {
      setPhase('snowfall');
    }, 1000);

    return () => clearTimeout(breezeTimer);
  }, []);

  useEffect(() => {
    if (phase === 'snowfall') {
      // Snowfall phase for 0.8s
      const snowTimer = setTimeout(() => {
        setPhase('fade');
      }, 800);

      return () => clearTimeout(snowTimer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'fade') {
      // Final fade out
      const fadeTimer = setTimeout(() => {
        onTransitionComplete();
      }, 600);

      return () => clearTimeout(fadeTimer);
    }
  }, [phase, onTransitionComplete]);

  // Generate snowflakes
  const snowflakes = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1
  }));

  return (
    <Box
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#0a1f3f',
        zIndex: 1000
      }}
    >
      {/* Cold mist/breeze effect */}
      <Box
        style={{
          position: 'absolute',
          width: '200%',
          height: '100%',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(100, 180, 220, 0.3) 0%, transparent 70%)',
          opacity: phase === 'breeze' ? 1 : 0,
          transition: 'opacity 0.6s ease-in-out',
          animation: phase === 'breeze' ? 'windBlast 1.2s ease-out forwards' : 'none',
          zIndex: 5
        }}
      />

      {/* Icy blue light effect */}
      <Box
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: phase === 'breeze' 
            ? 'radial-gradient(circle, rgba(100, 180, 220, 0.5) 0%, rgba(100, 180, 220, 0.2) 40%, transparent 100%)'
            : phase === 'snowfall'
            ? 'radial-gradient(circle, rgba(150, 200, 240, 0.3) 0%, rgba(100, 180, 220, 0.1) 50%, transparent 100%)'
            : 'radial-gradient(circle, rgba(150, 200, 240, 0) 0%, transparent 100%)',
          filter: 'blur(50px)',
          opacity: phase === 'breeze' || phase === 'snowfall' ? 1 : 0,
          transition: 'opacity 0.6s ease-in-out, background 0.8s ease-in-out',
          boxShadow: phase !== 'fade' ? '0 0 150px 100px rgba(100, 180, 220, 0.3)' : 'none',
          zIndex: 6
        }}
      />

      {/* Snowflakes */}
      {snowflakes.map((snowflake) => (
        <Box
          key={snowflake.id}
          style={{
            position: 'absolute',
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            background: '#ffffff',
            left: `${snowflake.left}%`,
            top: '-10px',
            opacity: phase === 'snowfall' || phase === 'fade' ? 0.8 : 0,
            boxShadow: '0 0 3px 1px rgba(255, 255, 255, 0.6)',
            animation: phase === 'snowfall' || phase === 'fade' 
              ? `snowFall ${snowflake.duration}s linear ${snowflake.delay}s forwards`
              : 'none',
            zIndex: 7
          }}
        />
      ))}

      {/* Text that appears */}
      <Box
        style={{
          position: 'absolute',
          fontSize: '48px',
          fontWeight: 700,
          color: '#c8e6f5',
          textShadow: '0 0 30px rgba(100, 180, 220, 0.8), 0 0 60px rgba(150, 200, 240, 0.5)',
          opacity: phase === 'snowfall' || phase === 'breeze' ? 1 : 0,
          transition: 'opacity 0.6s ease-in-out',
          zIndex: 8,
          letterSpacing: '2px',
          fontFamily: 'gg sans, system-ui, sans-serif'
        }}
      >
        Truce: Rite of Apothea
      </Box>

      {/* Subtitle - Season 2 */}
      <Box
        style={{
          position: 'absolute',
          fontSize: '28px',
          fontWeight: 500,
          color: '#a8d4f0',
          textShadow: '0 0 20px rgba(100, 180, 220, 0.6), 0 0 40px rgba(150, 200, 240, 0.3)',
          opacity: phase === 'snowfall' || phase === 'breeze' ? 1 : 0,
          transition: 'opacity 0.6s ease-in-out 0.3s',
          zIndex: 8,
          letterSpacing: '1px',
          fontFamily: 'gg sans, system-ui, sans-serif',
          marginTop: '80px'
        }}
      >
        Season 2
      </Box>

      {/* Final fade overlay */}
      <Box
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'rgba(10, 31, 63, 0.6)',
          opacity: phase === 'fade' ? 1 : 0,
          transition: 'opacity 0.6s ease-in-out',
          zIndex: 9
        }}
      />

      <style>{`
        @keyframes windBlast {
          0% {
            transform: translateX(-50%) scaleX(1);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(50%) scaleX(1.5);
            opacity: 0;
          }
        }

        @keyframes snowFall {
          0% {
            transform: translateY(-100vh) translateX(0px);
            opacity: 0.8;
          }
          100% {
            transform: translateY(100vh) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
          }
        }
      `}</style>
    </Box>
  );
}

export default WinterBreezeTransition;
