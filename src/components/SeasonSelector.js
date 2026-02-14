import React from 'react';
import { Box, Container, Group, Stack } from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

function SeasonSelector({ onSelectSeason }) {
  const [season2Particles, setSeason2Particles] = React.useState([]);
  const [musicNoteParticles, setMusicNoteParticles] = React.useState([]);
  const [scrolled, setScrolled] = React.useState(false);
  const [revealed, setRevealed] = React.useState(false);
  const scrollContainerRef = React.useRef(null);
  const songOfLifeRef = React.useRef(null);

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    setScrolled(scrollTop > 50);
    // Reset revealed state when scrolled back to top (for arrow visibility)
    if (scrollTop < 50) {
      setRevealed(false);
    }
  };

  const scrollToSongOfLife = () => {
    if (songOfLifeRef.current && scrollContainerRef.current) {
      setRevealed(true);
      setScrolled(true);
      const targetPosition = songOfLifeRef.current.offsetTop - 150;
      scrollContainerRef.current.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      setRevealed(false);
      setScrolled(false);
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY > 0 && !revealed) {
      // Scrolling down - reveal Song of Life
      scrollToSongOfLife();
    } else if (e.deltaY < 0 && revealed) {
      // Scrolling up - go back to top
      scrollToTop();
    }
  };

  return (
    <Box
      ref={scrollContainerRef}
      onScroll={handleScroll}
      onWheel={handleWheel}
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'radial-gradient(ellipse at top, #1a2f4f 0%, #0d1b2e 40%, #050a15 100%)',
        position: 'relative',
        overflowY: 'hidden',
        overflowX: 'hidden',
        scrollBehavior: 'smooth'
      }}
    >
      {/* Layered background effects */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(168, 212, 240, 0.06) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(134, 98, 147, 0.05) 0%, transparent 60%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* Animated shimmer overlay */}
      <Box
        style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          right: '-50%',
          bottom: '-50%',
          background: 'linear-gradient(45deg, transparent 30%, rgba(212, 175, 55, 0.03) 50%, transparent 70%)',
          animation: 'shimmer 15s linear infinite',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* Subtle stars - Main section */}
      {[...Array(30)].map((_, i) => {
        const size = Math.random() * 3 + 1;
        const topPos = Math.random() * 60;
        const leftPos = Math.random() * 100;
        const initialOpacity = Math.random() * 0.7 + 0.3;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 3;
        
        return (
          <Box
            key={`star-main-${i}`}
            style={{
              position: 'absolute',
              width: size + 'px',
              height: size + 'px',
              background: 'white',
              borderRadius: '50%',
              top: topPos + '%',
              left: leftPos + '%',
              opacity: initialOpacity,
              animation: `twinkle ${duration}s ease-in-out infinite`,
              animationDelay: `${delay}s`,
              boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
              zIndex: 2,
              pointerEvents: 'none'
            }}
          />
        );
      })}

      {/* Subtle stars - Song of Life section */}
      {[...Array(30)].map((_, i) => {
        const size = Math.random() * 3 + 1;
        const topPos = Math.random() * 40 + 60;
        const leftPos = Math.random() * 100;
        const initialOpacity = Math.random() * 0.7 + 0.3;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 3;
        
        return (
          <Box
            key={`star-sol-${i}`}
            style={{
              position: 'absolute',
              width: size + 'px',
              height: size + 'px',
              background: 'white',
              borderRadius: '50%',
              top: topPos + '%',
              left: leftPos + '%',
              opacity: initialOpacity,
              animation: `twinkle ${duration}s ease-in-out infinite`,
              animationDelay: `${delay}s`,
              boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
              zIndex: 2,
              pointerEvents: 'none'
            }}
          />
        );
      })}

      {/* Animated background elements - Enhanced with multi-color orbs */}
      {/* Golden orbs */}
      <Box
        style={{
          position: 'absolute',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.08) 40%, transparent 70%)',
          borderRadius: '50%',
          top: '10%',
          right: '10%',
          animation: 'float 6s ease-in-out infinite, driftA 28s ease-in-out infinite',
          filter: 'blur(40px)',
          zIndex: 2
        }}
      />
      <Box
        style={{
          position: 'absolute',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0.05) 40%, transparent 70%)',
          borderRadius: '50%',
          bottom: '15%',
          left: '5%',
          animation: 'float 8s ease-in-out infinite reverse, driftB 32s ease-in-out infinite',
          filter: 'blur(45px)',
          zIndex: 2
        }}
      />
      
      {/* Blue/Ice orbs for Season 2 theme */}
      <Box
        style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(168, 212, 240, 0.12) 0%, rgba(150, 200, 240, 0.06) 40%, transparent 70%)',
          borderRadius: '50%',
          top: '25%',
          left: '15%',
          animation: 'float 7s ease-in-out infinite, driftC 30s ease-in-out infinite',
          filter: 'blur(35px)',
          zIndex: 2
        }}
      />
      <Box
        style={{
          position: 'absolute',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(168, 212, 240, 0.1) 0%, rgba(150, 200, 240, 0.04) 40%, transparent 70%)',
          borderRadius: '50%',
          top: '60%',
          right: '18%',
          animation: 'float 9s ease-in-out infinite reverse, driftD 26s ease-in-out infinite',
          filter: 'blur(42px)',
          zIndex: 2
        }}
      />
      
      {/* Purple orbs for Song of Life theme */}
      <Box
        style={{
          position: 'absolute',
          width: '220px',
          height: '220px',
          background: 'radial-gradient(circle, rgba(134, 98, 147, 0.14) 0%, rgba(217, 193, 227, 0.06) 40%, transparent 70%)',
          borderRadius: '50%',
          bottom: '28%',
          right: '25%',
          animation: 'float 6.5s ease-in-out infinite, driftE 29s ease-in-out infinite',
          filter: 'blur(38px)',
          zIndex: 2
        }}
      />
      <Box
        style={{
          position: 'absolute',
          width: '190px',
          height: '190px',
          background: 'radial-gradient(circle, rgba(134, 98, 147, 0.11) 0%, rgba(217, 193, 227, 0.05) 40%, transparent 70%)',
          borderRadius: '50%',
          top: '45%',
          left: '8%',
          animation: 'float 10s ease-in-out infinite reverse, driftF 34s ease-in-out infinite',
          filter: 'blur(40px)',
          zIndex: 2
        }}
      />
      
      {/* Additional small accent orbs */}
      <Box
        style={{
          position: 'absolute',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 60%)',
          borderRadius: '50%',
          top: '35%',
          right: '35%',
          animation: 'float 5.5s ease-in-out infinite, driftA 24s ease-in-out infinite reverse',
          filter: 'blur(30px)',
          zIndex: 2
        }}
      />
      <Box
        style={{
          position: 'absolute',
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(168, 212, 240, 0.09) 0%, transparent 60%)',
          borderRadius: '50%',
          bottom: '38%',
          left: '40%',
          animation: 'float 7.5s ease-in-out infinite reverse, driftC 27s ease-in-out infinite',
          filter: 'blur(35px)',
          zIndex: 2
        }}
      />

      {/* Main content */}
      <Container size="lg" style={{ textAlign: 'center', position: 'relative', zIndex: 5, minHeight: '200vh', paddingTop: '10vh', paddingBottom: '30vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          style={{
            fontSize: 'clamp(34px, 6vw, 78px)',
            fontWeight: 700,
            color: '#d4af37',
            margin: '0 auto 18px',
            letterSpacing: 'clamp(1px, 0.6vw, 3px)',
            fontFamily: 'Georgia, serif',
            textShadow: '0 0 30px rgba(212, 175, 55, 0.4), 0 2px 10px rgba(0, 0, 0, 0.5)',
            lineHeight: 1.15,
            maxWidth: '900px'
          }}
        >
          Truce
          <br />
          <span style={{ display: 'block', fontSize: 'clamp(20px, 3.2vw, 44px)', letterSpacing: 'clamp(0.5px, 0.4vw, 2px)' }}>
            Chatlog Archives
          </span>
        </Box>

        <Box
          style={{
            fontSize: '20px',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.85)',
            marginBottom: 'clamp(50px, 12vw, 130px)',
            letterSpacing: '2px',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            textTransform: 'uppercase'
          }}
        >
          Choose Your Season
        </Box>

        {/* Main container - seasons on top, Song of Life below */}
        <Stack gap="60px" align="center" style={{ marginBottom: '60px' }}>
          {/* Season cards container - side by side */}
          <Group justify="center" gap="60px" style={{ marginTop: 'clamp(12px, 4vw, 32px)' }}>
            {/* Season 1 */}
            <Box style={{ textAlign: 'center', position: 'relative' }}>
            <Box
              component="img"
              src="/Season1.png"
              alt="Season 1"
              onClick={() => onSelectSeason('season1')}
              className="season-1-image"
              style={{
                width: 'clamp(220px, 40vw, 420px)',
                height: 'auto',
                maxHeight: 'clamp(140px, 24vw, 230px)',
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
                width: 'clamp(220px, 40vw, 420px)',
                height: 'auto',
                maxHeight: 'clamp(140px, 24vw, 230px)',
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

        {/* Scroll down indicator arrow */}
        <Box
          onClick={scrollToSongOfLife}
          style={{
            position: 'fixed',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            opacity: scrolled ? 0 : 1,
            transition: 'opacity 0.3s ease',
            pointerEvents: scrolled ? 'none' : 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <Box
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#d9c1e3',
              letterSpacing: '1.5px',
              fontFamily: 'Georgia, serif',
              textTransform: 'uppercase',
              textShadow: '0 0 15px rgba(217, 193, 227, 0.6)'
            }}
          >
            Scroll for More
          </Box>
          <IconChevronDown
            size={32}
            color="#d9c1e3"
            style={{
              animation: 'bounce 2s ease-in-out infinite',
              filter: 'drop-shadow(0 0 8px rgba(217, 193, 227, 0.6))'
            }}
          />
        </Box>

        {/* Scroll up indicator arrow */}
        <Box
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            opacity: scrolled ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: scrolled ? 'auto' : 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <IconChevronUp
            size={32}
            color="#d9c1e3"
            style={{
              animation: 'bounce 2s ease-in-out infinite',
              filter: 'drop-shadow(0 0 8px rgba(217, 193, 227, 0.6))'
            }}
          />
          <Box
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#d9c1e3',
              letterSpacing: '1.5px',
              fontFamily: 'Georgia, serif',
              textTransform: 'uppercase',
              textShadow: '0 0 15px rgba(217, 193, 227, 0.6)'
            }}
          >
            Back to Top
          </Box>
        </Box>

        {/* Song of Life Image - centered below seasons with extra spacing */}
        <Box 
          ref={songOfLifeRef}
          style={{ 
            textAlign: 'center', 
            position: 'relative', 
            overflow: 'visible', 
            marginTop: '400px',
            opacity: scrolled ? 1 : 0,
            transform: scrolled ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease'
          }}
        >
          <Box
            component="img"
            src="/SongOfLife.png"
            alt="Song of Life"
            style={{
              height: '250px',
              width: 'auto',
              filter: 'drop-shadow(0 4px 15px rgba(212, 175, 55, 0.3))',
              opacity: 0.95,
              animation: 'gentle-glow 4s ease-in-out infinite',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              zIndex: 2
            }}
            onClick={() => onSelectSeason('songoflife')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.filter = 'drop-shadow(0 0 30px rgba(134, 98, 147, 0.8)), drop-shadow(0 0 60px rgba(134, 98, 147, 0.5))';
              
              // Create music note particles
              const particles = [];
              for (let i = 0; i < 10; i++) {
                const angle = (i / 10) * Math.PI * 2;
                particles.push({
                  id: i,
                  angle,
                  delay: i * 0.15,
                  type: ['♪', '♫', '♩', '♬'][Math.floor(Math.random() * 4)]
                });
              }
              setMusicNoteParticles(particles);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.filter = 'drop-shadow(0 4px 15px rgba(212, 175, 55, 0.3))';
              setMusicNoteParticles([]);
            }}
          />

          <Box
            style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#d9c1e3',
              letterSpacing: '2px',
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              textTransform: 'uppercase',
              marginTop: '14px'
            }}
          >
            Song of Life
          </Box>

          {/* Music note particles container */}
          <Box style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0 }}>
            {musicNoteParticles.map((particle) => {
              const edgeDistance = 140;
              const startX = Math.cos(particle.angle) * edgeDistance;
              const startY = Math.sin(particle.angle) * edgeDistance;
              
              return (
                <Box
                  key={particle.id}
                  style={{
                    position: 'absolute',
                    top: startY,
                    left: startX,
                    fontSize: '20px',
                    color: '#866293',
                    textShadow: '0 0 8px rgba(134, 98, 147, 0.8)',
                    zIndex: 3,
                    pointerEvents: 'none',
                    animation: `musicNote${particle.id} 1.2s ease-out infinite`,
                    animationDelay: `${particle.delay}s`
                  }}
                >
                  {particle.type}
                </Box>
              );
            })}
          </Box>

          {/* Generate inline keyframes for each music note */}
          {musicNoteParticles.length > 0 && (
            <style>{musicNoteParticles.map((particle) => {
              const edgeDistance = 140;
              const startX = Math.cos(particle.angle) * edgeDistance;
              const startY = Math.sin(particle.angle) * edgeDistance;
              const endX = Math.cos(particle.angle) * 280;
              const endY = Math.sin(particle.angle) * 280;
              const tx = endX - startX;
              const ty = endY - startY;
              return `
                @keyframes musicNote${particle.id} {
                  0% {
                    opacity: 0;
                    transform: translate(0, 0) scale(0.5) rotate(0deg);
                  }
                  20% {
                    opacity: 1;
                  }
                  100% {
                    opacity: 0;
                    transform: translate(${tx}px, ${ty}px) scale(1.2) rotate(360deg);
                  }
                }
              `;
            }).join('')}</style>
          )}
        </Box>
      </Stack>

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

          @keyframes gentle-glow {
            0%, 100% {
              filter: drop-shadow(0 4px 15px rgba(212, 175, 55, 0.3));
              opacity: 0.95;
            }
            50% {
              filter: drop-shadow(0 4px 25px rgba(212, 175, 55, 0.5));
              opacity: 1;
            }
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes shimmer {
            0% {
              transform: translateX(-100%) translateY(-100%) rotate(45deg);
            }
            100% {
              transform: translateX(100%) translateY(100%) rotate(45deg);
            }
          }

          @keyframes twinkle {
            0%, 100% {
              opacity: 0.3;
            }
            50% {
              opacity: 1;
            }
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
