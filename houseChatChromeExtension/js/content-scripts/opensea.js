$().ready(() => {
  const host = location.host;
  const body = $("body");
  console.log(body);
  const opensea = "opensea.io";
  const platform = "opensea";
  const iframeSrc = "https://chat.web3messaging.online";
  // const iframeSrc = "http://localhost:3000";
  const apiHost = "https://chat.web3messaging.online";

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
      src = `${iframeSrc}/chat/chatWebPage?platform=${platform}&collectionName=${collectionName}&fromPage=normal`;
    }
    if (type === BUTTON_TYPE_ENUM.JOIN_ITEM_THREAD_ROOM) {
      // src = `${iframeSrc}/chat/chatWebPage?platform=${platform}&collectionName=${collectionName}`;
      console.log("创建thread");
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
      let realAddress = "";
      let addressBtn = $(".AccountHeader--address");
      let innerAddress = addressBtn[0].innerText;
      let simpleAddress = innerAddress.split("...");
      if (addressBtn) {
        addressBtn.click()
        let t = document.createElement("input");
        document.body.insertBefore(t, document.body.childNodes[0]);
        t.focus();
        document.execCommand("paste");
        realAddress = t.value; //this is your clipboard data
        document.body.removeChild(t);
      }
      // if (nextDataDom && nextDataDom.innerText) {
      //   if (JSON.parse(nextDataDom.innerText)) {
      //     let nextData = JSON.parse(nextDataDom.innerText);
      //     console.log(nextData, "nextData");
      //
      //
      //
      //
      //     let ethAddress = nextData?.props?.ssrData?.account?.address;
      //     if (ethAddress) {
      //       if (
      //           ethAddress.indexOf(simpleAddress[0]) !== -1 &&
      //           ethAddress.indexOf(simpleAddress[1]) !== -1
      //       ) {
      //         realAddress = ethAddress;
      //       }
      //     }
      //
      //     console.log(JSON.stringify(nextData).indexOf(simpleAddress[0]), 'start')
      //     console.log(JSON.stringify(nextData).indexOf(simpleAddress[1]), 'end')
      //
      //
      //
      //   }
      // }

      // if (!realAddress) {
      //   let scripts = document.getElementsByTagName("script");
      //   let address = "";
      //   for (let i = 0; i < scripts.length; i++) {
      //     let currentScript = scripts[i];
      //     if (currentScript.innerText.indexOf("__wired__") !== -1) {
      //       if (
      //         currentScript.innerText.indexOf(simpleAddress[0]) !== -1 &&
      //         currentScript.innerText.indexOf(simpleAddress[1]) !== -1
      //       ) {
      //         let start = currentScript.innerText.indexOf(simpleAddress[0]);
      //         let end = currentScript.innerText.indexOf(simpleAddress[1]);
      //         address = currentScript.innerText.substring(start, end);
      //       }
      //     }
      //   }
      //   realAddress = address + simpleAddress[1];
      // }
      if (realAddress && realAddress.indexOf(simpleAddress[0]) !== -1 && realAddress.indexOf(simpleAddress[1]) !== -1) {
        src = `${iframeSrc}/chat/chatWebPage?platform=${platform}&openseaAccountAddress=${realAddress}&fromPage=normal`;
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

    let publicBoxEle = $("div[class^='AccountLinksBarreact__DivContainer']");
    let btnBoxDom = publicBoxEle.children()[1];
    let btnBoxELe = $(btnBoxDom).children();
    let btnBoxClassName = btnBoxELe[0].className;
    let btnClassName = btnBoxELe.children()[0].className;
    let btnDom = btnBoxELe.find('button')
    let brnDomClass = btnDom[0].className
    let buttonDom = $(`
        <div
        class="opensea-create-private-room ${btnBoxClassName}"
         style="
         margin-right: 10px;
         "
         >
           <div class="${btnClassName}">
             <button type="button" class="${brnDomClass}" style="
             background: #fff;
            display: flex;
            align-items: center;
        ">
                 <img style="width: 28px;height: 28px; margin-right: 10px;" src="https://chat.web3messaging.online/assets/icon/newHouseChatIcon.svg" alt="">
                Create a SwapChat
             </button>
          </div>
        </div>
        `);

    buttonDom.click(function () {
      createMessageBox(BUTTON_TYPE_ENUM.PRIVATE_ROOM);
    });

    $(btnBoxDom).prepend(buttonDom);
  }

  function newCreateJoinNFTRoomButton() {
    let btnEle = $(".create-join-collection-room-button");
    if (btnEle.length && btnEle.length > 0) {
      return;
    }
    let copyBoxEle = $("div[class*='InfoContainerreact__InfoContainer']");
    let copyBoxParentEle = copyBoxEle.parent();
    console.log(copyBoxEle, "copyBoxEle");
    console.log(copyBoxEle.className, "copyBoxEle");
    if (copyBoxEle[0]) {

      let copyBoxClassName = copyBoxEle[0].className;

      let newBox = $(`
      <div class="${copyBoxClassName} create-join-collection-room-button" style="width: 100%; margin: 10px auto; overflow:hidden;">
        </div>
    `);
      let newbtnBox = $(`
      <div class="join-collection-room-button">
        <div class="join-collection-room-button-test-box" style="
    width: 100%;
    height: 60px;
    background: #fff;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    ">
             <img style="width: 30px;height: auto; margin-right: 10px;" src="https://chat.web3messaging.online/assets/icon/newHouseChatIcon.svg" alt="">
            Join NFT Room
        </div>
       </div>
    `);
      newbtnBox.click(function () {
        createMessageBox(BUTTON_TYPE_ENUM.COLLECTION_ROOM);
      });
      newBox.append(newbtnBox);
      copyBoxParentEle.append(newBox);
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
    console.log(buttonChildDiv, "buttonChildDiv");

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
