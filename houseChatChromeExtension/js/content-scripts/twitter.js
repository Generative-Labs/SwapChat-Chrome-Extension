$().ready(() => {
  const host = location.host;
  const body = $("#react-root");
  const twitter = "twitter.com";
  const platform = "twitter";
  const iframeSrc = "https://chat.web3messaging.online";
  // const iframeSrc = "https://pre.web3messaging.online";
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

  async function createMessageBox(spacesHash= '') {
    // get friend username
    let friendUserName = location.pathname.split("/")[1];
    // get self username
    let selfUserName = getSelfNameByDom();
    if (!selfUserName) return;
    if (selfUserName === friendUserName) return;
    let src = `${iframeSrc}/chat/chatWebPage?userHash=${selfUserName}@@${friendUserName}&platform=${platform}&fromPage=normal`;
    if (spacesHash) {
       src = `${iframeSrc}/chat/chatWebPage?=${selfUserName}@@${friendUserName}&platform=${platform}&fromPage=normal&spaceHash=${spacesHash}`;
    }
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
    let style = spacesHash ? 'right: 500px' : ''
    let messageBoxEle = $(`
            <div class="twitter-housechan-message-box" id="housechan-message-box" style="${style}">
            </div>
        `);

    let homeIconEle = $(
      '<img class="home-icon" src="https://chat.web3messaging.online/assets/icon/newHomeHeaderIcon.svg" alt="">'
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
         <img style="width: 100%; margin-right: 10px; filter: drop-shadow(0px 4px 5px rgba(36, 36, 36, 0.45));" src="https://chat.web3messaging.online/assets/icon/newHouseChatIcon.svg" alt="">
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

  function getSpaceDom() {
    if ($(".swapchat-spaces-btn") && $(".swapchat-spaces-btn").length > 0) {
      return
    }
    let paths = location.pathname.split('/')
    let spaceId =  paths[paths.length - 1]
    let spaceTitle = ''
    let spacesDescDom = $("div[data-testid='placementTracking']")
    if (spacesDescDom.length > 0) {
      let firstChild = spacesDescDom[0].firstElementChild
      if (firstChild) {
        let firstChildDom = $(firstChild)
        let arialabel = firstChildDom[0].ariaLabel
        if (arialabel) {
          spaceTitle = arialabel.substring(13, arialabel.indexOf('hosted'))
        }
      }
    }
    let spacesDom = $("div[aria-label='Spaces dock']")
    if (spacesDom.length > 0 && spaceTitle && spaceId) {
      let swapchatSpacesBtn = $(`
        <div class="swapchat-spaces-btn">
        <img style="width: 30px;height: auto; margin-right: 10px;" src="https://chat.web3messaging.online/assets/icon/newHouseChatIcon.svg" alt="">
           SwapChat Room
</div>
      `)
      swapchatSpacesBtn.click(function () {
        createMessageBox(`${spaceId}@@${spaceTitle}`)
      })
      spacesDom.after(swapchatSpacesBtn)
    }
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
    if (location.pathname.indexOf('spaces')) {
      getSpaceDom()
    }
  }, 500);
});
