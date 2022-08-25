stopword_list = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"]

var lemmatizer = new Lemmatizer()
var sw = require('stopword')

function n_grams_(sent_list,n_min=2,n_max=70,min_reoccurence_cutoff_of_n_gram=2,do_idf=false){
  // $.post('from_n_grams')  
  console.trace('from n_grams')  
  raw['chinese_run_list'] = []
  raw['chinese_nonstop_run_list'] = []
  raw['chinese_destop_run_list'] = []
  raw['n_gram_dict_list'] = []
  var sent_or_doc_num = sent_list.length

  var n_gram_filtered_list = []
  for(var n = n_min; n<= n_max; n++){
    // $.post('n:_'+n+'_from_n_grams')
    console.log('n:_'+n+'_from_n_grams')
    // console.log('n',n)
    // var n_gram_dict = {}
    var n_gram_dict = Object.create(null)//so to avoid the prototype property of 'constructor'
    
    for (var i = 0; i < sent_list.length; i++) {
      var sent_ori = sent_list[i].sent_lemma
      // draw.plain(sent_ori).attr({x:50,y:counter*15}).size(10).fill('black')
      // counter += 1
      if( raw.lang_type_dict[ sent_list[i].global_sent_idx ] != undefined){
        var mainly_english = raw.lang_type_dict[ sent_list[i].global_sent_idx ]
      }else{
        if(sent_ori.match(/[\u4e00-\u9fa5]/g) != null && sent_ori.match(/[a-zA-Z]{3,}/g) != null){
          if(sent_ori.match(/[a-zA-Z]{3,}/g).length >= sent_ori.match(/[\u4e00-\u9fa5]/g).length){
            var mainly_english = true
          }else{
            var mainly_english = false
          }
        }else if(sent_ori.match(/[\u4e00-\u9fa5]/g) == null){
          var mainly_english = true
        }else if(sent_ori.match(/[a-zA-Z]{3,}/g) == null){
          var mainly_english = false
        }
        raw.lang_type_dict[ sent_list[i].global_sent_idx ] = mainly_english
      }
      
      // console.log('mainly_english',mainly_english)

      if(mainly_english){
        if( raw['english_nonstop_lemma_words_list_dict'] != undefined ){
          var word_list = sent_ori.match(/[a-zA-Z]+/g)
          raw['english_nonstop_lemma_words_list_dict'][ sent_list[i].global_sent_idx ] = word_list
        }else{
          var word_list = raw['english_nonstop_lemma_words_list_dict'][ sent_list[i].global_sent_idx ]
        }
        

        if(word_list == null){
          console.warn('No regular english words in sent:',
            i,' of ',sent_list,' as: ',sent_ori)
          continue
        }
        // console.log('word_list',word_list)
        for (var j = 0; j < word_list.length - (n - 1); j++) {
          var n_gram = word_list.slice(j,j+(+n)).join(' ')
          if(n_gram_dict[n_gram] == undefined){
            n_gram_dict[n_gram] = [sent_list[i].global_sent_idx]
          }else{
            n_gram_dict[n_gram].push(sent_list[i].global_sent_idx)
          }
        }

      }else{
        if( raw.chinese_nonstop_run_dict[sent_list[i].global_sent_idx] != undefined){
          var chinese_nonstop_run_list = raw.chinese_nonstop_run_dict[sent_list[i].global_sent_idx]
        }else{
          var sent_cn = sent_list[i].sent_chinese_compact
          for(var w of chinese_stop_words_list){
              sent_cn = sent_cn.replace(new RegExp(w,'g'),'%_%')
          }          
          var chinese_nonstop_run_list = sent_cn.match(/[\u4e00-\u9fa5]+/g)
          if(chinese_nonstop_run_list == null){
            console.warn('chinese_run_list == null from n_grams')
            continue
          }
          raw.chinese_nonstop_run_list.push(chinese_nonstop_run_list)
          raw.chinese_nonstop_run_dict[sent_list[i].global_sent_idx] = chinese_nonstop_run_list
        }        

        for(var run of chinese_nonstop_run_list){
          for (var j = 0; j < run.length - (n - 1); j++) {
            var n_gram = run.slice(j,j+(+n))//.join('')
            // console.log(n_gram)
            if(n_gram_dict[n_gram] == undefined){
              n_gram_dict[n_gram] = [sent_list[i].global_sent_idx]
            }else{
              n_gram_dict[n_gram].push(sent_list[i].global_sent_idx)
            }
          }
        }
      }
    }
    raw.n_gram_dict_list.push(n_gram_dict)
    var n_gram_list = Object.keys(n_gram_dict).map(k=>{
      var temp = [k,n_gram_dict[k].length,n_gram_dict[k]]
      temp.kw = k
      temp.hits = n_gram_dict[k]
      temp.hits_num = n_gram_dict[k].length
      temp.n = n
      temp.query_type = 'n_gram'
      if( do_idf ){
        var inde_hits_num = Array.from((new Set( n_gram_dict[k] ))).length
        temp.idf = sent_or_doc_num / inde_hits_num
        temp.df = inde_hits_num / sent_or_doc_num
      }
      return temp
    })
    // console.log('n',n,'n_gram_list ori',n_gram_list)
    if(n_gram_list.length == 0){//when sent has too few words(e.g. 1 word)???
      console.warn('n',n,'n_gram_list.length == 0')
      break
    }
    n_gram_list.sort((a,b)=>b[1]-a[1])
    // console.log('n',n,'n_gram_list after sort',n_gram_list)
    if(n_gram_list[0].hits_num < min_reoccurence_cutoff_of_n_gram ){
      break
    }
    n_gram_list.map(a=>{
      if( +a.hits_num >= +min_reoccurence_cutoff_of_n_gram){
        // console.log(n,a[0])
        n_gram_filtered_list.push(a)
      }
    })
  }
  raw.n_gram_filtered_list = n_gram_filtered_list
  return n_gram_filtered_list
}




