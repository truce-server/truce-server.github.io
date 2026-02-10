import React, { useState, useEffect } from 'react';
import {
  MantineProvider,
  AppShell,
  Text,
  Group,
  ActionIcon,
  useMantineColorScheme,
  Box
} from '@mantine/core';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { IconSearch, IconSun, IconMoonStars } from '@tabler/icons-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChatlogViewer from './components/ChatlogViewer';
import ChannelView from './components/ChannelView';
import '@mantine/core/styles.css';
import '@mantine/spotlight/styles.css';

function AppContent() {
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
            <Text size="xl" fw={700}>Truce Server</Text>
            <Text size="sm" c="dimmed">Chatlog Archives</Text>
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
        {selectedChatlog ? (
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
        ) : selectedChannel ? (
          <ChannelView 
            channelName={selectedChannel} 
            chatlogs={sitemap[selectedChannel] || []} 
            onSelectChatlog={(chatlogPath) => {
              setSelectedChatlog(chatlogPath);
              setSelectedChannel(null); // Clear channel selection when viewing specific chatlog
            }}
          />
        ) : (
          <Box ta="center" mt="xl">
            <Text size="xl" mb="md">Welcome to Truce Server Archives</Text>
            <Text c="dimmed">Select a channel to browse conversations or use the search to find specific chatlogs.</Text>
          </Box>
        )}
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
  return (
    <MantineProvider 
      defaultColorScheme="dark"
      theme={{
        primaryColor: 'blue',
        fontFamily: 'gg sans, system-ui, sans-serif',
        colors: {
          dark: [
            '#C1C2C5',
            '#A6A7AB', 
            '#909296',
            '#5C5F66',
            '#373A40',
            '#2C2E33',
            '#25262B',
            '#1A1B1E',
            '#141517',
            '#101113',
          ],
        }
      }}
    >
      <Router basename="">
        <Routes>
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;