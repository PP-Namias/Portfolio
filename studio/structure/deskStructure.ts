import type {StructureBuilder} from 'sanity/structure'
import {
  HomeIcon,
  UserIcon,
  DocumentsIcon,
  CogIcon,
  RocketIcon,
  BriefcaseIcon,
  AwardIcon,
  ImagesIcon,
  UsersIcon,
  BookIcon,
} from '@sanity/icons'

/**
 * Page-first IA, 2 levels max under any group.
 *
 *  Content
 *    Homepage         - Hero & Profile, About, Tech Stack
 *    Collections      - Projects, Experience, Certs, Gallery, Resume
 *    Blog             - Posts, Authors, Categories
 *    Community        - Memberships, Recommendations
 *  Settings
 *    Site Settings    - site name, canonical url, robots
 *    SEO Settings     - default SEO copy + og/twitter images
 *    Media Settings   - global image policy / asset library
 *  Reference Data
 *    Certification Categories
 *    Certification Issuers
 *    Gallery Categories
 */
export function deskStructure(S: StructureBuilder) {
  return S.list()
    .title('Content')
    .items([
      // ─── Homepage ────────────────────────────────────────────
      S.listItem()
        .title('Homepage')
        .icon(HomeIcon)
        .child(
          S.list()
            .title('Homepage')
            .items([
              S.listItem()
                .title('Hero & Profile')
                .icon(UserIcon)
                .child(S.document().schemaType('profile').documentId('profile')),
              S.listItem()
                .title('About Section')
                .icon(DocumentsIcon)
                .child(S.document().schemaType('aboutSection').documentId('aboutSection')),
              S.listItem()
                .title('Tech Stack')
                .icon(CogIcon)
                .child(S.document().schemaType('techStack').documentId('techStack')),
            ]),
        ),

      // ─── Collections ─────────────────────────────────────────
      S.listItem()
        .title('Collections')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Collections')
            .items([
              S.documentTypeListItem('project').title('Projects').icon(RocketIcon),
              S.documentTypeListItem('experience').title('Experience').icon(BriefcaseIcon),
              S.documentTypeListItem('certification').title('Certifications').icon(AwardIcon),
              S.documentTypeListItem('galleryImage').title('Gallery').icon(ImagesIcon),
              S.documentTypeListItem('resume').title('Resume').icon(DocumentsIcon),
            ]),
        ),

      // ─── Blog ────────────────────────────────────────────────
      S.listItem()
        .title('Blog')
        .icon(BookIcon)
        .child(
          S.list()
            .title('Blog')
            .items([
              S.documentTypeListItem('post').title('Posts').icon(DocumentsIcon),
              S.documentTypeListItem('author').title('Authors').icon(UserIcon),
              S.documentTypeListItem('category').title('Categories').icon(DocumentsIcon),
            ]),
        ),

      // ─── Community ───────────────────────────────────────────
      S.listItem()
        .title('Community')
        .icon(UsersIcon)
        .child(
          S.list()
            .title('Community')
            .items([
              S.documentTypeListItem('membership').title('Memberships').icon(UsersIcon),
              S.documentTypeListItem('recommendation').title('Recommendations').icon(DocumentsIcon),
            ]),
        ),

      // ─── Settings ────────────────────────────────────────────
      S.divider(),
      S.listItem()
        .title('Settings')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Settings')
            .items([
              S.listItem()
                .title('Site Settings')
                .icon(CogIcon)
                .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
              S.listItem()
                .title('SEO Settings')
                .icon(CogIcon)
                .child(S.document().schemaType('seoSettings').documentId('seoSettings')),
              S.listItem()
                .title('Media Settings')
                .icon(ImagesIcon)
                .child(S.document().schemaType('mediaSettings').documentId('mediaSettings')),
            ]),
        ),

      // ─── Reference Data ──────────────────────────────────────
      S.listItem()
        .title('Reference Data')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Reference Data')
            .items([
              S.documentTypeListItem('certificationCategory').title('Certification Categories'),
              S.documentTypeListItem('certificationIssuer').title('Certification Issuers'),
              S.documentTypeListItem('galleryCategory').title('Gallery Categories'),
            ]),
        ),
    ])
}