function get_kw_pair_boolean_product_sum_and_kw_order_list(kw_list,sents_list,query_type,kw_index_offset_cutoff = -1,min_coocurrence = 2){
  // kw_sent_idx_dict = {};
  kw_sent_boolean_dict = {};
  for (var j = 0; j< kw_list.length; j++){

    if(typeof kw_list[j] == 'string'){
        var kw = kw_list[j]
      }else{
        var kw = kw_list[j][0]
      }
      
      if(kw_sent_boolean_dict.hasOwnProperty(kw)){
        continue
      }

    for (var i = 0; i< sents_list.length; i++){

      var sent = sents_list[i]['sent_lemma']

      var re = new RegExp('\\b'+ kw,'i')
      if(sent.match(re)){
        var match = re.exec(sent)
        var index = match.index
        var substring_until_match_index = sent.substring(0,index)
        var substring_words_list = substring_until_match_index.match(/[a-zA-Z]+/gi)
        // console.log('kw',kw)
        // console.log('substring_until_match_index',substring_until_match_index)
        // console.log('substring_words_list',substring_words_list)
        var substring_until_match_index_word_num = substring_words_list == null? 0:substring_words_list.length
        // console.log('match and index',match,index)
        if(!kw_sent_boolean_dict.hasOwnProperty(kw)){
          // kw_sent_idx_dict[kw] = [i];
          kw_sent_boolean_dict[kw] = [[1,substring_until_match_index_word_num,sents_list[i]['global_sent_idx']]]
        }else{
          // kw_sent_idx_dict[kw].push(i)
          kw_sent_boolean_dict[kw].push([1,substring_until_match_index_word_num,sents_list[i]['global_sent_idx']])
        }
      }else{
        if(!kw_sent_boolean_dict.hasOwnProperty(kw)){
          kw_sent_boolean_dict[kw] = [[0,NaN,sents_list[i]['global_sent_idx']]]
        }else{
          kw_sent_boolean_dict[kw].push([0,NaN,sents_list[i]['global_sent_idx']])
        }
      }
    }
  }
  console.log('kw_sent_boolean_dict',kw_sent_boolean_dict)

  var kw_pair_boolean_product_sum_and_kw_order_list = []
  for(var a in kw_sent_boolean_dict){
    for(var b in kw_sent_boolean_dict){
       a_boolean_array = kw_sent_boolean_dict[a]
       b_boolean_array = kw_sent_boolean_dict[b]
       var boolean_product_list = []
       var index_diff_list = []
       var a_before_b_counter = []
       var b_before_a_counter = []
       // console.log('a',a,'b',b)
       // console.log('a_boolean_array',a_boolean_array)
       // console.log('b_boolean_array',b_boolean_array)
       var co_occur_sent_idx_list = []
       for (var i = 0; i < a_boolean_array.length; i++) {
        if(a_boolean_array[i][0] == 1 && b_boolean_array[i][0] == 1){
          // console.log('a_boolean_array[i][0]',a_boolean_array[i][0])
          // console.log('b_boolean_array[i][0]',b_boolean_array[i][0])
          // console.log('a_boolean_array[i][0]*b_boolean_array[i][0]',a_boolean_array[i][0]*b_boolean_array[i][0])
         index_diff_list.push(a_boolean_array[i][1] - b_boolean_array[i][1])
         var word_index_diff = a_boolean_array[i][1] - b_boolean_array[i][1]
         if(word_index_diff < 0 && word_index_diff >= kw_index_offset_cutoff){
          boolean_product_list.push(1)
          a_before_b_counter.push(true)
          // co_occur_sent_idx_list.push(i)   //i is just relative sent idx
          co_occur_sent_idx_list.push(a_boolean_array[i][2])
         }
         // else if(a_boolean_array[i][1] - b_boolean_array[i][1] > 0){
         //  b_before_a_counter.push(1)
         // }
        }         
       }      
       // console.log('boolean_product_list',boolean_product_list)
       // console.log('a_before_b_counter',a_before_b_counter)
       // console.log('b_before_a_counter',b_before_a_counter) 
       var boolean_product_sum = boolean_product_list.reduce((a,b)=>a+b,0)
       // var a_before_b = a_before_b_counter.length > b_before_a_counter.length? true : false
       if(a_before_b_counter.length > 0){
        // console.log('a and b',a,b)
        // console.log('a_before_b_counter.length',a_before_b_counter.length)
        // console.log('b_before_a_counter.length',b_before_a_counter.length)
        var co_occur_sent_idx_average = co_occur_sent_idx_list.reduce((a,b)=>a+b,0)/co_occur_sent_idx_list.length/*obsolete*/
        kw_pair_boolean_product_sum_and_kw_order_list.push([a,b,boolean_product_sum,co_occur_sent_idx_average,co_occur_sent_idx_list])
       }
    } 
  }
  kw_pair_boolean_product_sum_and_kw_order_list = kw_pair_boolean_product_sum_and_kw_order_list.sort((a,b)=>b[2]-a[2])
  kw_pair_list = kw_pair_boolean_product_sum_and_kw_order_list.filter(a=>a[2] >= min_coocurrence)
  var kw_pair_dict_list = kw_pair_list.map(a=>{
    return {kw:a[0]+' '+a[1],
            dense_idx:Math.round(a[3])
    }
  })
  var kw_pair_quad_like_list = kw_pair_list.map(a=>{
    var unit = [a[0]+' '+a[1],'clusters_flat',Math.round(a[3])/*obsolete*/,'dense_block','v','round_idx',a[4]]
    unit.hits = a[4]
    unit.kw = a[0]+' '+a[1]
    unit.query_type = query_type
    return unit
  })

  // console.log('kw_pair_list',kw_pair_list)
  var kw_pair_list_plain = kw_pair_list.map(a=>a[0]+' '+a[1])
  return [kw_pair_list, kw_pair_list_plain, kw_pair_dict_list, kw_pair_quad_like_list]
}

