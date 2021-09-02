var message;
var context;
var bot_pre = '<p class="bot_text"><span>';
var human_pre = '<p class="human_text"><span>';
var post = '</span></p>';
// var todo_and_timer_said = false; hide the buttons
// var background = chrome.extension.getBackgroundPage();
yes_and_no = '<span id="b_buttons"> <button class="binary">Yes</button>\n <button class="binary">No</button></span>'

var timer_binary = false;

let bot_words = "Okay, buddy";
words = bot_pre + bot_words + post;
chat(words, context);

function chat(words, context = $('#chatbox')){
    context.append(words);
}

function change_list(q){
    var loaded_items = localStorage.getItem('todo_lists');
    var items = JSON.parse(loaded_items);
    var z;
    if (items != null){
        items[0].push({"item": q + "<span class=\"close\">×</span>", "status": "unchecked"})
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

    // console.log(JSON.parse(localStorage.getItem('todo_lists')));
    // change_list("cash");
});

$("#chatbox").on("click", '.binary', function(e){
    // console.log('text_below');
    let b_text = $(this).text();
    chat(human_pre + b_text + post);
    if (b_text == "No"){
        timer_binary = false;
        chat(bot_pre + "Okay." + post);
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

function ask_for_timer(context = $('#chatbox')){
    console.log(context);
    let bot_reply = "Would you like me to set a break timer?"
    chat(bot_pre + bot_reply + post);
    timer_binary = true;
    chat(yes_and_no);
}

function chatbot_set_timer(duration){
    localStorage.setItem('time_left', duration);
    localStorage.setItem('active', true);
    let message = {msg: "start_clock"};
    chrome.runtime.sendMessage(message);
}

function whitelist(){
    localStorage.setItem('blocker', )
}
