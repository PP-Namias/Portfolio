import React, {useEffect, useState, useCallback} from 'react'
import {Card, Stack, Text, Badge, Button, Flex, Box} from '@sanity/ui'
import {useClient} from 'sanity'
import {ClockIcon, RefreshIcon, RocketIcon} from '@sanity/icons'

interface ScheduledDoc {
  _id: string
  _type: string
  title?: string
  publishAt?: string
  status?: string
}

interface BulkAction {
  id: string
  label: string
  description: string
  action: (docIds: string[]) => Promise<void>
  icon: React.ReactNode
  variant: 'primary' | 'warning' | 'critical'
}

export function AutomationPanel() {
  const client = useClient()
  const [scheduledDocs, setScheduledDocs] = useState<ScheduledDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [actionRunning, setActionRunning] = useState<string | null>(null)

  const fetchScheduled = useCallback(async () => {
    setLoading(true)
    try {
      const docs = await client.fetch(
        `*[_type in ["project", "post", "certification"] && defined(publishAt) && publishAt > now()] | order(publishAt asc) {_id, _type, title, publishAt, status}`
      )
      setScheduledDocs(docs || [])
    } catch (err) {
      console.error('Failed to fetch scheduled docs:', err)
    } finally {
      setLoading(false)
    }
  }, [client])

  useEffect(() => {
    fetchScheduled()
  }, [fetchScheduled])

  const bulkActions: BulkAction[] = [
    {
      id: 'publish-due',
      label: 'Publish Due Items',
      description: 'Publish all documents where publishAt has passed.',
      icon: <RocketIcon />,
      variant: 'primary',
      action: async (docIds: string[]) => {
        for (const id of docIds) {
          await client.patch(id).unset(['publishAt']).commit()
        }
        await fetchScheduled()
      },
    },
    {
      id: 'clear-scheduling',
      label: 'Clear All Scheduling',
      description: 'Remove publishAt from all scheduled documents.',
      icon: <ClockIcon />,
      variant: 'warning',
      action: async (docIds: string[]) => {
        for (const id of docIds) {
          await client.patch(id).unset(['publishAt']).commit()
        }
        await fetchScheduled()
      },
    },
  ]

  const handleBulkAction = async (action: BulkAction) => {
    const docIds = scheduledDocs.map((d) => d._id)
    if (docIds.length === 0) return

    setActionRunning(action.id)
    try {
      await action.action(docIds)
    } catch (err) {
      console.error(`Bulk action failed:`, err)
    } finally {
      setActionRunning(null)
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'project':
        return 'Project'
      case 'post':
        return 'Post'
      case 'certification':
        return 'Certification'
      default:
        return type
    }
  }

  const formatPublishAt = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffDays > 0) {
      return `in ${diffDays} day${diffDays === 1 ? '' : 's'}`
    }
    if (diffHours > 0) {
      return `in ${diffHours} hour${diffHours === 1 ? '' : 's'}`
    }
    return 'soon'
  }

  return (
    <Card padding={4} radius={2}>
      <Stack space={4}>
        <Flex justify="space-between" align="center">
          <Text weight="semibold" size={2}>
            Automation
          </Text>
          <Button
            onClick={fetchScheduled}
            loading={loading}
            icon={RefreshIcon}
            fontSize={1}
            mode="ghost"
          />
        </Flex>

        {loading ? (
          <Text muted size={1}>
            Loading scheduled documents...
          </Text>
        ) : (
          <>
            {/* Scheduled Documents */}
            <Stack space={2}>
              <Text weight="semibold" size={1}>
                Scheduled for Publishing
              </Text>
              {scheduledDocs.length === 0 ? (
                <Card padding={3} radius={2} tone="positive">
                  <Text size={1}>No documents scheduled for publishing.</Text>
                </Card>
              ) : (
                scheduledDocs.map((doc) => (
                  <Card key={doc._id} padding={3} radius={2} tone="default">
                    <Flex justify="space-between" align="center">
                      <Flex gap={2} align="center">
                        <Badge tone="primary" fontSize={1}>
                          {getTypeLabel(doc._type)}
                        </Badge>
                        <Text size={1} weight="medium">
                          {doc.title || 'Untitled'}
                        </Text>
                      </Flex>
                      <Flex gap={2} align="center">
                        <Badge tone="caution" fontSize={1}>
                          <ClockIcon style={{marginRight: 4}} />
                          {formatPublishAt(doc.publishAt!)}
                        </Badge>
                      </Flex>
                    </Flex>
                  </Card>
                ))
              )}
            </Stack>

            {/* Bulk Actions */}
            {scheduledDocs.length > 0 && (
              <Stack space={2}>
                <Text weight="semibold" size={1}>
                  Bulk Actions
                </Text>
                {bulkActions.map((action) => (
                  <Card key={action.id} padding={3} radius={2} tone="default">
                    <Flex justify="space-between" align="center">
                      <Box flex={1}>
                        <Text size={1} weight="medium">
                          {action.label}
                        </Text>
                        <Text muted size={1}>
                          {action.description}
                        </Text>
                      </Box>
                      <Button
                        onClick={() => handleBulkAction(action)}
                        loading={actionRunning === action.id}
                        icon={action.icon}
                        fontSize={1}
                        mode="ghost"
                        tone={action.variant === 'primary' ? 'positive' : action.variant === 'warning' ? 'caution' : 'critical'}
                      />
                    </Flex>
                  </Card>
                ))}
              </Stack>
            )}

            {/* Quick Stats */}
            <Card padding={3} radius={2} tone="primary">
              <Flex justify="space-between" align="center">
                <Text size={1} weight="medium">
                  {scheduledDocs.length} document{scheduledDocs.length === 1 ? '' : 's'} scheduled
                </Text>
                <Badge tone="positive" fontSize={1}>
                  Auto-publish enabled
                </Badge>
              </Flex>
            </Card>
          </>
        )}
      </Stack>
    </Card>
  )
}
