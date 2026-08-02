import React, { useState } from 'react';
import {
  Box,
  Text,
  Group,
  Badge,
  Stack,
  ScrollArea,
  UnstyledButton,
  SimpleGrid,
  Paper,
  Collapse
} from '@mantine/core';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';

const ERA_CONFIG = [
  {
    label: 'General',
    emoji: '☆',
    color: '#d4af37',
    bg: 'rgba(212,175,55,0.08)',
    border: 'rgba(212,175,55,0.25)',
    description:
      'Server-wide channels covering the overarching storyline.',
    folders: [
      { name: 'Temple Archives ☆', description: 'Pre-game confessional temples where every player submitted their opening statement.' },
      { name: 'Rite of Apothea ☆', description: 'Chronicles, proclamations, and trials from the grand ceremony opening the season.' },
      { name: 'Sacrifice ☆', description: 'Every elimination ceremony across the season, from sacrifice one through twenty-one.' },
      { name: 'General Archives ☆', description: 'Cross-tribe channels, knight orders, and miscellaneous server-wide interactions.' },
    ],
  },
  {
    label: 'Finale',
    emoji: '🦋',
    color: '#a8d4f0',
    bg: 'rgba(168,212,240,0.08)',
    border: 'rgba(168,212,240,0.25)',
    description:
      'The final stretch of the game — the last temple confessionals of the remaining finalists and the grand hall where the season concluded.',
    folders: [
      { name: 'Finale Temples 🦋', description: 'Finale temple confessionals for the three finalists: Hydro, Lexi, and Wendi.' },
      { name: 'Finale 🦋', description: 'The grand hall — the final episode where the winner of Truce Season 2 was crowned.' },
      { name: 'Jury ☆', description: 'Final jury questioning, finalist speeches, and the ponderosa pregame lounge.' },

    ],
  },
  {
    label: 'Adlivun Era',
    emoji: '🌌',
    color: '#7ec8e3',
    bg: 'rgba(126,200,227,0.08)',
    border: 'rgba(126,200,227,0.25)',
    description:
      'The endgame merge phase set in Adlivun, the Inuit underworld. Ten players competed in the final tribal stage with alliances shifting rapidly toward the finale.',
    folders: [
      { name: 'Adlivun Archives 🌌', description: 'Tribe announcements, challenges, and the main social hub for the Adlivun merge.' },
      { name: 'Adlivun Archives 🌌 2', description: 'Second batch of one-on-one DMs between Adlivun players.' },
      { name: 'Adlivun Archives 🌌 3', description: 'Third batch of one-on-one DMs — later merge conversations.' },
      { name: 'Adlivun 1-on-1s 🌌', description: 'Private strategy calls between individual Adlivun players.' },
    ],
  },
  {
    label: 'Mesopotamian Era',
    emoji: '🐫',
    color: '#e8c07a',
    bg: 'rgba(232,192,122,0.08)',
    border: 'rgba(232,192,122,0.25)',
    description:
      'The final pre-merge phase split across two Mesopotamian river tribes the Euphrates and the Tigris fighting for the last couple of spots in merge.',
    folders: [
      { name: 'Euphrates Archives 🐫', description: 'Tribe hall, announcements, challenges, and alliance chats for the Euphrates tribe.' },
      { name: 'Euphrates 1-on-1s 🐫', description: 'Private one-on-one conversations between Euphrates tribe members.' },
      { name: 'Tigris Archives 🐪', description: 'Tribe hall, announcements, challenges, and alliance chats for the Tigris tribe.' },
      { name: 'Tigris 1-on-1s 🐪', description: 'Private one-on-one conversations between Tigris tribe members.' },
    ],
  },
  {
    label: 'Yoruba Era',
    emoji: '🐝',
    color: '#f5c542',
    bg: 'rgba(245,197,66,0.08)',
    border: 'rgba(245,197,66,0.25)',
    description:
      'Three tribes rooted in Yoruba mythology Aiye (the living world), Orun (the heavenly realm), and Igbodu (the sacred forest grove).',
    folders: [
      { name: 'Aiye Archives 🐝', description: 'Tribe hall, announcements, challenges, and alliances for the Aiye tribe.' },
      { name: 'Aiye 1-on-1s 🐝', description: 'Private one-on-one conversations between Aiye tribe members.' },
      { name: 'Orun Archives ☁️', description: 'Tribe hall, announcements, challenges, and alliances for the Orun tribe.' },
      { name: 'Orun 1-on-1s ☁️', description: 'Private one-on-one conversations between Orun tribe members.' },
      { name: 'Igbodu Archives 🪻', description: 'Tribe hall, announcements, challenges, and alliances for the Igbodu tribe.' },
      { name: 'Igbodu 1-on-1s 🪻', description: 'Private one-on-one conversations between Igbodu tribe members.' },
    ],
  },
  {
    label: 'Shinto Era',
    emoji: '🌸',
    color: '#f5a0c0',
    bg: 'rgba(245,160,192,0.08)',
    border: 'rgba(245,160,192,0.25)',
    description:
      'Three sacred Japanese mountains serving as tribe locations Mount Fuji, Mount Haku, and Mount Tateyama each with its own cast of players.',
    folders: [
      { name: 'Mount Fuji Archives 🌸', description: 'Tribe hall, announcements, challenges, and alliances for the Mount Fuji tribe.' },
      { name: 'Mount Fuji 1-on-1s 🌸', description: 'Private one-on-one conversations between Mount Fuji tribe members.' },
      { name: 'Mount Haku Archives 🫧', description: 'Tribe hall, announcements, challenges, and alliances for the Mount Haku tribe.' },
      { name: 'Mount Haku 1-on-1s 🫧', description: 'Private one-on-one conversations between Mount Haku tribe members.' },
      { name: 'Mount Tateyama Archives 🪭', description: 'Tribe hall, announcements, challenges, and alliances for the Mount Tateyama tribe.' },
      { name: 'Mount Tateyama 1-on-1s 🪭', description: 'Private one-on-one conversations between Mount Tateyama tribe members.' },
    ],
  },
  {
    label: 'Hindu Era',
    emoji: '🪷',
    color: '#c084fc',
    bg: 'rgba(192,132,252,0.08)',
    border: 'rgba(192,132,252,0.25)',
    description:
      'Four sacred Hindu pilgrimage sites as tribe locations Ayodhya, Haridwar, Kashi, and Tirupati. Forming the opening phase of the Rite of Apothea.',
    folders: [
      { name: 'Ayodhya Archives 🪷', description: 'Tribe hall, announcements, challenges, and alliances for the Ayodhya tribe.' },
      { name: 'Ayodhya 1-on-1s 🪷', description: 'Private one-on-one conversations between Ayodhya tribe members.' },
      { name: 'Haridwar Archives 🦢', description: 'Tribe hall, announcements, challenges, and alliances for the Haridwar tribe.' },
      { name: 'Haridwar 1-on-1s 🦢', description: 'Private one-on-one conversations between Haridwar tribe members.' },
      { name: 'Kashi Archives 🦚', description: 'Tribe hall, announcements, challenges, and alliances for the Kashi tribe.' },
      { name: 'Kashi 1-on-1s 🦚', description: 'Private one-on-one conversations between Kashi tribe members.' },
      { name: 'Tirupati  Archives 🪔', description: 'Tribe hall, announcements, challenges, and alliances for the Tirupati tribe.' },
      { name: 'Tirupati 1-on-1s 🪔', description: 'Private one-on-one conversations between Tirupati tribe members.' },
    ],
  },
];

