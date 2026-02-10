import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Group,
  Badge,
  Paper,
  Loader,
  Center,
  Alert,
  ActionIcon,
  CopyButton,
  Tooltip,
  Button
} from '@mantine/core';
import { IconCopy, IconCheck, IconExternalLink, IconArrowLeft } from '@tabler/icons-react';

function ChatlogViewer({ chatlogPath, onGoBack }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  
  // Extract info from chatlog path
  const [folder, filename] = chatlogPath.split('/');
  const cleanTitle = filename
    ?.replace(/\.html$/, '')
    ?.replace(/𝐓𝐫𝐮𝐜𝐞 ✧ - /, '')
    ?.replace(/[^-]*Archives[^-]*- /, '')
    ?.replace(/\s*\[\d+\]\s*$/, '') || 'Unknown';

  useEffect(() => {
    setLoading(true);
    setError(false);
    setHtmlContent('');

    // Fetch the HTML file content directly
    const fetchChatlog = async () => {
      try {
        const publicUrl = process.env.PUBLIC_URL || '';
        const response = await fetch(`${publicUrl}/${chatlogPath}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        let html = await response.text();
        
        // Inject CSS to make content fit properly
        const fitToScreenCSS = `
          <style>
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              height: auto;
              overflow-x: hidden !important;
            }
            .preamble {
              padding: 0.75rem !important;
            }
            .chatlog {
              padding: 0.5rem 0 !important;
              margin: 0 !important;
              max-height: none;
              overflow-y: auto !important;
            }
            body {
              zoom: 0.85;
              transform-origin: top left;
              width: 117.65%;
            }
          </style>
        `;
        
        // Insert the CSS before the closing head tag
        html = html.replace('</head>', fitToScreenCSS + '</head>');
        
        setHtmlContent(html);
        setLoading(false);
        setError(false);
      } catch (err) {
        console.error('Failed to load chatlog:', err);
        setLoading(false);
        setError(true);
      }
    };

    fetchChatlog();
  }, [chatlogPath]);

  const currentUrl = `${window.location.origin}${window.location.pathname}#/view/${encodeURIComponent(chatlogPath)}`;

  return (
    <Box style={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%', minHeight: 0 }}>
      {/* Header */}
      <Paper p="xs" mb="xs" radius="md" style={{ backgroundColor: 'var(--mantine-color-dark-6)', flexShrink: 0 }}>
        <Group justify="space-between" align="flex-start">
          <Group align="center" gap="xs">
            {onGoBack && (
              <Button 
                variant="subtle" 
                size="xs"
                leftSection={<IconArrowLeft size={12} />}
                onClick={onGoBack}
              >
                Back
              </Button>
            )}
            <Box>
              <Text size="xs" fw={600}>{cleanTitle}</Text>
              <Group gap="xs" align="center">
                <Badge size="xs" variant="light">{folder}</Badge>
              </Group>
            </Box>
          </Group>
          <Group gap="xs">
            <CopyButton value={currentUrl}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied!' : 'Copy link'}>
                  <ActionIcon 
                    color={copied ? 'teal' : 'gray'} 
                    variant="light" 
                    onClick={copy}
                    size="xs"
                  >
                    {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
            <Tooltip label="Open in new tab">
              <ActionIcon 
                variant="light" 
                onClick={() => {
                  // Open the file directly in a new tab
                  const publicUrl = process.env.PUBLIC_URL || '';
                  window.open(`${publicUrl}/${chatlogPath}`, '_blank');
                }}
                size="xs"
              >
                <IconExternalLink size={12} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Paper>

      {/* Content Area */}
      <Box style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', minHeight: 0, borderRadius: '8px', overflow: 'hidden', backgroundColor: '#36393e' }}>
        {loading && (
          <Center style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            zIndex: 1
          }}>
            <Group>
              <Loader size="md" />
              <Text c="dimmed">Loading chatlog...</Text>
            </Group>
          </Center>
        )}
        
        {error && !loading && (
          <Alert 
            color="red" 
            title="Failed to load chatlog"
            style={{ margin: 'var(--mantine-spacing-md)' }}
          >
            The chatlog file could not be loaded. Please check if the file exists and try again.
          </Alert>
        )}

        {htmlContent && !loading && (
          <iframe
            srcDoc={htmlContent}
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#36393e'
            }}
            title={`Chatlog: ${cleanTitle}`}
          />
        )}
      </Box>
    </Box>
  );
}

export default ChatlogViewer;