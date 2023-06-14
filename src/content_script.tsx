chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.findColor && msg.replaceColor) {
      console.log(msg);
      Array.from(document.querySelectorAll('*'))
        .filter(item => window.getComputedStyle(item).backgroundColor == msg.findColor)
        .forEach(item => (item as any).style.backgroundColor = msg.replaceColor)
      sendResponse(`Change color from ${msg.findColor} to ${msg.replaceColor}`);
    } else if (msg.getDesignMode) {
        sendResponse({ existingDesignMode: document.designMode });
    } else if (msg.designMode) {
        document.designMode = msg.designMode;
        sendResponse({ designMode: document.designMode });
    } else {
      sendResponse("Color message is none.");
    }
  });
