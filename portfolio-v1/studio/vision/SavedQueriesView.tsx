import React, {useState} from 'react'
import {Box, Card, Code, Flex, Heading, Stack, Text} from '@sanity/ui'
import {BookmarkIcon, CopyIcon, LaunchIcon} from '@sanity/icons'
import {definePlugin, type Tool} from 'sanity'
import {visionQueryList, type VisionQuery} from './queries'

function QueryCard({query, onCopied}: {query: VisionQuery; onCopied: () => void}) {
  const [copied, setCopied] = useState(false)
  return (
    <Card padding={4} radius={3} shadow={1} style={{border: '1px solid rgba(127,127,127,0.15)'}}>
      <Stack space={3}>
        <Flex align="center" gap={2}>
          <Heading size={2}>{query.title}</Heading>
          <Box flex={1} />
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(query.query)
              setCopied(true)
              onCopied()
              setTimeout(() => setCopied(false), 1500)
            }}
            style={{
              background: copied ? '#22c55e' : 'transparent',
              border: '1px solid rgba(127,127,127,0.3)',
              color: 'inherit',
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: 12,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <CopyIcon /> {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.assign('/studio/vision')
              }
            }}
            style={{
              background: 'transparent',
              border: '1px solid rgba(127,127,127,0.3)',
              color: 'inherit',
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: 12,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <LaunchIcon /> Open in Vision
          </button>
        </Flex>
        <Text size={1} muted>
          {query.description}
        </Text>
        <Code
          language="groq"
          as="pre"
          style={{
            background: 'rgba(127,127,127,0.08)',
            padding: 12,
            borderRadius: 6,
            fontSize: 12,
            overflowX: 'auto',
            margin: 0,
            maxHeight: 180,
          }}
        >
          {query.query}
        </Code>
      </Stack>
    </Card>
  )
}

function VisionQueriesView() {
  const [hint, setHint] = useState<string | null>(null)
  return (
    <Box style={{minHeight: '100%', background: 'var(--component-bg, #ffffff)'}}>
      <Stack space={5} padding={5}>
        <Card padding={5} radius={2} tone="primary">
          <Stack space={3}>
            <Flex align="center" gap={3}>
              <BookmarkIcon />
              <Heading size={4}>Saved Queries</Heading>
              <Box flex={1} />
              <Text size={1} muted>
                {visionQueryList.length} curated GROQ queries
              </Text>
            </Flex>
            <Text size={2} muted>
              The team&apos;s baseline queries for site health, stale content,
              broken references, expiring certifications, and featured
              coverage. Copy a query into Vision, or open Vision to author
              a new one.
            </Text>
            {hint && (
              <Card padding={3} radius={2} tone="positive">
                <Text size={1}>{hint}</Text>
              </Card>
            )}
          </Stack>
        </Card>
        <Stack space={3}>
          {visionQueryList.map((q) => (
            <QueryCard
              key={q.title}
              query={q}
              onCopied={() => setHint(`Copied "${q.title}" to clipboard. Paste into Vision.`)}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  )
}

const savedQueriesTool: Tool = {
  name: 'saved-queries',
  title: 'Saved Queries',
  icon: BookmarkIcon,
  component: VisionQueriesView,
}

export const savedQueriesToolPlugin = definePlugin(() => ({
  name: 'saved-queries-tool',
  tools: [savedQueriesTool],
}))
