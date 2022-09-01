















var kw_list
var url_from_input_file = ''
// no longer supported here for dynamically injection by jinja2 in viewer_URL.html
// var pdf_url = 'hachi.pdf'
// var pdf_url = 'hachi - pg_0001.pdf'
// var pdf_file_name
var input_text = $('#lolz').value
// var para_dict = {}
var options = {}
options.mutual_enriched_json_existed = undefined;


// 
// First line choice: open PDF file by drag and drop on target area
// 

//< will be deprecated

function dropHandler(ev) {

    console.log('File(s) dropped');
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    var files = ev.dataTransfer.files
        console.log('files',files)
        for(var i = 0; i<files.length; i++){
            console.log('file name is',files[i].name)
            var pdf_file_name = files[i].name
            pdf_url = URL.createObjectURL(files[i])

            build_and_send_para_json(pdf_file_name)
        }
}

function dragOverHandler(ev) {
  ev.preventDefault();
}
function dragEnterHandler(e){
    e.preventDefault()
}

// document.getElementById('drop_zone').addEventListener('dragenter',dragEnterHandler)
// document.getElementById('drop_zone').addEventListener('dragover',dragOverHandler)
// document.getElementById('drop_zone').addEventListener('drop',dropHandler)

//>


// 
// Second line choice: open PDF file by input text
// 

document.getElementById('input_pdf').addEventListener('change',function(){ // file input dialog

    var files = this.files
    console.log('files',files)
    for(var i = 0; i<files.length; i++){
        console.log('file name is',files[i].name)
        var pdf_file_name = files[i].name
        pdf_url = URL.createObjectURL(files[i])

        build_and_send_para_json(pdf_file_name)
    }
})



// 
// to specify custom keywords ( not really used )
// 

document.getElementById('input_kw').addEventListener('change', input_file_to_url, false);

function input_file_to_url (evt) {
   var files = evt.target.files;
   var file = files[0];           
   url_from_input_file = URL.createObjectURL(file)
   console.log('url_from_input_file',url_from_input_file)
   // read_text_file_from_url(url_from_input_file)
}


// 
// deprecated somehow
// 

function read_text_file_from_input (evt) {//not needed now
   var files = evt.target.files;
   var file = files[0];           
   var reader = new FileReader();
   reader.onload = function(event) {
     console.log('read_text_file',event.target.result);  
     kw_list = event.target.result.split('\n')
     console.log('read_text_file_list',kw_list);  
   }
   reader.readAsText(file)
}

function dropHandler_bak(ev) {//redundant
  console.log('File(s) dropped');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file') {
        var file = ev.dataTransfer.items[i].getAsFile();
        console.log('... file[' + i + '].name = ' + file.name);
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
    }
  }
}




function build_and_send_para_json(pdf_file_name){
    $('.initial_options input').each(function(){
          if(this.type == 'text'){
              options[ this.id ] = this.value
          }else if(this.type == 'checkbox'){
              options[ this.id ] = this.checked
          }  
        })
    options.pdf_url = pdf_url
    options.pdf_file_name = encodeURI(pdf_file_name)
    options.custom_kw_url = url_from_input_file
    options.custom_kw_textarea = document.getElementById('custom_kw_textarea').value
    options.built_in_kw_textarea = document.getElementById('built_in_kw_textarea').value
    console.log(JSON.stringify(options))
    console.log('options',options)
    
    if(false){ // won't happen now
        var options_json = JSON.stringify( options )
        var options_json = encodeURI(JSON.stringify(options_json),"utf-8")
        var newWin = window.open('viewer_URL.html?'+options_json,'_blank')
        // open the window
        newWin.addEventListener("load", function() {
            newWin.document.title = pdf_file_name;
        });
        return
    }
}
// just manually pack those parameters
build_and_send_para_json(pdf_file_name)
// console.log(options)
// console.log(JSON.stringify(options))
// options['mutual_enrichment_calculation_input_phrase_number'] = 10
// options['also_search_nearby_sent_within_range'] = 2
// console.log(options)
// console.log(JSON.stringify(options))


