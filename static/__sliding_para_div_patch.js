












$('div#sliding_param_div').on('click',()=>{
    console.log('from sliding_param_div patch')
    if( $('div#sliding_param_div').css('left') == '0px'){
        //temporarily overwrite the :hover effect and move div to center
        $('div#sliding_param_div').css('left', '600px')
    }
})


$('div#sliding_param_div').on('contextmenu', function(e){
    e.preventDefault();
    console.log('from sliding_param_div patch')
    if($('div#sliding_param_div').css('left') == '600px'){
        //undo the overwrite and :hover effect take control
        $('div#sliding_param_div').css('left', '')
    }
})


