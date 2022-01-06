$().ready(() => {
  const host = location.host;
  const discord = "discord.com";
  const iframeSrc = "https://newbietown.com/chatWebPage/";
  // const iframeSrc = 'http://localhost:3000/chatWebPage/'

  if (host !== discord) {
    console.log("discord，该插件无效");
    return;
  }
  console.log("ready discord =========");


  function getEle(reg) {
    let element = $(reg);
    if (element.length > 0) {
      return element;
    }
    return element.length;
  }

  function getSelfName() {
    let selfDom = $("div[class^='nameTag']");
    let selfUserName = "";
    if (selfDom[0]) {
      let userName = selfDom[0].innerText;
      selfUserName = userName.replace("\n", "");
    }
    return selfUserName;
  }


  function getFriendName() {
    let friendEle = getEle("div[class^='headerTop-']");
    let friendName = ''
    if (friendEle.length > 0) {
      friendName = friendEle[0].innerText 
    }
    return  friendName
  }

  function createPrivateRoom() {
    getFriendName();
    if (
        $(".discord-housechan-message-box") &&
        $(".discord-housechan-message-box").length
    ) {
      return;
    }
    // get friend username
    let friendUserName = getFriendName();
    let selfUserName = getSelfName();
    if (selfUserName === friendUserName) return
    console.log('create private room')
    let src = `${iframeSrc}${selfUserName}@${friendUserName}`;
    let formEle = getEle("form[class^='form']")
    let children = formEle.children()[0]
    formEle.css('display', 'flex')
    $(children).css('width', '80%')

    let messageBoxEle = $(`
            <div class="discord-housechan-message-box">
            </div>
        `);

    let messageHeaderEle = $(`
            <div class="discord-housechan-message-header" style="">
                    <span>waiting...</span>
            </div>
        `);
    let messageBodyEle = $(`
            <div class="discord-housechan-message-body">
                <iframe class="discord-housechan-message-header-iframe" style='width: 100%; height: 478px; border: 0;' src="${src}"></iframe>
            </div>
        `);

    messageHeaderEle.click(function () {
      console.log("messageHeaderEle.click");
      messageBodyEle.slideToggle();
    });
    messageHeaderEle.text(friendUserName);
    messageBoxEle.append(messageHeaderEle);
    messageBoxEle.append(messageBodyEle);
    formEle.append(messageBoxEle)

  }

  function addHouseChanButton(headerEle) {
    let friendName = getFriendName()
    let selfName = getSelfName()
    if ($(".discord-housechan-icon") && $(".discord-housechan-icon").length) return
    if (friendName === selfName) return
    console.log('ready to add icon')
    if (headerEle.length > 0) {
      let houseChanButton = $(`<img class="discord-housechan-icon" src="https://d97ch61yqe5j6.cloudfront.net/frontend/icon-60@2x.png" alt="">`);
      // headerDom.append(houseChanButton)
      headerEle.children().append(houseChanButton);


      houseChanButton.click(function () {
        createPrivateRoom()

      });
    }
  }

  function listenHistory(selfUserName) {
    // 当前path
    let path = location.pathname;
    // 缓存上次path
    chrome.storage.sync.get("discordPrevHost", function (script) {
      if (script.discordPrevHost && script.discordPrevHost === path) {
      } else {
        // 同步最新path 删除message
        chrome.storage.sync.set({ discordPrevHost: path });
      }
    });
  }

  // 项目入口
  let timer = setInterval(() => {
    let selfEle = getEle("div[class^='nameTag']");
    let friendHeaderEle = getEle("div[class^='headerNormal']");
    let friendEle = getEle("div[class^='userPopout-']");
    let fromEle = getEle("form[class^='form']")
    let friendHeaderTopEle = getEle("div[class^='headerTop-']")
    console.log('sss')
    if (selfEle && friendHeaderEle && fromEle && friendEle) {
      addHouseChanButton(friendHeaderEle);
    }

    // addHouseChanButton()
    // if (addHouseChanButton()) {
    //   clearInterval(timer)
    //   console.log(addHouseChanButton())
    // }
    // if (getFriendName()) {
    // listenHistory(getSelfName());
    // }/
  }, 300);
  //
  // setInterval(() => {
  //   if (getSelfName()) {
  //     console.log(getSelfName());
  //   }
  // }, 300);
});
