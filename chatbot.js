function chat(words, context){
    context.innerHTML = words;
}
context = document.querySelector("#chatbox");
words = "Okay, buddy.";
chat(words, context);
$(":button").on("click", function(){
    alert("eat my ass");
    // console.log(JSON.parse(localStorage.getItem('todo_lists')));
    // change_list("cash");
});


function change_list(q){
    var loaded_items = localStorage.getItem('todo_lists');
    var items = JSON.parse(loaded_items);
    var z;
    if (items != null){
        items[0].push({"item": q + "<span class=\"close\">×</span>", "status": "unchecked"})
    }
    localStorage.setItem('todo_lists', JSON.stringify(items));
    }

function set_timer(){

}

function whitelist(){
    localStorage.setItem('blocker', )
}