// above codes comes from previous __Input_File.html


if(false){ // no longer going through this parameter pack/unpack process

    var afterUrl =  window.location.search.substring(1);

    afterUrl=decodeURI(afterUrl,"utf-8")

    // console.log('window.location.search',window.location.search)
    // console.log('afterUrl',afterUrl)
    var json_data = afterUrl.replace(/%22/g,'"')
    json_data = json_data.replace(/%20/g,' ')
    console.log('json_data',json_data)
    var options = JSON.parse(json_data)
    console.log('options',options)
    var options = JSON.parse(options)//second parse
    console.log('options',options)

}

var DEFAULT_URL = options['pdf_url']
console.log('DEFAULT_URL',DEFAULT_URL)
var custom_kw_textarea = options['custom_kw_textarea']
var custom_kw_url = options['custom_kw_url']
var kw_pair_cluster_wise = options['kw_pair_cluster_wise']
var no_summary = options['no_summary']
var include_non_dense_kw = options['include_non_dense_kw']
var multiple_sort_round = options['multiple_sort_round']
var kw_once = options['kw_once']
var every_kw_cluster = options['every_kw_cluster']
var positive_as_kw = options['positive_as_kw']
var negative_as_kw = options['negative_as_kw']
var verb_as_kw = options['verb_as_kw']
var outline_only = options['outline_only']
var n_gram_min = options['n_gram_min']
var n_gram_max = options['n_gram_max']
var reoccur_cutoff = options['reoccur_cutoff']
var max_n_of_n_gram_displayed = options['max_n_of_n_gram_displayed']
var kw_num_cutoff_ratio = options['kw_num_cutoff_ratio']
var use_kw_num_cutoff_ratio = options['use_kw_num_cutoff_ratio']
var kw_num_cutoff_value = options['kw_num_cutoff_value']
var use_kw_num_cutoff_value = options['use_kw_num_cutoff_value'] 
var join_strbuf_by_space = options['join_strbuf_by_space']
var max_display_unit_draw_num = options['max_display_unit_draw_num']
var max_display_unit_display_num = options['max_display_unit_display_num']
var customized_min_dense_discard_cutoff = options['customized_min_dense_discard_cutoff']
var customized_min_dense_show_cutoff = options['customized_min_dense_show_cutoff']
var use_div_draw_by_click = options['use_div_draw_by_click']
var only_require_unit_total_hits_above_calculated_min_dense_cutoff = options['only_require_unit_total_hits_above_calculated_min_dense_cutoff']
var filter_terms_with_min_dense_hit_cutoff = options['filter_terms_with_min_dense_hit_cutoff']
var use_kw = options['use_kw']
var use_kw_pair = options['use_kw_pair'] 
var use_n_gram = options['use_n_gram']
var hide_super_and_equal = options['hide_super_and_equal']
var hide_almost_supered = options['hide_almost_supered']
var show_overlap_info = options['show_overlap_info']
var one_sent_per_page_for_non_dense_sent = options['one_sent_per_page_for_non_dense_sent']    
var polyline_only = options['polyline_only']

var   DF   =   options['DF']
var NG_L   = options['NG_L']
var NG_S   = options['NG_S']
var NG_G   = options['NG_G']
var BC_L   = options['BC_L']
var BC_S   = options['BC_S']
var BC_G   = options['BC_G']
var   DF_r =   options['DF_r']
var NG_L_r = options['NG_L_r']
var NG_S_r = options['NG_S_r']
var NG_G_r = options['NG_G_r']
var BC_L_r = options['BC_L_r']
var BC_S_r = options['BC_S_r']
var BC_G_r = options['BC_G_r']
var use_set_interval = options['use_set_interval']
// var pdf_file_name = decodeURI(options['pdf_file_name']) //assigned in viewer_URL_template.html instead
var start_sent_idx = options['start_sent_idx']
var end_sent_idx = options['end_sent_idx']
// var textarea_div_parent
// $(()=>{
//   textarea_div_parent = $('div#textarea_div_parent')
//   textarea_div_parent.detach()
// })


var start_ = new Date();