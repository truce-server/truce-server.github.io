import React, { useState, useEffect } from 'react';
import {
  MantineProvider,
  AppShell,
  Text,
  Group,
  ActionIcon,
  Box,
  Transition,
  Button
} from '@mantine/core';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons-react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChatlogViewer from './components/ChatlogViewer';
import ChannelView from './components/ChannelView';
import SeasonSelector from './components/SeasonSelector';
import GateOfHeavenTransition from './components/GateOfHeavenTransition';
import WinterBreezeTransition from './components/WinterBreezeTransition';
import SongOfLifeTransition from './components/SongOfLifeTransition';
import '@mantine/core/styles.css';
import '@mantine/spotlight/styles.css';

const songOfLifeSitemap = {
  'Season 1': [
    '𝐓𝐫𝐮𝐜𝐞 - Truce SOL ☆ - green-room [1455408747060133921].html',
    '𝐓𝐫𝐮𝐜𝐞 - Truce SOL ☆ - studio [1455409431444721749].html'
  ]
};

const songOfLifeTheme = ['#F1E0FF', '#C799D3', '#866293', '#61356B', '#331E3C'];

const songOfLifeResolver = (chatlogPath) => {
  const [, ...fileParts] = chatlogPath.split('/');
  const file = fileParts.join('/');
  return `NEEDIMPLEMENT/SOL/${file}`;
};

const seasonOneResolver = (chatlogPath) => {
  const [folder, ...rest] = chatlogPath.split('/');
  const mappedFolder = folder === 'Main' ? 'The Apotheion' : folder;
  return `SeasonOneChat/${[mappedFolder, ...rest].join('/')}`;
};

