import React, { useState, useEffect } from 'react';
import {
  ScrollArea,
  Text,
  Group,
  Badge,
  Collapse,
  UnstyledButton,
  Box,
  TextInput,
  Stack,
  Paper
} from '@mantine/core';
import { IconChevronDown, IconChevronRight, IconSearch } from '@tabler/icons-react';

function FolderSection({ folder, files, selectedChatlog, selectedChannel, onSelectChatlog, onSelectChannel, searchQuery }) {
  const [opened, setOpened] = useState(selectedChannel === folder);
  
  // Sync open state to the active selection
  useEffect(() => {
    setOpened(selectedChannel === folder);
  }, [selectedChannel, folder]);
  
  // Filter files based on search
  const filteredFiles = files.filter(file => 
    file.toLowerCase().includes(searchQuery.toLowerCase()) ||
    folder.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (searchQuery && filteredFiles.length === 0) {
    return null;
  }

  // Clean up filename for display
  const cleanFileName = (filename) => {
    return filename
      .replace(/\.html$/, '')
      .replace(/𝐓𝐫𝐮𝐜𝐞 ✧ - /, '')
      .replace(/^Varanitlan 1-?on-?/i, '')
      .replace(/[^-]*- /, '') // Remove prefix before first dash
      .replace(/\s*\[\d+\]\s*$/, ''); // Remove ID numbers
  };

  return (
    <Box mb="xs">
      <Group wrap="nowrap" gap={0}>
        {/* Expand/Collapse Button */}
        <UnstyledButton
          onClick={() => setOpened(!opened)}
          style={{
            padding: '8px',
            borderRadius: '8px 0 0 8px',
            transition: 'background-color 150ms ease',
            backgroundColor: opened ? 'var(--mantine-color-dark-6)' : 'transparent'
          }}
          onMouseEnter={(e) => {
            if (!opened) e.target.style.backgroundColor = 'var(--mantine-color-dark-7)';
          }}
          onMouseLeave={(e) => {
            if (!opened) e.target.style.backgroundColor = 'transparent';
          }}
        >
          {opened ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
        </UnstyledButton>
        
        {/* Channel Name - Clickable */}
        <UnstyledButton
          onClick={() => {
            onSelectChannel(folder);
            setOpened(true);
          }}
          style={{
            flex: 1,
            padding: '8px 12px 8px 4px',
            borderRadius: '0 8px 8px 0',
            transition: 'background-color 150ms ease',
            backgroundColor: selectedChannel === folder 
              ? 'var(--mantine-color-blue-filled)' 
              : (opened ? 'var(--mantine-color-dark-6)' : 'transparent')
          }}
          onMouseEnter={(e) => {
            if (selectedChannel !== folder) {
              e.target.style.backgroundColor = opened ? 'var(--mantine-color-dark-5)' : 'var(--mantine-color-dark-7)';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedChannel !== folder) {
              e.target.style.backgroundColor = opened ? 'var(--mantine-color-dark-6)' : 'transparent';
            }
          }}
        >
          <Group justify="space-between" gap="xs">
            <Text 
              size="sm" 
              fw={500}
              c={selectedChannel === folder ? 'white' : 'inherit'}
              style={{ wordBreak: 'break-word' }}
            >
              {folder}
            </Text>
            <Badge 
              size="xs" 
              variant={selectedChannel === folder ? 'white' : 'light'} 
              color={selectedChannel === folder ? 'dark' : 'gray'}
            >
              {filteredFiles.length}
            </Badge>
          </Group>
        </UnstyledButton>
      </Group>
      
      <Collapse in={opened}>
        <Box pl="xl" pt="xs">
          <Stack gap={2}>
            {filteredFiles.map((file, index) => {
              const fullPath = `${folder}/${file}`;
              const isSelected = selectedChatlog === fullPath;
              
              return (
                <UnstyledButton
                  key={index}
                  onClick={() => onSelectChatlog(fullPath)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    backgroundColor: isSelected 
                      ? 'var(--mantine-color-blue-filled)' 
                      : 'transparent',
                    transition: 'background-color 150ms ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.target.style.backgroundColor = 'var(--mantine-color-dark-7)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <Text 
                    size="sm" 
                    c={isSelected ? 'white' : 'dimmed'}
                    style={{ 
                      wordBreak: 'break-word',
                      lineHeight: 1.3
                    }}
                  >
                    {cleanFileName(file)}
                  </Text>
                </UnstyledButton>
              );
            })}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
}

function Sidebar({ sitemap, selectedChatlog, selectedChannel, onSelectChatlog, onSelectChannel }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const folders = Object.keys(sitemap).sort((a, b) => a.localeCompare(b));

  const eraGroups = [
    {
      label: 'Truce: The Apotheion',
      folders: [ 'The Apotheion', 'Temples']
    },
    {
      label: 'Finale',
      folders: [ 'Finale']
    },
    {
      label: 'Varanitlan Era',
      folders: [ 'Varanitilan 1on1s', 'Varantilan Alliances', 'Valhalla']
    },
    {
      label: 'Chinese Era',
      folders: ['Lingshan', 'Chaangan']
    },
    {
      label: 'Norse Era',
      folders: ['Bifrost', 'Midgard', 'Asgard']
    },
    {
      label: 'Egyptian Era',
      folders: ['Aaru', 'Akhet', 'Nun', 'Across Realms - Egypt']
    },
    {
      label: 'Greek Era',
      folders: ['Aether', 'Khaos', 'Pontus', 'Erebus']
    }
  ];

  const usedFolders = new Set(eraGroups.flatMap((group) => group.folders));
  const miscPriority = ['General', 'Eliminations', 'Challenges'];
  const miscFolders = folders.filter((folder) => !usedFolders.has(folder));
  const orderedMiscFolders = [
    ...miscPriority.filter((folder) => miscFolders.includes(folder)),
    ...miscFolders.filter((folder) => !miscPriority.includes(folder))
  ];
  
  // Calculate total chatlogs
  const totalChatlogs = Object.values(sitemap).reduce((sum, files) => sum + files.length, 0);
  
  return (
    <Box h="100%" p="md">
      <Paper p="sm" mb="md" radius="md" style={{ backgroundColor: 'var(--mantine-color-dark-6)' }}>
        <Group justify="space-between" mb="xs">
          <Text size="sm" fw={500}>Archive Overview</Text>
          <Badge size="sm" variant="light">{folders.length} Categories</Badge>
        </Group>
        <Text size="xs" c="dimmed">{totalChatlogs} Channels</Text>
      </Paper>
      
      <TextInput
        placeholder="Search conversations..."
        mb="md"
        leftSection={<IconSearch size={16} />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        radius="md"
      />
      
      <ScrollArea style={{ height: 'calc(100vh - 200px)' }}>
        <Stack gap="xs">
          {eraGroups.map((group) => {
            const groupFolders = group.folders.filter((folder) => folders.includes(folder));
            if (groupFolders.length === 0) {
              return null;
            }

            return (
              <Box key={group.label}>
                <Box style={{ paddingTop: '6px', paddingBottom: '2px' }}>
                  <Box
                    style={{
                      borderTop: '1px solid var(--mantine-color-dark-5)',
                      marginBottom: '6px'
                    }}
                  />
                  <Text size="xs" c="dimmed" fw={600} style={{ letterSpacing: '1px' }}>
                    {group.label}
                  </Text>
                </Box>
                {groupFolders.map((folder) => (
                  <FolderSection
                    key={folder}
                    folder={folder}
                    files={sitemap[folder] || []}
                    selectedChatlog={selectedChatlog}
                    selectedChannel={selectedChannel}
                    onSelectChatlog={onSelectChatlog}
                    onSelectChannel={onSelectChannel}
                    searchQuery={searchQuery}
                  />
                ))}
              </Box>
            );
          })}
          {orderedMiscFolders.length > 0 && (
            <Box>
              <Box style={{ paddingTop: '6px', paddingBottom: '2px' }}>
                <Box
                  style={{
                    borderTop: '1px solid var(--mantine-color-dark-5)',
                    marginBottom: '6px'
                  }}
                />
                <Text size="xs" c="dimmed" fw={600} style={{ letterSpacing: '1px' }}>
                  Misc
                </Text>
              </Box>
              {orderedMiscFolders.map((folder) => (
                <FolderSection
                  key={folder}
                  folder={folder}
                  files={sitemap[folder] || []}
                  selectedChatlog={selectedChatlog}
                  selectedChannel={selectedChannel}
                  onSelectChatlog={onSelectChatlog}
                  onSelectChannel={onSelectChannel}
                  searchQuery={searchQuery}
                />
              ))}
            </Box>
          )}
        </Stack>
      </ScrollArea>
    </Box>
  );
}

export default Sidebar;