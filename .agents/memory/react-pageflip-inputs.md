---
name: react-pageflip blocks input focus/typing
description: Why form fields inside an HTMLFlipBook page can't be focused/typed into, and the fix that actually works
---

Inputs/textareas placed inside a `react-pageflip` (page-flip) page look editable
(real elements, not `disabled`/`readOnly`, no overlay) but you cannot focus or
type into them.

**Root cause (confirmed in page-flip `src/UI/UI.ts`):** the library does
`distElement.addEventListener('mousedown', onMouseDown)` on its wrapper element
(an ancestor of your fields, bubble phase), and that handler calls
`e.preventDefault()`. preventDefault on mousedown cancels the browser's default
focus, so the input never gets focus and keystrokes go nowhere. It also binds
`mousemove/mouseup/touchmove/touchend` on `window`.

**Why a React `onMouseDown={e=>e.stopPropagation()}` does NOT work:** React’s
synthetic events are dispatched at the React root, which is ABOVE the flipbook
wrapper in the DOM. The wrapper's native `mousedown` listener fires first and
preventDefaults before the event ever reaches the React root. So the React-level
stopPropagation is too late and has no effect.

**Fix that works:** attach a NATIVE listener directly on the input/textarea DOM
node (via a ref + `addEventListener`) that calls `e.stopPropagation()` for
`mousedown`/`pointerdown`/`touchstart` (plus move/up for safety). A native
listener on the target element fires before the event bubbles up to the wrapper,
so the wrapper's preventDefault never runs and focus/typing work.

**How to apply:** only attach these listeners in editable mode; leave read-only
fields alone so users can still start a swipe-to-flip gesture from anywhere. The
original element stays interactive at rest (page-flip only `cloneNode`s it
transiently during the flip animation), so a per-element ref listener is stable.
