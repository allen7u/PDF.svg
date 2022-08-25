function get_sents_list_by_section(sent_info_list, positions_as_page_num_list){
      //page spans to sents-with-global-idx list
    section_title_sents_list_list = []
    for (var i = 0; i < positions_as_page_num_list.length - 1; i++){
        var local_sents_str_list = []
        var local_sents_list = []
        var section_title = positions_as_page_num_list[i].accumulative_title
        for (var j = 0; j < sent_info_list.length; j++){
          if (sent_info_list[j].page_num >= positions_as_page_num_list[i].page_num &&
            sent_info_list[j].page_num < positions_as_page_num_list[i+1].page_num){
            local_sents_list.push(sent_info_list[j])
            local_sents_str_list.push(sent_info_list[j].sent)
            // section_title = positions_as_page_num_list[i].accumulative_title
          }
        }
        section_title_sents_list_list.push({section_title:section_title,
        sents:local_sents_list,
        text:local_sents_str_list.join(' ')
    })
    }
      //then deal with the last section
    var local_sents_str_list = []
    var local_sents_list = []
    var section_title = positions_as_page_num_list[positions_as_page_num_list.length-1].accumulative_title
    for (var j = 0; j < sent_info_list.length; j++){
      if (sent_info_list[j].page_num >= positions_as_page_num_list[positions_as_page_num_list.length-1].page_num &&
        sent_info_list[j].page_num <= doc_numPages){
        local_sents_list.push(sent_info_list[j])
        local_sents_str_list.push(sent_info_list[j].sent)
        // section_title = positions_as_page_num_list[positions_as_page_num_list.length-1].accumulative_title
      }
    }
    section_title_sents_list_list.push({section_title:section_title,
      sents:local_sents_list,
      text:local_sents_str_list.join(' ')
    })
    console.log('section_title_sents_list_list',section_title_sents_list_list)
    return section_title_sents_list_list
  }

function get_sents_list_of_each_page(sent_info_list, doc_numPages){
      section_title_sents_list_list = []
      for (var i = 1; i <= doc_numPages; i++){
          var local_sents_str_lemma_list = []
          var local_sents_str_list = []
          var local_sents_list = []
          var section_title = i
          for (var j = 0; j < sent_info_list.length; j++){
            if (sent_info_list[j].page_num == i){
              local_sents_list.push(sent_info_list[j])
              local_sents_str_list.push(sent_info_list[j].sent)
              local_sents_str_lemma_list.push(sent_info_list[j].sent_lemma)
              // section_title = positions_as_page_num_list[i].accumulative_title
            }
          }
          section_title_sents_list_list.push({section_title:section_title,
            sents:local_sents_list,
            text:local_sents_str_list.join(' '),
            text_lemma:local_sents_str_lemma_list.join(' ')
          })
      }
      console.log('section_title_sents_list_list',section_title_sents_list_list)
      return section_title_sents_list_list
    }