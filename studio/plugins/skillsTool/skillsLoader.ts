export type SkillFrontmatter = {
  title?: string
  trigger?: string
  audience?: 'editors' | 'devs' | 'both' | string
  time?: string
}

export type Skill = {
  slug: string
  frontmatter: SkillFrontmatter
  body: string
}

const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

function parseFrontmatter(raw: string): {frontmatter: SkillFrontmatter; body: string} {
  const match = raw.match(frontmatterRegex)
  if (!match) {
    return {frontmatter: {}, body: raw}
  }
  const [, frontmatterBlock, body] = match
  const frontmatter: SkillFrontmatter = {}
  for (const line of frontmatterBlock.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z][\w-]*)\s*:\s*(.*)$/)
    if (!m) continue
    const [, key, rawValue] = m
    let value: unknown = rawValue.trim()
    if (typeof value === 'string') {
      const v = value as string
      if (v.startsWith('"') && v.endsWith('"')) value = v.slice(1, -1)
      else if (v.startsWith("'") && v.endsWith("'")) value = v.slice(1, -1)
    }
    frontmatter[key as keyof SkillFrontmatter] = value as never
  }
  return {frontmatter, body: body.trim()}
}

const modules = import.meta.glob<string>('../../skills/*.md', {
  eager: true,
  query: '?raw',
})

const raw: Skill[] = Object.entries(modules)
  .map(([path, content]) => {
    const slug = path.replace(/^.*\//, '').replace(/\.md$/, '')
    const {frontmatter, body} = parseFrontmatter(content as unknown as string)
    return {slug, frontmatter, body}
  })
  .sort((a, b) => a.slug.localeCompare(b.slug))

export const skills: Skill[] = raw

export function findSkill(slug: string): Skill | undefined {
  return skills.find((s) => s.slug === slug)
}
