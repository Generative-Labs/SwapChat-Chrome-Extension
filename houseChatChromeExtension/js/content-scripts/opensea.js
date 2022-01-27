$().ready(() => {
  const host = location.host;
  const body = $("body");
  console.log(body);
  const opensea = "opensea.io";
  const platform = "opensea";
  const iframeSrc = "https://newbietown.com";
  // const iframeSrc = "http://localhost:3000";
  const apiHost = "https://newbietown.com";

  if (host !== opensea) {
    console.log("不是opensea，该插件无效");
    return;
  }

  const BUTTON_TYPE_ENUM = {
    JOIN_ITEM_THREAD_ROOM: "item-thread-room",
    COLLECTION_ROOM: "collection-room",
    PRIVATE_ROOM: "private-room",
  };
  console.log("插件生效");

  // 刷新页面的时候
  // setTimeout(function () {
  //   if (getSelfNameByDom()) {
  //     createPrivateRoomButton();
  //   }
  // }, 3000);

  // 右键菜单事件
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request.info, "content");
    if (request.info && request.info === "create-private-room") {
      // checkUser();
    }
  });

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
      tweet_url: url,
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
        <div class="bind-platform-dialog">
            <div>
              <img class="close-icon" src="https://d97ch61yqe5j6.cloudfront.net/frontend/closeIcon.png" alt="">
            </div>
            <h1>You must bind your Twitter </h1>
            <div>
                step1. <a class="send-tweet-button" href="https://twitter.com/intent/tweet?text=I am verifying my HCCS account, my wallet address is: 0x0000000" target="_blank">Send</a> a tweet
            </div>
           <div>
            <p>step2. Enter the tweet address here</p>
            <input type="text" placeholder="Enter the tweet address here" class="bind-platform-input" value="">
           </div>
            <div class="bind-platform-btns">
            <p>step3. <span class="submit-address-tweet-button">submit</span> the tweet address to us</p>
            </div>
        </div>
     </div>   
    `);
    body.append(dialog);
    $(".close-icon").click(function () {
      $(".bind-platform-dialog-box").remove();
    });
    $(".submit-address-tweet-button").click(function () {
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

  async function createMessageBox(type) {
    console.log("ready to create message box");
    let src = "";
    if (type === BUTTON_TYPE_ENUM.COLLECTION_ROOM) {
      let path = location.pathname.split("/");
      let collectionName = path[path.length - 1];
      if (path.length > 1 && path[1] !== "collection") return;
      src = `${iframeSrc}/chat/chatWebPage?platform=${platform}&collectionName=${collectionName}`;
    }
    if (type === BUTTON_TYPE_ENUM.JOIN_ITEM_THREAD_ROOM) {
      // src = `${iframeSrc}/chat/chatWebPage?platform=${platform}&collectionName=${collectionName}`;
      console.log("创建thread");
      let realContractAddress = "";
      let realTokenId = ''
      let pathNameArr = location.pathname.split('/')
      if (pathNameArr) {
        realTokenId = pathNameArr[pathNameArr.length - 1]
        realContractAddress = pathNameArr[pathNameArr.length - 2]
      }
      src = `${iframeSrc}/chat/chatWebPage?platform=${platform}&itemTokenId=${realTokenId}&itemContractAddress=${realContractAddress}`;
    }
    if (type === BUTTON_TYPE_ENUM.PRIVATE_ROOM) {
      let realAddress = "";
      let nextDataDom = document.getElementById("__NEXT_DATA__");
      let addressBtn = $(".AccountHeader--address");
      let innerAddress = addressBtn[0].innerText;
      let simpleAddress = innerAddress.split("...");
      if (nextDataDom && nextDataDom.innerText) {
        if (JSON.parse(nextDataDom.innerText)) {
          let nextData = JSON.parse(nextDataDom.innerText);
          console.log(nextData, 'nextData')
          let ethAddress = nextData?.props?.ssrData?.account?.address;
          if (
              ethAddress.indexOf(simpleAddress[0]) !== -1 &&
              ethAddress.indexOf(simpleAddress[1]) !== -1
          ) {
            realAddress = ethAddress;
          }
        }
      }

      if (!realAddress) {
        let scripts = document.getElementsByTagName('script')
        let address = ''
        for (let i = 0; i < scripts.length; i++) {
          let currentScript = scripts[i]
          if (currentScript.innerText.indexOf('__wired__') !== -1) {
            if (
                currentScript.innerText.indexOf(simpleAddress[0]) !== -1 &&
                currentScript.innerText.indexOf(simpleAddress[1]) !== -1
            ) {
              let start = currentScript.innerText.indexOf(simpleAddress[0])
              let end = currentScript.innerText.indexOf(simpleAddress[1])
              address =  currentScript.innerText.substring(start, end)
            }
          }
        }
        realAddress  = address + simpleAddress[1]
      }
      if (realAddress) {
        src = `${iframeSrc}/chat/chatWebPage?platform=${platform}&openseaAccountAddress=${realAddress}`
      }
    }

    if (!src) return;
    if (
      $(".opensea-housechan-message-box") &&
      $(".opensea-housechan-message-box").length
    ) {
      // 修改header字
      // let src = `${iframeSrc}/chat/webChat/${friendUserName.replace('#', '@')}?platform=${platform}`
      $(".opensea-housechan-message-header-iframe").remove();
      $(".opensea-housechan-message-body").append(`
         <iframe class="opensea-housechan-message-header-iframe" style='width: 100%; height: 600px; border: 0;' src="${src}"></iframe>
      `);
      return;
    }

    let messageBoxEle = $(`
            <div class="opensea-housechan-message-box" id="housechan-message-box">
            </div>
        `);

    let homeIconEle = $(
      '<img class="home-icon" src="https://d97ch61yqe5j6.cloudfront.net/frontend/logo.png" alt="">'
    );
    let slideToggleIconELe = $(
      '<img class="slide-toggle-icon" src="https://d97ch61yqe5j6.cloudfront.net/frontend/headerDown.png" alt="">'
    );
    let goHomeIconEle = $(
      '<img class="go-home-icon" src="https://d97ch61yqe5j6.cloudfront.net/frontend/homeIcon.png" alt="">'
    );
    let headerSpanEle = $("<span>House Studio</span>");
    let messageHeaderEle = $(`
            <div class="opensea-housechan-message-header">
            </div>
        `);
    let messageBodyEle = $(`
            <div class="opensea-housechan-message-body">
                <iframe class="opensea-housechan-message-header-iframe" style='width: 100%; height: 600px; border: 0;' src="${src}"></iframe>
            </div>
        `);

    messageHeaderEle.click(function () {
      let oriIcon = $(".slide-toggle-icon").attr("src");
      console.log(oriIcon, "oriIcon");
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
      $(".opensea-housechan-message-header-iframe").remove();
      let src = `${iframeSrc}/chat/auth?platform=${platform}&fromPage=normal`;
      $(".opensea-housechan-message-body").append(`
      <iframe class="opensea-housechan-message-header-iframe" style='width: 100%; height: 600px; border: 0;' src="${src}"></iframe>
      `);
      return false;
    });
    messageHeaderEle.append(homeIconEle);
    messageHeaderEle.append(headerSpanEle);
    messageHeaderEle.append(goHomeIconEle);
    messageHeaderEle.append(slideToggleIconELe);
    messageBoxEle.append(messageHeaderEle);
    messageBoxEle.append(messageBodyEle);
    chrome.storage.sync.set({ isShowHouseChat: true });
    body.append(messageBoxEle);
  }

  function createPrivateRoomButton() {
    if (
      $(".opensea-create-private-room") &&
      $(".opensea-create-private-room").length > 0
    )
      return;

    let publicBoxEle = $("div[class^='AccountLinksBarreact__DivContainer']");
    let btnBoxDom = publicBoxEle.children()[1];
    let btnBoxELe = $(btnBoxDom).children();
    let btnBoxClassName = btnBoxELe[0].className;
    let btnClassName = btnBoxELe.children()[0].className;
    let buttonDom = $(`
        <div
        class="opensea-create-private-room ${btnBoxClassName}"
         style="
         margin-right: 10px;
         "
         >
         <button type="button" class="${btnClassName}" style="
         background: #fff;
        display: flex;
        align-items: center;
    ">
             <img style="width: 23px;height: 23px; border-radius: 50%; margin-right: 10px;" src="https://d97ch61yqe5j6.cloudfront.net/frontend/icon-60@2x.png" alt="">
            Create Private Room
        </button>
        </div>
        `);

    buttonDom.click(function () {
      createMessageBox(BUTTON_TYPE_ENUM.PRIVATE_ROOM);
    });

    $(btnBoxDom).prepend(buttonDom);
  }

  function createCollectionRoomButton() {
    let collectHeaderEle = $(".CollectionHeader--info");
    let btnEle = $(".create-collection-room-button");
    if (btnEle.length && btnEle.length > 0) {
      return;
    }
    if (!collectHeaderEle.length) return;
    // 获取最外层div
    let btnsBox = collectHeaderEle.next();
    // 获取add to watchlist
    let firstBtnBox = btnsBox.children();
    let firstBtnChildren = $(firstBtnBox[0]).children();
    let btnClassName = firstBtnBox[0].className;
    let btnBoxClassName = firstBtnChildren[0].className;
    let buttonDom = $(`
        <div
        class="create-collection-room-button ${btnBoxClassName}"
         style=" 
         margin-right: 10px;
         "
         >
         <button type="button" class="${btnClassName}" style="
         background: #fff;
        border: none;
        display: flex;
        align-items: center;
    ">
             <img style="width: 23px;height: 23px; border-radius: 50%; margin-right: 10px;" src="https://d97ch61yqe5j6.cloudfront.net/frontend/icon-60@2x.png" alt="">
            Join NFT Room
        </button>
        </div>
        `);

    buttonDom.click(function () {
      createMessageBox(BUTTON_TYPE_ENUM.COLLECTION_ROOM);
    });

    btnsBox.prepend(buttonDom);
  }

  function createJoinItemThreadRoom() {
    if ($(".join-item-Thread-room") && $(".join-item-Thread-room").length > 0)
      return;
    let itemCollectionToolbarWrapperEle = $(
      ".item--collection-toolbar-wrapper"
    );
    let itemChildBox = itemCollectionToolbarWrapperEle.children();
    let btnEle = itemChildBox.find("button");
    let btnClassName = btnEle[0].className;
    let btnDivClassName = itemCollectionToolbarWrapperEle[0].className;
    let itemChildBoxClassName = itemChildBox[0].className;

    let joinItemThreadRoomBtnDom = $(`
      <div class="join-item-Thread-room ${btnDivClassName}" style="min-width: 200px;">
        <div class="${itemChildBoxClassName}">
        <button class="${btnClassName}">
        
          <img style="width: 24px;height: 24px; border-radius: 50%; margin-right: 10px;" src="https://d97ch61yqe5j6.cloudfront.net/frontend/icon-60@2x.png" alt="">
              Join NFT Room
        </button>
        </div>
      </div>
    `);
    joinItemThreadRoomBtnDom.click(function () {
      createMessageBox(BUTTON_TYPE_ENUM.JOIN_ITEM_THREAD_ROOM);
    });
    itemCollectionToolbarWrapperEle.before(joinItemThreadRoomBtnDom);
  }

  function listenHistory() {
    // 当前path
    let path = location.pathname.split("/")[1];

    if (path === "collection") {
      // 准备创建基于collect的room按钮
      createCollectionRoomButton();
    }
    if (path === "assets") {
      createJoinItemThreadRoom();
    }

    if (
      $(".AccountHeader--image-container") &&
      $(".AccountHeader--image-container").length > 0
    ) {
      createPrivateRoomButton();
    }
  }

  // 项目入口
  setInterval(() => {
    listenHistory();
  }, 500);
});
