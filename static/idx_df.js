


























function colored_text_(term_list,svg_base_drawer,x,y,black_and_white = false,size = 7,class_=''){

      for(var i=0;i<term_list.length;i++){
        if(black_and_white){
          term_list[i].color = 'black'
        }else{
          term_list[i].color = rgb_array[i%5]
        }
      }
      var text_dx_list = []
      for(var i=0;i<term_list.slice(0,5).length;i++){
        if(i==0){
          text_dx_list.push([term_list[i].kw, term_list[i].color, 5])          
        }else{
          text_dx_list.push([term_list[i].kw, term_list[i].color, 10])
        } 
      }
      var score_dx_list = []
      for(var i=0;i<term_list.slice(0,5).length;i++){
        if(i==0){
          score_dx_list.push([term_list[i].score, term_list[i].color, 100])          
        }else{
          score_dx_list.push([term_list[i].score, term_list[i].color, 10])
        } 
      }

      var arg_list = text_dx_list.concat(score_dx_list)
      console.log('arg_list',arg_list)
      
      var df_terms = svg_base_drawer.text(function(t){


      // var term_list = df_term_list.slice(0,5)
      for(var i=0;i<arg_list.length;i++){
        if(i==0){var dx = 5}else if(i==5){var dx = 100}else{var dx = 10}
        t.tspan(arg_list[i][0]).fill(arg_list[i][1]).attr({class:class_}).dx(arg_list[i][2])//.on('click',draw_kw_from_summary)
        t.tspan('|').fill(arg_list[i][1]).attr({class:class_}).dx(10)//.on('click',draw_kw_from_summary)
        }
      })
      // df_terms.move(50,y_pos+5.8+40).size(7)
      df_terms.attr({'font-size':para.font_size_ten,x:x,y:y})//.size(size)
    }


function colored_text(term_list,svg_base_drawer,x,y,black_and_white = false,size = 7,class_=''){
      var df_terms = svg_base_drawer.text(function(t){
      // var term_list = df_term_list.slice(0,5)
      for(var i=0;i<term_list.length;i++){
        // var h = i*30
        // t.tspan(term_list[i]+'||').fill('hsl('+ h +', 100%, 95%)')  
        if(black_and_white){
          var color = 'black'
        }else{
          var color = rgb_array[i]
        }
        if(i==0){var dx = 5}else if(i==5){var dx = 100}else{var dx = 10}
        t.tspan(term_list[i]).fill(color).attr({class:class_}).dx(dx)//.on('click',draw_kw_from_summary)
        t.tspan('|').fill(color).attr({class:class_}).dx(10)//.on('click',draw_kw_from_summary)
        }
      })
      // df_terms.move(50,y_pos+5.8+40).size(7)
      df_terms.attr({'font-size':para.font_size_ten,x:x,y:y})//.size(size)
    }
    
function change_highlight_summary_type(){
  console.log('type',$(this).data('type'))
  $(this).parents('div.kw_display_unit').data('summary_color_coding_type',$(this).data('type'))
}

function sent_list_2_lemma_list(view_sents_list){
    // sent_str = sent_list.join(' ');
    var lemma_diff_list = []
    //view_sents_list come from non-html-marked sent str
    var view_sents_lm_long_list = view_sents_list.map(function(sent_str){
        lemma_diff_list.push(sent_str)
        sent_words_list = sent_str.match(/[a-zA-Z]{3,}/g)
        sent_nonstop_words_list = sw.removeStopwords(sent_words_list,stopword_list)
        var words_lm_long = []
        // var t_dict = {};
        // console.log('sent_nonstop_words_list',sent_nonstop_words_list)
        for (var i of sent_nonstop_words_list){
            i_lower = i.toLowerCase()
            lm = lemmatizer.only_lemmas(i_lower)[0]
            if(lm!=undefined && lm.length >= 3){
              // t_dict[words_lm[i]] ? t_dict[words_lm[i]]+=1 : t_dict[words_lm[i]]=1;
              words_lm_long.push(lm);
              if(lm!=i_lower){
                lemma_diff_list.push(i_lower+' > '+lm)
              }
            }
          }
        return words_lm_long
    })
    // append('body',lemma_diff_list)//2019-4-28 18:51:43
    return view_sents_lm_long_list    
}

