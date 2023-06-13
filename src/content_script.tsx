chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.findColor && msg.replaceColor) {
      console.log(msg);
      Array.from(document.querySelectorAll('*'))
        .filter(item => window.getComputedStyle(item).backgroundColor == msg.findColor)
        .forEach(item => (item as any).style.backgroundColor = msg.replaceColor)
      sendResponse(`Change color from ${msg.findColor} to ${msg.replaceColor}`);
    } else {
      sendResponse("Color message is none.");
    }
  });
