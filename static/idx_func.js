






















// function sort_display_unit_ids(display_unit_id_log_list){
//   var display_unit_id_dense_start_dict_array = []
//   for(var id of display_unit_id_log_list){
//     display_unit_id_dense_start_dict_array.push({id:$('#'+id).attr('id'), dense_start:$('#'+id).data('dense_start')})
//   }
//   display_unit_id_dense_start_dict_array.sort( (a,b) => a.dense_start - b.dense_start )
// }
function clear_all_display_unit(){
  $('.kw_display_unit').each(function(){
    $(this).remove();
  })
}

function eval_js(){
  console.log($('#js_for_eval'))
  eval($('#js_for_eval').val())
}


function sort_current_display_unit(){
  var display_unit_id_dense_start_dict_array = []
  $('.kw_display_unit').each( function(){
    var display_unit_id_dense_start_dict = {id:$(this).attr('id'), dense_start:$(this).data('dense_start')}
    display_unit_id_dense_start_dict_array.push(display_unit_id_dense_start_dict)
  })
  display_unit_id_dense_start_dict_array.sort( (a,b) => a.dense_start - b.dense_start )
  for(var i of display_unit_id_dense_start_dict_array.reverse()){
    $('#head_container').after($('#'+i.id))
  }
}


summary_gen = function({diagonal_kw_sum_=undefined,summary_gen_resolved,
  dense_block_spanned_sents_idx_off = false}={}){

  if(diagonal_kw_sum_ == undefined){
    diagonal_kw_sum_ = diagonal_kw_sum
  }
  // if(per_sents_idx_type_n_multi_type_promise_list == undefined){
  //   var per_sents_idx_type_n_multi_type_promise_list = this.per_sents_idx_type_n_multi_type_promise_list
  // }

  var per_sents_idx_type_n_multi_type_promise_list = []

  var sents_idx_type_n_multi_type_promise_resolved_counter = 0
  data['diagonal_dense_block_summary_dict_pre'] = {}// for log only
  data['diagonal_dense_block_mutual'] = {}// for log only
  data['dense_hits'] = []// for log only
  var unit_counter = 1

  for(let kw_unit of diagonal_kw_sum_){
    data['dense_hits'].push([kw_unit.kw, kw_unit.dense_hits])
    let current_kw = kw_unit.kw
    let kw_unit_id = kw_unit.kw+'_' + kw_unit.dense_hits.join('-')//unit_counter//+'__'+unit[j][3].length
    data.diagonal_dense_block_summary_dict_pre[kw_unit_id] = {}
    kw_unit['summary_hierarchical_calculation_log_dict'] = {}
    unit_counter+=1
    // data[kw_unit_id] = {}
    // data[kw_unit_id].current_kw = current_kw
    // data[kw_unit_id].summary_terms_tested_unique_log =[]
    // data[kw_unit_id].summary_terms_confirmed_unique_log =[]
    let dense_block_sents_idx_list = []
    let dense_block_sents_neighbor_idx_list = []

    var also_search_nearby_sent_within_range = para.also_search_nearby_sent_within_range?
    para.also_search_nearby_sent_within_range : options.also_search_nearby_sent_within_range
    var nearby_sent_range = +also_search_nearby_sent_within_range
    for(var hit_idx of kw_unit.dense_hits){
      if(hit_idx != undefined){
        dense_block_sents_idx_list.push(hit_idx)
        dense_block_sents_neighbor_idx_list = dense_block_sents_neighbor_idx_list.concat(_.range(hit_idx - nearby_sent_range, hit_idx + 1 + nearby_sent_range))
      }
    }

    let dense_block_spanned_sents_idx_list = _
    .range(dense_block_sents_idx_list[0] - nearby_sent_range, dense_block_sents_idx_list.slice(-1)[0] + 1  + nearby_sent_range)
    .filter(a => a >=0 && a <= raw.sent_num-1)

    let dense_block_sents_neighbor_unique_idx_list = Array.from(new Set(dense_block_sents_neighbor_idx_list))
    let dense_block_sents_neighbor_unique_valid_idx_list = dense_block_sents_neighbor_unique_idx_list.filter(a => a >=0 && a <= raw.sent_num-1)

    // console.log(kw_unit.kw)
    // console.log(dense_block_sents_idx_list)
    // console.log(dense_block_spanned_sents_idx_list)
    // console.log(dense_block_sents_neighbor_idx_list)
    // console.log(dense_block_sents_neighbor_unique_valid_idx_list)
    if(dense_block_spanned_sents_idx_off){
      var sents_idx_type_value_dict_ = {'L':dense_block_sents_idx_list, 'N':dense_block_sents_neighbor_unique_valid_idx_list}
    }else{
      var sents_idx_type_value_dict_ = {'L':dense_block_sents_idx_list, 'S':dense_block_spanned_sents_idx_list, 'N':dense_block_sents_neighbor_unique_valid_idx_list}
    }    
    let sents_idx_type_value_dict = sents_idx_type_value_dict_
    console.log(sents_idx_type_value_dict)
    for(let sents_idx_type in sents_idx_type_value_dict){
      data.diagonal_dense_block_summary_dict_pre[kw_unit_id][sents_idx_type] = {}
      kw_unit['summary_hierarchical_calculation_log_dict'][sents_idx_type] = {}
      let sents_idx_list = sents_idx_type_value_dict[sents_idx_type]
      if(current_kw.match(/[\u4e00-\u9fa5]/)){
        var n_multi_type_list = ['ng']
      }else{
        var n_multi_type_list = ['1g','ng']
      }        
      for(let n_multi_type of n_multi_type_list){
        data.diagonal_dense_block_summary_dict_pre[kw_unit_id][sents_idx_type][n_multi_type] = {}
        kw_unit['summary_hierarchical_calculation_log_dict'][sents_idx_type][n_multi_type] = {}
        let per_sents_idx_type_n_multi_type_promise_callback
        // let sents_idx_type_n_multi_type_promise = new Promise(r=>{promise_callback = r})
        per_sents_idx_type_n_multi_type_promise_list.push(new Promise(r=>{per_sents_idx_type_n_multi_type_promise_callback = r}))
        let timer_2_ = setInterval(function(){
          // console.log(worker_queue.length)
          $('#worker_num_div').html(worker_queue.length)
          if(worker_queue.length > 0){
            var worker = worker_queue.shift()
            data.worker_started_lag_log_list.push(new Date().getTime() - data.worker_returned_time_log_list.slice(-1)[0])
            $('#worker_num_div').html(worker_queue.length)
            clearInterval(timer_2_)
            worker.postMessage({key:n_multi_type, value:sents_idx_list})
            worker.onmessage = function(e){
              if(e.data.key == 'ready'){
                var per_tf_type_term_promise_list = []
                worker_queue.push(worker)
                data.worker_working_order_log.push('sents_idx_type - n_multi_type - wise job worker returned  - '
                  + [current_kw, kw_unit.dense_hits.join('-'), sents_idx_type, n_multi_type].join(' - '))
                data.worker_returned_time_log_list.push(new Date().getTime())
                $('#worker_num_div').html(worker_queue.length)
                for(let tf_type of ['ngf','ngf_idf']){
                  var mutual_enrichment_calculation_input_phrase_number = para.mutual_enrichment_calculation_input_phrase_number?
                  para.mutual_enrichment_calculation_input_phrase_number : options.mutual_enrichment_calculation_input_phrase_number
                  var summary_terms_forward = e.data.value[tf_type].map(a=>a.kw).slice(0,mutual_enrichment_calculation_input_phrase_number)
                  data.diagonal_dense_block_summary_dict_pre[kw_unit_id][sents_idx_type][n_multi_type][tf_type] = {'summary_terms_forward':summary_terms_forward}
                  kw_unit['summary_hierarchical_calculation_log_dict'][sents_idx_type][n_multi_type][tf_type] = {'summary_terms_forward':summary_terms_forward}
                  var summary_terms_type = [sents_idx_type,n_multi_type,tf_type].join('-')
                  // kw_unit[summary_terms_type] = {}
                  kw_unit['summary'] = kw_unit['summary'] != undefined? kw_unit['summary']:{}
                  kw_unit['summary'][summary_terms_type] = {}
                  summary_terms_forward.map(a =>{kw_unit['summary'][summary_terms_type][a]={}})
                  // for(var tf_type_back of ['ngf','ngf_idf']){

                  //   // kw_unit[summary_terms_type] = {'normal':ng_list.map(a=>a.kw).slice(0,5),'mutual':[]}
                  // }                  

                  // data.diagonal_dense_block_summary_dict_pre[kw_unit_id][sents_idx_type][n_multi_type][tf_type]['back'] = {}
                  // for(let term of data.diagonal_dense_block_summary_dict_pre[kw_unit_id][sents_idx_type][n_multi_type][tf_type]){// - 2020-1-27
                  for(let term of summary_terms_forward){// + 2020-1-27
                    if(current_kw.includes(term)){
                      continue
                    }
                    try{
                      data.diagonal_dense_block_summary_dict_pre[kw_unit_id][sents_idx_type][n_multi_type][tf_type][term] = {}
                    }catch{
                      if(data['error_log'] == undefined){
                        data['error_log'] = [ [kw_unit_id, sents_idx_type, n_multi_type, tf_type, term].join(' - ') ]
                      }else{
                        data['error_log'].push( [kw_unit_id, sents_idx_type, n_multi_type, tf_type, term].join(' - ') )
                      }
                    }
                    kw_unit['summary_hierarchical_calculation_log_dict'][sents_idx_type][n_multi_type][tf_type][term] = {}
                    // [data.diagonal_dense_block_summary_dict_pre[kw_unit_id][sents_idx_type][n_multi_type][tf_type][term]['ngf'],
                    //  data.diagonal_dense_block_summary_dict_pre[kw_unit_id][sents_idx_type][n_multi_type][tf_type][term]['ngf_idf']] = 
                    let per_tf_type_term_promise_callback
                    per_tf_type_term_promise_list.push(new Promise(r=>{per_tf_type_term_promise_callback = r}))
                    if(current_kw.match(/[\u4e00-\u9fa5]/)){
                      var n_multi = current_kw.split('').length
                    }else{
                      var n_multi = current_kw.split(' ').length
                    } 
                    back_enrichment_pre({term:term, n_multi:n_multi, sent_idx_list:dense_block_spanned_sents_idx_list, 
                      current_kw:current_kw, kw_unit_id:kw_unit_id, kw_unit:kw_unit,sents_idx_type:sents_idx_type,n_multi_type:n_multi_type,tf_type:tf_type,
                      to_be_updated:data.diagonal_dense_block_summary_dict_pre[kw_unit_id][sents_idx_type][n_multi_type][tf_type][term],promise_callback:per_tf_type_term_promise_callback})
                  }
                }   
                Promise.all( per_tf_type_term_promise_list ).then(function(){ 
                  per_sents_idx_type_n_multi_type_promise_callback()
                  sents_idx_type_n_multi_type_promise_resolved_counter += 1
                  var time_cost = new Date().getTime() - start_.getTime()
                  // $('p#per_sents_idx_type_n_multi_type_promise_info')
                  // .text(sents_idx_type_n_multi_type_promise_resolved_counter + ' of ' + per_sents_idx_type_n_multi_type_promise_list.length 
                  // + ' per_sents_idx_type_n_multi_type_promise finished in ' + time_cost/1000 + 's')
                  $('#per_sents_idx_type_n_multi_type_promise_info')
                  .text(sents_idx_type_n_multi_type_promise_resolved_counter + ' of ' + per_sents_idx_type_n_multi_type_promise_list.length 
                  + ' per_sents_idx_type_n_multi_type_promise finished in ' + time_cost/1000 + 's')
                  })                     
              }        
            }
          }
        },0)
      }      
    }  
  }

  Promise.all(per_sents_idx_type_n_multi_type_promise_list ).then(function(){
    summary_gen_resolved()
  })
}



