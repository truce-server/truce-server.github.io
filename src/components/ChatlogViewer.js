import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Button,
  TextInput,
  ScrollArea,
  Stack,
  Highlight
} from '@mantine/core';
import { IconCopy, IconCheck, IconExternalLink, IconArrowLeft, IconSearch } from '@tabler/icons-react';

function ChatlogViewer({ chatlogPath, onGoBack, basePath = 'season-1', resolveChatlogPath, themeColors }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [pendingSearch, setPendingSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const iframeRef = useRef(null);
  const highlightTimerRef = useRef(null);
  const scrollStopTimerRef = useRef(null);
  
  // Extract info from chatlog path
  const pathParts = chatlogPath.split('/');
  const folder = pathParts[0];
  const filename = pathParts[pathParts.length - 1];
  const cleanTitle = filename
    ?.replace(/\.html$/, '')
    ?.replace(/^(?:Truce|Truce S2[^-]*) - [^-]+ - /, '')  // strip "Truce - Category - " prefix
    ?.replace(/^(?:Truce|Truce S2[^-]*) - /, '')            // strip any remaining "Truce - " prefix
    ?.replace(/\s*\[\d+\]\s*$/, '') || 'Unknown';

  const palette = useMemo(() => {
    if (!themeColors) {
      return null;
    }

    return {
      light: themeColors[0],
      accent: themeColors[1],
      mid: themeColors[2],
      dark: themeColors[3],
      deepest: themeColors[4]
    };
  }, [themeColors]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setHtmlContent('');

    // Fetch the HTML file content directly
    const fetchChatlog = async () => {
      try {
        const publicUrl = process.env.PUBLIC_URL || '';
        const resolvedChatlogPath = resolveChatlogPath ? resolveChatlogPath(chatlogPath) : chatlogPath;
        const safeChatlogPath = resolvedChatlogPath
          .split('/')
          .map((segment) => encodeURIComponent(segment))
          .join('/');

        const isAbsolutePublicUrl = /^https?:\/\//i.test(publicUrl);
        const normalizedPublicUrl = publicUrl.replace(/\/+$/, '');
        const baseCandidates = [normalizedPublicUrl, window.location.origin + (!isAbsolutePublicUrl ? normalizedPublicUrl : '')]
          .filter((base, index, list) => base !== '' ? list.indexOf(base) === index : true);

        const fetchHtml = async (base) => {
          const url = base ? `${base}/${safeChatlogPath}` : `/${safeChatlogPath}`;
          const response = await fetch(url, { cache: 'no-store' });
          const text = await response.text();
          return { response, text, url };
        };

        let html = '';
        let response = null;
        let lastUrl = '';
        let resolvedChatlog = false;

        for (const base of baseCandidates) {
          const result = await fetchHtml(base);
          response = result.response;
          html = result.text;
          lastUrl = result.url;

          const looksLikeAppShell = html.includes('id="root"');
          if (response.ok && !looksLikeAppShell) {
            resolvedChatlog = true;
            break;
          }
        }

        if (!response || !response.ok || !resolvedChatlog) {
          throw new Error(`HTTP error! status: ${response ? response.status : 'unknown'} (${lastUrl})`);
        }

        // Disable timestamp anchor navigation to avoid hash changes in the iframe
        html = html
          .replace(/href=["']?#chatlog__message-container-[^"'\s>]+["']?/g, 'href="javascript:void(0)"')
          .replace(/href=["']?#chatlog__message-container-[^"'\s>]+/g, 'href="javascript:void(0)"');
        
        // Inject CSS to make content fully expandable with scrolling inside iframe
        const fitToScreenCSS = `
          <style>
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              height: 100% !important;
              width: 100% !important;
              overflow: auto !important;
            }
            body {
              display: flex;
              flex-direction: column;
            }
            .preamble {
              padding: 1rem !important;
              margin: 0 !important;
              flex-shrink: 0;
            }
            .chatlog {
              padding: 0.5rem 1rem !important;
              margin: 0 !important;
              max-height: none !important;
              height: auto !important;
              width: 100% !important;
              overflow-y: auto !important;
              overflow-x: hidden !important;
              display: flex;
              flex-direction: column;
              flex: 1;
            }
            .chatlog__message-group {
              margin-bottom: 1rem !important;
              flex-shrink: 0;
            }
            .chatlog__message-container.search-highlight {
              outline: 2px solid rgba(212, 175, 55, 0.9);
              box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.35);
              border-radius: 6px;
              transition: outline 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
            }
            .chatlog__timestamp a,
            .chatlog__short-timestamp {
              pointer-events: none !important;
              cursor: default !important;
              text-decoration: none !important;
            }
            * {
              box-sizing: border-box;
            }
          </style>
        `;

        const themeCSS = palette ? `
          <style>
            body {
              background: ${palette.deepest} !important;
              color: ${palette.light} !important;
            }
            .preamble {
              background: ${palette.dark} !important;
              color: ${palette.light} !important;
              border-bottom: 1px solid ${palette.mid} !important;
            }
            .chatlog__message-group {
              border-left: 2px solid ${palette.mid} !important;
              padding-left: 8px !important;
            }
            .chatlog__author-name {
              color: ${palette.accent} !important;
            }
            .chatlog__timestamp,
            .chatlog__short-timestamp {
              color: ${palette.mid} !important;
            }
            .chatlog__content,
            .chatlog__message,
            .chatlog__description,
            .chatlog__embed-description {
              color: ${palette.light} !important;
            }
            .chatlog__reaction {
              background: ${palette.dark} !important;
              border-color: ${palette.mid} !important;
              color: ${palette.light} !important;
            }
            .chatlog__embed {
              background: ${palette.dark} !important;
              border-color: ${palette.mid} !important;
            }
            .chatlog__message-container.search-highlight {
              outline: 2px solid ${palette.accent} !important;
              box-shadow: 0 0 0 3px rgba(199, 153, 211, 0.35) !important;
            }
            a {
              color: ${palette.light} !important;
            }
          </style>
        ` : '';

        const linkTargetScript = `
          <script>
            document.addEventListener('DOMContentLoaded', function () {
              document.addEventListener('click', function (event) {
                var link = event.target.closest('a');
                if (!link) return;
                event.preventDefault();
                event.stopPropagation();

                var href = link.getAttribute('href') || '';
                if (href.startsWith('#')) {
                  var target = document.querySelector(href);
                  if (target && typeof target.scrollIntoView === 'function') {
                    target.scrollIntoView({ block: 'center' });
                  }
                  return;
                }

                var absolute = link.href || href;
                window.open(absolute, '_blank', 'noopener,noreferrer');
              }, true);

              document.querySelectorAll('a').forEach(function (link) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
              });
            });
          </script>
        `;
        
        // Insert the CSS and base target before the closing head tag
        html = html.replace(
          '</head>',
          fitToScreenCSS + themeCSS + '<base target="_blank" /></head>'
        );
        html = html.replace('</body>', linkTargetScript + '</body>');
        
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
  }, [chatlogPath, resolveChatlogPath, themeColors, palette]);

  // Extract message list from HTML for searching
  useEffect(() => {
    if (htmlContent) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const containers = Array.from(doc.querySelectorAll('.chatlog__message-container'));
      const parsedMessages = containers
        .map((container) => {
          const id = container.getAttribute('id');
          const author = container.querySelector('.chatlog__author')?.textContent?.trim() || '';
          const timestamp = container.querySelector('.chatlog__timestamp')?.textContent?.trim() || '';
          const content = container.querySelector('.chatlog__content')?.textContent?.trim() || '';
          if (!id || !content) {
            return null;
          }
          return {
            id,
            author,
            timestamp,
            text: `${author} ${timestamp} ${content}`.trim(),
            preview: content
          };
        })
        .filter(Boolean);

      setMessages(parsedMessages);
      setSearchResults([]);
      setCurrentResultIndex(0);
    }
  }, [htmlContent]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setCurrentResultIndex(0);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = messages
      .filter((message) => message.text.toLowerCase().includes(query))
      .map((message, index) => ({
        ...message,
        index
      }));

    setSearchResults(results);
    setCurrentResultIndex(0);
  }, [searchQuery, messages]);

  const scrollToMessage = (messageId) => {
    const doc = iframeRef.current?.contentWindow?.document;
    const target = doc?.getElementById(messageId);
    const iframeWin = iframeRef.current?.contentWindow;
    if (!target || typeof target.scrollIntoView !== 'function') return;

    target.scrollIntoView({ block: 'center' });

    const applyHighlight = () => {
      const prevBoxShadow = target.style.boxShadow;
      const prevBackground = target.style.backgroundColor;

      target.style.boxShadow = '0 0 12px rgba(212, 175, 55, 0.22)';
      target.style.backgroundColor = 'rgba(212, 175, 55, 0.04)';

      if (highlightTimerRef.current) {
        window.clearTimeout(highlightTimerRef.current);
      }
      highlightTimerRef.current = window.setTimeout(() => {
        target.style.boxShadow = prevBoxShadow;
        target.style.backgroundColor = prevBackground;
      }, 1200);
    };

    if (!iframeWin) {
      applyHighlight();
      return;
    }

    const onScroll = () => {
      if (scrollStopTimerRef.current) {
        iframeWin.clearTimeout(scrollStopTimerRef.current);
      }
      scrollStopTimerRef.current = iframeWin.setTimeout(() => {
        iframeWin.removeEventListener('scroll', onScroll, true);
        applyHighlight();
      }, 150);
    };

    iframeWin.addEventListener('scroll', onScroll, true);
    onScroll();
  };

  const [currentFolder, ...currentFileParts] = chatlogPath.split('/');
  const currentFile = currentFileParts.join('/');
  const currentUrl = `${window.location.origin}/${basePath}/${encodeURIComponent(currentFolder)}/${encodeURIComponent(currentFile)}`;

  return (
    <Box style={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%', minHeight: 0 }}>
      {/* Header */}
      <Paper
        p="sm"
        mb="xs"
        radius="md"
        style={{
          backgroundColor: palette ? palette.dark : 'var(--mantine-color-dark-6)',
          border: palette ? `1px solid ${palette.mid}` : undefined,
          flexShrink: 0,
          marginTop: '8px'
        }}
      >
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
                  const publicUrl = process.env.PUBLIC_URL || '';
                  const resolvedChatlogPath = resolveChatlogPath ? resolveChatlogPath(chatlogPath) : chatlogPath;
                  window.open(`${publicUrl}/${resolvedChatlogPath}`, '_blank');
                }}
                size="xs"
              >
                <IconExternalLink size={12} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Paper>

      {/* Main Content with Search Sidebar */}
      <Box style={{ flex: 1, display: 'flex', gap: '0', minHeight: 0 }}>
        {/* Chatlog Content Area */}
        <Box
          style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            backgroundColor: palette ? palette.deepest : '#36393e'
          }}
        >
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
              ref={iframeRef}
              srcDoc={htmlContent}
              sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                border: 'none',
                backgroundColor: palette ? palette.deepest : '#36393e'
              }}
              title={`Chatlog: ${cleanTitle}`}
            />
          )}
        </Box>

        {/* Search Sidebar */}
        <Box style={{
          width: '240px',
          borderLeft: palette ? `1px solid ${palette.mid}` : '1px solid var(--mantine-color-dark-5)',
          backgroundColor: palette ? palette.deepest : 'var(--mantine-color-dark-7)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0
        }}>
          <Stack p="sm" gap="sm" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {/* Search Input */}
            <TextInput
              placeholder="Search messages..."
              icon={<IconSearch size={14} />}
              value={pendingSearch}
              onChange={(e) => setPendingSearch(e.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  setSearchQuery(pendingSearch);
                }
              }}
              size="sm"
              styles={palette ? { input: { backgroundColor: palette.dark, color: palette.light, borderColor: palette.mid } } : undefined}
              rightSection={pendingSearch && (
                <ActionIcon
                  size="sm"
                  variant="transparent"
                  onClick={() => {
                    setPendingSearch('');
                    setSearchQuery('');
                  }}
                >
                  ×
                </ActionIcon>
              )}
            />

            {/* Results Count */}
            {searchResults.length > 0 && (
              <Text size="xs" c="dimmed">
                {searchResults.length} results {searchResults.length > 0 && `(${currentResultIndex + 1}/${searchResults.length})`}
              </Text>
            )}

            {/* Search Results */}
            <ScrollArea style={{ flex: 1, overflow: 'hidden' }}>
              {searchResults.length === 0 && searchQuery && (
                <Text size="sm" c="dimmed" ta="center" py="md">
                  No results found
                </Text>
              )}
              {searchResults.map((result, idx) => (
                <Paper
                  key={idx}
                  p="xs"
                  mb="xs"
                  radius="sm"
                  style={{
                    cursor: 'pointer',
                    backgroundColor: palette
                      ? (idx === currentResultIndex ? palette.mid : palette.dark)
                      : (idx === currentResultIndex ? 'var(--mantine-color-blue-8)' : 'var(--mantine-color-dark-6)'),
                    border: palette
                      ? `1px solid ${idx === currentResultIndex ? palette.accent : palette.mid}`
                      : (idx === currentResultIndex ? '1px solid var(--mantine-color-blue-5)' : '1px solid var(--mantine-color-dark-5)')
                  }}
                  onClick={() => {
                    setCurrentResultIndex(idx);
                    scrollToMessage(result.id);
                  }}
                >
                  <Text size="xs" c="dimmed" mb={4}>
                    {result.author} {result.timestamp}
                  </Text>
                  <Highlight
                    highlight={searchQuery}
                    size="sm"
                    truncate="end"
                    weight={500}
                  >
                    {result.preview.substring(0, 120)}
                  </Highlight>
                </Paper>
              ))}
            </ScrollArea>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default ChatlogViewer;