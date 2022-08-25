






















// importScripts('tfidf.js','sorter.js')
function n_grams_(sent_list,n_min=2,n_max=70,min_reoccurence_cutoff_of_n_gram=2){
  // $.post('from_n_grams')  
  // console.log('from n_grams')  
  raw['chinese_run_list'] = []
  raw['chinese_nonstop_run_list'] = []
  raw['chinese_destop_run_list'] = []
  raw['n_gram_dict_list'] = []

  var n_gram_filtered_list = []
  for(var n = n_min; n<= n_max; n++){
    // $.post('n:_'+n+'_from_n_grams')
    // console.log('n:_'+n+'_from_n_grams')
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
          // console.warn('english_words_list == null from n_grams')
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
          for(var w of raw.chinese_stop_words_list){
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
  // console.log('n_gram_filtered_list',n_gram_filtered_list)
  return n_gram_filtered_list
}

function super_equal_nester_marker( diagonal_kw_sum_declustered_tmp_list ){
    for(var i=0; i<diagonal_kw_sum_declustered_tmp_list.length; i++){
      if(i%Math.round(diagonal_kw_sum_declustered_tmp_list.length/10) == 0){
        // $.post(i+'_of_'+diagonal_kw_sum_declustered_tmp_list.length)      
      }
      for(var j=0; j<diagonal_kw_sum_declustered_tmp_list.length; j++){      
        // $.post(i+'_and_'+j+'_of_'+diagonal_kw_sum_declustered_tmp_list.length)
        var a = diagonal_kw_sum_declustered_tmp_list[i]
        var b = diagonal_kw_sum_declustered_tmp_list[j]
        // console.log('a,b',a,b)
        if(a.query_type == 'n_gram' && b.query_type == 'n_gram' && a.kw.includes(b.kw) && a.kw!=b.kw ){
          if(b.hits.every(k=>a.hits.indexOf(k)>=0)){
            if(b.super == undefined){
              // console.log(a.query_type,b.query_type,a.query_type!=b.query_type)
              b.super = ['[  '+a.kw+' : '+a.query_type+'  ]']
            }else if(!b.super.includes('[  '+a.kw+' : '+a.query_type+'  ]')){
              b.super.push('[  '+a.kw+' : '+a.query_type+'  ]')
              // b.super.push(a.query_type)
              // j.super.push(i.hits)
            }
          }else{
            if(b.nester == undefined){
              // console.log(a.query_type,b.query_type,a.query_type!=b.query_type)
              // b.nester = ['[  '+a.kw +' : '+ Math.round(100*b.hits.length / a.hits.length)/100 +'  ]']
              b.nester = [ [a.kw, Math.round(100*b.hits.length / a.hits.length)/100, ' || '] ]
              b.nester_kw_records = [a.kw]
            }else if(!b.nester_kw_records.includes( a.kw )){
              // b.nester.push('[  '+a.kw +' : '+ Math.round(100*b.hits.length / a.hits.length)/100 +'  ]')
              b.nester.push( [a.kw, Math.round(100*b.hits.length / a.hits.length)/100, ' || '] )
              b.nester_kw_records.push( a.kw )
              // b.super.push(a.query_type)
              // j.super.push(i.hits)
            }
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
  }  

var raw
onmessage = function (e){
    // var v = e.data * 2
    switch (e.data.key){
        case 'raw':
            raw = e.data.value
            break
        case 'masked_hits_list':
            var masked_hits_sent_info_list = raw.sent_info_list
            .filter(a => e.data.value.includes(a.global_sent_idx))
            // console.log('before n_grams_')
            var kw_hits_obj_list = n_grams_(masked_hits_sent_info_list)
            super_equal_nester_marker(kw_hits_obj_list)
            
            var unit_indie_list = []
            for(var u of kw_hits_obj_list){
              if(u.super != undefined){continue}
              else if(u.nester != undefined){
                u.nester = u.nester.sort((a,b)=>a[1]-b[1])
                if(u.nester[0][1]<=1.2){continue}
              }else{
                unit_indie_list.push(u)
              }
            }
            unit_indie_list.sort((a,b)=>b.hits.length-a.hits.length)
            // console.log('unit_indie_list',unit_indie_list)
            // var unsupered_n_grams_list = unit_indie_list.map( a=>[a.kw,a.hits.length])
            var unsupered_n_grams_list = unit_indie_list.map( a=>a.kw).slice(0,5).concat(unit_indie_list.map( a=>a.hits.length).slice(0,5))
            console.log('masked_hits_list_unsupered_n_grams_list',unsupered_n_grams_list)
            // postMessage({key:'masked_hits_list',value:kw_hits_obj_list})
            postMessage({key:'masked_hits_list',value:unsupered_n_grams_list})
            break

        case 'masked_sent_list':
            var masked_sent_info_list = raw.sent_info_list
            .filter(a => e.data.value.includes(a.global_sent_idx))
            // console.log('before n_grams_')
            var kw_hits_obj_list = n_grams_(masked_sent_info_list)
            super_equal_nester_marker(kw_hits_obj_list)
            
            var unit_indie_list = []
            for(var u of kw_hits_obj_list){
              if(u.super != undefined){continue}
              else if(u.nester != undefined){
                u.nester = u.nester.sort((a,b)=>a[1]-b[1])
                if(u.nester[0][1]<=1.2){continue}
              }else{
                unit_indie_list.push(u)
              }
            }
            unit_indie_list.sort((a,b)=>b.hits.length-a.hits.length)
            // console.log('unit_indie_list',unit_indie_list)
            // var unsupered_n_grams_list = unit_indie_list.map( a=>[a.kw,a.hits.length])
            var unsupered_n_grams_list = unit_indie_list.map( a=>a.kw).slice(0,5).concat(unit_indie_list.map( a=>a.hits.length).slice(0,5))
            console.log('masked_sent_list_unsupered_n_grams_list',unsupered_n_grams_list)
            // postMessage({key:'masked_sent_list',value:kw_hits_obj_list})
            postMessage({key:'masked_sent_list',value:unsupered_n_grams_list})
            break

        case '1g':
            var masked_sent_info_list = raw.sent_info_list
            .filter(a => e.data.value.includes(a.global_sent_idx))
            // console.log('before n_grams_')
            var kw_hits_obj_list = n_grams_(masked_sent_info_list,1,1,2)
            super_equal_nester_marker(kw_hits_obj_list)
            
            var unit_indie_list = []
            for(var u of kw_hits_obj_list){
              if(u.super != undefined){continue}
              else if(u.nester != undefined){
                u.nester = u.nester.sort((a,b)=>a[1]-b[1])
                if(u.nester[0][1]<=1.2){continue}
              }else{
                unit_indie_list.push(u)
              }
            }
            // unit_indie_list.sort((a,b)=>b.hits.length-a.hits.length)

            for(var ng of unit_indie_list){
              ng.ngf_idf = ng.hits.length * raw.idf_dict[ng.kw]
            }
            
            postMessage({key:'ready',value:{
              ngf:unit_indie_list.sort((a,b)=>b.hits.length-a.hits.length),
              ngf_idf:unit_indie_list.slice(0).sort((a,b)=>b.ngf_idf-a.ngf_idf)  
            }})
            break

        case 'ng'://copy from 'default'
            var masked_sent_info_list = raw.sent_info_list
            .filter(a => e.data.value.includes(a.global_sent_idx))
            // console.log('before n_grams_')
            if(e.data['n_multi'] == undefined){//from forward enrichment stage
              var kw_hits_obj_list = n_grams_(masked_sent_info_list)
            }else{//from backward enrichment stage
              var kw_hits_obj_list = n_grams_(masked_sent_info_list,e.data['n_multi'])
            }            
            super_equal_nester_marker(kw_hits_obj_list)
            
            var unit_indie_list = []
            for(var u of kw_hits_obj_list){
              if(u.super != undefined){continue}
              else if(u.nester != undefined){
                u.nester = u.nester.sort((a,b)=>a[1]-b[1])
                if(u.nester[0][1]<=1.2){continue}
              }else{
                unit_indie_list.push(u)
              }
            }

            for(var ng of unit_indie_list){
              ng.ngf_idf = ng.hits.length * raw.idf_dict[ng.kw]
            }
            
            postMessage({key:'ready',value:{
              ngf:unit_indie_list.sort((a,b)=>b.hits.length-a.hits.length),
              ngf_idf:unit_indie_list.slice(0).sort((a,b)=>b.ngf_idf-a.ngf_idf)  
            }})
            break

        default:
            var masked_sent_info_list = raw.sent_info_list
            .filter(a => e.data.value.includes(a.global_sent_idx))
            // console.log('before n_grams_')
            var kw_hits_obj_list = n_grams_(masked_sent_info_list)
            super_equal_nester_marker(kw_hits_obj_list)
            
            var unit_indie_list = []
            for(var u of kw_hits_obj_list){
              if(u.super != undefined){continue}
              else if(u.nester != undefined){
                u.nester = u.nester.sort((a,b)=>a[1]-b[1])
                if(u.nester[0][1]<=1.2){continue}
              }else{
                unit_indie_list.push(u)
              }
            }

            for(var ng of unit_indie_list){
              ng.ngf_idf = ng.hits.length * raw.idf_dict[ng.kw]
            }
            
            postMessage({key:'ready',value:{
              ngf:unit_indie_list.sort((a,b)=>b.hits.length-a.hits.length),
              ngf_idf:unit_indie_list.slice(0).sort((a,b)=>b.ngf_idf-a.ngf_idf)  
            }})
            break
    }    
}


// importScripts('math_utilities.js'); 
// importScripts('script1.js', 'script2.js');


// postMessage({
//     type: "debug",
//     message: "Starting processing..."
// });


 //4.同样的，在worker 线程中也可以监听错误信息。
// onerror = function(err){
//     console.log(err)
// }


// self.close()



// self.addEventListener('message', function (e) {
//   var data = e.data;
//   switch (data.cmd) {
//     case 'start':
//       self.postMessage('WORKER STARTED: ' + data.msg);
//       break;
//     case 'stop':
//       self.postMessage('WORKER STOPPED: ' + data.msg);
//       self.close(); // Terminates the worker.
//       break;
//     default:
//       self.postMessage('Unknown command: ' + data.msg);
//   };
// }, false);