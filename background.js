var urls;
var white_list = [];
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