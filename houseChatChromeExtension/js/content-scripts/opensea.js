$().ready(() => {
  const host = location.host;
  const body = $("body");
  const opensea = "opensea.io";
  const platform = "opensea";
  const iframeSrc = "https://chat.web3messaging.online";
  // const iframeSrc = "http://localhost:3000";

  if (host !== opensea) {
    return;
  }

  const BUTTON_TYPE_ENUM = {
    JOIN_ITEM_THREAD_ROOM: "item-thread-room",
    COLLECTION_ROOM: "collection-room",
    PRIVATE_ROOM: "private-room",
  };

  // 获取house用户信息
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
      let collectionEle = $(".CollectionLink--link");
      if (collectionEle.length > 0 && collectionEle[0].href) {
        let collArr = collectionEle[0].href.split("/");
        let slug = collArr[collArr.length - 1];
        let realContractAddress = "";
        let realTokenId = "";
        let pathNameArr = location.pathname.split("assets");
        let arr = pathNameArr[1].split("/");
        let linkPlatform = arr[1];
        if (linkPlatform !== "solana") {
          realContractAddress = arr[2];
          realTokenId = arr[3];
        } else  {
          let addressEle = $("a[href^='https://solscan.io/address/Token']")
          if (addressEle.length > 0 && addressEle[0].href) {
            let addressArr = addressEle[0].href.split('/')
            realContractAddress = addressArr[addressArr.length - 1]
          }
          realTokenId = arr[2]
        }
        src = `${iframeSrc}/chat/chatWebPage?platform=${platform}&itemTokenId=${realTokenId}&itemContractAddress=${realContractAddress}&fromPage=normal&linkPlatform=${linkPlatform}&collSlug=${slug}`;
      }
    }
    if (type === BUTTON_TYPE_ENUM.PRIVATE_ROOM) {
      if (ownerUserName) {
        src = `${iframeSrc}/chat/chatWebPage?platform=${platform}&openseaAccountUsername=${ownerUserName}&fromPage=normal`;
      } else {
        let pathname = location.pathname;
        let arrs = pathname.split("/");
        let accountOrAddress = arrs[1];
        if (
          (accountOrAddress.length === 42 &&
            accountOrAddress.indexOf("0x") !== -1) ||
          accountOrAddress.length === 44
        ) {
          // eth wallet address
          src = `${iframeSrc}/chat/chatWebPage?platform=${platform}&openseaAccountAddress=${accountOrAddress}&fromPage=normal`;
        } else {
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
    let shareButton = $("i[value='share']");
    let parents = shareButton.parents("button");

    let createRoomBtn = $(`
    <div class="opensea-create-private-room-btn-box">
                 <img style="width: 16px;height: 16px; margin-right: 10px;" src="https://chat.web3messaging.online/assets/icon/addJoinIcon.svg" alt="">
                 <div>
                Create a SwapChat 
</div>
                
          </div>
    `);
    let buttonDom = $(`
        <div class="opensea-create-private-room">
        </div>
        `);
    // buttonDom.append(miniBtn)
    buttonDom.append(createRoomBtn);

    createRoomBtn.click(function () {
      createMessageBox(BUTTON_TYPE_ENUM.PRIVATE_ROOM);
    });
    parents.parent().after(buttonDom);
  }

  function newCreateJoinNFTRoomButton() {
    let btnEle = $(".create-join-collection-room-button");
    if (btnEle.length && btnEle.length > 0) {
      return;
    }
    let likeButtonEle = $("button[data-testid='phoenix-watchlist-button']");
    if (likeButtonEle[0]) {
      let newBox = $(`
      <div class="create-join-collection-room-button" style="margin: 10px auto; overflow:hidden;">
        <div class="join-collection-room-button">
             <img style="width: 16px;height: auto; margin-right: 10px;" src="https://chat.web3messaging.online/assets/icon/addJoinIcon.svg" alt="">
            Join SwapChat NFT room
        </div>
      </div>
    `);
      newBox.click(function () {
        createMessageBox(BUTTON_TYPE_ENUM.COLLECTION_ROOM);
      });
      likeButtonEle.parent().append(newBox);
    }
  }

  // thread
  function createJoinItemThreadRoom() {
    const trySwapchatBtnsBox = $(
      `<div class="try-swapchat-btns-box" style="margin: 0;"></div>`
    );
    const headerBox = $(`
      <div style="height: 63px; width: 100%; margin: 0;" class="try-swapchat-header-box">
        <img style="width: 20px;height: 20px; margin-right: 10px;" src="https://chat.web3messaging.online/assets/icon/newHouseChatIcon.svg" alt="">
        <div>
          Try SwapChat 
        </div>
      </div>    
`);
    const trySwapchatBox = $(
      `<div class="item--counts try-swapchat-box"></div>`
    );
    if ($(".join-nft-room-button") && $(".join-nft-room-button").length > 0)
      return;
    let newBtnEle = $(`
      <div class="join-nft-room-button">
        <img  src="https://chat.web3messaging.online/assets/icon/newJoinThreadIcon.svg" style="width: 23px;height: 23px; margin-right: 10px;" alt="">
        <div> Join thread </div>
      </div>
    `);
    newBtnEle.click(function () {
      createMessageBox(BUTTON_TYPE_ENUM.JOIN_ITEM_THREAD_ROOM);
    });
    if (!$(".try-swapchat-box") || $(".try-swapchat-box").length <= 0) {
      trySwapchatBtnsBox.append(newBtnEle);
      trySwapchatBox.append(headerBox);
      trySwapchatBox.append(trySwapchatBtnsBox);
      $(".item--counts").after(trySwapchatBox);
    }
    if (
      $("div[data-testid='ItemOwnerAccountLink']") &&
      $("div[data-testid='ItemOwnerAccountLink']").length > 0
    ) {
      let talkToOwnerDom = $(".swapchat-talk-to-owner-btn");
      if (talkToOwnerDom.length > 0) {
        return;
      }
      let accountsDom = $("div[data-testid='ItemOwnerAccountLink']");
      let ownerUsernameDom = accountsDom.find("a");
      if (ownerUsernameDom.length > 0) {
        // 添加 talk to owner 按钮
        let ownerUserName = ownerUsernameDom[0].innerText;
        let talkToOwnerEle = $(`
      <div class="swapchat-talk-to-owner-btn">
        <img style="width: 23px;height: 23px; margin-right: 10px;" src="https://chat.web3messaging.online/assets/icon/newtrySwapchatOwnerIcon.svg" alt="">
        <div>Message owner</div>
      </div>
    `);
        talkToOwnerEle.click(function () {
          createMessageBox(BUTTON_TYPE_ENUM.PRIVATE_ROOM, ownerUserName);
        });
        // 添加header
        trySwapchatBtnsBox.append(talkToOwnerEle);
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

    if (
      $("img[imagevariant='profile']") &&
      $("img[imagevariant='profile']").length > 0
    ) {
      createPrivateRoomButton();
    }
  }

  // 项目入口
  setInterval(() => {
    listenHistory();
  }, 500);
});
