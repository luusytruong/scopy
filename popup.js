if (chrome.tabs) {
  const cook = document.getElementById("cook");
  const css = `
      * {
        user-select: text !important;
        -moz-user-select: text !important;
        -webkit-user-select: text !important;
      }
      ::selection {
        background-color: #5B50BF;
        color: #FFFFFF;
      }
      ::-moz-selection {
        background-color: #5B50BF;
        color: #FFFFFF;
      }
    `;
  function injectCSS(tabId, css) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        func: (cssText) => {
          const styleElement = document.createElement("style");
          styleElement.textContent = cssText;
          styleElement.id = "truong-dev";
          document.head.appendChild(styleElement);
        },
        args: [css],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          alert("error: " + chrome.runtime.lastError.message);
        }
      }
    );
  }
  function removeCSS(tabId) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        func: () => {
          const styleElement = document.getElementById("truong-dev");
          document.head.removeChild(styleElement);
        },
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          alert("error: " + chrome.runtime.lastError.message);
        }
      }
    );
  }
  cook.addEventListener("click", () => {
    chrome.storage.sync.get("change", (data) => {
      const newValue = data.change === 1 ? 0 : 1;
      chrome.storage.sync.set({ change: newValue }, () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tabId = tabs[0].id;
          if (newValue === 1) {
            cook.classList.add("enable");
            cook.innerText = "Disable";
            injectCSS(tabId, css);
          } else {
            cook.classList.remove("enable");
            cook.innerText = "Enable";
            removeCSS(tabId);
          }
        });
      });
    });
  });
  chrome.storage.sync.get("change", (data) => {
    if (data.change === undefined) {
      chrome.storage.sync.set({ change: 0 });
    } else {
      if (data.change === 1) {
        cook.classList.add("enable");
        cook.innerText = "Disable";
      }
    }
  });
}