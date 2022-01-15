// let username = location.pathname
//
//
// console.log('asdasd')
//
//
//
//
chrome.contextMenus.create({
  title: `Create Private Room`, // 只有当选中文字时才会出现此右键菜单
  onclick: function () {
    console.log("Create Private Room");
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        let message = {
          info: "create-private-room",
        };
        chrome.tabs.sendMessage(tabs[0].id, message, (res) => {
          console.log("popup=>content");
          console.log(res);
        });
      }
    );
  },
});


chrome.runtime.onMessage.addListener((req,sender, sendResponse) => {
  if (req.info === 'ready-create-auth-page') {
    chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        (tabs) => {
          console.log(tabs[0])
          let href = tabs[0].url
          chrome.tabs.create({
            url: `http://localhost:3000/chat/auth?callbackUrl=${href}&fromPage=normal&platform=twitter`
          });

        }
    );
  }

  if (req.info ==='getTabId' ) {
      sendResponse({
          tabId: sender.tab.id
      })
  }
})