function term_in_sent(kw,sent_idx){

  var kw_is_chinese = false
  if(kw.includes(' ')){//&& kw.match(/[\u4e00-\u9fa5]/) == null
    var kw_list = kw.split(' ')
    // var re = new RegExp('\\b'+kw_list.join('\\w*\\W+\\w*\\W*\\w*\\W*'),'i')
    var re = new RegExp('\\b'+kw_list.join('\\w*\\W+\\w*\\W*'),'i')// to be considered
  }else if(typeof kw == 'object'){
    // console.log('n_gram before RE',kw)
    // var re = new RegExp('\\b'+kw.join('\\w*\\W+\\w*\\W*\\w*\\W*'),'i')
    var re = new RegExp('\\b'+kw.join('\\w*\\W+\\w*\\W*'),'i')
  }else if(kw.match(/[\u4e00-\u9fa5]/)){
    var re = new RegExp(kw.split(' ').join(''))
    kw_is_chinese = true
    // console.log(kw)
  }else{
    var re = new RegExp('\\b'+ kw,'i')
  }

  if( kw_is_chinese ){
    if(raw.sent_info_list[sent_idx].hasOwnProperty('sent_chinese_compact')){
      var sent = raw.sent_info_list[sent_idx]['sent_chinese_compact']
    }else{
      var sent = raw.sent_info_list[sent_idx]
    }        
  }else{
    if(raw.sent_info_list[sent_idx].hasOwnProperty('sent_lemma')){
      var sent = raw.sent_info_list[sent_idx]['sent_lemma']
    }else{
      var sent = raw.sent_info_list[sent_idx]
    }
  }

  if(sent.match(re)){
    return true
  }else{
    return false
  }

}

