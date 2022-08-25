// $(document).keyup(function(e){
//   switch(e.keyCode){
//     case 219:
//       // var width = parseFloat($('#outerContainer').width())/parseFloat($('#outerContainer').parent().width()) - 0.05
//       // $('#outerContainer').width(width*100+'%')
//       console.log('PDFViewerApplication.pdfViewer.currentScale 1',PDFViewerApplication.pdfViewer.currentScale)
//       PDFViewerApplication.pdfViewer.currentScale = 2//0.95*PDFViewerApplication.pdfViewer.currentScale
//       console.log('PDFViewerApplication.pdfViewer.currentScale 2',PDFViewerApplication.pdfViewer.currentScale)
//     case 221:
//       // var width = parseFloat($('#outerContainer').width())/parseFloat($('#outerContainer').parent().width()) - 0.05
//       // $('#outerContainer').width(width*100+'%')
//       console.log('PDFViewerApplication.pdfViewer.currentScale 1',PDFViewerApplication.pdfViewer.currentScale)
//       PDFViewerApplication.pdfViewer.currentScale = 3//1.05*PDFViewerApplication.pdfViewer.currentScale
//       console.log('PDFViewerApplication.pdfViewer.currentScale 2',PDFViewerApplication.pdfViewer.currentScale)
//   }
// })


$(document).keydown(function(e){
  if(e.keyCode == 71 && highlight_disabled == 0){
    highlight_disabled = 1;
    console.log('highlight_disabled',highlight_disabled)
  }else if(e.keyCode == 71 && highlight_disabled == 1){
      highlight_disabled = 0;
      console.log('highlight_disabled',highlight_disabled)
  }else if(e.keyCode == 18 && alt_down == 0){
    alt_down = 1;
    $('#alt_status').html('alt_down:'+alt_down)
    console.log('alt_down:',alt_down)
  }else if(e.keyCode == 17 && ctrl_down == 0){
    ctrl_down = 1;
    $('#ctrl_status').html('ctrl_down:'+ctrl_down)
    console.log('ctrl_down')
    console.log(ctrl_down)
  }else if(e.keyCode == 81){
    $('#outerContainer').animate({left:'100%'})
    draw_titles()
    $('div#div_initial_display').css({height:70})
    e.data={div_to_append:'head_container'}
    draw_kw_from_textarea(e)
  }
})

function svg_events_binder({bind_by = 'div.kw_display_unit', for_titles = false, for_polyline = false} = {}){

  if(for_titles){
    $(bind_by).on('mouseover','svg.svg_titles',preview)
    $(bind_by).on('mouseout','svg.svg_titles',disappear)
    $(bind_by).on('click','svg.svg_titles',rect_clicked)
    $(bind_by).on('click','svg.svg_titles',draw_selected_sents)
    return
  }  

  if(for_polyline){
    $(bind_by).on('click','svg.polyline_svg_kw',draw_kw_from_polyline)
    $(bind_by).on('contextmenu','svg.polyline_svg_kw',()=>false)
    $(bind_by).on('contextmenu','svg.polyline_svg_kw',draw_kw_from_polyline)
    // $(bind_by).on('mousemove','svg.polyline_svg_kw',mousemove_polyline)
    // $(bind_by).on('mouseup','svg.polyline_svg_kw',mask_start)
    // $(bind_by).on('mouseup','svg.polyline_svg_kw',mask_end)
  }
  

  $(bind_by).on('mouseover','svg.svg_kw_hit',spread)
  $(bind_by).on('mouseleave','svg.svg_kw',shrink)
  $(bind_by).on('mouseover','svg.svg_kw_hit',preview)
  $(bind_by).on('mouseout','svg.svg_kw_hit',disappear)
  $(bind_by).on('click','svg.svg_kw_hit',rect_clicked)
  $(bind_by).on('click','svg.svg_kw_hit',draw_selected_sents)

  $(bind_by).on('click','text.for_show_summary',summary_display)
  $(bind_by).on('mouseover','text.for_show_summary',summary_display)
  $(bind_by).on('mouseout','text.for_show_summary',summary_display)

  $(bind_by).on('mousedown','span.enriched_word',draw_kw_from_summary)
  // $(bind_by).on('mousedown','p.individual_summary_term',draw_kw_from_summary)
  $(bind_by).on('contextmenu','span.enriched_word',()=>false)

  $(bind_by).on('mousedown','tspan.individual_summary_term',draw_kw_from_summary)
  $(bind_by).on('mousedown','p.individual_summary_term',draw_kw_from_summary)
  $(bind_by).on('contextmenu','tspan.individual_summary_term',()=>false)

  $(bind_by).on('click','text.summary_type',change_highlight_summary_type)  


}