function AppContent({
  onReturnToSeason,
  basePath = 'season-1',
  sitemapOverride,
  chatlogPathResolver,
  chatlogTheme
}) {
  const [sitemap, setSitemap] = useState({});
  const [selectedChatlog, setSelectedChatlog] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [opened] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (sitemapOverride) {
      setSitemap(sitemapOverride);
      return;
    }
    // Load sitemap.json from public folder
    const loadSitemap = async () => {
      try {
        // Try relative path first (works in development)
        const response = await fetch('/sitemap.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Sitemap loaded successfully');
        console.log('Number of folders:', Object.keys(data).length);
        console.log('Total files:', Object.values(data).reduce((sum, files) => sum + files.length, 0));
        setSitemap(data);
      } catch (err) {
        console.error('Failed to load sitemap:', err);
        // Try with PUBLIC_URL as fallback
        try {
          const publicUrl = process.env.PUBLIC_URL || '';
          const response = await fetch(publicUrl + '/sitemap.json');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log('Sitemap loaded from PUBLIC_URL path:', data);
          setSitemap(data);
        } catch (fallbackErr) {
          console.error('Fallback fetch also failed:', fallbackErr);
          // Set empty sitemap so UI doesn't crash
          setSitemap({});
        }
      }
    };
    
    loadSitemap();
  }, [sitemapOverride]);

  // Debug log for sitemap state changes
  useEffect(() => {
    console.log('Sitemap state updated:', sitemap);
    console.log('Folders in state:', Object.keys(sitemap));
  }, [sitemap]);

  const handleSelectChatlog = (chatlogPath) => {
    const [channelName, ...fileParts] = chatlogPath.split('/');
    const file = fileParts.join('/');
    setSelectedChatlog(chatlogPath);
    setSelectedChannel(channelName);
    const desiredPath = `/${basePath}/${encodeURIComponent(channelName)}/${encodeURIComponent(file)}`;
    if (location.pathname !== desiredPath) {
      navigate(desiredPath, { replace: true });
    }
  };

  const handleSelectChannel = (channelName) => {
    setSelectedChannel(channelName);
    setSelectedChatlog(null);
    const desiredPath = `/${basePath}/${encodeURIComponent(channelName)}`;
    if (location.pathname !== desiredPath) {
      navigate(desiredPath, { replace: true });
    }
  };

  // Create spotlight actions from sitemap
  const effectiveSitemap = sitemapOverride || sitemap;

  const spotlightActions = Object.entries(effectiveSitemap).flatMap(([folder, files]) =>
    files.map(file => ({
      id: `${folder}/${file}`,
      label: file.replace(/\.html$/, '').replace(/𝐓𝐫𝐮𝐜𝐞 ✧ - /, '').replace(/ \[\d+\]$/, ''),
      description: folder,
      onClick: () => {
        handleSelectChatlog(`${folder}/${file}`);
      }
    }))
  );

  useEffect(() => {
    if (!effectiveSitemap || Object.keys(effectiveSitemap).length === 0) {
      return;
    }

    const parts = location.pathname
      .split('/')
      .filter(Boolean)
      .map((part) => decodeURIComponent(part));

    if (parts[0] !== basePath) {
      return;
    }

    const routeParts = parts.slice(1);

    if (routeParts.length === 0) {
      return;
    }

    if (routeParts.length === 1) {
      if (selectedChatlog) {
        return;
      }
      const folder = routeParts[0];
      if (effectiveSitemap[folder] && selectedChannel !== folder) {
        setSelectedChannel(folder);
      }
      return;
    }

    const folder = routeParts[0];
    const file = routeParts.slice(1).join('/');
    const desired = `${folder}/${file}`;

    if (effectiveSitemap[folder]?.includes(file) && selectedChatlog !== desired) {
      setSelectedChatlog(desired);
      setSelectedChannel(folder);
    }
  }, [location.pathname, effectiveSitemap, selectedChannel, selectedChatlog, basePath]);

  return (
    <AppShell
      navbar={{
        width: 350,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      header={{ height: 60 }}
      padding="xs"
      style={{ height: '100vh' }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <img 
              src="/TruceLogo.png" 
              alt="Truce Logo" 
              style={{ height: '40px', width: 'auto', cursor: 'pointer' }}
              onClick={onReturnToSeason}
            />
            <Box onClick={onReturnToSeason} style={{ cursor: 'pointer' }}>
              <Text size="xl" fw={700}>✧ Truce Server</Text>
              <Text size="sm" c="gray.4">Chatlog Archives</Text>
            </Box>
          </Group>
          <Group>
            <ActionIcon
              onClick={() => spotlight.open()}
              size="lg"
              variant="default"
              aria-label="Search chatlogs"
            >
              <IconSearch size={18} />
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <Sidebar 
          sitemap={effectiveSitemap} 
          selectedChatlog={selectedChatlog}
          selectedChannel={selectedChannel}
          onSelectChatlog={handleSelectChatlog}
          onSelectChannel={handleSelectChannel}
        />
      </AppShell.Navbar>

      <AppShell.Main style={{ display: 'flex', flexDirection: 'column', padding: 'xs', height: '100%', minHeight: 0 }}>
        <>
          <Transition
            mounted={!!selectedChatlog}
            transition="fade"
            duration={300}
            timingFunction="ease-in-out"
          >
            {(styles) => selectedChatlog && (
              <div style={{ ...styles, flex: 1, minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <ChatlogViewer 
                  chatlogPath={selectedChatlog}
                  basePath={basePath}
                  resolveChatlogPath={chatlogPathResolver}
                  themeColors={chatlogTheme}
                  onGoBack={() => {
                    setSelectedChatlog(null);
                    // If we came from a channel, go back to that channel view
                    if (selectedChatlog) {
                      const [channelName] = selectedChatlog.split('/');
                      handleSelectChannel(channelName);
                    }
                  }}
                />
              </div>
            )}
          </Transition>

          <Transition
            mounted={!!selectedChannel && !selectedChatlog}
            transition="fade"
            duration={300}
            timingFunction="ease-in-out"
          >
            {(styles) => selectedChannel && !selectedChatlog && (
              <div style={{ ...styles, flex: 1, minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <ChannelView 
                  channelName={selectedChannel} 
                  chatlogs={effectiveSitemap[selectedChannel] || []} 
                  resolveChatlogPath={chatlogPathResolver}
                  onSelectChatlog={(chatlogPath) => {
                    handleSelectChatlog(chatlogPath);
                  }}
                />
              </div>
            )}
          </Transition>

          <Transition
            mounted={!selectedChatlog && !selectedChannel}
            transition="fade"
            duration={300}
            timingFunction="ease-in-out"
          >
            {(styles) => !selectedChatlog && !selectedChannel && (
              <div style={{ ...styles, flex: 1, minHeight: 0, height: '100%' }}>
                <Box ta="center" mt="xl">
                  <Text size="xl" mb="md">Welcome to Truce Server Archives</Text>
                  <Text c="dimmed">Select a channel to browse conversations or use the search to find specific chatlogs.</Text>
                </Box>
              </div>
            )}
          </Transition>
        </>
      </AppShell.Main>

      <Spotlight
        actions={spotlightActions}
        nothingFound="No chatlogs found..."
        highlightQuery
        searchProps={{
          placeholder: 'Search chatlogs...',
          leftSection: <IconSearch size={18} />
        }}
        shortcut="mod + k"
      />
    </AppShell>
  );
}

function ComingSoon({ onReturnToSeason }) {
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
        color: '#ffffff'
      }}
    >
      <Text size="48px" fw={700} style={{ letterSpacing: '2px', color: '#d4af37' }}>
        Coming Soon
      </Text>
      <Text size="md" mt="xs" c="gray.3">
        Season 2 is on the way.
      </Text>
      <Button mt="xl" variant="light" onClick={onReturnToSeason}>
        Back to Seasons
      </Button>
    </Box>
  );
}

function App() {
  const initialPath = window.location.pathname || '/';
  const initialSeason = initialPath.startsWith('/season-1')
    ? 'season1'
    : initialPath.startsWith('/song-of-life')
      ? 'songoflife'
      : null;
  const [seasonSelected, setSeasonSelected] = useState(Boolean(initialSeason));
  const [selectedSeason, setSelectedSeason] = useState(initialSeason);
  const [gateAnimationComplete, setGateAnimationComplete] = useState(initialSeason === 'season1');
  const [season2TransitionComplete, setSeason2TransitionComplete] = useState(false);
  const [songOfLifeTransitionComplete, setSongOfLifeTransitionComplete] = useState(initialSeason === 'songoflife');

  useEffect(() => {
    const path = window.location.pathname || '/';
    if (!seasonSelected && path.startsWith('/season-1')) {
      setSelectedSeason('season1');
      setSeasonSelected(true);
      setGateAnimationComplete(true);
    }

    if (!seasonSelected && path.startsWith('/song-of-life')) {
      setSelectedSeason('songoflife');
      setSeasonSelected(true);
      setSongOfLifeTransitionComplete(true);
    }
  }, [seasonSelected]);

  const handleSeasonSelect = (season) => {
    setSelectedSeason(season);
    setSeasonSelected(true);
    setSeason2TransitionComplete(false);
    setSongOfLifeTransitionComplete(false);
    setGateAnimationComplete(season !== 'season1');

    if (season === 'songoflife') {
      window.history.replaceState({}, '', '/song-of-life');
    } else if (season === 'season1') {
      window.history.replaceState({}, '', '/season-1');
    }
  };

  const handleReturnToSeason = () => {
    setSeasonSelected(false);
    setSelectedSeason(null);
    setGateAnimationComplete(false);
    setSeason2TransitionComplete(false);
    setSongOfLifeTransitionComplete(false);
    window.history.replaceState({}, '', '/');
  };

  return (
    <MantineProvider 
      defaultColorScheme="dark"
      theme={{
        primaryColor: 'navy',
        fontFamily: 'gg sans, system-ui, sans-serif',
        colors: {
          navy: [
            '#E9EEF6',
            '#C8D4E6',
            '#A7BCD7',
            '#869FC6',
            '#667FB1',
            '#4E679C',
            '#3C4F7D',
            '#2A3A5D',
            '#1A2641',
            '#0B162B',
          ],
          gold: [
            '#FFF6D8',
            '#FBE9B5',
            '#F6DB92',
            '#F1CD6F',
            '#EBC04E',
            '#DDB03A',
            '#C59A2A',
            '#A77F1E',
            '#7E5E15',
            '#5A420E',
          ],
          gray: [
            '#F9FAFB',
            '#F3F4F6',
            '#E5E7EB',
            '#D1D5DB',
            '#9CA3AF',
            '#6B7280',
            '#4B5563',
            '#374151',
            '#1F2937',
            '#111827',
          ],
          success: [
            '#ECFDF5',
            '#D1FAE5',
            '#A7F3D0',
            '#6EE7B7',
            '#34D399',
            '#10B981',
            '#059669',
            '#047857',
            '#065F46',
            '#032B2B',
          ],
          warning: [
            '#FFFBEB',
            '#FEF3C7',
            '#FDE68A',
            '#FCD34D',
            '#FBBF24',
            '#F59E0B',
            '#D97706',
            '#B45309',
            '#92400E',
            '#78350F',
          ],
          danger: [
            '#FEF2F2',
            '#FEE2E2',
            '#FECACA',
            '#FCA5A5',
            '#F87171',
            '#EF4444',
            '#DC2626',
            '#B91C1C',
            '#991B1B',
            '#7F1D1D',
          ],
          info: [
            '#EFF6FF',
            '#DBEAFE',
            '#BFDBFE',
            '#93C5FD',
            '#60A5FA',
            '#3B82F6',
            '#2563EB',
            '#1D4ED8',
            '#1E40AF',
            '#1E3A8A',
          ],
          dark: [
            '#E9EEF6',
            '#C8D4E6',
            '#A7BCD7',
            '#869FC6',
            '#667FB1',
            '#4E679C',
            '#3C4F7D',
            '#2A3A5D',
            '#1A2641',
            '#0B162B',
          ],
        }
      }}
    >
      <Transition
        mounted={!seasonSelected}
        transition="fade"
        duration={400}
        timingFunction="ease-in-out"
      >
        {(styles) => (
          <div style={styles}>
            <SeasonSelector onSelectSeason={handleSeasonSelect} />
          </div>
        )}
      </Transition>

      {seasonSelected && !gateAnimationComplete && selectedSeason === 'season1' && (
        <GateOfHeavenTransition onTransitionComplete={() => setGateAnimationComplete(true)} />
      )}

      {seasonSelected && selectedSeason === 'season2' && !season2TransitionComplete && (
        <WinterBreezeTransition onTransitionComplete={() => setSeason2TransitionComplete(true)} />
      )}

      {seasonSelected && selectedSeason === 'songoflife' && !songOfLifeTransitionComplete && (
        <SongOfLifeTransition onTransitionComplete={() => setSongOfLifeTransitionComplete(true)} />
      )}

      {seasonSelected && selectedSeason === 'season2' && season2TransitionComplete && (
        <Transition mounted={seasonSelected} transition="fade" duration={400} timingFunction="ease-in-out">
          {(styles) => (
            <div style={styles}>
              <ComingSoon onReturnToSeason={handleReturnToSeason} />
            </div>
          )}
        </Transition>
      )}

      <Transition
        mounted={
          (gateAnimationComplete && selectedSeason === 'season1') ||
          (songOfLifeTransitionComplete && selectedSeason === 'songoflife')
        }
        transition="fade"
        duration={400}
        timingFunction="ease-in-out"
      >
        {(styles) => (
          <div style={styles}>
            <Router basename="">
              <Routes>
                <Route
                  path="/season-1/*"
                  element={(
                    <AppContent
                      onReturnToSeason={handleReturnToSeason}
                      basePath="season-1"
                      chatlogPathResolver={seasonOneResolver}
                    />
                  )}
                />
                <Route
                  path="/song-of-life/*"
                  element={(
                    <AppContent
                      onReturnToSeason={handleReturnToSeason}
                      basePath="song-of-life"
                      sitemapOverride={songOfLifeSitemap}
                      chatlogPathResolver={songOfLifeResolver}
                      chatlogTheme={songOfLifeTheme}
                    />
                  )}
                />
                <Route
                  path="/"
                  element={(
                    <AppContent
                      onReturnToSeason={handleReturnToSeason}
                      basePath="season-1"
                      chatlogPathResolver={seasonOneResolver}
                    />
                  )}
                />
              </Routes>
            </Router>
          </div>
        )}
      </Transition>
    </MantineProvider>
  );
}

export default App;