function back_enrichment_pre({term,n_multi,sent_idx_list,current_kw,kw_unit_id,sents_idx_type,n_multi_type,tf_type,kw_unit,to_be_updated = {},promise_callback } = {}){
  // var [a, kw_sent_global_idx_dict, c, kw_hits_obj_list] = tfidf_list_2_kw_sent_idx_dict( [term], sent_info_list, 'mutual_kws' )
  var hits_idx_list = sent_idx_list.filter(idx=>term_in_sent(term,idx))
  var around_hits_list = []
  var also_search_nearby_sent_within_range = para.also_search_nearby_sent_within_range?
  para.also_search_nearby_sent_within_range : options.also_search_nearby_sent_within_range
  for(var idx of hits_idx_list){
    around_hits_list = around_hits_list.concat(_.range(idx -  +also_search_nearby_sent_within_range, idx + 1 +  +also_search_nearby_sent_within_range))
  }
  var around_hits_unique_list = Array.from(new Set(around_hits_list))
  var around_hits_unique_valid_list = around_hits_unique_list.filter(a => a >=0 && a <= raw.sent_num-1)

  var timer_2__ = setInterval(function(){
    if(worker_queue.length > 0){
      var worker = worker_queue.shift()
      data.worker_started_lag_log_list.push(new Date().getTime() - data.worker_returned_time_log_list.slice(-1)[0])
      $('#worker_num_div').html(worker_queue.length)
      clearInterval(timer_2__)
      if(n_multi>1){
        worker.postMessage({key:'ng',value:around_hits_unique_valid_list,n_multi:n_multi})
      }else{
        worker.postMessage({key:'1g',value:around_hits_unique_valid_list,n_multi:n_multi})
      }      
      worker.onmessage = function(e){
        if(e.data.key == 'ready'){
          worker_queue.push(worker)
          data.worker_working_order_log.push('back_enrichment_pre worker returned - '+ [kw_unit_id, sents_idx_type, n_multi_type, term].join(' - '))
          data.worker_returned_time_log_list.push(new Date().getTime())
          $('#worker_num_div').html(worker_queue.length)

          for(var tf_type_back of ['ngf','ngf_idf']){
            var ng_list = e.data.value[tf_type_back]
            var mutual_enrichment_calculation_input_phrase_number = para.mutual_enrichment_calculation_input_phrase_number?
            para.mutual_enrichment_calculation_input_phrase_number : options.mutual_enrichment_calculation_input_phrase_number
            to_be_updated[tf_type_back] = ng_list.map(a=>a.kw).slice(0,mutual_enrichment_calculation_input_phrase_number) // ~ 2020-1-27
            kw_unit['summary_hierarchical_calculation_log_dict'][sents_idx_type][n_multi_type][tf_type][term][tf_type_back] = ng_list.map(a=>a.kw).slice(0,mutual_enrichment_calculation_input_phrase_number) // + 2020-1-27
            var summary_terms_type = [sents_idx_type,n_multi_type,tf_type].join('-')

            if(current_kw == ng_list.map(a=>a.kw)[0]){
              
              kw_unit['summary'][summary_terms_type][term]['mutual'] = true
              kw_unit['summary'][summary_terms_type][term]['type'] = tf_type_back              

              if(data['diagonal_dense_block_mutual'][current_kw] == undefined){
                data['diagonal_dense_block_mutual'][current_kw] = {}
                data['diagonal_dense_block_mutual'][current_kw][kw_unit_id] = [term]
              }else if(data['diagonal_dense_block_mutual'][current_kw][kw_unit_id] == undefined){
                data['diagonal_dense_block_mutual'][current_kw][kw_unit_id] = [term]
              }else{
                // console.log(data['diagonal_dense_block_mutual'][current_kw][kw_unit_id])
                data['diagonal_dense_block_mutual'][current_kw][kw_unit_id].push(term)
              }
              
              if(kw_unit['mutual'] == undefined){
                kw_unit['mutual'] = [term]
                kw_unit['mutual_unique'] = [term]
              }else{
                kw_unit['mutual'].push(term)
                kw_unit['mutual_unique'].push(term)
                kw_unit['mutual_unique'] = Array.from(new Set(kw_unit['mutual_unique']))
              }

              // data.worker_working_order_log.push('back_enrichment_pre - '+kw_unit_id)
            }
          }               
        }
        promise_callback()
      }
    }
  },0)
}

function back_enrichment({ngf_like,origin,current_kw,kw_div_id} = {}){
  console.log(this)
  var [a, kw_sent_global_idx_dict, c, kw_hits_obj_list] = tfidf_list_2_kw_sent_idx_dict( ngf_like.map(a=>a.kw).slice(0,10), sent_info_list, 'mutual_kws' )
  console.log('kw_hits_obj_list')
  console.log(kw_hits_obj_list)
  for(let kw_hits_obj of kw_hits_obj_list){
    console.log(data[kw_div_id].summary_terms_tested_unique_log)
    if(!data[kw_div_id].summary_terms_tested_unique_log.includes(kw_hits_obj.kw)){
      data[kw_div_id].summary_terms_tested_unique_log.push(kw_hits_obj.kw)
    }else{
      continue
    }
    var around_hits_list = []
    var also_search_nearby_sent_within_range = para.also_search_nearby_sent_within_range?
    para.also_search_nearby_sent_within_range : options.also_search_nearby_sent_within_range
    for(var hit of kw_hits_obj.hits){
      around_hits_list = around_hits_list.concat(_.range(hit -  +also_search_nearby_sent_within_range, hit + 1 +  +also_search_nearby_sent_within_range))
    }
    around_hits_unique_list = Array.from(new Set(around_hits_list))
    console.log(around_hits_unique_list)
    let around_hits_unique_valid_list = around_hits_unique_list.filter(a => a >=0 && a <= raw.sent_num-1)
    console.log(around_hits_unique_valid_list)

    let timer_2__ = setInterval(function(){
      console.log(worker_queue.length)
      if(worker_queue.length > 0){
        var worker = worker_queue.shift()
        $('#worker_num_div').html(worker_queue.length)
        clearInterval(timer_2__)
        worker.postMessage({key:'1g',value:around_hits_unique_valid_list})
        // var this_ = this
        worker.onmessage = function(e){
          if(e.data.key == 'ready'){
            worker_queue.push(worker)
            $('#worker_num_div').html(worker_queue.length)
            let ngf = e.data.value.ngf
            let ngf_idf = e.data.value.ngf_idf

            if(ngf[0].kw == current_kw){
              var term_idx = data[kw_div_id].summary_terms_confirmed_unique_log.length
              var color = rgb_array[ term_idx %5]
              var inner_div = $('<div></div>').attr('class','individual_summary_term')
              .append($('<p>'+kw_hits_obj.kw+'</p>').attr('class','individual_summary_term').css('color',color))
              .append($('<span>'+ origin+'</span>').attr('class','individual_summary_term'))
              $('#'+kw_div_id).find('div.mutual_kws').append(inner_div)

              data[kw_div_id].summary_terms_confirmed_unique_log.push(kw_hits_obj.kw)
            }

            // $('#'+kw_div_id).find('div.mutual_kws').append(ngf.map(a=>a.kw).slice(0,5))
            console.log(kw_hits_obj.kw)
            console.log(around_hits_unique_valid_list)
            console.log(ngf.map(a=>a.kw).slice(0,5))
          }
        }
      }
    },10)
  }
}

function kw_display_unit_remove(){
  // console.log($(this).parents('div.kw_display_unit'))
  // console.log($(this).parents('div.kw_display_unit').prev())
  // console.log($(this).parents('div.kw_display_unit').prev('div.kw_display_unit'))
  // console.log($(this).parents('div.kw_display_unit').prev('div.kw_display_unit').find('svg.polyline_svg_kw'))
  // console.log($(this).parents('div.kw_display_unit').prev('div.kw_display_unit').find('rect.zoom_mask'))
  $(this).parents('div.kw_display_unit').prev('div.kw_display_unit')
  .find('svg.polyline_svg_kw').removeClass('clicked')  
  $(this).parents('div.kw_display_unit').prev('div.kw_display_unit')
  .off('mouseup','svg.polyline_svg_kw',mask_start)
  $(this).parents('div.kw_display_unit').prev('div.kw_display_unit')
  .find('rect.zoom_mask').remove()
  $(this).parents('div.kw_display_unit').remove() 
}

function mouseleave_polyline(e){
  // console.log('from mouseleave_polyline')
  var ele_id = $(this).attr('id')
  if( true ){//$(this).hasClass('masked')
    $('rect#'+ele_id+'_mask').remove()
    // $(this).removeClass('mask_changed')
    // $(this).removeClass('masked')
    $(this).parents('div.kw_display_unit').next().find('svg.svg_kw').removeClass('zoomed')
    $(this).parents('div.kw_display_unit').next().find('svg.svg_kw_hit').each(function(){
      if($(this).data('x_original') != undefined){
        $(this).attr('x', $(this).data('x_original'))
      }           
    })
  }

  $(this).parents('div.kw_display_unit').next().find('div.NGMH').children('svg').remove()
  $(this).parents('div.kw_display_unit').next().find('div.NGMS').children('svg').remove()

  $(e.delegateTarget).off('mousemove','svg.polyline_svg_kw',mousemove_polyline)  
  $(e.delegateTarget).on('mouseup','svg.polyline_svg_kw',mask_start)  
  $(e.delegateTarget).off('mouseleave','svg.polyline_svg_kw',mouseleave_polyline)  
}

