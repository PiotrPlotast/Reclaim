const blockedDomains = [
  "facebook.com",
  "instagram.com",
  "twitter.com",
  "tiktok.com",
  "youtube.com",
  "reddit.com",
];

blockedDomains.forEach((blockedDomain) => {
  chrome.webNavigation.onBeforeNavigate.addListener(
    function (details) {
      console.log(`onBeforeNavigate to: ${details.url}`);
    },
    { url: [{ hostContains: blockedDomain }] }
  );
});
