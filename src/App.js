import React, { useState, useEffect } from 'react';
import {
  MantineProvider,
  AppShell,
  Text,
  Group,
  ActionIcon,
  Box,
  Transition,
  Button,
  UnstyledButton
} from '@mantine/core';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons-react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Season2Sidebar from './components/Season2Sidebar';
import Season2Landing from './components/Season2Landing';
import Season1Landing from './components/Season1Landing';
import ChatlogViewer from './components/ChatlogViewer';
import ChannelView from './components/ChannelView';
import SeasonSelector from './components/SeasonSelector';
import GateOfHeavenTransition from './components/GateOfHeavenTransition';
import WinterBreezeTransition from './components/WinterBreezeTransition';
import SongOfLifeTransition from './components/SongOfLifeTransition';
import Season3BeyondVeilTransition from './components/Season3BeyondVeilTransition';
import '@mantine/core/styles.css';
import '@mantine/spotlight/styles.css';

const songOfLifeSitemap = {
  'Season 1': [
    '𝐓𝐫𝐮𝐜𝐞 - Truce SOL ☆ - green-room [1455408747060133921].html',
    '𝐓𝐫𝐮𝐜𝐞 - Truce SOL ☆ - studio [1455409431444721749].html'
  ],
  'Season 2': [
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - a-person-submissions [1474196372046741688].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - aeris-submissions [1474196169298153649].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - aiden-submissions [1474571795649663008].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - alicia-submissions [1474567274076835900].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - alyx-submissions [1474221864694972576].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - bigbouncybear-submissions [1474572554034352178].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - bjorn-submissions [1474196373627994236].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - cristen-submissions [1474196377520050368].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - darth-submissions [1474196379390840884].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - dumbbell-submissions [1474196381387198496].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - eddie-submissions [1474567456474398770].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - epoch-submissions [1474196383266504887].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - fantasy-submissions [1474196385099419740].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - gray-submissions [1474196386244329634].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - heist-submissions [1474196387376664670].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - henke-submissions [1474197108692090963].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - hunter-submissions [1474197110852161770].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - hydro-submissions [1474197111909257381].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - interlinked-submissions [1474207949139214376].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - jesse-submissions [1474211254062288956].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - joker-submissions [1474213567522934975].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - jules-submissions [1474197113708744858].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - justin-submissions [1474558624482197544].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - kaitan-submissions [1474197115315163361].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - kawaiimuski-submissions [1474197116875444330].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - kebab-submissions [1474197118444114133].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - kenny-submissions [1474197413034987623].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - kirøjøy-submissions [1474223084427940034].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - kractus-submissions [1474197414750715995].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - layton-submissions [1474197416617054250].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - leah-submissions [1474197419582296097].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - leslie-submissions [1474197422090752152].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - melo-submissions [1474197424116338689].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - mixie-submissions [1474197425743855659].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - motis-submissions [1474197427165597837].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - mouse-submissions [1474215010505855050].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - new-yorker-submissions [1474206577153147043].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - noor-submissions [1474197429057228861].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - nova-submissions [1474197430730883122].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - pigeon-submissions [1474197595856437399].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - play-submissions [1474197597739815097].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - rouanet-submissions [1474197599782436876].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - sean-submissions [1474558752714658004].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - shinx-submissions [1474197601317552201].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - silent-submissions [1474197602445820086].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - times-submissions [1474556567922671716].html',
    'Season 2/𝐓𝐫𝐮𝐜𝐞 - Truce SOL 2 Submissions ★ - topanga-submissions [1474197603704111155].html'
  ]
};

const songOfLifeTheme = ['#F1E0FF', '#C799D3', '#866293', '#61356B', '#331E3C'];

