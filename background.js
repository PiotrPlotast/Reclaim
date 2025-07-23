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
        console.log("Temporary allowance:", allowance);
        console.log("Current time:", Date.now());
        console.log(
          "Allowance expires at:",
          allowance ? allowance.expiresAt : null
        );
        const currentTime = Date.now();

        // If there's a valid temporary allowance for this domain
        if (
          allowance &&
          allowance.domain === new URL(details.url).hostname &&
          currentTime < allowance.expiresAt
        ) {
          // Allow the navigation - don't remove allowance yet, let it expire naturally
          console.log("Allowing navigation due to temporary allowance");
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
      console.log("Removed expired allowance");
    }
    console.log("Checked for expired allowances.");
  });
}, 60000);
