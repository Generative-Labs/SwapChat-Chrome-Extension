$().ready(() => {
  const host = location.host;
  const discord = "discord.com";
  const platform = 'discord'
  const iframeSrc = "https://web3messaging.online";
  // const iframeSrc = 'http://localhost:3000'

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

  function getSelfNameByDom() {
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
    let selfUserName = getSelfNameByDom();
    if (selfUserName === friendUserName) return
    if (
        $(".discord-housechan-message-box") &&
        $(".discord-housechan-message-box").length
    ) {
      // 修改header字
      // let src = `${iframeSrc}/chat/webChat/${friendUserName.replace('#', '@')}?platform=${platform}`
      let src = `${iframeSrc}/chat/chatWebPage?userHash=${selfUserName.replace('#', '@')}@@${friendUserName.replace('#', '@')}&platform=${platform}`;
      $(".discord-housechan-message-header-iframe").remove()
      $(".discord-housechan-message-body").append(`
        <iframe class="discord-housechan-message-header-iframe" style='width: 100%; height: 86vh; border: 0;' src="${src}"></iframe>
      `)
            return;
        }
        // get friend username
        console.log('create private room')
        // let src = `${iframeSrc}/chat/webChat/${friendUserName.replace('#', '@')}?platform=${platform}`
        let src = `${iframeSrc}/chat/chatWebPage?userHash=${selfUserName.replace('#', '@')}@@${friendUserName.replace('#', '@')}&platform=${platform}`;
        let formEle = getEle("form[class^='form']")
        let children = formEle.children()[0]
        formEle.css('display', 'flex')
        $(children).css('width', '60%')
        let contentEle = getEle("div[class^='scrollerContent']")
        contentEle.css('width', '60%')

        let messageBoxEle = $(`
            <div class="discord-housechan-message-box"></div>
        `);
        let homeIconEle = $(
            '<img class="home-icon" src="https://d97ch61yqe5j6.cloudfront.net/frontend/newHomeHeaderIcon.png" alt="">'
        );
        let slideToggleIconELe = $(
            '<img class="slide-toggle-icon" src="https://d97ch61yqe5j6.cloudfront.net/frontend/headerDown.png" alt="">'
        );
        let goHomeIconEle = $(
            '<img class="go-home-icon" src="https://d97ch61yqe5j6.cloudfront.net/frontend/newRefreshIconx3.png" alt="">'
        );

        let messageHeaderEle = $(`
            <div class="discord-housechan-message-header" id="discord-housechan-message-header" style=""></div>
        `);
        let messageBodyEle = $(`
            <div class="discord-housechan-message-body">
                <iframe class="discord-housechan-message-header-iframe" style='width: 100%; height: 86vh; border: 0;' src="${src}"></iframe>
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
            $(".discord-housechan-message-header-iframe").remove()
            let src = `${iframeSrc}/chat/auth?platform=${platform}&fromPage=normal`;
            $(".discord-housechan-message-body").append(`
        <iframe class="discord-housechan-message-header-iframe" style='width: 100%; height: 86vh; border: 0;' src="${src}"></iframe>
      `)
            return false;
        });

        messageHeaderEle.append(homeIconEle);
        messageHeaderEle.append(goHomeIconEle);
        messageHeaderEle.append(slideToggleIconELe);
        messageBoxEle.append(messageHeaderEle);
        messageBoxEle.append(messageBodyEle);
        formEle.append(messageBoxEle)
    }

    function addHouseChanButton(headerEle) {
        let friendName = getFriendName()
        let selfName = getSelfNameByDom()
        let messageBox = $(".discord-housechan-message-header")
        if (messageBox.length && messageBox.length > 0) {
            let item = messageBox[0].innerText
            if (item === friendName) return
        }
        if ($(".discord-housechan-icon") && $(".discord-housechan-icon").length) return
        if (friendName === selfName) return
        console.log('ready to add icon')
        if (headerEle.length > 0) {
            let houseChanButton = $(`<img class="discord-housechan-icon" src="https://d97ch61yqe5j6.cloudfront.net/frontend/newHouseChatIcon.svg" alt="">`);
            // headerDom.append(houseChanButton)
            headerEle.children().append(houseChanButton);
            houseChanButton.click(function () {
                createPrivateRoom()
            });
        }
    }


    // 项目入口
    setInterval(() => {
        let selfEle = getEle("div[class^='nameTag']");
        let friendHeaderEle = getEle("div[class^='headerNormal']");
        let friendEle = getEle("div[class^='userPopout-']");
        let fromEle = getEle("form[class^='form']")
        let friendHeaderTopEle = getEle("div[class^='headerTop-']")
        if (selfEle && friendHeaderEle && fromEle && friendEle) {
            addHouseChanButton(friendHeaderEle);
        }
    }, 1000);
});
