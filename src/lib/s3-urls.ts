const S3_BUCKET_URL = process.env.NEXT_PUBLIC_S3_BUCKET_URL || '';

export function getS3Url(path: string): string {
  return `${S3_BUCKET_URL}/${path}`;
}

export function getProfilePhotoUrl(): string {
  return getS3Url('profile/profile-photo.jpg');
}

export function getResumeUrl(): string {
  return getS3Url('resume/resume.pdf');
}

export function getGalleryImageUrl(filename: string): string {
  return getS3Url(`gallery/${filename}`);
}

export function getProjectThumbnailUrl(filename: string): string {
  return getS3Url(`projects/${filename}`);
}

export function getOgImageUrl(): string {
  return getS3Url('profile/og-image.png');
}
