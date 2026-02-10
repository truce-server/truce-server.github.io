import React from 'react';
import { Box, Container, Group, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

function SeasonSelector({ onSelectSeason }) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Box
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(135deg, #0a1f3f 0%, #1e3a5f 50%, #2a5a8f 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Theme toggle - top right */}
      <Box
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 10
        }}
      >
        <ActionIcon
          onClick={toggleColorScheme}
          size="lg"
          variant="default"
          aria-label="Toggle theme"
        >
          {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoonStars size={18} />}
        </ActionIcon>
      </Box>

      {/* Animated background elements */}
      <Box
        style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          top: '10%',
          right: '10%',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      <Box
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          bottom: '15%',
          left: '5%',
          animation: 'float 8s ease-in-out infinite reverse'
        }}
      />

      {/* Main content */}
      <Container size="sm" style={{ textAlign: 'center', position: 'relative', zIndex: 5 }}>
        <Box
          component="img"
          src="/TruceLogo.png"
          alt="Truce Logo"
          style={{
            height: '120px',
            width: 'auto',
            marginBottom: '40px',
            animation: 'pulse 2s ease-in-out infinite'
          }}
        />

        {/* Season selector with click animation */}
        <Box
          component="img"
          src="/Season1.png"
          alt="Season 1"
          onClick={() => onSelectSeason('season1')}
          style={{
            height: '300px',
            width: 'auto',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            filter: 'drop-shadow(0 8px 20px rgba(212, 175, 55, 0.3))',
            marginBottom: '30px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.filter = 'drop-shadow(0 12px 30px rgba(212, 175, 55, 0.5))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.filter = 'drop-shadow(0 8px 20px rgba(212, 175, 55, 0.3))';
          }}
        />

        <style>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) translateX(0px);
            }
            50% {
              transform: translateY(-30px) translateX(10px);
            }
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }
        `}</style>
      </Container>
    </Box>
  );
}

export default SeasonSelector;
