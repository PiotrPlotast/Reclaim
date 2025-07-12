const urlParams = new URLSearchParams(window.location.search);
const originalUrl = urlParams.get("originalUrl");
const domain = urlParams.get("domain");

const reflectionMessages = [
  "Hold on - Reclaim invites you to reflect.\nWhy are you visiting this site right now?",
  "Take a moment - Reclaim is here to help you stay intentional.\nWhat do you hope to get from this visit?",
  "Mindful pause - before you continue, check in with yourself.\nWhat's your purpose here?",
  "Just a second - Reclaim is keeping you grounded.\nWhat's drawing you to this site right now?",
  "You're in control - Reclaim is just checking in.\nIs this aligned with your goals right now?",
  "Pause to focus - Reclaim detected a potential distraction.\nWhat value does this site bring you right now?",
  "Hold that click - Reclaim wants to keep you aligned.\nHow does this serve your current priorities?",
  "Stop for clarity - Reclaim is helping you act with purpose.\nWhy do you want to open this site?",
];

function getRandomMessage() {
  const randomIndex = Math.floor(Math.random() * reflectionMessages.length);
  return reflectionMessages[randomIndex];
}

document.addEventListener("DOMContentLoaded", function () {
  const messageElement = document.querySelector("p");
  if (messageElement) {
    messageElement.textContent = getRandomMessage();
  }
});
