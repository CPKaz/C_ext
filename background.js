var white_list = [];
var duration = parseInt(localStorage.getItem('time_left'));
var active = localStorage.getItem('active') == 'true';
var clock;
chrome.browserAction.setBadgeText({text:''})
var urls = localStorage.getItem('blocked_sites').split(',').map(function(e){
    return add_url_ends(e);
});

chrome.runtime.onStartup.addListener(function() {
    if (localStorage.getItem('whitelist') == 'true'){
        var d = new Date();
        var end = localStorage.getItem('end_time');
        if (end){
            end = new Date(end);
            if (end - d > 0){
                var t = Math.ceil((end-d)/1000);
                localStorage.setItem('time_left', t);
            }
        }
    }
    var t = parseInt(localStorage.getItem('time_left'));
    if (t > 0){
        let message = {msg: "start_clock"};
        chrome.runtime.sendMessage(message)
    }
  });

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
    else if (message.msg == "refresh_block"){
        urls = localStorage.getItem('blocked_sites').split(',').map(function(e){
            return add_url_ends(e);
            
        });
        chrome.webRequest.onBeforeRequest.removeListener(request_handler);
        w =localStorage.getItem('whitelist');
        if (w != 'true'){
            chrome.webRequest.onBeforeRequest.addListener(
                request_handler,
                {
                    urls,
                    types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
                },
                ["blocking"]
            );
        }
        chrome.webRequest.handlerBehaviorChanged();

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
        let message = {msg: "refresh_block"};
        chrome.runtime.sendMessage(message);
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

localStorage.setItem('blocked_sites',  ["www.change.org", "hope.org"]);

function add_url_ends(t){
    return '*://'+t+'/*';
}

console.log(urls)

// 1) get the whitelist
// 2) check to see if any of the whitelists are expired
// how do expirations work?
// whitelisting can either be done either through an up-to 60 minute timer or 3 buttons
// define an end time, disallow pausing a break timer.

//var urls = localStorage.getItem('blocked_sites').split(',');

function request_handler(){
    //localStorage.setItem('denied_access_url', intercept.url);
    return {redirectUrl: chrome.extension.getURL("chatbot.html")};
}

chrome.webRequest.onBeforeRequest.addListener(
    request_handler,
    {
        urls,
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    },
    ["blocking"]
);

//      :\/\/[a-zA-z\-0-9]+.[a-zA-z\-0-9]+(?:.[a-zA-z\-0-9]+)?\