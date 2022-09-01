$.post('the_very_first_beginning')
// var doc;
// var page;
var doc
var all_sents_str_list = []
var tokenizer = require('sbd');
// var global_promise_list = [];
var all_page_promise_list = [];
var all_page_promise_record_list = [];
var doc_resolved
var words_dictionary_resolved
var word_idf_dict_resolved
var chinese_stop_words_dict_resolved
var doc_numPages
var pageContents = [];
// var pageContents_replaced = []
var page_contents_lemma = []
var sent_info_dict = {};
var sent_info_list = [];
var all_sents_lemma_plain_list = []
var all_sents_comma_original_plain_list = []
var all_sents_comma_lemma_plain_list = []
var outline_resolver;
var outline_promise = new Promise(r=>{outline_resolver=r})
var one_page_one_section = true;
var tfidf_dict
var tfidf_list_length
var n_gram_hit_num_vs_phrases_dict = {}
var n_gram_dense_hit_num_vs_occurence_num_dict = {}
var n_gram_display_min_hits_cutoff_value
var n_gram_display_max_hits_cutoff_value
var n_gram_display_min_dense_hit_num_cutoff_value
var n_gram_display_max_dense_hit_num_cutoff_value
var text_item_str_with_space_to_underline_list = []
var text_item_str_list = []
var words_dictionary = {}
var words_dictionary_list = []
var words_dictionary_list_str = ''
var word_idf_dict_list = []
var word_idf_dict_list_str = ''
var chinese_stop_words_list = []
var div_initial_display
var global_display_unit_counter = 1
var resolved_page_counter = 1
var diagonal_kw_sum = []
var l = []//for log
function cl(a){
  l.push(a)
  console.log(a)
}
// var multiple_sort_round = true
$(function(){
  diving('div_initial_display',parent = 'body',class_ = '',background = 'rgba(246,246,246,1)',position = 'fixed',z_index = 0,display='block',width='100px')
  div_initial_display = $('#div_initial_display')
})


// global_promise_list.push(new Promise(r=>{doc_resolve=r}))
var words_dictionary_promise = new Promise(r=>{words_dictionary_resolved=r})
$.getJSON('words_dictionary.json',function(j){
  words_dictionary = j;
  console.log('words_dictionary',j)
  words_dictionary_list = Object.keys(words_dictionary)
  console.log('words_dictionary_list',words_dictionary_list.slice(0,100))
  words_dictionary_list_str = words_dictionary_list.join(' ')
  words_dictionary_resolved()
})
var word_idf_dict_promise = new Promise(r=>{word_idf_dict_resolved=r})
$.getJSON('word_idf_dict.txt',function(j){
  word_idf_dict = j;
  console.log('word_idf_dict',j)
  word_idf_dict_list = Object.keys(word_idf_dict)
  console.log('word_idf_dict_list',word_idf_dict_list.slice(0,100))
  word_idf_dict_list_str = word_idf_dict_list.join(' ')
  word_idf_dict_resolved()
})
var chinese_stop_words_dict_promise = new Promise(r=>{chinese_stop_words_dict_resolved=r})
$.getJSON('chinese_stop_words.json',function(j){
  chinese_stop_words_dict = j;
  console.log('chinese_stop_words_dict',j)
  if( options.chinese_stopwords_disabled ){
    chinese_stop_words_list = []
  }else{
    var optional_stopwords = ['']
    chinese_stop_words_list = Object.keys(chinese_stop_words_dict).concat(optional_stopwords)
    var tmp_nonstopwords_list = ['经','会','向','本','任','大','中','小','历','人','对','上','内','不','当','代','和','更','近','习','','','','']
    chinese_stop_words_list = chinese_stop_words_list.filter(x => ! tmp_nonstopwords_list.includes(x))
  }
  
  csw = Object.keys(chinese_stop_words_dict)//方便调试
  raw.csw = Object.keys(chinese_stop_words_dict) //方便调试
  // chinese_stop_words_list = ['的','停用词','个','这','','','','']
  // chinese_stop_words_list = ['的','停用词','个','这']
  console.log('chinese_stop_words_list',chinese_stop_words_list.slice(0,100))
  // word_idf_dict_list_str = word_idf_dict_list.join(' ')
  raw.chinese_stop_words_list = chinese_stop_words_list
  chinese_stop_words_dict_resolved()
})
// global_promise_list.push(new Promise(r=>{brg2=r}))
console.log('gonna extract',DEFAULT_URL)


var doc_promise = new Promise(r=>{doc_resolved=r})

