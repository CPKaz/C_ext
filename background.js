var urls;
var white_list = [];
var duration = parseInt(localStorage.getItem('time_left'));
var active = localStorage.getItem('active') == 'true';
var clock;
chrome.browserAction.setBadgeText({text:''})
console.log('smiles');

function to_clock_string(num){
    minutes = parseInt(num / 60, 10);
    seconds = parseInt(num % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
}

chrome.runtime.onMessage.addListener(function (message) {
    console.log(message)
    if (message.msg == "start_clock") {
        if (clock){
            console.log('already got a clock')
            clearInterval(clock);
            clock = null;
        }
        console.log('passed test')
        duration = parseInt(localStorage.getItem('time_left'));
        active = localStorage.getItem('active') == 'true';
        console.log(active);
        console.log(duration);
        if (active && Number.isInteger(duration) && duration > 0){
            duration = parseInt(localStorage.getItem('time_left'));
            clock = setInterval(badge_timer, 1000)
        }
    }
    else if (message.msg == "stop_clock"){
        console.log('clock_stopped')
        clearInterval(clock);
        clock = null;
        localStorage.setItem('active', false)
        if (message.reset){
            chrome.browserAction.setBadgeText({text:''});
        }
    }

    else if (message.msg == "whitelist"){
        
    }

});


function badge_timer() {
    localStorage.setItem('time_left', duration);

    chrome.browserAction.setBadgeText({text:to_clock_string(duration)});

    if (--duration < 0){
        active = false;
        localStorage.setItem('active', false);
        clearInterval(clock);
        clock = null;
        chrome.browserAction.setBadgeText({text:''});
    }

    }



// try{
//     white_list = localStorage.getItem('white_list').split(',');
// }
// catch{
//     console.log('failure')
// }
// date comparator works as expected
// need to keep a white list where sites are unblocked for X amount of time
// iterate thru white list and check if date is past expiration
// need a way for the user to modify the black list and white list
// do all list items need a date object or just toggel boolean?

// going to have a blacklist and whitelist
// every page request triggers a search thru the whitelist
// expired whitelist entries get deleted and added to the blacklist
// chatbot.html will send all messages after the conversation (multiple messages or 1 object)
// message types include timer setter, whitelist setter,

localStorage.setItem('blocked_sites',  ["*://www.wikipedia.org/*", "*://www.change.org/*", "*://en.wikipedia.org/*"]);
urls = localStorage.getItem('blocked_sites').split(',');

chrome.webRequest.onBeforeRequest.addListener(
    function(intercept) {
        console.log(intercept.url);
        localStorage.setItem('denied_access_url', intercept.url);
         return {redirectUrl: chrome.extension.getURL("chatbot.html")};
         
    },
    {
        urls,
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    },
    ["blocking"]
);

// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
// const url = tab.url;
// urls.array.forEach(element => {
//     if (element.test(url)){
//         return {redirectUrl: chrome.extension.getURL("chatbot.html")};

//     }
// });
// }