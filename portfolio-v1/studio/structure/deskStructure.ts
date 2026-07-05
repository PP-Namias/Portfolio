import type {StructureBuilder} from 'sanity/structure'
import {
  HomeIcon,
  UserIcon,
  DocumentsIcon,
  CogIcon,
  RocketIcon,
  CaseIcon,
  StarFilledIcon,
  ImagesIcon,
  UsersIcon,
  BookIcon,
  EyeOpenIcon,
  FilterIcon,
  EditIcon,
} from '@sanity/icons'

/**
 * Page-first IA, 2 levels max under any group.
 *
 *  Content
 *    Homepage         - Hero & Profile, About, Tech Stack
 *    Collections      - Projects, Experience, Certs, Gallery, Resume
 *    Blog             - Posts, Authors, Categories
 *    Community        - Memberships, Recommendations
 *    Drafts           - All draft documents across types
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
              // Projects with filtered views
              S.listItem()
                .title('Projects')
                .icon(RocketIcon)
                .child(
                  S.list()
                    .title('Projects')
                    .items([
                      S.listItem()
                        .title('All Projects')
                        .icon(FilterIcon)
                        .child(
                          S.documentList()
                            .title('All Projects')
                            .filter('_type == "project"')
                            .defaultOrdering([{field: 'title', direction: 'asc'}]),
                        ),
                      S.listItem()
                        .title('Featured')
                        .icon(EyeOpenIcon)
                        .child(
                          S.documentList()
                            .title('Featured Projects')
                            .filter('_type == "project" && featured == true')
                            .defaultOrdering([{field: 'title', direction: 'asc'}]),
                        ),
                      S.listItem()
                        .title('Showcase')
                        .icon(EyeOpenIcon)
                        .child(
                          S.documentList()
                            .title('Showcase Projects')
                            .filter('_type == "project" && showcaseDetail == true')
                            .defaultOrdering([{field: 'title', direction: 'asc'}]),
                        ),
                    ]),
                ),
              // Experience with filtered views
              S.listItem()
                .title('Experience')
                .icon(CaseIcon)
                .child(
                  S.list()
                    .title('Experience')
                    .items([
                      S.listItem()
                        .title('All Experience')
                        .icon(FilterIcon)
                        .child(
                          S.documentList()
                            .title('All Experience')
                            .filter('_type == "experience"')
                            .defaultOrdering([{field: 'startDate', direction: 'desc'}]),
                        ),
                      S.listItem()
                        .title('Current')
                        .icon(EyeOpenIcon)
                        .child(
                          S.documentList()
                            .title('Current Experience')
                            .filter('_type == "experience" && endDate == null')
                            .defaultOrdering([{field: 'startDate', direction: 'desc'}]),
                        ),
                      S.listItem()
                        .title('Past')
                        .icon(DocumentsIcon)
                        .child(
                          S.documentList()
                            .title('Past Experience')
                            .filter('_type == "experience" && defined(endDate)')
                            .defaultOrdering([{field: 'startDate', direction: 'desc'}]),
                        ),
                    ]),
                ),
              S.documentTypeListItem('certification').title('Certifications').icon(StarFilledIcon),
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
              // Posts with filtered views
              S.listItem()
                .title('Posts')
                .icon(DocumentsIcon)
                .child(
                  S.list()
                    .title('Posts')
                    .items([
                      S.listItem()
                        .title('All Posts')
                        .icon(FilterIcon)
                        .child(
                          S.documentList()
                            .title('All Posts')
                            .filter('_type == "post"')
                            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
                        ),
                      S.listItem()
                        .title('Published')
                        .icon(EyeOpenIcon)
                        .child(
                          S.documentList()
                            .title('Published Posts')
                            .filter('_type == "post" && !(_id in path("drafts.**"))')
                            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
                        ),
                      S.listItem()
                        .title('Drafts')
                        .icon(DocumentsIcon)
                        .child(
                          S.documentList()
                            .title('Draft Posts')
                            .filter('_type == "post" && _id in path("drafts.**")')
                            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
                        ),
                    ]),
                ),
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

      // ─── Drafts (All drafts across types) ────────────────────
      S.divider(),
      S.listItem()
        .title('Drafts')
        .icon(EditIcon)
        .child(
          S.list()
            .title('Drafts')
            .items([
              S.listItem()
                .title('All Drafts')
                .icon(EditIcon)
                .child(
                  S.documentList()
                    .title('All Draft Documents')
                    .filter(
                      '_id in path("drafts.**") && _type != "sanity.imageAsset" && _type != "sanity.fileAsset"',
                    )
                    .defaultOrdering([{field: '_updatedAt', direction: 'desc'}]),
                ),
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
