// main.js — tab navigation + drivers API
console.log('Pitwall F1 Hub loaded');

// ─── Dark mode ───────────────────────────────────────────

const themeToggle = document.getElementById('toggle');

// Check if the user already had a preference saved in localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  // Apply dark mode immediately on load
  document.body.classList.add('dark');
  themeToggle.checked = true;
}

// When the checkbox is toggled, switch dark mode on or off
themeToggle.addEventListener('change', () => {
  if (themeToggle.checked) {
    // Turn on dark mode and save to localStorage
    document.body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    // Turn off dark mode and save to localStorage
    document.body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
});

// ─── Tab switching ───────────────────────────────────────────

// Grab all tab buttons from the nav
const tabButtons = document.querySelectorAll('.tab');

// Grab all content sections
const tabSections = document.querySelectorAll('main section');

// This function switches the active tab
function switchTab(tabName) {
  // Loop over all buttons and update which one looks active
  tabButtons.forEach(btn => {
    if (btn.dataset.tab === tabName) {
      btn.setAttribute('aria-selected', 'true');
    } else {
      btn.setAttribute('aria-selected', 'false');
    }
  });

  // Loop over all sections and show only the matching one
  tabSections.forEach(section => {
    if (section.id === 'tab-' + tabName) {
      section.removeAttribute('hidden');
    } else {
      section.setAttribute('hidden', '');
    }
  });
}

// Add a click listener to each tab button
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    switchTab(btn.dataset.tab);
  });
});


// ─── Drivers API ─────────────────────────────────────────────

// The section where we'll render the drivers
const driversSection = document.getElementById('tab-drivers');
// The div inside the section where the list goes (keeps sort buttons safe)
const driversList = document.getElementById('drivers-list');

// Store the fetched drivers so we can re-sort without fetching again
let allDrivers = [];

// Store driver standings so we can look up positions in the driver cards
let allDriverStandings = [];

// Store constructor standings so we can look up positions in the team cards
let allConstructorStandings = [];

// Fetch all drivers from the API
async function loadDrivers() {
  try {
    // Call the API - Only drivers from current season
    const response = await fetch('https://api.jolpi.ca/ergast/f1/2026/drivers/');

    // Jolpica wraps the data a few levels deep
    const data = await response.json();
    allDrivers = data.MRData.DriverTable.Drivers;

    // Show the drivers on the page (default order from API)
    renderDrivers(allDrivers);

  } catch (error) {
    // If something goes wrong, show an error message
    driversList.innerHTML = '<p>Failed to load drivers. Please try again.</p>';
    console.error('Error fetching drivers:', error);
  }
}

// Sort drivers when dropdown changes
document.getElementById('drivers-sort').addEventListener('change', (e) => {
  const value = e.target.value;

  // Use a ternary to decide sort direction
  const sorted = allDrivers.slice().sort((a, b) =>
    value === 'az'
      ? a.familyName.localeCompare(b.familyName)
      : b.familyName.localeCompare(a.familyName)
  );

  // Only re-render if a real option was chosen
  if (value !== 'default') renderDrivers(sorted);
});

// Search drivers as the user types
const driversSearchInput = document.getElementById('drivers-search');
const driversSearchError = document.getElementById('drivers-search-error');

driversSearchInput.addEventListener('input', (e) => {
  const query = e.target.value;

  // Formulier validatie: toon foutmelding bij 1 karakter
  if (query.length === 1) {
    driversSearchError.style.display = 'block';
    return; // stop here, don't filter yet
  } else {
    driversSearchError.style.display = 'none';
  }

  // Filter the drivers array based on the search query
  const filtered = allDrivers.filter(driver => {
    const fullName = driver.givenName + ' ' + driver.familyName;
    return fullName.toLowerCase().includes(query.toLowerCase());
  });

  renderDrivers(filtered);
});

