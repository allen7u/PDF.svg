var kw_resolved

function echo(n_gram_list){

    diving('print_div')
    var div_main = $('#print_div')
    var n_gram_list_with_index = []
    for(var i in n_gram_list){
      n_gram_list_with_index.push([Number(+i+1)+')',n_gram_list[i][0],n_gram_list[i][1]])
    }
    var div1 = $('<div></div>').html(n_gram_list_with_index.join('||.....(')+'<br>'+
      n_gram_list_with_index.join('<br>') )
    $('#outerContainer').animate({left:'100%'})
    div_main.append(div1)

    var length_dict = {}
    for(var e of n_gram_list){
        // length_dict[e[0].length] = length_dict[e[0].length]? length_dict[e[0].length]+1 : 1
        length_dict['N:'+e.n] = length_dict['N:'+e.n]? length_dict['N:'+e.n]+1 : 1
    }
    var length_dist_list = []
    for (var i in length_dict){
        length_dist_list.push([i,length_dict[i]])
    }
    length_dist_list = length_dist_list.sort((a,b)=>b[1]-a[1])
    var div2 = $('<div></div>').html(length_dist_list.join('<br>'))
    div_main.prepend(div2)
}

function assign(){
    // console.log($(this)[0].type)
    // console.log($(this)[0].checked)
    if(this.type == 'text'){
        para[ this.id ] = this.value
        console.log(para)
    }else if(this.type == 'checkbox'){
        para[ this.id ] = this.checked
        console.log(para)
    }    
}

function word_merger(t,div_word_merge,page_index=0){
  var change_log_list = []
  // var w_s_w_list = t.match(/\w+ \w+/gi)
  var w_s_w_list = []
  var word_list = t.match(/[a-zA-Z]+/g)
  if(word_list == null){
    console.log('empty input')
    return
    // continue
  }
  var n = 2
  for (var j = 0; j < word_list.length - (n - 1); j++) {
    // if(n==2||n==2){
    //   console.log(j,j+n,word_list.slice(j,j+n).join(' '))
    // }
    var n_gram = word_list.slice(j,j+(+n)).join(' ')
    w_s_w_list.push(n_gram)
    // n_gram_dict[n_gram] = n_gram_dict[n_gram]? n_gram_dict[n_gram]+1 : 1
  }
  console.log('w_s_w_list',w_s_w_list)
  // w_s_w_list = Array.from(new Set(w_s_w_list))
  for(var wsw of w_s_w_list){
    console.log('wsw',wsw)
    var wsw_content_match = pageContents_joined_str.match(new RegExp('\\b'+wsw.replace(/ /,''),'i'))
    var wsw_dict_match = words_dictionary_list_str.match(new RegExp('\\b'+wsw.replace(/ /,''),'i'))//+'\\b'
    // var c0 = wsw_content_match || wsw_dict_match
    var wsw_1_match = words_dictionary_list_str.match(new RegExp('\\b'+wsw.split(' ')[0]+'\\b','i'))
    var wsw_2_match = words_dictionary_list_str.match(new RegExp('\\b'+wsw.split(' ')[1]+'\\b','i'))      
    var c1 = wsw_content_match && wsw_content_match.length > 1
    var c2 = wsw_content_match && !(wsw_1_match && wsw_2_match)
    var c3 = wsw_dict_match && !(wsw_1_match && wsw_2_match)
    var wsw_dict_match2 = word_idf_dict_list_str.match(new RegExp('\\b'+wsw.replace(/ /,''),'i'))//+'\\b'
    var wsw_1_match2 = word_idf_dict_list_str.match(new RegExp('\\b'+wsw.split(' ')[0]+'\\b','i'))
    var wsw_2_match2 = word_idf_dict_list_str.match(new RegExp('\\b'+wsw.split(' ')[1]+'\\b','i')) 
    var c4 = wsw_dict_match2 && !(wsw_1_match2 && wsw_2_match2)  && wsw.split(' ')[0].length >= 3 && wsw.split(' ')[1].length >= 3
    // console.log('wsw',wsw)
    // console.log('wsw_1_match wsw_2_match',wsw_1_match,wsw_2_match)
    console.log('c1 c2 c3 c4',c1,c2,c3,c4)
    if(c1 || c2 || c3 || c4){
      // console.log('====VVVV====')
      console.log(wsw)
      // console.log('wsw_1_match wsw_2_match',wsw_1_match,wsw_2_match)
      console.log('c1 c2 c3 c4',c1,c2,c3,c4)
      // console.log('wsw.split()[0].length',wsw.split(' ')[0].length)
      // console.log('wsw.split()[1].length',wsw.split(' ')[1].length)
      // console.log('!(wsw_1_match && wsw_2_match)',!(wsw_1_match && wsw_2_match))
      var re_wsw = new RegExp(wsw)//+'\\b'
      var re_wsw_match = t.match(re_wsw)
      var re_wsw_plus = new RegExp('\\w+'+wsw)//+'\\b'
      var re_wsw_match_plus = t.match(re_wsw_plus)
      if(re_wsw_match){
        div_word_merge.append($('<p></p>').html(wsw))
        div_word_merge.append($('<p></p>').html(c1+' '+c2+' '+c3+' '+c4))
        div_word_merge.append($('<p></p>').html('|————|'+re_wsw_match.join(' || ')))
        if(re_wsw_match_plus){
            div_word_merge.append($('<p></p>').html('|——————————|'+re_wsw_match_plus.join(' || ')))
        }        
        $.post(page_index + '_' + wsw.replace(/ /,'_'))
        div_word_merge.append($('<p></p>').html('T'))
        div_word_merge.append($('<p></p>').html(''))
        $.post(page_index + '_trueeeeeeee')
      }else{
        div_word_merge.append($('<p></p>').html(wsw))
        div_word_merge.append($('<p></p>').html('faillllllllllllllllllllllll'))
        div_word_merge.append($('<p></p>').html(''))
      }
      // console.log('re_wsw_match 1',re_wsw_match)
      var re_wsw_no_space = wsw.replace(/ /,'')
      // console.log('re_wsw',re_wsw)
      // console.log('re_wsw_no_space',re_wsw_no_space)
      // console.log('t 1',t)
      var t_before_replace = t
      t = t.replace(re_wsw,re_wsw_no_space)
      // console.log('t 2',t)
      var re_wsw_match = t.match(re_wsw)
      // console.log('re_wsw_match 2',re_wsw_match)
      // wsw_broken_list.push(wsw+':'+wsw_content_match)
      if(t != t_before_replace){
        change_log_list.push(wsw+':'+wsw_content_match)
      }        
    }
  }
  console.log('change_log_list',change_log_list)
  // return t
  if(change_log_list.length > 0){
    return word_merger(t,div_word_merge)
  }else{
    return t
  }      
}