function mask_finished(e) {

  if(e.which == 3){
    return
  }

  $(this).addClass('masked')  
  $(e.delegateTarget).off('mousemove','svg.polyline_svg_kw',mousemove_polyline)  
  $(e.delegateTarget).off('mouseleave','svg.polyline_svg_kw',mouseleave_polyline)  
  $(e.delegateTarget).on('mouseup','svg.polyline_svg_kw',mask_start)  
  $(e.delegateTarget).off('mouseup','svg.polyline_svg_kw',mask_finished)  
  // console.log('from mask_finished')
  var start_x = $(this).data('start_x')
  var end_x = e.pageX - $(this).attr('x')
  var [start_x,end_x] = $(this).data('start_x') <= e.pageX - $(this).attr('x')?
  [$(this).data('start_x'), e.pageX - $(this).attr('x')]:[e.pageX - $(this).attr('x'), $(this).data('start_x')]
  var sent_idx_list = []
  for(var i=0; i < raw.sent_num; i++){
    if( Math.round((i/raw.sent_num)*para.x_max) >= start_x &&
    Math.round((i/raw.sent_num)*para.x_max) <= end_x ){
      sent_idx_list.push(i)
    }
  }
  temp['masked_sent_idx_list'] = sent_idx_list

  var masked_hits_list = []
  for(var i of temp['working_kw_hits_list']){
    if( +i >= temp['masked_sent_idx_list'][0] && +i <= temp['masked_sent_idx_list'].slice(-1)[0]){
      masked_hits_list.push(+i)
    }
  }
  temp['masked_hits_list'] = masked_hits_list
  console.log(temp['masked_hits_list'])

  temp['masked_hits_sent_info_list'] = []//secondary
  for(var s of raw.sent_info_list){
    if(temp['masked_hits_list'].includes(s.global_sent_idx)){
      temp['masked_hits_sent_info_list'].push(s)
    }
  }

  // var _this = this
  var this_ = this
  var timer_1 = setInterval(function(){
    console.log(worker_queue.length)
    console.log(this_)
    if(worker_queue.length > 0){
      var worker = worker_queue.shift()
      $('#worker_num_div').html(worker_queue.length)
      clearInterval(timer_1)
      worker.postMessage({key:'',value:temp['masked_hits_list']})
      // var this_ = this
      worker.onmessage = function(e){
        if(e.data.key == 'ready'){

          worker_queue.push(worker)
          $('#worker_num_div').html(worker_queue.length)

          var ngf_idf = e.data.value.ngf_idf
          var ngf = e.data.value.ngf

          var arg_ngf_idf_list = ngf_idf.map(a=>{return {kw:a.kw,score:a.ngf_idf}})
          $(this_).parents('div.kw_display_unit')
          .next().find('div.NGMHi').children('svg').remove()
          $(this_).parents('div.kw_display_unit')
          .next().find('div.NGMHi').attr('id','NGMHi'+serial_num)
          var svg_n_grams = SVG( 'NGMHi'+serial_num ).size('100%',20)
          serial_num++
          svg_n_grams.plain('NGMHi:').attr({'font-size':10,x:10,y:15,class:'summary_type',id:''}).fill('rgb(255,147,38)').data({type:'ngmhi'})//.size(5)
          colored_text_(arg_ngf_idf_list,svg_base_drawer=svg_n_grams,x=50,y=15,
            black_and_white = false,size = 5,class_='individual_summary_term')

          var kw_div_id = $(this_).parents('div.kw_display_unit').next().attr('id')
          if(!diagonal_dense_block_summary_dict.hasOwnProperty(kw_div_id)){
            diagonal_dense_block_summary_dict[kw_div_id] = {}
          }
          diagonal_dense_block_summary_dict[kw_div_id]['ngmhi'] = ngf_idf.map(a=>a.kw).slice(0,5)

          var arg_ngf_list = ngf.map(a=>{return {kw:a.kw,score:a.hits.length}})
          $(this_).parents('div.kw_display_unit')
          .next().find('div.NGMH').children('svg').remove()
          $(this_).parents('div.kw_display_unit')
          .next().find('div.NGMH').attr('id','NGMH'+serial_num)
          var svg_n_grams = SVG( 'NGMH'+serial_num ).size('100%',20)
          serial_num++
          svg_n_grams.plain('NGMH:').attr({'font-size':10,x:10,y:15,class:'summary_type',id:''}).fill('rgb(255,147,38)').data({type:'ngmh'})//.size(5)
          colored_text_(arg_ngf_list,svg_base_drawer=svg_n_grams,x=50,y=15,
            black_and_white = false,size = 5,class_='individual_summary_term')

          var kw_div_id = $(this_).parents('div.kw_display_unit').next().attr('id')
          if(!diagonal_dense_block_summary_dict.hasOwnProperty(kw_div_id)){
            diagonal_dense_block_summary_dict[kw_div_id] = {}
          }
          diagonal_dense_block_summary_dict[kw_div_id]['ngmh'] = ngf.map(a=>a.kw).slice(0,5)
        }
      }
    }
  },10)

  var timer_2 = setInterval(function(){
    console.log(worker_queue.length)
    console.log(this_)
    if(worker_queue.length > 0){
      var worker = worker_queue.shift()
      $('#worker_num_div').html(worker_queue.length)
      clearInterval(timer_2)
      worker.postMessage({key:'',value:temp['masked_sent_idx_list']})
      // var this_ = this
      worker.onmessage = function(e){
        if(e.data.key == 'ready'){

          worker_queue.push(worker)
          $('#worker_num_div').html(worker_queue.length)

          var ngf_idf = e.data.value.ngf_idf
          var ngf = e.data.value.ngf

          var arg_ngf_idf_list = ngf_idf.map(a=>{return {kw:a.kw,score:a.ngf_idf}})
          $(this_).parents('div.kw_display_unit')
          .next().find('div.NGMSi').children('svg').remove()
          $(this_).parents('div.kw_display_unit')
          .next().find('div.NGMSi').attr('id','NGMSi'+serial_num)
          var svg_n_grams = SVG( 'NGMSi'+serial_num ).size('100%',20)
          serial_num++
          svg_n_grams.plain('NGMSi:').attr({'font-size':10,x:10,y:15,class:'summary_type',id:''}).fill('rgb(255,147,38)').data({type:'ngmsi'})//.size(5)
          colored_text_(arg_ngf_idf_list,svg_base_drawer=svg_n_grams,x=50,y=15,
            black_and_white = false,size = 5,class_='individual_summary_term')

          var kw_div_id = $(this_).parents('div.kw_display_unit').next().attr('id')
          if(!diagonal_dense_block_summary_dict.hasOwnProperty(kw_div_id)){
            diagonal_dense_block_summary_dict[kw_div_id] = {}
          }
          diagonal_dense_block_summary_dict[kw_div_id]['ngmsi'] = ngf_idf.map(a=>a.kw).slice(0,5)

          var arg_ngf_list = ngf.map(a=>{return {kw:a.kw,score:a.hits.length}})
          $(this_).parents('div.kw_display_unit')
          .next().find('div.NGMS').children('svg').remove()
          $(this_).parents('div.kw_display_unit')
          .next().find('div.NGMS').attr('id','NGMS'+serial_num)
          var svg_n_grams = SVG( 'NGMS'+serial_num ).size('100%',20)
          serial_num++
          svg_n_grams.plain('NGMS:').attr({'font-size':10,x:10,y:15,class:'summary_type',id:''}).fill('rgb(255,147,38)').data({type:'ngms'})//.size(5)
          colored_text_(arg_ngf_list,svg_base_drawer=svg_n_grams,x=50,y=15,
            black_and_white = false,size = 5,class_='individual_summary_term')

          var kw_div_id = $(this_).parents('div.kw_display_unit').next().attr('id')
          if(!diagonal_dense_block_summary_dict.hasOwnProperty(kw_div_id)){
            diagonal_dense_block_summary_dict[kw_div_id] = {}
          }
          diagonal_dense_block_summary_dict[kw_div_id]['ngms'] = ngf.map(a=>a.kw).slice(0,5)

          // console.log(e.data.value)
          // var unsupered_n_grams_list = e.data.value
          // console.log('unsupered_n_grams_list',unsupered_n_grams_list)
          // $(this_).parents('div.kw_display_unit')
          // .next().find('div.NGMS').children('svg').remove()
          // $(this_).parents('div.kw_display_unit')
          // .next().find('div.NGMS').attr('id','NGMS'+serial_num)
          // var svg_n_grams = SVG( 'NGMS'+serial_num ).size('100%',20)
          // serial_num++
          // svg_n_grams.plain('NGMS:').attr({'font-size':10,x:15,y:15,class:'summary_type',id:''}).fill('rgb(255,147,38)').data({type:'ngms'})//.size(5)
          // colored_text(term_list=unsupered_n_grams_list.slice(0,10),svg_base_drawer=svg_n_grams,x=50,y=15,
          //   black_and_white = false,size = 5,class_='individual_summary_term')

          // var kw_div_id = $(this_).parents('div.kw_display_unit').next().attr('id')
          // if(!diagonal_dense_block_summary_dict.hasOwnProperty(kw_div_id)){
          //   diagonal_dense_block_summary_dict[kw_div_id] = {}
          // }
          // diagonal_dense_block_summary_dict[kw_div_id]['ngms'] = unsupered_n_grams_list.slice(0,5)
        }
      }
    }
  },10)
}



