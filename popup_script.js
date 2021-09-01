var duration;
var clock;
var active;

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

        // chrome.browserAction.setBadgeText({text: "minutes + ":" + seconds;"});

    if (--duration < 0){
        active = false;
        clearInterval(clock);
        clock = null;
    }

    }

function set_timer(time, display){
    if (/(^([0-5]?[0-9]?):[0-5][0-9]$)|(^\d{1,4}$)/.test(time.val())){
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
            display.text(time);
        }
        else {
            timer = parseInt(time);
            if (timer > 60**2 - 1){
                timer = 60**2 - 1
            }

            display.text(to_clock_string(timer));
        }
    }
    else {
        time.val('');
        alert('invalid time')
    }
    localStorage.setItem('time_left', timer);
    // console.log(localStorage.getItem('time_left'));
}

window.onload = function () {
    var t = localStorage.getItem('time_left');
    t = parseInt(t);
    // console.log(t);
    if (Number.isInteger(t)){
        secs = t % 60;
        mins = (t - secs)/60;
        
        //fix the loading in later


        $("#time").text(mins.toString()+":"+secs.toString());
        if (active){
            display = document.querySelector('#time');
            clock = setInterval(startTimer, 1000, display);
        }
    }
};  

$("#start").on("click", function(){
    time_left = localStorage.getItem('time_left');
    display = document.querySelector('#time');
    time = parseInt(time_left);
    // console.log(clock);
    duration = time;
    if (!clock) {
        active = true;
        clock = setInterval(startTimer, 1000, display);
    }
});

$("#reset").on("click", function(){
    clearInterval(clock);
    clock = null;
    active = false;
    $("#time").text('00:00');
    
});

$("#stop").on("click", function(){
    clearInterval(clock);
    clock = null;
    active = false;
});


$("#t_in").keypress( function(e){
    if (e.which == 13) {
        set_timer($('#t_in'), $('#time'));
    }
});