function diving(div_id,parent = 'body',class_ = '',background = 'rgba(246,246,246,1)',position = 'relative',z_index = 0,display='inline-block',width='',column_count='auto'){
  svg_container_div = $("<div id='" + div_id + "'>");

  windowWidth = $(window).width();
  windowHeight = $(window).height();

  halfWindowSize = 0.5*windowWidth;

  // if(event.clientX + halfWindowSize > windowWidth){
  //   offSetLeft = event.clientX + halfWindowSize - windowWidth
  //   viewLeftX = event.pageX - offSetLeft - 100;
  // }else{
  //   viewLeftX = event.pageX;
  // }
  svg_container_div.attr('class',class_)
  svg_container_div.css({

        position: position,
        'z-index':z_index,
        background:background,
        display:display,
        width:width,
        'column-count':column_count,
        // 'padding':'5px 0px 5px 0px',
       // 'opacity':'1',
       //  'left':0 + 'px',
       // 'top':0 +'px',
        // 'pointer-events':'auto',
        // 'max-height': windowHeight - 40 - 40 + 'px',
        // 'font-size':'medium',
        // 'overflow': 'scroll',
       // 'border':'1px solid green',
        // 'position':'absolute',
        
       // 'border':'1px solid #333333',
        // 'width': halfWindowSize + 'px',
       // 'left':viewLeftX+10+'px',
       // 'top':event.pageY+ previewDownOffset +'px',
  })

  $(parent).append(svg_container_div);
}

function print_svg(list,div_id,hight_min=0,margin_top=50){
    var draw = SVG(div_id).size(2000, 1000)
    var counter = 1
    list.map(a=>{
        draw.plain(a[0],a[1]).attr({x:50,y:counter*15 + margin_top}).size(7).fill('black')
        counter += 1
    })
    var hight = hight_min > counter*15 ? hight_min:counter*15
    draw.size(2000,hight + margin_top)
}

function prepend(ele,list){
    $(ele).prepend($('<div class="prepend"></div>').attr('id','div_display'))
    list.map(function(a){
        $('#div_display').append($('<p class="prepend"></p>').text(a))
    })    
}

function append(ele,list){
    $(ele).append($('<div class="append"></div>').attr('id','div_display'))
    list.map(function(a){
        $('#div_display').append($('<p class="append"></p>').text(a))
    })    
}

function match_lemma_or_original_to_match_original(match_lemma,sent_original){
    console.log('match_lemma',match_lemma)
    console.log('sent_original',sent_original)
    pure_words_list = sent_original.match(/[a-zA-Z]{2,}/gi)
    if(pure_words_list==null){
        console.warn('illegal sent detected: ',sent_original)
        return undefined
    }
    var match_original_list = []
    pure_words_list.map(function(w){
        // console.log('query_word is',query_word)
        q_lower = match_lemma.toLowerCase()
        w_lower = w.toLowerCase()
        if(lemmatizer.only_lemmas(q_lower)[0]==lemmatizer.only_lemmas(w_lower)[0]){
            console.log('w',w)
            match_original_list.push(w)
        }
    })
    console.log('match_original_list',match_original_list)
    return match_original_list[0]
}

function word_list_to_lemma_list(list){
    var words_lm_long = []
    list.map(i=>{
        // var re_c = /\p{Unified_Ideograph}/ug //only for Chrome
        var re_c = /[\u4e00-\u9fa5]/g
        var matches_c = i.match(re_c)
        // console.log('matches_c',matches_c)
        if(matches_c){
            words_lm_long.push(i)
        }else{
            var i_lower = i.toLowerCase()
           var lm = lemmatizer.only_lemmas(i_lower)[0]
           if(lm!=undefined){
             words_lm_long.push(lm);
            }
        }
       
    })
    return words_lm_long
}

function read_text_file_from_url (to_be_loaded,url,callback) {
   fetch(url)
  .then(response => response.text())
  .then(text => {    
    text.split('\r\n').map(w=>{to_be_loaded.push(w)})
    // console.log('custom_kw text',text)
    // console.log('custom_kw list',to_be_loaded)
    callback()
    })
  // return list
}