function mask_start(e) {

  var ele_id = $(this).attr('id')
  if( $(this).hasClass('masked') ){
    $('rect#'+ele_id+'_mask').remove()
    // $(this).removeClass('mask_changed')
    $(this).removeClass('masked')
    $(this).parents('div.kw_display_unit').next().find('svg.svg_kw').removeClass('zoomed')
    $(this).parents('div.kw_display_unit').next().find('svg.svg_kw_hit').each(function(){
      if($(this).data('x_original') != undefined){
        $(this).attr('x', $(this).data('x_original'))
      }           
    })
  }

  var polyline_svg_x = e.pageX - $(this).attr('x')
  $(this).data('start_x',polyline_svg_x)

  SVG.get(ele_id).rect('0%','100%')
  .attr({id:ele_id+'_mask',class:'zoom_mask',x:polyline_svg_x,opacity:0.5}).fill('rgb(171,227,58)')
  // console.log('e.delegateTarget',e.delegateTarget)
  var hits_list = []
  $(this).parents('div.kw_display_unit').next().find('svg.svg_kw_hit').each(function(){
    hits_list.push($(this).attr('id'))
    })
  temp['working_kw_hits_list'] = hits_list
  $(e.delegateTarget).on('mousemove','svg.polyline_svg_kw',mousemove_polyline)
  $(e.delegateTarget).on('mouseleave','svg.polyline_svg_kw',mouseleave_polyline)
  // console.log('e.delegateTarget',e.delegateTarget)  
}

function mousemove_polyline(e){  
  var start_x = $(this).data('start_x')
  // console.log('start_x', start_x)
  var ele_id = $(this).attr('id')
  var mask = SVG.get(ele_id+'_mask')

  var ele_x = $(this).attr('x')
  polyline_svg_x = e.pageX - ele_x  

  if( polyline_svg_x - start_x <0){
    // console.log('lefting')
    mask.attr('x',polyline_svg_x)
    var width = start_x - polyline_svg_x
    mask.attr({width:width})
    var mask_start_x = polyline_svg_x
    var mask_end_x = start_x
  }else if( polyline_svg_x - start_x > 0){
    // console.log('righting')
    var width = polyline_svg_x - start_x
    // console.log(width)
    mask.attr({width:width})
    var mask_start_x = start_x
    var mask_end_x = polyline_svg_x
  }

  var zoom_factor = $(this).attr('width') / width

  if(zoom_factor <= 100){      
    $(this).parents('div.kw_display_unit').next().find('svg.svg_kw').addClass('zoomed')
    $(this).parents('div.kw_display_unit').next().find('svg.svg_kw_hit').each(function(){
      if($(this).data('x_original') == undefined){
        $(this).data('x_original',$(this).attr('x'))
      }           
      $(this).attr('x', ($(this).data('x_original') - mask.attr('x')) * zoom_factor);   

      // if( $(this).data('x_original') >= mask_start_x && $(this).data('x_original') <= mask_end_x ){
      //   $(this).data('selected',true)
      // }else{
      //   $(this).data('selected',false)
      // }
    })
  }    

  $(e.delegateTarget).off('mouseup','svg.polyline_svg_kw',mask_start)  
  $(e.delegateTarget).off('mouseup','svg.polyline_svg_kw',mask_finished)
  $(e.delegateTarget).on('mouseup','svg.polyline_svg_kw',mask_finished)

}

function draw_kw_from_polyline(event){
  // event.preventDefault()
  // event.stopPropagation()
  // console.log('event',event,event.preventDefault)
  // event.cancelBubble = true
  // event.bubbles = false
  if($(this).hasClass('clicked')){
    return
  }
  $(this).addClass('clicked')
  console.log($(this).data('source'))
  let root_ele = $(this).parents('.kw_display_unit')
  if(root_ele.data('kw_id') != undefined){
    // console.log(root_ele.data('kw_id'))
    // console.log(diagonal_kw_sum)
    // console.log(diagonal_kw_sum[ root_ele.data('kw_id') ])
    var n_gram_quad_like_list = [ data.diagonal_kw_sum_polylined[ root_ele.data('kw_id') ] ]
  }else{
    var index = root_ele.attr('id').split('__').slice(-2)[0]
    // console.log(diagonal_kw_sum[index])
    var n_gram_quad_like_list = [ data.diagonal_kw_sum_polylined[index] ]
  }
  
  var draw_resolved
  var draw_unit_promise = new Promise(r=>{draw_resolved = r})

  if($(this).data('source') == 'main'){
    var draw_ng_s = true
    var draw_ng_g = true
  }else if( $(this).data('source') != 'main' && event.which == 3 ){
    var draw_ng_s = true
    var draw_ng_g = false
  }else{
    var draw_ng_s = false
    var draw_ng_g = false
  }
  var para_draw_zoom = {unit:n_gram_quad_like_list, sents_list:sent_info_list, not_use_set_interval_temp:false, 
  circle_class:'draw_kw_from_summary', dense_cutoff_disabled:true, 
  draw_resolved_:draw_resolved, polyline_only:false, ctrl_down: event.ctrlKey,
  draw_ng_s:draw_ng_s, draw_ng_g:draw_ng_g, polyline_unit_id:root_ele.data('kw_id'), source:'polyline'}
  // console.log('event.ctrlKey',event.ctrlKey)
  // draw_zoom(n_gram_quad_like_list, sent_info_list, not_use_set_interval_temp = false,
  //  circle_class = 'draw_kw_from_summary', dense_cutoff_disabled = true, draw_resolved_ = draw_resolved,
  //  polyline_only = false) 
  draw_zoom(para_draw_zoom)
  // let that = this
  draw_unit_promise.then(function([display_unit_id_log_list_, display_unit_kw_log_list, display_unit_unique_kw_log_list]){
    console.log('display_unit_id_log_list_from_draw_kw_from_polyline',
      display_unit_id_log_list_)
    for(var display_unit_id of display_unit_id_log_list_.reverse()){
      var new_display_unit_div = $('div#'+display_unit_id)
      // console.log('new_display_unit_div',new_display_unit_div)
      root_ele.after(new_display_unit_div)

      $('div#'+display_unit_id+' text.kw').bind('click',kw_display_unit_remove)
    }
    // svg_events_binder()//临时强行无差异补充绑定一次，否则最后一个unit 的 summary_display无效，原因未知
    $(event.delegateTarget).on('mouseup','svg.polyline_svg_kw',mask_start)      
  })
  // console.log('display_unit_id_log_list',display_unit_id_log_list_)  
  // return false
}

function draw_kw_by_click_kw(){
  // event.preventDefault()
  // event.stopPropagation()
  // console.log('event',event,event.preventDefault)
  // event.cancelBubble = true
  // event.bubbles = false
  var kw = $(this).attr('id')
  console.log('kw',kw)
  console.log('event.which',event.which)
  var kw_list = [kw]
  var [a, kw_sent_global_idx_dict, c, kw_hits_obj_list] = tfidf_list_2_kw_sent_idx_dict ( kw_list, sent_info_list, 'n_gram' )
  if(event.which == 3){
    console.log('rightclick from draw_kw_by_click_kw')
    var n_gram_quad_like_list = n_gram_quad_gen_from_list(kw_hits_obj_list,no_merge=false)
  }else if(event.which == 1){
    var n_gram_quad_like_list = n_gram_quad_gen_from_list(kw_hits_obj_list,no_merge=true)
  }
  console.log('n_gram_quad_like_list',n_gram_quad_like_list)
  var draw_resolved
  var draw_unit_promise = new Promise(r=>{draw_resolved = r})

  var para_draw_zoom = {unit:n_gram_quad_like_list, sents_list:sent_info_list, not_use_set_interval_temp:false, 
  circle_class:'draw_kw_from_summary', dense_cutoff_disabled:true, 
  draw_resolved_:draw_resolved, polyline_only:false, ctrl_down: event.ctrlKey}
  // draw_zoom(n_gram_quad_like_list, sent_info_list, not_use_set_interval_temp = false, 
  //   circle_class = 'draw_kw_from_summary', dense_cutoff_disabled = true, 
  //   draw_resolved_ = draw_resolved)
  draw_zoom(para_draw_zoom)  
  let that = this
  draw_unit_promise.then(function([display_unit_id_log_list_, display_unit_kw_log_list, display_unit_unique_kw_log_list]){
    console.log('display_unit_id_log_list',display_unit_id_log_list_)
    for(var display_unit_id of display_unit_id_log_list_.reverse()){
      var new_display_unit_div = $('div#'+display_unit_id)
      // console.log('new_display_unit_div',new_display_unit_div)
      $('div#div_draw_by_click').after(new_display_unit_div)

      $('div#'+display_unit_id+' text.kw').bind('click',kw_display_unit_remove)
    }
    // svg_events_binder() //临时强行无差异补充绑定一次，否则最后一个unit 的 summary_display无效，原因未知
  })
  // console.log('display_unit_id_log_list',display_unit_id_log_list_)  
}

function draw_kw_from_textarea(event){
  // console.log($('textarea#sliding_textarea'))
  if(event.data!=null){
    if(event.data.div_to_append!=undefined){
      div_to_append = event.data.div_to_append
    }
  }else{
    div_to_append = 'head_container'
  }

  if(event.keyCode == 81){
    var texts = window.getSelection().toString()
  }else{
    var texts = $('textarea#sliding_textarea').val()    
  }
  // var texts = $('textarea#textarea').val()
  console.log('text',texts)
  var text_list = texts.split('\n').map(a=>a.trim())
  var text_list = word_list_to_lemma_list(text_list)
  console.log('text_list',text_list)  // return

  var [a, kw_sent_global_idx_dict, c, kw_hits_obj_list] = tfidf_list_2_kw_sent_idx_dict ( text_list, sent_info_list, 'n_gram' )
  console.log('kw_hits_obj_list',kw_hits_obj_list)
  if(ctrl_down == 1 || para.do_clustering == true){
    // console.log('ctrl_down == 1')
    var n_gram_quad_like_list = n_gram_quad_gen_from_list(kw_hits_obj_list,no_merge=false)
  }else if(ctrl_down == 0 && para.do_clustering == false){
    // console.log('ctrl_down == 0')
    var n_gram_quad_like_list = n_gram_quad_gen_from_list(kw_hits_obj_list,no_merge=true)
  }

  n_gram_quad_like_list = n_gram_quad_like_list.filter( a => a.dense_hits.length >= para.clustering_cutoff )

  var that = this//not sure what for
  new Promise((r,j)=>{    

    if(para.do_mutual_enrich){
      // summary_gen({diagonal_kw_sum_:n_gram_quad_like_list,summary_gen_resolved:r})
      summary_gen({diagonal_kw_sum_:n_gram_quad_like_list,summary_gen_resolved:r,
        dense_block_spanned_sents_idx_off:para.dense_block_spanned_sents_idx_off})
    }else{
      r()
    }

  }).then(function(){

    console.log('n_gram_quad_like_list',n_gram_quad_like_list)
    var draw_resolved
    var draw_unit_promise = new Promise(r=>{draw_resolved = r})

    console.log('!event.ctrlKey',!event.ctrlKey)
    console.log('event.shiftKey',event.shiftKey)
    console.log('para.draw_polyline',para.draw_polyline)
    if(para.draw_polyline == true ||
      event.shiftKey){
      var draw_polyline = true
    }else{
      var draw_polyline = false
    }
    var para_draw_zoom = {unit:n_gram_quad_like_list, sents_list:sent_info_list, not_use_set_interval_temp:false, 
    circle_class:'draw_kw_from_summary', dense_cutoff_disabled:!event.ctrlKey, 
    draw_resolved_:draw_resolved, polyline_only:draw_polyline, ctrl_down: event.ctrlKey,
    source:'textarea', mutual_enriched_only:para.mutual_enriched_only}//'source==main as a hack for now'
    // draw_zoom(n_gram_quad_like_list, sent_info_list, not_use_set_interval_temp = false, 
    //   circle_class = 'draw_kw_from_summary', dense_cutoff_disabled = true, 
    //   draw_resolved_ = draw_resolved)  
    draw_zoom(para_draw_zoom)
    let that = this
    draw_unit_promise.then(function([display_unit_id_log_list_, display_unit_kw_log_list, display_unit_unique_kw_log_list]){
      console.log('display_unit_id_log_list',display_unit_id_log_list_)
      // display_unit_id_log_list_ = sort_display_unit_ids(display_unit_id_log_list_)
      if(event.data!=null){
        if(event.data.sort){
          display_unit_id_log_list_.sort( (a,b) => $('#'+a).data('dense_start') - $('#'+b).data('dense_start') )
        }
      }      

      for(var display_unit_id of display_unit_id_log_list_.reverse()){
        var new_display_unit_div = $('div#'+display_unit_id)
        // console.log('new_display_unit_div',new_display_unit_div)
        // $(that).parents('.kw_display_unit').after(new_display_unit_div)
        $('div#'+div_to_append).after(new_display_unit_div)

        $('div#'+display_unit_id+' text.kw').bind('click',kw_display_unit_remove)
      }
      // svg_events_binder()//临时强行无差异补充绑定一次，否则最后一个unit 的 summary_display无效，原因未知
      // window.scrollBy(0, 700)
    })
    // console.log('display_unit_id_log_list',display_unit_id_log_list_)  

  })
}

