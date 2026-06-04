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

// Build the HTML for the drivers list and put it on the page
function renderDrivers(drivers) {
  let html = '<ul>';

  drivers.forEach(driver => {
    // Jolpica uses givenName/familyName instead of name/surname
    html += `
      <li>
        <strong>${driver.givenName} ${driver.familyName}</strong>
        (#${driver.permanentNumber || '?'} · ${driver.code || '?'} · ${driver.nationality})
      </li>
    `;
  });

  html += '</ul>';

  // Only update the list div, not the whole section
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

// Build the HTML for the teams list and put it on the page
function renderTeams(teams) {
  let html = '<ul>';

  // Loop over each team and create a list item
  teams.forEach(team => {
    // Jolpica uses name and nationality for constructors
    html += `
      <li>
        <strong>${team.name}</strong>
        (${team.nationality})
      </li>
    `;
  });

  html += '</ul>';

  // Only update the list div, not the whole section
  teamsList.innerHTML = html;
}

// ─── Circuits API ───────────────────────────────────────────

// The section where we'll render the circuits
const circuitsSection = document.getElementById('tab-circuits');

// Fetch all circuits from the current season
async function loadCircuits() {
  try {
    // Call the API - circuits from 2026 season
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

// Build the HTML for the circuits list and put it on the page
function renderCircuits(circuits) {
  let html = '<h2>Circuits</h2><ul>';

  circuits.forEach(circuit => {
    // Each circuit has a name, location and country
    html += `
      <li>
        <strong>${circuit.circuitName}</strong>
        (${circuit.Location.locality}, ${circuit.Location.country})
      </li>
    `;
  });

  html += '</ul>';

  circuitsSection.innerHTML = html;
}

// ─── Calendar API ───────────────────────────────────────────

// The section where we'll render the calendar
const calendarSection = document.getElementById('tab-calendar');

// Fetch all races from the current season
async function loadCalendar() {
  try {
    const response = await fetch('https://api.jolpi.ca/ergast/f1/2026/races/');
    const data = await response.json();

    // Races are stored under RaceTable.Races
    const races = data.MRData.RaceTable.Races;

    renderCalendar(races);
  } catch (error) {
    calendarSection.innerHTML = '<h2>Calendar</h2><p>Failed to load calendar. Please try again.</p>';
    console.error('Error fetching calendar:', error);
  }
}

// Build the HTML for the calendar
function renderCalendar(races) {
  let html = '<h2>Calendar</h2><ol>';

  races.forEach(race => {
    // Each race has a round, raceName, date and Circuit object
    html += `
      <li>
        <strong>Round ${race.round} — ${race.raceName}</strong><br>
        ${race.Circuit.circuitName}, ${race.Circuit.Location.locality} (${race.date})
      </li>
    `;
  });

  html += '</ol>';
  calendarSection.innerHTML = html;
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
    const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

    renderDriverStandings(standings);
  } catch (error) {
    driverStandingsDiv.innerHTML = '<h3>Drivers</h3><p>Failed to load.</p>';
    console.error('Error fetching driver standings:', error);
  }
}

// Build the HTML for driver standings
function renderDriverStandings(standings) {
  let html = '<h3>Drivers</h3><ol>';

  standings.forEach(entry => {
    // Each entry has a position, Driver object and points
    html += `
      <li>
        <strong>${entry.Driver.givenName} ${entry.Driver.familyName}</strong>
        — ${entry.points} pts
      </li>
    `;
  });

  html += '</ol>';
  driverStandingsDiv.innerHTML = html;
}

// Fetch constructor standings for the current season
async function loadConstructorStandings() {
  try {
    const response = await fetch('https://api.jolpi.ca/ergast/f1/2026/constructorstandings/');
    const data = await response.json();

    // Same nested structure as driver standings
    const standings = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;

    renderConstructorStandings(standings);
  } catch (error) {
    constructorStandingsDiv.innerHTML = '<h3>Constructors</h3><p>Failed to load.</p>';
    console.error('Error fetching constructor standings:', error);
  }
}

// Build the HTML for constructor standings
function renderConstructorStandings(standings) {
  let html = '<h3>Constructors</h3><ol>';

  standings.forEach(entry => {
    // Each entry has a Constructor object and points
    html += `
      <li>
        <strong>${entry.Constructor.name}</strong>
        — ${entry.points} pts
      </li>
    `;
  });

  html += '</ol>';
  constructorStandingsDiv.innerHTML = html;
}

// Run the fetch when the page loads
loadDrivers();
loadConstructors();
loadCircuits();
loadCalendar();
loadDriverStandings();
loadConstructorStandings();

