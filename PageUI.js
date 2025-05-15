class PageUI {

    static win;
    static contextMenuRightClick;

    static connect(win, contextMenuRightClick) {
        this.win = win;
        this.contextMenuRightClick = contextMenuRightClick;

    }

    // Disable UI
    static disable() {
        // Disable UI (page.html some elements)
        this.win.webContents.send("Disable UI");
        // disable contextMenuRightClick all items
        this.contextMenuRightClick.items.forEach(item => {
            item.enabled = false;
        });
    }

    // Enable UI
    static enable() {
        // Enable contextMenuRightClick all items
        this.contextMenuRightClick.items.forEach(item => {
            item.enabled = true;
        });
    }


}

module.exports = PageUI;