PDFJS.getDocument( DEFAULT_URL ).then(function(doc){
  // doc = d;
    doc_numPages = doc.numPages;
    var finished_page_num = 0
    div_initial_display.html('Page to do:'+doc_numPages)
  // console.log('pdf loaded for text_extraction')
                            for (let n=0; n<doc_numPages; n++){

                              console.log('options',options)
                              // if(n+1<3 || n+1>4){
                              if( (n+1< options.start_page_num || n+1> options.end_page_num) &&
                                options.start_page_num != '' && options.end_page_num != ''){
                                console.log('skipping page:',n+1)
                                continue
                              }

                              var per_page_promise = new Promise(function(page_resolved){

                             doc.getPage(n+1).then(function(page){

                              // console.log('page',page)
                              div_initial_display.html('Pending:'+(n+1))

    page.getTextContent({normalizeWhitespace:true,disableCombineTextItems: true}).then(function(t){

          var textItems = t.items;
          console.log(t)
          console.log(t.items)
          console.log(textItems.slice(0,10).map(a=>a.str),' as TextContent.items[0,10].str of page ',n+1)

          if(t.items.length == 0){ // totally blank page
            console.warn('totally blank page detected')
            pageContents[n] = ''            
            finished_page_num += 1 
            div_initial_display.html(resolved_page_counter+' of '+all_page_promise_list.length+ ' pages resolved')
            page_resolved();
            var to_be_removed_page_record_index = all_page_promise_record_list.indexOf('page '+(Number(n)+1).toString())
            if(to_be_removed_page_record_index > -1){
              all_page_promise_record_list.splice(to_be_removed_page_record_index,1)
            }
            console.log(resolved_page_counter,' of ',all_page_promise_list.length, ' pages resolved')
            console.log('all_page_promise_record_list',all_page_promise_record_list)
            resolved_page_counter += 1
            return
          }
          
          var strBuf = [];
          var line_vertical_positons_list = []
          var line_intervals_list = []
          var line_interval_verbose = true

          for (var i = 0, j = textItems.length; i < j; i++){
            if(textItems[i] == undefined){
              continue
            }
            line_vertical_positons_list.push(Math.round(textItems[i].transform[5]))
            if(i+1 < textItems.length){
              if(textItems[i].transform[5] > textItems[i+1].transform[5] &&
               textItems[i].transform[4] + textItems[i].width >= textItems[i+1].transform[4]){
                line_intervals_list.push( Math.abs(Math.round(textItems[i].transform[5] - textItems[i+1].transform[5] )))
              }
            }
          }
          var unique_line_vertical_positons_list = Array.from(new Set(line_vertical_positons_list))
          unique_line_vertical_positons_list.sort((a,b)=>b-a)

          
          if(unique_line_vertical_positons_list.length <= 1 || line_intervals_list.length == 0){

            var whole_page_str = strBuf.join('');
            if(line_intervals_list.length == 1){//e.g. for the first page of PART X
              whole_page_str = whole_page_str + ' TTIITTLLEE. '
            }
            pageContents[n] = whole_page_str
            // console.log('before var list resolve')    
            finished_page_num += 1 
            div_initial_display.html(resolved_page_counter+' of '+all_page_promise_list.length+ ' pages resolved')
            page_resolved();
            var to_be_removed_page_record_index = all_page_promise_record_list.indexOf('page '+(Number(n)+1).toString())
            if(to_be_removed_page_record_index > -1){
              all_page_promise_record_list.splice(to_be_removed_page_record_index,1)
            }
            console.log(resolved_page_counter,' of ',all_page_promise_list.length, ' pages resolved')
            console.log('all_page_promise_record_list',all_page_promise_record_list)
            resolved_page_counter += 1
            return
          }
          
          if(line_interval_verbose){console.log('line_intervals_list',line_intervals_list)}
          var line_interval_dict = {}
          for(var i of line_intervals_list){
            line_interval_dict[i] = line_interval_dict[i]? line_interval_dict[i]+1: 1
          }
          var line_interval_value_counts_list = []
          for(var i in line_interval_dict){
            line_interval_value_counts_list.push([i,line_interval_dict[i]])
          }
          line_interval_value_counts_list.sort((a,b)=>b[1]-a[1])
          if(line_interval_verbose){console.log('line_interval_value_counts_list',line_interval_value_counts_list)}
          var most_common_line_interval = line_interval_value_counts_list[0][0]
          if(line_interval_verbose){console.log('most_common_line_interval',most_common_line_interval)}
          var fairly_frequent_line_intervals = []
          for(var i of line_interval_value_counts_list){
            if(i[1] > 20){
              fairly_frequent_line_intervals.push(i[0])
            }
          }
          if(line_interval_verbose){console.log('fairly_frequent_line_intervals',fairly_frequent_line_intervals)}
          var common_line_intervals_list = fairly_frequent_line_intervals.concat(most_common_line_interval)
          if(line_interval_verbose){console.log(common_line_intervals_list)}
          common_line_intervals_list.sort((a,b)=>b-a)
          var common_line_intervals_max = common_line_intervals_list[0]
          if(line_interval_verbose){console.log('common_line_intervals_max',common_line_intervals_max)}


          for (var i = 0, j = textItems.length; i < j; i++){

            var i_str = textItems[i].str    
            var is_chinese = i_str.match(/[\u4e00-\u9fa5]/)
            // console.log(textItems[i])        
            // console.log(i_str)

            if(textItems[i] == undefined || textItems[i+1] == undefined){
              continue
            }
            if(!textItems[i].hasOwnProperty('transform') || !textItems[i+1].hasOwnProperty('transform')){
              continue
            }
            //   contiue
            var inline_title_ends_like = textItems[i].fontName != textItems[i+1].fontName &&
                textItems[i].transform[5] == textItems[i+1].transform[5] &&
                textItems[i].str.match(/[a-zA-Z0-9\u4e00-\u9fa5]+[.。] ?$/)
            var interline_title_ends_like = textItems[i].fontName != textItems[i+1].fontName &&
                textItems[i].transform[5] != textItems[i+1].transform[5] && 
                Math.abs(Math.round(textItems[i].transform[5] - textItems[i+1].transform[5] )) > common_line_intervals_max &&
                textItems[i].str.match(/[a-zA-Z0-9\u4e00-\u9fa5]+ ?$/)
              

            if( ( inline_title_ends_like || interline_title_ends_like) &&
              !unique_line_vertical_positons_list.slice(0,1).includes(Math.round(textItems[i].transform[5]))&&
              !unique_line_vertical_positons_list.slice(-1).includes(Math.round(textItems[i].transform[5]))){
              
              if(is_chinese){
                var str_pool_length_min = 5
                var str_pool_forward_length_min = 5//15//50
              }else{
                var str_pool_length_min = 10
                var str_pool_forward_length_min = 100//15//50
              }
              

              var str_pool = ''
              var font_pool_list = []
              for(var k = i; k>=0; k--){
                str_pool = textItems[k].str +' '+ str_pool
                font_pool_list.push(textItems[k].fontName)
                if(str_pool.length >= str_pool_length_min){
                  break
                }
              }
              var font_set = new Set(font_pool_list)

              var str_pool_forward = ''
              var font_pool_list_forward = []
              var font_vs_letters_dict = {}
              for(var k = i+1; k < textItems.length; k++){
                str_pool_forward = str_pool_forward+' '+ textItems[k].str 
                font_pool_list_forward.push(textItems[k].fontName)
                font_vs_letters_dict[textItems[k].fontName] = font_vs_letters_dict[textItems[k].fontName]? font_vs_letters_dict[textItems[k].fontName] + textItems[k].str.length : textItems[k].str.length
                if(str_pool_forward.length >= str_pool_forward_length_min){
                  break
                }
              }
              var font_set_forward = new Set(font_pool_list_forward)
              var font_vs_letters_list = []
              for(var f in font_vs_letters_dict){
                font_vs_letters_list.push([f,font_vs_letters_dict[f]])
              }
              font_vs_letters_list.sort((a,b)=>b[1]-a[1])
              var font_forward_main = font_vs_letters_list[0][0]

              if(str_pool.length >= str_pool_length_min &&
                str_pool_forward.length >= str_pool_forward_length_min &&
                font_set.size==1 && textItems[i].fontName != font_forward_main ){
                if(textItems[i].str.match(/[a-zA-Z0-9\u4e00-\u9fa5]+[.。] ?$/)){
                  i_str = i_str.replace(/([.。]) ?$/,' TTIITTLLEE$1 ')
                }else if(textItems[i].str.match(/[a-zA-Z0-9\u4e00-\u9fa5]+ ?$/)){
                  if(is_chinese){i_str = i_str + ' TTIITTLLEE。 '}
                  else{i_str = i_str + ' TTIITTLLEE. '}
                }                
              }    
            }


            var letter_width = Math.round(textItems[i].width)/textItems[i].str.length
            if(i<j-1){
              
              var line_changed = textItems[i].transform[4] + textItems[i].width> textItems[i+1].transform[4] &&
              textItems[i].transform[5] > textItems[i+1].transform[5]

              if(line_changed){
                // console.log(i_str)       
                if(i_str.match(/[a-zA-Z0-9]+-$/)){
                  var str_block_with_block_width = i_str
                  strBuf.push(str_block_with_block_width.replace(/-$/,''))
                }else if(i_str.match(/\w+$/)){
                  var str_block_with_block_width = i_str
                  strBuf.push(str_block_with_block_width + ' ')
                }else{
                  var str_block_with_block_width = i_str
                  strBuf.push(str_block_with_block_width)
                }
              }else{
                var str_block_with_block_width = i_str
                strBuf.push(str_block_with_block_width)

              }
            }else{
              var str_block_with_block_width = i_str
              strBuf.push(str_block_with_block_width)
            }
          }
          if(join_strbuf_by_space){
            var whole_page_str = strBuf.join(' ');
          }else{
            var whole_page_str = strBuf.join('');
          }

          
          var dash_between_words = whole_page_str.match(/\w+-\w+/gi)
          if(dash_between_words!=null){
            for(var w of dash_between_words){
              if(!( words_dictionary_list_str.match(new RegExp('\\b'+w.split('-')[0]+'\\b','i')) && words_dictionary_list_str.match(new RegExp('\\b'+w.split('-')[1]+'\\b','i')) )){
                w_de_dashed = w.replace(/-/,'')
                whole_page_str = whole_page_str.replace(w,w_de_dashed)
              }
            }
          }
          pageContents[n] = whole_page_str
          finished_page_num += 1 
          div_initial_display.html(resolved_page_counter+' of '+all_page_promise_list.length+ ' pages resolved')
          page_resolved();
          var to_be_removed_page_record_index = all_page_promise_record_list.indexOf('page '+(Number(n)+1).toString())
          if(to_be_removed_page_record_index > -1){
            all_page_promise_record_list.splice(to_be_removed_page_record_index,1)
          }
          console.log(resolved_page_counter,' of ',all_page_promise_list.length, ' pages resolved')
          console.log('all_page_promise_record_list',all_page_promise_record_list)
          resolved_page_counter += 1
          })

        })   

      })
    all_page_promise_list.push(per_page_promise)
    var page_num_to_be_pushed = 'page '+(Number(n)+1).toString()
    all_page_promise_record_list.push(page_num_to_be_pushed)
    console.log(n+1)
    console.log('all_page_promise_record_list',all_page_promise_record_list)
    // console.log('all_page_promise_list length',all_page_promise_list.length)
    }  // var n = 1;
  // console.log('all_page_promise_list_length',all_page_promise_list.length)
  // console.log('all_page_promise_list',all_page_promise_list)
  Promise.all(all_page_promise_list).then(function(){
    div_initial_display.html('doc_resolved')
    doc_resolved()
  })

})

var kw_promise = new Promise(r=>{kw_resolved=r})
if(custom_kw_url.startsWith('blob:')){
  read_text_file_from_url(tfidf_customized_global_list,custom_kw_url,kw_resolved)
}else{
  kw_resolved()
}

if(custom_kw_textarea.length>0){
  console.log('custom_kw_textarea',custom_kw_textarea)
  tfidf_customized_global_list = custom_kw_textarea.split('\n')
  console.log('from custom_kw_textarea',tfidf_customized_global_list)
  var [a, kw_sent_global_idx_dict, c, kw_hits_obj_list] = tfidf_list_2_kw_sent_idx_dict ( tfidf_customized_global_list, sent_info_list, 'kw')
  console.log('kw_hits_obj_list from tfidf_customized_global_list',kw_hits_obj_list)
  diagonal_kw_sum = diagonal_kw_sum.concat( kw_cluster_wise_by_merge(kw_hits_obj_list) )
}


