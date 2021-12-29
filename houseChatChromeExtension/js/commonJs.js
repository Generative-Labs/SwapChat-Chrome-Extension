let username = location.pathname
console.log(username, 'username')
console.log($, '$')


$().ready(() => {
    const host = location.host
    const twitter = 'twitter.com'
    if (host !== twitter) {
        console.log('不是twitter，该插件无效')
        return
    }

    function userSpanClick() {
        chrome.storage.sync.get('usernames', function (init) {
            console.log(init.usernames, 'init.usernames')
            if (init.usernames) {
                let usernames = init.usernames
                console.log($('.twitter-housechan-message-header'), "$('.twitter-housechan-message-header')")
                console.log(usernames, 'usernames')
                console.log(usernames[usernames.length - 1], 'usernames[usernames.length - 1]')
                console.log($('.twitter-housechan-message-header'), '$(\'.twitter-housechan-message-header\')')

                $('.twitter-housechan-message-header').text(usernames[usernames.length - 1])
                // $('.twitter-housechan-message-header-iframe').src
            }

        })
    }

    function init() {
        // let usernames = []
        // chrome.storage.sync.get('usernames', function (init) {
        //     console.log(init.usernames, 'init.usernames')
        //     if (init.usernames) {
        //         usernames = init.usernames
        //     }
        // })
        // let userNameSpanEle = userNameEle.find('span')
        // let userspan = userNameSpanEle[userNameSpanEle.length - 1]
        // console.log(userspan, 'userspan')
        // $(userspan).click(function () {
        //     return userSpanClick()
        //
        // })
        // console.log(userNameSpanEle, 'userNameSpanEle')
        //
        //
        // let href = userEle[0].href
        // let arr = href.split('/')
        // // let span = userEle.find("span")
        // // let userName = span[2].innerText
        // let userName = arr[arr.length - 1]
        // messageEle.css("transform", "translateX(-500px)")
        let body = $('#react-root')
        let messageBoxEle = $(`
            <div class="twitter-housechan-message-box" id="housechan-message-box">
            </div>
        `)
        let messageHeaderEle= $(`
            <div class="twitter-housechan-message-header" style="">
                    <span>waiting...</span>
            </div>
        `)
        let messageBodyEle = $(`
            <div class="twitter-housechan-message-body">
                <iframe class="twitter-housechan-message-header-iframe" style='width: 100%; height: 812px; border: 0;' src='https://sh.delicious.work:5000/chatWebPage/zhaowei62583836@HousechanBin'></iframe>
            </div>
        `)
        // messageBox.css('width', '375px')
        // messageBox.css('background', 'red')
        // messageBox.css('position', 'fixed')
        // // messageBox.css('bottom','-760px')
        // messageBox.css('bottom', '0')
        // messageBox.css('right', '5px')
        // messageBox.css('min-height', '50px')
        // messageBox.css('transition', 'all 1s')
        // messageHeader.css('width', '100%')
        // messageHeader.css('height', '50px')
        // messageHeader.css('line-height', '50px')
        // messageHeader.css('font-size', '20px')
        // messageHeader.css('text-align', 'center')
        // messageHeader.css('border', '1px solid')
        // messageHeader.css('border-bottom', '0')
        //

        messageBoxEle.append(messageHeaderEle)
        messageBoxEle.append(messageBodyEle)
        body.append(messageBoxEle)




        //

        // if (welcomeTextEle) {
        //     clearInterval(getEleTimer)
        //     console.log(welcomeTextEle, 'welcomeTextEle')
        // }
        //
        // //
        // let dom = document.getElementById("react-root")
        // let body = $('#react-root')
        // let root = $('#root')
        // let welcomeText = $('.welcomeText')
        // console.log(welcomeText, 'welcomeText')
        // console.log(root, 'root')
        // console.log(body, 'body')
        // let tabList =$("div[data-testid='DMDrawer']")
        // console.log(tabList, 'tabList')
        // console.log(dom, 'dom')
        // if (dom) {
        //     let div =document.createElement("div");
        //     let domStr = "<iframe style='width: 100%; height: 100%;' src='https://channels.housechan.com/creator/bx4371'></iframe>"
        //     div.id="div-id";
        //     div.style.width="375px";
        //     div.style.height="812px"
        //     div.style.position="fixed"
        //     div.style.top="0"
        //     div.style.right="0"
        //     div.innerHTML=domStr
        //     dom.appendChild(div);
        //     // let domStr = "<div style='position: fixed; top: 0; right: 0;  width: 375px; height: 812px;'>" +
        //     //     "ahsudiahsudis" +
        //     //     "<iframe style='width: 100%; height: 100%;' src='https://m.haimati.cn/#/'></iframe>" +
        //     //     "</div>"
        //     // dom.innerHTML =domStr
        // }

    }

    function askPrice() {
        // 获取Twitter原始message dom 向左移动
        let messageDom = $("div[data-testid='DMDrawer']")
        messageDom.css("transform", "translateX(-500px)")
        // show house chan message box
        let messageBoxEle = $('.twitter-housechan-message-box')
        messageBoxEle.css('display', 'block')
        // get friend username
        let pathArr =location.pathname.split('/')
        let friendUserName = pathArr[pathArr.length - 1]
        // show friend username to message header
        let messageHeaderEle = $('.twitter-housechan-message-header')
        let messageBodyEle = $('.twitter-housechan-message-body')

        messageHeaderEle.text(friendUserName)
        messageHeaderEle.click(function () {
            console.log('messageHeaderEle.click')
            // messageBox.css('bottom', '0')
            messageBodyEle.slideToggle()

        })
        // get self username
        let userDom = $("a[data-testid='AppTabBar_Profile_Link']")
        let selfUserName = ''
        if (userDom[0]) {
            let hrefValue = userDom[0].href
            console.log(hrefValue, 'hrefValue')
            if (hrefValue && hrefValue.split('/')) {
                let hrefArr = hrefValue.split('/')
                console.log(hrefArr, 'hrefArr')
                selfUserName = hrefArr[hrefArr.length - 1]
            }
        }
        // show


        console.log(selfUserName, 'selfUserName')


    }

    function addHouseChanButton(userNameEle) {
        userNameEle.css('position', 'relative')
        let buttonDom = $(`
        <div style="position: absolute;
         top: 0;
         right: 0; 
         height: 44px; 
         min-width: 44px;
         border: 1px solid rgb(207, 217, 222);
         border-radius: 999px;
         border-radius: 999px;
         padding: 0 10px;
         display: flex; 
         align-items: center;
         "
         >
               <img style="width: 30px;height: 30px; border-radius: 50%;" src="https://up.enterdesk.com/edpic/ec/ca/d8/eccad87a334d082b8ff200ae01157e44.jpg" alt="">
            Ask price        
        </div>
        `)
        buttonDom.click(function () {
            askPrice()
        })
        userNameEle.append(buttonDom)

    }

    let timer = setInterval(() => {
        //data-testid="UserName"
        // let dom = $('#react-root')
        // let messageDom = $("div[data-testid='DMDrawer']")
        // let userDom = $("a[data-testid='AppTabBar_Profile_Link']")
        let userBoxDom = $("div[data-testid='UserName']")
        //aria-label="Profile"
        // data-testid="AppTabBar_Profile_Link"
        if (userBoxDom.length) {
            clearInterval(timer)
            addHouseChanButton(userBoxDom)
            init()
        }
        // if (userDom.length && messageDom.length && userBoxDom.length) {
        //     clearInterval(timer)
        //     init(userDom, messageDom, userBoxDom)
        // }
    }, 500)
})

//aria-label="Account menu"
//role="tablist
// data-testid="DMDrawer"

// role="tablist"


