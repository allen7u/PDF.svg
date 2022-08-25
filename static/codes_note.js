






































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
        var arg_ngf_idf_list = ngf_idf.map(a=>{kw:a.kw,score:a.ngf_idf})
        $('#'+kw_div_id).find('div.NG_L').attr('id',kw_div_id+'_NG_L')
        var svg_n_grams = SVG( kw_div_id+'_NG_L' ).size('100%',20)
        svg_n_grams.plain('NG-L:').attr({x:15,y:15,class:'summary_type',id:'','font-size':para.font_size_ten}).fill(color).data({type:'ngl'})//.size(5)
        colored_text_(arg_ngf_idf_list,svg_base_drawer=svg_n_grams,x=50,y=15,
          black_and_white = false,size = 5,class_='individual_summary_term')
        if(!diagonal_dense_block_summary_dict.hasOwnProperty(kw_div_id)){
          diagonal_dense_block_summary_dict[kw_div_id] = {}
        }
        diagonal_dense_block_summary_dict[kw_div_id]['ngl'] = unsupered_n_grams_list.slice(0,5)
      }
    }
  }
},10)








$('a').each(function() {
    console.log($(this).text())
    $(this).text($(this).text().toLowerCase())
})




if draw_from_main:
    NG-L, NG-S, NG-G
else if draw_from_ployline:
    if left_click:
        NG-L == NG-G
        NG-S == expensive
            draw NG-L
    else if right_click:
        for each_dense_region:
            NG-L, NG-S, NG-G(check dict first)

    
for(var w of csw){
    if(w.length == 1 ||
        w.match(/^__/)){
        console.log(w)
    }
}

for(var w of csw){
    if(w.length == 1){
        console.log(w)
    }
}

for(var w of csw){
    if(w.match(/^__/)){
        console.log(w)
    }
}
// var clusters_list = [e.hits]
            var clusters_list_ = []
            for(var i=0; i<1000; i++){
                clusters_list_.push(0.1)
            }
            var clusters_list = [ clusters_list_ ]

