$().ready(() => {
  const host = location.host;
  const body = $("#react-root");
  const twitter = "twitter.com";
  const platform = "twitter";
  const iframeSrc = "https://newbietown.com";
  // const iframeSrc = "http://localhost:3000";

  const platformStatus = {
    eth: 0,
    twitter: 1,
    ins: 2,
    facebook: 3,
    discord: 4,
    opensea: 5,
    invited: 6
  };

  const apiHost = "https://newbietown.com";

  if (host !== twitter) {
    console.log("不是twitter，该插件无效");
    return;
  }
  console.log("插件生效");

  // 右键菜单事件
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request.info, "content");
    if (request.info && request.info === "create-private-room") {
      // checkUser();
    }
  });
  function getUserStatus(code, platform) {
    if (!code) return false
    let status = code[platformStatus[platform]]
    console.log(status, 'status')
    if (status) {
      console.log(Boolean(Number(status)), 'Boolean(Number(status))')
      return Boolean(Number(status))
    }else {
      //没有验证通过
      return false
    }
  }

  async function selfFetch(url, params, headers = null) {
    let res = null;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(params),
      }).then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          return Promise.reject(response.json());
        }
      });
      console.log(res, "res");
    } catch (e) {
      console.log(e, "e");
    }
    if (res && res.data) {
      return res.data;
    }
    return res;
  }

  async function registerUser(platform, username) {
    return await selfFetch(`${apiHost}/register`, {
      platform: platform,
      user_name: username,
    });
  }

  async function verifyPlatform(url) {
    return await selfFetch(`${apiHost}/verify_platform`, {
      data: url,
      platform: 'twitter'
    });
  }

  // 获取house用户信息
  async function getHouseUserInfo(platform, username) {
    return await selfFetch(`${apiHost}/info`, {
      platform: platform,
      user_name: username,
    });
  }

  async function getLoginRandomSecret(address) {
    return await selfFetch(`${apiHost}/login_random_secret`, {
      wallet_address: address,
    });
  }

  function loginToHouse() {
    chrome.runtime.sendMessage({
      info: "ready-create-auth-page",
    });
  }

  function openTweetDialog(platform) {
    let dialog = $(`
      <div class="bind-platform-dialog-box">
<!--            <div class="bind-platform-dialog-content">-->
<!--              <div class="bind-platform-dialog-box">-->
<!--                <div class="step-item-box">-->
<!--                    <div class="step-item-box-circle-box">1</div>-->
<!--                    <h1>Step 1</h1>-->
<!--                    <p>Click the button below to post a tweet. </p>-->
<!--                    <div class="step-item-box-button step-item-box-post-tweet-button" >-->
<!--                      <span>Post a tweet</span>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="step-item-box">-->
<!--                    <div class="step-item-box-circle-box">2</div>-->
<!--                    <h1>Step 2</h1>-->
<!--                    <p>Copy and paste the tweet URL in below.</p>-->
<!--                    <div class="step-item-box-input">-->
<!--                      <input type="text" placeholder="Enter the tweet address here" class="bind-platform-input" value="">-->
<!--                    </div>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="step-item-box final-step-item-box">-->
<!--                    <div class="step-item-box-circle-box">3</div>-->
<!--                    <h1>Step 3</h1>-->
<!--                    <p>Hit the submit button once you pasted the URL.</p>-->
<!--                    <div class="step-item-box-button step-item-box-post-submit-button">-->
<!--                      <span>Submit</span>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
     </div>   
    `);

    let bindPlatFormDialogEle = $(`
        <div class="bind-platform-dialog">
            <div class="bind-platform-dialog-header">
              <img class="bind-platform-dialog-header-close-icon" src="https://d97ch61yqe5j6.cloudfront.net/frontend/closeIcon.png" alt="">
            </div>
        </div>
    `)
    let openTweetIframeSrc = `${iframeSrc}/chat/verifyTwitterPage`
    let openTweetIframe = $(`
        <iframe class="bind-platform-dialog-box-iframe" style='width: 100%; height: 600px; border: 0;' src="${openTweetIframeSrc}"></iframe>
    `)
    bindPlatFormDialogEle.append(openTweetIframe)
    dialog.append(bindPlatFormDialogEle)
    // dialog.append()
    body.append(dialog);
    $(".step-item-box-post-tweet-button").click(function () {
      chrome.runtime.sendMessage({
        info: "ready-create-post-tweet-page",
      });
    });

    $(".bind-platform-dialog-header-close-icon").click(function () {
      $(".bind-platform-dialog-box").remove();
      registerUser(platform, getSelfNameByDom()).then(userInfo => {
        let twitterStatus = getUserStatus(userInfo.status, 'twitter')
        if (!twitterStatus) {
        } else {
          createMessageBox();
        }
      });
    });
    $(".step-item-box-post-submit-button").click(function () {
      let url = $(".bind-platform-input")[0].value;
      if (!url) return;
      verifyPlatform(url).then((bindRes) => {
        if (bindRes.code !== 0) {
          alert(bindRes.msg);
        }
        $(".bind-platform-dialog-box").remove();
        createMessageBox();
      });
    });
  }

  async function checkUser() {
    // if ($(".twitter-housechan-message-box").length) return;
    createDisablePrivateRoomButton();
    // openTweetDialog(platform);
    // return
    // get friend username
    let friendUserName = location.pathname.split("/")[1];
    // get self username
    let selfUserName = getSelfNameByDom();
    if (!selfUserName) return;
    if (selfUserName === friendUserName) return;
    const userInfo = await registerUser(platform, getSelfNameByDom());
    $(".disable-create-private-button").remove();
    if (!userInfo) return createMessageBox()
    let twitterStatus = getUserStatus(userInfo.status, 'twitter')
    if (!twitterStatus) {
      console.log('该用户没有绑定tw')
      openTweetDialog(platform);
    } else {
      console.log("call createMessageBox");
      createMessageBox();
    }
  }

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
      '<img class="home-icon" src="https://d97ch61yqe5j6.cloudfront.net/frontend/homeHeaderIconx3.png" alt="">'
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
         border: 1px solid rgb(207, 217, 222);
         border-radius: 999px;
         padding: 0 10px;
         display: flex; 
         align-items: center;
         font-family: sans-serif;
         "
         >
               <img style="width: 30px;height: 30px; border-radius: 50%; margin-right: 10px;" src="https://d97ch61yqe5j6.cloudfront.net/frontend/icon-60@2x.png" alt="">
            Create Private Room        
        </div>
        `);
    buttonDom.click(function () {
      checkUser();
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
         border: 1px solid rgb(207, 217, 222);
         background: #ccc;
         border-radius: 999px;
         padding: 0 10px;
         display: flex; 
         align-items: center;
         font-family: sans-serif;
         pointer-events: none;
         cursor: default;
         "
         >
               <img style="width: 30px;height: 30px; border-radius: 50%; margin-right: 10px;" src="https://d97ch61yqe5j6.cloudfront.net/frontend/loading.png" alt="">
            Create Private Room
        </div>
        `);
    userNameEle.append(buttonDom);
  }

  function listenHistory() {
    // 当前path
    let path = location.pathname.split("/")[1];
    // 缓存上次path
    chrome.storage.sync.get("prevHost", function (script) {
      if (script.prevHost && script.prevHost === path) {
      } else {
        // 同步最新path 删除message
        if (
          $(".twitter-housechan-message-box") &&
          $(".twitter-housechan-message-box").length
        ) {
          let messageDom = $("div[data-testid='DMDrawer']");
          messageDom.css("transform", "translateX(-500px)");
        }
        createPrivateRoomButton();
        chrome.storage.sync.set({ prevHost: path });
      }
    });
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

  // async function joinHouseChan(selfUserName) {
  //   fetch(`${apiHost}/register`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     mode: "cors",
  //     body: JSON.stringify({
  //       platform: "twitter",
  //       user_name: selfUserName,
  //     }),
  //   })
  //     .then((response) => {
  //       if (response.status === 200) {
  //         return response.json();
  //       } else {
  //         return Promise.reject(response.json());
  //       }
  //     })
  //     .then((res) => {
  //       if (res.data) {
  //         $(".join-house-chan-button").css("display", "none");
  //         addCheckHouseChanButton(selfUserName);
  //       }
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // }

  // function addJoinHouseChanButton(selfUserName) {
  //   let commonMenuBoxEle = $("div[data-testid='AppTabBar_More_Menu']");
  //   let parent = commonMenuBoxEle.parent();
  //   let commMenuChild = commonMenuBoxEle.children();
  //   let graSonEle = $(commMenuChild).children();
  //   let bro = $(`
  //                   <div aria-expanded="false" aria-haspopup="menu" aria-label="Join House Chan" role="button" class="${commonMenuBoxEle.className} join-house-chan-button" tabindex="1">
  //                       <div class="${commMenuChild[0].className}">
  //                           <div class="${graSonEle[0].className}">
  //                              <img style="width: 26px;height: 26px; border-radius: 50%;" src="https://d97ch61yqe5j6.cloudfront.net/frontend/icon-40@2x.png" alt="">
  //                           </div>
  //                           <div dir="auto" class="${graSonEle[1].className}">
  //                               <span>Join House Chan</span>
  //                           </div>
  //                       </div>
  //                   </div>
  //               `);
  //   bro.hover(function () {
  //     bro.css("border-radius", "999px");
  //     bro.css("background", "rgba(15, 20, 25, 0.1)");
  //     bro.css("cursor", "pointer");
  //   });
  //
  //   bro.mousedown(function () {
  //     bro.css("cursor", "pointer");
  //     bro.css("border-radius", "999px");
  //     bro.css("background", "rgba(15, 20, 25, 0.2)");
  //   });
  //
  //   bro.mouseup(function () {
  //     bro.css("border-radius", "999px");
  //     bro.css("background", "rgba(15, 20, 25, 0.1)");
  //     bro.css("cursor", "pointer");
  //   });
  //
  //   bro.mouseleave(function () {
  //     bro.css("border-radius", "999px");
  //     bro.css("background", "#fff");
  //     bro.css("cursor", "default");
  //   });
  //   parent.append(bro);
  //   bro.click(function () {
  //     joinHouseChan(selfUserName).then((r) => {
  //       console.log(r);
  //     });
  //   });
  // }

  // function addCheckHouseChanButton(selfUserName) {
  //   if ($(".check-house-chan-button") && $(".check-house-chan-button").length) return
  //   let commonMenuBoxEle = $("div[data-testid='AppTabBar_More_Menu']");
  //   let parent = commonMenuBoxEle.parent();
  //   let commMenuChild = commonMenuBoxEle.children();
  //   let graSonEle = $(commMenuChild).children();
  //   let bro = $(`
  //                   <div aria-expanded="false" aria-haspopup="menu" aria-label="Check House Chan" role="button" class="${commonMenuBoxEle.className} check-house-chan-button" tabindex="1">
  //                       <div class="${commMenuChild[0].className}">
  //                           <div class="${graSonEle[0].className}">
  //                              <img style="width: 26px;height: 26px; border-radius: 50%;" src="https://d97ch61yqe5j6.cloudfront.net/frontend/icon-40@2x.png" alt="">
  //                           </div>
  //                           <div dir="auto" class="${graSonEle[1].className}">
  //                               <span>check House Chan</span>
  //                           </div>
  //                       </div>
  //                   </div>
  //               `);
  //   bro.hover(function () {
  //     bro.css("border-radius", "999px");
  //     bro.css("background", "rgba(15, 20, 25, 0.1)");
  //     bro.css("cursor", "pointer");
  //   });
  //
  //   bro.mousedown(function () {
  //     bro.css("cursor", "pointer");
  //     bro.css("border-radius", "999px");
  //     bro.css("background", "rgba(15, 20, 25, 0.2)");
  //   });
  //
  //   bro.mouseup(function () {
  //     bro.css("border-radius", "999px");
  //     bro.css("background", "rgba(15, 20, 25, 0.1)");
  //     bro.css("cursor", "pointer");
  //   });
  //
  //   bro.mouseleave(function () {
  //     bro.css("border-radius", "999px");
  //     bro.css("background", "#fff");
  //     bro.css("cursor", "default");
  //   });
  //   parent.append(bro);
  //   bro.click(function () {
  //     createPrivateRoomButton(selfUserName);
  //   });
  // }

  // function initShowButton(selfUserName) {
  //   fetch(`${apiHost}/info`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     mode: "cors",
  //     body: JSON.stringify({
  //       platform: "twitter",
  //       user_name: selfUserName,
  //     }),
  //   })
  //     .then((response) => {
  //       if (response.status === 200) {
  //         return response.json();
  //       } else {
  //         return Promise.reject(response.json());
  //       }
  //     })
  //     .then((res) => {
  //       if (!res.data) {
  //         // 该用户还咩有注册house
  //         addJoinHouseChanButton(selfUserName);
  //       } else {
  //         addCheckHouseChanButton(selfUserName);
  //       }
  //     })
  //     .catch((e) => {
  //       console.log(e, "e");
  //     });
  // }
});
