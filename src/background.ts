function polling() {
    console.log("designer background polling");
    setTimeout(polling, 1000 * 30);
}

polling();