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
  
  // Auto-open if this channel is selected
  useEffect(() => {
    if (selectedChannel === folder) {
      setOpened(true);
    }
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
  
  // Calculate total chatlogs
  const totalChatlogs = Object.values(sitemap).reduce((sum, files) => sum + files.length, 0);
  
  return (
    <Box h="100%" p="md">
      <Paper p="sm" mb="md" radius="md" style={{ backgroundColor: 'var(--mantine-color-dark-6)' }}>
        <Group justify="space-between" mb="xs">
          <Text size="sm" fw={500}>Archive Overview</Text>
          <Badge size="sm" variant="light">{folders.length} channels</Badge>
        </Group>
        <Text size="xs" c="dimmed">{totalChatlogs} total conversations</Text>
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
          {folders.map((folder) => (
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
        </Stack>
      </ScrollArea>
    </Box>
  );
}

export default Sidebar;