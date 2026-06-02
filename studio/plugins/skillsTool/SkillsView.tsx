import React, {useMemo, useState} from 'react'
import {Box, Card, Flex, Heading, Inline, Stack, Text, TextInput} from '@sanity/ui'
import {BookIcon, SearchIcon} from '@sanity/icons'
import {marked} from 'marked'
import {skills, type Skill} from './skillsLoader'

marked.setOptions({gfm: true, breaks: false})

const audienceTone: Record<string, {bg: string; fg: string}> = {
  editors: {bg: '#ec4899', fg: '#fff'},
  devs: {bg: '#6366f1', fg: '#fff'},
  both: {bg: '#22c55e', fg: '#fff'},
}

function SkillCard({skill, onOpen}: {skill: Skill; onOpen: (s: Skill) => void}) {
  const tone = (audienceTone[skill.frontmatter.audience ?? 'editors'] ?? audienceTone.editors)!
  return (
    <Card
      as="button"
      onClick={() => onOpen(skill)}
      padding={4}
      radius={3}
      shadow={1}
      style={{textAlign: 'left', cursor: 'pointer', border: '1px solid rgba(127,127,127,0.15)'}}
    >
      <Stack space={3}>
        <Inline space={2}>
          <Box
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 999,
              background: tone.bg,
              color: tone.fg,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            {skill.frontmatter.audience ?? 'editors'}
          </Box>
          {skill.frontmatter.time && (
            <Box
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 999,
                background: 'rgba(127,127,127,0.12)',
                letterSpacing: 0.5,
              }}
            >
              {skill.frontmatter.time}
            </Box>
          )}
        </Inline>
        <Heading size={2}>{skill.frontmatter.title ?? skill.slug}</Heading>
        <Text size={1} muted>
          {skill.frontmatter.trigger?.replace(/^"|"$/g, '') ?? skill.slug}
        </Text>
      </Stack>
    </Card>
  )
}

function SkillDetail({skill, onBack}: {skill: Skill; onBack: () => void}) {
  const html = useMemo(() => marked.parse(skill.body, {async: false}) as string, [skill.body])
  return (
    <Stack space={4} padding={5}>
      <Card padding={4} radius={2} tone="primary">
        <Flex align="center" gap={3}>
          <BookIcon />
          <Heading size={3}>{skill.frontmatter.title ?? skill.slug}</Heading>
          <Box flex={1} />
          <button
            type="button"
            onClick={onBack}
            style={{
              background: 'transparent',
              border: '1px solid rgba(127,127,127,0.3)',
              color: 'inherit',
              padding: '6px 12px',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            ← All skills
          </button>
        </Flex>
        {skill.frontmatter.trigger && (
          <Text size={1} muted style={{marginTop: 8}}>
            {skill.frontmatter.trigger.replace(/^"|"$/g, '')}
          </Text>
        )}
      </Card>
      <Card padding={5} radius={2}>
        <div
          className="skills-body"
          dangerouslySetInnerHTML={{__html: html}}
          style={{lineHeight: 1.6, fontSize: 15}}
        />
      </Card>
    </Stack>
  )
}

export function SkillsView() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<Skill | null>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return skills
    const q = query.toLowerCase()
    return skills.filter(
      (s) =>
        s.slug.includes(q) ||
        (s.frontmatter.title?.toLowerCase().includes(q) ?? false) ||
        (s.frontmatter.trigger?.toLowerCase().includes(q) ?? false) ||
        s.body.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <Box style={{minHeight: '100%', background: 'var(--component-bg, #ffffff)'}}>
      {open ? (
        <SkillDetail skill={open} onBack={() => setOpen(null)} />
      ) : (
        <Stack space={5} padding={5}>
          <Card padding={5} radius={2} tone="primary">
            <Stack space={4}>
              <Flex align="center" gap={3}>
                <BookIcon />
                <Heading size={4}>Skills</Heading>
                <Box flex={1} />
                <Text size={1} muted>
                  {skills.length} step-by-step recipes
                </Text>
              </Flex>
              <Text size={2} muted>
                Browse the studio&apos;s playbook. Each skill is a step-by-step
                recipe for a common task. Start with what you&apos;re trying to
                do, then follow the steps.
              </Text>
              <TextInput
                icon={SearchIcon}
                placeholder="Search skills (e.g. 'add a project', 'publish', 'deploy')"
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
              />
            </Stack>
          </Card>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {filtered.map((skill) => (
              <SkillCard key={skill.slug} skill={skill} onOpen={setOpen} />
            ))}
            {filtered.length === 0 && (
              <Card padding={5} radius={2} tone="transparent">
                <Text size={2} muted align="center">
                  No skills match &quot;{query}&quot;. Try a different search.
                </Text>
              </Card>
            )}
          </div>
        </Stack>
      )}
      <style>{`
        .skills-body h1 { font-size: 28px; font-weight: 700; margin: 16px 0 12px; }
        .skills-body h2 { font-size: 20px; font-weight: 700; margin: 24px 0 8px; padding-top: 8px; border-top: 1px solid rgba(127,127,127,0.15); }
        .skills-body h3 { font-size: 16px; font-weight: 700; margin: 16px 0 6px; }
        .skills-body p { margin: 8px 0; }
        .skills-body code { font-family: ui-monospace, monospace; font-size: 13px; background: rgba(127,127,127,0.1); padding: 2px 5px; border-radius: 3px; }
        .skills-body pre { background: rgba(127,127,127,0.08); padding: 12px; border-radius: 6px; overflow-x: auto; }
        .skills-body pre code { background: transparent; padding: 0; }
        .skills-body ul, .skills-body ol { margin: 8px 0 8px 24px; }
        .skills-body li { margin: 4px 0; }
        .skills-body a { color: #6366f1; text-decoration: underline; }
        .skills-body blockquote { border-left: 3px solid rgba(127,127,127,0.3); margin: 8px 0; padding: 4px 12px; color: rgba(127,127,127,0.85); }
        .skills-body table { border-collapse: collapse; margin: 12px 0; }
        .skills-body th, .skills-body td { border: 1px solid rgba(127,127,127,0.2); padding: 6px 10px; }
        .skills-body th { background: rgba(127,127,127,0.06); font-weight: 600; }
      `}</style>
    </Box>
  )
}