function svg_events_binder_ori(){
  // $('tspan.individual_summary_term').unbind('click',draw_kw_from_summary)
  // $('tspan.individual_summary_term').bind('click',draw_kw_from_summary)
  
  $('tspan.individual_summary_term').off( "contextmenu" )
  $('tspan.individual_summary_term').on('contextmenu',()=>false)

  $('tspan.individual_summary_term').unbind('mousedown',draw_kw_from_summary)
  $('tspan.individual_summary_term').bind('mousedown',draw_kw_from_summary)

  $('text.for_show_summary').unbind('click',summary_display)
  $('text.for_show_summary').bind(  'click',summary_display)
  $('text.for_show_summary').unbind('mouseover',summary_display)
  $('text.for_show_summary').bind(  'mouseover',summary_display)
  $('text.for_show_summary').unbind('mouseout',summary_display)
  $('text.for_show_summary').bind(  'mouseout',summary_display)

  $('text.summary_type').unbind('click',change_highlight_summary_type)
  $('text.summary_type').bind(  'click',change_highlight_summary_type)
  
  $('svg.svg_kw').unbind('mouseleave',shrink)
  $('svg.svg_kw').bind(  'mouseleave',shrink)

  // $('rect[id^=cvr]').each(function(){
  $('svg.svg_kw_hit').each(function(){
        $(this).unbind('mouseover',spread);
        $(this).unbind('mouseover',preview);
        $(this).unbind('mouseout',disappear);
        $(this).unbind('click',rect_clicked);
        $(this).unbind('click',draw_selected_sents);

        $(this).bind('mouseover',spread);
        $(this).bind('mouseover',preview);
        $(this).bind('mouseout',disappear);
        $(this).bind('click',rect_clicked);
        $(this).bind('click',draw_selected_sents);
  })

  $('svg.svg_titles').each(function(){
        // $(this).unbind('mouseover',spread);
        $(this).unbind('mouseover',preview);
        $(this).unbind('mouseout',disappear);
        $(this).unbind('click',rect_clicked);
        $(this).unbind('click',draw_selected_sents);

        // $(this).bind('mouseover',spread);
        $(this).bind('mouseover',preview);
        $(this).bind('mouseout',disappear);
        $(this).bind('click',rect_clicked);
        $(this).bind('click',draw_selected_sents);
  })
}



