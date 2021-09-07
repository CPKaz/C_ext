
function load(){
   var loaded_items = localStorage.getItem('todo_lists');
   var items = JSON.parse(loaded_items);
   var z;
   if (items != null){
    for (z = 0; z < 3; z++){
      var curr_list = items[z];
      var html = '';
      curr_list.forEach((k) =>{
         var status = ''
         if (k.checked){
           status = 'class=\"checked\"';
         }
         html += `<li ${status}>${k.item}</li>\n`
      });
      document.getElementById(`myUL${z+1}`).innerHTML = html;
   }
   }

}
load();

function save(){
  var todo_lists = [];
  var list = document.querySelectorAll('ul');
  list.forEach((i) =>{
    var todo_items = [];
    lis = i.innerHTML.split('</li>');
    lis.pop(); // remove first item in list
    lis.forEach((l) => {
      let reg = /(?:>).*(?=<span class="close")/; //regex to find first >
      let q = l.match(reg);
      var b = l.match('<li class=\"checked\">') != null; //checks if checked
      todo_items.push({"item": q[0].slice(1), "checked": b});
    });
    todo_lists.push(todo_items);
  });
  localStorage.setItem('todo_lists', JSON.stringify(todo_lists));
}

var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.remove();
    save();
  }
}

var list = document.querySelectorAll('ul');
list.forEach((e)=>{
  e.addEventListener('click', function(ev) {
    if (ev.target.tagName === 'LI') {
      ev.target.classList.toggle('checked');
      save();
    }
  }, false);
});

  document.getElementById("myInput".concat(String(1))).addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      newElement(String(1));
      localStorage.setItem('daily_task_time', String(new Date()))
    }
  });
  document.getElementById("myInput".concat(String(2))).addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      newElement(String(2));
      localStorage.setItem('weekly_task_time', String(new Date()))
    }
  });
  document.getElementById("myInput".concat(String(3))).addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      newElement(String(3));
      localStorage.setItem('long_task_time', String(new Date()))
    }
  });
function newElement(n) {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput".concat(n)).value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
  } else {
    document.getElementById("myUL".concat(n)).appendChild(li);
  }
  document.getElementById("myInput".concat(n)).value = "";

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
    }
  }
  save();
}