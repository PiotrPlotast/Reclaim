document.addEventListener("DOMContentLoaded", function () {
  loadPreferences();
});

function loadPreferences() {
  chrome.storage.sync.get(["messagePreferences"], function (result) {
    const preferences = result.messagePreferences || {
      gentle: true,
      direct: true,
      mindful: true,
      empowering: true,
    };

    document.getElementById("gentle").checked = preferences.gentle;
    document.getElementById("direct").checked = preferences.direct;
    document.getElementById("mindful").checked = preferences.mindful;
    document.getElementById("empowering").checked = preferences.empowering;
  });
}

document.getElementById("saveBtn").addEventListener("click", function () {
  const preferences = {
    gentle: document.getElementById("gentle").checked,
    direct: document.getElementById("direct").checked,
    mindful: document.getElementById("mindful").checked,
    empowering: document.getElementById("empowering").checked,
  };

  chrome.storage.sync.set(
    {
      messagePreferences: preferences,
    },
    function () {
      const status = document.getElementById("status");
      status.classList.remove("hidden");
      setTimeout(() => {
        status.classList.add("hidden");
      }, 2000);
    }
  );
});
