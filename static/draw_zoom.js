



























function draw_zoom({unit, sents_list, not_use_set_interval_temp = false, 
  circle_class = '', dense_cutoff_disabled = false, 
  draw_resolved_ = null, polyline_only = false, kw_index_offset_cutoff = -3,
  ctrl_down = false, trigger = '', merge, source, draw_ng_s, draw_ng_g, polyline_unit_id,
  mutual_enriched_only} = {}){

  var font_size_ten = 15

  console.log(trigger)
  console.log(merge)
  console.log(!( trigger == 'summary' && merge == false))
  
  if(dense_cutoff_disabled == true){
        $.post('inside_draw_zoom')
      }
  // kw_sent_idx_dict = tfidf_list_2_kw_sent_idx_dict(tfidf_list)
  // unit = sorter(kw_sent_idx_dict)
  // console.log('kw_sent_idx_dict',kw_sent_idx_dict)
  var display_unit_id_log_list = []  
  var display_unit_kw_log_list = []
  var display_unit_unique_kw_log_list = []
  // var global_display_unit_counter=1
  var nested_n_gram_counter = 0
  var y_labels_list=[]

  var x_max = para.x_max     
  var sent_rect_interval_after_spread = 20
  var unit_height = 50
  var per_hit_rect_width = 35
  var right_shift = 200 + 50//2020-1-27（+50）
  var kw_display_unit_text_info_right_shift = 0// + 2020-1-27
  var main_kw_y_shift = 30
  // if(positive_as_kw||negative_as_kw||verb_as_kw ||no_summary){
  //   var y_interval = 90+20+20+20+20 - 100
  // }else{
  //   var y_interval = 90+20+20+20+20
  // }
  // var y_min = 1080
  // var y_max = (unit.length + 1)*y_interval+0
  console.log('Display unit num before filtering:',unit.length)
  // y_max = y_max > y_min? y_max : y_min
  
  var sent_rect_interval_before_spread = x_max/sent_info_list.length
  spread_factor = sent_rect_interval_after_spread/sent_rect_interval_before_spread
  preview_range_base = sent_rect_interval_before_spread * sent_num_per_spread_span
  // console.log('999sent_rect_interval_before_spread',sent_rect_interval_before_spread,'sent_num_per_spread_span',sent_num_per_spread_span,'preview_range_base',preview_range_base)
  var kw_sent_idx_dict = {};

  // var draw = SVG(div_id).size('100%', y_max).attr({id:'svg_main'})
  // draw.plain('TOTAL KW NUM: '+tfidf_list_length).attr({x:50,y:50}).size(5).fill(color)
  console.log('unit',unit)
  var j = 0;
  var j_max = unit.length

  function one_iteration(){
    if(j >= j_max - 1 && use_set_interval){
      clearInterval(my_set_interval)
      // svg_events_binder()
      // return display_unit_id_log_list
      if(draw_resolved_ != null){
        draw_resolved_( [display_unit_id_log_list,
          display_unit_kw_log_list,
          display_unit_unique_kw_log_list] )
      }
    }

    // console.log('unit.length',unit.length)
    // console.log('j',j)
    var end_ = new Date();
    var time_interval = end_.getTime()-start_.getTime()
    // console.log('time_interval',time_interval/1000)
    // $('#div_displayer').html( j+1 +' of '+unit.length+' display unit finished in '+time_interval/1000+'s')
    $('#draw_unit_progress').html( j+1 +' of '+unit.length+' display unit finished in '+time_interval/1000+'s')



    // if(unit[j]['mutual'] == undefined && mutual_enriched_only && source =='main'){
    if(unit[j]['mutual'] == undefined && mutual_enriched_only == true){
      // console.log(source)
      // console.log(trigger)
      console.log(`skip display of
      ${unit[j]['kw']} with source of ${source} and trigger of 
      ${trigger} for not mutual_enriched`,unit[j])
      console.count(`skip counter`)
      j = j+1
      return
    }




    var any_hit_list = []
    var round_idx

    if(typeof unit[j] == 'string'){
      var current_kw = unit[j]
    }else{
      var current_kw = unit[j]['kw']
      var round_idx = unit[j]['round']
      // var super = unit[j].super
    }

    if(unit[j] == 'cheat'){
        any_hit_list.push('cheating')
      }
    if(current_kw.match(/[()\.]+/i)){
      console.log('Invalid regular expression:',current_kw)
      current_kw = current_kw.replace(/\W+/gi,'INVALID')
    }

    local_sent_num = sents_list.length
    for (var i = 0; i< local_sent_num; i++){

      sent = sents_list[i]['sent_lemma']

      if(!current_kw.match(/ /i)){
        if(current_kw.match(/[\u4e00-\u9fa5]/)){
          var re = new RegExp(current_kw,'g')        
        }else{
          var re = new RegExp('\\b'+current_kw,'gi')          
        }
        if(sent.match(re)){
          any_hit_list.push(i)
        }
      }else if(current_kw.match(/ /i)){
        // console.log('current_kw',current_kw)
        var green_light = false
        var kws_list = current_kw.match(/[a-zA-Z]+/gi)
        // local_sent_num = sents_list.length
        // for (var i = 0; i< local_sent_num; i++){
          // sent = sents_list[i]['sent_lemma']

        var latest_kw_word_index = undefined
        var successive_match_failed = false
        for (var k = 0; k < kws_list.length; k++) {
          var kw = kws_list[k]
          // console.log('kw',kw)
          // alert(kw)
          var re = new RegExp('\\b'+kw,'i')
          var match = re.exec(sent)
          // console.log('match',match)
          if(match == null){
            successive_match_failed = true
            // console.log('before break 1')
            break
          }
          var index = match.index
          var substring_until_match_index = sent.substring(0,index)
          var substring_words_list = substring_until_match_index.match(/[a-zA-Z]+/gi)
          // console.log('kw',kw)
          // console.log('substring_until_match_index',substring_until_match_index)
          // console.log('substring_words_list',substring_words_list)
          var kw_word_index = substring_words_list == null? 0:substring_words_list.length
          if(latest_kw_word_index == undefined){
            latest_kw_word_index = kw_word_index
          }else{
            var word_index_diff = latest_kw_word_index - kw_word_index
            if(word_index_diff < 0 && word_index_diff >= kw_index_offset_cutoff){
              latest_kw_word_index = kw_word_index
            }else{
              successive_match_failed = true
              // console.log('before break 2')
              break
            }
          }
        }

        if(!successive_match_failed == true){
          green_light = true
          // any_hit_list.push(i)
        }
        if(green_light){
          any_hit_list.push('something')
        }
      }
    }

    var equal_n_gram_list = unit[j].equal
    if(any_hit_list.length == 0){
      console.log('skipping any_hit_list.length == 0',current_kw)
      j = j+1
      // console.log('j+1',j)
      return
    }
    if(unit[j].super != undefined && unit[j].query_type == 'n_gram'){
      nested_n_gram_counter += 1
      // console.log('nested n_gram',nested_n_gram_counter,unit[j]['kw'],unit[j].super)
      j = j+1
      // console.log('j+1',j)
      return
    }
    if(hide_almost_supered){
      if(unit[j].nester != undefined){
        unit[j].nester = unit[j].nester.sort((a,b)=>a[1]-b[1])
        if(unit[j].nester[0][1]<=1.2){
          j = j+1
          return
        }
      }      
    }
    if(unit[j].n != undefined && unit[j].n > max_n_of_n_gram_displayed && unit[j].query_type == 'n_gram'){
      j = j+1
      // console.log('j+1',j)
      return
    }
    if(max_display_unit_draw_num > 0 || 
      n_gram_display_min_dense_hit_num_cutoff_value != undefined){
      // alert(customized_min_dense_discard_cutoff)
      // alert(n_gram_display_min_dense_hit_num_cutoff_value+'n_gram_display_min_dense_hit_num_cutoff_value')
      if(unit[j]['dense_hits'].length < n_gram_display_min_dense_hit_num_cutoff_value && dense_cutoff_disabled == false){
        // console.log('unit[j].kw',unit[j].kw)
        // console.log('unit[j]['dense_hits'].length',unit[j]['dense_hits'].length)
        console.log('n_gram_display_min_dense_hit_num_cutoff_value',n_gram_display_min_dense_hit_num_cutoff_value)
        j = j+1
        // console.log('j+1',j)
        return
      }
    }
    // console.log('n_gram_display_min_dense_hit_num_cutoff_value != undefined',n_gram_display_min_dense_hit_num_cutoff_value != undefined)
    
    if(hide_super_and_equal){
      if(unit[j].equal != undefined && unit[j].query_type == 'kw'){
        j = j+1
      // console.log('j+1',j)
      return
      }

      if(unit[j].super != undefined && unit[j].query_type == 'kw'){
        j = j+1
      // console.log('j+1',j)
      return
      }
      
      if(unit[j].equal != undefined && unit[j].query_type == 'kw_pair'){
        j = j+1
      // console.log('j+1',j)
      return
      }

      if(unit[j].super != undefined && unit[j].query_type == 'kw_pair'){
        j = j+1
      // console.log('j+1',j)
      return
      }
    }
    // console.log('current_kw',current_kw)
    var all_hit_sents = []
    var all_hit_sents_idx = []
    // var all_hit_unlemma_sents = []
    var per_unit_page_num_memory_list = []

    var draw_polyline = false
    // var polyline_only = false//true
    // var polyline_only = true

      if(draw_polyline || polyline_only){  

    local_sent_num = sents_list.length
    var points_for_polyline_list = []
    var dense_points_for_polyline_list = []

    for (var h = 0; h< local_sent_num; h++){

      global_sent_idx = sents_list[h].global_sent_idx

      // all_sents_except_dense_block.push(sent)
      x_pos=Math.round((h/local_sent_num)*x_max)+per_hit_rect_width/2
      if(unit[j].hits.includes(global_sent_idx)){
        points_for_polyline_list = points_for_polyline_list.concat([[x_pos,52],[x_pos,-2],[x_pos,52]])
      }

      if(unit[j]['dense_hits'].includes(global_sent_idx)){
        dense_points_for_polyline_list = dense_points_for_polyline_list.concat([[x_pos,-2],[x_pos,52],[x_pos,-2]])
      }

      if(unit[j]['dense_hits'][0] == global_sent_idx){
        var x_pos_dense_start = x_pos
      }
    }

    // for (var h of unit[j].hits){
    //   var x_pos=Math.round((h/local_sent_num)*x_max)+per_hit_rect_width/2
    //   points_for_polyline_list = points_for_polyline_list.concat([[x_pos,52],[x_pos,-2],[x_pos,52]])
    // }
    // // console.log(unit[j]['dense_hits'])
    // for (var h of unit[j]['dense_hits']){
    //   var x_pos=Math.round((h/local_sent_num)*x_max)+per_hit_rect_width/2
    //   dense_points_for_polyline_list = dense_points_for_polyline_list.concat([[x_pos,-2],[x_pos,52],[x_pos,-2]])
    // }
    // var x_pos_dense_start =Math.round((unit[j]['dense_hits'][0]/local_sent_num)*x_max)+per_hit_rect_width/2
    
    // console.log('points_for_polyline_list',points_for_polyline_list)
    // console.log('dense_points_for_polyline_list',dense_points_for_polyline_list)
    var kw_div_id_ = current_kw.split(' ').join('_')+'_'+global_display_unit_counter+'__'+j+'__'+unit[j]['dense_hits'].length
    var kw_div_class_polyline = current_kw.split(' ').join('_')//+'_for_ployline'
    diving(kw_div_id_,parent = 'body',class_ = kw_div_class_polyline, background = 'rgba(246,246,246,1)',position = 'relative',z_index = 1,display='block')
    $('#'+kw_div_id_).addClass('kw_display_unit').data('dense_hits_num',unit[j]['dense_hits'].length)
    $('#'+kw_div_id_).data('kw_id',kw_div_id_)
    $('#'+kw_div_id_).data('dense_start',unit[j].dense_hits[0])
    data.diagonal_kw_sum_polylined[kw_div_id_] = unit[j]//2020-1-22
    display_unit_id_log_list.push(kw_div_id_)

    
    // $('#'+kw_div_id_).addClass('polyline_kw_display_unit')
    // unit_height = 45
    var polyline_svg_parent = SVG( kw_div_id_ ).size('100%', 50+2).attr({
      id:current_kw.split(' ').join('_'),
      class:'polyline_svg_parent svg_parent',
    })
    var kw_left_to_display_unit = polyline_svg_parent.plain().attr({x:kw_display_unit_text_info_right_shift + 50,y:30,class:'kw kw_left_to_display_unit'}).size(28)//.fill(color)    
    polyline_svg_kw = polyline_svg_parent.nested().attr({
      // id:current_kw.split(' ').join('_')+'_'+j,
      id:kw_div_id_ + '_polyline_svg_kw',
      class:'polyline_svg_kw',
      x:right_shift,
      y:0,
      width:x_max + per_hit_rect_width,
      height:unit_height,
      style:'overflow:hidden'
    }).data({source:source})
    polyline_svg_kw.rect('100%','100%').attr({
      x:'0',
      y:'0',
      opacity:1,
      fill:'rgb(240,240,240)',
      // stroke:'black',
      // 'stroke-width':1,
      id:'bg1'
    })
    var polyline = polyline_svg_kw.polyline(points_for_polyline_list).fill('none').stroke({ color:'black',width: 1,opacity:1})
    // if(unit[j]['dense_hits'].fake == false){
    if(unit[j].no_merge == false){
      var dense_polyline = polyline_svg_kw.polyline(dense_points_for_polyline_list).fill('none').stroke({ color:'red',width: 1 })
    }
    var polyline_at_buttom = polyline_svg_kw.polyline([[0,unit_height],[x_max + per_hit_rect_width,unit_height]])
    .fill('none').stroke({ width: 1 ,opacity:0.25})
    
    if(current_kw.match(/[\u4e00-\u9fa5]/) == null){
      var kw_expand_freq_dict = {}
      for (var h of unit[j].hits){
        var kws_list = current_kw.match(/[a-zA-Z]+/gi)
        var re = new RegExp(kws_list.join('\\w*\\W+\\w*\\W*'),'i')

        try{
          var sent_original = sents_list[h]['sent']
        }catch(err){
          var sent_original = sent_info_dict[h]['sent']
        }
        
        if(sent_original.match(re)!=null){
          var current_kw_expanded = sent_original.match(re)[0]
          kw_expand_freq_dict[current_kw_expanded] = kw_expand_freq_dict[current_kw_expanded]? kw_expand_freq_dict[current_kw_expanded] + 1 : 1
          // console.log('current_kw_expanded',current_kw_expanded)
        }else{
          var current_kw_expanded = current_kw          
          kw_expand_freq_dict[current_kw_expanded] = kw_expand_freq_dict[current_kw_expanded]? kw_expand_freq_dict[current_kw_expanded] + 1 : 1
        }
      }
      var kw_expanded = Object
      .keys(kw_expand_freq_dict).map(k=>[k,kw_expand_freq_dict[k]])
      .sort((a,b)=>b[1]-a[1])[0][0]

    }else{ var kw_expanded = current_kw}

    kw_left_to_display_unit.plain(kw_expanded)//.fill(color)    

    // var kw_over_dense_hits_region = polyline_svg_kw.plain(kw_expanded).attr({//will be covered 
    //         x:x_pos_dense_start,
    //         y:'45%'}).size(25)

    var kw_over_dense_hits_region = polyline_svg_kw.text(function(t){
      // t.tspan(kw_expanded).attr({'font-size':25})//.size(25); 
      t.tspan(kw_expanded).attr({'font-size':35})//.size(25); 
      if(unit[j].dense_hits.max_gap != undefined && false){
        t.tspan('|').dx(5); 
        t.tspan(unit[j].dense_hits.max_gap).attr({'font-size':5}).dx(5)
        t.tspan('|').dx(5); 
        t.tspan(unit[j].dense_hits.std).attr({'font-size':5}).dx(5)
      }      
    }).attr({x:x_pos_dense_start,y:'65%'})//.size(25)

    // polyline_svg_kw.rect( kw_over_dense_hits_region.length()+20+5, '50%').attr({

    polyline_svg_kw.circle( 20 * unit[j]['normalized_mutual_unique_num'] ).attr({
      cx:x_pos_dense_start - 15,
      cy:22,fill:'rgba(139,139,139, 1)',class:'circle_over_dense_hits_region_background'})

    polyline_svg_kw.rect( kw_over_dense_hits_region.length()+5, '70%').attr({
      x:x_pos_dense_start,
      y:0,fill:'rgb(229,229,229)',class:'kw_over_dense_hits_region_background'})//as background for text、below
    
    // polyline_svg_kw.plain(kw_expanded).attr({
    //         x:x_pos_dense_start,
    //         y:'45%',class:'kw_over_dense_hits_region'}).size(25)

    polyline_svg_kw.text(function(t){
      // t.tspan(kw_expanded).attr({'font-size':25})//.size(25); 
      t.tspan(kw_expanded).attr({'font-size':35})//.size(25); 
      if(unit[j].dense_hits.max_gap != undefined && false){
        t.tspan(' | ').dx(5); 
        t.tspan(unit[j].dense_hits.max_gap).attr({'font-size':5}).dx(5); 
        t.tspan(' | ').dx(5); 
        t.tspan(unit[j].dense_hits.std).attr({'font-size':5}).dx(5)
      }
    }).attr({x:x_pos_dense_start,y:'65%',class:'kw_over_dense_hits_region_text'})//.size(25)

    //mutual enriched terms
    var mutual_enriched_terms_list = []
    for(var enrichment_type in unit[j].summary){
      for(var enriched_word in unit[j].summary[enrichment_type]){
        if(unit[j]['summary'][enrichment_type][enriched_word]['mutual']){
          if(!mutual_enriched_terms_list.includes( enriched_word )){
            mutual_enriched_terms_list.push(enriched_word)
          }            
        }
      }
    }
    var mutual_enriched_terms_second_round_list = []
    // mutual_enriched_terms_string = mutual_enriched_terms_list.join(' | ')
    //to calc width needed for the text
    var tspan_rect_x_start = x_pos_dense_start + kw_over_dense_hits_region.length() + 5 + 10
    var mutual_enriched_terms_svg_text = polyline_svg_kw.text(function(t){
      for(var enriched_word of mutual_enriched_terms_list){
        var mutual_term_tspan = t.tspan( enriched_word ).attr({'font-size':15}).dx(10)
        if( tspan_rect_x_start + mutual_term_tspan.length() > x_max ){//not enough space for this term any more
          // cl( [ kw_expanded, enriched_word ] )
          // cl( [ tspan_rect_x_start, mutual_term_tspan.length(), tspan_rect_x_start + mutual_term_tspan.length() > 1400] )
          mutual_enriched_terms_second_round_list.push(enriched_word)
        }
        const goldenRatio = 0.618 // ... truncated
        var color = rcolor({
                      saturation: 0.075,
                      value: 0.95
                    })
        polyline_svg_kw.rect( mutual_term_tspan.length(), '40%').attr({
          x:tspan_rect_x_start,
          y:0,fill:color,class:'mutual_enriched_terms_over_dense_hits_region_background'})
        tspan_rect_x_start += mutual_term_tspan.length() + 10
      }
    }).attr({x:x_pos_dense_start + kw_over_dense_hits_region.length() + 5,y:'30%',class:'mutual_enriched_terms_over_dense_hits_region_text'})//.size(30)
    
    var mutual_enriched_terms_svg_text = polyline_svg_kw.text(function(t){
      for(var enriched_word of mutual_enriched_terms_list){
        var mutual_term_tspan = t.tspan( enriched_word ).attr({'font-size':15}).dx(10)
      }
    }).attr({x:x_pos_dense_start + kw_over_dense_hits_region.length() + 5,y:'30%',class:'mutual_enriched_terms_over_dense_hits_region_text'})//.size(30)

    
    if(mutual_enriched_terms_second_round_list){

      // var tspan_rect_x_start = x_pos_dense_start + kw_over_dense_hits_region.length() + 5 + 10
      var tspan_rect_x_start = 0 + 0 + 5 + 10
      var mutual_enriched_terms_svg_text = polyline_svg_kw.text(function(t){
        for(var enriched_word of mutual_enriched_terms_second_round_list){
          var mutual_term_tspan = t.tspan( enriched_word ).attr({'font-size':15}).dx(10)
          if( tspan_rect_x_start + mutual_term_tspan.length() > x_pos_dense_start ){//gonna cover main kw 
            mutual_term_tspan.clear()
            break
          }
          const goldenRatio = 0.618 // ... truncated
          var color = rcolor({
                        saturation: 0.075,
                        value: 0.95
                      })
          polyline_svg_kw.rect( mutual_term_tspan.length(), '40%').attr({
            x:tspan_rect_x_start,
            y:0,fill:color,class:'mutual_enriched_terms_over_dense_hits_region_background'})
          tspan_rect_x_start += mutual_term_tspan.length() + 10
        }
      }).attr({x:0 + 0 + 5,y:'30%',class:'mutual_enriched_terms_over_dense_hits_region_text'})//.size(30)
      
      var tspan_rect_x_start = 0 + 0 + 5 + 10
      var mutual_enriched_terms_svg_text = polyline_svg_kw.text(function(t){
        for(var enriched_word of mutual_enriched_terms_second_round_list){
          var mutual_term_tspan = t.tspan( enriched_word ).attr({'font-size':15}).dx(10)
          if( tspan_rect_x_start + mutual_term_tspan.length() > x_pos_dense_start ){//gonna cover main kw 
            mutual_term_tspan.clear()
            break
          }
          tspan_rect_x_start += mutual_term_tspan.length() + 10
        }
      }).attr({x:0 + 0 + 5,y:'30%',class:'mutual_enriched_terms_over_dense_hits_region_text'})//.size(30)

    }
    // //rect as background for text above
    // polyline_svg_kw.rect( mutual_enriched_terms_svg_text.length()+5, '50%').attr({
    //   x:x_pos_dense_start + kw_over_dense_hits_region.length() + 5,
    //   y:0,fill:'rgb(229,229,229)',class:'mutual_enriched_terms_over_dense_hits_region_background'})//as background for text、below
    // //final text
    // polyline_svg_kw.text(function(t){
    //   for(var enriched_word of mutual_enriched_terms_list){
    //     const goldenRatio = 0.618 // ... truncated
    //     var color = rcolor({
    //                   saturation: 0.25,
    //                   value: 0.95
    //                 })
    //     t.tspan( enriched_word ).attr({'font-size':15}).dx(10).fill(color)
    //   }
    // }).attr({x:x_pos_dense_start + kw_over_dense_hits_region.length() + 5,y:'50%',class:'mutual_enriched_terms_over_dense_hits_region_text'})


    if(show_overlap_info){
      // polyline_svg_parent.plain('D/H:').attr({x:50,y:45,id:kw_div_id+'_after_kw_div_id',class:''}).size(5)//.fill(color)     
      polyline_svg_parent.plain(['NESTER',unit[j].nester,unit[j].hits.length,unit[j].query_type,current_kw,'EQUAL',unit[j].equal,'SUPER',unit[j].super])
      .attr({'font-size':para.font_size_ten,x:kw_display_unit_text_info_right_shift + 50+120,y:45})//.size(5)//.fill(color) 
    }else{
      // polyline_svg_parent.plain('D/H:').attr({x:50,y:45,id:kw_div_id+'_after_kw_div_id',class:''}).size(5)//.fill(color)
      polyline_svg_parent.text(function(t){
        t.tspan(unit[j]['dense_hits'].length)
        t.tspan('/').dx(5)
        t.tspan(unit[j].hits.length).dx(5)
      }).attr({'font-size':para.font_size_ten,x:kw_display_unit_text_info_right_shift + 50+120,y:45})//.size(5)//.fill(color)
    }

    if(unit[j]['mutual'] != undefined){
      var global_display_unit_counter_color = '#ff461f'
    }else{
      var global_display_unit_counter_color = 'black'      
    }
    polyline_svg_parent.plain(global_display_unit_counter).attr({'font-size':para.font_size_ten,x:kw_display_unit_text_info_right_shift + 23,y:27,stroke:10}).fill(global_display_unit_counter_color)//.size(7)
    polyline_svg_parent.circle(10).attr({cx:kw_display_unit_text_info_right_shift + 15,cy:22,class:circle_class}).fill('rgba(246,246,246,1)')//var circle = 
    
   
    if( (max_display_unit_display_num > 0 || customized_min_dense_show_cutoff.length > 0)&&
      dense_cutoff_disabled == false ){
      if(unit[j]['dense_hits'].length < n_gram_display_min_dense_hit_num_cutoff_value ||
        unit[j]['dense_hits'].length < customized_min_dense_show_cutoff){
        $('#'+kw_div_id_).addClass('hidden_kw_div')//width of tspan couldn't be precalculated in non-displayed div        
      }else{
        display_unit_kw_log_list.push(current_kw)
        if(!display_unit_unique_kw_log_list.includes(current_kw)){
              display_unit_unique_kw_log_list.push(current_kw)
            }
        // $('p#unique_display_unit_num_tmp').html('unique_kw_num_tmp: '+display_unit_unique_kw_log_list.length)
        // $('p#display_unit_num_tmp').html('display_unit_num_tmp: '+display_unit_kw_log_list.length)
        $('#unique_display_unit_num_tmp').html('unique_kw_num_tmp: '+display_unit_unique_kw_log_list.length)
        $('#display_unit_num_tmp').html('display_unit_num_tmp: '+display_unit_kw_log_list.length)
      }
    }  


    if(polyline_only){
      global_display_unit_counter+=1;
      // svg_events_binder('div#'+kw_div_id_)
      svg_events_binder({bind_by:'div#'+kw_div_id_, for_titles:false, for_polyline:polyline_only})      
      // console.log(unit[j])
      // console.log(kw_div_id_)
      // console.log(unit[j]['mutual'])
      // console.log(options.mutual_enriched_only)
      // console.log(source =='main')
      // console.log(unit[j]['mutual'] == undefined && options.mutual_enriched_only && source =='main')
      // console.log(unit[j]['mutual_unique'])
      data.worker_working_order_log.push('polyline_only one_iteration'+ kw_div_id_)// + ' - mutual_unique_then:' + unit[j]['mutual_unique'].length)      
      j = j+1
      return
    }   

      }
    // y_pos = global_display_unit_counter * y_interval

    // dwg.add(dwg.text(kw_original,(50,y_pos+33),font_size='1.5em'))
    var kw_div_id = current_kw.split(' ').join('_')+'_'+global_display_unit_counter+'__'+unit[j]['dense_hits'].length
    // data[kw_div_id] = {}
    // data[kw_div_id].current_kw = current_kw
    // data[kw_div_id].summary_terms_tested_unique_log =[]
    // data[kw_div_id].summary_terms_confirmed_unique_log =[]
    var kw_div_class = current_kw.split(' ').join('_')   
    diving(kw_div_id,parent = 'body',class_ = kw_div_class, background = 'rgba(246,246,246,1)',position = 'relative',z_index = 1,display='block')
    
    $('#'+kw_div_id).addClass('kw_display_unit').data({dense_hits_num:unit[j]['dense_hits'].length,
      summary_color_coding_type:'ngl'})

    if(source == 'polyline'){
      $('#'+kw_div_id).data('source_polyline_unit_id',polyline_unit_id)
    }//2020-1-28

    display_unit_id_log_list.push(kw_div_id)
    // console.log('display_unit_id_log_list',display_unit_id_log_list)

    if( (max_display_unit_display_num > 0 || customized_min_dense_show_cutoff.length > 0)&&
      dense_cutoff_disabled == false ){
      if(unit[j]['dense_hits'].length < n_gram_display_min_dense_hit_num_cutoff_value ||
        unit[j]['dense_hits'].length < customized_min_dense_show_cutoff){
        $('#'+kw_div_id).addClass('hidden_kw_div')
      }else{
      display_unit_kw_log_list.push(current_kw)
      if(!display_unit_unique_kw_log_list.includes(current_kw)){
            display_unit_unique_kw_log_list.push(current_kw)
          }
      $('p#unique_display_unit_num_tmp').html('unique_kw_num_tmp: '+display_unit_unique_kw_log_list.length)
      $('p#display_unit_num_tmp').html('display_unit_num_tmp: '+display_unit_kw_log_list.length)
      }
    }
    
    // if(show_overlap_info){
    //   var for_show_overlap_info = 25
    // }else{
    //   var for_show_overlap_info = 0
    // }
    // var svg_parent = SVG( kw_div_id ).size('100%', 45+for_show_overlap_info).attr({
    var svg_parent = SVG( kw_div_id ).size('100%', 50+2).attr({
      id:current_kw.split(' ').join('_'),
      class:'svg_parent',
      // x:0,
      // y:y_pos,
      // height:70
    })
    var kw_left_to_display_unit = svg_parent.plain().attr({x:50,y:30,class:'kw'}).size(28)//.fill(color)
    svg_kw = svg_parent.nested().attr({
      // id:j,
      id:kw_div_id + '_svg_kw',
      class:'svg_kw',
      x:right_shift,
      y:0,
      width:x_max + per_hit_rect_width,
      height:unit_height,
      style:'overflow:hidden'
    })
    // svg_kw =dwg.add(dwg.svg(x=right_shift,y=y_pos,size=(x_max,unit_height)))
            
    // 每个关键词一个group
    // g = svg_kw.group()
    // 每个关键词一个backg
    svg_kw.rect('100%','100%').attr({
      x:'0',
      y:'0',
      opacity:1,
      fill:'rgb(240,240,240)',
      id:'bg1'
    })

    var dense_block_sents_list = []
    var dense_block_sents_idx_list = []
    var dense_block_sents_neighbor_idx_list = []
    // var dense_block_sents_unlemma_list = []
    var current_kw_expanded_list = []
    local_sent_num = sents_list.length
    for (var i = 0; i< local_sent_num; i++){

      sent = sents_list[i]['sent_lemma']
      sent_unlemma = sents_list[i]['sent_chinese_compact']
      sent_original = sents_list[i]['sent']
      sent_page_no = sents_list[i].page_num
      global_sent_idx = sents_list[i].global_sent_idx

      // all_sents_except_dense_block.push(sent)
      x_pos=Math.round((i/local_sent_num)*x_max)

      
      // if(typeof unit[j] == 'string'){
      //   var current_kw = unit[j]
      // }else{
      //   var current_kw = unit[j]['kw']
      // }

      var green_light = false
      
      if(typeof unit[j] == 'object'){
        if(unit[j]['dense_hits'].includes(sents_list[i]['global_sent_idx'])/*dense region*/){
          green_light = true
        }
      }

      if(current_kw.match(/ /i)){
        var kws_list = current_kw.match(/[a-zA-Z]+/gi)
        // local_sent_num = sents_list.length
        // for (var i = 0; i< local_sent_num; i++){
          // sent = sents_list[i]['sent_lemma']

        var latest_kw_word_index = undefined
        var successive_match_failed = false
        for (var k = 0; k < kws_list.length; k++) {
          var kw = kws_list[k]
          // alert(kw)
          var re = new RegExp('\\b'+kw,'i')
          var match = re.exec(sent)
          if(match == null){
            successive_match_failed = true
            break
          }
          var index = match.index
          var substring_until_match_index = sent.substring(0,index)
          var substring_words_list = substring_until_match_index.match(/[a-zA-Z]+/gi)
          // console.log('kw',kw)
          // console.log('substring_until_match_index',substring_until_match_index)
          // console.log('substring_words_list',substring_words_list)
          var kw_word_index = substring_words_list == null? 0:substring_words_list.length
          if(latest_kw_word_index == undefined){
            // console.log('kw_word_index',kw_word_index)
            latest_kw_word_index = kw_word_index
          }else{
            // console.log('kw_word_index',kw_word_index)
            var word_index_diff = latest_kw_word_index - kw_word_index
            // console.log('word_index_diff',word_index_diff)
            if(word_index_diff < 0 && word_index_diff >= kw_index_offset_cutoff){
              latest_kw_word_index = kw_word_index
            }else{
              successive_match_failed = true
              break
            }
          }
        }

        if(!successive_match_failed == true){
          green_light = true
          // any_hit_list.push(i)
        }
        // } 
      }

      if(current_kw.match(/[\u4e00-\u9fa5]/)){
        var re = new RegExp(current_kw,'g') 
      }else{
        var re = new RegExp('\\b'+current_kw,'gi')        
      }

      if(sent.match(re)||current_kw == 'cheat'||green_light){

        var kws_list = current_kw.match(/[a-zA-Z]+|[\u4e00-\u9fa5]+/gi)
        // var re = new RegExp(kws_list.join('\\w*[ -/]\\w* *'),'i')
        var re = new RegExp(kws_list.join('\\w*\\W+\\w*\\W*'),'i')
        // console.log('re',re)
        // console.log('sent_original',sent_original)
        // console.log('sent_original.match(re)',sent_original.match(re))
        // console.log('!sent_original.match(re)==null',!sent_original.match(re)==null)
        if(sent_original.match(re)!=null){
          current_kw_expanded = sent_original.match(re)[0]
          current_kw_expanded_list.push(current_kw_expanded)
          // console.log('current_kw_expanded',current_kw_expanded)
        }else{
          // current_kw_expanded = null
          current_kw_expanded = current_kw          
          current_kw_expanded_list.push(current_kw_expanded)
        }
        

        // hit_sents_except_dense_block.push(sent)
        all_hit_sents.push(sents_list[i])
        all_hit_sents_idx.push(sents_list[i].global_sent_idx)
        // all_hit_sents.push(sent)
        // all_hit_unlemma_sents.push(sent_unlemma)
        if(!kw_sent_idx_dict.hasOwnProperty(current_kw)){
          kw_sent_idx_dict[current_kw] = [i];
        }else{
          kw_sent_idx_dict[current_kw].push(i)
        }
        
        if(typeof unit[j] == 'string'){
          color = 'black'
        }else{
          if(unit[j]['dense_hits'].includes(sents_list[i]['global_sent_idx'])/*dense region*/){
          // if(unit[j]['dense_hits'].slice(0,1).includes(sents_list[i]['global_sent_idx'])/*dense region*/){          
            // if(unit[j]['dense_hits'].fake == false){
            if(unit[j].no_merge == false){  
              color='red'
            }else{
              color='black'
            }
            // console.log(current_kw,'should be',color)
            dense_block_sents_list.push(sents_list[i])
            dense_block_sents_idx_list.push(sents_list[i]['global_sent_idx'])

            let global_sent_idx = sents_list[i]['global_sent_idx']
            let nearby_sent_range = +options.also_search_nearby_sent_within_range
            // for(var start_idx = global_sent_idx - nearby_sent_range, end_idx = )
            console.log(_.range(global_sent_idx - nearby_sent_range, global_sent_idx + 1 + nearby_sent_range))
            dense_block_sents_neighbor_idx_list = dense_block_sents_neighbor_idx_list.concat(_.range(global_sent_idx - nearby_sent_range, global_sent_idx + 1 + nearby_sent_range))
            console.log(dense_block_sents_neighbor_idx_list)

            // dense_block_sents_list.push(sent)
            // dense_block_sents_unlemma_list.push(sent_unlemma)
            // all_sents_except_dense_block.pop(sent)
            // hit_sents_except_dense_block.pop(sent)
          }else{
            // continue
            if(one_sent_per_page_for_non_dense_sent){
              var dense_start_idx = unit[j]['dense_hits'][0]
              var dense_end_idx = unit[j]['dense_hits'].slice(-1)[0]             

              if(!per_unit_page_num_memory_list.includes(sents_list[i]['page_num'])){
                per_unit_page_num_memory_list.push(sents_list[i]['page_num'])   
              }else if(per_unit_page_num_memory_list.includes(sents_list[i]['page_num']) &&
                Math.abs(global_sent_idx - dense_start_idx) > 50 &&
                Math.abs(global_sent_idx - dense_end_idx) > 50){
                continue
              }
            }            
                     
            color='black'
            // continue
          }//2019-4-28 15:38:14
        }
        

        svg_kw_hit = svg_kw.nested().attr({
        id:sents_list[i]['global_sent_idx'],
        class:'svg_kw_hit',
        x:x_pos,
        y:0,
        width:per_hit_rect_width,
        height:unit_height,
        style:'overflow:hidden'
        })

        svg_kw_hit.rect('100%','100%').attr({
        x:0,
        y:0,
        opacity:0.05,
        fill:'black',
        id:'trigger-'+ current_kw +'__'+sents_list[i]['global_sent_idx']
        })

        svg_kw_hit.rect('2%','100%').attr({
        x:'45%',
        y:0,
        opacity:1,
        fill:color,
        id:'cvr-'+ current_kw +'__'+sents_list[i]['global_sent_idx']
        })

        if( unit[j]['dense_hits'][0] == sents_list[i]['global_sent_idx'] ){
          svg_kw_hit.plain(sents_list[i]['global_sent_idx']).attr({
            x:'10%',
            y:'80%',
            'font-size':4
          })
          var kw_expanded_over_dense_hits_region = svg_kw.plain().attr({//will be covered 
            x:x_pos,
            y:'45%'          })
          var kw_expanded_over_dense_hits_region_x_pos = x_pos
        }
        if(unit[j]['dense_hits'].length >1 && unit[j]['dense_hits'].slice(-1)[0] == sents_list[i]['global_sent_idx'] ){
          svg_kw_hit.plain(sents_list[i]['global_sent_idx']).attr({
            x:'10%',
            y:'55%',
            'font-size':4
          })
        }
        // console.log('kw_hits_dict',kw_hits_dict)
        kw_hits_dict[current_kw+'__'+global_sent_idx] = {'sent_idx':global_sent_idx,
                                             'quering_keyword':current_kw,
                                             'quering_keyword_expanded':current_kw_expanded,
                                             'page':sent_page_no,
                                             'global_diagonal_idx':j
                                           }
      }
      // console.log('sents_rich_list from cw.js',sents_rich_list)
      
    }

    

    //keyword
    var color = 'black'
    if(round_idx != undefined){
      if(round_idx == 1){
        color = 'black'
      }else if(round_idx == 2){
        color = 'rgb(108,108,108)'
      }else if(round_idx == 'n_gram_round'){
        // color = 'rgb(100,161,235)'
        color = 'rgb(255,147,38)'
      }
    }

    if(unit[j].equal != undefined && unit[j].query_type == 'kw'){
      color = 'green'
    }
    if(unit[j].super != undefined && unit[j].query_type == 'kw'){
      color = 'cyan'
    }    
    if(unit[j].equal != undefined && unit[j].query_type == 'kw_pair'){
      color = 'blue'
    }
    if(unit[j].super != undefined && unit[j].query_type == 'kw_pair'){
      color = 'purple'
    }

    // console.log('kw_pair cluster',current_kw,unit[j]['dense_hits'])
    //dense_region_sent_idx [unit[j].hits.length
    
    if(!hide_almost_supered){
      // svg_parent.plain([unit[j]['dense_hits'],unit[j].query_type,current_kw,'EQUAL',unit[j].equal,'SUPER',unit[j].super]).attr({x:50,y:65}).size(5).fill(color)      
      if(unit[j].nester != undefined){
        unit[j].nester = unit[j].nester.sort((a,b)=>a[1]-b[1])
        if(unit[j].nester[0][1]<=1.1){
          color = 'violet'
        }else if(unit[j].nester[0][1]<=1.2){
          color = 'slateblue'
        }
      }      
      // svg_parent.plain([unit[j].hits.length,unit[j].query_type,current_kw,'EQUAL',unit[j].equal,'SUPER',unit[j].super,'NESTER',unit[j].nester]).attr({x:50,y:65}).size(5).fill(color)      
    }

    if(show_overlap_info){
      svg_parent.plain('summary_display')
      .attr({'font-size':para.font_size_ten,x:50,y:45,id:kw_div_id+'_after_kw_div_id',class:'for_show_summary'}).fill(color)//.size(5) 
      svg_parent.plain(['NESTER',unit[j].nester,unit[j].hits.length,unit[j].query_type,current_kw,'EQUAL',unit[j].equal,'SUPER',unit[j].super])
      .attr({'font-size':para.font_size_ten,x:50+120,y:45}).fill(color) //.size(5)
    }else{
      svg_parent.plain('summary_display').attr({'font-size':para.font_size_ten,x:50,y:45,id:kw_div_id+'_after_kw_div_id',class:'for_show_summary'}).fill(color)//.size(5)
      svg_parent.text(function(t){
        t.tspan(unit[j]['dense_hits'].length)
        t.tspan('/').dx(5)
        t.tspan(unit[j].hits.length).dx(5)
      }).attr({'font-size':para.font_size_ten,x:50+120,y:45}).fill(color)//.size(5)
    }

    kw_expand_freq_dict = {}
    for (var e = 0; e < current_kw_expanded_list.length; e++) {
      var kw_ex = current_kw_expanded_list[e]
      kw_expand_freq_dict[kw_ex] = kw_expand_freq_dict[kw_ex]? kw_expand_freq_dict[kw_ex] + 1 : 1
    }
    var kw_expand_freq_list = Object.keys(kw_expand_freq_dict).map(k=>[k,kw_expand_freq_dict[k]])
    kw_expand_freq_list.sort((a,b)=>b[1]-a[1])
    var kw_expand_freq_list_plain = kw_expand_freq_list.map(a=>a[0])
    kw_left_to_display_unit.plain(kw_expand_freq_list_plain[0]).fill(color)    
    // text.attr({x:50,y:30,class:'kw'}).size(28).fill(color)
    kw_expanded_over_dense_hits_region.plain(kw_expand_freq_list_plain[0]).size(25)
    svg_kw.rect( kw_expanded_over_dense_hits_region.length(), '50%').attr({
      x:kw_expanded_over_dense_hits_region_x_pos,
      y:0,fill:'rgb(229,229,229)',class:'kw_over_dense_hits_region_background'})//as background for text、below
    svg_kw.plain(kw_expand_freq_list_plain[0]).attr({
            x:kw_expanded_over_dense_hits_region_x_pos,
            y:'45%',class:'kw_over_dense_hits_region_text'}).size(25)

    // if(tfidf_dict!=undefined){
    //   svg_parent.plain(tfidf_dict[current_kw]).attr({x:50,y:45}).size(5).fill(color)
    // }

    var text = svg_parent.plain(global_display_unit_counter)
    text.attr({x:23,y:27,'font-size':para.font_size_ten})//.size(7)
    var circle = svg_parent.circle(10).attr({cx:15,cy:22,class:circle_class}).fill('rgba(246,246,246,1)')
    // var circle_destory = svg_parent.circle(10).attr({cx:right_shift+x_max+per_hit_rect_width+10,cy:22}).fill('rgb(146,246,246)')


    // diving(kw_div_id+'_for_summary',parent = '#'+kw_div_id,class_ = 'hidding_summary', background = 'rgba(246,246,246,1)',position = 'relative',z_index = 1,display='block',width='100%')
    // diving(kw_div_id+'_left',parent = '#'+kw_div_id+'_for_summary',class_ = '', background = 'rgba(246,246,246,1)',position = 'relative',z_index = 1,display='inline-block',width='50%')
    // diving(kw_div_id+'_right',parent = '#'+kw_div_id+'_for_summary',class_ = 'summary_right_div', background = 'rgba(246,246,246,1)',position = 'relative',z_index = 1,display='inline-block',width='50%')
   
    var summary_div_instance = $('#summary_template_div').removeClass('hidden').clone()
    $('#'+kw_div_id).append(summary_div_instance)

    var mutual_enrichment_div_instance = $('#enrichment_div_template')
    .removeClass('hidden').clone().attr('id','enrichment_div_instance')
    $('#'+kw_div_id).append(mutual_enrichment_div_instance)

    unit[j].mutual_enriching_word_color_coding_log_dict = {}
    unit[j].nonmutual_enriching_word_color_coding_log_dict = {}
    for(var enrichment_type in unit[j].summary){
      var enrichment_type_name_div = $('<div></div>').attr({class:'enrichment_type'}).text(enrichment_type+':')
      mutual_enrichment_div_instance.find('div#'+enrichment_type).append(enrichment_type_name_div)
      var enriched_word_div = $('<div></div>').attr({class:'enriched_word_div'})//.css()
      // var enriched_word_div = $('<span></span>').attr({class:'enriched_word'}).css({'border':' 2px solid '+color,'border-radius':'5px'}).text(enriched_word)
      mutual_enrichment_div_instance.find('div#'+enrichment_type).append(enriched_word_div)
      console.log('.'+enrichment_type)
      console.log(mutual_enrichment_div_instance)
      console.log(mutual_enrichment_div_instance.find('.'+enrichment_type))
      for(var enriched_word in unit[j].summary[enrichment_type]){
        var is_mutual = unit[j]['summary'][enrichment_type][enriched_word]['mutual']
        if(is_mutual){
          if(enriched_word in unit[j].mutual_enriching_word_color_coding_log_dict){
            var color = unit[j].mutual_enriching_word_color_coding_log_dict[enriched_word]
          }else{
            const goldenRatio = 0.618 // ... truncated
            var color = rcolor({
                          saturation: 0.25,
                          value: 0.95
                        })
            unit[j].mutual_enriching_word_color_coding_log_dict[enriched_word] = color
          }
          // var color = is_mutual? 'rgb(228,238,249)':'rgba(200,200,200,0.3)'
          var enriched_word_div = $('<span></span>').attr({class:'enriched_word'}).css({'background':color,'border-radius':'5px','padding':'2px'}).text(enriched_word)
          mutual_enrichment_div_instance.find('div#'+enrichment_type).find('div.enriched_word_div').append(enriched_word_div)
        }else{
          if(enriched_word in unit[j].nonmutual_enriching_word_color_coding_log_dict){
            var color = unit[j].nonmutual_enriching_word_color_coding_log_dict[enriched_word]
          }else{
            const goldenRatio = 0.618 // ... truncated
            var color = rcolor({
                          saturation: 0.05,
                          value: 0.95
                        })
            unit[j].nonmutual_enriching_word_color_coding_log_dict[enriched_word] = color
          }
          var enriched_word_div = $('<span></span>').attr({class:'enriched_word'}).css({'background':color,'padding':'2px','border':'1px solid rgba(0,0,0,0.1)'}).text(enriched_word)
          mutual_enrichment_div_instance.find('div#'+enrichment_type).find('div.enriched_word_div').append(enriched_word_div)
        }
        // var color = is_mutual? 'rgb(228,238,249)':'rgba(200,200,200,0.3)'// - 2020-1-27
        
        // var enriched_word_div = $('<span></span>').attr({class:'enriched_word'}).css({'border':' 2px solid '+color,'border-radius':'5px'}).text(enriched_word)
      }
      // var terms = Object.keys(unit[j].summary[enrichment_type]).join(' - ')
      // mutual_enrichment_div_instance.find('.'+enrichment_type).text(terms)
    }

    // if(dense_block_sents_idx_list.length > 0){
    if(true){
      var color = "rgb(254,157,60)"
      // if(DF||NG_L||NG_S||NG_G||BC_L||BC_S||BC_G){
      // }
      // if(true ||DF_r||NG_L_r||NG_S_r||NG_G_r||BC_L_r||BC_S_r||BC_G_r){
      // }
      // if(DF||DF_r){
      if(false){
        var df_term_list = df_term_only(current_kw, dense_block_sents_list)

        var div_id = current_kw.split(' ').join('_')+'_'+global_display_unit_counter+'_'+'DF'
        if(DF){
          var left_or_right = '_left'
        }else if(DF_r){
          var left_or_right = '_right'
        }
        diving(div_id,parent = '#'+kw_div_id+left_or_right,class_ = '', background = 'rgba(246,246,246,1)',position = 'relative',z_index = 1,display='inline-block',width='100%')

        // var svg_parent = draw.nested().attr({
        var svg_df = SVG( div_id ).size('100%',20)
        // svg_df.plain('df')
        svg_df.plain('DF:').attr({x:15,y:15,class:'summary_type',id:'DF'}).size(5).fill(color)
        // svg_df.plain(df_term_list.slice(0,5)).attr({x:50,y:15}).size(5).fill(color)
        colored_text(term_list=df_term_list.slice(0,5),svg_base_drawer=svg_df,x=50,y=15,black_and_white = false,size = 5,class_='individual_summary_term')
        if(!diagonal_dense_block_summary_dict.hasOwnProperty(j)){
          diagonal_dense_block_summary_dict[kw_div_id] = {}
        }
        diagonal_dense_block_summary_dict[kw_div_id]['DF'] = df_term_list.slice(0,5)
      }     



      if(options['1G_L']||options['1G_L_r']){

        // let _kw_div_id = kw_div_id
        var dense_block_sents_neighbor_unique_idx_list = Array.from(new Set(dense_block_sents_neighbor_idx_list))
        console.log(dense_block_sents_neighbor_unique_idx_list)
        var dense_block_sents_neighbor_unique_valid_idx_list = dense_block_sents_neighbor_unique_idx_list.filter(a => a >=0 && a <= raw.sent_num-1)
        console.log(dense_block_sents_neighbor_unique_valid_idx_list)

        var timer_2_ = setInterval(function(){
          console.log(worker_queue.length)
          if(worker_queue.length > 0){
            var worker = worker_queue.shift()
            $('#worker_num_div').html(worker_queue.length)
            clearInterval(timer_2_)
            worker.postMessage({key:'1g',value:dense_block_sents_neighbor_unique_valid_idx_list})
            // var this_ = this
            worker.onmessage = function(e){
              if(e.data.key == 'ready'){
                worker_queue.push(worker)
                $('#worker_num_div').html(worker_queue.length)
                var ngf = e.data.value.ngf
                var ngf_idf = e.data.value.ngf_idf
                // console.log('unsupered_n_grams_list',unsupered_n_grams_list)
                // var svg_div = $('<div></div>').attr({'id':kw_div_id+'_dense_block',class:'NG_L'})
                // $('#'+kw_div_id+'_left').append(svg_div)
                var arg_ngf_idf_list = ngf_idf.map(a=>{return {kw:a.kw,score:a.ngf_idf}})
                $('#'+kw_div_id).find('div.1G_Ni').attr('id',kw_div_id+'_1G_Ni')
                var svg_n_grams = SVG( kw_div_id+'_1G_Ni' ).size('100%',20)
                svg_n_grams.plain('1G-Ni:').attr({x:15,y:15,class:'summary_type',id:'','font-size':para.font_size_ten}).fill(color).data({type:'1gni'})//.size(5)
                colored_text_(arg_ngf_idf_list,svg_base_drawer=svg_n_grams,x=50,y=15,
                  black_and_white = false,size = 5,class_='individual_summary_term')
                if(!diagonal_dense_block_summary_dict.hasOwnProperty(kw_div_id)){
                  diagonal_dense_block_summary_dict[kw_div_id] = {}
                }
                diagonal_dense_block_summary_dict[kw_div_id]['1gni'] = ngf_idf.map(a=>a.kw).slice(0,5)

                // eval(back_enrichment.toString())
                //back_enrichment({ngf_like:ngf_idf,origin:'1gni',current_kw:current_kw,kw_div_id:kw_div_id})

                //data[kw_div_id].summary_terms_tested_unique_log =data[kw_div_id].summary_terms_tested_unique_log.concat(ngf_idf.map(a=>a.kw).slice(0,5))
                // $('#'+kw_div_id).find('div.mutual_kws').append('test'+kw_hits_obj_list.length)

                var arg_ngf_list = ngf.map(a=>{return {kw:a.kw,score:a.hits.length}})
                $('#'+kw_div_id).find('div.1G_N').attr('id',kw_div_id+'_1G_N')
                var svg_n_grams = SVG( kw_div_id+'_1G_N' ).size('100%',20)
                svg_n_grams.plain('1G-N:').attr({x:15,y:15,class:'summary_type',id:'','font-size':para.font_size_ten}).fill(color).data({type:'1gn'})//.size(5)
                colored_text_(arg_ngf_list,svg_base_drawer=svg_n_grams,x=50,y=15,
                  black_and_white = false,size = 5,class_='individual_summary_term')
                if(!diagonal_dense_block_summary_dict.hasOwnProperty(kw_div_id)){
                  diagonal_dense_block_summary_dict[kw_div_id] = {}
                }
                diagonal_dense_block_summary_dict[kw_div_id]['1gn'] = ngf.map(a=>a.kw).slice(0,5)

                //back_enrichment({ngf_like:ngf,origin:'1gn',current_kw:current_kw,kw_div_id:kw_div_id})

                //data[kw_div_id].summary_terms_tested_unique_log =data[kw_div_id].summary_terms_tested_unique_log.concat(ngf.map(a=>a.kw).slice(0,5))
              }
            }
          }
        },10)
      
      }


      if(NG_L||NG_L_r){

        // let _kw_div_id = kw_div_id
        var dense_block_sents_neighbor_unique_idx_list = Array.from(new Set(dense_block_sents_neighbor_idx_list))
        console.log(dense_block_sents_neighbor_unique_idx_list)
        var dense_block_sents_neighbor_unique_valid_idx_list = dense_block_sents_neighbor_unique_idx_list.filter(a => a >=0 && a <= raw.sent_num-1)
        console.log(dense_block_sents_neighbor_unique_valid_idx_list)

        var timer_1_ = setInterval(function(){
          console.log(worker_queue.length)
          if(worker_queue.length > 0){
            var worker = worker_queue.shift()
            $('#worker_num_div').html(worker_queue.length)
            clearInterval(timer_1_)
            worker.postMessage({key:'',value:dense_block_sents_neighbor_unique_valid_idx_list})
            // var this_ = this
            worker.onmessage = function(e){
              if(e.data.key == 'ready'){
                worker_queue.push(worker)
                $('#worker_num_div').html(worker_queue.length)
                var ngf = e.data.value.ngf
                var ngf_idf = e.data.value.ngf_idf
                // console.log('unsupered_n_grams_list',unsupered_n_grams_list)
                // var svg_div = $('<div></div>').attr({'id':kw_div_id+'_dense_block',class:'NG_L'})
                // $('#'+kw_div_id+'_left').append(svg_div)
                var arg_ngf_idf_list = ngf_idf.map(a=>{return {kw:a.kw,score:a.ngf_idf}})
                $('#'+kw_div_id).find('div.NG_Ni').attr('id',kw_div_id+'_NG_Ni')
                var svg_n_grams = SVG( kw_div_id+'_NG_Ni' ).size('100%',20)
                svg_n_grams.plain('NG-Ni:').attr({x:15,y:15,class:'summary_type',id:'','font-size':para.font_size_ten}).fill(color).data({type:'ngni'})//.size(5)
                colored_text_(arg_ngf_idf_list,svg_base_drawer=svg_n_grams,x=50,y=15,
                  black_and_white = false,size = 5,class_='individual_summary_term')
                if(!diagonal_dense_block_summary_dict.hasOwnProperty(kw_div_id)){
                  diagonal_dense_block_summary_dict[kw_div_id] = {}
                }
                diagonal_dense_block_summary_dict[kw_div_id]['ngni'] = ngf_idf.map(a=>a.kw).slice(0,5)

                //back_enrichment({ngf_like:ngf_idf,origin:'ngni',current_kw:current_kw,kw_div_id:kw_div_id})
                
                //data[kw_div_id].summary_terms_tested_unique_log =data[kw_div_id].summary_terms_tested_unique_log.concat(ngf_idf.map(a=>a.kw).slice(0,5))

                var arg_ngf_list = ngf.map(a=>{return {kw:a.kw,score:a.hits.length}})
                $('#'+kw_div_id).find('div.NG_N').attr('id',kw_div_id+'_NG_N')
                var svg_n_grams = SVG( kw_div_id+'_NG_N' ).size('100%',20)
                svg_n_grams.plain('NG-N:').attr({x:15,y:15,class:'summary_type',id:'','font-size':para.font_size_ten}).fill(color).data({type:'ngn'})//.size(5)
                colored_text_(arg_ngf_list,svg_base_drawer=svg_n_grams,x=50,y=15,
                  black_and_white = false,size = 5,class_='individual_summary_term')
                if(!diagonal_dense_block_summary_dict.hasOwnProperty(kw_div_id)){
                  diagonal_dense_block_summary_dict[kw_div_id] = {}
                }
                diagonal_dense_block_summary_dict[kw_div_id]['ngn'] = ngf.map(a=>a.kw).slice(0,5)

                //back_enrichment({ngf_like:ngf,origin:'ngn',current_kw:current_kw,kw_div_id:kw_div_id})

                //data[kw_div_id].summary_terms_tested_unique_log =data[kw_div_id].summary_terms_tested_unique_log.concat(ngf.map(a=>a.kw).slice(0,5))
              }
            }
          }
        },10)
      
      }


      if(NG_L||NG_L_r){

        // let _kw_div_id = kw_div_id
        var timer_1 = setInterval(function(){
          console.log(worker_queue.length)
          if(worker_queue.length > 0){
            var worker = worker_queue.shift()
            $('#worker_num_div').html(worker_queue.length)
            clearInterval(timer_1)
            worker.postMessage({key:'',value:dense_block_sents_idx_list})
            // var this_ = this
            worker.onmessage = function(e){
              if(e.data.key == 'ready'){
                worker_queue.push(worker)
                $('#worker_num_div').html(worker_queue.length)
                var ngf = e.data.value.ngf
                var ngf_idf = e.data.value.ngf_idf
                // console.log('unsupered_n_grams_list',unsupered_n_grams_list)
                // var svg_div = $('<div></div>').attr({'id':kw_div_id+'_dense_block',class:'NG_L'})
                // $('#'+kw_div_id+'_left').append(svg_div)
                var arg_ngf_idf_list = ngf_idf.map(a=>{return {kw:a.kw,score:a.ngf_idf}})
                $('#'+kw_div_id).find('div.NG_Li').attr('id',kw_div_id+'_NG_Li')
                var svg_n_grams = SVG( kw_div_id+'_NG_Li' ).size('100%',20)
                svg_n_grams.plain('NG-Li:').attr({x:15,y:15,class:'summary_type',id:'','font-size':para.font_size_ten}).fill(color).data({type:'ngli'})//.size(5)
                colored_text_(arg_ngf_idf_list,svg_base_drawer=svg_n_grams,x=50,y=15,
                  black_and_white = false,size = 5,class_='individual_summary_term')
                if(!diagonal_dense_block_summary_dict.hasOwnProperty(kw_div_id)){
                  diagonal_dense_block_summary_dict[kw_div_id] = {}
                }
                diagonal_dense_block_summary_dict[kw_div_id]['ngli'] = ngf_idf.map(a=>a.kw).slice(0,5)

                //back_enrichment({ngf_like:ngf_idf,origin:'ngli',current_kw:current_kw,kw_div_id:kw_div_id})

                //data[kw_div_id].summary_terms_tested_unique_log =data[kw_div_id].summary_terms_tested_unique_log.concat(ngf_idf.map(a=>a.kw).slice(0,5))

                var arg_ngf_list = ngf.map(a=>{return {kw:a.kw,score:a.hits.length}})
                $('#'+kw_div_id).find('div.NG_L').attr('id',kw_div_id+'_NG_L')
                var svg_n_grams = SVG( kw_div_id+'_NG_L' ).size('100%',20)
                svg_n_grams.plain('NG-L:').attr({x:15,y:15,class:'summary_type',id:'','font-size':para.font_size_ten}).fill(color).data({type:'ngl'})//.size(5)
                colored_text_(arg_ngf_list,svg_base_drawer=svg_n_grams,x=50,y=15,
                  black_and_white = false,size = 5,class_='individual_summary_term')
                if(!diagonal_dense_block_summary_dict.hasOwnProperty(kw_div_id)){
                  diagonal_dense_block_summary_dict[kw_div_id] = {}
                }
                diagonal_dense_block_summary_dict[kw_div_id]['ngl'] = ngf.map(a=>a.kw).slice(0,5)

                //back_enrichment({ngf_like:ngf,origin:'ngl',current_kw:current_kw,kw_div_id:kw_div_id})

                //data[kw_div_id].summary_terms_tested_unique_log =data[kw_div_id].summary_terms_tested_unique_log.concat(ngf.map(a=>a.kw).slice(0,5))
              }
            }
          }
        },10)
      
      }

      // if(NG_L||NG_L_r){
      

      
      if( (NG_S||NG_S_r) && draw_ng_s ){
        // var dense_block_spanned_sents_list = []
        var dense_block_spanned_sents_idx_list = []
        // var dense_block_spanned_sents_unlemma_list = []
        for(var s of sents_list){
          if(s.global_sent_idx >= unit[j]['dense_hits'][0] && s.global_sent_idx <= unit[j]['dense_hits'].slice(-1)[0]){
            // dense_block_spanned_sents_list.push(s)
            dense_block_spanned_sents_idx_list.push(s.global_sent_idx)
            // dense_block_spanned_sents_list.push(s.sent_lemma)
            // dense_block_spanned_sents_unlemma_list.push(s.sent_chinese_compact)
          }
        }
        
        var timer_2 = setInterval(function(){
          console.log(worker_queue.length)
          if(worker_queue.length > 0){
            var worker = worker_queue.shift()
            $('#worker_num_div').html(worker_queue.length)
            clearInterval(timer_2)
            worker.postMessage({key:'',value:dense_block_spanned_sents_idx_list})
            // var this_ = this
            worker.onmessage = function(e){
              if(e.data.key == 'ready'){
                worker_queue.push(worker)
                $('#worker_num_div').html(worker_queue.length)
                
                var ngf = e.data.value.ngf
                var ngf_idf = e.data.value.ngf_idf
                var arg_ngf_idf_list = ngf_idf.map(a=>{return {kw:a.kw,score:a.ngf_idf}})
                $('#'+kw_div_id).find('div.NG_Si').attr('id',kw_div_id+'_NG_Si')
                var svg_n_grams = SVG( kw_div_id+'_NG_Si' ).size('100%',20)
                svg_n_grams.plain('NG-Si:').attr({x:15,y:15,class:'summary_type',id:'','font-size':para.font_size_ten}).fill(color).data({type:'ngsi'})//.size(5)
                colored_text_(arg_ngf_idf_list,svg_base_drawer=svg_n_grams,x=50,y=15,
                  black_and_white = false,size = 5,class_='individual_summary_term')
                if(!diagonal_dense_block_summary_dict.hasOwnProperty(kw_div_id)){
                  diagonal_dense_block_summary_dict[kw_div_id] = {}
                }
                diagonal_dense_block_summary_dict[kw_div_id]['ngsi'] = ngf_idf.map(a=>a.kw).slice(0,5)

                //back_enrichment({ngf_like:ngf_idf,origin:'ngsi',current_kw:current_kw,kw_div_id:kw_div_id})

                //data[kw_div_id].summary_terms_tested_unique_log =data[kw_div_id].summary_terms_tested_unique_log.concat(ngf_idf.map(a=>a.kw).slice(0,5))

                var arg_ngf_list = ngf.map(a=>{return {kw:a.kw,score:a.hits.length}})
                $('#'+kw_div_id).find('div.NG_S').attr('id',kw_div_id+'_NG_S')
                var svg_n_grams = SVG( kw_div_id+'_NG_S' ).size('100%',20)
                svg_n_grams.plain('NG-S:').attr({x:15,y:15,class:'summary_type',id:'','font-size':para.font_size_ten}).fill(color).data({type:'ngs'})//.size(5)
                colored_text_(arg_ngf_list,svg_base_drawer=svg_n_grams,x=50,y=15,
                  black_and_white = false,size = 5,class_='individual_summary_term')
                if(!diagonal_dense_block_summary_dict.hasOwnProperty(kw_div_id)){
                  diagonal_dense_block_summary_dict[kw_div_id] = {}
                }
                diagonal_dense_block_summary_dict[kw_div_id]['ngs'] = ngf.map(a=>a.kw).slice(0,5)

                //back_enrichment({ngf_like:ngf,origin:'ngs',current_kw:current_kw,kw_div_id:kw_div_id})

                //data[kw_div_id].summary_terms_tested_unique_log =data[kw_div_id].summary_terms_tested_unique_log.concat(ngf.map(a=>a.kw).slice(0,5))

                // var unsupered_n_grams_list = e.data.value
                // // console.log('unsupered_n_grams_list',unsupered_n_grams_list)
                // // var svg_div = $('<div></div>').attr({'id':kw_div_id+'_dense_block_spanned_sents',class:'NG_S'})
                // // $('#'+kw_div_id+'_left').append(svg_div)
                // $('#'+kw_div_id).find('div.NG_S').attr('id',kw_div_id+'_NG_S')
                // var svg_n_grams = SVG( kw_div_id+'_NG_S' ).size('100%',20)
                // svg_n_grams.plain('NG-S:').attr({'font-size':para.font_size_ten,x:15,y:15,class:'summary_type',id:''}).fill(color).data({type:'ngs'})//.size(5)
                // colored_text(term_list=unsupered_n_grams_list.slice(0,10),svg_base_drawer=svg_n_grams,x=50,y=15,
                //   black_and_white = false,size = 5,class_='individual_summary_term')
                
                // if(!diagonal_dense_block_summary_dict.hasOwnProperty(kw_div_id)){
                //   diagonal_dense_block_summary_dict[kw_div_id] = {}
                // }
                // diagonal_dense_block_summary_dict[kw_div_id]['ngs'] = unsupered_n_grams_list.slice(0,5)
              }
            }
          }
        },10)
        
      }


      console.log(trigger)
      console.log(merge)
      console.log(!( trigger == 'summary' && merge == false))
      if( (NG_G||NG_G_r) && draw_ng_g ){//&& !( trigger == 'summary' && merge == false) 
        if(!summary_dict_with_n_grams_from_all_hit_sents.hasOwnProperty(current_kw)){
          
          var timer_3 = setInterval(function(){
            console.log(worker_queue.length)
            if(worker_queue.length > 0){
              var worker = worker_queue.shift()
              $('#worker_num_div').html(worker_queue.length)
              clearInterval(timer_3)
              worker.postMessage({key:'',value:all_hit_sents_idx})
              // var this_ = this
              worker.onmessage = function(e){
                if(e.data.key == 'ready'){
                  worker_queue.push(worker)
                  $('#worker_num_div').html(worker_queue.length)


                  var ngf = e.data.value.ngf
                  var ngf_idf = e.data.value.ngf_idf
                  var arg_ngf_idf_list = ngf_idf.map(a=>{return {kw:a.kw,score:a.ngf_idf}})
                  $('#'+kw_div_id).find('div.NG_Gi').attr('id',kw_div_id+'_NG_Gi')
                  var svg_n_grams = SVG( kw_div_id+'_NG_Gi' ).size('100%',20)
                  svg_n_grams.plain('NG-Gi:').attr({x:15,y:15,class:'summary_type',id:'','font-size':para.font_size_ten}).fill(color).data({type:'nggi'})//.size(5)
                  colored_text_(arg_ngf_idf_list,svg_base_drawer=svg_n_grams,x=50,y=15,
                    black_and_white = false,size = 5,class_='individual_summary_term')
                  if(!diagonal_dense_block_summary_dict.hasOwnProperty(kw_div_id)){
                    diagonal_dense_block_summary_dict[kw_div_id] = {}
                  }
                  diagonal_dense_block_summary_dict[kw_div_id]['nggi'] = ngf_idf.map(a=>a.kw).slice(0,5)

                  //back_enrichment({ngf_like:ngf_idf,origin:'nggi',current_kw:current_kw,kw_div_id:kw_div_id})

                  //data[kw_div_id].summary_terms_tested_unique_log =data[kw_div_id].summary_terms_tested_unique_log.concat(ngf_idf.map(a=>a.kw).slice(0,5))
                  summary_dict_with_n_grams_from_all_hit_sents[current_kw] = {nggi:ngf_idf.map(a=>{return {kw:a.kw,score:a.ngf_idf}})}

                  var arg_ngf_list = ngf.map(a=>{return {kw:a.kw,score:a.hits.length}})
                  $('#'+kw_div_id).find('div.NG_G').attr('id',kw_div_id+'_NG_G')
                  var svg_n_grams = SVG( kw_div_id+'_NG_G' ).size('100%',20)
                  svg_n_grams.plain('NG-G:').attr({x:15,y:15,class:'summary_type',id:'','font-size':para.font_size_ten}).fill(color).data({type:'ngg'})//.size(5)
                  colored_text_(arg_ngf_list,svg_base_drawer=svg_n_grams,x=50,y=15,
                    black_and_white = false,size = 5,class_='individual_summary_term')
                  if(!diagonal_dense_block_summary_dict.hasOwnProperty(kw_div_id)){
                    diagonal_dense_block_summary_dict[kw_div_id] = {}
                  }
                  diagonal_dense_block_summary_dict[kw_div_id]['ngg'] = ngf.map(a=>a.kw).slice(0,5)

                  //back_enrichment({ngf_like:ngf,origin:'ngg',current_kw:current_kw,kw_div_id:kw_div_id})

                  //data[kw_div_id].summary_terms_tested_unique_log =data[kw_div_id].summary_terms_tested_unique_log.concat(ngf.map(a=>a.kw).slice(0,5))
                  summary_dict_with_n_grams_from_all_hit_sents[current_kw]['ngg'] = ngf.map(a=>{return {kw:a.kw,score:a.hits.length}})//.slice(0,5)


                  // var unsupered_n_grams_list = e.data.value
                  // // console.log('unsupered_n_grams_list',unsupered_n_grams_list)
                  // // var svg_div = $('<div></div>').attr({'id':kw_div_id+'_all_hit_sents',class:'NG_G'})
                  // // $('#'+kw_div_id+'_left').append(svg_div)
                  // $('#'+kw_div_id).find('div.NG_G').attr('id',kw_div_id+'_NG_G')
                  // var svg_n_grams = SVG( kw_div_id+'_NG_G' ).size('100%',20)
                  // svg_n_grams.plain('NG-G:').attr({'font-size':para.font_size_ten,x:15,y:15,class:'summary_type',id:''}).fill(color).data({type:'ngg'})//.size(5)
                  // colored_text(term_list=unsupered_n_grams_list.slice(0,10),svg_base_drawer=svg_n_grams,x=50,y=15,
                  //   black_and_white = false,size = 5,class_='individual_summary_term')
                  
                  // if(!diagonal_dense_block_summary_dict.hasOwnProperty(kw_div_id)){
                  //   diagonal_dense_block_summary_dict[kw_div_id] = {}
                  // }
                  // diagonal_dense_block_summary_dict[kw_div_id]['ngg'] = unsupered_n_grams_list.slice(0,5)
                  // // console.log('unsupered_n_grams_list',unsupered_n_grams_list)
                  // summary_dict_with_n_grams_from_all_hit_sents[current_kw] = unsupered_n_grams_list.slice(0,5)
                }
              }
            }
          },10) 

        }else{
          $('#'+kw_div_id).find('div.NG_Gi').attr('id',kw_div_id+'_NG_Gi')
          var svg_n_grams = SVG( kw_div_id+'_NG_Gi' ).size('100%',20)
          svg_n_grams.plain('NG-Gi:').attr({'font-size':para.font_size_ten,x:15,y:15,class:'summary_type',id:'n_grams_from_all_hit_sents'}).fill(color).data({type:'nggi'})//.size(5)
          var arg_ngf_list = summary_dict_with_n_grams_from_all_hit_sents[current_kw]['nggi']
          colored_text_(arg_ngf_list, svg_base_drawer=svg_n_grams,x=50,y=15,black_and_white = false,size = 5,class_='individual_summary_term')


          $('#'+kw_div_id).find('div.NG_G').attr('id',kw_div_id+'_NG_G')
          var svg_n_grams = SVG( kw_div_id+'_NG_G' ).size('100%',20)
          svg_n_grams.plain('NG-G:').attr({'font-size':para.font_size_ten,x:15,y:15,class:'summary_type',id:'n_grams_from_all_hit_sents'}).fill(color).data({type:'ngg'})//.size(5)
          var arg_ngf_list = summary_dict_with_n_grams_from_all_hit_sents[current_kw]['ngg']
          colored_text_(arg_ngf_list, svg_base_drawer=svg_n_grams,x=50,y=15,black_and_white = false,size = 5,class_='individual_summary_term')
          // svg_n_grams.plain(summary_dict_with_n_grams_from_all_hit_sents[current_kw]).attr({x:50,y:15}).size(5).fill(color)
          if(!diagonal_dense_block_summary_dict.hasOwnProperty(kw_div_id)){
            diagonal_dense_block_summary_dict[kw_div_id] = {}
          }
          diagonal_dense_block_summary_dict[kw_div_id]['nggi'] = summary_dict_with_n_grams_from_all_hit_sents[current_kw]['nggi']

          //back_enrichment({ngf_like:summary_dict_with_n_grams_from_all_hit_sents[current_kw]['nggi'],origin:'nggi',current_kw:current_kw,kw_div_id:kw_div_id})

          //data[kw_div_id].summary_terms_tested_unique_log =data[kw_div_id].summary_terms_tested_unique_log.concat(summary_dict_with_n_grams_from_all_hit_sents[current_kw]['nggi'])

          diagonal_dense_block_summary_dict[kw_div_id]['ngg'] = summary_dict_with_n_grams_from_all_hit_sents[current_kw]['ngg']

          //back_enrichment({ngf_like:summary_dict_with_n_grams_from_all_hit_sents[current_kw]['ngg'],origin:'ngg',current_kw:current_kw,kw_div_id:kw_div_id})

          //data[kw_div_id].summary_terms_tested_unique_log =data[kw_div_id].summary_terms_tested_unique_log.concat(summary_dict_with_n_grams_from_all_hit_sents[current_kw]['ngg'])
        }
      }


      if(BC_L||BC_L_r){
        // var df_term_list = df_term_only(current_kw, dense_block_sents_list)
        var [tfidf_list, tfidf_dict_] = content_to_tfidfs(dense_block_sents_list.join(' '))
        var tfidf_term_only_list = tfidf_list.map(a=>a[0])

        var div_id = current_kw.split(' ').join('_')+'_'+global_display_unit_counter+'_'+'tfidf_with_dense_against_brown_corpus'
        if(BC_L){
          var left_or_right = '_left'
        }else if(BC_L_r){
          var left_or_right = '_right'
        }
        diving(div_id,parent = '#'+kw_div_id+left_or_right,class_ = '', background = 'rgba(246,246,246,1)',position = 'relative',z_index = 1,display='inline-block',width='100%')

        // var svg_parent = draw.nested().attr({
        var svg_ = SVG( div_id ).size('100%',20)
        // svg_df.plain('df')
        svg_.plain('BC-L:').attr({x:15,y:15,class:'summary_type',id:'tfidf_with_dense_against_brown_corpus'}).size(5).fill(color)
        colored_text(term_list=tfidf_term_only_list.slice(0,5),svg_base_drawer=svg_,x=50,y=15,black_and_white = false,size = 5,class_='individual_summary_term')
        // svg_.plain(tfidf_term_only_list.slice(0,5)).attr({x:50,y:15}).size(5).fill(color)

        if(!diagonal_dense_block_summary_dict.hasOwnProperty(kw_div_id)){
          diagonal_dense_block_summary_dict[kw_div_id] = {}
        }
        diagonal_dense_block_summary_dict[kw_div_id]['tfidf_with_dense_against_brown_corpus'] = tfidf_term_only_list.slice(0,5)
      }


      if(BC_S||BC_S_r){
        // var df_term_list = df_term_only(current_kw, dense_block_sents_list)
        var dense_block_spanned_sents_list = []
        for(var s of sents_list){
          if(s.global_sent_idx >= unit[j]['dense_hits'][0] && s.global_sent_idx <= unit[j]['dense_hits'].slice(-1)[0]){
            dense_block_spanned_sents_list.push(s.sent_lemma)
          }
        }
        var [tfidf_list, tfidf_dict_] = content_to_tfidfs(dense_block_spanned_sents_list.join(' '))
        var tfidf_term_only_list = tfidf_list.map(a=>a[0])

        var div_id = current_kw.split(' ').join('_')+'_'+global_display_unit_counter+'_'+'tfidf_with_dense_block_spanned_sents_against_brown_corpus'
        if(BC_S){
          var left_or_right = '_left'
        }else if(BC_S_r){
          var left_or_right = '_right'
        }
        diving(div_id,parent = '#'+kw_div_id+left_or_right,class_ = '', background = 'rgba(246,246,246,1)',position = 'relative',z_index = 1,display='inline-block',width='100%')

        // var svg_parent = draw.nested().attr({
        var svg_ = SVG( div_id ).size('100%',20)
        // svg_df.plain('df')
        svg_.plain('BC-S:').attr({x:15,y:15,class:'summary_type',id:'tfidf_with_dense_block_spanned_sents_against_brown_corpus'}).size(5).fill(color)
        colored_text(term_list=tfidf_term_only_list.slice(0,5),svg_base_drawer=svg_,x=50,y=15,black_and_white = false,size = 5,class_='individual_summary_term')
        // svg_.plain(tfidf_term_only_list.slice(0,5)).attr({x:50,y:15}).size(5).fill(color)

        if(!diagonal_dense_block_summary_dict.hasOwnProperty(kw_div_id)){
          diagonal_dense_block_summary_dict[kw_div_id] = {}
        }
        diagonal_dense_block_summary_dict[kw_div_id]['tfidf_with_dense_block_spanned_sents_against_brown_corpus'] = tfidf_term_only_list.slice(0,5)
      }


      if(BC_G||BC_G_r){
        if(!summary_dict_with_tfidf_from_all_hit_sents_against_brown_corpus.hasOwnProperty(current_kw)){
          var [tfidf_list, tfidf_dict_] = content_to_tfidfs(all_hit_sents.join(' '))
          var tfidf_term_only_list = tfidf_list.map(a=>a[0])

          var div_id = current_kw.split(' ').join('_')+'_'+global_display_unit_counter+'_'+'tfidf_with_all_hit_sents_against_brown_corpus'
          if(BC_G){
          var left_or_right = '_left'
        }else if(BC_G_r){
          var left_or_right = '_right'
        }
        diving(div_id,parent = '#'+kw_div_id+left_or_right,class_ = '', background = 'rgba(246,246,246,1)',position = 'relative',z_index = 1,display='inline-block',width='100%')

          var svg_ = SVG( div_id ).size('100%',20)
          // svg_df.plain('df')
          svg_.plain('BC-G:').attr({x:15,y:15,class:'summary_type',id:'tfidf_with_all_hit_sents_against_brown_corpus'}).size(5).fill(color)
          colored_text(term_list=tfidf_term_only_list.slice(0,5),svg_base_drawer=svg_,x=50,y=15,black_and_white = false,size = 5,class_='individual_summary_term')
          // svg_.plain(tfidf_term_only_list.slice(0,5)).attr({x:50,y:15}).size(5).fill(color)

          if(!diagonal_dense_block_summary_dict.hasOwnProperty(kw_div_id)){
            diagonal_dense_block_summary_dict[kw_div_id] = {}
          }
          diagonal_dense_block_summary_dict[kw_div_id]['tfidf_with_all_hit_sents_against_brown_corpus'] = tfidf_term_only_list.slice(0,5)
          summary_dict_with_tfidf_from_all_hit_sents_against_brown_corpus[current_kw] = tfidf_term_only_list.slice(0,5)
        }else{
          var div_id = current_kw.split(' ').join('_')+'_'+global_display_unit_counter+'_'+'tfidf_with_all_hit_sents_against_brown_corpus'
          if(BC_G){
          var left_or_right = '_left'
        }else if(BC_G_r){
          var left_or_right = '_right'
        }
        diving(div_id,parent = '#'+kw_div_id+left_or_right,class_ = '', background = 'rgba(246,246,246,1)',position = 'relative',z_index = 1,display='inline-block',width='100%')

          // var svg_parent = draw.nested().attr({
          var svg_ = SVG( div_id ).size('100%',20)
          // svg_df.plain('df')
          svg_.plain('BC-G:').attr({x:15,y:15,class:'summary_type',id:'tfidf_with_all_hit_sents_against_brown_corpus'}).size(5).fill(color)
          colored_text(term_list=summary_dict_with_tfidf_from_all_hit_sents_against_brown_corpus[current_kw],svg_base_drawer=svg_,x=50,y=15,black_and_white = false,size = 5,class_='individual_summary_term')
          // svg_.plain(summary_dict_with_tfidf_from_all_hit_sents_against_brown_corpus[current_kw]).attr({x:50,y:15}).size(5).fill(color)

          if(!diagonal_dense_block_summary_dict.hasOwnProperty(kw_div_id)){
            diagonal_dense_block_summary_dict[kw_div_id] = {}
          }
          diagonal_dense_block_summary_dict[kw_div_id]['tfidf_with_all_hit_sents_against_brown_corpus'] = summary_dict_with_tfidf_from_all_hit_sents_against_brown_corpus[current_kw]
        }
      }
           
    }
    

    if(dense_block_sents_list.length > 0 && !no_summary){
      //df
      df_term_list = df_term_only(current_kw, dense_block_sents_list)
      // var df_terms = draw.text(df_term_list.slice(0,5).join(' | '))
      y_pos_tmp = y_pos
      colored_text(df_term_list.slice(0,5),50,y_pos_tmp+23+40)
      colored_text(['DF:'],20,y_pos_tmp+23+40,true)
      y_pos_tmp += 20
      // draw.text('DF:').move(20,y_pos+5.8+40+14).size(7)
      // draw.text(dense_block_sents_list[0].slice(0,10)+'|'+dense_block_sents_list[1].slice(0,10)+'|'+dense_block_sents_list[2].slice(0,10)+'|').move(620,y_pos+5.8+40+14).size(7)
      diagonal_dense_block_summary_dict[kw_div_id] = {}
      diagonal_dense_block_summary_dict[kw_div_id]['DF'] = df_term_list.slice(0,5)


      //tf_idf
      // console.log('current_kw',current_kw)
      // console.log('dense_block_sents_list',dense_block_sents_list)
      var [tfidf_list, tfidf_dict_] = content_to_tfidfs(dense_block_sents_list.join(' '))
      var tfidf_term_only_list = []
      tfidf_list.map(function(t){
        tfidf_term_only_list.push(t[0])
      })
      tfidf_term_only_list = this_word_safe(tfidf_term_only_list,current_kw)
      // var tfidf_terms = draw.text(tfidf_term_only_list.slice(0,5).join(' | '))
      colored_text(tfidf_term_only_list.slice(0,5),50,y_pos_tmp+23+40)
      colored_text(['BC:'],20,y_pos_tmp+23+40,true)
      y_pos_tmp += 20
      // tfidf_terms.move(50,y_pos+5.8+60+14).size(7)
      // draw.text('BC:').move(20,y_pos+5.8+60+14).size(7)
      diagonal_dense_block_summary_dict[kw_div_id]['BC'] = tfidf_term_only_list.slice(0,5)


      //tf_idf_de_novo with doc per sent
      var doc = dense_block_sents_list.join(' ')
      var all_docs = all_sents_lemma_plain_list//all_sents_except_dense_block.concat(doc)
      tf_idf_list = tf_idf_de_novo(doc,all_docs,false)
      var tfidf_term_only_list = []
      tf_idf_list.map(function(t){
        tfidf_term_only_list.push(t[0])
      })
      tfidf_term_only_list = this_word_safe(tfidf_term_only_list,current_kw)
      // var tfidf_terms = draw.text(tfidf_term_only_list.slice(0,5).join(' | '))
      colored_text(tfidf_term_only_list.slice(0,5),50,y_pos_tmp+23+40)
      colored_text(['AS:'],20,y_pos_tmp+23+40,true)
      y_pos_tmp += 20
      // tfidf_terms.move(50,y_pos+5.8+80+14).size(7)
      // draw.text('AS:').move(20,y_pos+5.8+80+14).size(7)
      diagonal_dense_block_summary_dict[kw_div_id]['AS'] = tfidf_term_only_list.slice(0,5)


      //tf_idf_de_novo with doc per hit sent
      var doc = dense_block_sents_list.join(' ')
      var all_docs = all_hit_sents//hit_sents_except_dense_block.concat(doc)
      tf_idf_list = tf_idf_de_novo(doc,all_docs,false)
      var tfidf_term_only_list = []
      tf_idf_list.map(function(t){
        tfidf_term_only_list.push(t[0])
      })
      tfidf_term_only_list = this_word_safe(tfidf_term_only_list,current_kw)
      // var tfidf_terms = draw.text(tfidf_term_only_list.slice(0,5).join(' | '))
      colored_text(tfidf_term_only_list.slice(0,5),50,y_pos_tmp+23+40)
      colored_text(['HS:'],20,y_pos_tmp+23+40,true)
      y_pos_tmp += 20
      // tfidf_terms.move(50,y_pos+5.8+100+14).size(7)
      // draw.text('HS:').move(20,y_pos+5.8+100+14).size(7)
      diagonal_dense_block_summary_dict[kw_div_id]['HS'] = tfidf_term_only_list.slice(0,5)


      //tf_idf_de_novo with doc per page content
      var doc = dense_block_sents_list.join(' ')
      var all_docs = page_contents_lemma//.concat(doc)
      tf_idf_list = tf_idf_de_novo(doc,all_docs,false)
      var tfidf_term_only_list = []
      tf_idf_list.map(function(t){
        tfidf_term_only_list.push(t[0])
      })
      tfidf_term_only_list = this_word_safe(tfidf_term_only_list,current_kw)
      // var tfidf_terms = draw.text(tfidf_term_only_list.slice(0,5).join(' | '))
      colored_text(tfidf_term_only_list.slice(0,5),50,y_pos_tmp+23+40)
      colored_text(['AP:'],20,y_pos_tmp+23+40,true)
      y_pos_tmp += 20
      // tfidf_terms.move(50,y_pos+5.8+120+14).size(7)
      // draw.text('AP:').move(20,y_pos+5.8+120+14).size(7)
      diagonal_dense_block_summary_dict[kw_div_id]['AP'] = tfidf_term_only_list.slice(0,5)


      //tf_idf_de_novo with doc per hit sent
      var doc = all_hit_sents.join(' ')
      var all_docs = all_sents_lemma_plain_list//hit_sents_except_dense_block.concat(doc)
      tf_idf_list = tf_idf_de_novo(doc,all_docs,false)
      var tfidf_term_only_list = []
      tf_idf_list.map(function(t){
        tfidf_term_only_list.push(t[0])
      })
      tfidf_term_only_list = this_word_safe(tfidf_term_only_list,current_kw)
      // var tfidf_terms = draw.text(tfidf_term_only_list.slice(0,5).join(' | '))
      colored_text(tfidf_term_only_list.slice(0,5),50,y_pos_tmp+23+40)
      colored_text(['HA:'],20,y_pos_tmp+23+40,true)
      y_pos_tmp += 20
      // tfidf_terms.move(50,y_pos+5.8+100+14).size(7)
      // draw.text('HA:').move(20,y_pos+5.8+140+14).size(7)
      diagonal_dense_block_summary_dict[kw_div_id]['HSAS'] = tfidf_term_only_list.slice(0,5)
    }else if(!no_summary){
      //tf_idf_de_novo with doc per hit sent
      var doc = all_hit_sents.join(' ')
      var all_docs = all_sents_lemma_plain_list//hit_sents_except_dense_block.concat(doc)
      tf_idf_list = tf_idf_de_novo(doc,all_docs,false)
      var tfidf_term_only_list = []
      tf_idf_list.map(function(t){
        tfidf_term_only_list.push(t[0])
      })
      tfidf_term_only_list = this_word_safe(tfidf_term_only_list,current_kw)
      // var tfidf_terms = draw.text(tfidf_term_only_list.slice(0,5).join(' | '))
      y_pos_tmp = y_pos
      colored_text(tfidf_term_only_list.slice(0,50),50,y_pos_tmp+23+40)
      colored_text(['HA:'],20,y_pos_tmp+23+40,true)
      y_pos_tmp += 20
      // tfidf_terms.move(50,y_pos+5.8+100+14).size(7)
      // draw.text('HA:').move(20,y_pos+5.8+140+14).size(7)
      diagonal_dense_block_summary_dict[kw_div_id] = {}
      diagonal_dense_block_summary_dict[kw_div_id]['HSAS'] = tfidf_term_only_list.slice(0,5)
    }

    global_display_unit_counter+=1;
    j = j+1
    svg_events_binder({bind_by:'div#'+kw_div_id, for_titles:false, for_polyline:polyline_only})    
    // svg_events_binder({bind_by = 'div.kw_display_unit', for_titles = false, for_polyline = false} = {})
  }

  if( use_set_interval == false || not_use_set_interval_temp == true){//假设此情况不会出现
    console.log('not using setInterval')
    for (var j = 0; j< unit.length; j++){
      one_iteration()
    }
    // svg_events_binder()//假设此情况不会出现
    // return display_unit_id_log_list    
  }else if(use_set_interval  == true|| not_use_set_interval_temp == false){
    var my_set_interval = setInterval(one_iteration,0)
    // return display_unit_id_log_list    
  }

  // if(use_set_interval || !not_use_set_interval_temp){
  //   var my_set_interval = setInterval(one_iteration,0)
  // }else if( !use_set_interval || not_use_set_interval_temp){
  //   console.log('not using setInterval')
  //   for (var j = 0; j< unit.length; j++){
  //     one_iteration()
  //   }
  //   svg_events_binder()
  // }
  
  

  // var y_min = 1080
  // var y_max = (global_display_unit_counter + 1)*y_interval+0
  // // console.log('unit.length',unit.length)
  // y_max = y_max > y_min? y_max : y_min
  // // draw.size('100%', y_max)
  // $('#svg_container').attr('height',y_max)
}






