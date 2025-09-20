# Google Analytics Setup Guide

## Current Implementation Status
✅ **Analytics component created** (`src/components/Analytics.astro`)
✅ **SEO component integrated** (`src/components/SEOHead.astro`)
✅ **Configuration structure added** to `src/config.ts`
✅ **Type definitions updated** in `src/types/config.ts`
✅ **Layout integration completed** in `src/layouts/Layout.astro`

## Next Steps to Complete Analytics Setup

### 1. Create Google Analytics 4 Property

1. **Go to Google Analytics**: https://analytics.google.com/
2. **Create Account** (if you don't have one)
3. **Create Property**:
   - Property name: "Kenneth Namias Portfolio"
   - Reporting time zone: Select your timezone
   - Currency: Select your preferred currency
4. **Create Data Stream**:
   - Choose "Web"
   - Website URL: Your portfolio domain (e.g., `https://yourname.vercel.app`)
   - Stream name: "Portfolio Website"
5. **Copy the Measurement ID**: It will look like `G-XXXXXXXXXX`

### 2. Update Configuration

Replace the placeholder ID in `src/config.ts`:

```typescript
analytics: {
    enable: true,
    googleAnalyticsId: "G-YOUR-ACTUAL-ID", // Replace with your real GA4 ID
    partytown: false,
},
```

### 3. Test Analytics Implementation

1. **Build the project**:
   ```bash
   pnpm run build
   ```

2. **Start development server**:
   ```bash
   pnpm run dev
   ```

3. **Check browser console** for analytics events
4. **Verify in Google Analytics** (may take 24-48 hours for data to appear)

### 4. Optional: Enable Partytown for Performance

Partytown offloads third-party scripts to a web worker for better performance:

```typescript
analytics: {
    enable: true,
    googleAnalyticsId: "G-YOUR-ACTUAL-ID",
    partytown: true, // Enable for better performance
},
```

## Features Included in Current Implementation

### Analytics Component (`Analytics.astro`)
- ✅ Google Analytics 4 integration
- ✅ Enhanced ecommerce tracking
- ✅ Custom events (scroll depth, performance)
- ✅ Privacy-compliant implementation
- ✅ Development environment debugging
- ✅ Automatic page view tracking

### SEO Component (`SEOHead.astro`)
- ✅ Dynamic meta tags
- ✅ Open Graph protocol
- ✅ Twitter Card integration
- ✅ Structured data (JSON-LD)
- ✅ Canonical URLs
- ✅ Performance optimization

### Tracking Events Available

The analytics component automatically tracks:
- **Page views** (automatic)
- **Scroll depth** (25%, 50%, 75%, 100%)
- **Page load performance**
- **Custom conversions** (configurable)

## Security & Privacy Considerations

- ✅ Respects user privacy preferences
- ✅ GDPR-compliant implementation
- ✅ No tracking in development environment
- ✅ Secure script loading

## Troubleshooting

### Common Issues

1. **Analytics not appearing in GA4**:
   - Verify the Measurement ID is correct
   - Check browser console for errors
   - Data can take 24-48 hours to appear

2. **Build errors**:
   - Ensure all TypeScript types are updated
   - Run `pnpm run type-check` to verify

3. **Performance issues**:
   - Enable Partytown for better performance
   - Consider using `gtag` events sparingly

### Testing Analytics

1. **Real-time reports** in Google Analytics
2. **Browser Developer Tools** → Console → Look for gtag events
3. **Google Analytics Debugger** Chrome extension

## Next Implementation Phase

After analytics setup is complete, move to **content optimization**:
1. Update blog post meta descriptions
2. Add relevant keywords to existing content
3. Implement schema markup for articles
4. Optimize images with alt text and structured data

---

**Status**: Analytics implementation completed, waiting for Google Analytics ID configuration.