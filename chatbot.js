
var message;
var context;
var bot_pre = '<p class="bot_text"><span>';
var human_pre = '<p class="human_text"><span>';
var post = '</span></p>';

todo_lists = JSON.parse(localStorage.getItem('todo_lists'));
d_date = new Date(localStorage.getItem('daily_task_time'));
w_date = new Date(localStorage.getItem('weekly_task_time'));
l_date = new Date(localStorage.getItem('long_task_time'));

// var todo_and_timer_said = false; hide the buttons
// var background = chrome.extension.getBackgroundPage();
yes_and_no = '<span id="b_buttons"> <button class="binary">Yes</button>\n <button class="binary">No</button></span>'

var timer_binary = false;

hide_week = true;
hide_long = true;

// var daily_task_binary = false; // check if tasks are old or if they're empty for each
// var weekly_task_binary = false;
// var long_task_binary = false;

let bot_words = "Okay, buddy";
words = bot_pre + bot_words + post;
chat(words, context);

function chat(words, context = $('#chatbox')){
    context.append(words);
}

function change_list(q, which_list){
    var loaded_items = localStorage.getItem('todo_lists');
    var items = JSON.parse(loaded_items);
    if (items != null){
        items[which_list].push({"item": q + "<span class=\"close\">×</span>", "status": "unchecked"})
    }
    localStorage.setItem('todo_lists', JSON.stringify(items));
    }



// context = document.querySelector("#chatbox");
$("#todo_and_timer").on("click", function(){
    let b_text = $("#todo_and_timer").text()
    let reply = human_pre + $("#todo_and_timer").text() + post
    chat(reply);

    ask_for_timer();
    $("#init_buttons").empty();
});

$('#needed_for_work').on('click', function(){
    let reply = human_pre + $("#needed_for_work").text() + post
    chat(reply);

    bot_whitelist();


});


$("#chatbox").on("click", '.binary', function(e){
    // console.log('text_below');
    let b_text = $(this).text();
    chat(human_pre + b_text + post);
    if (b_text == "No"){
        timer_binary = false;
        task_questions();
    }
    else if (b_text == "Yes"){
        if (timer_binary){
            timer_binary = false;
            chat('<p class="bot_text" id="bot_time_setter"><span>' + "What time would you like to set?" + post);
            chat('<span>' + '<input class="human_text" id="time_input">' + '</span>');
        }
    }
    else {
        chat(bot_pre + "check logs" +post)
    }
    $("#b_buttons").empty();

});

$("#chatbox").on("keypress", '#time_input', function(e){
   if (e.which == 13){ // will this work on added html?
        time = $(this).val()
    if (/(^([0-5]?[0-9]?):[0-5][0-9]$)|(^\d{1,4}$)/.test(time)){
        if (time.includes(':')){
            l = time.length;
            if (l == 3){
                time = '00' + time;
            }
            if (l == 4){
                time = '0' + time;
            }
            timer = parseInt(time.substring(0, 2))*60 + parseInt(time.substring(3, 5));
            chatbot_set_timer(timer);
        }
        else {
            timer = parseInt(time);
            if (timer > 60**2 - 1){
                timer = 60**2 - 1
            }
            chatbot_set_timer(timer);
    }
    
   }
   else {

    alert(time);
    console.log(time);
}
}
});

function task_questions(){
    if (!todo_lists[0].length || d_date.getDate() != new Date().getDate()){ //change the dialogue
        chat('<p class="bot_text" id="bot_day"><span>' + "Set one goal for today (feel free to add more later!)" + post);
        chat('<span>' + '<input class="human_text" id="daily_task_input">' + '</span>');
        hide_week = true;
        hide_long = true;
    }
    if (!todo_lists[1].length || w_date.getDate() != new Date().getDate()){
        chat('<p class="bot_text" id="bot_week"><span>' + "Please set a goal for this week. Your daily goals should contribute to its completion." + post);
        chat('<span>' + '<input class="human_text" id="weekly_task_input">' + '</span>');
        if (hide_week){
            $( "#bot_week" ).hide();
            $( "#weekly_task_input" ).hide();
        }
    }
    // doing else if here would launch all the things at the same time
    //
    if (!todo_lists[2].length || l_date.getDate() != new Date().getDate()){
        chat('<p class="bot_text" id="bot_long"><span>' + "Set a long-term goal based on your daily and weekly goals." + post);
        chat('<span>' + '<input class="human_text" id="long_task_input">' + '</span>');
    }
    if (hide_long){
        $( "#bot_long" ).hide();
        $( "#long_task_input" ).hide();
    }
}

$("#chatbox").on("keypress", '#daily_task_input', function(e){
    if (e.which == 13){
        change_list($(this).val(), 0);
        console.log($(this).val());
        chat(bot_pre + "Great!" + post);
        $( "#bot_day" ).hide();
        $( "#daily_task_input" ).hide();
        localStorage.setItem('daily_task_time', String(new Date()));

        try {
            $( "#bot_week" ).show();
            $( "#weekly_task_input" ).show();
        }
        catch {
            null;
        }
    }
});

$("#chatbox").on("keypress", '#weekly_task_input', function(e){
    if (e.which == 13){
        change_list($(this).val(), 1);
        console.log($(this).val());
        chat(bot_pre + "Great!" + post)
        $( "#bot_week" ).hide();
        $( "#weekly_task_input" ).hide();
        localStorage.setItem('weekly_task_time', String(new Date()));

        try {
            $( "#bot_long" ).show();
            $( "#long_task_input" ).show();
        }
        catch {
            null;
        }
    }
});

$("#chatbox").on("keypress", '#long_task_input', function(e){
    if (e.which == 13){
        change_list($(this).val(), 2);
        console.log($(this).val());
        chat(bot_pre + "Great!" + post)
        $( "#long_week" ).hide();
        $( "#long_task_input" ).hide();
        localStorage.setItem('long_task_time', String(new Date()))
    }
});

function ask_for_timer(context = $('#chatbox')){
    let bot_reply = "Would you like me to set a break timer?"
    chat(bot_pre + bot_reply + post);
    timer_binary = true;
    chat(yes_and_no);
}

function bot_whitelist(){
    let bot_reply = "How long would you like to whitelist this website?"
    chat(bot_pre + bot_reply + post);
    let time_selection = '<span id="t_buttons"> <button class="time_select_30">30 minute</button>\n <button class="time_select_60"> 60 minutes </button> <button class="time_select_90">90 minute</button></span>'
    chat(time_selection)
}

function chatbot_set_timer(duration){
    localStorage.setItem('time_left', duration);
    localStorage.setItem('active', true);
    let message = {msg: "start_clock"};
    chrome.runtime.sendMessage(message);
    task_questions();
}

function whitelist(){
    localStorage.setItem('blocker', )
}