function draw_kw_from_summary(event){
  console.log(this)
  console.log($(this))
  console.log(this.textContent)
  console.log($(this).html())  
  console.log($(this).parents('.kw_display_unit'))
  if(this.textContent.includes(',')){
    var kw = this.textContent.split(',')[0]
  }else{
    var kw = this.textContent.split(' | ')[0]
  }  
  console.log('kw',kw)
  $.post('kw:_'+kw)
  var kw_list = [kw]
  var [a, kw_sent_global_idx_dict, c, kw_hits_obj_list] = tfidf_list_2_kw_sent_idx_dict ( kw_list, sent_info_list, 'n_gram' )
  $.post('kw_hits_obj_list_length:_'+kw_hits_obj_list.length)
  console.log('event',event)
  console.log('event.which',event.which)
  if(event.which == 3 || para.do_clustering == true){
    var n_gram_quad_like_list = n_gram_quad_gen_from_list(kw_hits_obj_list,no_merge=false)
  }else if(event.which == 1 && para.do_clustering == false){
    var n_gram_quad_like_list = n_gram_quad_gen_from_list(kw_hits_obj_list,no_merge=true)
  } 

  n_gram_quad_like_list = n_gram_quad_like_list.filter( a => a.dense_hits.length >= para.clustering_cutoff )
  
  var that = this
  new Promise((r,j)=>{
    if(para.do_mutual_enrich){
      // summary_gen({diagonal_kw_sum_:n_gram_quad_like_list,summary_gen_resolved:r})
      summary_gen({diagonal_kw_sum_:n_gram_quad_like_list,summary_gen_resolved:r,
        dense_block_spanned_sents_idx_off:para.dense_block_spanned_sents_idx_off})
    }else{
      r()
    }
    // summary_gen({diagonal_kw_sum_:n_gram_quad_like_list,summary_gen_resolved:r})
  }).then(function(){

    console.log('n_gram_quad_like_list',n_gram_quad_like_list)
    $.post('n_gram_quad_like_list_length:_'+n_gram_quad_like_list.length)
    var draw_resolved
    var draw_unit_promise = new Promise(r=>{draw_resolved = r})
    if(event.shiftKey){    
      var polyline_only = true
    }else if(para.polyline_from_summary){
      var polyline_only = true
    }else{
      var polyline_only = false
    }
    var para_draw_zoom = {unit:n_gram_quad_like_list, sents_list:sent_info_list, not_use_set_interval_temp:false, 
    circle_class:'draw_kw_from_summary', dense_cutoff_disabled:true, 
    draw_resolved_:draw_resolved, polyline_only:polyline_only, ctrl_down: event.ctrlKey,
    trigger:'summary', merge: event.which == 3, source:'summary', mutual_enriched_only: para.mutual_enriched_only}
    console.log('event.ctrlKey',event.ctrlKey)
    console.log(para_draw_zoom)
    // draw_zoom(n_gram_quad_like_list, sent_info_list, not_use_set_interval_temp = false, 
    //   circle_class = 'draw_kw_from_summary', dense_cutoff_disabled = true, 
    //   draw_resolved_ = draw_resolved)  
    draw_zoom(para_draw_zoom)
    // let that = this
    draw_unit_promise.then(function([display_unit_id_log_list_, display_unit_kw_log_list, display_unit_unique_kw_log_list]){
      console.log('display_unit_id_log_list',display_unit_id_log_list_)
      $.post('draw_zoom_done_and_display_unit_id_log_list_length:_'+display_unit_id_log_list_.length)
      for(var display_unit_id of display_unit_id_log_list_.reverse()){
        var new_display_unit_div = $('div#'+display_unit_id)
        // console.log('new_display_unit_div',new_display_unit_div)
        $.post('before_append')
        $(that).parents('.kw_display_unit').after(new_display_unit_div)
        $.post('after_append')

        $('div#'+display_unit_id+' text.kw').bind('click',kw_display_unit_remove)
      }
      // svg_events_binder()//临时强行无差异补充绑定一次，否则最后一个unit 的 summary_display无效，原因未知
      // window.scrollBy(0, 700)
    })
    // console.log('display_unit_id_log_list',display_unit_id_log_list_)  
  })

}

function summary_display(){
  // console.log('event.type',event.type)
  var this_id = $(this).attr('id')
  var kw_div_id = this_id.split('_after_kw_div_id')[0]
  // var summary_div = $('#'+kw_div_id+'_for_summary')
  var summary_div = $(this).parents('svg.svg_parent').next()
  if(event.type == 'mouseover'){
    summary_div.removeClass('hidding_summary')
  }else if(event.type == 'mouseout' && !summary_div.hasClass('keep_showing_summary')){
    summary_div.addClass('hidding_summary')
  }else if(event.type == 'click' && !summary_div.hasClass('keep_showing_summary')){
    summary_div.addClass('keep_showing_summary')
    summary_div.removeClass('hidding_summary')
  }else if(event.type == 'click' && summary_div.hasClass('keep_showing_summary')){
    summary_div.removeClass('keep_showing_summary')
    summary_div.addClass('hidding_summary')
  }
  
}

function n_gram_display_min_dense_hits_filter(){
  n_gram_display_min_dense_hit_num_cutoff_value = this.value
  console.log(n_gram_display_min_dense_hit_num_cutoff_value)
  for(var i in n_gram_dense_hit_num_vs_occurence_num_dict){
    if(+i < +n_gram_display_min_dense_hit_num_cutoff_value || +i > +n_gram_display_max_dense_hit_num_cutoff_value){
      for(var kw of new Set(n_gram_dense_hit_num_vs_occurence_num_dict[i])){
        var kw_div_list = $('.'+kw.split(' ').join('_'))
        kw_div_list.each(function(){
          // if(this.id.split('__').slice(-1)[0]==i){
          // console.log($(this).data('dense_hits_num'))
          if($(this).data('dense_hits_num')==i){
            this.style.display = 'none'
            // console.log('class_old',this.id,$(this).attr('class'))
            $(this).addClass('hidden_kw_div')
            // console.log('class ',this.id,$(this).attr('class'))
          }
        })
      }
    }else{
      for(var kw of new Set(n_gram_dense_hit_num_vs_occurence_num_dict[i])){
        var kw_div_list = $('.'+kw.split(' ').join('_'))
        kw_div_list.each(function(){
          // if(this.id.split('__').slice(-1)[0]==i){
          // console.log($(this).data('dense_hits_num'))
          if($(this).data('dense_hits_num')==i){
            
            this.style.display = ''
            if($(this).hasClass('unhidden_kw_div')){
              $(this).removeClass('unhidden_kw_div')
            }
            if($(this).hasClass('hidden_kw_div')){
              $(this).addClass('unhidden_kw_div')
              $(this).removeClass('hidden_kw_div')              
            }

            // console.log($(this).attr('id'))
            // console.log($(this).find('text.kw_over_dense_hits_region_text'))
            var text_width = $(this).find('text.kw_over_dense_hits_region_text')[0].getBBox().width
            // console.log(text_width)
            // console.log($(this).find('rect.kw_over_dense_hits_region_background'))
            $(this).find('rect.kw_over_dense_hits_region_background').attr('width',text_width)
          }
          // $(this).hide()
        })
      }
    }
  }
  var rect_n_gram_filter_list = $('rect.'+'rect_n_gram_dense_hit_num_filter')
  for(var rect of rect_n_gram_filter_list){
    if(+rect.id < +n_gram_display_min_dense_hit_num_cutoff_value || +rect.id > +n_gram_display_max_dense_hit_num_cutoff_value){
      rect.style.fill = 'gray'
    }else{
      rect.style.fill = 'black'
    }
  }
}

