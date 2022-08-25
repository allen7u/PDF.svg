var flat_outline_array = [];
function get_level_from_nested_outline(ls,depth,level = 0,ancestors = ''){
  // console.log('receive ancestor as',ancestors)
  var lastest_node = ['',''];
  ls.forEach(function(a){
    lastest_node.shift();
    lastest_node.push(a);
    if (Array.isArray(a)){
      // console.log('passing ancestor as',ancestors+'_'+lastest_node[0])
      get_level_from_nested_outline(a,depth,level+1,ancestors+'_'+lastest_node[0].title)
    }else if (level == depth){
      // console.log(a,'in level',level,'with ancestor',ancestors)
      a.accumulative_title = ancestors+'_'+a.title;
      flat_outline_array.push(a)
    }
  })
}

// console.log(flat_outline_array)