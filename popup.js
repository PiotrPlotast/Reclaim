document.addEventListener("DOMContentLoaded", function () {
  loadPreferences();
});

function loadPreferences() {
  chrome.storage.sync.get(
    [
      "messagePreferences",
      "freeTimeMinutesPreference",
      "freeTimeMinutes",
      "showAlternativeSites",
    ],
    function (result) {
      const messagesPreferences = result.messagePreferences || {
        gentle: true,
        direct: true,
        mindful: true,
        empowering: true,
      };

      document.getElementById("gentle").checked = messagesPreferences.gentle;
      document.getElementById("direct").checked = messagesPreferences.direct;
      document.getElementById("mindful").checked = messagesPreferences.mindful;
      document.getElementById("empowering").checked =
        messagesPreferences.empowering;

      document.getElementById("freeTimeMinutesPreference").value =
        result.freeTimeMinutesPreference || 0;

      // Show actual remaining free time, not preference
      const remainingTime = result.freeTimeMinutes || 0;
      document.getElementById(
        "timeLeftHeading"
      ).textContent = `Free time left for today: ${remainingTime} minutes`;

      document.getElementById("toggleAlternativeSites").checked =
        result.toggleAlternativeSites || false;

      updateAlternativeSitesVisibility(result.toggleAlternativeSites);
    }
  );
}

document
  .getElementById("toggleAlternativeSites")
  .addEventListener("change", function (e) {
    chrome.storage.sync.set(
      { toggleAlternativeSites: e.target.checked },
      function () {
        updateAlternativeSitesVisibility(e.target.checked);
      }
    );
  });

function updateAlternativeSitesVisibility(show) {
  // Update popup DOM
  const altSites = document.getElementById("alternativeSites");
  if (altSites) {
    if (show) {
      altSites.classList.remove("hidden");
    } else {
      altSites.classList.add("hidden");
    }
  }

  // Update storage so blocked page can react
  chrome.storage.sync.set({ toggleAlternativeSites: show });
}

document.getElementById("saveBtn").addEventListener("click", function () {
  const messagesPreferences = {
    gentle: document.getElementById("gentle").checked,
    direct: document.getElementById("direct").checked,
    mindful: document.getElementById("mindful").checked,
    empowering: document.getElementById("empowering").checked,
  };

  const freeTimeMinutesPreference =
    parseInt(document.getElementById("freeTimeMinutesPreference").value) || 0;
  const toggleAlternativeSites = document.getElementById(
    "toggleAlternativeSites"
  ).checked;

  // Update both preference and current free time
  chrome.storage.sync.set(
    {
      messagePreferences: messagesPreferences,
      freeTimeMinutesPreference,
      freeTimeMinutes: freeTimeMinutesPreference, // Reset current free time to new preference
      toggleAlternativeSites,
    },
    function () {
      const status = document.getElementById("status");
      status.classList.remove("hidden");
      setTimeout(() => {
        status.classList.add("hidden");
        // Reload preferences to show updated values
        loadPreferences();
      }, 2000);
    }
  );
});
