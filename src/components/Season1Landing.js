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
    label: 'Truce: The Apotheion',
    emoji: '✧',
    color: '#d4af37',
    bg: 'rgba(212,175,55,0.08)',
    border: 'rgba(212,175,55,0.25)',
    description:
      'The final stage of Season 1 — the Apotheion endgame and its pre-game temple confessionals where every finalist made their case.',
    folders: [
      { name: 'The Apotheion', description: 'The grand endgame arena where the final players battled for the title of Truce champion.' },
      { name: 'Temples', description: 'Pre-game confessional temples submitted by every player before the season began.' },
    ],
  },
  {
    label: 'Finale',
    emoji: '🏆',
    color: '#f0c060',
    bg: 'rgba(240,192,96,0.08)',
    border: 'rgba(240,192,96,0.25)',
    description:
      'The final episode channels — where the season came to a close and the winner of Truce Season 1 was crowned.',
    folders: [
      { name: 'Finale', description: 'All finale channels: jury questions, finalist speeches, and the crowning moment.' },
    ],
  },
  {
    label: 'Varanitlan Era',
    emoji: '⚔️',
    color: '#a0c8a0',
    bg: 'rgba(160,200,160,0.08)',
    border: 'rgba(160,200,160,0.25)',
    description:
      'The late-game Varanitlan phase — individual one-on-ones, alliance war rooms, and the halls of Valhalla as players competed for the finale.',
    folders: [
      { name: 'Varanitilan 1on1s', description: 'Private one-on-one strategy conversations between Varanitlan-era players.' },
      { name: 'Varantilan Alliances', description: 'Alliance group chats formed during the Varanitlan phase.' },
      { name: 'Valhalla', description: 'The Valhalla tribe hall — announcements, challenges, and social interactions.' },
    ],
  },
  {
    label: 'Chinese Era',
    emoji: '🏯',
    color: '#e88060',
    bg: 'rgba(232,128,96,0.08)',
    border: 'rgba(232,128,96,0.25)',
    description:
      'Two tribes set in ancient China — Lingshan (the sacred mountain) and Chaangan (the imperial capital) — competing before the Varanitlan merge.',
    folders: [
      { name: 'Lingshan', description: 'Tribe hall, challenges, and social channels for the Lingshan tribe.' },
      { name: 'Chaangan', description: 'Tribe hall, challenges, and social channels for the Chaangan tribe.' },
    ],
  },
  {
    label: 'Norse Era',
    emoji: '🌊',
    color: '#80a8d8',
    bg: 'rgba(128,168,216,0.08)',
    border: 'rgba(128,168,216,0.25)',
    description:
      'Three tribes rooted in Norse mythology — Bifrost (the rainbow bridge), Midgard (the mortal realm), and Asgard (the realm of gods).',
    folders: [
      { name: 'Bifrost', description: 'Tribe hall, challenges, and social channels for the Bifrost tribe.' },
      { name: 'Midgard', description: 'Tribe hall, challenges, and social channels for the Midgard tribe.' },
      { name: 'Asgard', description: 'Tribe hall, challenges, and social channels for the Asgard tribe.' },
    ],
  },
  {
    label: 'Egyptian Era',
    emoji: '🌅',
    color: '#e8b840',
    bg: 'rgba(232,184,64,0.08)',
    border: 'rgba(232,184,64,0.25)',
    description:
      'Four tribes drawn from Egyptian mythology — Aaru (the field of reeds), Akhet (the horizon), Nun (the primordial waters), and cross-realm interactions.',
    folders: [
      { name: 'Aaru', description: 'Tribe hall, challenges, and social channels for the Aaru tribe.' },
      { name: 'Akhet', description: 'Tribe hall, challenges, and social channels for the Akhet tribe.' },
      { name: 'Nun', description: 'Tribe hall, challenges, and social channels for the Nun tribe.' },
      { name: 'Across Realms - Egypt', description: 'Cross-tribe channels and interactions spanning the Egyptian era.' },
    ],
  },
  {
    label: 'Greek Era',
    emoji: '🏛️',
    color: '#c0a0e0',
    bg: 'rgba(192,160,224,0.08)',
    border: 'rgba(192,160,224,0.25)',
    description:
      'The opening phase of Season 1 — four tribes named after primordial Greek concepts: Aether (the upper sky), Khaos (the void), Pontus (the sea), and Erebus (darkness).',
    folders: [
      { name: 'Aether', description: 'Tribe hall, challenges, and social channels for the Aether tribe.' },
      { name: 'Khaos', description: 'Tribe hall, challenges, and social channels for the Khaos tribe.' },
      { name: 'Pontus', description: 'Tribe hall, challenges, and social channels for the Pontus tribe.' },
      { name: 'Erebus', description: 'Tribe hall, challenges, and social channels for the Erebus tribe.' },
    ],
  },
  {
    label: 'General',
    emoji: '📋',
    color: '#909090',
    bg: 'rgba(144,144,144,0.08)',
    border: 'rgba(144,144,144,0.25)',
    description:
      'Server-wide channels spanning the full season — elimination logs, challenge archives, and general server interactions.',
    folders: [
      { name: 'Eliminations', description: 'Every elimination and vote-off across the full season in one place.' },
      { name: 'Challenges', description: 'Challenge announcements, results, and reactions across all eras.' },
      { name: 'General', description: 'General server-wide conversations and miscellaneous interactions.' },
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

function Season1Landing({ sitemap, onSelectChannel }) {
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
              color: '#d4af37',
              fontFamily: 'Georgia, serif',
              letterSpacing: '1px',
              textShadow: '0 0 30px rgba(212,175,55,0.3)',
              marginBottom: '8px',
            }}
          >
            Truce: Season One
          </Text>
          <Text
            style={{
              fontSize: 'clamp(13px, 2vw, 16px)',
              color: 'rgba(212,175,55,0.7)',
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              marginBottom: '20px',
            }}
          >
            Season 1 — Chatlog Archive
          </Text>

          {/* Stats */}
          <Group justify="center" gap="md">
            <Paper
              px="lg"
              py="sm"
              radius="md"
              style={{ backgroundColor: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}
            >
              <Text size="xl" fw={700} style={{ color: '#d4af37', lineHeight: 1 }}>{totalFolders}</Text>
              <Text size="xs" c="dimmed">Categories</Text>
            </Paper>
            <Paper
              px="lg"
              py="sm"
              radius="md"
              style={{ backgroundColor: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}
            >
              <Text size="xl" fw={700} style={{ color: '#d4af37', lineHeight: 1 }}>{totalChatlogs}</Text>
              <Text size="xs" c="dimmed">Chatlogs</Text>
            </Paper>
            <Paper
              px="lg"
              py="sm"
              radius="md"
              style={{ backgroundColor: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}
            >
              <Text size="xl" fw={700} style={{ color: '#d4af37', lineHeight: 1 }}>8</Text>
              <Text size="xs" c="dimmed">Eras</Text>
            </Paper>
          </Group>

          <Text
            size="sm"
            c="dimmed"
            style={{ maxWidth: '640px', margin: '16px auto 0', lineHeight: 1.7 }}
          >
            Browse every conversation from Season 1. Use the sidebar to navigate directly to a
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

export default Season1Landing;