$(document).keyup(function(e) {
    // console.log('keyuping:',e.keyCode)
    if (e.keyCode == 107) {
      if (margin_bottom_original == -1){
        console.log('margin_bottom_original == -1')
      }
        if ($('.sentPreviews').length > 0){
          console.log("$('.sentPreviews').length > 0")
        }
      if (margin_bottom_original == -1 && $('.sentPreviews').length > 0){
        margin_bottom_original = parseInt($('.sentPreviews').css('margin-bottom'))
        console.log("+ keyup get margin original as:",margin_bottom_original)
      }
      var margin_top = parseInt($('.sentPreviews').css('margin-bottom'))
      $('.sentPreviews').css('margin-bottom',margin_top + 20)
    }
    if (e.keyCode == 109) {
      if (margin_bottom_original == -1 && $('.sentPreviews').length > 0){
        margin_bottom_original = parseInt($('.sentPreviews').css('margin-bottom'))
        console.log("- keyup get margin original as:",margin_bottom_original)
      }
      var margin_top = parseInt($('.sentPreviews').css('margin-bottom'))
      $('.sentPreviews').css('margin-bottom',margin_top - 20)
    }
    if (e.keyCode == 96) {
      if (margin_bottom_original == -1 && $('.sentPreviews').length > 0){
        margin_bottom_original = parseInt($('.sentPreviews').css('margin-bottom'))
      }
      else if(margin_bottom_original != -1 && $('.sentPreviews').length > 0){
        console.log("0 keyup assigning margin original as:",margin_bottom_original)
        $('.sentPreviews').css('margin-bottom',margin_bottom_original)
      }
    }
    // if (e.keyCode == 27 && zooming == 1) {
    //   top_thing.remove();
    // }
    if (e.keyCode == 27 && pdfIn == 0) {
      previewing = 0;
      view.remove();
      // view.empty();
      // view.hide();
      viewing = 0;
    }
    if (e.keyCode == 27 && pdfIn == 1) {
      var oc = $('#outerContainer');
      oc.animate({left:'100%'}).removeClass('in');
      pdfIn = 0;
    }
    // if (e.keyCode == 70 && pdfIn == 0) {
    //   var oc = $('#outerContainer');
    //   oc.animate({left:'15%'}).addClass('in');
    //   pdfIn = 1;
    // }
    if (e.keyCode == searchSwitcher && useExtendedTerms == 1 && current_ext_unext_terms != null){
      // console.log('e.keyCode == searchSwitcher && useExtendedTerms == 1 && current_ext_unext_terms != null')
      window.PDFViewerApplication.page = current_page
      $('#findInput')[0].value = current_ext_unext_terms;
      document.getElementById('findHighlightAll').checked=false
      document.getElementById('findHighlightAll').click()
      useExtendedTerms = 0
      useUnextendedTerms = 0
      useExtUnextendedTerms = 1
    }
    else if (e.keyCode == searchSwitcher && useExtUnextendedTerms == 1 && current_unextended_terms != null){
      // console.log('e.keyCode == searchSwitcher && useExtUnextendedTerms == 1 && current_unextended_terms != null')
      window.PDFViewerApplication.page = current_page
      $('#findInput')[0].value = current_unextended_terms;
      document.getElementById('findHighlightAll').checked=false
      document.getElementById('findHighlightAll').click()
      useExtendedTerms = 0
      useUnxtendedTerms = 1
      useExtUnextendedTerms = 0
    }
    else if (e.keyCode == searchSwitcher && useUnxtendedTerms == 1 && current_extended_terms != null){
      // console.log('e.keyCode == searchSwitcher && useUnxtendedTerms == 1 && current_extended_terms != null')
      window.PDFViewerApplication.page = current_page
      $('#findInput')[0].value = current_extended_terms;
      document.getElementById('findHighlightAll').checked=false
      document.getElementById('findHighlightAll').click()
      useExtendedTerms = 1
      useUnxtendedTerms = 0
      useExtUnextendedTerms = 0
    }
    if (e.keyCode == 17 && ctrl_down == 1){
      ctrl_down = 0;
       $('#ctrl_status').html('ctrl_down:'+ctrl_down)
      console.log('ctrl up')
      console.log(ctrl_down)
    }
    if (e.keyCode == 18 && alt_down == 1){
      alt_down = 0;
      $('#alt_status').html('alt_down:'+alt_down)
      console.log('alt_down',alt_down)
    }    
  }
);


// $(document).keyup(function(e){
//   switch(e.keyCode){
//     case 49:
//       current_color_coding_kw_type = 'DF'
//       console.log('DFing')
//       break
//     case 50:
//       current_color_coding_kw_type = 'n_grams_from_dense_block_sents'
//       console.log('BCing')
//       break
//     case 51:
//       current_color_coding_kw_type = 'n_grams_from_all_hit_sents'
//       console.log('ASing')
//       break
//     case 52:
//       current_color_coding_kw_type = 'tfidf_with_dense_against_brown_corpus'
//       console.log('HSing')
//       break
//     case 53:
//       current_color_coding_kw_type = 'tfidf_with_all_hit_sents_against_brown_corpus'
//       console.log('APing')
//       break
//     // case 54:
//     //   current_color_coding_kw_type = 'HSAS'
//     //   console.log('HSASing')
//     //   break
//   }
// })