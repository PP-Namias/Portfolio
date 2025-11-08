# 🧪 Testing Checklist

## ✅ Feature Testing

### 1. Calendly Integration

#### Header Button
- [ ] Button visible on desktop (hidden on mobile)
- [ ] Opens Calendly in new tab
- [ ] Correct URL: `https://calendly.com/pp-namias`
- [ ] Icon displays correctly
- [ ] Hover states work

#### Contact Section CTA
- [ ] Button visible and prominent
- [ ] Full width on mobile, auto on desktop
- [ ] Opens Calendly in new tab
- [ ] Correct styling (primary color)

#### Configuration
- [ ] Update Calendly URL in both files:
  - `src/components/common/calendly-button.tsx`
  - `src/components/common/floating-action-button.tsx`

---

### 2. Floating Action Button (FAB)

#### Positioning
- [ ] Fixed bottom-right corner
- [ ] Above all other content (z-index: 50)
- [ ] Responsive spacing (4 on mobile, 6 on desktop)

#### Main Button
- [ ] Calendar icon visible
- [ ] Transforms to X when open
- [ ] Smooth rotation animation
- [ ] Primary color background
- [ ] Shadow effect visible

#### Speed Dial Actions
- [ ] **Schedule Meeting**
  - [ ] Opens Calendly correctly
  - [ ] Tooltip shows on hover
  - [ ] Primary color button
  
- [ ] **Download Resume**
  - [ ] Triggers download
  - [ ] Toast notification appears
  - [ ] Secondary color button
  
- [ ] **Quick Contact**
  - [ ] Scrolls to contact section
  - [ ] Smooth scroll behavior
  - [ ] Success color button

#### Animations
- [ ] Expand/collapse smooth
- [ ] Staggered action appearance
- [ ] Icon rotation timing correct
- [ ] Tooltips appear on left

---

### 3. Enhanced Contact Form

#### New Fields

**Project Type** (Required)
- [ ] Dropdown displays all 6 options
- [ ] Selection works correctly
- [ ] Error shows if not selected
- [ ] Options:
  - [ ] Web Application
  - [ ] Mobile App
  - [ ] API Development
  - [ ] UI/UX Design
  - [ ] Consulting
  - [ ] Other

**Budget Range** (Optional)
- [ ] Dropdown displays all 5 options
- [ ] Selection optional (no error if empty)
- [ ] Options:
  - [ ] Under $1,000
  - [ ] $1,000 - $5,000
  - [ ] $5,000 - $10,000
  - [ ] $10,000+
  - [ ] Not sure yet

**Timeline** (Optional)
- [ ] Dropdown displays all 5 options
- [ ] Selection optional
- [ ] Options:
  - [ ] ASAP (< 1 month)
  - [ ] 1-3 months
  - [ ] 3-6 months
  - [ ] 6+ months
  - [ ] Flexible

#### Form Behavior
- [ ] All fields validate correctly
- [ ] Submit disabled until valid
- [ ] Loading state during submission
- [ ] Success toast on send
- [ ] Error toast on failure
- [ ] Form resets after success
- [ ] Required fields show error when touched

#### Layout
- [ ] Budget/Timeline in 2-column grid on desktop
- [ ] Single column on mobile
- [ ] Proper spacing between fields
- [ ] Labels capitalized correctly

---

### 4. Project Search & Filter

#### Search Bar
- [ ] Placeholder text visible
- [ ] Search icon on left
- [ ] Clear (X) icon appears when typing
- [ ] Real-time filtering as you type
- [ ] Searches in:
  - [ ] Project title
  - [ ] Project description
  - [ ] Project tags

#### Filter Toggle
- [ ] Slider icon button
- [ ] Toggles filter panel
- [ ] Visual state change when active
- [ ] Smooth expand/collapse

#### Year Filter
- [ ] Dropdown shows all project years
- [ ] Sorted newest to oldest
- [ ] "All years" placeholder
- [ ] Filters correctly

#### Tag Filter
- [ ] Shows up to 20 popular tags
- [ ] Tags clickable (chips)
- [ ] Selected tags highlighted (primary color)
- [ ] Multiple tags selectable
- [ ] Tags appear as chips below

#### Clear Filters
- [ ] Button appears when filters active
- [ ] "Clear" text visible
- [ ] Resets all filters
- [ ] Danger color (red)

#### Results Display
- [ ] Shows count: "Showing X projects"
- [ ] Count updates in real-time
- [ ] Selected tags shown as removable chips
- [ ] Click chip X to remove individual tag

