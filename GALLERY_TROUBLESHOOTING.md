# 🔧 Gallery Navigation Troubleshooting Guide

## Common Issues & Solutions

---

### ❌ Issue: "I don't see the arrow buttons"

#### ✅ Solution 1: Check if multiple items exist
- Navigation buttons only show when `totalItems > 1`
- **Test**: Make sure you have at least 2 gallery items
- **Check**: Look at the position counter (should show "X / Y" with Y > 1)

#### ✅ Solution 2: Look for pulsing WHITE circles
- Buttons are now **WHITE with pulsing animation**
- Located on **left and right sides** of the image
- Should be **very obvious** with animation

#### ✅ Solution 3: Check browser DevTools
1. Press `F12` to open DevTools
2. Go to Console tab
3. Click any image
4. Look for: `🎹 Keyboard navigation enabled for gallery modal`
5. If you see this, navigation is loaded

#### ✅ Solution 4: Clear browser cache
```bash
# Windows: Ctrl + Shift + Delete
# Mac: Cmd + Shift + Delete
```
- Select "Cached images and files"
- Click "Clear data"
- Refresh page with `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)

---

### ❌ Issue: "Arrow keys don't work"

#### ✅ Solution 1: Make sure modal is open
- Keyboard navigation ONLY works when modal is open
- **Test**: Click any gallery card first

#### ✅ Solution 2: Check console logs
1. Open DevTools (`F12`)
2. Click any gallery image
3. Press arrow keys
4. **You should see**:
   ```
   🔑 Key pressed: ArrowLeft
   ⬅️ Navigate to previous item
   🔄 Navigation: prev, Current: 5/30
   ```
5. **If you see these logs**: Navigation IS working!
6. **If no logs appear**: Something is blocking keyboard events

#### ✅ Solution 3: Check for conflicting extensions
- Browser extensions might intercept arrow keys
- **Test**: Open in Incognito/Private mode
- Disable extensions one by one

#### ✅ Solution 4: Verify focus
- Make sure modal has focus (click inside modal area)
- Don't click in search box or other inputs

---

### ❌ Issue: "Buttons are there but don't respond"

#### ✅ Solution 1: Check z-index
- Buttons should have `z-50` (very high)
- **Inspect element**: Right-click button → Inspect
- **Verify**: `z-index: 50` is in computed styles

#### ✅ Solution 2: Check pointer-events
- Modal backdrop shouldn't block buttons
- **Inspect element**: Check if `pointer-events: none` is interfering

#### ✅ Solution 3: Console debugging
1. Open DevTools
2. Click a navigation button
3. **You should see**:
   ```
   🔄 Navigation: prev, Current: 5/30
   ⬅️ Prev: 5 → 4
   ```
4. If you see this, navigation IS triggering

---

### ❌ Issue: "Navigation goes in wrong direction"

#### ✅ Check implementation
- Left button should call `onNavigate("prev")`
- Right button should call `onNavigate("next")`
- Console logs will show which direction is triggered

---

### ❌ Issue: "Position counter shows wrong numbers"

#### ✅ Solution: Check filtered results
- Counter shows position in **current view** (filtered/searched)
- Example: If you search "Google" (9 results), counter shows "X / 9"
- This is CORRECT behavior - it respects active filters

---

### ❌ Issue: "Keyboard hint doesn't show"

#### ✅ Check implementation
- Hint only shows when `totalItems > 1`
- Located at **bottom center** of modal
- Should be pulsing with black background

#### ✅ Force visibility test
```typescript
// Temporarily remove the condition to always show hint
{/* {totalItems > 1 && ( */}
  <div className="absolute bottom-6 left-1/2...">
    Use ← → arrow keys to navigate
  </div>
{/* )} */}
```

---

### ❌ Issue: "Console logs show but nothing changes"

#### ✅ Check selectedIndex state
1. Add this to Gallery component:
```typescript
useEffect(() => {
  console.log("📍 Selected index changed:", selectedIndex);
}, [selectedIndex]);
```

2. **You should see**:
   ```
   📍 Selected index changed: 5
   📍 Selected index changed: 6
   ```

3. **If index changes**: Modal should update
4. **If index doesn't change**: State update is broken

---

## 🔍 Debugging Checklist

### Step 1: Visual Check
- [ ] Modal is open
- [ ] Buttons are visible (white, pulsing circles)
- [ ] Keyboard hint is visible at bottom
- [ ] Position counter shows in header

### Step 2: Console Check
- [ ] Open DevTools (`F12`)
- [ ] Console tab is visible
- [ ] Click gallery image
- [ ] See "🎹 Keyboard navigation enabled"
- [ ] Press arrow keys
- [ ] See "🔑 Key pressed: ArrowLeft"
- [ ] See "🔄 Navigation: prev"

### Step 3: Functionality Check
- [ ] Click left button → Image changes
- [ ] Click right button → Image changes
- [ ] Press ← key → Image changes
- [ ] Press → key → Image changes
- [ ] Press Esc → Modal closes

### Step 4: Integration Check
- [ ] Search "Google"
- [ ] Open any result
- [ ] Navigate with arrows
- [ ] Only sees Google items
- [ ] Position counter shows "X / 9"

---

## 🆘 Still Having Issues?

### Collect Debug Information
1. **Browser**: Chrome / Firefox / Safari / Edge?
2. **Version**: What version number?
3. **OS**: Windows / Mac / Linux?
4. **Console Errors**: Any red errors in DevTools?
5. **Console Logs**: What logs do you see when clicking/pressing keys?
6. **Network Tab**: Are images loading?

### Quick Verification Command
Run in browser console:
```javascript
// Check if Gallery component is mounted
console.log("Gallery cards:", document.querySelectorAll('[role="button"]').length);

// Check if modal is present
console.log("Modal:", document.querySelector('[role="dialog"]'));

// Check if navigation buttons are present
console.log("Nav buttons:", document.querySelectorAll('[aria-label*="image"]').length);
```

### Last Resort: Fresh Start
```bash
# Stop dev server (Ctrl + C)
npm run dev

# If that doesn't work, clear node_modules
rm -rf node_modules
npm install
npm run dev
```

---

## ✅ Expected Behavior Summary

### What You SHOULD See:
1. ✅ Gallery grid with masonry layout
2. ✅ Click any card → Modal opens
3. ✅ **PULSING WHITE BUTTONS** on left and right
4. ✅ Keyboard hint at bottom: "Use ← → arrow keys to navigate"
5. ✅ Position counter in header: "5 / 30"
6. ✅ Issuer name with Award icon
7. ✅ Arrow keys work to navigate
8. ✅ Clicking buttons navigates
9. ✅ Console shows detailed logs
10. ✅ Navigation wraps around

### What You SHOULD NOT See:
- ❌ Invisible or hidden buttons
- ❌ Buttons that don't respond
- ❌ Console errors (red text)
- ❌ Arrow keys doing nothing
- ❌ Position counter not updating

---

**Last Updated**: November 8, 2025  
**Version**: 2.1.0 (Enhanced Visibility Update)
