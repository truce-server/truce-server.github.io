import React, { useCallback, useEffect, useState } from 'react';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import Home from './components/Home';
import SeasonArchive from './components/SeasonArchive';
import Season3Teaser from './components/Season3Teaser';
import SeasonIntro from './components/SeasonIntro';
import { ALL_SEASONS, SEASONS, SEASON_THREE_PATH } from './seasons';
import { prefersReducedMotion } from './utils/ui';
import '@mantine/core/styles.css';
import '@mantine/spotlight/styles.css';
import './styles/global.css';

// Mantine only supplies behaviour here (the search box and the drawers); every surface is styled in global.css.
const theme = {
  primaryColor: 'dark',
  defaultRadius: 0,
  fontFamily: "'Libre Franklin', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  headings: { fontFamily: "'Source Serif 4', 'Iowan Old Style', Georgia, serif" },
  respectReducedMotion: true,
};

// New pages start at the top; Back/Forward keep the browser's own scroll restoration.
function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  useEffect(() => {
    if (navigationType === 'PUSH') window.scrollTo(0, 0);
  }, [pathname, navigationType]);
  return null;
}

function AppRoutes() {
  const navigate = useNavigate();
  const [intro, setIntro] = useState(null);

  // The intro only plays when a season is picked from the home page, never on direct links or refresh.
  const openSeason = useCallback((id) => {
    const season = ALL_SEASONS.find((item) => item.id === id);
    if (!season) return;
    if (!prefersReducedMotion()) setIntro(season);
    navigate(season.path);
  }, [navigate]);

  const finishIntro = useCallback(() => setIntro(null), []);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home onPick={openSeason} />} />
        {SEASONS.map((season) => (
          <Route
            key={season.id}
            path={`${season.path}/*`}
            element={<SeasonArchive key={season.id} season={season} />}
          />
        ))}
        <Route path={`${SEASON_THREE_PATH}/*`} element={<Season3Teaser />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {intro && <SeasonIntro key={intro.id} season={intro} onDone={finishIntro} />}
    </>
  );
}

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light" forceColorScheme="light">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