const songOfLifeResolver = (chatlogPath) => {
  const [season, ...fileParts] = chatlogPath.split('/');
  const file = fileParts.join('/');

  if (season === 'Season 2') {
    const normalizedFile = file.replace(/^Season 2\//, '');
    return `NEEDIMPLEMENT/SOL/Season 2/${normalizedFile}`;
  }

  return `NEEDIMPLEMENT/SOL/${file}`;
};

const seasonOneResolver = (chatlogPath) => {
  const [folder, ...rest] = chatlogPath.split('/');
  const mappedFolder = folder === 'Main' ? 'The Apotheion' : folder;
  return `SeasonOneChat/${[mappedFolder, ...rest].join('/')}`;
};

const seasonTwoResolver = (chatlogPath) => {
  return `SeasonTwoChat/${chatlogPath}`;
};

// Icy blue theme for Season 2
const seasonTwoTheme = ['#E8F4FD', '#A8D4F0', '#5BA3CC', '#2A6A9E', '#0D3B6E'];

function AppContent({
  onReturnToSeason,
  basePath = 'season-1',
  sitemapOverride,
  sitemapUrl = '/sitemap.json',
  chatlogPathResolver,
  chatlogTheme,
  SidebarComponent = Sidebar
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
    // Load sitemap from public folder
    const loadSitemap = async () => {
      try {
        const response = await fetch(sitemapUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSitemap(data);
      } catch (err) {
        console.error('Failed to load sitemap:', err);
        try {
          const publicUrl = process.env.PUBLIC_URL || '';
          const response = await fetch(publicUrl + sitemapUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setSitemap(data);
        } catch (fallbackErr) {
          console.error('Fallback fetch also failed:', fallbackErr);
          setSitemap({});
        }
      }
    };
    
    loadSitemap();
  }, [sitemapOverride, sitemapUrl]);

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

  const handleGoHome = () => {
    setSelectedChannel(null);
    setSelectedChatlog(null);
    const desiredPath = `/${basePath}`;
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
              <Text size="sm" c="gray.4">
                {basePath === 'season-2' ? 'Season 2 Archives' : 'Chatlog Archives'}
              </Text>
            </Box>
          </Group>
          <Group>
            {(selectedChannel || selectedChatlog) && (
              <UnstyledButton
                onClick={handleGoHome}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--mantine-color-dark-4)',
                  color: 'var(--mantine-color-gray-4)',
                  fontSize: '13px',
                  fontWeight: 500,
                  transition: 'background-color 150ms ease, color 150ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--mantine-color-dark-6)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--mantine-color-gray-4)';
                }}
              >
                ← {basePath === 'season-2' ? 'Season 2 Home' : 'Season 1 Home'}
              </UnstyledButton>
            )}
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
        <SidebarComponent
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
                  onGoBack={handleGoHome}
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
              <div style={{ ...styles, flex: 1, minHeight: 0, height: '100%', overflowY: 'auto' }}>
                {basePath === 'season-2' ? (
                  <Season2Landing
                    sitemap={effectiveSitemap}
                    onSelectChannel={handleSelectChannel}
                  />
                ) : basePath === 'season-1' ? (
                  <Season1Landing
                    sitemap={effectiveSitemap}
                    onSelectChannel={handleSelectChannel}
                  />
                ) : (
                  <Box ta="center" mt="xl">
                    <Text size="xl" mb="md">Welcome to Truce Server Archives</Text>
                    <Text c="dimmed">Select a channel to browse conversations or use the search to find specific chatlogs.</Text>
                  </Box>
                )}
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

function Season3ComingSoon({ onReturnToSeason }) {
  return (
    <Box
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'radial-gradient(circle at top, rgba(52, 199, 168, 0.18) 0%, transparent 38%), linear-gradient(135deg, #050814 0%, #0b1022 42%, #1a1233 100%)',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 28%, rgba(255,255,255,0.03) 100%)',
          opacity: 0.45,
          pointerEvents: 'none'
        }}
      />
      <Text size="48px" fw={700} style={{ letterSpacing: '2px', color: '#7ef0c9', textShadow: '0 0 24px rgba(52, 199, 168, 0.45)' }}>
        Beyond the Veil
      </Text>
      <Text size="md" mt="xs" c="gray.3" style={{ maxWidth: '560px', textAlign: 'center', padding: '0 24px' }}>
        Season 3 is on the way. Something is slipping through, and the veil between worlds is thinning. Prepare for a journey into the unknown.
      </Text>
      <Button mt="xl" variant="light" onClick={onReturnToSeason} style={{ backgroundColor: '#7ef0c9', color: '#07111d' }}>
        Back to Seasons
      </Button>
    </Box>
  );
}

