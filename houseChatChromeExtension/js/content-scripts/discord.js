$().ready(() => {
  const host = location.host;
  const discord = "discord.com";
  const iframeSrc = "https://newbietown.com/chat/chatWebPage/";
  // const iframeSrc = 'http://localhost:3000/chat/chatWebPage/'

  if (host !== discord) {
    console.log("not discord");
    return;
  }


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
    let friendUserName = getFriendName();
    let selfUserName = getSelfName();
    if (selfUserName === friendUserName) return
    if (
        $(".discord-housechan-message-box") &&
        $(".discord-housechan-message-box").length
    ) {
      // 修改header字
      $(".discord-housechan-message-header").text(friendUserName)
      let src = `${iframeSrc}${selfUserName.replace('#', '@')}@@${friendUserName.replace('#', '@')}/discord`;
      $(".discord-housechan-message-header-iframe").remove()

      $(".discord-housechan-message-body").append(`
        <iframe class="discord-housechan-message-header-iframe" style='width: 100%; height: 86vh; border: 0;' src="${src}"></iframe>
      `)
      return;
    }
    // get friend username
    console.log('create private room')
    let src = `${iframeSrc}${selfUserName.replace('#', '@')}@@${friendUserName.replace('#', '@')}/discord`;
    let formEle = getEle("form[class^='form']")
    let children = formEle.children()[0]
    formEle.css('display', 'flex')
    $(children).css('width', '60%')
    let contentEle = getEle("div[class^='scrollerContent']")
    contentEle.css('width', '60%')

    let messageBoxEle = $(`
            <div class="discord-housechan-message-box">
            </div>
        `);

    let messageHeaderEle = $(`
            <div class="discord-housechan-message-header" id="discord-housechan-message-header" style="">
                    <span>waiting...</span>
            </div>
        `);
    let messageBodyEle = $(`
            <div class="discord-housechan-message-body">
                <iframe class="discord-housechan-message-header-iframe" style='width: 100%; height: 86vh; border: 0;' src="${src}"></iframe>
            </div>
        `);

    messageHeaderEle.click(function () {
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
    let messageBox = $(".discord-housechan-message-header")
    if (messageBox.length && messageBox.length > 0) {
      let item = messageBox[0].innerText
      if (item === friendName) return
    }
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
