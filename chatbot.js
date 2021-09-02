var message;
var context;
var bot_pre = '<p class="bot_text"><span>';
var human_pre = '<p class="human_text"><span>';
var post = '</span></p>';
// var todo_and_timer_said = false; hide the buttons
// var background = chrome.extension.getBackgroundPage();
yes_and_no = '<button class="binary">Yes</button>\n <button class="binary">No</button>'

var timer_binary = false;

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
let bot_words = "Okay, buddy";
words = bot_pre + bot_words + post;
chat(words, context);
$("#todo_and_timer").on("click", function(){
    let b_text = $("#todo_and_timer").text()
    let reply = human_pre + $("#todo_and_timer").text() + post
    chat(reply);
    ask_for_timer();

    // console.log(JSON.parse(localStorage.getItem('todo_lists')));
    // change_list("cash");
});

$(".binary").on("click", function(e){
    let b_text = e.target.text();
    console.log(b_text);
    if (b_text == "No"){
        chat(bot_pre + "Okay." +post);

    }
    else if (b_text == "Yes"){
        if (timer_binary){
            timer_binary = false;
            chat(bot_pre + "What time would you like to set? (mm:ss or ssss)" + post);
        }
    }
    else {
        chat(bot_pre + "check logs" +post)
    }

});

function ask_for_timer(context = $('#chatbox')){
    console.log(context);
    let bot_reply = "Would you like me to set a break timer?"
    chat(bot_pre + bot_reply + post);
    timer_binary = true;
    chat(yes_and_no)
}



function set_timer(duration){
    localStorage.setItem('time_left', duration);
    localStorage.setItem('active', true);
    let message = {msg: "start_clock"};
    chrome.runtime.sendMessage(message);
}

function whitelist(){
    localStorage.setItem('blocker', )
}
