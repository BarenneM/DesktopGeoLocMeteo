const { app} = require("electron");

module.exports = [
    {
        label: app. ame,
        submenu : [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'reload' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    },
    {
        label: 'File',
        submenu: [
            {
                label: 'Exit',
                role: 'quit'
            },
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Outils de developpement',
                role: 'toggledevtools'
            },
            { 
                type: 'separator' 
            },
            {
                label: 'About',
                role: 'about'
            }
        ]
    }
]