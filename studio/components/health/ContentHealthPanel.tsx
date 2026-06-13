import React, {useEffect, useState, useCallback} from 'react'
import {Card, Stack, Text, Badge, Button, Flex, Box} from '@sanity/ui'
import {useClient} from 'sanity'
import {CheckmarkCircleIcon, WarningFilledIcon, ClockIcon, RefreshIcon} from '@sanity/icons'

interface HealthIssue {
  id: string
  type: 'missing' | 'stale' | 'incomplete' | 'orphaned'
  severity: 'error' | 'warning' | 'info'
  message: string
  documentType: string
  documentId?: string
  field?: string
  daysSinceUpdate?: number
}

interface HealthSummary {
  total: number
  healthy: number
  warnings: number
  errors: number
  score: number
  lastChecked: string
}

const STALE_THRESHOLD_DAYS = 90
const REQUIRED_SINGLETONS = ['profile', 'aboutSection', 'techStack', 'siteSettings', 'seoSettings']

function calculateScore(issues: HealthIssue[]): number {
  let score = 100
  for (const issue of issues) {
    if (issue.severity === 'error') score -= 10
    else if (issue.severity === 'warning') score -= 5
    else score -= 1
  }
  return Math.max(0, score)
}

function getScoreColor(score: number): string {
  if (score >= 90) return '#30bf78'
  if (score >= 70) return '#eab917'
  if (score >= 50) return '#f59e0b'
  return '#f03e2f'
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Fair'
  return 'Needs Attention'
}

