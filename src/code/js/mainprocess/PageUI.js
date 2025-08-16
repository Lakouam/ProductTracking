const User = require('./user.js');

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
    static disable(role = "") {
        // Disable UI (page.html some elements)
        this.win.webContents.send("Disable UI", role);
        // Disable contextMenuRightClick item 4 & 5 (reload & toggleDevTools)
        this.contextMenuRightClick.items.forEach(item => {
            if (item.id === 'reload' || item.id === 'toggleDevTools') {
                item.enabled = false;
            }
        });


        // Disable menu third item submenu item 1 (reload) and 2 (force reload)
        this.menu.items[2].submenu.items[0].enabled = false;
        this.menu.items[2].submenu.items[1].enabled = false;
        //this.menu.items[2].submenu.items[2].enabled = false;
    }

    // Enable UI
    static enable(role = "") {
        // Enable UI (page.html some elements)
        this.win.webContents.send("Enable UI", role);
        // Enable contextMenuRightClick all items
        this.contextMenuRightClick.items.forEach(item => {
            if (User.isActionValid('right-click-menu', role)) {
                item.enabled = true;
            }
        });

        // Enable menu third item submenu item 1 (reload) and 2 (force reload)
        if (User.isActionValid('menu', role)) {
            this.menu.items[2].submenu.items[0].enabled = true;
            this.menu.items[2].submenu.items[1].enabled = true;
        }
    }


}

module.exports = PageUI;