function n_gram_display_max_dense_hits_filter(){
  n_gram_display_max_dense_hit_num_cutoff_value = this.value
  console.log(n_gram_display_max_dense_hit_num_cutoff_value)
  for(var i in n_gram_dense_hit_num_vs_occurence_num_dict){
    if(+i < +n_gram_display_min_dense_hit_num_cutoff_value || +i > +n_gram_display_max_dense_hit_num_cutoff_value){
      for(var kw of new Set(n_gram_dense_hit_num_vs_occurence_num_dict[i])){
        // console.log('gonna hide',kw)
        var kw_div_list = $('.'+kw.split(' ').join('_'))
        // console.log('kw_div_list',kw_div_list)
        kw_div_list.each(function(){
          // if(this.id.split('__').slice(-1)[0]==i){            
          // console.log($(this).data('dense_hits_num'))
          if($(this).data('dense_hits_num')==i){            
            this.style.display = 'none'
            $(this).addClass('hidden_kw_div')            
          }
        })
      }
      // console.log('new Set(n_gram_dense_hit_num_vs_occurence_num_dict[i])',i,n_gram_hit_num_vs_phrases_dict[i])
    }else{
      for(var kw of new Set(n_gram_dense_hit_num_vs_occurence_num_dict[i])){
        // console.log(i,kw)
        var kw_div_list = $('.'+kw.split(' ').join('_'))
        kw_div_list.each(function(){
          // if(this.id.split('__').slice(-1)[0]==i){            
          // console.log($(this).data('dense_hits_num'))
          if($(this).data('dense_hits_num')==i){            
            this.style.display = ''
            if($(this).hasClass('unhidden_kw_div')){
              $(this).removeClass('unhidden_kw_div')
            }
            if($(this).hasClass('hidden_kw_div')){
              $(this).addClass('unhidden_kw_div')
              $(this).removeClass('hidden_kw_div')              
            }

            var text_width = $(this).find('text.kw_over_dense_hits_region_text')[0].getBBox().width
            $(this).find('rect.kw_over_dense_hits_region_background').attr('width',text_width)            
          }
          // $(this).hide()
        })
      }
    }
  }
  var rect_n_gram_filter_list = $('rect.'+'rect_n_gram_dense_hit_num_filter')
  for(var rect of rect_n_gram_filter_list){
    if(+rect.id < +n_gram_display_min_dense_hit_num_cutoff_value || +rect.id > +n_gram_display_max_dense_hit_num_cutoff_value){
      rect.style.fill = 'gray'
    }else{
      rect.style.fill = 'black'
    }
  }
}


function n_gram_display_min_hits_filter(){
  n_gram_display_min_hits_cutoff_value = this.value
  console.log(n_gram_display_min_hits_cutoff_value)
  for(var i in n_gram_hit_num_vs_phrases_dict){
    if(+i < +n_gram_display_min_hits_cutoff_value || +i > +n_gram_display_max_hits_cutoff_value){
      for(var kw of n_gram_hit_num_vs_phrases_dict[i]){
        var kw_div_list = $('.'+kw.split(' ').join('_'))
        kw_div_list.each(function(){
          this.style.display = 'none'
          $(this).addClass('hidden_kw_div')
        })
      }
    }else{
      for(var kw of n_gram_hit_num_vs_phrases_dict[i]){
        var kw_div_list = $('.'+kw.split(' ').join('_'))
        kw_div_list.each(function(){
          this.style.display = ''
          if($(this).hasClass('unhidden_kw_div')){
            $(this).removeClass('unhidden_kw_div')
          }
          if($(this).hasClass('hidden_kw_div')){
            $(this).addClass('unhidden_kw_div')
            $(this).removeClass('hidden_kw_div')              
          }
          var text_width = $(this).find('text.kw_over_dense_hits_region_text')[0].getBBox().width
          $(this).find('rect.kw_over_dense_hits_region_background').attr('width',text_width) 
          // $(this).hide()
        })
      }
    }
  }
  var rect_n_gram_filter_list = $('rect.'+'rect_n_gram_filter')
  for(var rect of rect_n_gram_filter_list){
    if(+rect.id < +n_gram_display_min_hits_cutoff_value || +rect.id > +n_gram_display_max_hits_cutoff_value){
      rect.style.fill = 'gray'
    }else{
      rect.style.fill = 'black'
    }
  }
}

function n_gram_display_max_hits_filter(){
  n_gram_display_max_hits_cutoff_value = this.value
  console.log(n_gram_display_max_hits_cutoff_value)
  for(var i in n_gram_hit_num_vs_phrases_dict){
    if(+i < +n_gram_display_min_hits_cutoff_value || +i > +n_gram_display_max_hits_cutoff_value){
      for(var kw of n_gram_hit_num_vs_phrases_dict[i]){
        // console.log('gonna hide',kw)
        var kw_div_list = $('.'+kw.split(' ').join('_'))
        // console.log('kw_div_list',kw_div_list)
        kw_div_list.each(function(){
          this.style.display = 'none'
          $(this).addClass('hidden_kw_div')          
        })
      }
      // console.log('n_gram_hit_num_vs_phrases_dict[i]',i,n_gram_hit_num_vs_phrases_dict[i])
    }else{
      for(var kw of n_gram_hit_num_vs_phrases_dict[i]){
        // console.log(i,kw)
        var kw_div_list = $('.'+kw.split(' ').join('_'))
        kw_div_list.each(function(){
          this.style.display = ''
          if($(this).hasClass('unhidden_kw_div')){
            $(this).removeClass('unhidden_kw_div')
          }
          if($(this).hasClass('hidden_kw_div')){
            $(this).addClass('unhidden_kw_div')
            $(this).removeClass('hidden_kw_div')              
          }
          var text_width = $(this).find('text.kw_over_dense_hits_region_text')[0].getBBox().width
          $(this).find('rect.kw_over_dense_hits_region_background').attr('width',text_width) 
          // $(this).hide()
        })
      }
    }
  }
  var rect_n_gram_filter_list = $('rect.'+'rect_n_gram_filter')
  for(var rect of rect_n_gram_filter_list){
    if(+rect.id < +n_gram_display_min_hits_cutoff_value || +rect.id > +n_gram_display_max_hits_cutoff_value){
      rect.style.fill = 'gray'
    }else{
      rect.style.fill = 'black'
    }
  }
}

function draw_selected_sents(){
  if( previewing ==1||ctrl_down == 0){
          return;
  }
  // alert(this.id)
  if (sent_start_id == '' && sent_stop_id == ''){
    sent_start_id = this.id
    console.log('start id loaded',sent_start_id)
  }else if(sent_start_id != '' && sent_stop_id == ''){
    sent_stop_id = this.id
    console.log('stop id loaded',sent_stop_id)
    console.log('start',sent_start_id,'stop',sent_stop_id)
    console.log('options',options)
    options.start_sent_idx = sent_start_id
    options.end_sent_idx = sent_stop_id
    console.log('options',options)
    var options_json = JSON.stringify( options )
    console.log('options_json',options_json)
    var newWin = window.open('viewer_URL.html?'+options_json,'_blank')
    // s2t(Number(sent_start_id),Number(sent_stop_id))
    // diving();
  }else if(sent_start_id != '' && sent_stop_id != ''){
    sent_start_id = this.id
    sent_stop_id = ''
    console.log('start id loaded,stop id emptied',sent_start_id)
  }
}


function rect_clicked(){
  if(ctrl_down == 1){
          return;
  }
    previewing = 1;
    // rect_clicked_id = 
    view.css('pointer-events','auto')
    //console.log('previewing = 1;')     
}


function pdf_io(el){
var oc = $('#outerContainer');
// $('body').prepend(oc)
el.click(function(){
console.log('ctrl_down',ctrl_down)
if(ctrl_down == 1){
  return
}
  //console.log('click button');
if(oc.hasClass('in')){
  oc.animate({left:'100%'}).removeClass('in');
  pdfIn = 0;
} else {
  oc.animate({left:'15%'}).addClass('in')
  pdfIn = 1;
}
});
};


function shrink(event){
        if(spreaded == 1 && previewing == 0){
            $(event.delegateTarget).on('mouseover','svg.svg_kw_hit',spread)
            $(this).children('svg.svg_kw_hit').each(function(){
              $(this).attr('x',$(this).data('x_original'))
              // $(this).bind('mouseover',spread)
            })
            spreaded = 0
        }
      else if(spreaded == 1 && previewing == 1){
        var that = this
        var event_delegateTarget = event.delegateTarget
        view.bind('destroyed',function(){
          console.log('destroyed triggered')
          $(event_delegateTarget).on('mouseover','svg.svg_kw_hit',spread)
          $(that).children('svg.svg_kw_hit').each(function(){
              $(this).attr('x',$(this).data('x_original'))
              // $(this).bind('mouseover',spread)
            })
        })
        console.log('shrink bound')
        spreaded = 0
      }  
}             
            
function spread(event){
        // console.log('event.delegateTarget',event.delegateTarget)
        if( previewing ==1||ctrl_down == 1 || alt_down == 1){
                  return;
          }
        if($(this).parent().hasClass('zoomed')){
          return
        }
        current_group = $(this).parent()        
        backup_group = current_group.clone(true)
        cloned_group = current_group.clone(true)
        x_evt = $(this).attr('x')
        //计算放大后整体平移量
        back_shift = x_evt*spread_factor - x_evt
        ////console.log('back_shift is',back_shift)
        //挨个处理rect_id^=cvr
        // current_group.find('rect[id^=cvr]').each(function(){
        $(event.delegateTarget).off('mouseover','svg.svg_kw_hit',spread)
        current_group.find('svg.svg_kw_hit').each(function(){
                sib = $(this)
                //debugger
                //暂时关闭所有mouseover spread
                // sib.unbind('mouseover',spread);
                //挨个sib移动
                $(this).data('x_original',$(this).attr('x'))
                sib_x = $(this).attr('x');
                ////console.log('sib_x is',sib_x)
                var sib_x_new=sib_x*spread_factor - back_shift
                $(this).attr('x',sib_x_new);              
        })
        spreaded=1
        // console.log('spreaded')
}
        
