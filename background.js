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

      // Check for temporary allowance
      chrome.storage.local.get(["temporaryAllowance"], function (result) {
        const allowance = result.temporaryAllowance;
        const currentTime = Date.now();

        // If there's a valid temporary allowance for this URL
        if (
          allowance &&
          allowance.url === details.url &&
          currentTime < allowance.expiresAt
        ) {
          // Allow the navigation, but remove the allowance
          chrome.storage.local.remove(["temporaryAllowance"]);
          return;
        }

        // If allowance has expired, remove it
        if (allowance && currentTime >= allowance.expiresAt) {
          chrome.storage.local.remove(["temporaryAllowance"]);
        }

        // Block the navigation
        chrome.tabs.update(details.tabId, {
          url:
            chrome.runtime.getURL("blocked.html") +
            `?originalUrl=${encodeURIComponent(
              details.url
            )}&domain=${encodeURIComponent(new URL(details.url).hostname)}`,
        });
      });
    },
    {
      url: blockedDomains.map((domain) => ({ hostContains: domain })),
    }
  );
});

// Clean up expired allowances every minute
setInterval(function () {
  chrome.storage.local.get(["temporaryAllowance"], function (result) {
    const allowance = result.temporaryAllowance;
    const currentTime = Date.now();

    if (allowance && currentTime >= allowance.expiresAt) {
      chrome.storage.local.remove(["temporaryAllowance"]);
    }
  });
}, 60000); // Check every minute
