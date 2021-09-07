
 function load(){
    var items = localStorage.getItem('blocked_sites');
    // var whitelist = JSON.parse(localStorage.getItem('whitelist'));
    if (items != null){
      items = items.split(',')
       var html = '';
       items.forEach((k)=>{
        html += `<li>${k}</li>\n`
       });
       }
       console.log(html)
       document.getElementById('myUL1').innerHTML = html;
    }

 load();
 
 function save(){
   console.log('saving');
   var sites = [];
   var list = document.getElementById('myUL1').innerHTML.split("</li>");
   list.pop() // removing empty string from list
   list.forEach((i) =>{
    let reg = /(?:>).*(?=<span class="close")/;
    let q = i.match(reg);

    q = q[0].slice(1)
    // console.log(i);
    // console.log(q[0]);
    sites.push(q);
   });
   localStorage.setItem('blocked_sites', sites);
   //console.log(sites);
   let message = {msg: "refresh_block"};
   chrome.runtime.sendMessage(message);
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
console.log(close)
for (i = 0; i < close.length; i++) {
  console.log(i)
  console.log(close[i])
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
        save();
      }
    }
    save();
  }