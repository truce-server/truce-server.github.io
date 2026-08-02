import React, { useEffect, useMemo, useState } from 'react';
import { Box, Text } from '@mantine/core';

function Season3BeyondVeilTransition({ onTransitionComplete }) {
  const [phase, setPhase] = useState('chase');

  useEffect(() => {
    const chaseTimer = setTimeout(() => {
      setPhase('bite');
    }, 1150);

    return () => clearTimeout(chaseTimer);
  }, []);

  useEffect(() => {
    if (phase === 'bite') {
      const vanishTimer = setTimeout(() => {
        setPhase('fade');
      }, 850);

      return () => clearTimeout(vanishTimer);
    }

    if (phase === 'fade') {
      const completeTimer = setTimeout(() => {
        onTransitionComplete();
      }, 550);

      return () => clearTimeout(completeTimer);
    }

    return undefined;
  }, [phase, onTransitionComplete]);

  const stars = useMemo(() => (
    Array.from({ length: 18 }, (_, index) => ({
      id: index,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 1.5,
      size: 1 + Math.random() * 2
    }))
  ), []);

  return (
    <Box
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        overflow: 'hidden',
        background: 'radial-gradient(circle at center, rgba(18, 34, 60, 0.95) 0%, rgba(7, 10, 20, 1) 70%)'
      }}
    >
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(126, 240, 201, 0.08) 0%, transparent 35%, rgba(255, 214, 102, 0.05) 100%)',
          opacity: phase === 'fade' ? 0.4 : 1,
          transition: 'opacity 500ms ease'
        }}
      />

      {stars.map((star) => (
        <Box
          key={star.id}
          style={{
            position: 'absolute',
            width: `${star.size}px`,
            height: `${star.size}px`,
            borderRadius: '50%',
            left: `${star.left}%`,
            top: `${star.top}%`,
            background: 'rgba(235, 246, 255, 0.85)',
            boxShadow: '0 0 10px rgba(126, 240, 201, 0.35)',
            opacity: 0.35,
            animation: `twinkle3 ${2.8 + (star.id % 5) * 0.35}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}

      <Box
        style={{
          position: 'absolute',
          left: '8%',
          top: '50%',
          width: '96px',
          height: '96px',
          transform: 'translateY(-50%)',
          animation: phase === 'fade' ? 'none' : 'pacmanRun 2.0s cubic-bezier(0.42, 0, 0.18, 1) infinite'
        }}
      >
        <Box
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ffe86a 0%, #f7c52e 52%, #d89c00 100%)',
            boxShadow: '0 0 28px rgba(255, 220, 100, 0.7), 0 0 60px rgba(255, 220, 100, 0.25)'
          }}
        />
        <Box
          style={{
            position: 'absolute',
            right: '-4px',
            top: '50%',
            width: '58px',
            height: '58px',
            transform: 'translateY(-50%) rotate(-18deg)',
            background: 'radial-gradient(circle at 20% 50%, rgba(7, 10, 20, 1) 0 51%, rgba(7, 10, 20, 0) 52%)',
            clipPath: phase === 'bite' ? 'polygon(8% 10%, 100% 50%, 8% 90%)' : 'polygon(10% 22%, 100% 50%, 10% 78%)',
            animation: phase === 'fade' ? 'none' : 'mouthChomp 0.28s ease-in-out infinite'
          }}
        />
        <Box
          style={{
            position: 'absolute',
            top: '28px',
            left: '36px',
            width: '9px',
            height: '9px',
            borderRadius: '50%',
            background: '#09111d',
            opacity: 0.7
          }}
        />
      </Box>

      <Box
        style={{
          position: 'absolute',
          left: phase === 'bite' ? '56%' : '64%',
          top: '50%',
          width: '92px',
          height: '96px',
          transform: 'translateY(-50%)',
          opacity: phase === 'fade' ? 0 : phase === 'bite' ? 0.1 : 1,
          transition: 'left 900ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 400ms ease, transform 400ms ease',
          animation: phase === 'fade' ? 'none' : phase === 'bite' ? 'ghostCrunch 0.9s ease-in forwards' : 'ghostFloat 1.2s ease-in-out infinite'
        }}
      >
        <Box
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '40% 40% 18% 18%',
            background: 'linear-gradient(180deg, #f1d8ff 0%, #b06ae6 72%, #6b2f93 100%)',
            boxShadow: '0 0 18px rgba(176, 106, 230, 0.55), 0 0 50px rgba(126, 240, 201, 0.15)'
          }}
        />
        <Box
          style={{
            position: 'absolute',
            top: '14px',
            left: '22px',
            width: '18px',
            height: '22px',
            borderRadius: '50% 50% 45% 45%',
            background: '#f8fbff',
            boxShadow: '16px 0 0 0 #f8fbff'
          }}
        />
        <Box
          style={{
            position: 'absolute',
            left: '22px',
            bottom: '-1px',
            width: '12px',
            height: '16px',
            background: 'rgba(176, 106, 230, 1)',
            boxShadow: '20px 0 0 0 rgba(176, 106, 230, 1), 40px 0 0 0 rgba(176, 106, 230, 1), 60px 0 0 0 rgba(176, 106, 230, 1)',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 55%, 0 100%)'
          }}
        />
      </Box>

      <Box
        style={{
          position: 'absolute',
          left: '50%',
          top: '22%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: phase === 'fade' ? 0 : 1,
          transition: 'opacity 400ms ease'
        }}
      >
        <Text
          size="42px"
          fw={700}
          style={{
            letterSpacing: '2px',
            color: '#e8fff8',
            textShadow: '0 0 10px rgba(126, 240, 201, 0.9), 0 0 26px rgba(126, 240, 201, 0.7), 0 0 54px rgba(126, 240, 201, 0.45), 0 0 84px rgba(102, 227, 255, 0.28)',
            animation: phase === 'fade' ? 'none' : 'titleGlowPulse 1.8s ease-in-out infinite'
          }}
        >
          Truce: Beyond the Veil
        </Text>
        <Text
          size="md"
          mt="xs"
          style={{
            color: '#bff8ec',
            letterSpacing: '1px',
            textShadow: '0 0 8px rgba(126, 240, 201, 0.65), 0 0 20px rgba(126, 240, 201, 0.35)',
            animation: phase === 'fade' ? 'none' : 'subtitleGlowPulse 2.2s ease-in-out infinite'
          }}
        >
          Something is slipping through.
        </Text>
      </Box>

      <Box
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(7, 10, 20, 1)',
          opacity: phase === 'fade' ? 0.92 : 0,
          transition: 'opacity 550ms ease',
          pointerEvents: 'none'
        }}
      />

      <style>{`
        @keyframes pacmanRun {
          0% {
            transform: translate3d(0, -50%, 0);
          }
          38% {
            transform: translate3d(38vw, -50%, 0);
          }
          64% {
            transform: translate3d(58vw, -50%, 0);
          }
          100% {
            transform: translate3d(74vw, -50%, 0);
          }
        }

        @keyframes mouthChomp {
          0%, 100% {
            transform: translateY(-50%) rotate(-18deg) scaleY(1);
          }
          50% {
            transform: translateY(-50%) rotate(-18deg) scaleY(0.88);
          }
        }

        @keyframes ghostFloat {
          0%, 100% {
            transform: translateY(-50%) translateX(0);
          }
          50% {
            transform: translateY(-50%) translateX(6px);
          }
        }

        @keyframes ghostCrunch {
          0% {
            transform: translateY(-50%) scale(1);
            filter: blur(0);
          }
          55% {
            transform: translateY(-50%) scale(0.8);
            filter: blur(0.4px);
          }
          100% {
            transform: translateY(-50%) scale(0.05);
            opacity: 0;
            filter: blur(1.2px);
          }
        }

        @keyframes twinkle3 {
          0%, 100% {
            opacity: 0.18;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes titleGlowPulse {
          0%, 100% {
            opacity: 0.95;
            filter: drop-shadow(0 0 0 rgba(126, 240, 201, 0));
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 16px rgba(126, 240, 201, 0.55));
            transform: translateY(-0.5px);
          }
        }

        @keyframes subtitleGlowPulse {
          0%, 100% {
            opacity: 0.82;
            filter: drop-shadow(0 0 0 rgba(126, 240, 201, 0));
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 12px rgba(126, 240, 201, 0.4));
          }
        }
      `}</style>
    </Box>
  );
}

export default Season3BeyondVeilTransition;