// Build the HTML for the drivers list and put it on the page
function renderDrivers(drivers) {
  let html = '<div class="cards-grid">';

  drivers.forEach(driver => {
    // Look up this driver's current championship position
    const standing = allDriverStandings.find(s => s.Driver.driverId === driver.driverId);
    const position = standing ? standing.position : '?';
    const points = standing ? standing.points : '?';

    html += `
      <div class="card">
        <div class="card__number">#${position}</div>
        <div class="card__name">${driver.givenName} ${driver.familyName}</div>
        <div class="card__meta">${driver.nationality}</div>
        <div class="card__stats">
          <div>
            <div class="k">Number</div>
            <div class="v">${driver.permanentNumber || '?'}</div>
          </div>
          <div>
            <div class="k">Points</div>
            <div class="v">${points}</div>
          </div>
          <div>
            <div class="k">Code</div>
            <div class="v">${driver.code || '?'}</div>
          </div>
        </div>
      </div>
    `;
  });

  html += '</div>';
  driversList.innerHTML = html;
};



// Section where we'll render the teams
const teamsSection = document.getElementById('tab-teams');
// The div inside the section where the list goes
const teamsList = document.getElementById('teams-list');

// Store the fetched teams so we can re-sort without fetching again
let allTeams = [];

// Fetch all teams from current season
async function loadConstructors() {
  try {
    // Call API - Teams from current season
    const response = await fetch('https://api.jolpi.ca/ergast/f1/2026/constructors/');

    // Note: it's response.json(), not await.response.json()
    const data = await response.json();

    // Jolpica uses ConstructorTable.Constructors (not TeamsTable.Teams)
    allTeams = data.MRData.ConstructorTable.Constructors;

    renderTeams(allTeams);
  } catch (error) {
    teamsSection.innerHTML = '<h2>Teams</h2><p>Failed to load teams. Please try again.</p>';
    console.error('Error fetching teams:', error);
  }
}

// Sort teams when dropdown changes
document.getElementById('teams-sort').addEventListener('change', (e) => {
  const value = e.target.value;

  // Use a ternary to decide sort direction
  const sorted = allTeams.slice().sort((a, b) =>
    value === 'az'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );

  // Only re-render if a real option was chosen
  if (value !== 'default') renderTeams(sorted);
});

// Search teams as the user types
const teamsSearchInput = document.getElementById('teams-search');
const teamsSearchError = document.getElementById('teams-search-error');

teamsSearchInput.addEventListener('input', (e) => {
  const query = e.target.value;

  // Formulier validatie: toon foutmelding bij 1 karakter
  if (query.length === 1) {
    teamsSearchError.style.display = 'block';
    return;
  } else {
    teamsSearchError.style.display = 'none';
  }

  // Filter the teams array based on the search query
  const filtered = allTeams.filter(team =>
    team.name.toLowerCase().includes(query.toLowerCase())
  );

  renderTeams(filtered);
});

// Build the HTML for the teams list and put it on the page
function renderTeams(teams) {
  let html = '<div class="cards-grid">';

  // Loop over each team and create a card
  teams.forEach(team => {
    // Look up this team's current championship position
    const standing = allConstructorStandings.find(s => s.Constructor.constructorId === team.constructorId);
    const position = standing ? standing.position : '?';
    const points = standing ? standing.points : '?';

    html += `
      <div class="card">
        <div class="card__number">#${position}</div>
        <div class="card__name">${team.name}</div>
        <div class="card__meta">${team.nationality}</div>
        <div class="card__stats">
          <div>
            <div class="k">Points</div>
            <div class="v">${points}</div>
          </div>
        </div>
      </div>
    `;
  });

  html += '</div>';
  teamsList.innerHTML = html;
}

// ─── Circuits API ───────────────────────────────────────────

// The section where we'll render the circuits
const circuitsSection = document.getElementById('tab-circuits');

