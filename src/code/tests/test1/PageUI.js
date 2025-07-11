class PageUI {

    static win;
    static contextMenuRightClick;
    static menu;

    static connect(win, contextMenuRightClick, menu) {
        this.win = win;
        this.contextMenuRightClick = contextMenuRightClick;
        this.menu = menu;
    }

    // Disable UI
    static disable() {
        // Disable UI (page.html some elements)
        this.win.webContents.send("Disable UI");
        // Disable contextMenuRightClick all items
        this.contextMenuRightClick.items.forEach(item => {
            item.enabled = false;
        });

        // Disable menu third item submenu item 1 (reload) and 2 (force reload)
        this.menu.items[2].submenu.items[0].enabled = false;
        this.menu.items[2].submenu.items[1].enabled = false;
        this.menu.items[2].submenu.items[2].enabled = false;
    }

    // Enable UI
    static enable() {
        // Enable UI (page.html some elements)
        this.win.webContents.send("Enable UI");
        // Enable contextMenuRightClick all items
        this.contextMenuRightClick.items.forEach(item => {
            item.enabled = true;
        });

        // Enable menu third item submenu item 1 (reload) and 2 (force reload)
        this.menu.items[2].submenu.items[0].enabled = true;
        this.menu.items[2].submenu.items[1].enabled = true;
    }


}

module.exports = PageUI;