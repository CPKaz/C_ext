function to_clock_string(num){
    minutes = parseInt(num / 60, 10);
    seconds = parseInt(num % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
}


function startTimer(duration, display) {
    var timer = duration, minutes, seconds; // figure this out
    setInterval(function () { // needs to be a variable to stop

        minutes = parseInt(timer / 60, 10); // turn this into a function I want to throw up
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.innerHTML = minutes + ":" + seconds;
        localStorage.setItem('time_left', timer);

        // chrome.browserAction.setBadgeText({text: "minutes + ":" + seconds;"});

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
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
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.text(minutes + ":" + seconds);
        }
    }
    else {
        time.val('');
        alert('invalid time')
    }
    localStorage.setItem('time_left', timer);
    console.log(localStorage.getItem('time_left'));
}

window.onload = function () {
    var t = localStorage.getItem('time_left');
    t = parseInt(t);
    console.log(t);
    if (Number.isInteger(t)){
        secs = t % 60;
        mins = (t - secs)/60;
        
        //fix the loading in later


        $("#time").text(mins.toString()+":"+secs.toString());
    }
};  

var j;
$("button").on("click", function(){
    time_left = localStorage.getItem('time_left');
    display = document.querySelector('#time');
    time = parseInt(time_left);
    console.log(j);
    if (!j){
        j = startTimer(time, display);
    }
});

$("#t_in").keypress( function(e){
    if (e.which == 13) {
        set_timer($('#t_in'), $('#time'));
    }
});