function tfidf_list_2_kw_sent_idx_dict(tfidf_list,sents_list,query_type){
  // if(tfidf_list.length>100){
  //   tfidf_list = tfidf_list.slice(0,100)
  // }
  var kw_sent_idx_dict = {};
  var kw_sent_global_idx_dict = {};
  var kw_truncated_sent_global_idx_dict = {};
  for (var j = 0; j< tfidf_list.length; j++){

    if(typeof tfidf_list[j] == 'string'){
      var kw = tfidf_list[j]
    }else{
      var kw = tfidf_list[j][0]
    }
    
    var kw_is_chinese = false
    if(kw.includes(' ')){//&& kw.match(/[\u4e00-\u9fa5]/) == null
      var kw_list = kw.split(' ')
      // var re = new RegExp('\\b'+kw_list.join('\\w*\\W+\\w*\\W*\\w*\\W*'),'i')
      var re = new RegExp('\\b'+kw_list.join('\\w*\\W+\\w*\\W*'),'i')// to be considered
    }else if(typeof kw == 'object'){
      // console.log('n_gram before RE',kw)
      // var re = new RegExp('\\b'+kw.join('\\w*\\W+\\w*\\W*\\w*\\W*'),'i')
      var re = new RegExp('\\b'+kw.join('\\w*\\W+\\w*\\W*'),'i')
    }else if(kw.match(/[\u4e00-\u9fa5]/)){
      var re = new RegExp(kw.split(' ').join(''))
      kw_is_chinese = true
      // console.log(kw)
    }else{
      var re = new RegExp('\\b'+ kw,'i')
    }

    local_sent_num = sents_list.length
    for (var i = 0; i< local_sent_num; i++){

      if( kw_is_chinese ){
        if(sents_list[i].hasOwnProperty('sent_chinese_compact')){
          var sent = sents_list[i]['sent_chinese_compact']
        }else{
          var sent = sents_list[i]
        }        
      }else{
        if(sents_list[i].hasOwnProperty('sent_lemma')){
          var sent = sents_list[i]['sent_lemma']
        }else{
          var sent = sents_list[i]
        }
      }
      

      if(sent.match(re)){
        // console.log(sent)
        // if(kw == 'support darwinian evolution'){
          // console.log('support darwinian evolution',j,sents_list[i].global_sent_idx)
        // }
        if(!kw_sent_idx_dict.hasOwnProperty(kw)){
          kw_sent_idx_dict[kw] = [i];
          kw_sent_global_idx_dict[kw] = [sents_list[i].global_sent_idx];
          kw_sent_global_idx_dict[kw].n = tfidf_list[j].n
        }else{
          kw_sent_global_idx_dict[kw].push(sents_list[i].global_sent_idx)
          kw_sent_idx_dict[kw].push(i)
        }
      }
      //just to keep an eye on those potential truncated tf_idf terms
      if(sent.match(kw) && !sent.match(re)){
        if(!kw_truncated_sent_global_idx_dict.hasOwnProperty(kw)){
          kw_truncated_sent_global_idx_dict[kw] = [sents_list[i].global_sent_idx];
        }else{
          kw_truncated_sent_global_idx_dict[kw].push(sents_list[i].global_sent_idx)
        }
      }

    }
  }

  var kw_hits_obj_list = []
  for (var k in kw_sent_global_idx_dict){
    // console.log('kw',k,'n',kw_sent_global_idx_dict[k].n)
    kw_hits_obj_list.push({kw:k, hits:kw_sent_global_idx_dict[k], query_type:query_type, n:kw_sent_global_idx_dict[k].n})
  }

  return [kw_sent_idx_dict, kw_sent_global_idx_dict, kw_truncated_sent_global_idx_dict, kw_hits_obj_list]
}