export function ContentHealthPanel() {
  const client = useClient()
  const [issues, setIssues] = useState<HealthIssue[]>([])
  const [summary, setSummary] = useState<HealthSummary>({
    total: 0,
    healthy: 0,
    warnings: 0,
    errors: 0,
    score: 100,
    lastChecked: '',
  })
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)

  const runHealthCheck = useCallback(async () => {
    setChecking(true)
    try {
      const fetchedIssues: HealthIssue[] = []

      // Check required singletons exist
      for (const schemaType of REQUIRED_SINGLETONS) {
        const doc = await client.fetch(`*[_type == "${schemaType}"][0]{_id}`)
        if (!doc) {
          fetchedIssues.push({
            id: `missing-${schemaType}`,
            type: 'missing',
            severity: 'error',
            message: `Required singleton "${schemaType}" is missing`,
            documentType: schemaType,
          })
        }
      }

      // Check projects for missing fields
      const projects = await client.fetch(
        `*[_type == "project"]{_id, title, shortDescription, overview}`
      )
      for (const project of projects || []) {
        if (!project.shortDescription) {
          fetchedIssues.push({
            id: `incomplete-${project._id}-shortDesc`,
            type: 'incomplete',
            severity: 'warning',
            message: `Project "${project.title}" is missing shortDescription`,
            documentType: 'project',
            documentId: project._id,
            field: 'shortDescription',
          })
        }
        if (!project.overview) {
          fetchedIssues.push({
            id: `incomplete-${project._id}-overview`,
            type: 'incomplete',
            severity: 'warning',
            message: `Project "${project.title}" is missing overview`,
            documentType: 'project',
            documentId: project._id,
            field: 'overview',
          })
        }
      }

      // Check blog posts for missing fields
      const posts = await client.fetch(
        `*[_type == "post"]{_id, title, excerpt, publishedAt}`
      )
      for (const post of posts || []) {
        if (!post.excerpt) {
          fetchedIssues.push({
            id: `incomplete-${post._id}-excerpt`,
            type: 'incomplete',
            severity: 'warning',
            message: `Post "${post.title}" is missing excerpt`,
            documentType: 'post',
            documentId: post._id,
            field: 'excerpt',
          })
        }
      }

      // Check stale content
      const staleThreshold = new Date()
      staleThreshold.setDate(staleThreshold.getDate() - STALE_THRESHOLD_DAYS)

      const staleProjects = await client.fetch(
        `*[_type == "project" && _updatedAt < $threshold]{_id, title, _updatedAt}`,
        {threshold: staleThreshold.toISOString()}
      )
      for (const project of staleProjects || []) {
        const daysSince = Math.floor(
          (Date.now() - new Date(project._updatedAt).getTime()) / (1000 * 60 * 60 * 24)
        )
        fetchedIssues.push({
          id: `stale-${project._id}`,
          type: 'stale',
          severity: 'info',
          message: `Project "${project.title}" hasn't been updated in ${daysSince} days`,
          documentType: 'project',
          documentId: project._id,
          daysSinceUpdate: daysSince,
        })
      }

      const stalePosts = await client.fetch(
        `*[_type == "post" && _updatedAt < $threshold]{_id, title, _updatedAt}`,
        {threshold: staleThreshold.toISOString()}
      )
      for (const post of stalePosts || []) {
        const daysSince = Math.floor(
          (Date.now() - new Date(post._updatedAt).getTime()) / (1000 * 60 * 60 * 24)
        )
        fetchedIssues.push({
          id: `stale-${post._id}`,
          type: 'stale',
          severity: 'info',
          message: `Post "${post.title}" hasn't been updated in ${daysSince} days`,
          documentType: 'post',
          documentId: post._id,
          daysSinceUpdate: daysSince,
        })
      }

      // Check for orphaned recommendations (no project reference)
      const orphanedRecs = await client.fetch(
        `*[_type == "recommendation" && !defined(project)]{_id, name}`
      )
      for (const rec of orphanedRecs || []) {
        fetchedIssues.push({
          id: `orphaned-${rec._id}`,
          type: 'orphaned',
          severity: 'warning',
          message: `Recommendation from "${rec.name}" has no project reference`,
          documentType: 'recommendation',
          documentId: rec._id,
        })
      }

      setIssues(fetchedIssues)

      const errors = fetchedIssues.filter((i) => i.severity === 'error').length
      const warnings = fetchedIssues.filter((i) => i.severity === 'warning').length
      const score = calculateScore(fetchedIssues)
      setSummary({
        total: fetchedIssues.length,
        healthy: fetchedIssues.length === 0 ? 1 : 0,
        warnings,
        errors,
        score,
        lastChecked: new Date().toLocaleTimeString(),
      })
    } catch (err) {
      console.error('Health check failed:', err)
    } finally {
      setLoading(false)
      setChecking(false)
    }
  }, [client])

  useEffect(() => {
    runHealthCheck()
  }, [runHealthCheck])

  const getIssueIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <WarningFilledIcon style={{color: '#f03e2f'}} />
      case 'warning':
        return <WarningFilledIcon style={{color: '#eab917'}} />
      default:
        return <ClockIcon style={{color: '#907ce5'}} />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'error':
        return <Badge tone="critical" fontSize={1}>Error</Badge>
      case 'warning':
        return <Badge tone="caution" fontSize={1}>Warning</Badge>
      default:
        return <Badge tone="primary" fontSize={1}>Info</Badge>
    }
  }

  return (
    <Card padding={4} radius={2}>
      <Stack space={4}>
        <Flex justify="space-between" align="center">
          <Text weight="semibold" size={2}>
            Content Health
          </Text>
          <Button
            onClick={runHealthCheck}
            loading={checking}
            icon={RefreshIcon}
            fontSize={1}
            mode="ghost"
          />
        </Flex>

        {loading ? (
          <Text muted align="center" size={1}>
            Running health check...
          </Text>
        ) : (
          <>
            {/* Score Card */}
            <Card padding={4} radius={2} tone="default">
              <Flex align="center" gap={3}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: `conic-gradient(${getScoreColor(summary.score)} ${summary.score * 3.6}deg, rgba(127,127,127,0.1) 0deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      background: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <span style={{fontSize: 18, fontWeight: 700, color: getScoreColor(summary.score)}}>
                      {summary.score}
                    </span>
                  </div>
                </div>
                <Box flex={1}>
                  <Text weight="semibold" size={2}>
                    {getScoreLabel(summary.score)}
                  </Text>
                  <Text muted size={1}>
                    {summary.errors} error(s), {summary.warnings} warning(s)
                  </Text>
                  {summary.lastChecked && (
                    <Text muted size={1}>
                      Last checked: {summary.lastChecked}
                    </Text>
                  )}
                </Box>
              </Flex>
            </Card>

            {/* Issues List */}
            {issues.length > 0 && (
              <Stack space={2}>
                {issues.map((issue) => (
                  <Card key={issue.id} padding={3} radius={2} tone="default">
                    <Flex gap={3} align="flex-start">
                      <Box flex={1}>
                        <Flex gap={2} align="center" marginBottom={1}>
                          {getIssueIcon(issue.severity)}
                          <Text size={1} weight="medium">
                            {issue.message}
                          </Text>
                        </Flex>
                        <Flex gap={2} align="center">
                          {getSeverityBadge(issue.severity)}
                          <Text muted size={1}>
                            {issue.documentType}
                            {issue.field ? ` → ${issue.field}` : ''}
                          </Text>
                        </Flex>
                      </Box>
                    </Flex>
                  </Card>
                ))}
              </Stack>
            )}

            {issues.length === 0 && (
              <Card padding={4} radius={2} tone="positive">
                <Text align="center" size={1}>
                  All content is healthy. No issues detected.
                </Text>
              </Card>
            )}
          </>
        )}
      </Stack>
    </Card>
  )
}