function EraSection({ era, sitemap, onSelectChannel }) {
  const [open, setOpen] = useState(true);

  const availableFolders = era.folders.filter((f) => sitemap[f.name] !== undefined);
  if (availableFolders.length === 0) return null;

  const totalFiles = availableFolders.reduce((sum, f) => sum + (sitemap[f.name]?.length || 0), 0);

  return (
    <Box mb="xl">
      {/* Era header */}
      <UnstyledButton
        onClick={() => setOpen((o) => !o)}
        style={{ width: '100%', marginBottom: '12px' }}
      >
        <Group justify="space-between" align="center">
          <Group gap="sm" align="center">
            {open
              ? <IconChevronDown size={18} color={era.color} />
              : <IconChevronRight size={18} color={era.color} />
            }
            <Text
              fw={700}
              size="lg"
              style={{ color: era.color, letterSpacing: '0.5px', fontFamily: 'Georgia, serif' }}
            >
              {era.label}
            </Text>
            <Text size="xl" style={{ lineHeight: 1 }}>{era.emoji}</Text>
          </Group>
          <Group gap="xs">
            <Badge
              size="sm"
              variant="light"
              style={{ color: era.color, borderColor: era.border, backgroundColor: era.bg }}
            >
              {availableFolders.length} channels
            </Badge>
            <Badge
              size="sm"
              variant="light"
              style={{ color: era.color, borderColor: era.border, backgroundColor: era.bg }}
            >
              {totalFiles} chatlogs
            </Badge>
          </Group>
        </Group>
      </UnstyledButton>

      {/* Era description */}
      <Text size="sm" c="dimmed" mb="md" style={{ paddingLeft: '26px', lineHeight: 1.6 }}>
        {era.description}
      </Text>

      {/* Channel cards */}
      <Collapse in={open}>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="sm" style={{ paddingLeft: '26px' }}>
          {availableFolders.map((folder) => {
            const count = sitemap[folder.name]?.length || 0;
            return (
              <UnstyledButton
                key={folder.name}
                onClick={() => onSelectChannel(folder.name)}
                style={{ height: '100%' }}
              >
                <Paper
                  p="md"
                  radius="md"
                  style={{
                    backgroundColor: era.bg,
                    border: `1px solid ${era.border}`,
                    height: '100%',
                    transition: 'transform 150ms ease, box-shadow 150ms ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 4px 16px ${era.border}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Group justify="space-between" align="flex-start" mb="xs" wrap="nowrap">
                    <Text
                      fw={600}
                      size="sm"
                      style={{ color: era.color, flex: 1, lineHeight: 1.3 }}
                    >
                      {folder.name}
                    </Text>
                    <Badge
                      size="xs"
                      variant="outline"
                      style={{ color: era.color, borderColor: era.border, flexShrink: 0 }}
                    >
                      {count}
                    </Badge>
                  </Group>
                  <Text size="xs" c="dimmed" style={{ lineHeight: 1.5 }}>
                    {folder.description}
                  </Text>
                </Paper>
              </UnstyledButton>
            );
          })}
        </SimpleGrid>
      </Collapse>

      <Box style={{ borderBottom: '1px solid var(--mantine-color-dark-5)', marginTop: '24px' }} />
    </Box>
  );
}

function Season2Landing({ sitemap, onSelectChannel }) {
  const totalFolders = Object.keys(sitemap).length;
  const totalChatlogs = Object.values(sitemap).reduce((sum, files) => sum + files.length, 0);

  return (
    <ScrollArea style={{ height: '100%' }}>
      <Box p="xl" style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <Box mb="xl" style={{ textAlign: 'center' }}>
          <Text
            fw={700}
            style={{
              fontSize: 'clamp(24px, 4vw, 40px)',
              color: '#a8d4f0',
              fontFamily: 'Georgia, serif',
              letterSpacing: '1px',
              textShadow: '0 0 30px rgba(168,212,240,0.3)',
              marginBottom: '8px',
            }}
          >
            Truce: Rite of Apothea
          </Text>
          <Text
            style={{
              fontSize: 'clamp(13px, 2vw, 16px)',
              color: 'rgba(168,212,240,0.7)',
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              marginBottom: '20px',
            }}
          >
            Season 2 — Chatlog Archive
          </Text>

          {/* Stats */}
          <Group justify="center" gap="md">
            <Paper
              px="lg"
              py="sm"
              radius="md"
              style={{ backgroundColor: 'rgba(168,212,240,0.08)', border: '1px solid rgba(168,212,240,0.2)' }}
            >
              <Text size="xl" fw={700} style={{ color: '#a8d4f0', lineHeight: 1 }}>{totalFolders}</Text>
              <Text size="xs" c="dimmed">Categories</Text>
            </Paper>
            <Paper
              px="lg"
              py="sm"
              radius="md"
              style={{ backgroundColor: 'rgba(168,212,240,0.08)', border: '1px solid rgba(168,212,240,0.2)' }}
            >
              <Text size="xl" fw={700} style={{ color: '#a8d4f0', lineHeight: 1 }}>{totalChatlogs}</Text>
              <Text size="xs" c="dimmed">Chatlogs</Text>
            </Paper>
            <Paper
              px="lg"
              py="sm"
              radius="md"
              style={{ backgroundColor: 'rgba(168,212,240,0.08)', border: '1px solid rgba(168,212,240,0.2)' }}
            >
              <Text size="xl" fw={700} style={{ color: '#a8d4f0', lineHeight: 1 }}>7</Text>
              <Text size="xs" c="dimmed">Eras</Text>
            </Paper>
          </Group>

          <Text
            size="sm"
            c="dimmed"
            style={{ maxWidth: '640px', margin: '16px auto 0', lineHeight: 1.7 }}
          >
            Browse every conversation from Season 2. Use the sidebar to navigate directly to a
            channel, or click any category card below to explore its chatlogs.
          </Text>
        </Box>

        <Box style={{ borderBottom: '1px solid var(--mantine-color-dark-5)', marginBottom: '32px' }} />

        {/* Era sections */}
        <Stack gap={0}>
          {ERA_CONFIG.map((era) => (
            <EraSection
              key={era.label}
              era={era}
              sitemap={sitemap}
              onSelectChannel={onSelectChannel}
            />
          ))}
        </Stack>

      </Box>
    </ScrollArea>
  );
}

export default Season2Landing;
