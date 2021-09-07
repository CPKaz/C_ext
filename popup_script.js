var duration;
var clock;
var active;
var background = chrome.extension.getBackgroundPage();

var todo_lists = JSON.parse(localStorage.getItem('todo_lists'));
d_date = new Date(localStorage.getItem('daily_task_time'));
w_date = new Date(localStorage.getItem('weekly_task_time'));
l_date = new Date(localStorage.getItem('long_task_time'));

var change_blocklist_denied = (!todo_lists[0].length || d_date.getDate() != new Date().getDate() || !todo_lists[1].length || w_date.getDate() != new Date().getDate() || !todo_lists[2].length || l_date.getDate() != new Date().getDate())
// if none of the to do lists are empty, and all the todolists have been updated recently ('recently' varies) allow blocklist modification

function to_clock_string(num){
    minutes = parseInt(num / 60, 10);
    seconds = parseInt(num % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
}

// function start_clock()
function startTimer(display) {
    display.innerHTML = to_clock_string(duration);
    localStorage.setItem('time_left', duration);

    // chrome.browserAction.setBadgeText({text:to_clock_string(duration)});

    if (--duration < 0){
        localStorage.setItem('whitelist', false);
        active = false;
        localStorage.setItem('active', false);
        clearInterval(clock);
        clock = null;
    }

    }

function set_timer(time, display){
    var timer;
    if (/(^([0-9]?[0-9]?):[0-5][0-9]$)|(^\d{1,4}$)/.test(time.val())){
        time = time.val()
        if (time.includes(':')){
            l = time.length;
            if (l == 3){
                time = '00' + time;
            }
            if (l == 4){
                time = '0' + time;
            }
            timer = parseInt(time.substring(0, 2))*60 + parseInt(time.substring(3, 5));
            if (timer > 5400){
                timer = 5400;
                time = '90:00'
            }
            display.text(time);
            localStorage.setItem('time_left', timer);
        }
        else {
            timer = parseInt(time);
            if (timer > 5400){
                timer = 5400;
            }

            display.text(to_clock_string(timer));
            localStorage.setItem('time_left', timer);
        }
    }
    else {
        time.val('');
        alert('invalid time');
        localStorage.setItem('time_left', 0);
    }
    // console.log(localStorage.getItem('time_left'));
}

window.onload = function () {
    var t = localStorage.getItem('time_left');
    active = localStorage.getItem('active') == 'true';
    t = parseInt(t);
    if (Number.isInteger(t)){
        secs = t % 60;
        mins = (t - secs)/60;
        duration = t;
        $("#time").text(to_clock_string(t));
        if (active){
            display = document.querySelector('#time');
            clock = setInterval(startTimer, 1000, display);
            let message = {msg: "start_clock"};
            chrome.runtime.sendMessage(message);
        }
    }
};  

$("#start").on("click", function(){
    time_left = localStorage.getItem('time_left');
    display = document.querySelector('#time');
    time = parseInt(time_left);
    duration = time;
    if (!clock) {
        active = true;
        localStorage.setItem('active', true);
        clock = setInterval(startTimer, 1000, display);
        let message = {msg: "start_clock"}
        chrome.runtime.sendMessage(message);
    }
});

$("#reset").on("click", function(){
    clearInterval(clock);
    clock = null;
    active = false;
    localStorage.setItem('active', false);
    localStorage.setItem('time_left', 0);
    $("#time").text('00:00');
    let message = { msg: "stop_clock", reset: true}
    chrome.runtime.sendMessage(message);
    
});

$("#stop").on("click", function(){
    clearInterval(clock);
    clock = null;
    active = false;
    localStorage.setItem('active', false);
    let message = { msg: "stop_clock"}
    chrome.runtime.sendMessage(message);
});

$("#t_in").keypress( function(e){
    if (e.which == 13) {
        $("#reset").trigger("click");
        set_timer($('#t_in'), $('#time'));
    }
});

$('#block_list').on("click", function(){
    if (change_blocklist_denied){
        window.open(chrome.extension.getURL("newtab.html"));
    }
    else {
        window.open(chrome.extension.getURL("block_list.html"));
    }
});

$('#inspiration').on('click', function(){
    chrome.tabs.create({ url:  chrome.extension.getURL("ai/index.html") });
});