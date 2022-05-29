$().ready(() => {
  const host = location.host;
  const body = $("body");
  const opensea = "opensea.io";
  const platform = "opensea";
  const iframeSrc = "https://chat.web3messaging.online";
  // const iframeSrc = "http://localhost:3000";
  const apiHost = "https://chat.web3messaging.online";

  if (host !== opensea) {
    return;
  }

  const BUTTON_TYPE_ENUM = {
    JOIN_ITEM_THREAD_ROOM: "item-thread-room",
    COLLECTION_ROOM: "collection-room",
    PRIVATE_ROOM: "private-room",
  };

  // 刷新页面的时候
  // setTimeout(function () {
  //   if (getSelfNameByDom()) {
  //     createPrivateRoomButton();
  //   }
  // }, 3000);

  // 右键菜单事件
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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

  async function createMessageBox(type, ownerUserName = "") {
    let src = "";
    if (type === BUTTON_TYPE_ENUM.COLLECTION_ROOM) {
      let path = location.pathname.split("/");
      let collectionName = path[path.length - 1];
      if (path.length > 1 && path[1] !== "collection") return;
      src = `${iframeSrc}/chat/chatWebPage?platform=${platform}&collectionName=${collectionName}&fromPage=normal`;
    }
    if (type === BUTTON_TYPE_ENUM.JOIN_ITEM_THREAD_ROOM) {
      // src = `${iframeSrc}/chat/chatWebPage?platform=${platform}&collectionName=${collectionName}`;
      let realContractAddress = "";
      let realTokenId = "";
      let pathNameArr = location.pathname.split("/");
      if (pathNameArr) {
        realTokenId = pathNameArr[pathNameArr.length - 1];
        realContractAddress = pathNameArr[pathNameArr.length - 2];
      }
      src = `${iframeSrc}/chat/chatWebPage?platform=${platform}&itemTokenId=${realTokenId}&itemContractAddress=${realContractAddress}&fromPage=normal`;
    }
    if (type === BUTTON_TYPE_ENUM.PRIVATE_ROOM) {
      if (ownerUserName) {
        src = `${iframeSrc}/chat/chatWebPage?platform=${platform}&openseaAccountUsername=${ownerUserName}&fromPage=normal`;
      } else {
          let pathname = location.pathname
          let arrs = pathname.split('/')
          let accountOrAddress = arrs[1]
          if ((accountOrAddress.length === 42 && accountOrAddress.indexOf('0x') !== -1) || accountOrAddress.length === 44 ) {
              // eth wallet address
              src = `${iframeSrc}/chat/chatWebPage?platform=${platform}&openseaAccountAddress=${accountOrAddress}&fromPage=normal`;
          } else  {
              src = `${iframeSrc}/chat/chatWebPage?platform=${platform}&openseaAccountUsername=${accountOrAddress}&fromPage=normal`;
          }
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
      '<img class="home-icon" src="https://chat.web3messaging.online/assets/icon/newHomeHeaderIcon.svg" alt="">'
    );
    let slideToggleIconELe = $(
      '<img class="slide-toggle-icon" src="https://d97ch61yqe5j6.cloudfront.net/frontend/headerDown.png" alt="">'
    );
    let goHomeIconEle = $(
      '<img class="go-home-icon" src="https://d97ch61yqe5j6.cloudfront.net/frontend/newRefreshIconx3.png" alt="">'
    );
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
    messageHeaderEle.append(goHomeIconEle);
    messageHeaderEle.append(slideToggleIconELe);
    messageBoxEle.append(messageHeaderEle);
    messageBoxEle.append(messageBodyEle);
    body.append(messageBoxEle);
  }

  function createPrivateRoomButton() {
    if (
      $(".opensea-create-private-room") &&
      $(".opensea-create-private-room").length > 0
    )
      return;
    let shareButton = $("i[value='share']")
      let parents = shareButton.parents("button");

    let createRoomBtn = $(`
    <div class="opensea-create-private-room-btn-box">
                 <img style="width: 20px;height: 20px; margin-right: 10px;" src="https://chat.web3messaging.online/assets/icon/newHouseChatIcon.svg" alt="">
                 <div>
                Create a SwapChat 
</div>
                
          </div>
    `)
      let buttonDom = $(`
        <div class="opensea-create-private-room">
        </div>
        `);
    // buttonDom.append(miniBtn)
    buttonDom.append(createRoomBtn)

    createRoomBtn.click(function () {
        createMessageBox(BUTTON_TYPE_ENUM.PRIVATE_ROOM);
      });
      parents.parent().after(buttonDom)

  }

  function newCreateJoinNFTRoomButton() {
    let btnEle = $(".create-join-collection-room-button");
    if (btnEle.length && btnEle.length > 0) {
      return;
    }
    let likeButtonEle = $("button[data-testid='phoenix-watchlist-button']")
    if (likeButtonEle[0]) {
      let newBox = $(`
      <div class="create-join-collection-room-button" style="margin: 10px auto; overflow:hidden;">
        <div class="join-collection-room-button">
             <img style="width: 20px;height: auto; margin-right: 20px;" src="https://chat.web3messaging.online/assets/icon/newHouseChatIcon.svg" alt="">
            Join NFT Room
        </div>
      </div>
    `);
      newBox.click(function () {
        createMessageBox(BUTTON_TYPE_ENUM.COLLECTION_ROOM);
      });
      likeButtonEle.parent().append(newBox)
    }
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
             <img style="width: 23px;height: 23px; margin-right: 10px;" src="https://chat.web3messaging.online/assets/icon/newHouseChatIcon.svg" alt="">
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
    // if ($(".join-item-Thread-room") && $(".join-item-Thread-room").length > 0)
    //   return;
    let itemCollectionToolbarWrapperEle = $(
      ".item--collection-toolbar-wrapper"
    );
    if ($(".big-join-nft-room") && $(".big-join-nft-room").length > 0) return;

    let priceBox = $(".TradeStation--price-container");
    let askButtonBox = null;
    if (priceBox.length > 0) {
      askButtonBox = priceBox.next();
    } else {
      priceBox = $(".TradeStation--main");
      askButtonBox = $(".TradeStation--main");
    }
    let btnELe = askButtonBox.find("button");
    let btnParentELe = btnELe.parent();
    let btnGrandFatherEle = btnParentELe.parent();
    askButtonBox.css("max-width", "100%");
    let copyBtnBoxClassName = btnELe[0].className;
    let copyBtnClassName = btnParentELe[0].className;
    let buttonChildDiv = btnELe.children();
    let btnChildDivClassName = buttonChildDiv[0].className;

    let newBtnBoxEle = $(`
    <div class="${copyBtnBoxClassName} big-join-nft-room" style="margin-right: 10px; margin-bottom: 10px;">
    </div>
    `);

    let newBtnEle = $(`
      <button type="button" width="100%" class="${copyBtnClassName}" style="    background: none;
    border: none;
    width: 100%;
    align-items: center;
    justify-content: center;">
      <div class="${btnChildDivClassName}">
      <img  src="https://chat.web3messaging.online/assets/icon/newHouseChatIcon.svg" style="width: 30px;" alt="">
</div>
Join the conversation Thread on this NFT art piece
</button>
    `);

    newBtnEle.click(function () {
      createMessageBox(BUTTON_TYPE_ENUM.JOIN_ITEM_THREAD_ROOM);
    });

    newBtnBoxEle.append(newBtnEle);
    //
    priceBox.after(newBtnBoxEle);
    // btnGrandFatherEle.prepend(newBtnBoxEle);
    //
    // let itemChildBox = itemCollectionToolbarWrapperEle.children();
    // let btnEle = itemChildBox.find("button");
    // let btnClassName = btnEle[0].className;
    // let btnDivClassName = itemCollectionToolbarWrapperEle[0].className;
    // let itemChildBoxClassName = itemChildBox[0].className;
    //
    // let joinItemThreadRoomBtnDom = $(`
    //   <div class="join-item-Thread-room ${btnDivClassName}" style="min-width: 200px;">
    //     <div class="${itemChildBoxClassName}">
    //     <button class="${btnClassName}">
    //
    //       <img style="width: 24px;height: 24px; border-radius: 50%; margin-right: 10px;" src="https://chat.web3messaging.online/assets/icon/newHouseChatIcon.svg" alt="">
    //           Join NFT Thread
    //     </button>
    //     </div>
    //   </div>
    // `);
    // itemCollectionToolbarWrapperEle.before(joinItemThreadRoomBtnDom);
  }

  function createTalkToOwnerButton() {
    let talkToOwnerDom = $(".swapchat-talk-to-owner-btn");
    if (talkToOwnerDom.length > 0) {
      return;
    }
    let accountsDom = $("div[data-testid='ItemOwnerAccountLink']");
    let ownerUsernameDom = accountsDom.find("a");
    if (ownerUsernameDom.length > 0) {
      let ownerUserName = ownerUsernameDom[0].innerText;
      let accountParent = accountsDom.parent();
      if (accountParent.length > 0) {
        let talkToOwnerEle = $(`
          <div class="swapchat-talk-to-owner-btn">
            <img style="width: 30px;height: auto; margin-right: 10px;" src="https://chat.web3messaging.online/assets/icon/newHouseChatIcon.svg" alt="">
            Talk To Owner
          </div>
        `);
        talkToOwnerEle.click(function () {
          createMessageBox(BUTTON_TYPE_ENUM.PRIVATE_ROOM, ownerUserName);
        });
        accountParent.after(talkToOwnerEle);
      }
    }
  }

  function listenHistory() {
    // 当前path
    let path = location.pathname.split("/")[1];

    if (path === "collection") {
      // 准备创建基于collect的room按钮
      // createCollectionRoomButton();
      newCreateJoinNFTRoomButton();
    }
    if (path === "assets") {
      createJoinItemThreadRoom();
    }

    if ($("img[imagevariant='profile']") && $("img[imagevariant='profile']").length > 0) {
      createPrivateRoomButton();
    }
    if (
      $("div[data-testid='ItemOwnerAccountLink']") &&
      $("div[data-testid='ItemOwnerAccountLink']").length > 0
    ) {
      createTalkToOwnerButton();
    }
  }

  // 项目入口
  setInterval(() => {
    listenHistory();
  }, 500);
});
