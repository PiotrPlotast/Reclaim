document.addEventListener("DOMContentLoaded", function () {
  loadPreferences();
});

function loadPreferences() {
  chrome.storage.sync.get(
    ["messagePreferences", "freeTimeMinutes", "showAlternativeSites"],
    function (result) {
      const messagesPreferences = result.messagePreferences || {
        gentle: true,
        direct: true,
        mindful: true,
        empowering: true,
      };

      document.getElementById("gentle").checked = messagesPreferences.gentle;
      document.getElementById("direct").checked = messagesPreferences.direct;
      document.getElementById("mindful").checked = messagesPreferences.mindful;
      document.getElementById("empowering").checked =
        messagesPreferences.empowering;

      document.getElementById("freeTimeMinutes").value =
        result.freeTimeMinutes || 0;

      document.getElementById(
        "timeLeftHeading"
      ).textContent = `Free time left for today: ${result.freeTimeMinutes} minutes`;

      document.getElementById("showAlternativeSites").checked =
        result.showAlternativeSites || false;
    }
  );
}

document.getElementById("saveBtn").addEventListener("click", function () {
  const messagesPreferences = {
    gentle: document.getElementById("gentle").checked,
    direct: document.getElementById("direct").checked,
    mindful: document.getElementById("mindful").checked,
    empowering: document.getElementById("empowering").checked,
  };

  const freeTimeMinutes = document.getElementById("freeTimeMinutes").value;
  const showAlternativeSites = document.getElementById(
    "showAlternativeSites"
  ).checked;
  chrome.storage.sync.set(
    {
      messagePreferences: messagesPreferences,
      freeTimeMinutes,
      showAlternativeSites,
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