function App() {
  const initialPath = window.location.pathname || '/';
  const initialSeason = initialPath.startsWith('/season-1')
    ? 'season1'
    : initialPath.startsWith('/season-2')
      ? 'season2'
      : initialPath.startsWith('/season-3')
        ? 'season3'
        : initialPath.startsWith('/song-of-life')
          ? 'songoflife'
          : null;
  const [seasonSelected, setSeasonSelected] = useState(Boolean(initialSeason));
  const [selectedSeason, setSelectedSeason] = useState(initialSeason);
  const [gateAnimationComplete, setGateAnimationComplete] = useState(initialSeason === 'season1');
  const [season2TransitionComplete, setSeason2TransitionComplete] = useState(initialSeason === 'season2');
  const [season3TransitionComplete, setSeason3TransitionComplete] = useState(initialSeason === 'season3');
  const [songOfLifeTransitionComplete, setSongOfLifeTransitionComplete] = useState(initialSeason === 'songoflife');

  useEffect(() => {
    const path = window.location.pathname || '/';
    if (!seasonSelected && path.startsWith('/season-1')) {
      setSelectedSeason('season1');
      setSeasonSelected(true);
      setGateAnimationComplete(true);
    }

    if (!seasonSelected && path.startsWith('/season-2')) {
      setSelectedSeason('season2');
      setSeasonSelected(true);
      setSeason2TransitionComplete(true);
    }

    if (!seasonSelected && path.startsWith('/season-3')) {
      setSelectedSeason('season3');
      setSeasonSelected(true);
      setSeason3TransitionComplete(true);
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
    setSeason3TransitionComplete(false);
    setSongOfLifeTransitionComplete(false);
    setGateAnimationComplete(season !== 'season1');

    if (season === 'songoflife') {
      window.history.replaceState({}, '', '/song-of-life');
    } else if (season === 'season1') {
      window.history.replaceState({}, '', '/season-1');
    } else if (season === 'season2') {
      window.history.replaceState({}, '', '/season-2');
    } else if (season === 'season3') {
      window.history.replaceState({}, '', '/season-3');
    }
  };

  const handleReturnToSeason = () => {
    setSeasonSelected(false);
    setSelectedSeason(null);
    setGateAnimationComplete(false);
    setSeason2TransitionComplete(false);
    setSeason3TransitionComplete(false);
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

      {seasonSelected && selectedSeason === 'season3' && !season3TransitionComplete && (
        <Season3BeyondVeilTransition onTransitionComplete={() => setSeason3TransitionComplete(true)} />
      )}

      {seasonSelected && selectedSeason === 'songoflife' && !songOfLifeTransitionComplete && (
        <SongOfLifeTransition onTransitionComplete={() => setSongOfLifeTransitionComplete(true)} />
      )}

      {seasonSelected && selectedSeason === 'season2' && season2TransitionComplete && (
        <Transition mounted={seasonSelected} transition="fade" duration={400} timingFunction="ease-in-out">
          {(styles) => (
            <div style={styles}>
              <Router basename="">
                <Routes>
                  <Route
                    path="/season-2/*"
                    element={(
                      <AppContent
                        onReturnToSeason={handleReturnToSeason}
                        basePath="season-2"
                        sitemapUrl="/sitemap-season2.json"
                        chatlogPathResolver={seasonTwoResolver}
                        chatlogTheme={seasonTwoTheme}
                        SidebarComponent={Season2Sidebar}
                      />
                    )}
                  />
                  <Route
                    path="*"
                    element={(
                      <AppContent
                        onReturnToSeason={handleReturnToSeason}
                        basePath="season-2"
                        sitemapUrl="/sitemap-season2.json"
                        chatlogPathResolver={seasonTwoResolver}
                        chatlogTheme={seasonTwoTheme}
                        SidebarComponent={Season2Sidebar}
                      />
                    )}
                  />
                </Routes>
              </Router>
            </div>
          )}
        </Transition>
      )}

      {seasonSelected && selectedSeason === 'season3' && season3TransitionComplete && (
        <Transition mounted={seasonSelected} transition="fade" duration={400} timingFunction="ease-in-out">
          {(styles) => (
            <div style={styles}>
              <Season3ComingSoon onReturnToSeason={handleReturnToSeason} />
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