var promises_resolved = function (){

  if(false){
    diving('items_list2',parent = 'body',class_ = '',background = 'rgba(246,246,246,1)',position = 'relative',z_index = 0,display='block',width='100%')
    var p_ = $('<p></p>').html(pageContents.join('|-----------|')+'666').attr('class','doc_items')
    // var p_ = $('<p></p>').html(pageContents_replaced.slice(-1)[0]+'666').attr('class','doc_items')
    $('#items_list2').append(p_)

    // diving('text_item_str_with_space_to_underline_list',parent = 'body',class_ = '',background = 'rgba(246,246,246,1)',position = 'relative',z_index = 0,display='block',width='100%')
    // var p_ = $('<p></p>').html(text_item_str_with_space_to_underline_list.join('<br>')).attr('class','doc_items')
    // $('#text_item_str_with_space_to_underline_list').append(p_)

    diving('word_merger_info',parent = 'body',class_ = '',background = 'rgba(246,246,246,1)',position = 'relative',z_index = 0,display='block',width='100%')
    word_merger(pageContents.join(' '),$('#word_merger_info'),page_index=0)    
  }
  // diving('word_merge',parent = 'body',class_ = '',background = 'rgba(246,246,246,1)',position = 'relative',z_index = 0,display='block',width='100%')
  // var div_word_merge = $('#word_merge')
  // var pageContents_str = pageContents.join(' ')
  // var wsw_broken_list = []
  var optional_options = {};
  // var text = "On Jan. 20, former Sen. Barack Obama became the 44th President of the U.S. Millions attended the Inauguration.";
  var global_sent_id_counter = 0;
  console.log('pageContents:',pageContents)
  // for (var page_index = 0; page_index < pageContents.length; page_index++){
  for (var page_index in pageContents){
    page_index = Number(page_index)
    console.log('page_index:',page_index)
    var pageNum = page_index + 1;
    var text = pageContents[page_index];
    // if(false){
    //   text = word_merger(text,div_word_merge,page_index)
    //   }       
    // pageContents_replaced[page_index] = text
    // pageContents[page_index] = text

    // console.log('text',text)
    if(text.match(/[\u4e00-\u9fa5]/g) != null && text.match(/[a-zA-Z]{3,}/g) != null){
      if(text.match(/[a-zA-Z]{3,}/g).length >= text.match(/[\u4e00-\u9fa5]/g).length){
        var mainly_english = true
      }else{
        var mainly_english = false
      }
    }else if(text.match(/[\u4e00-\u9fa5]/g) == null){
      var mainly_english = true
    }else if(text.match(/[a-zA-Z]{3,}/g) == null){
      var mainly_english = false
    }

    if(mainly_english){
      var to_be_protected_list = ['H','R']
      for(var i in to_be_protected_list){
        var to_be_protected = ' ?' + to_be_protected_list[i] + '\\. ?'
        var protected_re = new RegExp(to_be_protected,'g')
        text = text.replace(protected_re,'PLACEHOLDER'+i)
      }    
      // console.log('text',text)

      var sentences = tokenizer.sentences(text, optional_options);
      //find the ').' long sentences
      // console.log('sentences length',sentences.length)
      sentences_2 = []
      sentences.forEach(function(i){
        i.replace(/(\)\.)[^$]/g,'$1|').split('|').forEach(function(a){
          if (a != ''){sentences_2.push(a)}
        })
      })
      // sentences_2.forEach(function(a){
      //   if(a.match(/(\)\.)[^$]/g)){console.log(a)}
      // })     
      sentences_3 = []
      sentences_2.forEach(function(i){
        i.replace(/(•)[^$]/g,'$1|').split('|').forEach(function(a){
          if (a != ''){sentences_3.push(a)}
        })
      })
      
      
      sentences_4 = []
      for(var s of sentences_3){
        for(var i in to_be_protected_list){
          var holder_re = new RegExp('PLACEHOLDER'+i,'g')
          s = s.replace(holder_re,' ' + to_be_protected_list[i] + '. ')
        }  
        sentences_4.push(s)
      }
    }else{
      sentences_4 = []
      console.log(text)
      // console.log(text.replace(/(。)[^$]/g,'$1|'))
      if(options.chinese_math_book){
        text.replace(/([.!\u3002\uff1f])/g,'$1|').split('|').forEach(function(a){
            if (a != '' && a.match(/[a-zA-Z\u4e00-\u9fa5]+/)){sentences_4.push(a)}
          })
      }else{
        text.replace(/([!\u3002\uff1f])/g,'$1|').split('|').forEach(function(a){
            if (a != ''){sentences_4.push(a)}
          })
      }      
    }
    
    
    // console.log('sentences_2 length',sentences_2.length)
    // console.log('sentences_2',sentences_2)
    // console.log('there are',sentences.length,'sentences in',pageNum,'as',sentences)
    for (var sent_index = 0; sent_index < sentences_4.length; sent_index++){
      div_initial_display.html('doing sent: ',sent_index,' of ',sentences_4.length)
      if( start_sent_idx.length > 0 || end_sent_idx.length > 0){
        if( global_sent_id_counter < start_sent_idx || global_sent_id_counter > end_sent_idx ){
          // console.log('global_sent_id_counter',global_sent_id_counter)
          global_sent_id_counter += 1
          continue
        }
      }
      var sent_str = sentences_4[sent_index]
      // console.log('sent_str ori',sent_str)
      // var str_width_info_extraction_list = sent_str.match(/w?wddiitthh\d+wwddiitthh/g)
      // var str_width_value_list = str_width_info_extraction_list.join('').match(/\d+/g)
      // var str_width_sum = str_width_value_list.reduce((a,b)=>Number(a)+Number(b))
      // console.log('str_width_info_extraction_list',str_width_info_extraction_list)
      // console.log('str_width_value_list',str_width_value_list)
      // console.log('str_width_sum',str_width_sum)
      // sent_str = sent_str.replace(/w?wddiitthh\d+wwddiitthh/g,'')
      // var str_width_mean = str_width_sum/sent_str.replace(/ /g,'').length

      // console.log('str_width_mean',str_width_mean)
      // console.log('sent_str',sent_str)

      var is_title = sent_str.match(/ TTIITTLLEE/)!= null &&
      sent_str.replace(/ TTIITTLLEE/,'').length > 10 ? true:false
      if(is_title){
        sent_str = sent_str.replace(/ TTIITTLLEE/,'')
        // console.log(sent_str,' is_title')
      }

      all_sents_str_list.push(sent_str)
      var sent_str_lemma = str_to_nonstop_long_lemma_str(sent_str)
      all_sents_lemma_plain_list.push(sent_str_lemma)
      var sent_obj = {'global_sent_idx':global_sent_id_counter,
                                              'page_num':pageNum,
                                              'sent':sent_str,
                                              'sent_chinese_compact':sent_str.replace(/([\u4e00-\u9fa5]) +(?=[\u4e00-\u9fa5])/g,'$1'),
                                              'sent_lemma':sent_str_lemma,
                                              'is_title':is_title
                                              }
      sent_info_dict[global_sent_id_counter] = sent_obj
      sent_info_list.push(sent_obj)
      // sent_info_list[global_sent_id_counter] = sent_obj                              
      global_sent_id_counter += 1;                                    
    } 
    raw.sent_info_list = sent_info_list
    raw.sent_num = sent_info_list.length
    raw.all_sents_lemma_plain_list = all_sents_lemma_plain_list
    raw.all_sents_str_list = all_sents_str_list
    raw.text = all_sents_str_list.join(' ')
    raw.doc = all_sents_str_list.join(' ')
    doc = all_sents_str_list.join(' ')
    
    var sentences_comma = []
    sentences_4.forEach(function(i){
      i.replace(/([,])[^$]/g,'$1|').split('|').forEach(function(a){
        if (a != ''){sentences_comma.push(a)}
      })
    })
    for (var sent_index = 0; sent_index < sentences_comma.length; sent_index++){
      var sent_str = sentences_comma[sent_index]
      sent_str = sent_str.replace(/w?wddiitthh\d+wwddiitthh/g,'')
      all_sents_comma_original_plain_list.push(sent_str)
      var sent_str_lemma = str_to_nonstop_long_lemma_str(sent_str)
      all_sents_comma_lemma_plain_list.push(sent_str_lemma)
    }

  }
  console.log('sent_id_dict',sent_info_dict)

  var key_status_div = $('#key_status_div').css({
    position:'fixed',
    top:40,
    left:10,
    width:150,
    'z-index':4
  })
  .removeClass('hidden')
  $('body').append(key_status_div)
  // return

  function worker_start(){
    console.log(raw)
    for(var w of worker_queue){
       w.postMessage({key:'raw',value:raw})
    }

    diving('worker_num_div',parent = 'body',class_ = 'worker_num_div', background = 'rgba(246,246,246,1)',position = 'fixed',z_index = 4,display='block')
    $('#worker_num_div').css({top:20,left:50,width:150})//.addClass('worker_num_div')
    $('#worker_num_div').html(worker_queue.length)
    console.log(worker_record)
    $('#worker_num_div').on('click',{worker_record:worker_record},function(event){
      var worker_record = event.data.worker_record
      // console.log(worker_record)
      for(var w of worker_record){ 
        // console.log(w)
        w.terminate() 
      }
      worker_queue = []
      worker_record = []
      for(var i=0;i<worker_num;i++){
        var worker = new Worker('worker.js')
        worker.postMessage({key:'raw',value:raw})
        worker_queue.push(worker)
        worker_record.push(worker)
      }
      $('#worker_num_div').html(worker_queue.length)
    })
  }



  var n_gram_list_ = n_grams_ (sent_info_list,1,n_gram_max,reoccur_cutoff,do_idf = true)//n_gram_min use '1' for we need 1-gram idf
  var df_dict = {}
  var idf_dict = {}
  for(var ng of n_gram_list_){
    df_dict[ng.kw] = ng.df
    idf_dict[ng.kw] = ng.idf
  }
  raw.df_dict = df_dict
  raw.idf_dict = idf_dict
  // raw.n_gram_list = n_gram_list_.filter(a => a.n > 1)//but we don't need 1-grams other than their idfs
  // n_gram_list_ = n_gram_list_.filter(a => a.n > 1)//but we don't need 1-grams other than their idfs
  worker_start()



  // var customized_kw_new = true
  if( true ){
    // var textarea_height = 100

    var sliding_param_div = $('div#sliding_param_div')
    $('div#div_initial_display').after(sliding_param_div)
    // sliding_param_div.removeClass('hidden')

    //< not sure as what for
    sliding_param_div.addClass('left_sliding_param_div')
    sliding_param_div.find('input').width(20)
    sliding_param_div.find('#para_div input').each(function(){
      if(this.type == 'text'){
          para[ this.id ] = this.value
      }else if(this.type == 'checkbox'){
          para[ this.id ] = this.checked
      }  
    })
    sliding_param_div.find('#para_div input').each(function(){
      $(this).on('change',assign)
    })
    //>
    $('#js_for_eval_submit_button').on('click',eval_js)

    $('#sliding_textarea_submit_button').val( options['built_in_kw_textarea'] )
    $('#sliding_textarea_submit_button').on('click',()=>{
      $('#outerContainer').animate({left:'100%'})
      draw_titles()
      // $('div#div_initial_display').css({height:70})//because draw_titles_div is FIXED
    })
    $('#sliding_textarea_submit_button')
    .on('click',{div_to_append:'head_container'},draw_kw_from_textarea)    

    $('#sliding_textarea_submit_and_sort_button').on('click',()=>{
      $('#outerContainer').animate({left:'100%'})
      draw_titles()
      // $('div#div_initial_display').css({height:70})//because draw_titles_div is FIXED
    })
    $('#sliding_textarea_submit_and_sort_button')
    .on('click',{div_to_append:'head_container',sort:true},draw_kw_from_textarea)

    
    $('#sort_button').on('click',sort_current_display_unit)
    $('#clear_all_display_unit_button').on('click',clear_all_display_unit)

    $.post('textarea_appended')

    if( !(
    use_kw ||use_kw_pair||use_n_gram||
    verb_as_kw || positive_as_kw || negative_as_kw ||
    custom_kw_textarea.length>0||
    custom_kw_url.startsWith('blob:')
    ) ){
      diving('doc_title',parent = 'div#head_container',class_ = '',background = 'rgba(246,246,246,1)',position = 'relative',z_index = 0,display='block',width='100%')
      $('#doc_title').html(pdf_file_name.split('.pdf')[0])

      $('#head_container').append($('#grid_displayer'))
      $('#cutoff_info').html('min_dense_cutoff: '+n_gram_display_min_dense_hit_num_cutoff_value)

      return
    }
    
  }


  // to be deprecated
  // if(!(
  //   use_kw ||use_kw_pair||use_n_gram||
  //   verb_as_kw || positive_as_kw || negative_as_kw ||
  //   custom_kw_textarea.length>0||
  //   custom_kw_url.startsWith('blob:')
  //   ) ){
  //   // var textarea_height = 100

  //   var textarea_div_parent = $('div#textarea_div_parent')
  //   textarea_div_parent.removeClass('hidden')
  //   textarea_div_parent.addClass('left_textarea_div_parent')

  //   textarea_div_parent.find('input').width(20)
  //   // console.log(textarea_div_parent.find('#textarea_div #textarea_submit_button'))    
  //   textarea_div_parent.find('#para_div input').each(function(){
  //     $(this).on('change',assign)
  //   })
    
  //   textarea_div_parent.find('textarea').val( options['built_in_kw_textarea'] )
  //   // textarea_div_parent.find('textarea').val('test')
  //   textarea_div_parent.find('textarea').height(200)
  //   textarea_div_parent.find('#textarea_div button#textarea_submit_button')
  //   .on('click',()=>{
  //     $('#outerContainer').animate({left:'100%'})
  //     draw_titles()
  //     $('div#div_initial_display').css({height:70})//because draw_titles_div is FIXED
  //   })
  //   textarea_div_parent.find('#textarea_div button#textarea_submit_button')
  //   .on('click',{div_to_append:'textarea_div_parent'},draw_kw_from_textarea)    
  //   // textarea_div_parent.find('#textarea_div input').

  //   textarea_div_parent.find('#para_div input').each(function(){
  //     if(this.type == 'text'){
  //         para[ this.id ] = this.value
  //         console.log(para)
  //     }else if(this.type == 'checkbox'){
  //         para[ this.id ] = this.checked
  //         console.log(para)
  //     }  
  //   })
  //   console.log(para)
  //   $('div#div_initial_display').after(textarea_div_parent)
  //   $.post('textarea_appended')
  //   return
  // }


  if(positive_as_kw || negative_as_kw){
    var Sentiment = require('sentiment');
    var sentiment = new Sentiment();
    var positive_word_list = []
    var negative_word_list = []
    sent_info_list.map(s=>{
      var sent = s['sent']
      var obj = sentiment.analyze(sent)
      console.dir(sent)
      console.dir(obj)
      console.dir(obj.positive)
      if(obj.positive.length>0){
        positive_word_list = positive_word_list.concat(obj.positive)
        // positive_word_list.push(obj.positive)
      }
      if(obj.negative.length>0){
        negative_word_list = negative_word_list.concat(obj.negative)
        // negative_word_list.push(obj.negative)
      }
    })
    var positive_word_set = new Set(positive_word_list)
    var negative_word_set = new Set(negative_word_list)
    console.log('positive',positive_word_set)
    console.log('negative',negative_word_set)
    if(positive_as_kw){
      var kw_list = Array.from(positive_word_set)
    }else if(negative_as_kw){
      var kw_list = Array.from(negative_word_set)
    }
    var [a, kw_sent_global_idx_dict, c, kw_hits_obj_list] = tfidf_list_2_kw_sent_idx_dict ( kw_list, sent_info_list, 'kw')
    console.log('from Sentiment',kw_hits_obj_list)
    kw_quad_like_list_2 = kw_cluster_wise_by_merge(kw_hits_obj_list)   
    diagonal_kw_sum = diagonal_kw_sum.concat(kw_quad_like_list_2)
  }
  

  if(verb_as_kw){
    var sentences = nlp(pageContents.join(' ')).sentences()//.if('#Adjective').out()
    var verbs_list = sentences.verbs().out('array')
    verbs_list = word_list_to_lemma_list(verbs_list)
    verbs_list = Array.from(new Set(verbs_list))
    var [a, kw_sent_global_idx_dict, c, kw_hits_obj_list] = tfidf_list_2_kw_sent_idx_dict ( verbs_list, sent_info_list, 'kw')
    console.log('from verb_as_kw',kw_hits_obj_list)
    kw_quad_like_list_2 = kw_cluster_wise_by_merge(kw_hits_obj_list)   
    diagonal_kw_sum = diagonal_kw_sum.concat(kw_quad_like_list_2)
    // console.log(sentences.length)
    // console.log(sentences.adjectives().out('array'))
    // console.log(sentences.adjectives().out('freq'))
    // console.log(sentences.nouns().out('array'))
    // console.log(sentences.nouns().out('terms'))
    // console.log(sentences.out('debug'))
    // console.log(sentences.out('tags'))
    // console.log(sentences.adverbs().out('array'))

    // var word_list = sentences.adjectives().out('array')
    // write_file(word_list)
  }


  if(use_kw){
    
    console.log('before content_to_tfidfs')
    var [tfidf_list, tfidf_dict_] = content_to_tfidfs(all_sents_lemma_plain_list.join(' '),false)
    console.log('tfidf_list',tfidf_list)
    cl(tfidf_list)
    if(use_kw_num_cutoff_ratio){
      var upper_limit_num = Math.round(tfidf_list.length * kw_num_cutoff_ratio)
      tfidf_list = tfidf_list.slice(0,upper_limit_num)
    }else if(use_kw_num_cutoff_value){
      var upper_limit_num = kw_num_cutoff_value < tfidf_list.length? kw_num_cutoff_value : tfidf_list.length
      tfidf_list = tfidf_list.slice(0,upper_limit_num)
    }
    cl('after cutoff')
    cl(tfidf_list)
    var [a, kw_sent_global_idx_dict, c, kw_hits_obj_list] = tfidf_list_2_kw_sent_idx_dict ( tfidf_list, sent_info_list, 'kw')
    console.log('kw_hits_obj_list',kw_hits_obj_list)
    cl(kw_hits_obj_list)
    // var kw_hits_obj_list = n_grams_ (sent_info_list,1,1,reoccur_cutoff,do_idf = true)
    var kw_hits_obj_list_more_than_once = []
    kw_hits_obj_list.map(function(k){
      // console.log(k)
      // if(k.hits.length >= 2){ 2020-10-23
      if(k.hits.length >= options.kw_min ){
        kw_hits_obj_list_more_than_once.push(k)
      }    
    })
    console.log('kw_hits_obj_list_more_than_once 0721',kw_hits_obj_list_more_than_once)
    if(options.do_clustering){
      var kw_quad_like_list = kw_cluster_wise_by_merge(kw_hits_obj_list_more_than_once,no_merge=false)
    }else{
      var kw_quad_like_list = kw_cluster_wise_by_merge(kw_hits_obj_list_more_than_once,no_merge=true)
    }
    // kw_quad_like_list = kw_cluster_wise_by_merge( kw_hits_obj_list_more_than_once )
    cl(kw_quad_like_list)
    console.log('kw_quad_like_list 0721',kw_quad_like_list)
    var kw_quad_like_list_2 = []
    kw_quad_like_list.map(function(k){
      // console.log(k)
      if(k.dense_hits.length >= 2){
        kw_quad_like_list_2.push(k)
      }    
    })
    console.log('kw_quad_like_list filtered 0721',kw_quad_like_list_2)
    cl(kw_quad_like_list_2)
    diagonal_kw_sum = diagonal_kw_sum.concat(kw_quad_like_list_2)

  }
  

  // console.log('quad diagonal_kw_sum',diagonal_kw_sum)
  // diagonal_kw_sum = truncated_kw_filter(diagonal_kw_sum)
  // console.log('after truncated_kw_filter',diagonal_kw_sum)
  // return


  if(use_kw_pair){
    var [kw_pair_list, kw_pair_list_plain, kw_pair_dict_list, kw_pair_quad_like_list] = get_kw_pair_boolean_product_sum_and_kw_order_list(diagonal_kw_sum, sent_info_list,'kw_pair')

    if(kw_pair_cluster_wise){
      // console.log('kw_pair_quad_like_list - before',kw_pair_quad_like_list) 
      kw_pair_quad_like_list = kw_pair_cluster_wise_by_merge(kw_pair_quad_like_list)
      // console.log('kw_pair_quad_like_list - after',kw_pair_quad_like_list)
    }  
    diagonal_kw_sum = kw_pair_quad_like_list.concat(diagonal_kw_sum)
  }
  

  if(use_n_gram){
    $.post('doing_n_grams_with_sent_num:'+sent_info_list.length)
    // var before_n_gram = new Date()
    // var n_gram_list = n_grams(all_sents_lemma_plain_list,1,n_gram_max,reoccur_cutoff)
    var n_gram_list_ = n_grams_ (sent_info_list,2,n_gram_max,reoccur_cutoff,do_idf = true)//n_gram_min use '1' for we need 1-gram idf
 

    if(false){
      var [a, kw_sent_global_idx_dict, c, kw_hits_obj_list] = tfidf_list_2_kw_sent_idx_dict( n_gram_list, sent_info_list, 'n_gram' )
      console.log('n_gram_kw_hits_obj_list',kw_hits_obj_list)
    } 
    var kw_hits_obj_list = n_gram_list_
    
    $.post('doing_n_gram_quad_gen_from_list')
    $.post('with_kw_hits_obj_list_length_'+kw_hits_obj_list.length)

    if(options.do_clustering){
      var n_gram_quad_like_list = n_gram_quad_gen_from_list(kw_hits_obj_list,no_merge=false)
    }else{
      var n_gram_quad_like_list = n_gram_quad_gen_from_list(kw_hits_obj_list,no_merge=true)
    }
    // var n_gram_quad_like_list = n_gram_quad_gen_from_list(kw_hits_obj_list)
    console.log('n_gram_quad_like_list',n_gram_quad_like_list)  

    diagonal_kw_sum = n_gram_quad_like_list.concat(diagonal_kw_sum)
  }
  

  console.log('diagonal_kw_sum before sort',diagonal_kw_sum)
  diagonal_kw_sum.sort((a,b)=>a['dense_hits'][0]-b['dense_hits'][0])
  console.log('diagonal_kw_sum after sort',diagonal_kw_sum)


  // var diagonal_kw_sum = kw_hits_obj_list.concat(kw_pair_quad_like_list)

  
  if(diagonal_kw_sum.length == 0){
    alert('diagonal_kw_sum.length == 0')
  }

  $.post('num_original_'+diagonal_kw_sum.length)

  //customized_min_dense_discard_cutoff
  console.log('before customized_min_dense_discard_cutoff 0721',diagonal_kw_sum)
  if( customized_min_dense_discard_cutoff > 0 ){
    var diagonal_kw_sum_new_list = []
    for(var i=0; i<diagonal_kw_sum.length; i++){
      if(diagonal_kw_sum[i].dense_hits != undefined){
        // console.log(diagonal_kw_sum[i].dense_hits)
        if(diagonal_kw_sum[i].dense_hits.length >= customized_min_dense_discard_cutoff){
          diagonal_kw_sum_new_list.push(diagonal_kw_sum[i])
        }
      }else{
        console.error('diagonal_kw_sum[i].dense_hits == undefined')
      }
    }
    console.log('customized_min_dense_discard_cutoff',customized_min_dense_discard_cutoff)
    console.log( 'diagonal_kw_sum_new_list' , diagonal_kw_sum_new_list )
    $.post('num_after_customized_min_dense_discard_cutoff_'+diagonal_kw_sum_new_list.length)
    diagonal_kw_sum = diagonal_kw_sum_new_list
  }
  console.log('after customized_min_dense_discard_cutoff 0721',diagonal_kw_sum)
  

  var diagonal_kw_sum_declustered_tmp_dict = {}
  for(var i=0; i<diagonal_kw_sum.length; i++){
    var u = diagonal_kw_sum[i]
    var u_new = []
    u_new.query_type = u.query_type    
    u_new.kw = u.kw
    u_new.hits = u.hits
    diagonal_kw_sum_declustered_tmp_dict[u.query_type+'_'+u.kw] = u_new
  }
  var diagonal_kw_sum_declustered_tmp_list = []
  for(var v of Object.keys(diagonal_kw_sum_declustered_tmp_dict).map(k=>diagonal_kw_sum_declustered_tmp_dict[k])){
    diagonal_kw_sum_declustered_tmp_list.push(v)
  }
  console.log('diagonal_kw_sum_declustered_tmp_list',diagonal_kw_sum_declustered_tmp_list)
  $.post('num_after_declustered_'+diagonal_kw_sum_declustered_tmp_list.length)

  $.post('doing_super_calc')  
  super_equal_nester_marker( diagonal_kw_sum_declustered_tmp_list )
  console.log('diagonal_kw_sum_declustered_tmp_list',diagonal_kw_sum_declustered_tmp_list)

  for(var u of diagonal_kw_sum_declustered_tmp_list){
    diagonal_kw_sum_declustered_tmp_dict[u.query_type+'_'+u.kw].super =  u.super
    diagonal_kw_sum_declustered_tmp_dict[u.query_type+'_'+u.kw].equal =  u.equal
    diagonal_kw_sum_declustered_tmp_dict[u.query_type+'_'+u.kw].nester = u.nester
  }

  for(var u of diagonal_kw_sum){
    u.super  =  diagonal_kw_sum_declustered_tmp_dict[u.query_type+'_'+u.kw].super 
    u.equal  =  diagonal_kw_sum_declustered_tmp_dict[u.query_type+'_'+u.kw].equal 
    u.nester =  diagonal_kw_sum_declustered_tmp_dict[u.query_type+'_'+u.kw].nester
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
    
    if(n_gram_dense_hit_num_vs_occurence_num_dict[a['dense_hits'].length] == undefined){
        // console.log('n_gram_hit_num_vs_phrases_dict[a.hits.length]',n_gram_hit_num_vs_phrases_dict[a.hits.length])
        n_gram_dense_hit_num_vs_occurence_num_dict[a['dense_hits'].length] = [a.kw]
      }else{
        n_gram_dense_hit_num_vs_occurence_num_dict[a['dense_hits'].length].push(a.kw)
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
  

  $.post('drawing_hist')
//hit_num_vs_phrases_num_hist
//hit_num_vs_phrases_num_hist
//hit_num_vs_phrases_num_hist
//hit_num_vs_phrases_num_hist
//hit_num_vs_phrases_num_hist

  diving('n_grams',parent = '#head_container',class_ = '',background = 'rgba(246,246,246,1)',position = 'relative',z_index = 0,display='block',width='')
  var draw = SVG('n_grams')

  var x_shift = 120
  var y_shift = 30 + 45 + 25
  var rect_width_unit = 20
  var rect_height_max = 120

  var rect_width_sum = X_MAX < n_gram_hit_num_vs_phrases_num_list.slice(-1)[0][0] * rect_width_unit? X_MAX : n_gram_hit_num_vs_phrases_num_list.slice(-1)[0][0] * rect_width_unit
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
    draw.plain(Math.round(i[1]/rect_height_factor)).attr({x:i[0] - rect_width_unit + x_shift,y:rect_height_max - i[1] + y_shift - 3}).size(2)
  }
  draw.size('100%',rect_height_max + 20 + y_shift + 20)


  var input_range_min = $('<input></input>').attr({
    id:'n_gram_display_min_hits_filter',
    type:'range',
    min:1,
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
  $('div#n_grams').append(div_filter_min)




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
        console.log('n_gram_display_min_dense_hit_num_cutoff_value',n_gram_display_min_dense_hit_num_cutoff_value)
        n_gram_display_min_dense_hit_num_cutoff_value_found = true
        break
      }
    }
    if(n_gram_display_min_dense_hit_num_cutoff_value_found = false){
      console.log('n_gram_display_min_dense_hit_num_cutoff_value',n_gram_display_min_dense_hit_num_cutoff_value)
      n_gram_display_min_dense_hit_num_cutoff_value = n_gram_display_max_dense_hit_num_cutoff_value
    }    
  }
  if(customized_min_dense_discard_cutoff.length > 0){
    n_gram_display_min_dense_hit_num_cutoff_value = customized_min_dense_discard_cutoff
    console.log(customized_min_dense_discard_cutoff)
  }

