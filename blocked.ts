const urlParams = new URLSearchParams(window.location.search);
const originalUrl = urlParams.get("originalUrl");
const domain = urlParams.get("domain");
const messageElement = document.querySelector("#message") as HTMLDivElement;
const submitButton = document.querySelector("#submit") as HTMLButtonElement;
const reasonElement = document.getElementById("reason") as HTMLSelectElement;
let messageCategories: { [key: string]: string[] } = {};
const altSitesElement = document.getElementById("alternativeSites");

interface MessagesPreferences {
  gentle: boolean;
  direct: boolean;
  mindful: boolean;
  empowering: boolean;
}

// Load message categories from JSON file
fetch(chrome.runtime.getURL("messages.json"))
  .then((response) => response.json())
  .then((data) => {
    messageCategories = data;
  })
  .catch((error) => {
    console.error("Error loading messages:", error);
    messageCategories = {
      gentle: [
        "Hold on - Reclaim invites you to reflect.\nWhy are you visiting this site right now?",
      ],
      direct: [
        "Pause to focus - Reclaim detected a potential distraction.\nWhat value does this site bring you right now?",
      ],
      mindful: [
        "Mindful pause - before you continue, check in with yourself.\nWhat's your purpose here?",
      ],
      empowering: [
        "You're in control - Reclaim is just checking in.\nIs this aligned with your goals right now?",
      ],
    };
  });

document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.sync.get(["messagePreferences"], function (result) {
    const preferences = result.messagePreferences || {
      gentle: true,
      direct: true,
      mindful: true,
      empowering: true,
    };

    setMessageWhenReady(preferences);
  });
});
chrome.storage.sync.get(["toggleAlternativeSites"], function (result) {
  const showAlternativeSites = result.toggleAlternativeSites || false;
  if (showAlternativeSites) {
    if (altSitesElement) altSitesElement.classList.remove("hidden");
  }
});

// Listen for changes to toggleAlternativeSites preference
chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (changes.toggleAlternativeSites) {
    if (altSitesElement) {
      if (changes.toggleAlternativeSites.newValue) {
        altSitesElement.classList.remove("hidden");
      } else {
        altSitesElement.classList.add("hidden");
      }
    }
  }
});

const actualTime = new Date();
const actualHour = actualTime.getHours();
const isAfter6PM = actualHour >= 18;

if (isAfter6PM) {
  document.body.classList.add("dark");
}

function getAvailableMessages(messagesPreferences: MessagesPreferences) {
  let availableMessages: string[] = [];

  Object.keys(messagesPreferences).forEach((category) => {
    if (
      messagesPreferences[category as keyof MessagesPreferences] &&
      messageCategories[category]
    ) {
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

function getRandomMessage(messagesPreferences: MessagesPreferences) {
  const availableMessages = getAvailableMessages(messagesPreferences);
  const randomIndex = Math.floor(Math.random() * availableMessages.length);
  return availableMessages[randomIndex];
}

function setMessageWhenReady(messagesPreferences: MessagesPreferences) {
  if (Object.keys(messageCategories).length === 0) {
    setTimeout(() => setMessageWhenReady(messagesPreferences), 100);
    return;
  }
  if (messageElement) {
    const message = getRandomMessage(messagesPreferences);
    messageElement.textContent = message || null;
  }
}

if (submitButton)
  submitButton.addEventListener("click", function (e) {
    e.preventDefault();
    const reason = reasonElement.value;
    chrome.storage.sync.get(["freeTimeMinutes"], function (result) {
      const freeTimeMinutes = result.freeTimeMinutes || 0;
      if (reason === "1") {
        if (freeTimeMinutes > 0) {
          let secondsLeftBeforeClose = 3;
          submitButton.disabled = true;
          messageElement.innerHTML = `You have ${freeTimeMinutes} minutes of free time left for today. Have fun!<br>You will be redirected to the original URL in ${secondsLeftBeforeClose} seconds.`;
          const interval = setInterval(function () {
            secondsLeftBeforeClose--;
            messageElement.innerHTML = `You have ${freeTimeMinutes} minutes of free time left for today. Have fun!<br>You will be redirected to the original URL in ${secondsLeftBeforeClose} seconds.`;
            if (secondsLeftBeforeClose === 0) {
              clearInterval(interval);
              // Set temporary allowance before redirecting
              chrome.storage.local.set(
                {
                  temporaryAllowance: {
                    domain: originalUrl ? new URL(originalUrl).hostname : "",
                    timestamp: Date.now(),
                    expiresAt: Date.now() + freeTimeMinutes * 60 * 1000,
                  },
                },
                function () {
                  if (originalUrl) window.location.href = originalUrl;
                }
              );
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
            // Set temporary allowance before redirecting
            chrome.storage.local.set(
              {
                temporaryAllowance: {
                  domain: originalUrl ? new URL(originalUrl).hostname : "",
                  timestamp: Date.now(),
                  lastAllowanceDate: new Date().toDateString(),
                  expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
                },
              },
              function () {
                if (originalUrl) window.location.href = originalUrl;
              }
            );
          }
        }, 1000);
      }
    });
  });
