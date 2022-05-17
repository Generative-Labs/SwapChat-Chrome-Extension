$().ready(() => {
  const host = location.host;
  const body = $("body");
  const traitsniper = "traitsniper.com";
  // const platform = "traitsniper";
  const platform = "opensea";
  const iframeSrc = "https://chat.web3messaging.online";
  // const iframeSrc = "https://preapi.web3messaging.online:8000";
  // const iframeSrc = "http://localhost:3000";

  if (host.indexOf(traitsniper) === -1) {
    console.log("不是traitsniper，该插件无效");
    return;
  }
  console.log("插件生效");

  async function getUserAddress() {
    let detailBox = $("div[class^='detail_container']");
    if (detailBox.length <= 0) return false;
    let toOpenseaADom = detailBox.find("a");
    if (toOpenseaADom.length <= 0) return false;
    let href = "";
    for (let i = 0; i < toOpenseaADom.length; i++) {
      if (toOpenseaADom[i].href.indexOf("opensea") !== -1) {
        href = toOpenseaADom[i].href;
      }
    }
    if (!href) return false;
    let nftPathname = href.split("?")[0];
    let pathNameArr = nftPathname.split("/");
    let realTokenId = pathNameArr[pathNameArr.length - 1];
    let realContractAddress = pathNameArr[pathNameArr.length - 2];
    let assets = await fetch(
      `https://api.opensea.io/api/v1/asset/${realContractAddress}/${realTokenId}/`
    ).then((res) => res.json());

    if (!assets.top_ownerships) return false;

    // openOwnersModal(assets.top_ownerships);
    // 创建联系人modal
    if (assets.top_ownerships && assets.top_ownerships.length > 1) {
      // 多个owner
      openOwnersModal(assets.top_ownerships);
    } else {
      // 单个owner
      let address = assets.top_ownerships[0].owner.address;
      let src = `${iframeSrc}/chat/chatWebPage?platform=${platform}&openseaAccountAddress=${address}&fromPage=normal`;
      createMessageBox(src);
      return false;
    }
  }

  function getShortAddressByAddress(address) {
    let strLength = address.length;
    return (
      address.substring(0, 5) +
      "..." +
      address.substring(strLength - 4, strLength)
    );
  }

  function getOwnerUserDomStr(owner) {
    let username = "Unnamed";
    if (owner.owner.user && owner.owner.user.username) {
      username = owner.owner.user.username;
    }
    let shortAddress = getShortAddressByAddress(owner.owner.address);
    let dom = $(`
     <div class="owner-user-info">
        <div class="owner-user-avatar">
            <img src="${owner.owner.profile_img_url}" alt="">
        </div>
        <div class="owner-username-box">
            <div class="owner-user-name">${username}</div>
            <div class="owner-address">${shortAddress}</div>
        </div>
     </div>`);

    return dom;
  }

  function bidOwnerChat(owner) {
    let dom = $(`
      <button>
        <div style="display: inline-block; width: 30px; height: 30px; margin-right: 10px;">
            <img style="width: 100%; margin-right: 10px; filter: drop-shadow(0px 4px 5px rgba(36, 36, 36, 0.45));" src="https://chat.web3messaging.online/assets/icon/newHouseChatIcon.svg" alt="">
        </div>
        Bid with SwapChat 
      </button>
    `);
    dom.click(function () {
      let src = `${iframeSrc}/chat/chatWebPage?platform=${platform}&openseaAccountAddress=${owner.owner.address}&fromPage=normal`;
      $(".opensea-owners-modal").remove();
      createMessageBox(src);
      return false
    });
    return dom;
  }

  function openOwnersModal(owners) {
    let ulDom = $(`<ul></ul>`);
    for (let i = 0; i < owners.length; i++) {
      let owner = owners[i];
      let liDom = $(`<li></li>`);
      liDom.append(getOwnerUserDomStr(owner));
      liDom.append(bidOwnerChat(owner));
      ulDom.append(liDom);
    }
    let closeIcon = $(`<div><img class="close-icon" src="https://d97ch61yqe5j6.cloudfront.net/frontend/closeIcon.png" alt=""></div>`)
    closeIcon.click(function () {
      $(".opensea-owners-modal").remove();
      return false
    })

    let ownersListDom = $(`<div class="owners-list"></div>`);
    let ownerListTitle = $(`<div class="owners-list-title">
                <div>Owned by</div>
                </div>`);
    let ownerItemDom = $(`<div class="owners-list-items"></div>`);
    ownerListTitle.append(closeIcon)
    ownerItemDom.append(ulDom);
    ownersListDom.append(ownerListTitle);
    ownersListDom.append(ownerItemDom);
    let dialog = $(`<div class="opensea-owners-modal"></div>`);
    dialog.append(ownersListDom);
    body.append(dialog);
  }

  function createMessageBox(src = "") {
    if (
      $(".traitsniper-housechan-message-box") &&
      $(".traitsniper-housechan-message-box").length
    ) {
      // 修改header字
      // let src = `${iframeSrc}/chat/webChat/${friendUserName.replace('#', '@')}?platform=${platform}`
      $(".traitsniper-housechan-message-header-iframe").remove();
      $(".traitsniper-housechan-message-body").append(`
         <iframe class="traitsniper-housechan-message-header-iframe" style='width: 100%; height: 600px; border: 0;' src="${src}"></iframe>
      `);
      return;
    }

    let messageBoxEle = $(`
            <div class="traitsniper-housechan-message-box" id="housechan-message-box">
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
            <div class="traitsniper-housechan-message-header">
            </div>
        `);
    let messageBodyEle = $(`
            <div class="traitsniper-housechan-message-body">
                <iframe class="traitsniper-housechan-message-header-iframe" style='width: 100%; height: 600px; border: 0;' src="${src}"></iframe>
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
      $(".traitsniper-housechan-message-header-iframe").remove();
      let src = `${iframeSrc}/chat/auth?platform=${platform}&fromPage=normal`;
      $(".traitsniper-housechan-message-body").append(`
      <iframe class="traitsniper-housechan-message-header-iframe" style='width: 100%; height: 600px; border: 0;' src="${src}"></iframe>
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
    if ($(".traitsniper-chat-room").length > 0) {
      return false;
    }
    let nftDetailInfoBox = $("div[class^='detail_info']");
    let buttonDom = $(`
        <button
        class="traitsniper-chat-room"
         style=" 
         height: 40px; 
         min-width: 44px;
         border-radius: 3px;
         padding: 0 20px;
         display: flex; 
         align-items: center;
         font-family: sans-serif;
         background: #605DEC;
         color: #ffffff;
         justify-content: center;
         "
         >
         <div style="display: inline-block; width: 30px; height: 30px; margin-right: 10px;">
         <img style="width: 100%; margin-right: 10px; filter: drop-shadow(0px 4px 5px rgba(36, 36, 36, 0.45));" src="https://chat.web3messaging.online/assets/icon/newHouseChatIcon.svg" alt="">
         </div>
            Bid with SwapChat        
        </button>
        `);
    buttonDom.click(function () {
      getUserAddress();
    });

    nftDetailInfoBox.append(buttonDom);
  }

  function getNftDetailDom() {
    let detailBox = $("div[class^='detail_container']");
    return detailBox.length > 0;
  }

  // 项目入口
  setInterval(() => {
    //
    if (getNftDetailDom()) {
      createPrivateRoomButton();
    }
  }, 500);
});