//n_gram_dense_hit_num_vs_occurence_num
//n_gram_dense_hit_num_vs_occurence_num
//n_gram_dense_hit_num_vs_occurence_num
//n_gram_dense_hit_num_vs_occurence_num

  diving('n_gram_dense_hit_num_vs_occurence_num',parent = '#head_container',class_ = '',background = 'rgba(246,246,246,1)',position = 'relative',z_index = 0,display='inline-block',width='70%')
  var draw = SVG('n_gram_dense_hit_num_vs_occurence_num')//.size('100%', 1000)
  // var polyline = draw.polyline().fill('none').stroke({ width: 3 })
  // polyline.plot([[100,10],[200,400],[300,10]])
  // polyline.plot()
  var x_shift = 100
  var y_shift = 30
  var rect_width_unit = 20

  // console.log('n_gram_dense_hit_num_vs_occurence_num_list',n_gram_dense_hit_num_vs_occurence_num_list)
  var rect_width_sum = 1000 < n_gram_dense_hit_num_vs_occurence_num_list.slice(-1)[0][0] * rect_width_unit? 1000 : n_gram_dense_hit_num_vs_occurence_num_list.slice(-1)[0][0] * rect_width_unit

  rect_width_unit = rect_width_sum/n_gram_dense_hit_num_vs_occurence_num_list.slice(-1)[0][0]

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
    draw.plain(Math.round(i[0]/rect_width_unit)).attr({x:i[0] + x_shift,y:rect_height_max + 20 + y_shift})
    draw.plain(Math.round(i[1]/rect_height_factor)).attr({x:i[0] + x_shift,y:rect_height_max - i[1] + y_shift - 3}).size(2)
  }
  draw.size('100%',rect_height_max + 20 + y_shift + 20)

  if(customized_min_dense_show_cutoff.length > 0){
    var input_range_min_value = customized_min_dense_show_cutoff
  }else{
    var input_range_min_value = n_gram_display_min_dense_hit_num_cutoff_value
  }
  var input_range_min = $('<input></input>').attr({
    id:'n_gram_display_min_dense_hit_num_filter',
    type:'range',
    min:1,
    max:n_gram_dense_hit_num_vs_occurence_num_list[n_gram_dense_hit_num_vs_occurence_num_list.length-1][0],
    value:input_range_min_value
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
 




  diving('doc_title',parent = 'div#head_container',class_ = '',background = 'rgba(246,246,246,1)',position = 'relative',z_index = 0,display='block',width='100%')
  $('#doc_title').html(pdf_file_name.split('.pdf')[0])




  $('#head_container').append($('#grid_displayer').css({display:'grid'}))
  $('#cutoff_info').html('min_dense_cutoff: '+n_gram_display_min_dense_hit_num_cutoff_value)

  // var div_displayer_container = $('<div></div>').attr({
  //   id:'div_displayer_container'
  // })
  // div_displayer_container.css({
  //   background:'rgb(246,246,246)',
  //   padding:'25px 120px',
  //   // position:'relative',
  //   // left:'120px'
  // })
  // $('body').append(div_displayer_container)
  

  // div_displayer_container.append( $('<div></div>').attr({id:'display_line_1'})
  // .css({    display:'block',    padding:'0px 0px',    'font-size':'20px',  }) )

  // $('div#display_line_1').append($('<p></p>').attr({id:'per_sents_idx_type_n_multi_type_promise_info'})
  // .css({    display:'inline',    padding:'0px 0px',    'font-size':'20px',  }))


  // var div_displayer = $('<div>div_displayer</div>').attr({
  //   id:'div_displayer'
  // })
  // div_displayer.css({
  //   background:'rgb(246,246,246)',
  //   'font-size':'20px',
  //   display:'inline'
  //   // position:'relative'
  // })
  // div_displayer_container.append(div_displayer)

  // var cutoff_info = $('<p></p>').attr({id:'cutoff_info'})
  // .css({ display:'inline',padding:'0px 25px','font-size':'20px',})
  // .html('min_dense_cutoff: '+n_gram_display_min_dense_hit_num_cutoff_value)
  // div_displayer_container.append(cutoff_info)
  // $('#cutoff_info').html('min_dense_cutoff: '+n_gram_display_min_dense_hit_num_cutoff_value)

  // var unique_display_unit_num = $('<p>unique_display_unit_num</p>').attr({id:'unique_display_unit_num'})
  // .css({    display:'inline',    padding:'0px 25px',    'font-size':'20px',  })
  // div_displayer_container.append(unique_display_unit_num)

  // var display_unit_num = $('<p>display_unit_num</p>').attr({id:'display_unit_num'})
  // .css({    display:'inline',    padding:'0px 25px',    'font-size':'20px',  })
  // div_displayer_container.append(display_unit_num)

  // var unique_display_unit_num_tmp = $('<p>unique_display_unit_num_tmp</p>').attr({id:'unique_display_unit_num_tmp'})
  // .css({    display:'inline',    padding:'0px 25px',    'font-size':'20px',  })
  // div_displayer_container.append(unique_display_unit_num_tmp)

  // var display_unit_num_tmp = $('<p>display_unit_num_tmp</p>').attr({id:'display_unit_num_tmp'})
  // .css({    display:'inline',    padding:'0px 25px',    'font-size':'20px',  })
  // div_displayer_container.append(display_unit_num_tmp)


  
  
  
//div_draw_by_click
//div_draw_by_click
//div_draw_by_click
//div_draw_by_click
//div_draw_by_click

  if(use_div_draw_by_click){
    var div_draw_by_click = $('<div></div>').css({'background':'rgb(246,246,246)'}).attr({id:'div_draw_by_click'})
    $('body').append(div_draw_by_click)
    var kw_append_record_list = []
    for(var i in diagonal_kw_sum){

      if(diagonal_kw_sum[i].super != undefined && diagonal_kw_sum[i].query_type == 'n_gram'){
        continue
      }else if(hide_almost_supered){
        if(diagonal_kw_sum[i].nester != undefined){
          diagonal_kw_sum[i].nester = diagonal_kw_sum[i].nester.sort((a,b)=>a[1]-b[1])
          if(diagonal_kw_sum[i].nester[0][1]<=1.2){
            continue
          }
        }      
      }else if(diagonal_kw_sum[i].n != undefined && diagonal_kw_sum[i].n > max_n_of_n_gram_displayed && diagonal_kw_sum[i].query_type == 'n_gram'){
        continue
      }else if(max_display_unit_draw_num > 0 ){
        if(only_require_unit_total_hits_above_calculated_min_dense_cutoff){
          var to_be_cutoffed = diagonal_kw_sum[i].hits.length
        }else{
          var to_be_cutoffed = diagonal_kw_sum[i]['dense_hits'].length
        }           
        if(to_be_cutoffed < n_gram_display_min_dense_hit_num_cutoff_value && filter_terms_with_min_dense_hit_cutoff == true){
          continue
        }
      }

      if(hide_super_and_equal){
        if(diagonal_kw_sum[i].equal != undefined && diagonal_kw_sum[i].query_type == 'kw'){
        continue
        }
        if(diagonal_kw_sum[i].super != undefined && diagonal_kw_sum[i].query_type == 'kw'){
        continue
        }      
        if(diagonal_kw_sum[i].equal != undefined && diagonal_kw_sum[i].query_type == 'kw_pair'){
        continue
        }
        if(diagonal_kw_sum[i].super != undefined && diagonal_kw_sum[i].query_type == 'kw_pair'){
        continue
        }
      }
      

      if(kw_append_record_list.includes(diagonal_kw_sum[i].kw)){continue}
      var kw_div = $('<div></div>').html(diagonal_kw_sum[i].kw+
        // '  ('+diagonal_kw_sum[i].hits.length+''+
        // ''+diagonal_kw_sum[i].query_type+'' +
        // ''+diagonal_kw_sum[i]['dense_hits'].length+')'+
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
  }

  // print_svg(n_gram_list,'n_grams')
  $.post('draw_zoom')
  console.log('diagonal_kw_sum before draw_zoom',diagonal_kw_sum)
  // console.log('sent_info_list[17]',sent_info_list[17]['sent'])
  // console.log('sent_info_list[72]',sent_info_list[72]['sent'])
  // draw_zoom(diagonal_kw_sum, [sent_info_list[17],sent_info_list[72]])
  $('#outerContainer').animate({left:'100%'})
  // diving('svg_container',-1,'relative')
  draw_titles()
  //filter super, equal, nester(weak) to accelarate mutual enrichment
  //filter super, equal, nester(weak) to accelarate mutual enrichment
  //filter super, equal, nester(weak) to accelarate mutual enrichment
  console.log('before diagonal_kw_sum_filtered_tmp_list 0721',diagonal_kw_sum)
  var diagonal_kw_sum_filtered_tmp_list = []
  for(var i in diagonal_kw_sum){

    if(diagonal_kw_sum[i].super != undefined && diagonal_kw_sum[i].query_type == 'n_gram'){
      continue
    }else if(hide_almost_supered){
      if(diagonal_kw_sum[i].nester != undefined){
        diagonal_kw_sum[i].nester = diagonal_kw_sum[i].nester.sort((a,b)=>a[1]-b[1])
        if(diagonal_kw_sum[i].nester[0][1]<=1.2){
          continue
        }
      }      
    }else if(diagonal_kw_sum[i].n != undefined && diagonal_kw_sum[i].n > max_n_of_n_gram_displayed && diagonal_kw_sum[i].query_type == 'n_gram'){
      continue
    }else if(max_display_unit_draw_num > 0 ){
      if(only_require_unit_total_hits_above_calculated_min_dense_cutoff){
        var to_be_cutoffed = diagonal_kw_sum[i].hits.length
      }else{
        var to_be_cutoffed = diagonal_kw_sum[i]['dense_hits'].length
      }           
      if(to_be_cutoffed < n_gram_display_min_dense_hit_num_cutoff_value && filter_terms_with_min_dense_hit_cutoff == true){
        continue
      }
    }

    if(hide_super_and_equal){
      if(diagonal_kw_sum[i].equal != undefined && diagonal_kw_sum[i].query_type == 'kw'){
      continue
      }
      if(diagonal_kw_sum[i].super != undefined && diagonal_kw_sum[i].query_type == 'kw'){
      continue
      }      
      if(diagonal_kw_sum[i].equal != undefined && diagonal_kw_sum[i].query_type == 'kw_pair'){
      continue
      }
      if(diagonal_kw_sum[i].super != undefined && diagonal_kw_sum[i].query_type == 'kw_pair'){
      continue
      }
    }

    diagonal_kw_sum_filtered_tmp_list.push(diagonal_kw_sum[i])
  }
  diagonal_kw_sum = diagonal_kw_sum_filtered_tmp_list
  console.log('after diagonal_kw_sum_filtered_tmp_list 0721',diagonal_kw_sum)


  //mutual enrichment calc
  //mutual enrichment calc
  //mutual enrichment calc
  // this.per_sents_idx_type_n_multi_type_promise_list = []
  // per_sents_idx_type_n_multi_type_promise_list = []
  new Promise((r,j)=>{
    
    if(options.do_mutual_enrich){

      // var doc_promise = new Promise(r=>{doc_resolved=r})
      // var words_dictionary_promise = new Promise(r=>{words_dictionary_resolved=r})
      // $.getJSON('diagonal_kw_sum.json',function(j){
      //   diagonal_kw_sum = j;
      //   console.log('diagonal_kw_sum',j)
      //   words_dictionary_resolved()
      // })

      $.getJSON( 'json/'+pdf_file_name.split('.pdf')[0] + '.json',
      function(j){
        // alert(typeof j)        
        console.log('j',j)
        diagonal_kw_sum = j
        // alert('diagonal_kw_sum',diagonal_kw_sum)
        console.log('got diagonal_kw_sum',diagonal_kw_sum)
        // words_dictionary_resolved()
      }
      )
      .done(function() {
        // alert('getJSON request succeeded!') 
        r() 
        options.mutual_enriched_json_existed = true
      })
      .fail(function() {

        // alert('getJSON request failed!')
        summary_gen({diagonal_kw_sum_:diagonal_kw_sum,summary_gen_resolved:r,
        dense_block_spanned_sents_idx_off:options.dense_block_spanned_sents_idx_off})
        options.mutual_enriched_json_existed = false

      })

      
    }else{
      r()
    }
    // summary_gen({summary_gen_resolved:r})

  }).then((r,j)=>{

    return new Promise((r,j)=>{

      // post diagonal_kw_sum json with mutual enrichment to server 
      if (options.mutual_enriched_json_existed == false){
      var diagonal_kw_sum_json = JSON.stringify( diagonal_kw_sum )
      $.post('/',{
        pdf_file_name : pdf_file_name,
        diagonal_kw_sum_json : diagonal_kw_sum_json
        },
        function(data){
          console.log(data)
        })
      }

      var mutual_unique_max_num = 0
      var mutual_unique_min_num = Infinity
      for(var kw_unit of diagonal_kw_sum){
        if(kw_unit.mutual_unique != undefined){
          mutual_unique_max_num = kw_unit.mutual_unique.length > mutual_unique_max_num? kw_unit.mutual_unique.length:mutual_unique_max_num
          mutual_unique_min_num = kw_unit.mutual_unique.length < mutual_unique_min_num? kw_unit.mutual_unique.length:mutual_unique_min_num      
        }      
      }
      for(var kw_unit of diagonal_kw_sum){
        if(kw_unit.mutual_unique != undefined){
          kw_unit['normalized_mutual_unique_num'] = (kw_unit.mutual_unique.length - mutual_unique_min_num)/(mutual_unique_max_num - mutual_unique_min_num)
        }      
      }
      console.log(mutual_unique_min_num,mutual_unique_max_num)
      // console.log(diagonal_kw_sum)
      // return
      
      
      raw['display_unit'] = diagonal_kw_sum
      var para_draw_zoom = {unit:diagonal_kw_sum, sents_list:sent_info_list, not_use_set_interval_temp:false, 
      circle_class:'', drawing_on_click_summary:false, 
      draw_resolved_:r, polyline_only:polyline_only,
      source:'main', tigger:'diagonal_kw_sum', mutual_enriched_only:options.mutual_enriched_only}

      draw_zoom(para_draw_zoom)
    })

    // var display_unit_id_log_list_resolved
    // var promise_for_draw_zoom = new Promise(r=>{display_unit_id_log_list_resolved = r})    
    
    // promise_for_draw_zoom.then(function([display_unit_id_log_list, display_unit_kw_log_list, display_unit_unique_kw_log_list]){
    //   unique_display_unit_num.html('unique_kw_num: '+display_unit_unique_kw_log_list.length)
    //   display_unit_num.html('display_unit_num: '+display_unit_kw_log_list.length)
    //   $.post('The_End')
    // })

  }).then(function([display_unit_id_log_list, display_unit_kw_log_list, display_unit_unique_kw_log_list]){
      $('unique_display_unit_num_tmp').html('unique_kw_num: '+display_unit_unique_kw_log_list.length)
      $('display_unit_num').html('display_unit_num: '+display_unit_kw_log_list.length)
      $.post('The_End')
      $('#n_gram_display_min_hits_filter').bind('change',n_gram_display_min_hits_filter)
      $('#n_gram_display_max_hits_filter').bind('change',n_gram_display_max_hits_filter)
      // $('#open_in_new_tab').bind('click',open_in_new_tabs)  
      $('#n_gram_display_min_dense_hit_num_filter').bind('change',n_gram_display_min_dense_hits_filter)
      $('#n_gram_display_max_dense_hit_num_filter').bind('change',n_gram_display_max_dense_hits_filter)

      window.scrollBy(0, 600)

      // console.log('diagonal_kw_sum to dl',diagonal_kw_sum)
      // console.log('diagonal_kw_sum_string to dl',JSON.stringify( diagonal_kw_sum ))

      if(false){

        $.getJSON( pdf_file_name.split('.pdf')[0] + '.json',function(j){
          diagonal_kw_sum = j;
          console.log(pdf_file_name.split('.pdf')[0] + '.json found')
          // words_dictionary_resolved()
        })
        .done(function() {
          // alert('getJSON request succeeded!') 
          // r() 
        })
        .fail(function() {
  
          blob = new Blob([ JSON.stringify( diagonal_kw_sum ) ], { type: 'text/plain' }),   
          anchor = document.createElement('a');
          anchor.download = pdf_file_name.split('.pdf')[0] + ".json";
          anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
          anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
          anchor.click();
          // alert('getJSON request failed!')
          // summary_gen({diagonal_kw_sum_:diagonal_kw_sum,summary_gen_resolved:r,
          // dense_block_spanned_sents_idx_off:options.dense_block_spanned_sents_idx_off})
  
        })
      }

    })  
}

if(outline_only){
  console.log('outline_only',outline_only)
  Promise.all([outline_promise]).then(function(){
    console.log('outline_info_array',outline_info_array)
    get_level_from_nested_outline(outline_info_array,1)
    console.log('flat_outline_array iss',flat_outline_array)
  })

}else{
  if (one_page_one_section == true){
  
  Promise.all([kw_promise, doc_promise, words_dictionary_promise, word_idf_dict_promise, chinese_stop_words_dict_promise]).then(function(){

  promises_resolved()

  })
  
  }else{
    Promise.all([kw_promise, doc_promise, words_dictionary_promise, word_idf_dict_promise, chinese_stop_words_dict_promise, outline_promise]).then(function(){

    promises_resolved()

    })
  }
}


//obsoleted
//obsoleted
//obsoleted
//obsoleted
//obsoleted
//obsoleted
// if(false){
//     $('#outerContainer').animate({left:'100%'})
//     diving('svg_container_2')
//     var draw = SVG('svg_container_2').size('100%', 1000)
//     var counter = 1

//     var all_sents_original_plain_list = []
//     var optional_options = {};
//     var global_sent_id_counter = 0;
//     for (var page_index = 0; page_index < pageContents.length; page_index++){
//       var pageNum = page_index + 1;
//       var text = pageContents[page_index];
//       var sentences = tokenizer.sentences(text, optional_options);
//       //find the ').' long sentences
//       // console.log('sentences length',sentences.length)
//       sentences_2 = []
//       sentences.forEach(function(i){
//         i.replace(/(\)\.)[^$]/g,'$1|').split('|').forEach(function(a){
//           if (a != ''){sentences_2.push(a)}
//         })
//       })
//       // sentences_2.forEach(function(a){
//       //   if(a.match(/(\)\.)[^$]/g)){console.log(a)}
//       // })     
//       sentences_4 = []
//       sentences_2.forEach(function(i){
//         i.replace(/([,•])[^$]/g,'$1|').split('|').forEach(function(a){
//           if (a != ''){sentences_4.push(a)}
//         })
//       })
//       for (var sent_index = 0; sent_index < sentences_4.length; sent_index++){
//         var sent_str = sentences_4[sent_index]
//         all_sents_original_plain_list.push(sent_str)
//         var sent_str_lemma = str_to_nonstop_long_lemma_str(sent_str)
//         all_sents_lemma_plain_list.push(sent_str_lemma)
//       }
//     }

//     // all_sents_original_plain_list = ['short sent'].concat(all_sents_original_plain_list)
//     var n_gram_filtered_list = []
//     for(var n = 3; n<= 10; n++){
//       var n_gram_dict = {}
//       for (var i = 0; i < all_sents_lemma_plain_list.length; i++) {
//         var sent_ori = all_sents_lemma_plain_list[i]
//         // draw.plain(sent_ori).attr({x:50,y:counter*15}).size(10).fill('black')
//         // counter += 1

//         var word_list = sent_ori.match(/[a-zA-Z]+/g)
//         if(word_list == null){
//           continue
//         }
//         for (var j = 0; j < word_list.length - (n - 1); j++) {
//           var n_gram = word_list.slice(j,j+n)
//           n_gram_dict[n_gram] = n_gram_dict[n_gram]? n_gram_dict[n_gram]+1 : 1
//           // draw.plain(n_gram).attr({x:50,y:counter*15}).size(7).fill('black')
//           // counter += 1
//         }

//       }
//       var n_gram_list = Object.keys(n_gram_dict).map(k=>[k,n_gram_dict[k]])
//       n_gram_list.sort((a,b)=>b[1]-a[1])
//       if(n_gram_list[0][1]<2){
//         break
//       }
//       console.log('n',n)
//       draw.plain(n).attr({x:50,y:counter*15}).size(7).fill('black')
//       counter += 1
//       console.log('n_gram_dict',n_gram_dict)
//       console.log('n_gram_list',n_gram_list)
//       n_gram_list.map(a=>{
//         if(a[1]>1){
//           n_gram_filtered_list.push(a)
//           console.log(a[0],a[1])
//           draw.plain(a[0],a[1]).attr({x:50,y:counter*15}).size(7).fill('black')
//           counter += 1
//         }
//       })
//     }
//     var hight = 1000 > counter*15 ? 1000:counter*15
//     draw.size(2000,hight)
//     console.log('n_gram_filtered_list',n_gram_filtered_list)
//     return
//   }