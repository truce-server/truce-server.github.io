import React, { useEffect } from 'react';
import { Box, Text } from '@mantine/core';

function SongOfLifeTransition({ onTransitionComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onTransitionComplete) {
        onTransitionComplete();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [onTransitionComplete]);

  return (
    <Box
      style={{
        height: '100vh',
        width: '100%',
        backgroundColor: '#331E3C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: '16px',
          padding: '5vh 3vw',
          opacity: 0.4,
          zIndex: 1
        }}
      >
        {Array.from({ length: 48 }).map((_, index) => (
          <Box
            key={index}
            style={{
              width: '30px',
              height: '100%',
              backgroundImage: 'linear-gradient(180deg, rgba(247, 238, 252, 0.95) 0%, rgba(220, 190, 232, 0.75) 35%, rgba(170, 125, 195, 0.55) 65%, rgba(110, 75, 145, 0.4) 100%)',
              borderRadius: '16px',
              boxShadow: '0 0 30px rgba(134, 98, 147, 0.4)',
              transformOrigin: 'bottom',
              animation: `equalizerPulse ${0.7 + index * 0.03}s ease-in-out infinite`,
              animationDelay: `${index * 0.05}s`,
              opacity: 0.3 + (index % 8) * 0.07
            }}
          />
        ))}
      </Box>

      <Box style={{ textAlign: 'center', animation: 'screen-shake 0.6s ease-in-out infinite', zIndex: 2 }}>
        <Text
          style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#f3e9f7',
            letterSpacing: '2px',
            fontFamily: 'gg sans, system-ui, sans-serif',
            textTransform: 'uppercase'
          }}
        >
          Truce: Song of Life
        </Text>
      </Box>

      <style>{`
        @keyframes equalizerPulse {
          0% {
            transform: scaleY(0.35);
            opacity: 0.7;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
          100% {
            transform: scaleY(0.5);
            opacity: 0.8;
          }
        }

        @keyframes screen-shake {
          0% {
            transform: translate(0, 0);
          }
          20% {
            transform: translate(-1px, 1px);
          }
          40% {
            transform: translate(1px, -1px);
          }
          60% {
            transform: translate(-1px, -0.5px);
          }
          80% {
            transform: translate(1px, 0.5px);
          }
          100% {
            transform: translate(0, 0);
          }
        }
      `}</style>
    </Box>
  );
}

export default SongOfLifeTransition;
