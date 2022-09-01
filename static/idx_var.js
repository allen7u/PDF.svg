// var X_MAX = 960
// var X_MAX = 1550
// var X_MAX = 1220 //temp for System wide 125% enlargement
var X_MAX = 900 //temp for iframe or 150% enlargement
var x_mask_zero_width = undefined
// var para = {x_max:1600,font_size_ten:10} #2021-6-2
var para = {
    x_max:X_MAX,
    font_size_ten:10
}
console.log(window.navigator.userAgent.match(/Chrome\/(\d+)\./))
if( + window.navigator.userAgent.match(/Chrome\/(\d+)\./)[1] > 49){
    console.log('userAgent: Chrome49+')
    para.font_size_ten = para.font_size_ten * 1.2
}
var data = {}
data.diagonal_kw_sum_polylined = {}
data.worker_working_order_log = []
data.worker_returned_time_log_list = [new Date().getTime()]
data.worker_started_lag_log_list = []
var raw = {}
var csw
raw['chinese_nonstop_run_dict'] = {}
raw['lang_type_dict'] = {}
raw['english_nonstop_lemma_words_list_dict'] = {}
var temp = {}
var log = {}
log['merger'] = []
// temp['masked_start_sent_idx'] = undefined
// temp['masked_end_sent_idx'] = undefined
temp['masked_sent_idx_list'] = []
var highlight_disabled = 1
var polyline_svg_x
var global_counter = 1
var serial_num = 1
var spread_factor// = 4
var preview_range_base// = 20
var sent_num_per_spread_span = 6
var sent_num_per_spread_span_no_less_than = 4
var margin_bottom_original = -1
var previewDownOffset = 10
var current_page
var searchSwitcher = 192
var useExtendedTerms = 1
var useUnextendedTerms
var useExtUnextendedTerms
var current_ext_unext_terms
var current_extended_terms
var current_unextended_terms
var pdfIn = 0
var sidebarToggleClicked=false                        
// var hasFitPageWidth=false 
var first_pdf_in = true                       
var previewing = 0
var pinned_id
var viewing
var backup_group
var current_group
var view;
var clone1
var clone2
var spreaded = 0
var original_kw_group = new Array;
var kw_svg_right_shift = 50
var rect_green_id = ''
var myVar
var alt_down = 0
var ctrl_down = 0
var sent_start_id = ''
var sent_stop_id = ''
var sents_list = []
var tfidf_list = []
var draw
var sents_rich_list = []
// var top_thing
// var zooming
var kw_hits_dict = {};
// var view_sents_list = []
var stopword_list = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"]
var lemmatizer = new Lemmatizer()
var view_df_num = 3
var diagonal_dense_block_summary_dict = {}
var summary_dict_with_n_grams_from_all_hit_sents = {}
var summary_dict_with_tfidf_from_all_hit_sents_against_brown_corpus = {}
var rgb_array = ['rgb(121,152,243)','rgb(156,121,243)','rgb(243,121,223)','rgb(0,128,0)','rgb(128,128,0)',
                 'rgb(121,152,243)','rgb(156,121,243)','rgb(243,121,223)','rgb(0,128,0)','rgb(128,128,0)']
// var rgb_array = ['rgb(128,128,0)','rgb(121,152,243)','rgb(156,121,243)','rgb(243,121,223)','rgb(0,128,0)',   'rgb(128,128,0)','rgb(121,152,243)','rgb(156,121,243)','rgb(243,121,223)','rgb(0,128,0)']
var tfidf_customized_global_list = []

// if(NG_S  ){var current_color_coding_kw_type = 'n_grams_from_dense_block_spanned_sents'}
// else if(NG_S_r){var current_color_coding_kw_type = 'n_grams_from_dense_block_spanned_sents'}
// else if(NG_L  ){var current_color_coding_kw_type = 'n_grams_from_dense_block_sents'}
// else if(NG_L_r){var current_color_coding_kw_type = 'n_grams_from_dense_block_sents'}
// else if(NG_G  ){var current_color_coding_kw_type = 'n_grams_from_all_hit_sents'}
// else if(NG_G_r){var current_color_coding_kw_type = 'n_grams_from_all_hit_sents'}
// else if(BC_S  ){var current_color_coding_kw_type = 'tfidf_with_dense_block_spanned_sents_against_brown_corpus'}
// else if(BC_S_r){var current_color_coding_kw_type = 'tfidf_with_dense_block_spanned_sents_against_brown_corpus'}
// else if(BC_L  ){var current_color_coding_kw_type = 'tfidf_with_dense_against_brown_corpus'}
// else if(BC_L_r){var current_color_coding_kw_type = 'tfidf_with_dense_against_brown_corpus'}
// else if(BC_G  ){var current_color_coding_kw_type = 'tfidf_with_all_hit_sents_against_brown_corpus'}
// else if(BC_G_r){var current_color_coding_kw_type = 'tfidf_with_all_hit_sents_against_brown_corpus'}
// else if(  DF  ){var current_color_coding_kw_type = 'DF'}
// else if(  DF_r){var current_color_coding_kw_type = 'DF'}


// if(custom_kw_textarea||positive_as_kw||negative_as_kw||verb_as_kw||custom_kw_url.length>0){
//     var current_color_coding_kw_type = 'HSAS'
// }else{
//     var current_color_coding_kw_type = 'DF'
// }