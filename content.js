function getChange() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get("change", (data) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(data.change);
      }
    });
  });
}
async function load() {
  try {
    const change = await getChange();
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
    if (change) {
      const styleElement = document.createElement("style");
      styleElement.textContent = css;
      styleElement.id = "truong-dev";
      document.head.appendChild(styleElement);
    }
  } catch (error) {
    console.log("Error:", error);
  }
}
load();