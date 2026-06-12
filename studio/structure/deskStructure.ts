import type {StructureBuilder} from 'sanity/structure'

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
 *  Quick Start
 *    New project (featured)
 *    New post (draft)
 *    New certification
 */
export function deskStructure(S: StructureBuilder) {
  return S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Homepage')
        .child(
          S.list()
            .title('Homepage')
            .items([
              S.listItem()
                .title('Hero & Profile')
                .child(S.document().schemaType('profile').documentId('profile')),
              S.listItem()
                .title('About Section')
                .child(S.document().schemaType('aboutSection').documentId('aboutSection')),
              S.listItem()
                .title('Tech Stack')
                .child(S.document().schemaType('techStack').documentId('techStack')),
            ]),
        ),
      S.listItem()
        .title('Collections')
        .child(
          S.list()
            .title('Collections')
            .items([
              S.documentTypeListItem('project').title('Projects'),
              S.documentTypeListItem('experience').title('Experience'),
              S.documentTypeListItem('certification').title('Certifications'),
              S.documentTypeListItem('galleryImage').title('Gallery'),
              S.documentTypeListItem('resume').title('Resume'),
            ]),
        ),
      S.listItem()
        .title('Blog')
        .child(
          S.list()
            .title('Blog')
            .items([
              S.documentTypeListItem('post').title('Posts'),
              S.documentTypeListItem('author').title('Authors'),
              S.documentTypeListItem('category').title('Categories'),
            ]),
        ),
      S.listItem()
        .title('Community')
        .child(
          S.list()
            .title('Community')
            .items([
              S.documentTypeListItem('membership').title('Memberships'),
              S.documentTypeListItem('recommendation').title('Recommendations'),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Settings')
        .child(
          S.list()
            .title('Settings')
            .items([
              S.listItem()
                .title('Site Settings')
                .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
              S.listItem()
                .title('SEO Settings')
                .child(S.document().schemaType('seoSettings').documentId('seoSettings')),
              S.listItem()
                .title('Media Settings')
                .child(S.document().schemaType('mediaSettings').documentId('mediaSettings')),
            ]),
        ),
      S.listItem()
        .title('Reference Data')
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
