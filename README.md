# PITWALL — F1 Data Hub
Web Advanced Y1 project — Samy Bekkaoui

## Project Description
Pitwall is a Formula 1 data hub built with vanilla JavaScript and Vite. It pulls live data from the Jolpica F1 API and displays drivers, teams, standings, circuits and the race calendar for the 2026 season. Users can search, sort, filter, save favourites and switch between light and dark mode.

## Data Sources
- F1 data: [Jolpica API](https://api.jolpi.ca/ergast/f1/) — free open-source mirror of the Ergast F1 API
- Driver info & photos: [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/)

## References
- Dark mode toggle animation: [codepen.io/mrozilla/pen/OJJNjRb](https://codepen.io/mrozilla/pen/OJJNjRb)
- Circuit SVG track layouts: [github.com/julesr0y/f1-circuits-svg](https://github.com/julesr0y/f1-circuits-svg)

## Installation
1. Clone the repository
2. Run `cd mijn-f1-project`
3. Run `npm install`
4. Run `npm run dev`
5. Open `http://localhost:5173` in your browser

## Technical Requirements

### DOM Manipulation
- **Selecting elements:** `document.getElementById`, `document.querySelectorAll` used throughout `main.js` (lines 6, 32, 96, etc.)
- **Manipulating elements:** `innerHTML`, `textContent`, `setAttribute`, `removeAttribute`, `classList.toggle` used throughout render functions
- **Events:** `addEventListener` on buttons, inputs, dropdowns and the document (lines 45, 110, 155, 175, etc.)

### Modern JavaScript
- **Constants:** `const` used for all variables that don't change (lines 6, 32, 96, etc.)
- **Template literals:** Used in all render functions to build HTML strings (e.g. `renderDrivers`, `renderTeams`)
- **Array iteration:** `forEach` used in all render functions and event listeners
- **Array methods:** `filter` (search + calendar filter), `sort` (sort dropdown), `slice` (sort copy), `find` (standings lookup), `includes` (favourites check)
- **Arrow functions:** Used in all callbacks and array methods throughout `main.js`
- **Ternary operator:** Used in sort dropdown (e.g. line ~330: `value === 'az' ? a.familyName.localeCompare(...) : b.familyName.localeCompare(...)`)
- **Callback functions:** Used in every `addEventListener`, `forEach`, `filter`, `sort` call
- **Promises:** `fetch()` returns a Promise; handled via `async/await`
- **Async & Await:** All API calls use `async function` with `await` (e.g. `loadDrivers`, `loadConstructors`, `loadCalendar`, etc.)
- **Observer API:** `IntersectionObserver` used for scroll-to-top button (lines 4–27)

### Data & API
- **Fetch:** Used in `loadDrivers`, `loadConstructors`, `loadCircuits`, `loadCalendar`, `loadDriverStandings`, `loadConstructorStandings`, `openDriverModal` (Wikipedia)
- **JSON:** `response.json()` used in every fetch call; `JSON.parse` and `JSON.stringify` used for localStorage

### Storage & Validation
- **Form validation:** Search inputs show an error message when only 1 character is typed (lines ~340, ~430)
- **localStorage:** Dark mode preference saved with `localStorage.setItem/getItem`; favourites (drivers, teams, circuits) saved as JSON arrays

### Styling & Layout
- **HTML layout:** Flexbox used for header, tabs, card stats, standings; CSS Grid used for cards grid, calendar rows, modal grid
- **CSS:** Organised in `src/style.css` with CSS custom properties for theming
- **UX elements:** Star buttons for favourites, hover effects on cards, close button on modal, scroll-to-top button, hamburger menu on mobile

### Tooling & Structure
- **Vite:** Project set up with `npm create vite@latest`
- **Folder structure:** `index.html` in root, `src/main.js` and `src/style.css` in src folder

## Functional Requirements

### Data
- **API endpoint:** 6 endpoints used (drivers, teams, circuits, calendar, driver standings, constructor standings + Wikipedia for driver modals)
- **Visual display:** Drivers and teams shown as cards in a 3-column grid; standings as tables; calendar as rows; circuits as cards with SVG track layouts
- **Item details:** Driver modal shows 8 properties: name, nationality, date of birth, number, code, championship position, points, team + Wikipedia photo and extract

### Interactivity
- **Filter:** Calendar can be filtered by past/upcoming races
- **Search:** Drivers and teams have a live search with validation
- **Sort:** Drivers and teams can be sorted A→Z or Z→A by name

### Personalisation
- **Favourites:** Users can star drivers, teams and circuits; saved to localStorage and persisted between sessions
- **Dark mode:** Theme preference saved to localStorage

### User Experience
- **Responsive:** 3-column grid on desktop, 2 on tablet, 1 on mobile; hamburger menu on mobile
- **Navigation:** Tab-based navigation with active state indicator

## AI Usage
AI (Claude) was used during development for explaining concepts, helping set up the project structure, and debugging. Below are the specific cases where AI assistance was used:

**1. Sort buttons not showing up**
The sort/filter buttons above the drivers and teams lists were disappearing after the API data loaded. The problem was that `renderDrivers()` was overwriting the entire section's `innerHTML`, which also removed the buttons. The fix was to render the list into a separate child `<div>` instead of the whole section, so the buttons stayed untouched.

**2. Favourites not staying gold after clicking**
Clicking the star icon on a driver/team/circuit card wasn't keeping it gold. The issue was that the star buttons used inline `onclick` attributes, which don't work well with dynamically rendered HTML. The fix was to switch to event delegation — listening for clicks on the parent container and checking `data-` attributes to identify which item was clicked.

**3. Integrating the Wikipedia API**
To show more info about drivers in the modal (photo, biography extract), the Wikipedia REST API was integrated. The page name is extracted from the Wikipedia URL that Jolpica already provides (e.g. `https://en.wikipedia.org/wiki/Lewis_Hamilton` → `Lewis_Hamilton`), and then used to fetch `https://en.wikipedia.org/api/rest_v1/page/summary/Lewis_Hamilton`.

**4. Hamburger menu button not appearing on mobile**
The hamburger menu button wasn't showing up on small screens despite CSS media queries. The issue was a conflict between `display: none` in the base styles and `display: flex` in the media query — the base style was winning. The fix was to remove the CSS approach entirely and use JavaScript to show/hide the button based on `window.innerWidth`, which is more reliable.

