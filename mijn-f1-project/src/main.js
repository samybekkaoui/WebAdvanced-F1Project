// main.js — tab navigation + drivers API
console.log('Pitwall F1 Hub loaded');

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

// Fetch all drivers from the API
async function loadDrivers() {
  try {
    // Call the API - Only drivers from current season
    const response = await fetch('https://api.jolpi.ca/ergast/f1/2026/drivers/');

    // Jolpica wraps the data a few levels deep
    const data = await response.json();
    const drivers = data.MRData.DriverTable.Drivers;

    // Show the drivers on the page
    renderDrivers(drivers);

  } catch (error) {
    // If something goes wrong, show an error message
    driversSection.innerHTML = '<h2>Drivers</h2><p>Failed to load drivers. Please try again.</p>';
    console.error('Error fetching drivers:', error);
  }
}

// Build the HTML for the drivers list and put it on the page
function renderDrivers(drivers) {
  // Start with the section title
  let html = '<h2>Drivers</h2><ul>';

  // Loop over each driver and create a list item
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

  // Put the HTML into the drivers section
  driversSection.innerHTML = html;
};



// Section where we'll render the teams
const teamsSection = document.getElementById('tab-teams');

// Fetch all teams from current season
async function loadConstructors() {
  try {
    // Call API - Teams from current season
    const response = await fetch('https://api.jolpi.ca/ergast/f1/2026/constructors/');

    // Note: it's response.json(), not await.response.json()
    const data = await response.json();

    // Jolpica uses ConstructorTable.Constructors (not TeamsTable.Teams)
    const teams = data.MRData.ConstructorTable.Constructors;

    renderTeams(teams);
  } catch (error) {
    teamsSection.innerHTML = '<h2>Teams</h2><p>Failed to load teams. Please try again.</p>';
    console.error('Error fetching teams:', error);
  }
}

// Build the HTML for the teams list and put it on the page
function renderTeams(teams) {
  // Start with the section title
  let html = '<h2>Teams</h2><ul>';

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

  // Put the HTML into the teams section
  teamsSection.innerHTML = html;
}

// Run the fetch when the page loads
loadDrivers();
loadConstructors();

