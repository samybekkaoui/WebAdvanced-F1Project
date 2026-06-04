// main.js — tab navigation
console.log('Pitwall F1 Hub loaded');

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
    // Each button has a data-tab attribute that tells us which tab to show
    switchTab(btn.dataset.tab);
  });
});

