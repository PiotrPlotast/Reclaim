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

function getAvailableMessages(promptsPreferences) {
  let availableMessages = [];

  Object.keys(promptsPreferences).forEach((category) => {
    if (promptsPreferences[category] && messageCategories[category]) {
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

function getRandomMessage(promptPreferences) {
  const availableMessages = getAvailableMessages(promptPreferences);
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

    const messageElement = document.querySelector("#message");
    if (messageElement) {
      messageElement.textContent = getRandomMessage(preferences);
    }
  });
});

document.getElementById("submit").addEventListener("click", function (e) {
  e.preventDefault();
  const reason = document.getElementById("reason").value;
  chrome.storage.sync.get(["freeTimeMinutes"], function (result) {
    const freeTimeMinutes = result.freeTimeMinutes || 0;
    if (reason === "1") {
      if (freeTimeMinutes > 0) {
        alert(
          `You will get ${freeTimeMinutes} minutes of free time. Have fun!`
        );
      } else {
        let secondsLeftBeforeClose = 5;
        const messageElement = document.getElementById("message");
        messageElement.textContent = `You used all your free time for today. Stay focused! The window will close in ${secondsLeftBeforeClose} seconds.`;
        const interval = setInterval(function () {
          secondsLeftBeforeClose--;
          messageElement.textContent = `You used all your free time for today. Stay focused! The window will close in ${secondsLeftBeforeClose} seconds.`;
          if (secondsLeftBeforeClose === 0) {
            clearInterval(interval);
            window.close();
          }
        }, 1000);
      }
    } else {
      alert("You will be redirected to the original URL. Stay focused!");
    }
  });
});
