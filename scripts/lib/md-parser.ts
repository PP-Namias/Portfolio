import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import type { Frontmatter, BlogFile } from '../../src/types/blog'

const CONTENT_DIR = path.resolve(process.cwd(), 'content/blog')

export function parseMdFile(filePath: string): BlogFile {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    frontmatter: data as Frontmatter,
    body: content.trim(),
    filePath,
  }
}

export function writeMdFile(filePath: string, frontmatter: Frontmatter, body: string): void {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const content = matter.stringify(body, frontmatter)
  fs.writeFileSync(filePath, content, 'utf-8')
}

export function listMdFiles(dir: string = CONTENT_DIR): string[] {
  if (!fs.existsSync(dir)) {
    return []
  }

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .map((f) => path.join(dir, f))
}

export function getSlugFromFilename(filePath: string): string {
  return path.basename(filePath, '.md')
}

export function getFilePathFromSlug(slug: string, dir: string = CONTENT_DIR): string {
  return path.join(dir, `${slug}.md`)
}
