// let username = location.pathname
//
//
// console.log('asdasd')
//
//
//
//
// chrome.contextMenus.create({
//     title: `前往%s的house`,contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
//     onclick: function (params) {
//         location.reload()
//         console.log(askPrice)
//         console.log(123123)
//         console.log(JSON.stringify(params), 'params')
//         let usernames = []
//         chrome.storage.sync.get('usernames', function (background) {
//             if (background.usernames) {
//                 console.log(background.usernames, 'background.usernames')
//                 usernames = background.usernames
//             }
//
//             let dom = document.getElementById('housechan-message-box')
//             console.log(dom, 'dom')
//
//             usernames.push(params.selectionText)
//             chrome.storage.sync.set({ usernames })
//         })
//     }
//
// });
