import React from 'react'
import {Box, Card, Flex, Heading, Stack, Text} from '@sanity/ui'
import {LaunchIcon, BookIcon, EditIcon, EyeOpenIcon} from '@sanity/icons'
import {getStudioEnvSnapshot} from '../env'

const QUICK_LAUNCH = [
  {id: 'heroSection', title: 'Hero Section', subtitle: 'Top of homepage', type: 'heroSection'},
  {id: 'aboutSection', title: 'About Section', subtitle: 'Main column', type: 'aboutSection'},
  {id: 'siteSettings', title: 'Site Settings', subtitle: 'Title, og, robots', type: 'siteSettings'},
  {id: 'post', title: 'Posts', subtitle: 'Blog content', type: 'post'},
] as const

export function PresentationNavigator(_props: unknown) {
  const env = getStudioEnvSnapshot()

  const openInStudio = (id: string, type: string) => {
    if (typeof window === 'undefined') return
    const intentUrl = `/studio/structure/intent/edit/id=${encodeURIComponent(id)};type=${encodeURIComponent(type)};`
    window.location.assign(intentUrl)
  }

  const openList = (type: string) => {
    if (typeof window === 'undefined') return
    window.location.assign(`/studio/structure/${encodeURIComponent(type)}`)
  }

  return (
    <Box
      style={{
        minHeight: '100%',
        background: 'var(--component-bg, #ffffff)',
        borderRight: '1px solid rgba(127,127,127,0.15)',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        fontSize: 14,
      }}
    >
      <Stack space={3}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: '#ff63a5',
          }}
        >
          Presentation
        </div>
        <Heading size={3}>Edit on the live site</Heading>
        <Text size={1} muted>
          Pick a document on the left, then click any element in the live preview
          on the right to jump to that field. Your edits are visible within ~500ms.
        </Text>
      </Stack>

      <Card padding={4} radius={2} tone="primary">
        <Stack space={3}>
          <Flex align="center" gap={2}>
            <EyeOpenIcon />
            <Text size={1} weight="semibold">
              Live site
            </Text>
            <Box flex={1} />
            <a
              href={env.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'inherit',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
                textDecoration: 'underline',
              }}
            >
              {env.siteUrl.replace(/^https?:\/\//, '')} <LaunchIcon />
            </a>
          </Flex>
        </Stack>
      </Card>

      <Stack space={2}>
        <Text size={1} weight="semibold" muted>
          QUICK LAUNCH
        </Text>
        {QUICK_LAUNCH.map((doc) => (
          <button
            key={doc.id}
            type="button"
            onClick={() => {
              if (doc.type === 'post') {
                openList(doc.type)
              } else {
                openInStudio(doc.id, doc.type)
              }
            }}
            style={{
              padding: 12,
              borderRadius: 8,
              background: 'rgba(127,127,127,0.04)',
              border: '1px solid rgba(127,127,127,0.15)',
              color: 'inherit',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <EditIcon />
            <span style={{flex: 1, fontWeight: 600, fontSize: 13}}>{doc.title}</span>
            <span style={{fontSize: 11, opacity: 0.6}}>{doc.subtitle}</span>
          </button>
        ))}
      </Stack>

      <Card padding={4} radius={2} tone="transparent">
        <Flex align="center" gap={2}>
          <BookIcon />
          <Text size={1} weight="semibold">
            Need help?
          </Text>
          <Box flex={1} />
          <a
            href="/studio/skills"
            style={{fontSize: 12, color: 'inherit', textDecoration: 'underline'}}
          >
            Browse skills
          </a>
        </Flex>
      </Card>
    </Box>
  )
}
