import { describe, expect, it } from 'vitest'
import {
  buildPersonJsonLd,
  buildPortfolioJsonLd,
  buildWebSiteJsonLd,
  PERSON_ALUMNI,
  PERSON_ENTITY_ID,
  PERSON_IMAGE_ALT,
  PERSON_JOB_TITLES,
  PERSON_KNOWS_ABOUT,
  PERSON_NAME,
  WEBSITE_ENTITY_ID,
} from '@/lib/jsonld'

describe('jsonld structured data', () => {
  it('exposes a schema.org graph with WebSite and Person nodes', () => {
    const graph = buildPortfolioJsonLd('https://cdn.example.com/headshot.jpg') as {
      '@context': string
      '@graph': Array<{ '@type': string }>
    }

    expect(graph['@context']).toBe('https://schema.org')
    expect(graph['@graph'].map((node) => node['@type'])).toEqual(['WebSite', 'Person'])
  })

  it('builds the WebSite node with url, name, and description', () => {
    const site = buildWebSiteJsonLd()

    expect(site['@type']).toBe('WebSite')
    expect(site['@id']).toBe(WEBSITE_ENTITY_ID)
    expect(site.url).toMatch(/^https:\/\//)
    expect(site.name).toContain('Namias')
    expect(site.description).toContain('Full Stack Engineer')
  })

  it('builds the Person node with all critical entity fields', () => {
    const person = buildPersonJsonLd('https://cdn.example.com/headshot.jpg') as Record<
      string,
      unknown
    >

    expect(person['@type']).toBe('Person')
    expect(person['@id']).toBe(PERSON_ENTITY_ID)
    expect(person.name).toBe(PERSON_NAME)
    expect(person.jobTitle).toEqual(PERSON_JOB_TITLES)
    expect(person.alumniOf).toBe(PERSON_ALUMNI)
    expect(person.knowsAbout).toEqual(PERSON_KNOWS_ABOUT)
    expect(person.url).toMatch(/^https:\/\//)
  })

  it('associates the primary image with the person entity', () => {
    const person = buildPersonJsonLd('https://cdn.example.com/headshot.jpg') as {
      image: { '@type': string; url: string; alt: string }
    }

    expect(person.image['@type']).toBe('ImageObject')
    expect(person.image.url).toBe('https://cdn.example.com/headshot.jpg')
    expect(person.image.alt).toBe(PERSON_IMAGE_ALT)
    expect(person.image.alt).toContain('Jhon Keneth Ryan B. Namias')
  })

  it('lists the professional sameAs profiles', () => {
    const person = buildPersonJsonLd('https://cdn.example.com/headshot.jpg') as { sameAs: string[] }

    expect(person.sameAs.some((url) => url.includes('github.com/PP-Namias'))).toBe(true)
    expect(person.sameAs.some((url) => url.includes('linkedin.com/in/pp-namias'))).toBe(true)
    expect(person.sameAs.some((url) => url.includes('x.com/PP_Namias'))).toBe(true)
  })

  it('reuses one entity id for the person across the graph', () => {
    const graph = buildPortfolioJsonLd('https://cdn.example.com/headshot.jpg') as {
      '@graph': Array<{ '@type': string; '@id': string }>
    }

    const person = graph['@graph'].find((node) => node['@type'] === 'Person')
    expect(person?.['@id']).toBe(PERSON_ENTITY_ID)
  })

  it('keeps the exact-match name in the entity image alt text', () => {
    const graph = buildPortfolioJsonLd('https://cdn.example.com/headshot.jpg') as {
      '@graph': Array<{
        '@type': string
        image?: { alt: string }
      }>
    }

    const person = graph['@graph'].find((node) => node['@type'] === 'Person')
    expect(person?.image?.alt).toContain(PERSON_NAME)
  })

  it('adds Knowledge Graph fields: address, languages, and description', () => {
    const person = buildPersonJsonLd('https://cdn.example.com/headshot.jpg') as {
      address: { '@type': string; addressLocality: string; addressCountry: string }
      knowsLanguage: string[]
      description: string
      disambiguatingDescription: string
      mainEntityOfPage: string
    }

    expect(person.address['@type']).toBe('PostalAddress')
    expect(person.address.addressLocality).toBe('Caloocan City')
    expect(person.address.addressCountry).toBe('PH')
    expect(person.knowsLanguage).toContain('en')
    expect(person.description).toContain('Full Stack Engineer')
    expect(person.disambiguatingDescription).toContain(PERSON_NAME)
    expect(person.mainEntityOfPage).toMatch(/^https:\/\//)
  })

  it('connects the WebSite node to the Person entity via graph edges', () => {
    const site = buildWebSiteJsonLd() as {
      inLanguage: string
      publisher: { '@id': string }
      about: { '@id': string }
    }

    expect(site.inLanguage).toBe('en')
    expect(site.publisher['@id']).toBe(PERSON_ENTITY_ID)
    expect(site.about['@id']).toBe(PERSON_ENTITY_ID)
  })

  it('expands knowsAbout with AI automation and IoT stack', () => {
    const person = buildPersonJsonLd('https://cdn.example.com/headshot.jpg') as {
      knowsAbout: string[]
    }

    expect(person.knowsAbout).toContain('n8n')
    expect(person.knowsAbout).toContain('Autonomous AI Agents')
    expect(person.knowsAbout).toContain('Raspberry Pi')
    expect(person.knowsAbout).toContain('Arduino')
    expect(person.knowsAbout).toContain('IoT')
  })
})
