import React, { useState, useEffect } from 'react';
import {
  MantineProvider,
  AppShell,
  Text,
  Group,
  ActionIcon,
  useMantineColorScheme,
  Box,
  Transition
} from '@mantine/core';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { IconSearch, IconSun, IconMoonStars } from '@tabler/icons-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChatlogViewer from './components/ChatlogViewer';
import ChannelView from './components/ChannelView';
import SeasonSelector from './components/SeasonSelector';
import GateOfHeavenTransition from './components/GateOfHeavenTransition';
import WinterBreezeTransition from './components/WinterBreezeTransition';
import '@mantine/core/styles.css';
import '@mantine/spotlight/styles.css';

function AppContent({ onReturnToSeason }) {
  const [sitemap, setSitemap] = useState({});
  const [selectedChatlog, setSelectedChatlog] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [opened] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  useEffect(() => {
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
  }, []);

  // Debug log for sitemap state changes
  useEffect(() => {
    console.log('Sitemap state updated:', sitemap);
    console.log('Folders in state:', Object.keys(sitemap));
  }, [sitemap]);

  // Create spotlight actions from sitemap
  const spotlightActions = Object.entries(sitemap).flatMap(([folder, files]) =>
    files.map(file => ({
      id: `${folder}/${file}`,
      label: file.replace(/\.html$/, '').replace(/𝐓𝐫𝐮𝐜𝐞 ✧ - /, '').replace(/ \[\d+\]$/, ''),
      description: folder,
      onClick: () => {
        setSelectedChatlog(`${folder}/${file}`);
        setSelectedChannel(null); // Clear channel selection when using spotlight
      }
    }))
  );

  return (
    <AppShell
      navbar={{
        width: 350,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      header={{ height: 60 }}
      padding="md"
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
              <Text size="xl" fw={700}>Truce: Survivor Series</Text>
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
            <ActionIcon
              onClick={toggleColorScheme}
              size="lg"
              variant="default"
              aria-label="Toggle theme"
            >
              {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoonStars size={18} />}
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <Sidebar 
          sitemap={sitemap} 
          selectedChatlog={selectedChatlog}
          selectedChannel={selectedChannel}
          onSelectChatlog={setSelectedChatlog}
          onSelectChannel={setSelectedChannel}
        />
      </AppShell.Navbar>

      <AppShell.Main style={{ display: 'flex', flexDirection: 'column', padding: 'md', height: '100%', minHeight: 0 }}>
        <>
          <Transition
            mounted={!!selectedChatlog}
            transition="fade"
            duration={300}
            timingFunction="ease-in-out"
          >
            {(styles) => selectedChatlog && (
              <div style={styles}>
                <ChatlogViewer 
                  chatlogPath={selectedChatlog} 
                  onGoBack={() => {
                    setSelectedChatlog(null);
                    // If we came from a channel, go back to that channel view
                    if (selectedChatlog) {
                      const [channelName] = selectedChatlog.split('/');
                      setSelectedChannel(channelName);
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
              <div style={styles}>
                <ChannelView 
                  channelName={selectedChannel} 
                  chatlogs={sitemap[selectedChannel] || []} 
                  onSelectChatlog={(chatlogPath) => {
                    setSelectedChatlog(chatlogPath);
                    setSelectedChannel(null); // Clear channel selection when viewing specific chatlog
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
              <div style={styles}>
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

function App() {
  const [seasonSelected, setSeasonSelected] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [gateAnimationComplete, setGateAnimationComplete] = useState(false);

  const handleSeasonSelect = (season) => {
    setSelectedSeason(season);
    setSeasonSelected(true);
    setGateAnimationComplete(false);
  };

  const handleReturnToSeason = () => {
    setSeasonSelected(false);
    setSelectedSeason(null);
    setGateAnimationComplete(false);
  };

  return (
    <MantineProvider 
      defaultColorScheme="dark"
      theme={{
        primaryColor: 'brand',
        fontFamily: 'gg sans, system-ui, sans-serif',
        colors: {
          brand: [
            '#E8F0FB',
            '#C5D9F0',
            '#A2C1E4',
            '#7FA9D9',
            '#5C91CD',
            '#3979C2',
            '#2a5a8f',
            '#1e3a5f',
            '#0a1f3f',
            '#050f1f',
          ],
          gold: [
            '#FEF3E2',
            '#FCE5C7',
            '#FAD6A5',
            '#F7C883',
            '#F5BA6B',
            '#F2AC53',
            '#d4af37',
            '#b8941a',
            '#8a6f1a',
            '#5c4916',
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

      {seasonSelected && !gateAnimationComplete && selectedSeason === 'season2' && (
        <WinterBreezeTransition onTransitionComplete={() => setGateAnimationComplete(true)} />
      )}

      <Transition
        mounted={gateAnimationComplete}
        transition="fade"
        duration={400}
        timingFunction="ease-in-out"
      >
        {(styles) => (
          <div style={styles}>
            <Router basename="">
              <Routes>
                <Route path="/*" element={<AppContent onReturnToSeason={handleReturnToSeason} />} />
              </Routes>
            </Router>
          </div>
        )}
      </Transition>
    </MantineProvider>
  );
}

export default App;