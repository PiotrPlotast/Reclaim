const blockedDomains = [
  "facebook.com",
  "instagram.com",
  "x.com",
  "tiktok.com",
  "youtube.com",
  "reddit.com",
  "twitch.tv",
  "pinterest.com",
  "linkedin.com",
];
blockedDomains.forEach((blockedDomain) => {
  chrome.webNavigation.onBeforeNavigate.addListener(
    function (details) {
      if (details.frameId !== 0) return;
      chrome.tabs.update(details.tabId, {
        url:
          chrome.runtime.getURL("blocked.html") +
          `?originalUrl=${encodeURIComponent(
            details.url
          )}&domain=${encodeURIComponent(new URL(details.url).hostname)}`,
      });
    },
    {
      url: blockedDomains.map((domain) => ({ hostContains: domain })),
    }
  );
});
