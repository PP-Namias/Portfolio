import React from 'react'
import {Box, Card, Flex, Heading, Stack, Text, Badge} from '@sanity/ui'
import {LaunchIcon, EditIcon, EyeOpenIcon, DocumentsIcon, CogIcon, ClockIcon} from '@sanity/icons'
import {getStudioEnvSnapshot} from '../env'

const QUICK_LAUNCH = [
  {id: 'profileSingleton', title: 'Hero & Profile', subtitle: 'Name, title, roles', type: 'profile', icon: '👤'},
  {id: 'aboutSectionSingleton', title: 'About Section', subtitle: 'Bio, education', type: 'aboutSection', icon: '📝'},
  {id: 'siteSettingsSingleton', title: 'Site Settings', subtitle: 'Title, og, robots', type: 'siteSettings', icon: '⚙️'},
  {id: 'post', title: 'Posts', subtitle: 'Blog content', type: 'post', icon: '📰'},
  {id: 'project', title: 'Projects', subtitle: 'Portfolio items', type: 'project', icon: '🚀'},
  {id: 'certification', title: 'Certifications', subtitle: 'Credentials', type: 'certification', icon: '🏅'},
] as const

const RECENT_DOCS = [
  {type: 'profile', title: 'Profile'},
  {type: 'aboutSection', title: 'About'},
  {type: 'project', title: 'Projects'},
  {type: 'post', title: 'Posts'},
  {type: 'certification', title: 'Certifications'},
  {type: 'experience', title: 'Experience'},
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
          Pick a document below, then click any element in the live preview
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
        <Flex align="center" gap={2}>
          <Text size={1} weight="semibold" muted>
            QUICK LAUNCH
          </Text>
          <Badge tone="primary" fontSize={0}>
            {QUICK_LAUNCH.length}
          </Badge>
        </Flex>
        {QUICK_LAUNCH.map((doc) => (
          <button
            key={doc.id}
            type="button"
            onClick={() => {
              if (doc.type === 'post' || doc.type === 'project' || doc.type === 'certification') {
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
              transition: 'background 120ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(127,127,127,0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(127,127,127,0.04)'
            }}
          >
            <span style={{fontSize: 16}}>{doc.icon}</span>
            <span style={{flex: 1, fontWeight: 600, fontSize: 13}}>{doc.title}</span>
            <span style={{fontSize: 11, opacity: 0.6}}>{doc.subtitle}</span>
          </button>
        ))}
      </Stack>

      <Stack space={2}>
        <Flex align="center" gap={2}>
          <ClockIcon />
          <Text size={1} weight="semibold" muted>
            BROWSE BY TYPE
          </Text>
        </Flex>
        {RECENT_DOCS.map((doc) => (
          <button
            key={doc.type}
            type="button"
            onClick={() => openList(doc.type)}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              background: 'transparent',
              border: '1px solid rgba(127,127,127,0.1)',
              color: 'inherit',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              transition: 'background 120ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(127,127,127,0.04)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <DocumentsIcon />
            <span style={{flex: 1, fontWeight: 500}}>{doc.title}</span>
            <span style={{fontSize: 10, opacity: 0.5}}>→</span>
          </button>
        ))}
      </Stack>

      <Card padding={4} radius={2} tone="transparent">
        <Flex align="center" gap={2}>
          <CogIcon />
          <Text size={1} weight="semibold">
            Tools
          </Text>
          <Box flex={1} />
          <a
            href="/studio/vision"
            style={{fontSize: 12, color: 'inherit', textDecoration: 'underline', marginRight: 8}}
          >
            Vision
          </a>
          <a
            href="/studio/structure/saved-queries"
            style={{fontSize: 12, color: 'inherit', textDecoration: 'underline'}}
          >
            Queries
          </a>
        </Flex>
      </Card>
    </Box>
  )
}