// Mapping from Jolpica circuitId to the SVG filename in the GitHub repo
// Source: https://github.com/julesr0y/f1-circuits-svg
// Note: some circuits have different names in the repo than in Jolpica
const circuitSvgMap = {
  'albert_park':    'melbourne-1',       // Albert Park = Melbourne
  'bahrain':        'bahrain-1',
  'baku':           'baku-1',
  'catalunya':      'catalunya-1',       // Barcelona = Catalunya
  'americas':       'austin-1',
  'hungaroring':    'hungaroring-1',
  'interlagos':     'interlagos-1',
  'jeddah':         'jeddah-1',
  'losail':         'lusail-1',          // Losail = Lusail (different spelling)
  'marina_bay':     'marina-bay-1',      // Marina Bay Street Circuit
  'madring':        'madring-1',         // Madrid Street Circuit
  'miami':          'miami-1',
  'monaco':         'monaco-1',
  'monza':          'monza-1',
  'montreal':       'montreal-1',
  'red_bull_ring':  'spielberg-1',       // Red Bull Ring = Spielberg
  'rodriguez':      'mexico-city-1',     // Hermanos Rodriguez = Mexico City
  'shanghai':       'shanghai-1',
  'silverstone':    'silverstone-1',
  'spa':            'spa-francorchamps-1',
  'suzuka':         'suzuka-1',
  'vegas':          'las-vegas-1',
  'villeneuve':     'montreal-1',        // Gilles Villeneuve = Montreal
  'yas_marina':     'yas-marina-1',
  'zandvoort':      'zandvoort-1',
};

// Base URL pointing to the minimal/black-outline folder in the repo
const SVG_BASE = 'https://raw.githubusercontent.com/julesr0y/f1-circuits-svg/main/circuits/minimal/black-outline/';

// Fetch all circuits from the current season
async function loadCircuits() {
  try {
    const response = await fetch('https://api.jolpi.ca/ergast/f1/2026/circuits/');
    const data = await response.json();

    // Jolpica stores circuits under CircuitTable.Circuits
    const circuits = data.MRData.CircuitTable.Circuits;

    renderCircuits(circuits);
  } catch (error) {
    circuitsSection.innerHTML = '<h2>Circuits</h2><p>Failed to load circuits. Please try again.</p>';
    console.error('Error fetching circuits:', error);
  }
}

// Build the HTML for the circuits as cards with SVG track images
function renderCircuits(circuits) {
  let html = '<div class="cards-grid">';

  circuits.forEach(circuit => {
    // Look up the SVG filename for this circuit
    const svgName = circuitSvgMap[circuit.circuitId];
    const svgUrl = svgName ? `${SVG_BASE}${svgName}.svg` : null;

    html += `
      <div class="card circuit-card">
        <!-- SVG track image, or a placeholder if not found -->
        <div class="circuit-card__map">
          ${
            svgUrl
              ? `<img src="${svgUrl}" alt="${circuit.circuitName} track layout">`
              : `<span class="circuit-card__no-img">No image</span>`
          }
        </div>
        <div class="card__name">${circuit.circuitName}</div>
        <div class="card__meta">${circuit.Location.locality}, ${circuit.Location.country}</div>
      </div>
    `;
  });

  html += '</div>';
  circuitsSection.innerHTML = html;
}

// ─── Calendar API ───────────────────────────────────────────

// The div where the calendar list gets rendered
const calendarList = document.getElementById('calendar-list');

// Store all races so we can re-filter without fetching again
let allRaces = [];

// Today's date for comparing with race dates
const today = new Date();

// Fetch all races from the current season
async function loadCalendar() {
  try {
    const response = await fetch('https://api.jolpi.ca/ergast/f1/2026/races/');
    const data = await response.json();

    // Races are stored under RaceTable.Races
    allRaces = data.MRData.RaceTable.Races;

    renderCalendar(allRaces);
  } catch (error) {
    calendarList.innerHTML = '<p>Failed to load calendar. Please try again.</p>';
    console.error('Error fetching calendar:', error);
  }
}

// Filter races when dropdown changes
document.getElementById('calendar-filter').addEventListener('change', (e) => {
  const value = e.target.value;

  // Filter based on whether the race date is in the past or future
  const filtered = allRaces.filter(race => {
    const raceDate = new Date(race.date);
    // Ternary: if 'past' check date is before today, if 'upcoming' check after
    return value === 'all' ? true
      : value === 'past' ? raceDate < today
      : raceDate >= today;
  });

  renderCalendar(filtered);
});

