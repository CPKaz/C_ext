var urls;
var white_list = [];
var duration
var duration = parseInt(localStorage.getItem('time_left'));
var active = localStorage.getItem('active') == 'true';
var clock;

function to_clock_string(num){
    minutes = parseInt(num / 60, 10);
    seconds = parseInt(num % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
}

function badge_timer() {
    localStorage.setItem('time_left', duration);

    chrome.browserAction.setBadgeText({text:to_clock_string(duration)});

    if (--duration < 0){
        active = false;
        localStorage.setItem('active', false);
        clearInterval(clock);
        clock = null;
    }

    }
    
if(Number.isInteger(duration) && duration > 0 && active){
        clock = setInterval(badge_timer, 1000);
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

localStorage.setItem('blocked_sites',  ["*://www.wikipedia.org/*", "*://www.change.org/*"]);
urls = localStorage.getItem('blocked_sites').split(',');

chrome.webRequest.onBeforeRequest.addListener(
    function(intercept) {
         return {redirectUrl: chrome.extension.getURL("chatbot.html")};
         
    },
    {
        urls,
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    },
    ["blocking"]
);