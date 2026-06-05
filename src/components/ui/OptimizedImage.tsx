import Image, {type ImageProps} from 'next/image';

/**
 * Portfolio-wide wrapper around `next/image` that:
 *
 * 1. Sets `quality` to 85 to match the media gateway default in
 *    `src/lib/media.ts` and `src/lib/media-gateway.ts`. Without this,
 *    the gateway returns a quality-85 image from Sanity, and the
 *    Next.js optimizer re-encodes it at its default of 75, which is
 *    a second lossy encode and visibly softer.
 * 2. Forwards every other prop unchanged.
 *
 * Components that need `unoptimized` (e.g. SVG covers) should set it
 * explicitly; the wrapper does not force it.
 */
const OptimizedImage = (props: ImageProps) => (
  // eslint-disable-next-line jsx-a11y/alt-text -- alt is forwarded via props
  <Image {...props} quality={props.quality ?? 85} />
);

export default OptimizedImage;
