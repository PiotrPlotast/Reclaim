const timeLeftHeading = document.getElementById("timeLeftHeading");
const gentleMessages = document.getElementById("gentle");
const directMessages = document.getElementById("direct");
const mindfulMessages = document.getElementById("mindful");
const empoweringMessages = document.getElementById("empowering");
const freeTimeMinutesPreferenceElement = document.getElementById(
  "freeTimeMinutesPreference"
);
const toggleAlternativeSitesElement = document.getElementById(
  "toggleAlternativeSites"
);
const saveBtn = document.getElementById("saveBtn");
document.addEventListener("DOMContentLoaded", function () {
  loadPreferences();
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace === "sync" && changes.freeTimeMinutes) {
    // Auto-refresh when freeTimeMinutes changes
    const remainingTime = changes.freeTimeMinutes.newValue || 0;
    if (timeLeftHeading)
      (
        timeLeftHeading as HTMLElement
      ).textContent = `Free time left for today: ${remainingTime} minutes`;
  }
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

      if (gentleMessages)
        (gentleMessages as HTMLInputElement).checked =
          messagesPreferences.gentle;
      if (directMessages)
        (directMessages as HTMLInputElement).checked =
          messagesPreferences.direct;
      if (mindfulMessages)
        (mindfulMessages as HTMLInputElement).checked =
          messagesPreferences.mindful;
      if (empoweringMessages)
        (empoweringMessages as HTMLInputElement).checked =
          messagesPreferences.empowering;

      if (freeTimeMinutesPreferenceElement)
        (freeTimeMinutesPreferenceElement as HTMLInputElement).value =
          result.freeTimeMinutesPreference || 0;

      const remainingTime = result.freeTimeMinutes || 0;
      if (timeLeftHeading)
        (
          timeLeftHeading as HTMLElement
        ).textContent = `Free time left for today: ${remainingTime} minutes`;

      if (toggleAlternativeSitesElement)
        (toggleAlternativeSitesElement as HTMLInputElement).checked =
          result.toggleAlternativeSites || false;

      updateAlternativeSitesVisibility(result.toggleAlternativeSites);
    }
  );
}

if (toggleAlternativeSitesElement)
  (toggleAlternativeSitesElement as HTMLInputElement).addEventListener(
    "change",
    function (e) {
      const target = e.target as HTMLInputElement;
      chrome.storage.sync.set(
        { toggleAlternativeSites: target.checked },
        function () {
          updateAlternativeSitesVisibility(target.checked);
        }
      );
    }
  );

function updateAlternativeSitesVisibility(show: boolean) {
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
if (saveBtn)
  (saveBtn as HTMLInputElement).addEventListener("click", function () {
    const messagesPreferences = {
      gentle: (gentleMessages as HTMLInputElement).checked,
      direct: (directMessages as HTMLInputElement).checked,
      mindful: (mindfulMessages as HTMLInputElement).checked,
      empowering: (empoweringMessages as HTMLInputElement).checked,
    };

    const freeTimeMinutesPreference =
      parseInt((freeTimeMinutesPreferenceElement as HTMLInputElement).value) ||
      0;
    const toggleAlternativeSites = (
      toggleAlternativeSitesElement as HTMLInputElement
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
        const settingsSavedMessage = document.getElementById(
          "settingsSavedMessage"
        );
        if (settingsSavedMessage)
          settingsSavedMessage.classList.remove("hidden");
        setTimeout(() => {
          if (settingsSavedMessage)
            settingsSavedMessage.classList.add("hidden");
          // Reload preferences to show updated values
          loadPreferences();
        }, 2000);
      }
    );
  });