function term_idf(term,all_docs_lemma,use_re){
  var Occurances = 0;
  all_docs_lemma.map(function(doc){//non-arg variable
    if(use_re){
      re = new RegExp('\\b'+term,'i')
      matches = doc.match(re)
      if(matches!= null){                
          Occurances += 1
      }
    }else{
      if(doc.includes(' '+term)){                
          Occurances += 1
      }
    }
            
  })
  return Math.log(all_docs_lemma.length/Occurances);
}

function tf_idf_de_novo(doc,all_docs,need_lemma){

  if(need_lemma){
    var nonstop_long_lemma_list = str_to_nonstop_long_lemma_list(doc)
    var all_docs_lemma = all_docs.map(function(doc){//non-arg variable
        return str_to_nonstop_long_lemma_str(doc)    
    })
  }else{
    var nonstop_long_lemma_list = doc.match(/[a-zA-Z]{3,}/gi)
    var all_docs_lemma = all_docs
  }

  var t_dict = {};
  // console.log('nonstop_long_lemma_list',nonstop_long_lemma_list)
  for (var i=0; i<nonstop_long_lemma_list.length; i++){
    current_word = nonstop_long_lemma_list[i]
    t_dict[current_word] ? t_dict[current_word]+=1 : t_dict[current_word]=1;
  }
  var t_list = Object.keys(t_dict).map(function(k){
    return [k,t_dict[k]];
  });
  // console.log('t_dict',t_dict)
  // t_list.sort(function(a,b){
  //   return b[1] - a[1];
  // })  
  var words_num = nonstop_long_lemma_list.length;
  var tf_dict = {};
  var idf_dict = {}
  var tf_idf_list = Object.keys(t_dict).map(function(k){
    var tf = t_dict[k]/words_num;
    tf_dict[k] = tf
    window.status = "doing "+k;
    var idf = term_idf(k,all_docs_lemma,true)
    // var idf = 1
    idf_dict[k] = idf
    return [k, tf*idf, tf, idf];
  });
  tf_idf_list.sort(function(a,b){
    return b[1] - a[1];
  })
  return tf_idf_list
}

