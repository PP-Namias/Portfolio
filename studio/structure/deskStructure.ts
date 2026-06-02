import type {StructureBuilder} from 'sanity/structure'

/**
 * Page-first IA, 2 levels max under any group.
 *
 *  Pages
 *    Homepage         - Hero, About, Tech Stack, Projects, Experience, Certs, Gallery, Resume, Site Settings
 *    Blog             - Posts, Authors, Categories
 *    Profile          - Profile, Memberships, Recommendations
 *  Settings
 *    SEO              - site settings (default SEO copy + og/twitter images)
 *    Media            - global image policy / asset library (future)
 *    Site             - site name, canonical url, robots
 *  Reference Data
 *    Certification Categories
 *    Certification Issuers
 *    Gallery Categories
 *  Quick Start
 *    New project (featured)
 *    New post (draft)
 *    New certification
 *    Open Presentation
 *    Browse skills
 */
export function deskStructure(S: StructureBuilder) {
  return S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('Homepage')
                .child(
                  S.list()
                    .title('Homepage')
                    .items([
                      S.listItem()
                        .title('Hero Section')
                        .child(S.document().schemaType('heroSection').documentId('heroSection')),
                      S.listItem()
                        .title('About Section')
                        .child(S.document().schemaType('aboutSection').documentId('aboutSection')),
                      S.listItem()
                        .title('Tech Stack')
                        .child(S.document().schemaType('techStack').documentId('techStack')),
                      S.listItem()
                        .title('Projects')
                        .child(S.documentTypeList('project').title('Projects')),
                      S.listItem()
                        .title('Experience')
                        .child(S.documentTypeList('experience').title('Experience')),
                      S.listItem()
                        .title('Certifications')
                        .child(S.documentTypeList('certification').title('Certifications')),
                      S.listItem()
                        .title('Gallery')
                        .child(S.documentTypeList('galleryImage').title('Gallery')),
                      S.listItem()
                        .title('Resume')
                        .child(S.documentTypeList('resume').title('Resume')),
                    ]),
                ),
              S.listItem()
                .title('Blog')
                .child(
                  S.list()
                    .title('Blog')
                    .items([
                      S.listItem()
                        .title('Posts')
                        .child(S.documentTypeList('post').title('Posts')),
                      S.listItem()
                        .title('Authors')
                        .child(S.documentTypeList('author').title('Authors')),
                      S.listItem()
                        .title('Categories')
                        .child(S.documentTypeList('category').title('Categories')),
                    ]),
                ),
              S.listItem()
                .title('Profile')
                .child(
                  S.list()
                    .title('Profile')
                    .items([
                      S.listItem()
                        .title('Profile')
                        .child(S.document().schemaType('profile').documentId('profile')),
                      S.listItem()
                        .title('Memberships')
                        .child(S.documentTypeList('membership').title('Memberships')),
                      S.listItem()
                        .title('Recommendations')
                        .child(S.documentTypeList('recommendation').title('Recommendations')),
                    ]),
                ),
            ]),
        ),
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
              S.listItem()
                .title('Certification Categories')
                .child(S.documentTypeList('certificationCategory').title('Certification Categories')),
              S.listItem()
                .title('Certification Issuers')
                .child(S.documentTypeList('certificationIssuer').title('Certification Issuers')),
              S.listItem()
                .title('Gallery Categories')
                .child(S.documentTypeList('galleryCategory').title('Gallery Categories')),
            ]),
        ),
      S.listItem()
        .title('Quick Start')
        .child(
          S.list()
            .title('Quick Start')
            .items([
              S.listItem()
                .title('New project (click + to create)')
                .child(S.documentTypeList('project').title('Projects')),
              S.listItem()
                .title('New post (click + to create)')
                .child(S.documentTypeList('post').title('Posts')),
              S.listItem()
                .title('New certification (click + to create)')
                .child(S.documentTypeList('certification').title('Certifications')),
            ]),
        ),
    ])
}