function write_file(word_list){
    var  text = word_list.join('\n')
    blob = new Blob([text], { type: 'text/plain' }),
    anchor = document.createElement('a');

    anchor.download = "keywords.txt";
    anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
    anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
    anchor.click();
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function get_random_color() {
    var letters = 'ABCDE'.split('');
    var color = '#';
    for (var i=0; i<3; i++ ) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}

function str_to_nonstop_long_lemma_list(sent_str){
    var sent_words_list = sent_str.match(/[a-zA-Z]{3,}|[\u4e00-\u9fa5]/g)
    // console.log('sent_words_list',sent_words_list)
    if(sent_words_list!=null){
        if(sent_words_list.length>0){
            var sent_nonstop_words_list = sw.removeStopwords(sent_words_list,stopword_list)
            if(sent_nonstop_words_list.length==0){
                return []
            }
        }else{
            console.log('empty sent',sent_str)
            return []
            // return sent_words_list
        }
    }else{
        return []
    }
    
    var words_lm = word_list_to_lemma_list(sent_nonstop_words_list)

    var words_lm_long = words_lm.filter(a=>{
        if(a.match(/[\u4e00-\u9fa5]/)){
            return true
        }else if(a.length >=3 ){
            return true
        }
    })

    // for (var i of sent_nonstop_words_list){
    //     i_lower = i.toLowerCase()
    //     lm = lemmatizer.only_lemmas(i_lower)[0]
    //     if(lm!=undefined && lm.length >= 3){
    //       words_lm_long.push(lm);
    //     }
    //   }             
    return words_lm_long
}

function str_to_nonstop_long_lemma_str(sent_str){
    sent_str = sent_str.replace(/([\u4e00-\u9fa5]) +(?=[\u4e00-\u9fa5])/g,'$1')
    // for(var w of chinese_stop_words_list){
    //     sent_str = sent_str.replace(new RegExp(w,'g'),'')
    // }
    var sent_str_list = str_to_nonstop_long_lemma_list(sent_str)
    if(sent_str_list.length>0){
        var sent_str_joined = sent_str_list.join(' ').replace(/([\u4e00-\u9fa5]) +(?=[\u4e00-\u9fa5])/g,'$1')
        return sent_str_joined
    }else{
        return ''
    }    
}

function array_includes_by_common_lemma(q,array){
    count_list = []
    q_lower = q.toLowerCase()
    q_lm = lemmatizer.only_lemmas(q_lower)[0]
    array.map(function(w){        
        w_lower = w.toLowerCase()
        if(q_lm==lemmatizer.only_lemmas(w_lower)[0]){
            count_list.push([q,w])
        }
    })
    if (count_list.length>0){
        return true
    }
}
function replace_on_equal_lemma_2({text,color,html_free_str,is_mutual}={}){

  // if(is_mutual){
  //   sent_html = sent_html.replace(re,"<span class='view_df' style='background:" + text_color_dict[text] + ";border-radius:5px; padding:1px; border:0px solid rgba(0,0,0,0.3)'>$1</span>")// + 
  // }else{
  //   sent_html = sent_html.replace(re,"<span class='view_df' style='background:" + text_color_dict[text] + ";border-radius:0px; padding:0px; border:1px solid rgba(0,0,0,0.3)'>$1</span>")
  // }

    if(!text.match(/[\u4e00-\u9fa5]/)){
        pure_words_list = html_free_str.match(/[a-zA-Z]+/gi)
        pure_words_list.map(function(w){
            // console.log('text is',text)
            q_lower = text.toLowerCase()
            w_lower = w.toLowerCase()
            if(lemmatizer.only_lemmas(q_lower)[0]==lemmatizer.only_lemmas(w_lower)[0]){
                w_re = new RegExp('\\b'+w,'gi')
                if(is_mutual==true){
                  w_spanned = '<span class="mutual_1gram" style="background:'+ color +';border-radius:5px; padding:1px; border:0px solid rgba(0,0,0,0.1)">'+text+'</span>'
                  // sent_html = sent_html.replace(re,"<span class='' style='background:" + text_color_dict[text] + ";border-radius:5px; padding:1px; border:0px solid rgba(0,0,0,0.3)'>$1</span>")// + 
                }else{
                  w_spanned = '<span class="nonmutual_1gram" style="background:'+ color +';border-radius:0px; padding:0px; border:1px solid rgba(0,0,0,0.1)">'+text+'</span>'
                  // sent_html = sent_html.replace(re,"<span class='' style='background:" + text_color_dict[text] + ";border-radius:0px; padding:0px; border:1px solid rgba(0,0,0,0.3)'>$1</span>")
                }
                html_free_str = html_free_str.replace(w_re,w_spanned)
            }
        })
    }else{//chinese
        w_re = new RegExp(text,'g')
        if(is_mutual==true){
          w_spanned = '<span class="mutual_chinese" style="background:'+ color +';border-radius:5px; padding:1px; border:0px solid rgba(0,0,0,0.1)">'+text+'</span>'
          // sent_html = sent_html.replace(re,"<span class='' style='background:" + text_color_dict[text] + ";border-radius:5px; padding:1px; border:0px solid rgba(0,0,0,0.3)'>$1</span>")// + 
        }else{
          w_spanned = '<span class="nonmutual_chinese" style="background:'+ color +';border-radius:0px; padding:0px; border:1px solid rgba(0,0,0,0.1)">'+text+'</span>'
          // sent_html = sent_html.replace(re,"<span class='' style='background:" + text_color_dict[text] + ";border-radius:0px; padding:0px; border:1px solid rgba(0,0,0,0.3)'>$1</span>")
        }        
        html_free_str = html_free_str.replace(w_re,w_spanned)
    }    
    return html_free_str
}

function replace_on_equal_lemma(query_word,html_free_str,idx){
    if(!query_word.match(/[\u4e00-\u9fa5]/)){
        pure_words_list = html_free_str.match(/[a-zA-Z]+/gi)
        pure_words_list.map(function(w){
            // console.log('query_word is',query_word)
            q_lower = query_word.toLowerCase()
            w_lower = w.toLowerCase()
            if(lemmatizer.only_lemmas(q_lower)[0]==lemmatizer.only_lemmas(w_lower)[0]){
                w_re = new RegExp('\\b'+w,'gi')
                var color = rgb_array[idx]
                w_spanned = '<span class="view_df" style="color:'+ color +'">'+w+'</span>'
                html_free_str = html_free_str.replace(w_re,w_spanned)
            }
        })
    }else{
        w_re = new RegExp(query_word,'g')
        var color = rgb_array[idx]
        w_spanned = '<span class="view_df" style="color:'+ color +'">'+query_word+'</span>'
        html_free_str = html_free_str.replace(w_re,w_spanned)
    }    
    return html_free_str
}

function span_mark_protected(html){
    html = html.replace(/<span class="index">/gi,'SSPPAANNAA')
    html = html.replace(/<span class="sent_idx">/gi,'SSPPAANNBB')
    html = html.replace(/<\/span>/gi,'SSPPAANNCC')
    // console.log('html no span',html)
    return html
}

function span_mark_back(html){
    html = html.replace(/SSPPAANNAA/g,'<span class="index">')
    html = html.replace(/SSPPAANNBB/g,'<span class="sent_idx">')
    html = html.replace(/SSPPAANNCC/g,'</span>')
    // console.log('html back',html)
    return html
}

function this_word_safe(list,not_me){//so wont substitude the main keyword later
    list2 = []
    list.forEach(function(w){
        if(!w.match(/[\u4e00-\u9fa5]/)){
            try{//not nessicity
                w_lower = w.toLowerCase()
            }catch(err){
                console.log('err is',err)
                console.log('w is',w)
                alert('w is',w)
            }
            not_me_lower = not_me.toLowerCase()
            if(lemmatizer.only_lemmas(w_lower)[0]!=lemmatizer.only_lemmas(not_me_lower)[0]){
                // return w
                list2.push(w)
            }else{
                list2.push('I_confict_with_the_keyword')
            }
        }else{
            if(w!=not_me){
                list2.push(w)
            }else{
                list2.push('I_confict_with_the_keyword')
            }
        }        
    })
    return list2
}

function test(){
    for(var i=0; i<diagonal_kw_sum.length; i++){
      for(var j=0; j<diagonal_kw_sum.length; j++){
        var a = diagonal_kw_sum[i]
        var b = diagonal_kw_sum[j]
        // console.log('a,b',a,b)
        if(a.query_type == 'n_gram' && b.query_type == 'n_gram' && a.kw.includes(b.kw) && a.kw!=b.kw && b.hits.every(k=>a.hits.indexOf(k)>=0)){
          if(b.super == undefined){
            // console.log(a.query_type,b.query_type,a.query_type!=b.query_type)
            b.super = ['[  '+a.kw+' : '+a.query_type+'  ]']
          }else if(!b.super.includes('[  '+a.kw+' : '+a.query_type+'  ]')){
            b.super.push('[  '+a.kw+' : '+a.query_type+'  ]')
            // b.super.push(a.query_type)
            // j.super.push(i.hits)
          }
        }else if(a.query_type!=b.query_type && a.kw.includes(b.kw) && a.kw!=b.kw && b.hits.every(k=>a.hits.indexOf(k)>=0)){
          if(b.super == undefined){
            // console.log(a.query_type,b.query_type,a.query_type!=b.query_type)
            b.super = ['[  '+a.kw+' : '+a.query_type+'  ]']
          }else if(!b.super.includes('[  '+a.kw+' : '+a.query_type+'  ]')){
            b.super.push('[  '+a.kw+' : '+a.query_type+'  ]')
            // b.super.push(a.query_type)
            // j.super.push(i.hits)
          }
        }else if(a.query_type!=b.query_type && a.kw==b.kw && b.hits.every(k=>a.hits.indexOf(k)>=0)){
          if(b.equal == undefined){
            // console.log(a.query_type,b.query_type,a.query_type!=b.query_type)
            b.equal = ['[  '+a.kw+' : '+a.query_type+'  ]']
          }else if(!b.equal.includes('[  '+a.kw+' : '+a.query_type+'  ]')){
            b.equal.push('[  '+a.kw+' : '+a.query_type+'  ]')
            // b.equal.push(a.query_type)
            // j.super.push(i.hits)
          }
        }
      }
    }

    for(var i=0; i<diagonal_kw_sum.length; i++){
      var a = diagonal_kw_sum[i]
      // console.log('a,b',a,b)

      if(a.super != undefined && a.query_type == 'n_gram'){
        continue
      }else if(a.n != undefined && a.n > max_n_of_n_gram_displayed && a.query_type == 'n_gram'){
        continue
      }

      if(hide_super_and_equal){
        if(a.equal != undefined && a.query_type == 'kw'){
          continue
        }

        if(a.super != undefined && a.query_type == 'kw'){
          continue
        }
        
        if(a.equal != undefined && a.query_type == 'kw_pair'){
          continue
        }

        if(a.super != undefined && a.query_type == 'kw_pair'){
          continue
        }
      }

      if(n_gram_hit_num_vs_phrases_dict[a.hits.length] == undefined){
          // console.log('n_gram_hit_num_vs_phrases_dict[a.hits.length]',n_gram_hit_num_vs_phrases_dict[a.hits.length])
          n_gram_hit_num_vs_phrases_dict[a.hits.length] = [a.kw]
        }else if(!n_gram_hit_num_vs_phrases_dict[a.hits.length].includes(a.kw)){
          n_gram_hit_num_vs_phrases_dict[a.hits.length].push(a.kw)
        }
      
      if(n_gram_dense_hit_num_vs_occurence_num_dict[a[3].length] == undefined){
          // console.log('n_gram_hit_num_vs_phrases_dict[a.hits.length]',n_gram_hit_num_vs_phrases_dict[a.hits.length])
          n_gram_dense_hit_num_vs_occurence_num_dict[a[3].length] = [a.kw]
        }else{
          n_gram_dense_hit_num_vs_occurence_num_dict[a[3].length].push(a.kw)
        }
    }
    console.log('n_gram_hit_num_vs_phrases_dict',n_gram_hit_num_vs_phrases_dict) 

    var n_gram_hit_num_vs_phrases_num_list = []
    for(var i in n_gram_hit_num_vs_phrases_dict){
      n_gram_hit_num_vs_phrases_num_list.push([+i,n_gram_hit_num_vs_phrases_dict[i].length])
    }
    n_gram_hit_num_vs_phrases_num_list.sort((a,b)=>a[0]-b[0])
    n_gram_display_min_hits_cutoff_value = n_gram_hit_num_vs_phrases_num_list[0][0]
    n_gram_display_max_hits_cutoff_value = n_gram_hit_num_vs_phrases_num_list[n_gram_hit_num_vs_phrases_num_list.length-1][0]
    console.log('n_gram_hit_num_vs_phrases_num_list',n_gram_hit_num_vs_phrases_num_list)
    

    diving('n_grams',parent = 'body',class_ = '',background = 'rgba(246,246,246,1)',position = 'relative',z_index = 0,display='block',width='')
    var draw = SVG('n_grams')//.size(2000, 1000)
    // var polyline = draw.polyline().fill('none').stroke({ width: 3 })
    // polyline.plot([[100,10],[200,400],[300,10]])
    // polyline.plot()
    var x_shift = 120
    var y_shift = 30 + 45 + 25
    var rect_width_unit = 20
    var rect_height_max = 120

    var rect_width_sum = 1600 < n_gram_hit_num_vs_phrases_num_list.slice(-1)[0][0] * rect_width_unit? 1600 : n_gram_hit_num_vs_phrases_num_list.slice(-1)[0][0] * rect_width_unit
    // console.log('rect_width_sum',rect_width_sum)
    rect_width_unit = rect_width_sum/n_gram_hit_num_vs_phrases_num_list.slice(-1)[0][0]
    // console.log('rect_width_unit',rect_width_unit)

    // console.log('Math.max(n_gram_hit_num_vs_phrases_num_list.map(a=>a[1]))',Math.max.apply(null,n_gram_hit_num_vs_phrases_num_list.map(a=>a[1])))
    var rect_height_factor = rect_height_max/Math.max.apply(null,n_gram_hit_num_vs_phrases_num_list.map(a=>a[1]))
    // var rect_height_list = n_gram_hit_num_vs_phrases_num_list.map(a=>a[1]*rect_height_factor)
    var rect_size_list = n_gram_hit_num_vs_phrases_num_list.map(a=>[a[0]*rect_width_unit,a[1]*rect_height_factor])
    // console.log('rect_size_list',rect_size_list)

    var rect_height_only_list = rect_size_list.map(a=>a[1])
    var rect_height_max = rect_height_only_list.reduce((a,b)=>Math.max(a,b))

    for(var i of rect_size_list){
      draw.rect(rect_width_unit - 1,i[1]).attr({
        id:i[0]/rect_width_unit,
        class:'rect_n_gram_filter',
        x:i[0] - rect_width_unit + x_shift,
        y:rect_height_max - i[1] + y_shift
      })
      draw.plain(Math.round(i[0]/rect_width_unit)).attr({x:i[0] - rect_width_unit + x_shift,y:rect_height_max + 20 + y_shift}).size(2)
      draw.plain(i[1]/rect_height_factor).attr({x:i[0] - rect_width_unit + x_shift,y:rect_height_max - i[1] + y_shift - 3}).size(2)
    }
    draw.size('100%',rect_height_max + 20 + y_shift + 20)


    var input_range_min = $('<input></input>').attr({
      id:'n_gram_display_min_hits_filter',
      type:'range',
      min:n_gram_hit_num_vs_phrases_num_list[0][0],
      max:n_gram_hit_num_vs_phrases_num_list[n_gram_hit_num_vs_phrases_num_list.length-1][0],
      value:n_gram_hit_num_vs_phrases_num_list[0][0]
    })
    // console.log(rect_size_list.slice(-1),rect_size_list.slice(-1)[0],rect_size_list.slice(-1)[0][0]+'px')
    input_range_min.css({width:rect_size_list.slice(-1)[0][0]+'px',
                          position:'relative',
                          left:'120px'
    })
    var label_filter_min = $('<label>min hits</label>').css({
      background:'rgb(246,246,246)',
      position:'relative',
      'padding-left':'120px'
    })
    // label_filter_min.prepend(input_range_min)

    var input_range_max = $('<input></input>').attr({
      id:'n_gram_display_max_hits_filter',
      type:'range',
      min:n_gram_hit_num_vs_phrases_num_list[0][0],
      max:n_gram_hit_num_vs_phrases_num_list[n_gram_hit_num_vs_phrases_num_list.length-1][0],
      value:n_gram_hit_num_vs_phrases_num_list[n_gram_hit_num_vs_phrases_num_list.length-1][0]
    })
    input_range_max.css({width:rect_size_list.slice(-1)[0][0]+'px',
                          position:'relative',
                          left:'120px'
    })
    var label_filter_max = $('<label>max hits</label>').css({
      background:'rgb(246,246,246)',
      position:'relative',
      'padding-left':'120px'
    })
    // label_filter_max.prepend(input_range_max)

    var div_filter_min = $('<div></div>').css({
      background:'rgb(246,246,246)'
    })
    div_filter_min.append(label_filter_min)
    div_filter_min.append(input_range_min)
    div_filter_min.append(label_filter_max)
    div_filter_min.append(input_range_max)
    $('body').append(div_filter_min)




    var n_gram_dense_hit_num_vs_occurence_num_list = []
    var n_gram_dense_hit_num_list = []
    for(var i in n_gram_dense_hit_num_vs_occurence_num_dict){
      n_gram_dense_hit_num_vs_occurence_num_list.push([+i,n_gram_dense_hit_num_vs_occurence_num_dict[i].length])
      n_gram_dense_hit_num_list.push(+i)
    }
    n_gram_dense_hit_num_vs_occurence_num_list.sort((a,b)=>a[0]-b[0])
    n_gram_display_min_dense_hit_num_cutoff_value = n_gram_dense_hit_num_vs_occurence_num_list[0][0]
    n_gram_display_max_dense_hit_num_cutoff_value = n_gram_dense_hit_num_vs_occurence_num_list[n_gram_dense_hit_num_vs_occurence_num_list.length-1][0]
    console.log('n_gram_dense_hit_num_vs_occurence_num_list',n_gram_dense_hit_num_vs_occurence_num_list)
    if(max_display_unit_draw_num > 0 || max_display_unit_display_num > 0){
      n_gram_dense_hit_num_list.sort((a,b)=>a-b)
      var n_gram_display_min_dense_hit_num_cutoff_value_found = false
      for(var i in n_gram_dense_hit_num_list){
        var dense_hit_num = n_gram_dense_hit_num_list[i]
        var n_gram_dense_hit_num_vs_occurence_num_list_above_cutoff = n_gram_dense_hit_num_vs_occurence_num_list.slice(i)
        var total_dense_region_num_above_cutoff = 0
        n_gram_dense_hit_num_vs_occurence_num_list_above_cutoff.map(a=>{total_dense_region_num_above_cutoff += a[1]})
        // console.log('dense_hit_num total_dense_region_num_above_cutoff',dense_hit_num,total_dense_region_num_above_cutoff)
        if(total_dense_region_num_above_cutoff <= max_display_unit_draw_num || total_dense_region_num_above_cutoff <= max_display_unit_display_num){
          // console.log('max_display_unit_draw_num',max_display_unit_draw_num)
          // console.log('max_display_unit_display_num',max_display_unit_display_num)
          // console.log('n_gram_display_min_dense_hit_num_cutoff_value',n_gram_display_min_dense_hit_num_cutoff_value)
          n_gram_display_min_dense_hit_num_cutoff_value = dense_hit_num
          n_gram_display_min_dense_hit_num_cutoff_value_found = true
          break
        }
      }
      if(n_gram_display_min_dense_hit_num_cutoff_value_found = false){
        n_gram_display_min_dense_hit_num_cutoff_value = n_gram_display_max_dense_hit_num_cutoff_value
      }    
    }
    if(forced_min_dense_cutoff.length > 0){
      n_gram_display_min_dense_hit_num_cutoff_value = forced_min_dense_cutoff
      console.log(forced_min_dense_cutoff)
    }

    diving('n_gram_dense_hit_num_vs_occurence_num',parent = 'body',class_ = '',background = 'rgba(246,246,246,1)',position = 'relative',z_index = 0,display='inline-block',width='70%')
    var draw = SVG('n_gram_dense_hit_num_vs_occurence_num')//.size('100%', 1000)
    // var polyline = draw.polyline().fill('none').stroke({ width: 3 })
    // polyline.plot([[100,10],[200,400],[300,10]])
    // polyline.plot()
    var x_shift = 100
    var y_shift = 30
    var rect_width_unit = 20
    // var rect_height_factor = 10Math.max.apply(null,i.hits)
    var max_occurence_num = Math.max.apply(null,n_gram_dense_hit_num_vs_occurence_num_list.map(a=>a[1]))
    console.log('Math.max(n_gram_dense_hit_num_vs_occurence_num_list.map(a=>a[1]))',max_occurence_num)
    var rect_height_max = 120
    var rect_height_factor = rect_height_max/max_occurence_num
    // var rect_height_list = n_gram_hit_num_vs_phrases_num_list.map(a=>a[1]*rect_height_factor)
    var rect_size_list = n_gram_dense_hit_num_vs_occurence_num_list.map(a=>[a[0]*rect_width_unit,a[1]*rect_height_factor])

    for(var i of rect_size_list){
      draw.rect(rect_width_unit - 1,i[1]).attr({
        id:i[0]/rect_width_unit,
        class:'rect_n_gram_dense_hit_num_filter',
        x:i[0] + x_shift,
        y:rect_height_max - i[1] + y_shift
      })
      draw.plain(i[0]/rect_width_unit).attr({x:i[0] + x_shift,y:rect_height_max + 20 + y_shift})
      draw.plain(i[1]/rect_height_factor).attr({x:i[0] + x_shift,y:rect_height_max - i[1] + y_shift - 3}).size(2)
    }
    draw.size('100%',rect_height_max + 20 + y_shift + 20)


    var input_range_min = $('<input></input>').attr({
      id:'n_gram_display_min_dense_hit_num_filter',
      type:'range',
      min:n_gram_dense_hit_num_vs_occurence_num_list[0][0],
      max:n_gram_dense_hit_num_vs_occurence_num_list[n_gram_dense_hit_num_vs_occurence_num_list.length-1][0],
      value:n_gram_display_min_dense_hit_num_cutoff_value
    })
    // console.log(rect_size_list.slice(-1),rect_size_list.slice(-1)[0],rect_size_list.slice(-1)[0][0]+'px')
    input_range_min.css({width:rect_size_list.slice(-1)[0][0]+'px',
                          position:'relative',
                          left:'120px'
    })
    var label_filter_min = $('<label>min dense hits</label>').css({
      background:'rgb(246,246,246)',
      position:'relative',
      'padding-left':'120px'
    })
    // label_filter_min.prepend(input_range_min)

    var input_range_max = $('<input></input>').attr({
      id:'n_gram_display_max_dense_hit_num_filter',
      type:'range',
      min:n_gram_dense_hit_num_vs_occurence_num_list[0][0],
      max:n_gram_dense_hit_num_vs_occurence_num_list[n_gram_dense_hit_num_vs_occurence_num_list.length-1][0],
      value:n_gram_dense_hit_num_vs_occurence_num_list[n_gram_dense_hit_num_vs_occurence_num_list.length-1][0]
    })
    input_range_max.css({width:rect_size_list.slice(-1)[0][0]+'px',
                          position:'relative',
                          left:'120px'
    })
    var label_filter_max = $('<label>max dense hits</label>').css({
      background:'rgb(246,246,246)',
      position:'relative',
      'padding-left':'120px'
    })
    // label_filter_max.prepend(input_range_max)

    var div_filter_min = $('<div></div>').css({
      background:'rgb(246,246,246)'
    })
    div_filter_min.append(label_filter_min)
    div_filter_min.append(input_range_min)
    div_filter_min.append(label_filter_max)
    div_filter_min.append(input_range_max)
    $('div#n_gram_dense_hit_num_vs_occurence_num').append(div_filter_min)


    var height_following_div_n_gram_dense_hit_num_vs_occurence_num = $('div#n_gram_dense_hit_num_vs_occurence_num').css('height')
    var textarea_div = $('<div></div>').attr({id:'textarea_div'}).css({display:'inline-block',background:'rgb(246,246,246)',width:'30%','vertical-align':'top',height:height_following_div_n_gram_dense_hit_num_vs_occurence_num})
    var textarea = $('<textarea></textarea>').attr({id:'textarea',rows:"17",cols:20})
    textarea_div.append(textarea)
    var textarea_submit_button = $('<button>Submit</button>').css({display:'block'}).attr({id:'textarea_submit_button'})
    textarea_submit_button.bind('click',draw_kw_from_textarea)
    textarea_div.append(textarea_submit_button)
    $('div#n_gram_dense_hit_num_vs_occurence_num').after(textarea_div)




    diving('doc_title',parent = 'body',class_ = '',background = 'rgba(246,246,246,1)',position = 'relative',z_index = 0,display='block',width='100%')
    $('#doc_title').html(pdf_file_name.split('.pdf')[0])



    // var t = 'This technique combines topographica I information with inform ation on e lec tronic structure.'
    // var t = 'If the tip is ch emica lly derivatized with molecules'
    // var t = ' Tools are required to ch aracterize th ese structures, and the most w idely used methods re ly on various scanning probe microscopy techniques. All of these techniques rely on the u se of a specialized "tip" thatis brought into proximity to the surface to be v isualized. '
    // var text_ = word_merger(t)
    // console.log('text_',text_)
    // text_1 = word_merger(text_)
    // console.log('text_',text_1)



    // diving('items_list',parent = 'body',class_ = '',background = 'rgba(246,246,246,1)',position = 'relative',z_index = 0,display='block',width='100%')
    // var p_ = $('<p></p>').html(items_list.join('||')).attr('class','doc_items')
    // $('#items_list').append(p_)

    // diving('items_list2',parent = 'body',class_ = '',background = 'rgba(246,246,246,1)',position = 'relative',z_index = 0,display='block',width='100%')
    // var p_ = $('<p></p>').html(items_list_with_spaces.join('|——|')).attr('class','doc_items')
    // $('#items_list2').append(p_)

    



    var div_displayer_container = $('<div></div>').attr({
      id:'div_displayer_container'
    })
    div_displayer_container.css({
      background:'rgb(246,246,246)',
      padding:'25px 120px',
      // position:'relative',
      // left:'120px'
    })
    $('body').append(div_displayer_container)
    var div_displayer = $('<div>div_displayer</div>').attr({
      id:'div_displayer'
    })
    div_displayer.css({
      background:'rgb(246,246,246)',
      'font-size':'20px',
      display:'inline'
      // position:'relative'
    })
    div_displayer_container.append(div_displayer)

    var open_in_new_tab = $('<p></p>').attr({
      id:'cutoff_info'
    })
    open_in_new_tab.css({
      display:'inline',
      // 'margin-right':'120px',
      position:'absolute',
      right:'120px'
    })
    div_displayer_container.append(open_in_new_tab)
    $('p#cutoff_info').html('min_dense_cutoff: '+n_gram_display_min_dense_hit_num_cutoff_value)
    
    // var only_require_unit_total_hits_above_calculated_min_dense_cutoff = true
    // var ignore_min_dense_hit_cutoff_here = false//true//false
    var div_draw_by_click = $('<div></div>').css({'background':'rgb(246,246,246)'}).attr({id:'div_draw_by_click'})
    $('body').append(div_draw_by_click)
    var kw_append_record_list = []
    for(var i in diagonal_kw_sum){

      if(diagonal_kw_sum[i].super != undefined && diagonal_kw_sum[i].query_type == 'n_gram'){
        // nested_n_gram_counter += 1
        // console.log('gonna skip for nested n_gram',nested_n_gram_counter,diagonal_kw_sum[i][0])
        // j = j+1
        // console.log('j+1',j)
        continue
      }else if(diagonal_kw_sum[i].n != undefined && diagonal_kw_sum[i].n > max_n_of_n_gram_displayed && diagonal_kw_sum[i].query_type == 'n_gram'){
        // j = j+1
        // console.log('j+1',j)
        continue
      }else if(max_display_unit_draw_num > 0 || forced_min_dense_cutoff > 0){
        if(only_require_unit_total_hits_above_calculated_min_dense_cutoff){
          var to_be_cutoffed = diagonal_kw_sum[i].hits.length
        }else{
          var to_be_cutoffed = diagonal_kw_sum[i][3].length
        }      
        
        if(to_be_cutoffed < n_gram_display_min_dense_hit_num_cutoff_value && filter_terms_with_min_dense_hit_cutoff == true){
          // console.log('diagonal_kw_sum[i].kw',diagonal_kw_sum[i].kw)
          // console.log('diagonal_kw_sum[i][3].length',diagonal_kw_sum[i][3].length)
          // console.log('n_gram_display_min_dense_hit_num_cutoff_value',n_gram_display_min_dense_hit_num_cutoff_value)
          // j = j+1
          // console.log('j+1',j)
          continue
        }
      }


      if(hide_super_and_equal){
        if(diagonal_kw_sum[i].equal != undefined && diagonal_kw_sum[i].query_type == 'kw'){
          // j = j+1
        // console.log('j+1',j)
        continue
        }

        if(diagonal_kw_sum[i].super != undefined && diagonal_kw_sum[i].query_type == 'kw'){
          // j = j+1
        // console.log('j+1',j)
        continue
        }
        
        if(diagonal_kw_sum[i].equal != undefined && diagonal_kw_sum[i].query_type == 'kw_pair'){
          // j = j+1
        // console.log('j+1',j)
        continue
        }

        if(diagonal_kw_sum[i].super != undefined && diagonal_kw_sum[i].query_type == 'kw_pair'){
          // j = j+1
        // console.log('j+1',j)
        continue
        }
      }



      if(kw_append_record_list.includes(diagonal_kw_sum[i].kw)){continue}
      var kw_div = $('<div></div>').html(diagonal_kw_sum[i].kw+
        // '  ('+diagonal_kw_sum[i].hits.length+''+
        // ''+diagonal_kw_sum[i].query_type+'' +
        // ''+diagonal_kw_sum[i][3].length+')'+
        '').attr({id:diagonal_kw_sum[i].kw}).css({padding:'0px 20px',display:'inline-block'})
      var div_for_svg_relative_hits_num_bar = $('<div></div>').attr({id:diagonal_kw_sum[i].kw+'_div_for_svg_relative_hits_num_bar'})
      kw_div.append(div_for_svg_relative_hits_num_bar)
      kw_div.on('contextmenu',(event)=>{event.preventDefault()})
      kw_div.bind('mousedown',draw_kw_by_click_kw)
      div_draw_by_click.append(kw_div)
      var rect_bar_svg = SVG(diagonal_kw_sum[i].kw+'_div_for_svg_relative_hits_num_bar').size(100,4)//.fill
      rect_bar_svg.rect('100%','100%').fill('rgb(227,221,216)')
      var width = (100*diagonal_kw_sum[i].hits.length/n_gram_hit_num_vs_phrases_num_list[n_gram_hit_num_vs_phrases_num_list.length-1][0])+'%'
      rect_bar_svg.rect(width,'100%').fill('black')
      kw_append_record_list.push(diagonal_kw_sum[i].kw)
    }

    // print_svg(n_gram_list,'n_grams')

    console.log('diagonal_kw_sum before draw_zoom',diagonal_kw_sum)
    // console.log('sent_info_list[17]',sent_info_list[17]['sent'])
    // console.log('sent_info_list[72]',sent_info_list[72]['sent'])
    // draw_zoom(diagonal_kw_sum, [sent_info_list[17],sent_info_list[72]])
    $('#outerContainer').animate({left:'100%'})
    // diving('svg_container',-1,'relative')
    draw_titles()
    draw_zoom(diagonal_kw_sum, sent_info_list, not_use_set_interval_temp = false)

    $('#n_gram_display_min_hits_filter').bind('change',n_gram_display_min_hits_filter)
    $('#n_gram_display_max_hits_filter').bind('change',n_gram_display_max_hits_filter)
    // $('#open_in_new_tab').bind('click',open_in_new_tabs)  
    $('#n_gram_display_min_dense_hit_num_filter').bind('change',n_gram_display_min_dense_hits_filter)
    $('#n_gram_display_max_dense_hit_num_filter').bind('change',n_gram_display_max_dense_hits_filter)
  }


//var str = "js实现用{two}自符串替换占位符{two} {three}  {one} ".format({one: "I",two: "LOVE",three: "YOU"});
//var str2 = "js实现用{1}自符串替换占位符{1} {2}  {0} ".format("I","LOVE","YOU");
String.prototype.format = function() {
 if(arguments.length == 0) return this;
 var param = arguments[0];
 var s = this;
 if(typeof(param) == 'object') {
  for(var key in param)
   s = s.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
  return s;
 } else {
  for(var i = 0; i < arguments.length; i++)
   s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
  return s;
 }
}



// function memorySizeOf(obj) {
function size_of(obj) {
    var bytes = 0;

    function sizeOf(obj) {
        if(obj !== null && obj !== undefined) {
            switch(typeof obj) {
            case 'number':
                bytes += 8;
                break;
            case 'string':
                bytes += obj.length * 2;
                break;
            case 'boolean':
                bytes += 4;
                break;
            case 'object':
                var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                if(objClass === 'Object' || objClass === 'Array') {
                    for(var key in obj) {
                        if(!obj.hasOwnProperty(key)) continue;
                        sizeOf(obj[key]);
                    }
                } else bytes += obj.toString().length * 2;
                break;
            }
        }
        return bytes;
    };

    function formatByteSize(bytes) {
        if(bytes < 1024) return bytes + " bytes";
        else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KiB";
        else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MiB";
        else return(bytes / 1073741824).toFixed(3) + " GiB";
    };

    return formatByteSize(sizeOf(obj));
};

