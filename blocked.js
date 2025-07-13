const urlParams = new URLSearchParams(window.location.search);
const originalUrl = urlParams.get("originalUrl");
const domain = urlParams.get("domain");

const messageCategories = {
  gentle: [
    "Hold on - Reclaim invites you to reflect.\nWhy are you visiting this site right now?",
    "Take a moment - Reclaim is here to help you stay intentional.\nWhat do you hope to get from this visit?",
    "Just a second - Reclaim is keeping you grounded.\nWhat's drawing you to this site right now?",
  ],
  direct: [
    "Pause to focus - Reclaim detected a potential distraction.\nWhat value does this site bring you right now?",
    "Stop for clarity - Reclaim is helping you act with purpose.\nWhy do you want to open this site?",
    "Hold that click - Reclaim wants to keep you aligned.\nHow does this serve your current priorities?",
  ],
  mindful: [
    "Mindful pause - before you continue, check in with yourself.\nWhat's your purpose here?",
    "Take a breath - Reclaim is supporting your mindful choices.\nWhat intention guides this visit?",
    "Pause and reflect - Reclaim is here to help you choose consciously.\nWhat's truly important right now?",
  ],
  empowering: [
    "You're in control - Reclaim is just checking in.\nIs this aligned with your goals right now?",
    "Your choice matters - Reclaim trusts your judgment.\nHow does this choice serve your best self?",
    "You have the power - Reclaim is here to support your decisions.\nWhat's driving this choice?",
  ],
};

function getAvailableMessages(preferences) {
  let availableMessages = [];

  Object.keys(preferences).forEach((category) => {
    if (preferences[category] && messageCategories[category]) {
      availableMessages = availableMessages.concat(messageCategories[category]);
    }
  });

  if (availableMessages.length === 0) {
    Object.values(messageCategories).forEach((categoryMessages) => {
      availableMessages = availableMessages.concat(categoryMessages);
    });
  }

  return availableMessages;
}

function getRandomMessage(preferences) {
  const availableMessages = getAvailableMessages(preferences);
  const randomIndex = Math.floor(Math.random() * availableMessages.length);
  return availableMessages[randomIndex];
}

document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.sync.get(["messagePreferences"], function (result) {
    const preferences = result.messagePreferences || {
      gentle: true,
      direct: true,
      mindful: true,
      empowering: true,
    };

    const messageElement = document.querySelector("p");
    if (messageElement) {
      messageElement.textContent = getRandomMessage(preferences);
    }
  });
});