// Build the HTML for the calendar
function renderCalendar(races) {
  // Wrap everything in a card-like container
  let html = '<div class="cal-list">';

  races.forEach(race => {
    const raceDate = new Date(race.date);
    const isPast = raceDate < today;

    // Format the date nicely: "15 Mar 2026"
    const formattedDate = raceDate.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });

    html += `
      <div class="calrow ${isPast ? 'calrow--past' : ''}">
        <!-- Round number on the left -->
        <div class="calrnd">${race.round}</div>

        <!-- Race name and location in the middle -->
        <div>
          <div class="calname">${race.raceName}</div>
          <div class="calloc">${race.Circuit.circuitName}, ${race.Circuit.Location.country}</div>
        </div>

        <!-- Date on the right -->
        <div class="caldate">${formattedDate}</div>
      </div>
    `;
  });

  html += '</div>';
  calendarList.innerHTML = html;
}

// ─── Standings API ───────────────────────────────────────────

// The two divs inside the standings section
const driverStandingsDiv = document.getElementById('driver-standings');
const constructorStandingsDiv = document.getElementById('constructor-standings');

// Fetch driver standings for the current season
async function loadDriverStandings() {
  try {
    const response = await fetch('https://api.jolpi.ca/ergast/f1/2026/driverstandings/');
    const data = await response.json();

    // The standings are nested a few levels deep
    allDriverStandings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

    renderDriverStandings(allDriverStandings);

    // Re-render driver cards now that we have standings
    if (allDrivers.length > 0) renderDrivers(allDrivers);

  } catch (error) {
    driverStandingsDiv.innerHTML = '<h3>Drivers</h3><p>Failed to load.</p>';
    console.error('Error fetching driver standings:', error);
  }
}

// Build the HTML for driver standings
function renderDriverStandings(standings) {
  let html = `
    <h3>Drivers</h3>
    <table class="standings-table">
      <thead>
        <tr>
          <th>Pos</th>
          <th>Driver</th>
          <th>Team</th>
          <th>Pts</th>
        </tr>
      </thead>
      <tbody>
  `;

  standings.forEach(entry => {
    // Highlight P1 with accent color via a class
    const isFirst = entry.position === '1';
    html += `
      <tr class="${isFirst ? 'standings-table__row--first' : ''}">
        <td class="standings-table__pos">${entry.position}</td>
        <td><strong>${entry.Driver.givenName} ${entry.Driver.familyName}</strong></td>
        <td class="standings-table__muted">${entry.Constructors[0].name}</td>
        <td class="standings-table__pts">${entry.points}</td>
      </tr>
    `;
  });

  html += '</tbody></table>';
  driverStandingsDiv.innerHTML = html;
}

// Fetch constructor standings for the current season
async function loadConstructorStandings() {
  try {
    const response = await fetch('https://api.jolpi.ca/ergast/f1/2026/constructorstandings/');
    const data = await response.json();

    // Same nested structure as driver standings
    allConstructorStandings = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;

    renderConstructorStandings(allConstructorStandings);

    // Re-render team cards now that we have standings
    if (allTeams.length > 0) renderTeams(allTeams);

  } catch (error) {
    constructorStandingsDiv.innerHTML = '<h3>Constructors</h3><p>Failed to load.</p>';
    console.error('Error fetching constructor standings:', error);
  }
}

// Build the HTML for constructor standings
function renderConstructorStandings(standings) {
  let html = `
    <h3>Constructors</h3>
    <table class="standings-table">
      <thead>
        <tr>
          <th>Pos</th>
          <th>Team</th>
          <th>Pts</th>
        </tr>
      </thead>
      <tbody>
  `;

  standings.forEach(entry => {
    // Highlight P1 with accent color
    const isFirst = entry.position === '1';
    html += `
      <tr class="${isFirst ? 'standings-table__row--first' : ''}">
        <td class="standings-table__pos">${entry.position}</td>
        <td><strong>${entry.Constructor.name}</strong></td>
        <td class="standings-table__pts">${entry.points}</td>
      </tr>
    `;
  });

  html += '</tbody></table>';
  constructorStandingsDiv.innerHTML = html;
}

// Run the fetch when the page loads
loadDrivers();
loadConstructors();
loadCircuits();
loadCalendar();
loadDriverStandings();
loadConstructorStandings();

