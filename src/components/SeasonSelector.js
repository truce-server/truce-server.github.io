import React from 'react';
import { Box, Container, Group, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

function SeasonSelector({ onSelectSeason }) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [season2Particles, setSeason2Particles] = React.useState([]);

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
          animation: 'float 6s ease-in-out infinite, driftA 28s ease-in-out infinite'
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
          animation: 'float 8s ease-in-out infinite reverse, driftB 32s ease-in-out infinite'
        }}
      />
      <Box
        style={{
          position: 'absolute',
          width: '160px',
          height: '160px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.07) 0%, transparent 70%)',
          borderRadius: '50%',
          top: '22%',
          left: '18%',
          animation: 'float 7s ease-in-out infinite, driftC 30s ease-in-out infinite'
        }}
      />
      <Box
        style={{
          position: 'absolute',
          width: '220px',
          height: '220px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          top: '55%',
          right: '12%',
          animation: 'float 9s ease-in-out infinite reverse, driftD 26s ease-in-out infinite'
        }}
      />
      <Box
        style={{
          position: 'absolute',
          width: '140px',
          height: '140px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          bottom: '25%',
          right: '30%',
          animation: 'float 6.5s ease-in-out infinite, driftE 29s ease-in-out infinite'
        }}
      />
      <Box
        style={{
          position: 'absolute',
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          bottom: '8%',
          left: '35%',
          animation: 'float 10s ease-in-out infinite reverse, driftF 34s ease-in-out infinite'
        }}
      />

      {/* Main content */}
      <Container size="lg" style={{ textAlign: 'center', position: 'relative', zIndex: 5 }}>
        <Box
          style={{
            fontSize: '72px',
            fontWeight: 700,
            color: '#d4af37',
            marginBottom: '15px',
            letterSpacing: '3px',
            fontFamily: 'Georgia, serif',
            textShadow: '0 0 30px rgba(212, 175, 55, 0.4), 0 2px 10px rgba(0, 0, 0, 0.5)',
            lineHeight: 1.2
          }}
        >
          Truce: Chatlog Archives
        </Box>

        <Box
          style={{
            fontSize: '20px',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.85)',
            marginBottom: '60px',
            letterSpacing: '2px',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            textTransform: 'uppercase'
          }}
        >
          Choose Your Season
        </Box>

        {/* Season cards container - side by side */}
        <Group justify="center" gap="60px" style={{ marginBottom: '60px' }}>
          {/* Season 1 */}
          <Box style={{ textAlign: 'center', position: 'relative' }}>
            <Box
              component="img"
              src="/Season1.png"
              alt="Season 1"
              onClick={() => onSelectSeason('season1')}
              className="season-1-image"
              style={{
                height: '250px',
                width: 'auto',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                filter: 'drop-shadow(0 8px 20px rgba(212, 175, 55, 0.3))',
                marginBottom: '15px'
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



            <Box
              style={{
                fontSize: '24px',
                fontWeight: 600,
                color: '#d4af37',
                letterSpacing: '2px',
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                textTransform: 'uppercase'
              }}
            >
              Season One
            </Box>
          </Box>

          {/* Season 2 */}
          <Box style={{ textAlign: 'center', position: 'relative', overflow: 'visible' }}>
            <Box
              component="img"
              src="/Season2.png"
              alt="Season 2"
              onClick={() => onSelectSeason('season2')}
              className="season-2-image"
              style={{
                height: '250px',
                width: 'auto',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                filter: 'drop-shadow(0 8px 20px rgba(212, 175, 55, 0.3))',
                marginBottom: '15px',
                display: 'block',
                position: 'relative',
                zIndex: 2
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.filter = 'drop-shadow(0 0 40px rgba(255, 255, 255, 1)), drop-shadow(0 0 80px rgba(150, 200, 240, 0.8)), drop-shadow(0 8px 20px rgba(212, 175, 55, 0.3))';
                e.currentTarget.parentElement.parentElement.classList.add('season-2-hover');
                
                // Create snow particles
                const particles = [];
                for (let i = 0; i < 12; i++) {
                  const angle = (i / 12) * Math.PI * 2;
                  particles.push({
                    id: i,
                    angle,
                    delay: i * 0.2
                  });
                }
                setSeason2Particles(particles);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.filter = 'drop-shadow(0 8px 20px rgba(212, 175, 55, 0.3))';
                e.currentTarget.parentElement.parentElement.classList.remove('season-2-hover');
                setSeason2Particles([]);
              }}
            />

            {/* Snow particles container */}
            <Box style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0 }}>
              {season2Particles.map((particle) => {
                // Start particles at the edge of image (Season 2 image is ~250px, so edge is ~135px)
                const edgeDistance = 135;
                const startX = Math.cos(particle.angle) * edgeDistance;
                const startY = Math.sin(particle.angle) * edgeDistance;
                
                return (
                  <Box
                    key={particle.id}
                    style={{
                      position: 'absolute',
                      top: startY,
                      left: startX,
                      width: '8px',
                      height: '8px',
                      background: 'radial-gradient(circle, rgba(200, 230, 245, 0.9) 0%, rgba(150, 200, 240, 0.4) 100%)',
                      borderRadius: '50%',
                      boxShadow: '0 0 8px rgba(200, 230, 245, 0.8)',
                      zIndex: 3,
                      pointerEvents: 'none',
                      marginTop: '-4px',
                      marginLeft: '-4px',
                      animation: `snowParticle${particle.id} 0.8s ease-out infinite`,
                      animationDelay: `${particle.delay}s`
                    }}
                  />
                );
              })}
            </Box>

            {/* Generate inline keyframes for each particle */}
            {season2Particles.length > 0 && (
              <style>{season2Particles.map((particle) => {
                const edgeDistance = 135;
                const startX = Math.cos(particle.angle) * edgeDistance;
                const startY = Math.sin(particle.angle) * edgeDistance;
                const endX = Math.cos(particle.angle) * 320;
                const endY = Math.sin(particle.angle) * 320;
                const tx = endX - startX;
                const ty = endY - startY;
                return `
                  @keyframes snowParticle${particle.id} {
                    0% {
                      opacity: 0.9;
                      transform: translate(0, 0) scale(1);
                    }
                    100% {
                      opacity: 0;
                      transform: translate(${tx}px, ${ty}px) scale(0.3);
                    }
                  }
                `;
              }).join('')}</style>
            )}

            <Box
              style={{
                fontSize: '24px',
                fontWeight: 600,
                color: '#a8d4f0',
                letterSpacing: '2px',
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                textTransform: 'uppercase'
              }}
            >
              Season Two
            </Box>
          </Box>
        </Group>

        <style>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) translateX(0px);
            }
            50% {
              transform: translateY(-30px) translateX(10px);
            }
          }

          @keyframes driftA {
            0% { transform: translate(0, 0); }
            50% { transform: translate(-140px, 80px); }
            100% { transform: translate(0, 0); }
          }

          @keyframes driftB {
            0% { transform: translate(0, 0); }
            50% { transform: translate(150px, -90px); }
            100% { transform: translate(0, 0); }
          }

          @keyframes driftC {
            0% { transform: translate(0, 0); }
            50% { transform: translate(120px, 120px); }
            100% { transform: translate(0, 0); }
          }

          @keyframes driftD {
            0% { transform: translate(0, 0); }
            50% { transform: translate(-130px, -80px); }
            100% { transform: translate(0, 0); }
          }

          @keyframes driftE {
            0% { transform: translate(0, 0); }
            50% { transform: translate(110px, -120px); }
            100% { transform: translate(0, 0); }
          }

          @keyframes driftF {
            0% { transform: translate(0, 0); }
            50% { transform: translate(-120px, 110px); }
            100% { transform: translate(0, 0); }
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }

          @keyframes starEmit {
            0% {
              opacity: 0;
              transform: translate(0, 0) scale(0.3);
            }
            50% {
              opacity: 1;
            }
            100% {
              opacity: 0;
              transform: translate(var(--tx), var(--ty)) scale(0);
            }
          }

          @keyframes snowEmit {
            0% {
              opacity: 0.8;
              transform: translate(0, 0) scale(0.5);
            }
            100% {
              opacity: 0;
              transform: translate(var(--tx), var(--ty)) scale(0);
            }
          }

          @keyframes snowEmitParticle {
            0% {
              opacity: 0.9;
              transform: translate(0, 0) scale(1);
            }
            100% {
              opacity: 0;
              transform: translate(var(--tx), var(--ty)) scale(0.3);
            }
          }

          .season-1-hover {
            position: relative;
          }

          .season-2-hover {
            position: relative;
          }
        `}</style>
      </Container>

      {/* Footer credit - bottom of screen */}
      <Box
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.5)',
          fontFamily: 'Georgia, serif',
          letterSpacing: '0.5px'
        }}
      >
        Built and Managed by SJferno
      </Box>
    </Box>
  );
}

export default SeasonSelector;
