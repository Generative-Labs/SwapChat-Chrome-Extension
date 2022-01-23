$().ready(() => {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      const iframeSrc = "https://newbietown.com";
      // const iframeSrc = "http://localhost:3000";
      const discord = "discord.com";
      const twitter = "twitter.com";
      const popupPage = $("#popup-page");
      let platform = "twitter";
      let currentTabUrl = tabs[0].url;

      // if (
      //   currentTabUrl.indexOf(twitter) === -1 &&
      //   currentTabUrl.indexOf(discord) === -1
      // ) {
      //   console.log("当前页面不支持");
      //   return;
      // }

      if (currentTabUrl.indexOf(discord) !== -1) {
        //当前平台
        platform = "discord";
      }

      if (currentTabUrl.indexOf(twitter) !== -1) {
        platform = "twitter";
      }
      const src = `${iframeSrc}/chat/auth?platform=${platform}&fromPage=popup`;
      popupPage.append(
        $(
          `<iframe style="height: 546px; width: 400px" src="${src}" frameborder="0"></iframe>`
        )
      );
      let button = $(".popup-slide-toggle-icon");
      if (button.length) {
        button.click(function () {
          chrome.runtime.sendMessage({
            info: "ready-create-auth-page",
            from: "popup",
          });
        });
      }
    }
  );
});
