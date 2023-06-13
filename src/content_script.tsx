chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.color) {
      console.log("Receive color = " + msg.color);
      Array.from(document.querySelectorAll('*'))
      .filter(item => window.getComputedStyle(item).backgroundColor == 'rgb(255, 224, 27)')
      .forEach(item => (item as any).style.backgroundColor = msg.color)
      sendResponse("Change color to " + msg.color);
    } else {
      sendResponse("Color message is none.");
    }
  });