function draw_titles(){

  var sents_list = sent_info_list
  var x_max = para.x_max
  var unit_height = 50
  var per_hit_rect_width = 35
  var right_shift = 200
  var titles_div_id = 'titles_div'

  // console.log($('div#'+titles_div_id))
  if($('div#'+titles_div_id).length > 0){return}

  diving(titles_div_id,parent = 'body',class_ = 'titles_div_class', background = 'rgba(246,246,246,1)',position = 'fixed',z_index = 3,display='block')
  $('#'+titles_div_id).css({top:20,left:0,width:'100%'})
  $('#'+titles_div_id).addClass('titles_display_unit')

  var svg_parent = SVG( titles_div_id ).size('100%', 45).attr({
      id:'titles_svg',
      // id:current_kw.split(' ').join('_'),
      class:'svg_parent',
      // x:0,
      // y:y_pos,
      // height:70
    })

    svg_kw = svg_parent.nested().attr({
      id:'titles_nested_svg',
      class:'svg_kw',
      x:right_shift,
      y:0,
      width:x_max + per_hit_rect_width,
      height:unit_height,
      style:'overflow:hidden'
    })
    // svg_kw =dwg.add(dwg.svg(x=right_shift,y=y_pos,size=(x_max,unit_height)))
            
    // 每个关键词一个group
    // g = svg_kw.group()
    // 每个关键词一个backg
    svg_kw.rect('100%','100%').attr({
      x:'0',
      y:'0',
      opacity:1,
      fill:'rgb(228,238,249)',
      // fill:'rgb(249,242,242)',
      // fill:'rgb(240,240,240)',
      id:'bg1'
    })

    // console.log('from draw title')
    // console.log(sents_list)
    for (var i = 0; i< sents_list.length; i++){
      // console.log(i)
      sent = sents_list[i]['sent_lemma']
      sent_original = sents_list[i]['sent']
      sent_page_no = sents_list[i].page_num
      global_sent_idx = sents_list[i].global_sent_idx
      x_pos=Math.round((i/sents_list.length)*x_max)
      var green_light = false
      // console.log(sents_list[i]['is_title'])
      if(sents_list[i]['is_title']){
        // console.log(sent,'is_title')
        // alert(sent_original)
        green_light = true
      }
      if(green_light==true){
        svg_kw_hit = svg_kw.nested().attr({
        id:sents_list[i]['global_sent_idx'],
        class:'svg_titles',
        x:x_pos,
        y:0,
        width:per_hit_rect_width,
        height:unit_height,
        style:'overflow:hidden'
        })

        svg_kw_hit.rect('100%','100%').attr({
        x:0,
        y:0,
        opacity:0.05,
        fill:'black',
        id:'trigger-'+ 'THE_TITLES' +'__'+sents_list[i]['global_sent_idx']
        })

        svg_kw_hit.rect('2%','100%').attr({
        x:'45%',
        y:0,
        opacity:1,
        fill:'black',
        id:'cvr-'+ 'THE_TITLES' +'__'+sents_list[i]['global_sent_idx']
        })

        kw_hits_dict['THE_TITLES'+'__'+global_sent_idx] = {'sent_idx':global_sent_idx,
                                             'quering_keyword':'',
                                             'quering_keyword_expanded':'',
                                             'page':sent_page_no,
                                             'global_diagonal_idx':''
                                           }
      }
    }

    // svg_events_binder('div#'+titles_div_id, true)
    svg_events_binder({bind_by:'div#'+titles_div_id, for_titles:true, for_polyline:false})
}