function preview(){
        if(previewing ==1||ctrl_down == 1){
            return;
        }
        view = $("<div id='view'>");
        viewing = 1;

        windowWidth = $(window).width();
        windowHeight = $(window).height();

        halfWindowSize = 0.5*windowWidth;

        if(event.clientX + halfWindowSize > windowWidth){
          offSetLeft = event.clientX + halfWindowSize - windowWidth
          viewLeftX = event.pageX - offSetLeft - 100;
        }else{
          viewLeftX = event.pageX;
        }

        $('body').append(view);
        view.css({
              'z-index':1,
              'pointer-events':'none',
              'max-height': windowHeight - 40 - 40 + 'px',
              'font-size':'medium',
              'overflow': 'scroll',
             'border':'1px solid green',
              'position':'absolute',
              'padding':'20px 20px 20px 20px',
             'border':'1px solid #333333',
              background:'rgba(246,246,246,1)',
             'opacity':'1',
              'width': halfWindowSize + 'px',
             'left':viewLeftX+10+'px',
             'top':event.pageY+ previewDownOffset +'px',
        })
        var source_polyline_unit_id = $(this).parents('div.kw_display_unit').data('source_polyline_unit_id')
        console.log(source_polyline_unit_id)
        rect_cvr = $(this).children('rect[id^=cvr]')
        rect_cvr.data('fill_original',rect_cvr.attr('fill'))
        rect_cvr.data('previewed',1)
        rect_cvr.attr('fill','green')
        rect_cvr.data('opacity_original',rect_cvr.attr('opacity'))
        rect_cvr.attr('opacity','1')
        rect_cvr.data('width_original',rect_cvr.attr('width'))
        rect_cvr.attr('width','10%')
        arg_id = rect_cvr.attr('id');
        arg_x = $(this).attr('x');
        core_id = arg_id.split('-')[1]
        kw = core_id.split('__')[0]
        group_id = arg_id.split('__')[0]
        if(spreaded==0){     
                preview_range=preview_range_base
                console.log('preview_range',preview_range)
        }else{
                preview_range=preview_range_base*spread_factor
                console.log('preview_range else',preview_range)
        }
        // view_sents_list.length = 0;
        var view_sents_list = []
        current_group = $(this).parent()
        // var summary_idx = current_group.attr('id')
        counter = 1
        var class_value = $(this).attr('class')
        // console.log('class_value',class_value)
        current_group.children('svg.'+class_value).each(function(){
        // current_group.children('svg.svg_kw_hit').each(function(){
        // $("rect[id^="+group_id+"__"+"]").each(function(){
            i_x = $(this).attr('x');

            rect_cvr = $(this).children('rect[id^=cvr]')
            // if(Math.abs(i_x - arg_x)<preview_range){ 
            var distance = i_x - arg_x     

            var preview_this_one = false              
            if(counter <= sent_num_per_spread_span_no_less_than){
              if(distance >= 0){
                preview_this_one = true
              }
            }else{
              if(distance >= 0 && distance < preview_range){
                preview_this_one = true
              }
            }

            if(preview_this_one){
                    counter += 1
                    i_id=rect_cvr.attr('id')

                    if(i_id != arg_id){
                      rect_cvr.data('fill_original',rect_cvr.attr('fill'))
                      rect_cvr.data('previewed',1)
                      rect_cvr.attr('fill','green')
                      rect_cvr.data('opacity_original',rect_cvr.attr('opacity'))
                      rect_cvr.attr('opacity','0.3')
                      rect_cvr.data('width_original',rect_cvr.attr('width'))
                      rect_cvr.attr('width','10%')
                    }
                    let i_core_id = i_id.split('-')[1]
                    let is_title
                    if(i_core_id.match(/^THE_TITLES/)){
                      is_title = true
                    }else{
                      is_title = false
                    }
                    // console.log('kw_hits_dict',kw_hits_dict)
                    console.log('i_core_id',i_core_id)
                    // console.log('kw_hits_dict[i_core_id]',kw_hits_dict[i_core_id])

                    var sent_idx = kw_hits_dict[i_core_id]['sent_idx']
                    let sent_text = sent_info_dict[sent_idx]['sent']
                    let sent_text_highlighted = sent_info_dict[sent_idx]['sent'].replace(/([\u4e00-\u9fa5]) +(?=[\u4e00-\u9fa5])/g,'$1')
                    view_sents_list.push(sent_text)
                    var quering_keyword = kw_hits_dict[i_core_id]['quering_keyword']

                    if(quering_keyword == 'cheat'){
                      var word_a_match = 'cheat'
                    }else if(quering_keyword.match(/ /) && kw_hits_dict[i_core_id]['quering_keyword_expanded']!=null){
                      // var quering_keyword_re = new RegExp(quering_keyword,'i');
                      // var word_a_match = sent_text.match(quering_keyword_re)
                      // var word_a_match = quering_keyword
                      var word_a_match = kw_hits_dict[i_core_id]['quering_keyword_expanded']
                    }else if(quering_keyword.match(/[\u4e00-\u9fa5]/)){
                      var word_a_match = quering_keyword
                    }else{
                      var word_a_match = match_lemma_or_original_to_match_original(quering_keyword,sent_text)
                      if(word_a_match == undefined){
                        var word_a_match = quering_keyword
                      }
                    }
                    word_a_match = word_a_match.replace(/([\]\[+)(|])/g,'\\$1')
                    console.log('word_a_match',word_a_match)
                    
                    // word_a_match = kw_hits_dict[i_core_id]['matches']
                    let word_a_ = word_a_match;

                    if(word_a_.match(/[\u4e00-\u9fa5]/)){
                      var word_a_re = new RegExp('(' + word_a_match + ')','gi')
                    }else{
                      var word_a_re = new RegExp('(\\b' + word_a_match + ')','gi')
                    }
                    if(sent_text_highlighted.match(word_a_re)!=null){
                      sent_text_highlighted = sent_text_highlighted.replace(word_a_re,'<span class="index">$1</span>')
                    }else if(word_a_.match(/ /i)){
                      var kws_list = word_a_.match(/[a-zA-Z]+/gi)
                      for (var k = 0; k < kws_list.length; k++) {
                        var kw = kws_list[k]
                        var word_a_re = new RegExp('(\\b' + kw + ')','gi');
                        sent_text_highlighted = sent_text_highlighted.replace(word_a_re,'<span class="index">$1</span>')
                      }
                    }

                    // if(word_a_.match(/ /i)){
                    //   var kws_list = word_a_.match(/[a-zA-Z]+/gi)
                    //   for (var k = 0; k < kws_list.length; k++) {
                    //     var kw = kws_list[k]
                    //     var word_a_re = new RegExp('(\\b' + kw + ')','gi');
                    //     sent_text_highlighted = sent_text_highlighted.replace(word_a_re,'<span class="index">$1</span>')
                    //   }
                    // }else{
                    //   var word_a_re = new RegExp('(\\b' + word_a_match + ')','gi');
                    //   sent_text_highlighted = sent_text_highlighted.replace(word_a_re,'<span class="index">$1</span>')
                    // }   
                                     
                    if( sent_text == sent_text){
                    }
                    var i_text_p = $('<p class="sent"></p>').html(sent_text_highlighted)

                    i_text_p.addClass('sentPreviews')
                    sent_page_no = $('<span>&nbsp&nbsp&nbsp<'+kw_hits_dict[i_core_id]['page']+'></span>')
                    i_text_p.append(sent_page_no)
                    sent_idx = $('<span class="sent_idx">&nbsp&nbsp&nbsp#&nbsp'+sent_idx + '</span>')
                    i_text_p.append(sent_idx)
                    i_text_p.css('font-size','medium')
                    pdf_io(i_text_p)

                    i_text_p.click(function(){
                      console.log('ctrl_down',ctrl_down)
                      if(ctrl_down == 1){
                        return
                      }
                      var current_page = kw_hits_dict[i_core_id]['page']
                      window.PDFViewerApplication.page = current_page

                      console.log(sent_text)

                      if(is_title){
                        // var mainly_english = true
                        if(sent_text.match(/[\u4e00-\u9fa5]/g) != null && sent_text.match(/[a-zA-Z]{3,}/g) != null){
                          if(sent_text.match(/[a-zA-Z]{3,}/g).length >= sent_text.match(/[\u4e00-\u9fa5]/g).length){
                            mainly_english = true
                          }else{
                            mainly_english = false
                          }
                        }else if(sent_text.match(/[\u4e00-\u9fa5]/g) == null){
                          mainly_english = true
                        }else if(sent_text.match(/[a-zA-Z]{3,}/g) == null){
                          mainly_english = false
                        }
                      }else{
                        if(word_a_.match(/[\u4e00-\u9fa5]/)){
                          var mainly_english = false
                        }else{
                          var mainly_english = true
                        }
                      }
                      // if(word_a_.match(/[\u4e00-\u9fa5]/g)){
                      if( mainly_english == false ){

                        if(!is_title){
                          console.log(word_a_.match(/[\u4e00-\u9fa5]/g))
                          if(word_a_.match(/[\u4e00-\u9fa5]/g).length > 1){
                            console.log('multiple chr')
                            word_a_spaced = word_a_.match(/[\u4e00-\u9fa5]/g).join(' *')
                            console.log(word_a_spaced)
                            var word_a_re = new RegExp("(( *[\\u4e00-\\u9fa5]?|^|$)"+' *'+word_a_spaced + '[\\u4e00-\\u9fa5]?( *[\\u4e00-\\u9fa5]?|^|$))','gi')
                            console.log(word_a_re)
                          }else{
                            var word_a_re = new RegExp("(( *[\\u4e00-\\u9fa5]?|^|$)"+' *'+word_a_ + '[\\u4e00-\\u9fa5]?( *[\\u4e00-\\u9fa5]?|^|$))','gi')
                          }     
                          var word_a_res = sent_text.match(word_a_re)
                          console.log(word_a_res)
                        }else{
                          var word_a_res = ['']
                        }                  

                        var sent_head_res = []
                        var sent_text_tmp = sent_text
                        for(var i=0;i<3;i++){
                          var head = sent_text_tmp.match(/^[^\u4e00-\u9fa5\w]*[\u4e00-\u9fa5] *|^[^\u4e00-\u9fa5\w]*\w+ */)
                          console.log(head[0])
                          sent_head_res.push(head[0])
                          sent_text_tmp = sent_text_tmp.replace(/^[^\u4e00-\u9fa5\w]*[\u4e00-\u9fa5] *|^[^\u4e00-\u9fa5\w]*\w+ */,'')

                        }     
                        sent_head_res = [sent_head_res.join('')]
                        console.log(sent_head_res)

                        var sent_tail_res = []
                        var sent_text_tmp = sent_text
                        console.log(sent_text_tmp)
                        for(var i=0;i<3;i++){
                          var tail = sent_text_tmp.match(/[\u4e00-\u9fa5][^\u4e00-\u9fa5\w]*$|\w+[^\u4e00-\u9fa5\w]*$/)
                          console.log(tail[0])
                          sent_tail_res.unshift(tail[0])
                          sent_text_tmp = sent_text_tmp.replace(/[\u4e00-\u9fa5][^\u4e00-\u9fa5\w]*$|\w+[^\u4e00-\u9fa5\w]*$/,'')

                        }  
                        sent_tail_res = [sent_tail_res.join('').replace(/。$/,'')]
                        console.log(sent_tail_res)                        

                        // var sent_head_re = new RegExp("(^( *[\\u4e00-\\u9fa5]?|\\w*|^|$)( *[\\u4e00-\\u9fa5]?|\\w*|^|$)( *[\\u4e00-\\u9fa5]?|\\w*|^|$))",'gi');
                        // var sent_tail_re = new RegExp("(([\\u4e00-\\u9fa5]?|^|$)( *[\\u4e00-\\u9fa5]?|^|$)( *[\\u4e00-\\u9fa5]?[ 。]*|^|$)$)",'gi');
                      }else{
                        var word_a_re = new RegExp("((\\W*\\w*|^|$)"+'\\W*\\b'+word_a_ + '\\w*(\\W*\\w*|^|$))','gi');
                        var sent_head_re = new RegExp("(^(\\W*\\w*|^|$)(\\W*\\w*|^|$)(\\W*\\w*|^|$))",'gi');
                        var sent_tail_re = new RegExp("((\\w*|^|$)(\\W*\\w*|^|$)(\\W*\\w*\\W*|^|$)$)",'gi');
                        var word_a_res = sent_text.match(word_a_re)
                        console.log(word_a_res)
                        var sent_head_res = sent_text.match(sent_head_re)
                        console.log(sent_head_res)
                        var sent_tail_res = sent_text.match(sent_tail_re)
                        console.log(sent_tail_res)                        
                      }


                      // word_a_re = new RegExp("((\\W*\\w*|^|$)"+'\\W*\\b'+word_a_ + '\\w*(\\W*\\w*|^|$))','gi');
                      // var word_a_res = sent_text.match(word_a_re)
                      // console.log(word_a_res)
                      // sent_head_re = new RegExp("(^(\\W*\\w*|^|$)(\\W*\\w*|^|$)(\\W*\\w*|^|$))",'gi');
                      // var sent_head_res = sent_text.match(sent_head_re)
                      // console.log(sent_head_res)
                      // sent_tail_re = new RegExp("((\\w*|^|$)(\\W*\\w*|^|$)(\\W*\\w*\\W*|^|$)$)",'gi');
                      // var sent_tail_res = sent_text.match(sent_tail_re)
                      // console.log(sent_tail_res)

                      current_extended_terms_array = [];
                      current_extended_terms_array = current_extended_terms_array.concat(word_a_res);
                      current_extended_terms_array = current_extended_terms_array.concat(sent_head_res);
                      current_extended_terms_array = current_extended_terms_array.concat(sent_tail_res);
                      // current_extended_terms_array = current_extended_terms_array.concat(sent_text.match(word_a_re));
                      // current_extended_terms_array = current_extended_terms_array.concat(sent_text.match(sent_head_re));
                      // current_extended_terms_array = current_extended_terms_array.concat(sent_text.match(sent_tail_re));
                      current_extended_terms = '';
                      for(const i of current_extended_terms_array){
                        // console.log('i',i)
                        if(i!=null){
                          i_trim = i.trim();
                          current_extended_terms += '  ' + i_trim.replace(/ /g,'_').replace(/([\]\[+)(|])/g,'\\$1')
                          // current_extended_terms += '  ' + i_trim.replace(/ /g,'_').replace(/\(/g,'\\(').replace(/\)/g,'\\)')
                        }
                        
                      }


                      current_unextended_terms = '';
                      for(const i of [word_a_]){
                        if(i!=null){
                          i_trim = i.trim();
                          current_unextended_terms += '  ' + i_trim.replace(/ /g,'_')
                        }
                      }

                      current_ext_unext_terms = '';
                      for(const i of current_extended_terms_array.concat([word_a_])){
                        if(i!=null){
                          i_trim = i.trim();
                          current_ext_unext_terms += '  ' + i_trim.replace(/ /g,'_')
                        }
                      }

                      if (useExtendedTerms){
                        $('#findInput')[0].value = current_extended_terms;                      }
                      else if(useExtUnextendedTerms){
                        $('#findInput')[0].value = current_ext_unext_terms;
                      }
                      else if(useUnxtendedTerms){
                        $('#findInput')[0].value = current_unextended_terms;
                      }
                      document.getElementById('findHighlightAll').checked=false
                      document.getElementById('findHighlightAll').click()

                      if($('#sidebarToggle').hasClass('toggled')){
                        document.getElementById('sidebarToggle').click()
                      }
                      // console.log('first_pdf_in',first_pdf_in)
                      if (first_pdf_in == true){
                        PDFViewerApplication.pdfViewer.currentScaleValue = "page-width";
                        first_pdf_in = false;
                      }
                    })
                    view.append(i_text_p)
            }
        });
        current_preview_bottom = event.clientY + previewDownOffset + view.outerHeight()
        if( current_preview_bottom > windowHeight ){
          offUp = current_preview_bottom - windowHeight
          TopNew = event.pageY + previewDownOffset - offUp -10
          view.css('top',TopNew +'px')
        }

        if(false){//color coding from traditional summary
          var summary_idx = $(this).parents('.kw_display_unit').attr('id')
          console.log('summary_idx',summary_idx)
          var summary_color_coding_type = $(this).parents('div.kw_display_unit').data('summary_color_coding_type')
          console.log('summary_color_coding_type',summary_color_coding_type)
          
          if(diagonal_dense_block_summary_dict.hasOwnProperty(summary_idx) && highlight_disabled == 1){          
            var to_be_marked_list = diagonal_dense_block_summary_dict[summary_idx][summary_color_coding_type]
            console.log('to_be_marked_list 1',to_be_marked_list)
            if(to_be_marked_list != undefined){
              to_be_marked_list = to_be_marked_list.map(a=>typeof a == 'string'? a:a[0])
              console.log('summary_color_coding_type',summary_color_coding_type)
              console.log('to_be_marked_list 2',to_be_marked_list)
              div_p_term_marker(to_be_marked_list,kw)   
            }                
          }else{
            console.warn('invalid summary_idx')
          }
        }     


        var text_color_dict = data['diagonal_kw_sum_polylined'][source_polyline_unit_id]['mutual_enriching_word_color_coding_log_dict']
        div_p_term_marker_2({text_color_dict:text_color_dict,is_mutual:true})

        var text_color_dict = data['diagonal_kw_sum_polylined'][source_polyline_unit_id]['nonmutual_enriching_word_color_coding_log_dict']
        div_p_term_marker_2({text_color_dict:text_color_dict,is_mutual:false})
}

