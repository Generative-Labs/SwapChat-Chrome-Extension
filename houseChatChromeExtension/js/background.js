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