function tf(t,need_lemma){
  var t_dict = {};
  var words_lm_long = [];
  re = /[a-zA-Z]+/g;
  console.log(t)
  words_raw = t.match(re);
  try{
    words_raw = words_raw.map(function(i){
    return i.toLowerCase()
    })
  }catch(err){
    console.log('text is',t)
    console.log('words list is',words_raw)
    throw err
  }
  // words_raw = t.split(/[\s*\.*\,\;\+?\#\|:\-\/\\\[\]\(\)\{\}$%&0-9*]/)
  var words = sw.removeStopwords(words_raw,stopword_list)

  var words_lm = [];
  if(need_lemma){
    for (var i of words){
      if(lemmatizer.only_lemmas(i)[0]!=undefined){
        //   console.log('ori:',i)
        // console.log(lemmatizer.only_lemmas(i)[0])
        words_lm.push(lemmatizer.only_lemmas(i)[0]);
      }
    }
  }else{
    words_lm = words
  }
  
  // console.log('words_lm are',words_lm)
  for (var i in words_lm){
    if(words_lm[i].length>=3){      
      t_dict[words_lm[i]] ? t_dict[words_lm[i]]+=1 : t_dict[words_lm[i]]=1;
      words_lm_long.push(words_lm[i]);
    }
  }
  var t_list = Object.keys(t_dict).map(function(k){
    return [k,t_dict[k]];
  });
  t_list.sort(function(a,b){
    return b[1] - a[1];
  })

  var words_num = words_lm_long.length;
  var tf_dict = {};
  var tf_list = Object.keys(t_dict).map(function(k){
    tf_dict[k] = t_dict[k]/words_num;
    return [k,t_dict[k]/words_num];
  });

  return [tf_dict,tf_list,t_list,t_dict];

}


function tf_idf_(tf_d,idf_d){
  var tf_idf_list = [];
  idf_max = Object.keys(idf_d).reduce(function(a,b){return idf_d[a]>idf_d[b]?a:b});
  // console.log('idf_max is',idf_max,'with',idf_d[idf_max])
  idf_404 = 2*idf_d[idf_max]
  //**<debug
  var NOT_in_IDF_list = []
  var tf_value_idf_value_list = Object.keys(tf_d).map(function(k){
    if (!idf_d.hasOwnProperty(k)){
      // console.log('NOT in IDF dict',k)
      NOT_in_IDF_list.push(k)
    }
    idf_value = idf_d.hasOwnProperty(k) ? idf_d[k] : idf_404;
    return [k,idf_value*tf_d[k],tf_d[k],idf_value]
  });
  // console.log('NOT_in_IDF_list',NOT_in_IDF_list)
  tf_value_idf_value_list.sort(function(a,b){
    return b[1] - a[1];
  })
  tf_value_idf_value_list.slice(0,10).map(function(i){
    // console.log(i)
  })
  ///debug>
  var tf_idf_list = Object.keys(tf_d).map(function(k){
    if (!idf_d.hasOwnProperty(k)){
      // console.log('NOT in IDF dict',k)
    }
    idf_value = idf_d.hasOwnProperty(k) ? idf_d[k] : idf_404;
    return [k,idf_value*tf_d[k]]
  });
  var tf_idf_dict = {}
  Object.keys(tf_d).map(function(k){
    tf_idf_dict[k] = idf_value*tf_d[k]
  });
  tf_idf_list.sort(function(a,b){
    return b[1] - a[1];
  })
  return [tf_idf_list, tf_idf_dict]
}

function sents_slicer(start,stop,sents_dict=jd_sents){
    sents_list.length = 0;
    sents_rich_list.length = 0;
    for (var i=start; i<=stop; i++){
        sents_list.push(sents_dict[i]['sent'])
        sents_rich_list.push(sents_dict[i])
    }
    sents_str = sents_list.join(' ');
    return sents_str
}

function s2t(start,stop){
  t = sents_slicer(start,stop)
  tf_ = tf(t);
  tfidf_list = tf_idf_(tf_[0],word_idf_dict);
  tfidf_list.slice(0,20).map(function(a){
      console.log(a[0],a[1])
    })
  return tfidf_list;
}

function content_to_tfidfs(t,need_lemma){
  tf_ = tf(t,need_lemma);
  var [tf_idf_list, tf_idf_dict] = tf_idf_(tf_[0],word_idf_dict);
  tfidf_list.slice(0,5).map(function(a){
      // console.log(a,a[0],a[1],'inside content_to_tfidfs()')
    })
  return [tf_idf_list, tf_idf_dict];
}

// t = 'the the text a b b cdefg';
// t = "Right right now I'm just being careful with how I add entries so that they're in a preferred order, but it would be nice to have a sort() method. I can imagine how I can create a function that does this, but it'd be a PITA. Thanks for any help :)"

