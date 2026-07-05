export interface Frontmatter {
  title: string
  slug: string
  excerpt: string
  metaTitle?: string
  metaDescription?: string
  featured: boolean
  readTime?: string
  publishedAt: string
  publishAt?: string
  published: boolean
  author: string
  categories: string[]
  tags: string[]
  coverImage?: string
  sourceId?: string
}

export interface BlogFile {
  frontmatter: Frontmatter
  body: string
  filePath: string
}

export type SyncDirection = 'push' | 'pull' | 'diff'

export type SyncStatus = 'new-local' | 'new-remote' | 'modified' | 'in-sync' | 'deleted'

export interface SyncResult {
  slug: string
  status: SyncStatus
  localModified?: string
  remoteModified?: string
}

export interface PublishOptions {
  slug: string
  includeDrafts: boolean
  force: boolean
  dryRun: boolean
}