function list_list_2_terms_set(list_list){
    // docs_word_str = docs.join(' ');
    var flat_words_list = [].concat.apply([], list_list);
    terms_set = new Set(flat_words_list)
    // console.log(terms_set)
    return terms_set
}

function terms_set_2_df_list(terms_set){
    // if(array_includes_by_common_lemma(term,lm_list)){
    var df_dict = {}
    terms_set.forEach(function(term){
        view_sents_lm_long_list.map(function(lm_list){//non-arg variable
            re = new RegExp('\\b'+term.slice(0,-1)+'\\w{0,4}\\b','gi')
            matches = lm_list.join(' ').match(re)
            if(matches!= null){                
                // console.log('matches',matches)
                df_dict[term]? df_dict[term]+=1 : df_dict[term]=1
            }
            
        })
    })
    // console.log('df_dict',df_dict)
    var df_liist = []
    for(i in df_dict){
        df_liist.push([i,df_dict[i]])
    }
    df_liist.sort(function(a,b){return b[1]-a[1]})
    df_list = df_liist.map(function(t){return t[0]})
    // console.log('df_list',df_list)
    return df_list
}

function div_p_term_marker_2({text_color_dict,is_mutual}={}){
    
     $('.sentPreviews').each(function(){
        sent_html = $(this).html()
        for(var text in text_color_dict){
            // console.log('t is',df_list[i])
            sent_html = span_mark_protected(sent_html)
            if(text.match(/[\u4e00-\u9fa5]/)){
              var re = new RegExp('('+ text +')','g')
              // console.log('re',re)
              // console.log('sent_html',sent_html)
              // console.log('sent_html.match(re)',sent_html.match(re))
              // sent_html = sent_html.replace(re,'<span class="chinese" style="background:'+ text_color_dict[text] +'">$1</span>')
              if(is_mutual==true){
                sent_html = sent_html.replace(re,"<span class='mutual_chinese' style='background:" + text_color_dict[text] + ";border-radius:5px; padding:1px; border:0px solid rgba(0,0,0,0.1)'>$1</span>")// + 
              }else{
                sent_html = sent_html.replace(re,"<span class='nonmutual_chinese' style='background:" + text_color_dict[text] + ";border-radius:0px; padding:0px; border:1px solid rgba(0,0,0,0.1)'>$1</span>")
              }
            }else{
              if(!text.match(/ /)){   
                // console.log('!!!!df_list[i].match(/ /)')          
                sent_html = replace_on_equal_lemma_2({text:text,color:text_color_dict[text],html_free_str:sent_html,is_mutual:is_mutual})
              }else{
                // console.log('df_list[i].match(/ /)')    
                var re = new RegExp('('+text.split(' ').join('\\w*\\W+\\w*\\W*')+')','ig')
                // console.log('re',re)
                // console.log('sent_html',sent_html)
                // console.log('sent_html.match(re)',sent_html.match(re))
                 // var enriched_word_div = $('<span></span>').attr({class:'enriched_word'}).css({'background':color,'border-radius':'5px','padding':'2px'}).text(enriched_word)
                 // var enriched_word_div = $('<span></span>').attr({class:'enriched_word'}).css({'background':color,'padding':'2px','border':'1px solid rgba(0,0,0,0.3)'}).text(enriched_word)
                if(is_mutual==true){
                  sent_html = sent_html.replace(re,"<span class='mutual_ngram' style='background:" + text_color_dict[text] + ";border-radius:5px; padding:1px; border:0px solid rgba(0,0,0,0.1)'>$1</span>")// + 
                }else{
                  sent_html = sent_html.replace(re,"<span class='nonmutual_ngram' style='background:" + text_color_dict[text] + ";border-radius:0px; padding:0px; border:1px solid rgba(0,0,0,0.1)'>$1</span>")
                }
                
              }
            }
            sent_html = span_mark_back(sent_html)            
        }
        $(this).html(sent_html)
      //    df_list.map(function(t){
      //       console.log('t is',t)
      //       sent_html = replace_on_equal_lemma(t,sent_html)
      //       // if(lemmatizer.only_lemmas(t[0])[0]!=lemmatizer.only_lemmas(kw)[0]){
      //       //     console.log(kw,'!!!!!=',t[0])
      //       //     var t_re = new RegExp(t[0],'gi');
      //       //     sent_html = sent_html.replace(t_re,'<span class="view_df">'+t[0]+'</span>')
      //       //     $(this).html(sent_html)
      //       // }else{
      //       //     console.log(kw,'======',t[0])
      //       // }
        
      // })
      // console.log('this is',this)
     })
     // append('#view',df_list)
}

