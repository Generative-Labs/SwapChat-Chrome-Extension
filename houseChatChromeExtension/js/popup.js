$().ready(() => {
    console.log('popup-page')
    console.log(location.pathname, 'pathname')
    let button = document.getElementById('testButton')
    let bodyHeader  = document.querySelector('.popup-header')

    // chrome.storage.sync.get('headerText', function (popup) {
    //     bodyHeader.innerHTML = popup.headerText
    // })
    console.log(123123123)
    console.log(button)
    if (button) {
        button.onclick = () => {
            console.log('点击事件触发')

            chrome.runtime.sendMessage({
                info: "ready-create-auth-page",
            });

        }

    }
})

