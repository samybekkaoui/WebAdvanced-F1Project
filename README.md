# PITWALL — F1 Data Hub
Web Advanced Y1 project — Samy Bekkaoui

## Project Description
Pitwall is a Formula 1 data hub built with vanilla JavaScript and Vite. It pulls live data from the Jolpica F1 API and displays drivers, teams, standings, circuits and the race calendar for the 2026 season. Users can search, sort, filter, save favourites, view detailed modals and switch between light and dark mode. The home page shows live championship standings, last race podium, next race info, championship battle and the user's saved favourites.

## Data Sources
- F1 data: [Jolpica API](https://api.jolpi.ca/ergast/f1/) — free open-source mirror of the Ergast F1 API
- Driver & team info, photos: [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/)

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
- **Selecting elements:** `document.getElementById`, `document.querySelectorAll` used throughout `main.js`
- **Manipulating elements:** `innerHTML`, `textContent`, `setAttribute`, `removeAttribute`, `classList.toggle` used throughout render functions and modals
- **Events:** `addEventListener` on buttons, inputs, dropdowns and the document

### Modern JavaScript
- **Constants:** `const` used for all variables that don't change
- **Template literals:** Used in all render functions to build HTML strings (e.g. `renderDrivers`, `renderTeams`, `renderLastRace`)
- **Array iteration:** `forEach` used in all render functions and event listeners
- **Array methods:** `filter` (search + calendar filter), `sort` (sort dropdown), `slice` (sort copy), `find` (standings lookup + modal data), `includes` (favourites check)
- **Arrow functions:** Used in all callbacks and array methods throughout `main.js`
- **Ternary operator:** Used in sort dropdown (`value === 'az' ? a.familyName.localeCompare(...) : b.familyName.localeCompare(...)`)
- **Callback functions:** Used in every `addEventListener`, `forEach`, `filter`, `sort` call
- **Promises:** `fetch()` returns a Promise; handled via `async/await`
- **Async & Await:** All API calls use `async function` with `await` (e.g. `loadDrivers`, `loadHome`, `openDriverModal`, `openTeamModal`)
- **Observer API:** `IntersectionObserver` used for scroll-to-top button

### Data & API
- **Fetch:** Used in 7 endpoints: drivers, teams, circuits, calendar, driver standings, constructor standings, last race results + Wikipedia API in driver and team modals
- **JSON:** `response.json()` used in every fetch call; `JSON.parse` and `JSON.stringify` used for localStorage

### Storage & Validation
- **Form validation:** Search inputs show an error message when only 1 character is typed
- **localStorage:** Dark mode preference saved with `localStorage.setItem/getItem`; favourites (drivers, teams, circuits) saved as JSON arrays and persist between sessions

### Styling & Layout
- **HTML layout:** Flexbox used for header, tabs, card stats, hero stats; CSS Grid used for cards grid, home grid, modal grid
- **CSS:** Organised in `src/style.css` with CSS custom properties for theming (light/dark mode)
- **UX elements:** Star buttons for favourites, hover effects on cards, close button on modals, scroll-to-top button, hamburger menu on mobile, clickable cards that open modals

### Tooling & Structure
- **Vite:** Project set up with `npm create vite@latest`
- **Folder structure:** `index.html` in root, `src/main.js` and `src/style.css` in src folder

## Functional Requirements

### Data
- **API endpoints:** 7 endpoints (drivers, teams, circuits, calendar, driver standings, constructor standings, last race results) + Wikipedia REST API for driver and team modals
- **Visual display:** Drivers and teams as cards in a 3-column grid; standings as tables; calendar as rows; circuits as cards with SVG track layouts; home page with hero, race cards and favourites
- **Item details:** Driver modal shows 8 properties (name, nationality, date of birth, number, code, position, points, team) + Wikipedia photo and biography. Team modal shows nationality, position, points + Wikipedia photo and biography. Circuit modal shows city, country, coordinates, Google Maps link and Wikipedia link.

### Interactivity
- **Filter:** Calendar can be filtered by all/past/upcoming races
- **Search:** Drivers and teams have a live search with validation
- **Sort:** Drivers and teams can be sorted A→Z or Z→A by name
- **Modals:** Clicking any driver, team or circuit card opens a detailed modal

### Personalisation
- **Favourites:** Users can star drivers, teams and circuits; saved to localStorage and shown on the home page
- **Dark mode:** Theme preference saved to localStorage

### User Experience
- **Responsive:** 3-column grid on desktop, 2 on tablet, 1 on mobile; hamburger menu on mobile
- **Navigation:** Tab-based navigation with active state indicator
- **Home page:** Hero with live championship leaders, last race podium, next race card, championship battle card, favourites section

## AI Usage
AI (Claude) was used during development for explaining concepts, helping set up the project structure, and debugging. Below are the specific cases where AI assistance was used:

**1. Sort buttons not showing up**
The sort/filter buttons above the drivers and teams lists were disappearing after the API data loaded. The problem was that `renderDrivers()` was overwriting the entire section's `innerHTML`, which also removed the buttons. The fix was to render the list into a separate child `<div>` instead of the whole section, so the buttons stayed untouched.

**2. Favourites not staying gold after clicking**
Clicking the star icon on a driver/team/circuit card wasn't keeping it gold. The issue was that the star buttons used inline `onclick` attributes, which don't work well with dynamically rendered HTML. The fix was to switch to event delegation — listening for clicks on the parent container and checking `data-` attributes to identify which item was clicked.

**3. Integrating the Wikipedia API**
To show more info about drivers and teams in the modal (photo, biography extract), the Wikipedia REST API was integrated. The page name is extracted from the Wikipedia URL that Jolpica already provides (e.g. `https://en.wikipedia.org/wiki/Lewis_Hamilton` → `Lewis_Hamilton`), and then used to fetch `https://en.wikipedia.org/api/rest_v1/page/summary/Lewis_Hamilton`.

**4. Hamburger menu button not appearing on mobile**
The hamburger menu button wasn't showing up on small screens despite CSS media queries. The issue was a conflict between `display: none` in the base styles and `display: flex` in the media query — the base style was winning. The fix was to remove the CSS approach entirely and use JavaScript to show/hide the button based on `window.innerWidth`, which is more reliable.