function disappear(){

        if(viewing == 0){
          return
        }

        var that = this

        if(previewing == 1){

            view.bind('destroyed',function(){

              viewing = 0;

              rect_cvr = $(that).children('rect[id^=cvr]')
              rect_green_id = rect_cvr.attr('id');
              arg_id = rect_cvr.attr('id');
              arg_x = $(that).attr('x');
              core_id = arg_id.split('-')[1]
              group_id = arg_id.split('_')[0]

              setTimeout(function(){
                rect_cvr.attr('fill',rect_cvr.data('fill_original'))
                rect_cvr.attr('opacity',rect_cvr.data('opacity_original'))
                rect_cvr.attr('width',rect_cvr.data('width_original'))
              }, 0);
              if(spreaded==0){        
                      preview_range=preview_range_base
              }else{
                      preview_range=preview_range_base*spread_factor
              }
              // $("rect[id^="+group_id+"_"+"]").each(function(){
              var counter = 1
              var class_value = $(that).attr('class')
              $(that).parent().children('svg.'+class_value).each(function(){
              // $(that).parent().children('svg.svg_kw_hit').each(function(){
                  i_x = $(this).attr('x');

                  var rect_cvr = $(this).children('rect[id^=cvr]')
                  i_id=rect_cvr.attr('id');
                  
                  //\\//
                  var distance = i_x - arg_x
                  var preview_this_one = false              
                  if(counter <= sent_num_per_spread_span_no_less_than){
                    if(distance >= 0){
                      preview_this_one = true
                    }
                  }else{
                    if(distance >= 0 && distance < preview_range){
                      preview_this_one = true
                    }
                  }
                  ////\\

                  var previewed = rect_cvr.data('previewed')
                  if(rect_cvr.data('previewed') == 1){
                  // if(preview_this_one){
                    counter += 1
                    rect_cvr.data('previewed',0)
                    rect_cvr.attr('fill',rect_cvr.data('fill_original'))
                    rect_cvr.attr('opacity',rect_cvr.data('opacity_original'))
                    rect_cvr.attr('width',rect_cvr.data('width_original'))

                    var myVar = setInterval(function(){
                      rect_cvr.attr('fill','yellow')
                      setTimeout(function(){                
                      rect_cvr.attr('fill',rect_cvr.data('fill_original'))
                    }, 200);
                    }, 400);
              
                    setTimeout(function(){
                      clearInterval(myVar);
                    }, 1000);
                  }
              });

              // var myVar = setInterval(function(){
              //   rect_cvr.attr('fill','yellow')
              //   setTimeout(function(){                
              //   rect_cvr.attr('fill',rect_cvr.data('fill_original'))
              // }, 200);
              // }, 400);
        
              // setTimeout(function(){
              //   clearInterval(myVar);
              // }, 1000);
            })
            return;
        }

        viewing = 0;

        rect_cvr = $(this).children('rect[id^=cvr]')
        arg_id = rect_cvr.attr('id');
        arg_x = $(this).attr('x');
        core_id = arg_id.split('-')[1]
        group_id = arg_id.split('_')[0]
        if(spreaded==0){        
                preview_range=preview_range_base
        }else{
                preview_range=preview_range_base*spread_factor
        }
        // $("rect[id^="+group_id+"_"+"]").each(function(){
        var counter = 1
        var class_value = $(this).attr('class')
        $(this).parent().children('svg.'+class_value).each(function(){
        // $(this).parent().children('svg.svg_kw_hit').each(function(){
            var rect_cvr = $(this).children('rect[id^=cvr]')
            i_x = $(this).attr('x');

            //\\//
            var distance = i_x - arg_x
            var preview_this_one = false              
            if(counter <= sent_num_per_spread_span_no_less_than){
              if(distance >= 0){
                preview_this_one = true
              }
            }else{
              if(distance >= 0 && distance < preview_range){
                preview_this_one = true
              }
            }
            ////\\

            var previewed = rect_cvr.data('previewed')
            if(rect_cvr.data('previewed') == 1){
            // if(preview_this_one){

              counter += 1
              rect_cvr.data('previewed',0)
              rect_cvr = $(this).children('rect[id^=cvr]')
              rect_cvr.attr('fill',rect_cvr.data('fill_original'))
              rect_cvr.attr('opacity',rect_cvr.data('opacity_original'))
              rect_cvr.attr('width',rect_cvr.data('width_original'))
            }
        });
        view.remove();
}