// function tf_idf(t){
//   tf_ = tf(t);
//   // console.log('t_dict is',tf_[3])
//   // console.log('t_list is',tf_[2])
//   // console.log('tf_list is',tf_[1])
//   // console.log('tf_dict is',tf_[0])

//   tf_idf_list = tf_idf_(tf_[0],word_idf_dict)
//   // tf_idf_list.map(function(a){
//   //     console.log(a[0],'TF_IDF:',a[1])
//   //   })
//   // console.log('tf_idf_list is',tf_idf_list)
//   return tf_idf_list
// }





function n_grams_delay(sent_list,n_min=3,n_max=5,min_reoccurence_cutoff_of_n_gram=4){//not used for now
  var n_gram_filtered_list = []
  for(var n = n_min; n<= n_max; n++){
    var n_gram_dict = {}
    function recursive(i,sent_list_length){
      setTimeout(function(){
        if(i < sent_list_length){
          console.log(i)
          var sent_ori = sent_list[i]
          // draw.plain(sent_ori).attr({x:50,y:counter*15}).size(10).fill('black')
          // counter += 1
          var mainly_english = true
          if(sent_ori.match(/[\u4e00-\u9fa5]/g) != null && sent_ori.match(/\w{3,}/g) != null){
            if(sent_ori.match(/\w{3,}/g).length >= sent_ori.match(/[\u4e00-\u9fa5]/g).length){
              mainly_english = true
            }else{
              mainly_english = false
            }
          }else if(sent_ori.match(/[\u4e00-\u9fa5]/g) == null){
            mainly_english = true
          }

          if(mainly_english){
            var word_list = sent_ori.match(/[a-zA-Z]+/g)
          }else{
            var word_list = sent_ori.match(/[\u4e00-\u9fa5]/g)
          }
          
          if(word_list == null){
            return// continue
          }
          for (var j = 0; j < word_list.length - (n - 1); j++) {
            // if(n==2||n==2){
            //   console.log(j,j+n,word_list.slice(j,j+n).join(' '))
            // }
            if(mainly_english){
              var n_gram = word_list.slice(j,j+(+n)).join(' ')
            }else{
              var n_gram = word_list.slice(j,j+(+n)).join('')
            }
            
            n_gram_dict[n_gram] = n_gram_dict[n_gram]? n_gram_dict[n_gram]+1 : 1
            // draw.plain(n_gram).attr({x:50,y:counter*15}).size(7).fill('black')
            // counter += 1
          }

          i++
          recursive(i,sent_list_length)
        }        
      },0)
    }
    recursive(0,sent_list.length)
    console.log('n_gram_dict',n_gram_dict)
    // for (var i = 0; i < sent_list.length; i++) {    

    // }
    // var n_gram_list = Object.keys(n_gram_dict).map(k=>[k,n_gram_dict[k]])
    var n_gram_list = Object.keys(n_gram_dict).map(k=>{
      var temp = [k,n_gram_dict[k]]
      temp.n = n
      return temp
    })
    if(n_gram_list.length == 0){//when sent has too few words(e.g. 1 word)
      break
    }
    n_gram_list.sort((a,b)=>b[1]-a[1])
    // console.log('n',n)
    // console.log('n_gram_list',n_gram_list)
    // console.log('n_gram_list[0]',n_gram_list[0])
    if(n_gram_list[0][1]<2){
      break
    }
    // console.log('n',n)
    // draw.plain(n).attr({x:50,y:counter*15}).size(7).fill('black')
    // counter += 1
    // console.log('n_gram_dict',n_gram_dict)
    // console.log('n_gram_list',n_gram_list)
    // var min_reoccurence_cutoff_of_n_gram = 5
    n_gram_list.map(a=>{
      if(+a[1]>= +min_reoccurence_cutoff_of_n_gram){
        // console.log(n,a[0])
        n_gram_filtered_list.push(a)
        // console.log(a[0],a[1])
        // draw.plain(a[0],a[1]).attr({x:50,y:counter*15}).size(7).fill('black')
        // counter += 1
      }
    })
  }
  return n_gram_filtered_list
}