#### Filter Combinations
- [ ] Search + Year works
- [ ] Search + Tags works
- [ ] Year + Tags works
- [ ] All three combined works
- [ ] Empty results handled gracefully

---

## 🎨 Visual Testing

### Desktop (1920x1080)
- [ ] All components visible
- [ ] Proper spacing
- [ ] No overflow issues
- [ ] FAB not blocking content

### Tablet (768x1024)
- [ ] Responsive layout adapts
- [ ] Touch targets adequate
- [ ] FAB accessible
- [ ] Form fields stack properly

### Mobile (375x667)
- [ ] Single column layout
- [ ] Calendly button in header hidden
- [ ] FAB positioned correctly
- [ ] Search filter collapsible
- [ ] Form readable and usable

---

## 🌓 Theme Testing

### Light Mode
- [ ] All buttons visible
- [ ] Contrast sufficient
- [ ] FAB stands out
- [ ] Filter panel readable

### Dark Mode
- [ ] All buttons visible
- [ ] Contrast sufficient
- [ ] FAB stands out
- [ ] Filter panel readable

### Theme Toggle
- [ ] Smooth transition
- [ ] No flash of content
- [ ] FAB transitions smoothly
- [ ] Search filter transitions

---

## ⌨️ Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all buttons
- [ ] Enter activates buttons
- [ ] FAB accessible via keyboard
- [ ] Form fields focusable
- [ ] Search input focusable
- [ ] Dropdowns navigable

### Screen Reader
- [ ] Button labels announced
- [ ] Form labels read correctly
- [ ] Error messages announced
- [ ] Tooltips accessible
- [ ] Search results count announced

---

## 🔧 Configuration Checklist

### Before Deployment:
1. **Calendly URL** (3 locations)
   - [ ] `src/components/common/calendly-button.tsx` (line 13)
   - [ ] `src/components/common/floating-action-button.tsx` (line 18)
   - [ ] `src/assets/portfolio-resources/data/socials.json` (line 6)

2. **WhatsApp Number**
   - [ ] `src/assets/portfolio-resources/data/socials.json` (line 18)
   - [ ] Format: `https://wa.me/YOURNUMBER`

3. **Email Address**
   - [ ] `src/assets/portfolio-resources/data/socials.json` (line 12)
   - [ ] `src/components/partials/footer.tsx` (already correct)

---

## 🚀 Performance Testing

### Load Time
- [ ] Initial page load < 3s
- [ ] FAB doesn't block render
- [ ] Search is instant (<100ms)
- [ ] Filter updates smooth

### Bundle Size
- [ ] No significant increase
- [ ] Lazy load animations
- [ ] Tree-shaking effective

### Memory
- [ ] No memory leaks
- [ ] Search/filter cleanup
- [ ] Component unmount clean

---

## 🐛 Edge Cases

### Empty States
- [ ] No projects to filter
- [ ] Search with no results
- [ ] Form with missing data
- [ ] Network errors handled

### Error States
- [ ] Calendly URL fails
- [ ] Resume download fails
- [ ] Form submission fails
- [ ] Search breaks gracefully

### Data Validation
- [ ] Special characters in search
- [ ] Very long project names
- [ ] Projects without tags
- [ ] Projects without year

---

## ✅ Final Checklist

Before marking as complete:
- [ ] All tests passing
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Lint checks pass
- [ ] Mobile tested on real device
- [ ] Desktop tested on multiple browsers
- [ ] Accessibility audit passed
- [ ] Performance metrics acceptable
- [ ] Configuration updated
- [ ] Documentation complete

---

## 📊 Browser Compatibility

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Firefox Mobile
- [ ] Samsung Internet

---

## 🎯 Success Criteria

### User Experience
- ✅ All 4 features working
- ✅ No broken functionality
- ✅ Smooth interactions
- ✅ Professional appearance

### Technical
- ✅ No errors in console
- ✅ TypeScript checks pass
- ✅ Build successful
- ✅ Performance maintained

### Business
- ✅ Easier to contact you
- ✅ Better project discovery
- ✅ Qualified lead capture
- ✅ Professional image

---

**Test Date**: __________  
**Tester**: __________  
**Result**: ☐ Pass ☐ Fail  
**Notes**: 

---

## 🔄 Regression Testing

Test these after future changes:
- [ ] Calendly buttons still work
- [ ] FAB doesn't conflict with new features
- [ ] Search filter performance maintained
- [ ] Form validation still correct