function div_p_term_marker(df_list,kw){
    df_list = df_list.filter(a=>a != undefined)
    console.log('df_list is',df_list)
    df_list = this_word_safe(df_list,kw)
    console.log('df_list is',df_list)
     $('.sentPreviews').each(function(){
        sent_html = $(this).html()
        sent_html = span_mark_protected(sent_html)
        for(i=0; i<df_list.length; i++){
            // console.log('t is',df_list[i])
            if(df_list[i].match(/[\u4e00-\u9fa5]/)){
              var re = new RegExp('('+df_list[i]+')','g')
              // console.log('re',re)
              // console.log('sent_html',sent_html)
              // console.log('sent_html.match(re)',sent_html.match(re))
              sent_html = sent_html.replace(re,'<span class="view_df" style="color:'+ rgb_array[i] +'">$1</span>')
            }else{
              if(!df_list[i].match(/ /)){    
                // console.log('!!!!df_list[i].match(/ /)')          
                sent_html = replace_on_equal_lemma(df_list[i],sent_html,i)
              }else{
                // console.log('df_list[i].match(/ /)')    
                var re = new RegExp('('+df_list[i].split(' ').join('\\w*\\W+\\w*\\W*')+')','ig')
                // console.log('re',re)
                // console.log('sent_html',sent_html)
                // console.log('sent_html.match(re)',sent_html.match(re))
                sent_html = sent_html.replace(re,'<span class="view_df" style="color:'+ rgb_array[i] +'">$1</span>')
              }
            }
            
        }
      //    df_list.map(function(t){
      //       console.log('t is',t)
      //       sent_html = replace_on_equal_lemma(t,sent_html)
      //       // if(lemmatizer.only_lemmas(t[0])[0]!=lemmatizer.only_lemmas(kw)[0]){
      //       //     console.log(kw,'!!!!!=',t[0])
      //       //     var t_re = new RegExp(t[0],'gi');
      //       //     sent_html = sent_html.replace(t_re,'<span class="view_df">'+t[0]+'</span>')
      //       //     $(this).html(sent_html)
      //       // }else{
      //       //     console.log(kw,'======',t[0])
      //       // }
        
      // })
      sent_html = span_mark_back(sent_html)
      $(this).html(sent_html)
      // console.log('this is',this)
     })
     append('#view',df_list)
}

function df(kw,view_sents_list){
    // sent.log(view_sents_list)
    view_sents_lm_long_list = sent_list_2_lemma_list(view_sents_list)
    terms_set = list_list_2_terms_set(view_sents_lm_long_list)
    // console.log(view_sents_lm_long_list)
    df_list = terms_set_2_df_list(terms_set)
    div_p_term_marker(df_list,kw)
}

function df_term_only(kw,view_sents_list){
    // sent.log(view_sents_list)
    view_sents_lm_long_list = sent_list_2_lemma_list(view_sents_list)
    terms_set = list_list_2_terms_set(view_sents_lm_long_list)
    // console.log(view_sents_lm_long_list)
    df_list = terms_set_2_df_list(terms_set)
    // df_list = df_list.slice(0,view_df_num)
    df_list = this_word_safe(df_list,kw)
    return df_list
    // div_p_term_marker(df_list,kw)
}