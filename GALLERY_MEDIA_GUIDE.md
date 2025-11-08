# Gallery Section - Adding New Media Guide

## 📁 Directory Structure

```
src/assets/portfolio-resources/assets/
├── images/
│   ├── certifications/     ← OLD (Keep for backward compatibility)
│   └── gallery/            ← NEW (Add images here)
│       ├── image1.jpg
│       ├── image2.png
│       └── animation.gif
└── videos/
    └── gallery/            ← NEW (Add videos here)
        ├── demo.mp4
        └── tutorial.webm
```

## 🎯 Supported Media Types

### Images
- **Formats**: `.jpg`, `.jpeg`, `.png`, `.webp`
- **Recommended Size**: Max 2000px width for optimal loading
- **Optimization**: Automatically converted to WebP format

### Videos
- **Formats**: `.mp4`, `.webm`
- **Recommended**: 
  - H.264 codec for MP4
  - VP9 codec for WebM
  - Max 1080p resolution
  - Under 50MB file size

### GIFs
- **Formats**: `.gif`
- **Recommended**: 
  - Max 800px width
  - Under 10MB file size
  - Consider converting large GIFs to video for better performance

## ✏️ Adding New Media

### Step 1: Add Media Files

1. **For Images/GIFs**:
   ```bash
   # Copy your files to:
   src/assets/portfolio-resources/assets/images/gallery/
   ```

2. **For Videos**:
   ```bash
   # Copy your files to:
   src/assets/portfolio-resources/assets/videos/gallery/
   ```

### Step 2: Update gallery.json

Add a new entry to `src/assets/portfolio-resources/data/gallery.json`:

#### Image Entry Example:
```json
{
  "title": "My Awesome Project Screenshot",
  "mediaType": "image",
  "media": "my-project-screenshot.jpg",
  "description": "A beautiful screenshot of my latest project featuring...",
  "createdAt": "2025-11-08",
  "tags": ["Project", "Web Development", "React"],
  "dimensions": {
    "width": 1920,
    "height": 1080,
    "aspectRatio": "16:9"
  }
}
```

#### Video Entry Example:
```json
{
  "title": "Project Demo Video",
  "mediaType": "video",
  "media": "project-demo.mp4",
  "thumbnail": "project-demo-thumbnail.jpg",
  "description": "Complete walkthrough of the project features",
  "createdAt": "2025-11-08",
  "tags": ["Demo", "Tutorial", "Project"],
  "dimensions": {
    "width": 1920,
    "height": 1080,
    "aspectRatio": "16:9"
  }
}
```

#### GIF Entry Example:
```json
{
  "title": "Loading Animation",
  "mediaType": "gif",
  "media": "loading-animation.gif",
  "description": "Custom loading animation for the website",
  "createdAt": "2025-11-08",
  "tags": ["Animation", "UI", "Design"]
}
```

### Step 3: Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ Yes | Display title of the media |
| `mediaType` | string | ✅ Yes | One of: "image", "video", "gif" |
| `media` | string | ✅ Yes | Filename of the media (must match file in assets folder) |
| `thumbnail` | string | ⚠️ Recommended for videos | Thumbnail image filename for video preview |
| `description` | string | ❌ Optional | Detailed description shown in modal |
| `createdAt` | string | ⚠️ Recommended | Date in YYYY-MM-DD format |
| `tags` | array | ⚠️ Recommended | Array of tag strings for filtering/search |
| `dimensions` | object | ❌ Optional | Width, height, and aspect ratio info |

## 🎨 Best Practices

### Image Guidelines
1. **Optimize before uploading**: Use tools like TinyPNG or ImageOptim
2. **Use descriptive filenames**: `aws-certification.jpg` not `IMG_1234.jpg`
3. **Provide alt-text context**: Use descriptive titles
4. **Aspect ratios**: Any ratio works, masonry layout will adapt

### Video Guidelines
1. **Create thumbnails**: Always provide a thumbnail for videos
2. **Compress videos**: Use Handbrake or FFmpeg to reduce file size
3. **Multiple formats**: Consider providing both MP4 and WebM
4. **Add captions**: Include descriptions for accessibility

### Tagging Strategy
- Use consistent tag names (capitalize properly)
- Include relevant technologies: "React", "TypeScript", "AWS"
- Add category tags: "Certification", "Project", "Tutorial"
- Use 3-7 tags per item for best results

## 🔍 Testing Your Changes

After adding media:

1. **Check the file paths** are correct in gallery.json
2. **Verify files exist** in the correct directories
3. **Test filtering** - ensure tags work with filters
4. **Test search** - verify title/description/tags are searchable
5. **Check responsiveness** - test on mobile, tablet, desktop

## 📝 Example: Complete Entry

```json
{
  "title": "Full Stack E-Commerce Application",
  "mediaType": "video",
  "media": "ecommerce-demo.mp4",
  "thumbnail": "ecommerce-thumbnail.jpg",
  "description": "A comprehensive e-commerce platform built with React, Node.js, and PostgreSQL. Features include user authentication, product catalog, shopping cart, and payment integration with Stripe.",
  "createdAt": "2025-10-15",
  "tags": [
    "Full Stack",
    "React",
    "Node.js",
    "PostgreSQL",
    "Stripe",
    "E-Commerce"
  ],
  "dimensions": {
    "width": 1920,
    "height": 1080,
    "aspectRatio": "16:9"
  }
}
```

## 🚀 Quick Commands

### Generate Video Thumbnail (using FFmpeg)
```bash
ffmpeg -i video.mp4 -ss 00:00:01 -vframes 1 -q:v 2 thumbnail.jpg
```

### Compress Video
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4
```

### Optimize Image
```bash
# Using ImageMagick
convert input.jpg -quality 85 -resize 1920x output.jpg
```

### Convert GIF to Video (Better Performance)
```bash
ffmpeg -i animation.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" animation.mp4
```

## ⚠️ Common Issues

### Issue: Media Not Showing
- **Check**: File exists in correct directory
- **Check**: Filename in gallery.json matches actual filename (case-sensitive!)
- **Check**: File extension is included in glob pattern

### Issue: Video Not Playing
- **Check**: Browser supports video format (prefer MP4 H.264)
- **Check**: Video codec is compatible (use H.264 for best compatibility)
- **Try**: Re-encode video with web-optimized settings

### Issue: Large File Sizes
- **Solution**: Compress images/videos before uploading
- **Solution**: Use appropriate resolution (1920px max width recommended)
- **Solution**: Convert large GIFs to video format

## 📊 Migration from Certifications

The old certifications are backward compatible! They work because:
1. Old entries have `image` field, new ones use `media`
2. Gallery component checks both fields
3. Default `mediaType` is "image" if not specified
4. Old `issuedAt` works with new `createdAt`

## 🎯 Next Steps

1. ✅ Add your media files to appropriate directories
2. ✅ Update gallery.json with new entries
3. ✅ Test locally with `npm run dev`
4. ✅ Verify all media types display correctly
5. ✅ Push changes to repository

---

**Need Help?** Check the main `GALLERY_IMPLEMENTATION.md` for detailed technical information.
