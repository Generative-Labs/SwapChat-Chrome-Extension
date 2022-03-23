$().ready(() => {
  const host = location.host;
  const body = $("#react-root");
  const twitter = "twitter.com";
  const platform = "twitter";
  // const iframeSrc = "https://chat.web3messaging.online";
  const iframeSrc = "https://pre.web3messaging.online";

  const platformStatus = {
    eth: 0,
    twitter: 1,
    ins: 2,
    facebook: 3,
    discord: 4,
    opensea: 5,
    invited: 6
  };

  const apiHost = "https://chat.web3messaging.online";

  if (host !== twitter) {
    console.log("不是twitter，该插件无效");
    return;
  }
  console.log("插件生效");


  window.onpopstate = function(event) {
    console.log('路由跳转')
    let src = $(".twitter-housechan-message-header-iframe").attr('src');
    $(".twitter-housechan-message-header-iframe").remove();
    $(".twitter-housechan-message-body").append(`
      <iframe class="twitter-housechan-message-header-iframe" style='width: 100%; height: 600px; border: 0;' src="${src}"></iframe>
      `);
  };

  // 右键菜单事件
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request.info, "content");
    if (request.info && request.info === "create-private-room") {
      // checkUser();
    }
  });
  // function getUserStatus(code, platform) {
  //   if (!code) return false
  //   let status = code[platformStatus[platform]]
  //   console.log(status, 'status')
  //   if (status) {
  //     console.log(Boolean(Number(status)), 'Boolean(Number(status))')
  //     return Boolean(Number(status))
  //   }else {
  //     //没有验证通过
  //     return false
  //   }
  // }

  // async function selfFetch(url, params, headers = null) {
  //   let res = null;
  //   try {
  //     res = await fetch(url, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       mode: "cors",
  //       body: JSON.stringify(params),
  //     }).then((response) => {
  //       if (response.status === 200) {
  //         return response.json();
  //       } else {
  //         return Promise.reject(response.json());
  //       }
  //     });
  //     console.log(res, "res");
  //   } catch (e) {
  //     console.log(e, "e");
  //   }
  //   if (res && res.data) {
  //     return res.data;
  //   }
  //   return res;
  // }

  // async function registerUser(platform, username) {
  //   return await selfFetch(`${apiHost}/register`, {
  //     platform: platform,
  //     user_name: username,
  //   });
  // }
  //
  // async function verifyPlatform(url) {
  //   return await selfFetch(`${apiHost}/verify_platform`, {
  //     data: url,
  //     platform: 'twitter'
  //   });
  // }

  // // 获取house用户信息
  // async function getHouseUserInfo(platform, username) {
  //   return await selfFetch(`${apiHost}/info`, {
  //     platform: platform,
  //     user_name: username,
  //   });
  // }
  //
  // async function getLoginRandomSecret(address) {
  //   return await selfFetch(`${apiHost}/login_random_secret`, {
  //     wallet_address: address,
  //   });
  // }


  // function openTweetDialog(platform) {
  //   let dialog = $(`
  //     <div class="bind-platform-dialog-box">
  //    </div>
  //   `);
  //
  //   let bindPlatFormDialogEle = $(`
  //       <div class="bind-platform-dialog">
  //           <div class="bind-platform-dialog-header">
  //             <img class="bind-platform-dialog-header-close-icon" src="https://d97ch61yqe5j6.cloudfront.net/frontend/closeIcon.png" alt="">
  //           </div>
  //       </div>
  //   `)
  //   let openTweetIframeSrc = `${iframeSrc}/chat/verifyTwitterPage`
  //   let openTweetIframe = $(`
  //       <iframe class="bind-platform-dialog-box-iframe" style='width: 100%; height: 600px; border: 0;' src="${openTweetIframeSrc}"></iframe>
  //   `)
  //   bindPlatFormDialogEle.append(openTweetIframe)
  //   dialog.append(bindPlatFormDialogEle)
  //   // dialog.append()
  //   body.append(dialog);
  //   $(".step-item-box-post-tweet-button").click(function () {
  //     chrome.runtime.sendMessage({
  //       info: "ready-create-post-tweet-page",
  //     });
  //   });
  //
  //   $(".bind-platform-dialog-header-close-icon").click(function () {
  //     $(".bind-platform-dialog-box").remove();
  //     registerUser(platform, getSelfNameByDom()).then(userInfo => {
  //       let twitterStatus = getUserStatus(userInfo.status, 'twitter')
  //       if (!twitterStatus) {
  //       } else {
  //         createMessageBox();
  //       }
  //     });
  //   });
  //   $(".step-item-box-post-submit-button").click(function () {
  //     let url = $(".bind-platform-input")[0].value;
  //     if (!url) return;
  //     verifyPlatform(url).then((bindRes) => {
  //       if (bindRes.code !== 0) {
  //         alert(bindRes.msg);
  //       }
  //       $(".bind-platform-dialog-box").remove();
  //       createMessageBox();
  //     });
  //   });
  // }

  // async function checkUser() {
  //   // if ($(".twitter-housechan-message-box").length) return;
  //   createDisablePrivateRoomButton();
  //   // openTweetDialog(platform);
  //   // return
  //   // get friend username
  //   let friendUserName = location.pathname.split("/")[1];
  //   // get self username
  //   let selfUserName = getSelfNameByDom();
  //   if (!selfUserName) return;
  //   if (selfUserName === friendUserName) return;
  //   const userInfo = await registerUser(platform, getSelfNameByDom());
  //   $(".disable-create-private-button").remove();
  //   if (!userInfo) return createMessageBox()
  //   let twitterStatus = getUserStatus(userInfo.status, 'twitter')
  //   if (!twitterStatus) {
  //     console.log('该用户没有绑定tw')
  //     openTweetDialog(platform);
  //   } else {
  //     console.log("call createMessageBox");
  //     createMessageBox();
  //   }
  // }

  function getSelfNameByDom() {
    let selfDom = $("a[data-testid='AppTabBar_Profile_Link']");
    let selfUserName = "";
    if (selfDom[0]) {
      let hrefValue = selfDom[0].href;
      if (hrefValue && hrefValue.split("/")) {
        let hrefArr = hrefValue.split("/");
        selfUserName = hrefArr[hrefArr.length - 1];
      }
    }
    return selfUserName;
  }

  async function createMessageBox() {
    // get friend username
    let friendUserName = location.pathname.split("/")[1];
    // get self username
    let selfUserName = getSelfNameByDom();
    if (!selfUserName) return;
    if (selfUserName === friendUserName) return;
    let src = `${iframeSrc}/chat/chatWebPage?userHash=${selfUserName}@@${friendUserName}&platform=${platform}`;

    if ($(".twitter-housechan-message-box").length) {
      $(".twitter-housechan-message-header-iframe").remove();
      $(".twitter-housechan-message-body").append(`
        <iframe class="twitter-housechan-message-header-iframe" style='width: 100%; height: 600px; border: 0;' src="${src}"></iframe>
      `);
      return;
    }
    console.log("ready to create message box");
    // 获取Twitter原始message dom 向左移动
    let messageDom = $("div[data-testid='DMDrawer']");
    messageDom.css("transform", "translateX(-700px)");
    let messageBoxEle = $(`
            <div class="twitter-housechan-message-box" id="housechan-message-box">
            </div>
        `);

    let homeIconEle = $(
      '<img class="home-icon" src="https://pre.web3messaging.online/assets/icon/newHomeHeaderIcon.svg" alt="">'
    );
    let slideToggleIconELe = $(
      '<img class="slide-toggle-icon" src="https://d97ch61yqe5j6.cloudfront.net/frontend/headerDown.png" alt="">'
    );
    let goHomeIconEle = $(
      '<img class="go-home-icon" src="https://d97ch61yqe5j6.cloudfront.net/frontend/newRefreshIconx3.png" alt="">'
    );
    let messageHeaderEle = $(`
            <div class="twitter-housechan-message-header">
            </div>
        `);
    let messageBodyEle = $(`
            <div class="twitter-housechan-message-body">
                <iframe class="twitter-housechan-message-header-iframe" style='width: 100%; height: 600px; border: 0;' src="${src}"></iframe>
            </div>
        `);

    messageHeaderEle.click(function () {
      let oriIcon = $(".slide-toggle-icon").attr("src");
      if (oriIcon.indexOf("Up") !== -1) {
        $(".slide-toggle-icon").attr(
          "src",
          "https://d97ch61yqe5j6.cloudfront.net/frontend/headerDown.png"
        );
      } else {
        $(".slide-toggle-icon").attr(
          "src",
          "https://d97ch61yqe5j6.cloudfront.net/frontend/headerUp.png"
        );
      }
      messageBodyEle.slideToggle();
    });
    // 主页button 添加事件
    goHomeIconEle.click(function () {
      $(".twitter-housechan-message-header-iframe").remove();
      let src = `${iframeSrc}/chat/auth?platform=${platform}&fromPage=normal`;
      $(".twitter-housechan-message-body").append(`
      <iframe class="twitter-housechan-message-header-iframe" style='width: 100%; height: 600px; border: 0;' src="${src}"></iframe>
      `);
      return false;
    });
    messageHeaderEle.append(homeIconEle);
    messageHeaderEle.append(goHomeIconEle);
    messageHeaderEle.append(slideToggleIconELe);
    messageBoxEle.append(messageHeaderEle);
    messageBoxEle.append(messageBodyEle);
    body.append(messageBoxEle);
  }

  function createPrivateRoomButton() {
    const selfUserName = getSelfNameByDom();
    // 判断是否在个人主页
    const userNameEle = $("div[data-testid='UserName']");
    if (userNameEle.length <= 0) return;
    let friendName = location.pathname.split("/")[1];
    let id = `create-${friendName}-room`;
    let className = `create-private-room`;
    let createPrivateButtonEle = $(`#${id}`);
    if (createPrivateButtonEle && createPrivateButtonEle.length) return;
    if (friendName === selfUserName) {
      $(".create-private-room").css("display", "none");
      return;
    }
    console.log("ready to create private room button");
    userNameEle.css("position", "relative");
    let buttonDom = $(`
        <div
        id="${id}"
        class="${className}"
         style="position: absolute;
         top: 0;
         right: 0; 
         height: 44px; 
         min-width: 44px;
         border-radius: 999px;
         padding: 0 20px;
         display: flex; 
         align-items: center;
         font-family: sans-serif;
         background: #605DEC;
         color: #ffffff;
         "
         >
         <div style="display: inline-block; width: 30px; height: 30px; margin-right: 10px;">
         <img style="width: 100%; margin-right: 10px; filter: drop-shadow(0px 4px 5px rgba(36, 36, 36, 0.45));" src="https://pre.web3messaging.online/assets/icon/newHouseChatIcon.svg" alt="">
         </div>
            Create a SwapChat        
        </div>
        `);
    buttonDom.click(function () {
      createMessageBox();
    });
    userNameEle.append(buttonDom);
  }

  function createDisablePrivateRoomButton() {
    console.log("createDisablePrivateRoomButton");
    if (
      $(".disable-create-private-button") &&
      $(".disable-create-private-button").length
    )
      return;
    const selfUserName = getSelfNameByDom();
    // 判断是否在个人主页
    const userNameEle = $("div[data-testid='UserName']");
    if (userNameEle.length <= 0) return;
    let friendName = location.pathname.split("/")[1];
    if (friendName === selfUserName) {
      $(".create-private-room").css("display", "none");
      return;
    }
    console.log("ready to create private room button");
    userNameEle.css("position", "relative");
    let buttonDom = $(`
        <div
        class="disable-create-private-button"
         style="position: absolute;
         top: 0;
         right: 0; 
         height: 44px; 
         min-width: 44px;
         background: #ccc;
         border-radius: 999px;
         padding: 0 20px;
         display: flex; 
         align-items: center;
         font-family: sans-serif;
         pointer-events: none;
         cursor: default;
         "
         >
               <img style="width: 30px;height: 30px; border-radius: 50%; margin-right: 10px;" src="https://d97ch61yqe5j6.cloudfront.net/frontend/loading.png" alt="">
            Create a SwapChat
        </div>
        `);
    userNameEle.append(buttonDom);
  }
  // 项目入口
  setInterval(() => {
    if (getSelfNameByDom()) {
      if (
        $(".twitter-housechan-message-box") &&
        $(".twitter-housechan-message-box").length
      ) {
        let messageDom = $("div[data-testid='DMDrawer']");
        messageDom.css("transform", "translateX(-500px)");
      }
      createPrivateRoomButton();
    }
  }, 500);
});
