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

chrome.storage.sync.get(["showAlternativeSites"], function (result) {
  const showAlternativeSites = result.showAlternativeSites || false;
  if (showAlternativeSites) {
    document.getElementById("alternativeSites").classList.remove("hidden");
  }
});

const actualTime = new Date();
const actualHour = actualTime.getHours();
const isAfter6PM = actualHour >= 18;

if (isAfter6PM) {
  document.body.classList.add("dark");
}

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
  const messageElement = document.getElementById("message");
  e.preventDefault();
  const reason = document.getElementById("reason").value;
  chrome.storage.sync.get(["freeTimeMinutes"], function (result) {
    const freeTimeMinutes = result.freeTimeMinutes || 0;
    if (reason === "1") {
      if (freeTimeMinutes > 0) {
        let secondsLeftBeforeClose = 3;
        messageElement.innerHTML = `You have ${freeTimeMinutes} minutes of free time left for today. Have fun!<br>You will be redirected to the original URL in ${secondsLeftBeforeClose} seconds.`;
        const interval = setInterval(function () {
          secondsLeftBeforeClose--;
          messageElement.innerHTML = `You have ${freeTimeMinutes} minutes of free time left. Have fun!<br>You will be redirected to the original URL in ${secondsLeftBeforeClose} seconds.`;
          if (secondsLeftBeforeClose === 0) {
            clearInterval(interval);
            window.location.href = originalUrl;
          }
        }, 1000);
      } else {
        let secondsLeftBeforeClose = 5;
        messageElement.innerHTML = `You used all your free time for today. Stay focused! The window will close in ${secondsLeftBeforeClose} seconds or you can close the window.`;
        const interval = setInterval(function () {
          secondsLeftBeforeClose--;
          messageElement.innerHTML = `You used all your free time for today. Stay focused! The window will close in ${secondsLeftBeforeClose} seconds or you can close the window.`;
          if (secondsLeftBeforeClose === 0) {
            clearInterval(interval);
            window.close();
          }
        }, 1000);
      }
    } else {
      let secondsBeforeRedirect = 3;
      messageElement.innerHTML = `You will be redirected to the original URL in ${secondsBeforeRedirect} seconds. Stay focused!`;
      const interval = setInterval(function () {
        secondsBeforeRedirect--;
        messageElement.innerHTML = `You will be redirected to the original URL in ${secondsBeforeRedirect} seconds. Stay focused!`;
        if (secondsBeforeRedirect === 0) {
          clearInterval(interval);
          window.location.href = originalUrl;
        }
      }, 1000);
    }
  });
});