// function n_grams(sent_list,n_min=3,n_max=5,min_reoccurence_cutoff_of_n_gram=4){
//   console.log('from n_grams')  
//   var n_gram_filtered_list = []
//   for(var n = n_min; n<= n_max; n++){
//     $.post('n:_'+n+'_from_n_grams')
//     console.log('n',n)
//     var n_gram_dict = {}
//     for (var i = 0; i < sent_list.length; i++) {
//       var sent_ori = sent_list[i]
//       // draw.plain(sent_ori).attr({x:50,y:counter*15}).size(10).fill('black')
//       // counter += 1

//       if(sent_ori.match(/[\u4e00-\u9fa5]/g) != null && sent_ori.match(/[a-zA-Z]{3,}/g) != null){
//         if(sent_ori.match(/[a-zA-Z]{3,}/g).length >= sent_ori.match(/[\u4e00-\u9fa5]/g).length){
//           var mainly_english = true
//         }else{
//           var mainly_english = false
//         }
//       }else if(sent_ori.match(/[\u4e00-\u9fa5]/g) == null){
//         var mainly_english = true
//       }else if(sent_ori.match(/[a-zA-Z]{3,}/g) == null){
//         var mainly_english = false
//       }
//       console.log('mainly_english',mainly_english)

//       if(mainly_english){
//         var word_list = sent_ori.match(/[a-zA-Z]+/g)
//       }else{
//         var word_list = sent_ori.match(/[\u4e00-\u9fa5]/g)
//       }
      
//       if(word_list == null){
//         console.warn('word_list == null from n_grams')
//         continue
//       }
//       console.log('word_list',word_list)
//       for (var j = 0; j < word_list.length - (n - 1); j++) {
//         // if(n==2||n==2){
//         //   console.log(j,j+n,word_list.slice(j,j+n).join(' '))
//         // }
//         if(mainly_english){
//           var n_gram = word_list.slice(j,j+(+n)).join(' ')
//         }else{
//           var n_gram = word_list.slice(j,j+(+n)).join('')
//         }
        
//         n_gram_dict[n_gram] = n_gram_dict[n_gram]? n_gram_dict[n_gram]+1 : 1
//         // draw.plain(n_gram).attr({x:50,y:counter*15}).size(7).fill('black')
//         // counter += 1
//       }

//     }
//     // var n_gram_list = Object.keys(n_gram_dict).map(k=>[k,n_gram_dict[k]])
//     console.log('n',n,'n_gram_dict',n_gram_dict)
//     var n_gram_list = Object.keys(n_gram_dict).map(k=>{
//       var temp = [k,n_gram_dict[k]]
//       temp.n = n
//       return temp
//     })
//     console.log('n',n,'n_gram_list ori',n_gram_list)
//     if(n_gram_list.length == 0){//when sent has too few words(e.g. 1 word)
//       break
//     }
//     n_gram_list.sort((a,b)=>b[1]-a[1])
//     console.log('n',n,'n_gram_list after sort',n_gram_list)
//     // console.log('n',n)
//     // console.log('n_gram_list',n_gram_list)
//     // console.log('n_gram_list[0]',n_gram_list[0])
//     if(n_gram_list[0][1]<2){
//       break
//     }
//     // console.log('n',n)
//     // draw.plain(n).attr({x:50,y:counter*15}).size(7).fill('black')
//     // counter += 1
//     // console.log('n_gram_dict',n_gram_dict)
//     // console.log('n_gram_list',n_gram_list)
//     // var min_reoccurence_cutoff_of_n_gram = 5
//     n_gram_list.map(a=>{
//       if(+a[1]>= +min_reoccurence_cutoff_of_n_gram){
//         // console.log(n,a[0])
//         n_gram_filtered_list.push(a)
//         // console.log(a[0],a[1])
//         // draw.plain(a[0],a[1]).attr({x:50,y:counter*15}).size(7).fill('black')
//         // counter += 1
//       }
//     })
//     console.log('n',n,'n_gram_list',n_gram_list)
//   }
//   return n_gram_filtered_list
// }