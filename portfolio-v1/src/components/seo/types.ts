export type ImageObject = {
  '@type': 'ImageObject'
  url: string
  width: number
  height: number
  alt: string
}

export type PersonSchema = {
  '@type': 'Person'
  '@id': string
  name: string
  jobTitle: string
  url: string
  email: string
  image: ImageObject
  address: {
    '@type': 'PostalAddress'
    addressLocality: string
    addressCountry: string
  }
  sameAs: string[]
  knowsAbout: string[]
}

export type ArticleSchema = {
  '@type': 'Article'
  headline: string
  image: ImageObject
  datePublished: string
  dateModified?: string
  author: {
    '@type': 'Person'
    name: string
    url: string
  }
  publisher?: {
    '@type': 'Organization'
    name: string
    logo?: ImageObject
  }
  description?: string
  mainEntityOfPage?: string
}

export type CreativeWorkSchema = {
  '@type': 'CreativeWork'
  name: string
  url: string
  description?: string
  image: ImageObject
  author?: {
    '@type': 'Person'
    name: string
    url: string
  }
  datePublished?: string
  keywords?: string[]
}

export type WebSiteSchema = {
  '@type': 'WebSite'
  '@id': string
  url: string
  name: string
  description: string
}

export function createImageObject(
  url: string,
  alt: string,
  width = 1200,
  height = 630,
): ImageObject {
  return {
    '@type': 'ImageObject',
    url,
    width,
    height,
    alt,
  }
}
