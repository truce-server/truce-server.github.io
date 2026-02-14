import React, { useState, useEffect } from 'react';
import { Box } from '@mantine/core';

function GateOfHeavenTransition({ onTransitionComplete }) {
  const [phase, setPhase] = useState('gates'); // 'gates', 'light', 'reveal'

  useEffect(() => {
    // Gates open for 0.7s (faster)
    const gatesTimer = setTimeout(() => {
      setPhase('light');
    }, 700);

    return () => clearTimeout(gatesTimer);
  }, []);

  useEffect(() => {
    if (phase === 'light') {
      // Light display for 0.6s (faster)
      const lightTimer = setTimeout(() => {
        setPhase('reveal');
      }, 600);

      return () => clearTimeout(lightTimer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'reveal') {
      // Fade out and complete transition (faster)
      const revealTimer = setTimeout(() => {
        onTransitionComplete();
      }, 500);

      return () => clearTimeout(revealTimer);
    }
  }, [phase, onTransitionComplete]);

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
      {/* Left gate */}
      <Box
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '50%',
          height: '100%',
          background: 'linear-gradient(90deg, #1e3a5f 0%, rgba(30, 58, 95, 0.5) 100%)',
          borderRight: '3px solid #d4af37',
          transform: phase === 'gates' ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: phase === 'gates' ? 'inset -20px 0 40px rgba(212, 175, 55, 0.2)' : 'none'
        }}
      />

      {/* Right gate */}
      <Box
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '50%',
          height: '100%',
          background: 'linear-gradient(270deg, #1e3a5f 0%, rgba(30, 58, 95, 0.5) 100%)',
          borderLeft: '3px solid #d4af37',
          transform: phase === 'gates' ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: phase === 'gates' ? 'inset 20px 0 40px rgba(212, 175, 55, 0.2)' : 'none'
        }}
      />

      {/* Bright light effect */}
      <Box
        style={{
          position: 'absolute',
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          background: phase === 'light' || phase === 'reveal' 
            ? 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.5) 30%, rgba(212, 175, 55, 0.3) 70%, transparent 100%)'
            : 'radial-gradient(circle, rgba(255, 255, 255, 0) 0%, transparent 100%)',
          filter: phase === 'light' || phase === 'reveal' ? 'blur(40px)' : 'blur(100px)',
          boxShadow: phase === 'light' || phase === 'reveal'
            ? '0 0 400px 200px rgba(255, 255, 255, 0.6), 0 0 200px 100px rgba(212, 175, 55, 0.4)'
            : 'none',
          opacity: phase === 'light' ? 1 : phase === 'reveal' ? 0.6 : 0,
          transition: 'opacity 0.8s ease-in-out, filter 0.8s ease-in-out',
          zIndex: 10
        }}
      />

      {/* Bright rays/streaks */}
      <Box
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: phase === 'light' ? 0.8 : phase === 'reveal' ? 0.4 : 0,
          transition: 'opacity 0.8s ease-in-out',
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
          zIndex: 9
        }}
      />

      {/* Text that appears with light */}
      <Box
        style={{
          position: 'absolute',
          fontSize: '48px',
          fontWeight: 700,
          color: 'white',
          textShadow: '0 0 30px rgba(212, 175, 55, 0.8), 0 0 60px rgba(255, 255, 255, 0.6)',
          opacity: phase === 'light' || phase === 'reveal' ? 1 : 0,
          transition: 'opacity 0.6s ease-in-out',
          zIndex: 11,
          letterSpacing: '2px',
          fontFamily: 'gg sans, system-ui, sans-serif'
        }}
      >
        Truce: The Apotheion
      </Box>

      {/* Subtitle - Season One */}
      <Box
        style={{
          position: 'absolute',
          fontSize: '32px',
          fontWeight: 600,
          color: '#f7e5a3',
          textShadow: '0 0 25px rgba(212, 175, 55, 0.8), 0 0 45px rgba(255, 255, 255, 0.35)',
          opacity: phase === 'light' || phase === 'reveal' ? 1 : 0,
          transition: 'opacity 0.6s ease-in-out 0.3s',
          zIndex: 11,
          letterSpacing: '1px',
          fontFamily: 'gg sans, system-ui, sans-serif',
          marginTop: '90px'
        }}
      >
        Season One
      </Box>

      {/* Final fade overlay */}
      <Box
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'rgba(10, 31, 63, 0.5)',
          opacity: phase === 'reveal' ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out',
          zIndex: 12
        }}
      />
    </Box>
  );
}

export default GateOfHeavenTransition;
