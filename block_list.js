
 function load(){
    var loaded_items = localStorage.getItem('blocked_sites');
    var items = JSON.parse(loaded_items);
    // var whitelist = JSON.parse(localStorage.getItem('whitelist'));
    if (items != null){
       var html = '';
       items.forEach((k) =>{
          var status = ''
          if (k.checked){
            status = 'class=\"checked\"';
          }
          html += `<li ${status}>${k.item}</li>\n`
       });
       document.getElementById(`myUL${z+1}`).innerHTML = html;
    }
 
 }

 load();
 
 function save(){
   var todo_lists = [];
   var list = document.querySelectorAll('ul');
   list.forEach((i) =>{
     var todo_items = [];
     lis = i.innerHTML.split('</li>');
     lis.pop();
     lis.forEach((l) => {
       let reg = /(?:>).*/;
       let q = l.match(reg);
       var b = l.match('<li class=\"checked\">') != null;
       todo_items.push({"item": q[0].slice(1), "checked": b});
     });
     todo_lists.push(todo_items);
   });
   localStorage.setItem('blocked_sites', JSON.stringify(todo_lists));
 }
 
 document.getElementById("myInput".concat(String(1))).addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      newElement(String(1));
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

var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.remove();
    save();
  }
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

var list = document.querySelectorAll('ul');
list.forEach((e)=>{
  e.addEventListener('click', function(ev) {
    if (ev.target.tagName === 'LI') {
      ev.target.classList.toggle('checked');
      save();
    }
  }, false);
});