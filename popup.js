var timeLeftHeading = document.getElementById("timeLeftHeading");
var gentleMessages = document.getElementById("gentle");
var directMessages = document.getElementById("direct");
var mindfulMessages = document.getElementById("mindful");
var empoweringMessages = document.getElementById("empowering");
var freeTimeMinutesPreferenceElement = document.getElementById("freeTimeMinutesPreference");
var toggleAlternativeSitesElement = document.getElementById("toggleAlternativeSites");
var saveBtn = document.getElementById("saveBtn");
document.addEventListener("DOMContentLoaded", function () {
    loadPreferences();
});
chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === "sync" && changes.freeTimeMinutes) {
        // Auto-refresh when freeTimeMinutes changes
        var remainingTime = changes.freeTimeMinutes.newValue || 0;
        if (timeLeftHeading)
            timeLeftHeading.textContent = "Free time left for today: ".concat(remainingTime, " minutes");
    }
});
function loadPreferences() {
    chrome.storage.sync.get([
        "messagePreferences",
        "freeTimeMinutesPreference",
        "freeTimeMinutes",
        "showAlternativeSites",
    ], function (result) {
        var messagesPreferences = result.messagePreferences || {
            gentle: true,
            direct: true,
            mindful: true,
            empowering: true,
        };
        if (gentleMessages)
            gentleMessages.checked =
                messagesPreferences.gentle;
        if (directMessages)
            directMessages.checked =
                messagesPreferences.direct;
        if (mindfulMessages)
            mindfulMessages.checked =
                messagesPreferences.mindful;
        if (empoweringMessages)
            empoweringMessages.checked =
                messagesPreferences.empowering;
        if (freeTimeMinutesPreferenceElement)
            freeTimeMinutesPreferenceElement.value =
                result.freeTimeMinutesPreference || 0;
        var remainingTime = result.freeTimeMinutes || 0;
        if (timeLeftHeading)
            timeLeftHeading.textContent = "Free time left for today: ".concat(remainingTime, " minutes");
        if (toggleAlternativeSitesElement)
            toggleAlternativeSitesElement.checked =
                result.toggleAlternativeSites || false;
        updateAlternativeSitesVisibility(result.toggleAlternativeSites);
    });
}
if (toggleAlternativeSitesElement)
    toggleAlternativeSitesElement.addEventListener("change", function (e) {
        var target = e.target;
        chrome.storage.sync.set({ toggleAlternativeSites: target.checked }, function () {
            updateAlternativeSitesVisibility(target.checked);
        });
    });
function updateAlternativeSitesVisibility(show) {
    // Update popup DOM
    var altSites = document.getElementById("alternativeSites");
    if (altSites) {
        if (show) {
            altSites.classList.remove("hidden");
        }
        else {
            altSites.classList.add("hidden");
        }
    }
    // Update storage so blocked page can react
    chrome.storage.sync.set({ toggleAlternativeSites: show });
}
if (saveBtn)
    saveBtn.addEventListener("click", function () {
        var messagesPreferences = {
            gentle: gentleMessages.checked,
            direct: directMessages.checked,
            mindful: mindfulMessages.checked,
            empowering: empoweringMessages.checked,
        };
        var freeTimeMinutesPreference = parseInt(freeTimeMinutesPreferenceElement.value) ||
            0;
        var toggleAlternativeSites = toggleAlternativeSitesElement.checked;
        // Update both preference and current free time
        chrome.storage.sync.set({
            messagePreferences: messagesPreferences,
            freeTimeMinutesPreference: freeTimeMinutesPreference,
            freeTimeMinutes: freeTimeMinutesPreference, // Reset current free time to new preference
            toggleAlternativeSites: toggleAlternativeSites,
        }, function () {
            var settingsSavedMessage = document.getElementById("settingsSavedMessage");
            if (settingsSavedMessage)
                settingsSavedMessage.classList.remove("hidden");
            setTimeout(function () {
                if (settingsSavedMessage)
                    settingsSavedMessage.classList.add("hidden");
                // Reload preferences to show updated values
                loadPreferences();
            }, 2000);
        });
    });
