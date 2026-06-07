# PITWALL - F1 Data Hub
Web Advanced Y1 final project - Samy Bekkaoui

## Project Description
Pitwall is a Formula 1 data hub built with vanilla JavaScript and Vite. It pulls data from the Jolpica F1 API and displays drivers, teams, standings, circuits and the race calendar for the 2026 season. Users can search, sort, filter, save favourites, view detailed modals and switch between light and dark mode. The home page shows live championship standings, last race podium, next race info, championship battle and the user's saved favourites.

## Data Sources
- F1 data: [Jolpica API](https://api.jolpi.ca/ergast/f1/) - free open-source mirror of the Ergast F1 API
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

All references below point to `mijn-f1-project/src/main.js` unless stated otherwise.

### DOM Manipulation

**Selecting elements**
Multiple selection methods are used throughout the project:
- `document.getElementById` is used to grab specific elements by ID - for example the hamburger button, mobile menu, dark mode toggle, search inputs, sort dropdowns, standings divs and all modal fields (lines 6, 32, 55, 91, 95, 192, 197, 209, 213, 281, 286 etc.)
- `document.querySelectorAll` selects multiple elements at once - used to grab all tab buttons and all content sections for the tab switching logic (lines 93, 95, 97)
- `document.querySelector` selects the first matching element - used to grab the desktop tabs nav (line 57)

**Manipulating elements**
- `innerHTML` is used to inject dynamically built HTML strings into the page - used in every render function (`renderDrivers`, `renderTeams`, `renderCircuits`, `renderCalendar`, `renderDriverStandings`, `renderConstructorStandings`, `renderLastRace`, `renderNextRace`, `renderChampionshipBattle`, `renderHomeFavourites`) - lines 513, 614, 700, 788, 870, 912, 985, 1005, 1020
- `textContent` is used to safely set plain text in modal fields - lines 208–217
- `setAttribute` / `removeAttribute` are used to show/hide sections (`hidden` attribute), update `aria-selected` on tab buttons, and open/close modals - lines 103–117, 224, 263, 290
- `classList.toggle` / `classList.add` / `classList.remove` are used to apply dark mode (`body.dark`) and toggle the active star button class (`star-btn--active`) - lines 38–48, 222, 261
- `style.display` is used in JavaScript to show or hide the hamburger button based on screen width - lines 62–75

**Attaching events**
`addEventListener` is used instead of inline `onclick` throughout the project. Events are attached to buttons, inputs, dropdowns, the document and the window:
- Click events on the hamburger button, mobile menu tabs, modal close buttons, scroll-to-top button and star buttons (via event delegation on `document`)
- `change` events on the sort and filter dropdowns
- `input` events on the search fields
- `resize` event on `window` to update the navigation on screen size change
Lines: 25, 43, 78, 83, 86, 122, 127, 232, 235, 268, 271, 302, 307, 429, 452, 472, 559, 627, 715

### Modern JavaScript

**Constants (`const`)**
`const` is used for all variables that are never reassigned - DOM element references, API URLs, the SVG base URL, the circuit SVG mapping object and all function-scoped intermediate values. Examples: lines 6, 32, 55–57, 91–95, 192, 197, 390, 393, 566, 619

**Template literals**
Template literals (backtick strings) are used in every render function to build multi-line HTML strings with embedded JavaScript expressions. This avoids messy string concatenation and makes the HTML structure readable:
```js
html += `
  <div class="card" data-driver-id="${driver.driverId}">
    <div class="card_name">${driver.givenName} ${driver.familyName}</div>
  </div>
`;
```
Lines: 490–509, 586–606, 672–690, 772–783, 852–863, 897–909

**Array iteration (`forEach`)**
`forEach` is used to loop over drivers, teams, circuits, races, standings entries, tab buttons and card elements to build HTML or attach event listeners. Lines: 86, 100, 110, 122, 127, 489, 514, 585, 614, 671, 700, 851, 869, 896, 912

**Array methods**
Multiple array methods are used throughout:
- `filter` - used in the search functions to match drivers/teams by name, in the calendar filter to separate past/upcoming races, and in `renderHomeFavourites` to get only the starred items: lines 460, 473, 631, 719, 970, 1063, 1087, 1099
- `sort` - used in the sort dropdown listeners to sort drivers/teams by name (A→Z, Z→A) or championship position: lines 432, 435, 439, 443
- `slice` - used before `sort` to avoid mutating the original array: line 431
- `find` - used to look up a driver's/team's standings data by ID, and to find the matching object when a card is clicked: lines 199, 258, 337, 341, 484, 576, 668, 847
- `includes` - used in the favourites system to check if an item is already starred: lines 155, 161, 167, 487, 578, 670
- `findIndex` - used in the sort-by-position logic to get the index of a driver/team in the standings array: lines 440, 444

**Arrow functions**
Arrow functions are used for all callbacks - in `addEventListener`, `forEach`, `filter`, `sort`, `find` and `findIndex` calls. They keep the code concise and maintain the correct `this` context. Lines: 15, 25, 43, 78, 86, 100, 110, 122, 127, 432–444, 460, 473, 489, 514

**Ternary operator**
The ternary operator replaces `if/else` in several places:
- Sort direction: `value === 'az' ? a.familyName.localeCompare(b.familyName) : b.familyName.localeCompare(a.familyName)` - lines 432–444
- Calendar filter: `value === 'all' ? true : value === 'past' ? raceDate < today : raceDate >= today` - lines 634–636
- Past race styling: `isPast ? 'calrow--past' : ''` - line 778
- Standings P1 highlight: `entry.position === '1' ? 'standings-table_row--first' : ''` - lines 853, 898
- Standings data fallback: `standing ? standing.position : '?'` - lines 200, 201, 259, 260, 338, 341, 484–486, 576–578

**Callback functions**
Every `addEventListener`, `forEach`, `filter`, `sort`, `find` and `findIndex` call receives a callback function as an argument. For example the document click listener for star buttons receives a callback that checks the clicked element and calls the correct toggle function. Lines: 15, 25, 43, 78, 86, 100, 110, 122, 127, 432, 460, 473, 489

**Promises**
`fetch()` returns a Promise. These are handled using `async/await` rather than `.then()` chains, which makes the asynchronous code easier to read. The Promise-based nature of `fetch` is what allows the `await` keyword to pause execution until the response arrives. Lines: 397, 530, 565, 623, 657, 711, 753, 830, 882, 936

**Async & Await**
All API calls use `async function` with `await` so that the code waits for the response before continuing:
- `loadDrivers` (line 398) - fetches 2026 drivers from Jolpica
- `loadConstructors` (line 566) - fetches 2026 constructors
- `loadCircuits` (line 658) - fetches 2026 circuits
- `loadCalendar` (line 712) - fetches 2026 race calendar
- `loadDriverStandings` (line 831) - fetches driver championship standings
- `loadConstructorStandings` (line 883) - fetches constructor standings
- `loadHome` (line 937) - fetches last race results
- `openDriverModal` (line 302) - fetches Wikipedia summary for a driver
- `openTeamModal` (line 192) - fetches Wikipedia summary for a team

**Observer API**
`IntersectionObserver` is used to watch an invisible anchor element at the top of the page. When the user scrolls down and the anchor leaves the viewport, the scroll-to-top button is shown. When the user scrolls back to the top and the anchor re-enters the viewport, the button is hidden again. This avoids listening to the `scroll` event on every pixel change, which would be less efficient. Lines 14–22:
```js
const scrollObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    scrollTopBtn.hidden = entry.isIntersecting;
  });
});
scrollObserver.observe(topAnchor);
```

### Data & API

**Fetch**
`fetch()` is used to call 7 Jolpica API endpoints and the Wikipedia REST API:
- Drivers: `https://api.jolpi.ca/ergast/f1/2026/drivers/` (line 399)
- Constructors: `https://api.jolpi.ca/ergast/f1/2026/constructors/` (line 567)
- Circuits: `https://api.jolpi.ca/ergast/f1/2026/circuits/` (line 659)
- Calendar: `https://api.jolpi.ca/ergast/f1/2026/races/` (line 713)
- Driver standings: `https://api.jolpi.ca/ergast/f1/2026/driverstandings/` (line 832)
- Constructor standings: `https://api.jolpi.ca/ergast/f1/2026/constructorstandings/` (line 884)
- Last race results: `https://api.jolpi.ca/ergast/f1/2026/last/results/` (line 938)
- Wikipedia (driver modal): `https://en.wikipedia.org/api/rest_v1/page/summary/{title}` (line 368)
- Wikipedia (team modal): same endpoint (line 227)

**JSON**
- `response.json()` converts the raw fetch response into a JavaScript object - lines 401, 569, 661, 715, 834, 886, 940
- The Jolpica API wraps all data several levels deep (e.g. `data.MRData.DriverTable.Drivers`), so the correct nested path is used each time
- `JSON.parse` converts stored localStorage strings back into arrays on page load - lines 143–145
- `JSON.stringify` converts arrays into strings before saving to localStorage - lines 157, 163, 169

### Storage & Validation

**Form validation**
Both search inputs validate the query length before filtering:
- If the user has typed exactly 1 character, an error message is shown and the filter does not run (returning early with `return`)
- Once 2 or more characters are typed the error is hidden and the filter runs normally
- Drivers search: lines 452–457; Teams search: lines 629–634
```js
if (query.length === 1) {
  driversSearchError.style.display = 'block';
  return;
} else {
  driversSearchError.style.display = 'none';
}
```

**localStorage**
localStorage is used to persist two types of user preferences between sessions:

1. Dark mode - the current theme (`'dark'` or `'light'`) is saved as a string:
   - Read on page load to restore the previous theme (line 35)
   - Saved every time the toggle is switched (lines 45, 48)

2. Favourites - three separate arrays (drivers, teams, circuits) are saved as JSON strings:
   - Read on page load with `JSON.parse` and defaulted to `[]` if nothing is saved yet (lines 143–145)
   - Updated and saved with `JSON.stringify` every time a star is clicked (lines 157, 163, 169)
   - Displayed on the home page under "Your Favourites" so the user can see their saved items without navigating to each tab

### Styling & Layout

**HTML layout**
- Flexbox is used for the header (`topbar_inner`), tab bar (`tabs_inner`), hero stats row (`hero_stats`), card stat rows (`card_stats`) and modal header (`modal_head`) in `style.css`
- CSS Grid is used for the cards grid (3 columns on desktop, `cards-grid` ~line 195 in `style.css`), the home page grid (3 columns, `home-grid` ~line 320) and the modal detail grid (2 columns, `modal_grid` ~line 355)

**CSS**
CSS custom properties (variables) are defined at the top of `style.css` (lines 3–11):
```css
:root {
  --bg: #f5f5f5;
  --paper: #ffffff;
  --ink: #1a1a1a;
  --accent: #e10600;
  ...
}
```
When dark mode is active, `body.dark` overrides these variables - all other styles automatically adapt without any duplication.

**UX elements**
- Star buttons on every driver, team and circuit card for adding/removing favourites - lines 490, 586, 672
- Hover effects on cards (slight lift via `transform: translateY(-3px)`) defined in `style.css`
- Close buttons on all three modals - lines 232, 268, 302
- Scroll-to-top button that appears when the user scrolls down - line 25
- Hamburger menu that replaces the tab bar on mobile screens - lines 78–88
- Clickable cards that open a detail modal - lines 514–520, 614–620, 700–706
- Google Maps link in the circuit modal built from the circuit's latitude/longitude coordinates - line 263
- SVG track layout images in circuit cards sourced from an open GitHub repository

### Tooling & Structure

**Vite**
The project was initialised with `npm create vite@latest` using the vanilla template. Vite handles local development with hot reload (`npm run dev`) and production bundling (`npm run build`). Config is in `mijn-f1-project/package.json`.

**Folder structure**
```
WebAdvanced-F1Project/
├── README.md
├── claude_ai-chatlog.txt
├── screenshots/
│   ├── Desktop/
│   └── Mobile/
└── mijn-f1-project/
    ├── index.html
    ├── package.json
    ├── src/
    │   ├── main.js
    │   └── style.css
    └── dist/          ← generated by `npm run build`
```

---

## Functional Requirements

### Data display
- **API endpoints:** 7 Jolpica endpoints + Wikipedia REST API for driver and team modals
- **Visual display:** Drivers and teams shown as cards in a 3-column grid; standings as tables; calendar as rows with round number, name, location and date; circuits as cards with SVG track layouts; home page with hero section, last race podium, next race card, championship battle card and favourites
- **Item details (6+ attributes):**
  - Driver cards show: championship position, full name, nationality, permanent number, points, driver code (6 attributes)
  - Driver modal shows: nationality, date of birth, number, code, championship position, points, team + Wikipedia photo and biography (8 attributes)
  - Team modal shows: nationality, championship position, points + Wikipedia photo and biography
  - Circuit modal shows: city, country, latitude, longitude, Google Maps link, Wikipedia link (6 attributes)

### Interactivity
- **Filter:** Calendar can be filtered by all / past / upcoming races using a dropdown - lines 623–637
- **Search:** Drivers (lines 452–473) and teams (lines 629–650) have a live search input with form validation (error shown for single-character queries)
- **Sort:** Drivers (lines 429–447) can be sorted A→Z, Z→A by name, by car number (low→high, high→low) or by championship position. Teams (lines 617–627) can be sorted A→Z, Z→A or by championship position
- **Modals:** Clicking any driver, team or circuit card opens a detailed modal with full info and a favourite toggle - lines 514–520, 614–620, 700–706

### Personalisation
- **Favourites:** Users can star drivers, teams and circuits. Starred items are saved to localStorage and shown on the home page under "Your Favourites" - lines 143–170, 1043–1113
- **Dark mode:** Theme preference saved to localStorage and restored on the next visit - lines 32–49

### User Experience
- **Responsive:** 3-column grid on desktop, 2-column on tablet (≤860px), 1-column on mobile (≤540px); hamburger menu replaces the tab bar on mobile - lines 60–88 in `main.js`; media queries in `style.css`
- **Navigation:** Tab-based single-page navigation with active state indicator (red bottom border on active tab, or red background in hamburger menu) - lines 92–130
- **Home page:** Hero with live championship leaders and races remaining, last race podium (P1–P3), next race card, championship battle card showing the points gap between P1 and P2, and a saved favourites section - lines 936–1113


## AI Usage
Claude.ai was used during development for explaining concepts, helping debug issues and applying fixes directly to files via the Filesystem extension. Below is a summary of where AI helped out. Full chat log is available in the `claude_ai-chatlog.txt` file.

**1. Sort buttons not showing up**

The sort/filter dropdowns above the drivers and teams lists were disappearing after the API data loaded. The problem was that `renderDrivers()` and `renderTeams()` were overwriting the entire section's `innerHTML`, which also destroyed the dropdowns that were part of the HTML. The fix was to render only into the inner `<div id="drivers-list">` / `<div id="teams-list">` child elements, leaving the dropdowns untouched.

**2. Favourites not staying gold after clicking**

Clicking the star icon on a driver/team/circuit card wasn't keeping it gold. The root cause was that inline `onclick` attributes in dynamically generated HTML don't have access to functions defined inside a `<script type="module">` - the functions exist in module scope, not on the global `window`. The fix was to switch to event delegation: one `addEventListener('click', ...)` on the document checks `data-` attributes on the clicked element to identify the item, keeping everything inside module scope (lines 173–181).

**3. Integrating the Wikipedia API**

To show more info about drivers and teams in the modals (photo, biography extract), the Wikipedia REST API was integrated. The Jolpica API already returns a `url` field for each driver/team pointing to their Wikipedia page (e.g. `https://en.wikipedia.org/wiki/Lewis_Hamilton`). The page title is extracted with `.split('/wiki/')[1]` and used to call `https://en.wikipedia.org/api/rest_v1/page/summary/{title}`, which returns a JSON object with `extract` (bio text) and `thumbnail.source` (photo URL) - lines 227–243 (team modal) and 368–384 (driver modal).

**4. Hamburger menu button not appearing on mobile**

The hamburger menu button wasn't showing on small screens despite CSS media queries being in place. The conflict was between `display: none` in the base styles and `display: flex` in the media query - specificity meant the base style kept winning. The fix was to drop the pure-CSS approach and use JavaScript to show/hide the button based on `window.innerWidth`, re-evaluated on every `resize` event (lines 60–75).

**5. Hero card stuck on "Loading..."**

The hero section on the home page (driver leader, constructor leader, races to go) always showed "Loading..." instead of real data. The cause was a race condition: `renderHomeStandings()` was called inside `loadHome()`, but `loadHome()` fired at the same time as `loadDriverStandings()`, `loadConstructorStandings()` and `loadCalendar()`. Those fetches hadn't finished yet, so the arrays were still empty and the render function crashed silently. The fix was to call `renderHomeStandings()` at the end of each of the three load functions instead, with a guard at the top of the function that returns early if any of the three arrays isn't populated yet. Whichever fetch finishes last passes the guard and triggers the render - no coordination between fetches needed (lines 961–972).