




























if(custom_kw_textarea.length>0){
  console.log('custom_kw_textarea',custom_kw_textarea)
  tfidf_customized_global_list = custom_kw_textarea.split('\n')
  console.log('tfidf_customized_global_list',tfidf_customized_global_list)
}






































{{eg_youdao}}


<!-- source external js via a workaround -->
// <script>
  var script = document.createElement("script");
  script.src   = "_script.anki.main.js";
  document.getElementsByTagName('head')[0].appendChild(script);
// </script>


// <script>
if(!window.jQuery){
   var script = document.createElement('script');
   script.type = "text/javascript";
   script.src = "_jquery.min.js";
   document.getElementsByTagName('head')[0].appendChild(script);
}
/** http://stackoverflow.com/a/1828267/2570622 */
// </script>
// If above doesn't work, try document.body.appendChild(script); instead of document.getElementsByTagName('head')[0].appendChild(script);

CSS can be shared by using @import url("_template.css") given exists a _template.css file in Anki collection.media folder.


{{Front}}
<link rel="stylesheet" href="_zenburn.css">

// <script>
    if (typeof hljs === "undefined") {
        var script = document.createElement('script');
        script.src = "_highlight.min.js";
        script.async = false;
        document.head.appendChild(script);
    }

    var script = document.createElement('script');
    script.src = '_my_highlight.js';
    script.async = false;
    document.head.appendChild(script);
    document.head.removeChild(script);
// </script>




USING CUSTOM FONT

To use custom font, make sure you copy the font file into your collections.media folder under Documents > Anki > YOUR PROFILE > collections.media. Once you have done that, place this code all the way at the top of the Styling section (replace as necessary).

@font-face { font-family: FONT_NAME; src: url('YOUR_FONT_FILE_NAME.ttf'); }
FONT_NAME will be used under font-family in your CSS. If you named it HelloWorld, make sure to type it as font-family: HelloWorld; when you declare it in a CSS class.


// <script type="text/javascript">
window.addEventListener('keypress',hotPlayAudio);
loadConfig();
if(config.audio){
    playAudio();
}
// </script>


<div id="front" class="items">
<span>{{expression}}<img src="_play48px.png" onClick="playAudio();"></span>
</div>

// <div class="bar config">Config
<input type="checkbox" id="audio" onchange="saveConfig(this,'audio')">AutoPlay 
<input type="checkbox" id="fold" onchange="saveConfig(this,'fold')">HideHint 
<input type="checkbox" id="example" onchange="saveConfig(this,'example')">Example 
// </div>


//hide hint based on config
if(config.fold){
    toggle('note'); 
    toggle('sentence');
}

//save config
function saveConfig(obj, item){
    config[item]=obj.checked;
    window.name = JSON.stringify(config);
}

//load config
function loadConfig(){
    document.getElementById("audio").checked = config.audio
    document.getElementById("fold").checked = config.fold
    document.getElementById("example").checked = config.example
}


//sample functions: highlight tag
function highlightTag(){
    var colorMap = {
        'n.':'#e3412f',
        'a.':'#f8b002',
        'adj.':'#f8b002',
        'ad.':'#684b9d',
        'adv.':'#684b9d',
        'v.':'#539007',
        'vi.':'#539007',
        'vt.':'#539007',
        'verb.':'#539007',
        'phrase.':'#04B7C9',
        'prep.':'#04B7C9',
        'conj.':'#04B7C9',
        'pron.':'#04B7C9',
        'art.':'#04B7C9',
        'num.':'#04B7C9',
        'int.':'#04B7C9',
        'interj.':'#04B7C9',
        'modal.':'#04B7C9',
        'aux.':'#04B7C9',
        'pl.':'#D111D3',
        'abbr.':'#D111D3',
    };
    [].forEach.call(document.querySelectorAll('#back'), function(div) {
        div.innerHTML = div.innerHTML.replace(/\b[a-z]+\./g, function(symbol) {
            if(colorMap[symbol]) {
                return '<a class="hightlight" style="background-color:' 
                             + colorMap[symbol] + ';" >'+ symbol + '</a>';
            } else {
                return symbol;
            }
        });
    });
}


//sample functions: make cloze
function makeCloze(){
    var bb = document.querySelectorAll("#back b");
    for(var i = 0; i < bb.length; i++){
        bb[i].innerHTML = "____";
    }
}


alert(ex[i].innerHTML)


//save config
function saveConfig(obj, item){
    config[item]=obj.checked;
    window.name = JSON.stringify(config);
}

//load config
function loadConfig(){
    document.getElementById("audio").checked = config.audio
    document.getElementById("fold").checked = config.fold
    document.getElementById("example").checked = config.example
}

//delete HTML element
function removeTag(tag){
    var items = document.querySelectorAll(tag);
    for(var i = 0; i < items.length; i++){
        items[i].outerHTML = "";
    }
}
//hide or display hint
function toggle(e){
    var box= document.getElementById(e);
    if(box)
    if(box.style.display=='none'){
        box.style.display='block';
    }
    else{
        box.style.display='none';
    }
}

<script>
function playAudio(wordID) {
    var word = document.getElementById(wordID).innerText;
    var base = "http://dict.youdao.com/dictvoice?type=2&audio="; 
    //var base = "http://fanyi.baidu.com/gettts?lan=en&text=";
    var audioSrc = base + encodeURI(word);
    //检查是否为电脑端
    if(typeof(py)=="object"){
    //如果是电脑端，需安装插件 #498789867(replay button on card)才能发音
        py.link("ankiplay"+audioSrc)
    }else{
        var player=document.getElementById('player')
        player.src=audioSrc
        player.play()
    }
}

function ldoce4_convertKPP(){
    [].forEach.call(document.querySelectorAll('font[face="Kingsoft Phonetic Plain, Tahoma"]'), function(div) {
        div.outerHTML = '<span class="kpp">' + div.innerHTML + '</span>'
    });
}

function textNodesUnder(node){
  var all = [];
  for (node=node.firstChild;node;node=node.nextSibling){
    if (node.nodeType==3) all.push(node);
    else all = all.concat(textNodesUnder(node));
  }
  return all;
}

function ldoce4_clearIPA(){
    
    textNodesUnder(document).forEach(function(node) {
        if (node.textContent == ' / ' || node.textContent == ' /')
            node.textContent = '';
    });
    [].forEach.call(document.querySelectorAll('.kpp'), function(div){
        div.classList.add('hidden');
    });
}

function toggleTrans(){
    var customized = []; //add your own css class here

    var general = ['font[color]']
    var ldoce4 = ['.L_DEC', '.L_CEX', '.L_DCH','b+b[style]','.L_CUK+font[style]'];
    var collins = ['.explanation_box>.text_blue', '.explanation_item li>p+p','.vExplain_r li>p+p'];
    var odh = ['.chn_tran', '.chn_sent'];

    var transClass = customized.concat(general,ldoce4,collins,odh).join();

    [].forEach.call(document.querySelectorAll(transClass), function(div) {
        div.classList.toggle('hidden');
    });
}
</script>

