// let username = location.pathname
//
//
// console.log('asdasd')
//
//
//
//

// chrome.contextMenus.create({
//   title: `Create Private Room`, // 只有当选中文字时才会出现此右键菜单
//   onclick: function () {
//     console.log("Create Private Room");
//     chrome.tabs.query(
//       {
//         active: true,
//         currentWindow: true,
//       },
//       (tabs) => {
//         if (tabs[0] && tabs[0].url) {
//           let message = {
//             info: "create-private-room",
//           };
//           chrome.tabs.sendMessage(tabs[0].id, message, (res) => {
//             console.log("popup=>content");
//             console.log(res);
//           });
//         }
//       }
//     );
//   },
// });

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.info === "ready-create-auth-page") {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        let loginUrl = `https://chat.web3messaging.online/chat/auth?fromPage=normal`;
        chrome.tabs.create({
          url: loginUrl,
        });
        // chrome.tabs.remove(tabs[0].id)
      }
    );
  }

  if (req.info === "ready-create-post-tweet-page") {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        console.log(tabs[0]);
        let href = tabs[0].url;
        let loginUrl = `https://twitter.com/intent/tweet?text=I am verifying my HCCS account, my wallet address is: 0x0000000`;
        chrome.tabs.create({
          url: loginUrl,
        });
      }
    );
  }

  // if (req.info === "getTabId") {
  //   sendResponse({
  //     tabId: sender.tab.id,
  //   });
  // }

  // if (req.info === "open-bind-twitter-tab") {
  //   chrome.tabs.query(
  //     {
  //       active: true,
  //       currentWindow: true,
  //     },
  //     (tabs) => {
  //       chrome.tabs.create({
  //         url: "https://twitter.com/intent/tweet?text=I am verifying my HCCS account, my wallet address is: 0x0000000",
  //       });
  //     }
  //   );
  // }
});
