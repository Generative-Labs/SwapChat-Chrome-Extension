$().ready(() => {
  const host = location.host;
  const apiHost = "https://sh.delicious.work:5000";
  const body = $("#react-root");
  const twitter = "twitter.com";
  const iframeSrc = "https://sh.delicious.work:5000/chatWebPage/";
  // const iframeSrc = 'http://localhost:3000/chatWebPage/'

  if (host !== twitter) {
    console.log("不是twitter，该插件无效");
    return;
  }

  function askPrice() {
    if (
      $(".twitter-housechan-message-box") &&
      $(".twitter-housechan-message-box").length
    ) {
      return;
    }
    console.log("ready to show message");
    // get friend username
    let friendUserName = location.pathname.split("/")[1];
    // get self username
    let userDom = $("a[data-testid='AppTabBar_Profile_Link']");
    let selfUserName = "";
    if (userDom[0]) {
      let hrefValue = userDom[0].href;
      console.log(hrefValue, "hrefValue");
      if (hrefValue && hrefValue.split("/")) {
        let hrefArr = hrefValue.split("/");
        console.log(hrefArr, "hrefArr");
        selfUserName = hrefArr[hrefArr.length - 1];
      }
    }
    // 修改iframe src
    let src = `${iframeSrc}${selfUserName}@${friendUserName}`;
    console.log(src, "src");

    // 获取Twitter原始message dom 向左移动
    let messageDom = $("div[data-testid='DMDrawer']");
    messageDom.css("transform", "translateX(-500px)");
    let messageBoxEle = $(`
            <div class="twitter-housechan-message-box" id="housechan-message-box">
            </div>
        `);
    let messageHeaderEle = $(`
            <div class="twitter-housechan-message-header" style="">
                    <span>waiting...</span>
            </div>
        `);
    let messageBodyEle = $(`
            <div class="twitter-housechan-message-body">
                <iframe class="twitter-housechan-message-header-iframe" style='width: 100%; height: 478px; border: 0;' src="${src}"></iframe>
            </div>
        `);

    messageHeaderEle.click(function () {
      console.log("messageHeaderEle.click");
      messageBodyEle.slideToggle();
    });
    messageHeaderEle.text(friendUserName);
    $(".twitter-housechan-message-header-iframe").attr("src", src);
    messageBoxEle.append(messageHeaderEle);
    messageBoxEle.append(messageBodyEle);
    body.append(messageBoxEle);
  }

  async function joinHouseChan(selfUserName) {
    fetch(`${apiHost}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        platform: "twitter",
        user_name: selfUserName,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          return Promise.reject(response.json());
        }
      })
      .then((res) => {
        if (res.data) {
          $(".join-house-chan-button").css("display", "none");
          addCheckHouseChanButton(selfUserName);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function addHouseChanButton(selfUserName) {
    const userNameEle = $("div[data-testid='UserName']");
    let friendName = location.pathname.split("/")[1];
    let id = `create-${friendName}-room`;
    let className = `create-private-room`;
    let createPrivateButtonEle = $(`#${id}`);
    if (createPrivateButtonEle && createPrivateButtonEle.length)return
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
         "
         >
               <img style="width: 30px;height: 30px; border-radius: 50%; margin-right: 10px;" src="https://d97ch61yqe5j6.cloudfront.net/frontend/icon-60@2x.png" alt="">
            Create Private Room        
        </div>
        `);
    buttonDom.click(function () {
      askPrice();
    });
    userNameEle.append(buttonDom);
  }

  function addJoinHouseChanButton(selfUserName) {
    let commonMenuBoxEle = $("div[data-testid='AppTabBar_More_Menu']");
    let parent = commonMenuBoxEle.parent();
    let commMenuChild = commonMenuBoxEle.children();
    let graSonEle = $(commMenuChild).children();
    let bro = $(`
                    <div aria-expanded="false" aria-haspopup="menu" aria-label="Join House Chan" role="button" class="${commonMenuBoxEle.className} join-house-chan-button" tabindex="1">
                        <div class="${commMenuChild[0].className}">
                            <div class="${graSonEle[0].className}">
                               <img style="width: 26px;height: 26px; border-radius: 50%;" src="https://d97ch61yqe5j6.cloudfront.net/frontend/icon-40@2x.png" alt="">
                            </div>
                            <div dir="auto" class="${graSonEle[1].className}">
                                <span>Join House Chan</span>
                            </div>
                        </div>
                    </div>
                `);
    bro.hover(function () {
      bro.css("border-radius", "999px");
      bro.css("background", "rgba(15, 20, 25, 0.1)");
      bro.css("cursor", "pointer");
    });

    bro.mousedown(function () {
      bro.css("cursor", "pointer");
      bro.css("border-radius", "999px");
      bro.css("background", "rgba(15, 20, 25, 0.2)");
    });

    bro.mouseup(function () {
      bro.css("border-radius", "999px");
      bro.css("background", "rgba(15, 20, 25, 0.1)");
      bro.css("cursor", "pointer");
    });

    bro.mouseleave(function () {
      bro.css("border-radius", "999px");
      bro.css("background", "#fff");
      bro.css("cursor", "default");
    });
    parent.append(bro);
    bro.click(function () {
      joinHouseChan(selfUserName).then((r) => {
        console.log(r);
      });
    });
  }

  function addCheckHouseChanButton(selfUserName) {
    if ($(".check-house-chan-button") && $(".check-house-chan-button").length) return
    let commonMenuBoxEle = $("div[data-testid='AppTabBar_More_Menu']");
    let parent = commonMenuBoxEle.parent();
    let commMenuChild = commonMenuBoxEle.children();
    let graSonEle = $(commMenuChild).children();
    let bro = $(`
                    <div aria-expanded="false" aria-haspopup="menu" aria-label="Check House Chan" role="button" class="${commonMenuBoxEle.className} check-house-chan-button" tabindex="1">
                        <div class="${commMenuChild[0].className}">
                            <div class="${graSonEle[0].className}">
                               <img style="width: 26px;height: 26px; border-radius: 50%;" src="https://d97ch61yqe5j6.cloudfront.net/frontend/icon-40@2x.png" alt="">
                            </div>
                            <div dir="auto" class="${graSonEle[1].className}">
                                <span>check House Chan</span>
                            </div>
                        </div>
                    </div>
                `);
    bro.hover(function () {
      bro.css("border-radius", "999px");
      bro.css("background", "rgba(15, 20, 25, 0.1)");
      bro.css("cursor", "pointer");
    });

    bro.mousedown(function () {
      bro.css("cursor", "pointer");
      bro.css("border-radius", "999px");
      bro.css("background", "rgba(15, 20, 25, 0.2)");
    });

    bro.mouseup(function () {
      bro.css("border-radius", "999px");
      bro.css("background", "rgba(15, 20, 25, 0.1)");
      bro.css("cursor", "pointer");
    });

    bro.mouseleave(function () {
      bro.css("border-radius", "999px");
      bro.css("background", "#fff");
      bro.css("cursor", "default");
    });
    parent.append(bro);
    bro.click(function () {
      addHouseChanButton(selfUserName);
    });
  }

  // 添加一个初始化的messagebox

  function initShowButton(selfUserName) {
    fetch(`${apiHost}/info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        platform: "twitter",
        user_name: selfUserName,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          return Promise.reject(response.json());
        }
      })
      .then((res) => {
        if (!res.data) {
          // 该用户还咩有注册house
          addJoinHouseChanButton(selfUserName);
        } else {
          addCheckHouseChanButton(selfUserName);
        }
      })
      .catch((e) => {
        console.log(e, "e");
      });
  }

  function listenHistory() {
    // 当前path
    let path = location.pathname.split("/")[1]
    // 缓存上次path
    chrome.storage.sync.get("prevHost", function (script) {
      if (script.prevHost && script.prevHost === path) {
      } else {
        // 同步最新path 删除message
        if (
          $(".twitter-housechan-message-box") &&
          $(".twitter-housechan-message-box").length
        ) {
          $(".twitter-housechan-message-box").remove();
          let messageDom = $("div[data-testid='DMDrawer']");
          messageDom.css("transform", "");
        }
        chrome.storage.sync.set({ prevHost: path });
      }
    });
  }

  // 项目入口
  let timer = setInterval(() => {
    let userBoxDom = $("div[data-testid='UserName']");
    let selfDom = $("a[data-testid='AppTabBar_Profile_Link']");
    let selfUserName = "";
    if (selfDom[0]) {
      let hrefValue = selfDom[0].href;
      if (hrefValue && hrefValue.split("/")) {
        let hrefArr = hrefValue.split("/");
        selfUserName = hrefArr[hrefArr.length - 1];
      }
    }
    if (selfUserName) {
      addHouseChanButton(selfUserName);
      listenHistory();
    }
  }, 300);
});
