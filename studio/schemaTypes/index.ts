import blockContent from './blockContent'
import category from './category'
import membership from './membership'
import certificationCategory from './certificationCategory'
import certificationIssuer from './certificationIssuer'
import galleryCategory from './galleryCategory'
import post from './post'
import author from './author'
import heroSection from './heroSection'
import aboutSection from './aboutSection'
import profile from './profile'
import seoSettings from './seoSettings'
import mediaSettings from './mediaSettings'
import experience from './experience'
import recommendation from './recommendation'
import project from './project'
import certification from './certification'
import galleryImage from './galleryImage'
import resume from './resume'
import siteSettings from './siteSettings'
import techStack from './techStack'

export {
  DOCUMENT_META,
  DOCUMENT_KIND,
  DOCUMENT_KIND_LABELS,
  REFERENCEABLE_TYPES,
  COLLECTION_TYPES,
  SINGLETON_TYPES,
  PREVIEWABLE_TYPES,
  getDocumentMeta,
  isReferenceableType,
} from './_registry'
export type {DocumentKind, DocumentMeta} from './_registry'

export const schemaTypes = [
  heroSection,
  aboutSection,
  profile,
  seoSettings,
  mediaSettings,
  siteSettings,
  techStack,
  resume,
  experience,
  project,
  certification,
  galleryImage,
  recommendation,
  membership,
  post,
  author,
  category,
  certificationCategory,
  certificationIssuer,
  galleryCategory,
  blockContent,
]
