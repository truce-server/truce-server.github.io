import React, { useCallback, useMemo } from 'react';
import {
  Box,
  Text,
  Group,
  Badge,
  Paper,
  Grid,
  Card,
  ScrollArea
} from '@mantine/core';
import { IconMessageCircle, IconCalendar } from '@tabler/icons-react';

function ChannelView({ channelName, chatlogs, onSelectChatlog, resolveChatlogPath }) {
  // Extract metadata from chatlog filename
  const getChatlogMetadata = (filename) => {
    const cleanTitle = filename
      .replace(/\.html$/, '')
      .replace(/^(?:Truce|Truce S2[^-]*) - [^-]+ - /, '')  // strip "Truce - Category - " prefix
      .replace(/^(?:Truce|Truce S2[^-]*) - /, '')            // strip any remaining "Truce - " prefix
      .replace(/\s*\[\d+\]\s*$/, '');

    // Extract ID from filename for sorting
    const idMatch = filename.match(/\[(\d+)\]/);
    const id = idMatch ? parseInt(idMatch[1]) : 0;

    // Convert Discord snowflake to approximate date (rough estimation)
    const getDateFromSnowflake = (snowflakeId) => {
      // Discord snowflake timestamp extraction without BigInt
      // This is a simplified version that works with regular numbers for most cases
      const snowflakeStr = snowflakeId.toString();
      if (snowflakeStr.length < 10) return null;
      
      // Extract approximate timestamp (may lose precision for very large IDs)
      const binaryStr = parseInt(snowflakeId).toString(2);
      if (binaryStr.length < 22) return null;
      
      const timestampBits = binaryStr.slice(0, -22);
      const timestamp = parseInt(timestampBits, 2) + 1420070400000;
      return new Date(timestamp);
    };

    const date = id > 0 ? getDateFromSnowflake(id) : null;

    // Extract participants from title (simple heuristic)
    const extractParticipants = (title) => {
      // Look for common patterns like "user1-user2" or "user1 and user2"
      const participants = title
        .split(/[-\s]+/)
        .filter(part => part.length > 2 && !['the', 'and', 'of', 'in'].includes(part.toLowerCase()))
        .slice(0, 3); // Limit to first 3 for display
      return participants;
    };

    return {
      title: cleanTitle,
      date: date,
      participants: extractParticipants(cleanTitle),
      id: id
    };
  };

  const chatlogItems = useMemo(() => {
    return [...chatlogs]
      .map((chatlog) => ({ chatlog, metadata: getChatlogMetadata(chatlog) }))
      .sort((a, b) => b.metadata.id - a.metadata.id);
  }, [chatlogs]);

  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const applyPreviewStyles = useCallback((iframe) => {
    try {
      const doc = iframe?.contentDocument;
      if (!doc || doc.getElementById('preview-style')) {
        return;
      }

      const style = doc.createElement('style');
      style.id = 'preview-style';
      style.textContent = `
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
        }
        body {
          display: block !important;
        }
      `;
      doc.head.appendChild(style);
    } catch (err) {
      // Ignore cross-origin or access errors in preview iframe
    }
  }, []);

  return (
    <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper p="md" mb="md" radius="md" style={{ backgroundColor: 'var(--mantine-color-dark-6)' }}>
        <Group justify="space-between" align="center" wrap="nowrap">
          <Box>
            <Text size="xl" fw={600} mb={4}>{channelName}</Text>
            <Group gap="xs">
              <Badge size="sm" variant="light" color="blue">
                <Group gap="xs">
                  <IconMessageCircle size={12} />
                  {chatlogs.length} conversations
                </Group>
              </Badge>
            </Group>
          </Box>
        </Group>
      </Paper>

      {/* Chatlog Grid */}
      <ScrollArea style={{ flex: 1 }}>
        <Grid>
          {chatlogItems.map(({ chatlog, metadata }, index) => {
            const chatlogPath = `${channelName}/${chatlog}`;
            const resolvedChatlogPath = resolveChatlogPath ? resolveChatlogPath(chatlogPath) : chatlogPath;
            const safeChatlogPath = resolvedChatlogPath
              .split('/')
              .map((segment) => encodeURIComponent(segment))
              .join('/');
            const publicUrl = process.env.PUBLIC_URL || '';
            const previewSrc = `${publicUrl}/${safeChatlogPath}`;

            return (
              <Grid.Col span={{ base: 12, lg: 6 }} key={index}>
                <Card
                  shadow="sm"
                  padding="md"
                  radius="md"
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    backgroundColor: 'var(--mantine-color-dark-6)',
                    border: '1px solid var(--mantine-color-dark-4)',
                    height: '400px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                  onClick={() => onSelectChatlog(chatlogPath)}
                >
                  {/* Header with metadata */}
                  <Box mb="md">
                    <Text 
                      size="md" 
                      fw={500} 
                      lineClamp={2}
                      mb="xs"
                    >
                      {metadata.title}
                    </Text>
                    
                    <Group justify="space-between" align="center">
                      <Group gap="xs">
                        <IconCalendar size={12} />
                        <Text size="xs" c="dimmed">{formatDate(metadata.date)}</Text>
                      </Group>
                      
                      <Group gap={4}>
                        {metadata.participants.slice(0, 2).map((participant, i) => (
                          <Badge 
                            key={i} 
                            size="xs" 
                            variant="light" 
                            color="gray"
                            style={{ textTransform: 'none' }}
                          >
                            {participant}
                          </Badge>
                        ))}
                        {metadata.participants.length > 2 && (
                          <Badge size="xs" variant="light" color="gray">
                            +{metadata.participants.length - 2}
                          </Badge>
                        )}
                      </Group>
                    </Group>
                  </Box>

                  {/* HTML Preview */}
                  <Box
                    style={{
                      flex: 1,
                      position: 'relative',
                      border: '1px solid var(--mantine-color-dark-4)',
                      borderRadius: '6px',
                      overflow: 'hidden'
                    }}
                  >
                    <iframe
                      src={previewSrc}
                      loading={index < 6 ? 'eager' : 'lazy'}
                      onLoad={(event) => applyPreviewStyles(event.currentTarget)}
                      style={{
                        border: 'none',
                        pointerEvents: 'none',
                        width: '100%',
                        height: '100%',
                        display: 'block',
                        backgroundColor: 'transparent'
                      }}
                      title={`Preview: ${metadata.title}`}
                    />
                  </Box>
                </Card>
              </Grid.Col>
            );
          })}
        </Grid>
      </ScrollArea>
    </Box>
  );
}

export default ChannelView;