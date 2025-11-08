# Gallery Quick Reference

## 🎯 Overview
The Gallery section displays certifications, images, videos, and GIFs in an Instagram-style masonry layout with advanced filtering, search, and navigation capabilities.

## 🔍 Search & Filter

### Filter Buttons
- **All** - Show all gallery items (default)
- **Images** - Show only image files (JPG, PNG)
- **Videos** - Show only video files (MP4)
- **GIFs** - Show only animated GIFs

### Search Functionality
The search box searches across multiple fields:
- **Title** - Certificate or item name
- **Description** - Full item description
- **Tags** - Technology tags (Python, Data Science, etc.)
- **Issuer** - Organization name (Google, AWS, DAP, etc.)

**Examples:**
- Search "Google" → Shows all Google certifications
- Search "Python" → Shows all Python-related items
- Search "Data Science" → Shows data science certifications
- Search "DAP" → Shows all DAP certifications

## ⌨️ Keyboard Shortcuts

### Modal Navigation
When viewing an item in the modal:

| Shortcut | Action |
|----------|--------|
| `←` Left Arrow | Navigate to PREVIOUS item (wraps around) |
| `→` Right Arrow | Navigate to NEXT item (wraps around) |
| `Esc` | Close modal |

**Features:**
- ✅ Navigation wraps around (last → first, first → last)
- ✅ Works with filtered/searched results  
- ✅ Instant navigation - no page reload
- ✅ Visual feedback with position counter

## 🖱️ Mouse Navigation

### In Modal
- **Click Left ChevronLeft Button** - Go to previous item (floating overlay on left)
- **Click Right ChevronRight Button** - Go to next item (floating overlay on right)
- **Click Outside Modal** - Close modal
- **Click Close Button** - Close modal

### On Cards
- **Click Any Card** - Open modal preview at that position
- **Hover Card** - Show title, icon, and date overlay

## 📊 Display Information

### Gallery Card Shows:
- Media preview (image/video/GIF)
- Title
- Creation date
- Tags

### Modal Shows:
- Full-size media
- Title
- Issuer name (with Award icon)
- Description
- Creation date
- Tags
- Position counter (e.g., "5 / 30")
- Navigation buttons

## 🎨 Visual Indicators

### Position Counter
Located in modal header, shows:
- Current position (e.g., "5")
- Total items (e.g., "/ 30")
- Updates dynamically with navigation

### Navigation Buttons
- Floating on left/right sides of image
- Semi-transparent black background
- Only visible when multiple items exist
- Disabled when at first/last item

### Filter Badges
- Active filter highlighted
- Shows count of filtered items
- Icons for each media type

## 🔄 Responsive Behavior

### Column Layout
- **Desktop (>1024px)** - 5 columns
- **Laptop (768-1024px)** - 4 columns
- **Tablet (640-768px)** - 3 columns
- **Mobile (<640px)** - 2 columns

### Modal Behavior
- Centered on all devices
- Scrollable content
- Touch-friendly navigation
- Accessible keyboard controls

## 📱 Mobile Gestures
(Future Enhancement)
- Swipe left → Next item
- Swipe right → Previous item
- Pinch to zoom → Zoom image

## 🛠️ Technical Details

### Media Type Detection
- **Images**: `.jpg`, `.jpeg`, `.png`, `.webp`
- **Videos**: `.mp4`, `.webm`
- **GIFs**: `.gif`

### Data Structure
Each gallery item contains:
```json
{
  "title": "Certification Name",
  "mediaType": "image|video|gif",
  "media": "filename.jpg",
  "image": "filename.jpg",
  "issuer": "Organization Name",
  "createdAt": "YYYY-MM-DD",
  "tags": ["Tag1", "Tag2"]
}
```

### Search Algorithm
- Case-insensitive matching
- Searches across: title, description, tags, issuer
- Real-time filtering as you type
- Updates count dynamically

## 🚀 Performance Tips

1. **Use Filters First** - Narrow down results before searching
2. **Specific Search Terms** - Use exact issuer names for best results
3. **Keyboard Navigation** - Faster than clicking buttons
4. **Clear Search** - Remove search text to reset

## 📚 Common Use Cases

### Find All Google Certifications
1. Type "Google" in search box
2. View filtered results
3. Use arrow keys to browse quickly

### View Only Images
1. Click "Images" filter button
2. Browse masonry layout
3. Click any card to open modal

### Navigate Through All Items
1. Click any card to open modal
2. Use `→` key to go through all items
3. Press `Esc` when done

### Find Specific Technology
1. Search for technology name (e.g., "Python")
2. View all related certifications
3. Filter further with media type if needed

## ⚡ Quick Tips

- **Fast Navigation**: Use arrow keys instead of clicking buttons
- **Quick Close**: Press `Esc` instead of clicking X
- **Issuer Search**: Search by organization to see all their certifications
- **Tag Filtering**: Search tags to find technology-specific items
- **Position Tracking**: Use counter to know your place in the gallery

## 🔗 Related Documentation

- `GALLERY_SUMMARY.md` - Complete feature overview
- `GALLERY_NAVIGATION_SEARCH.md` - Technical implementation details
- `GALLERY_IMPLEMENTATION_PLAN.md` - Development roadmap
- `GALLERY_TESTING.md` - Testing procedures

---

**Last Updated**: 2024
**Version**: 1.0.0
