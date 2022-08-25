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

  
function kw_cluster_wise_by_merge(kw_hits_obj_list,no_merge=false){
    //kw_hits_obj_list.push({kw:k, hits:kw_sent_global_idx_dict[k], query_type:query_type, n:kw_sent_global_idx_dict[k].n})
    var each_kw_cluster_wise_list = []
    kw_hits_obj_list.map(a=>{
        // var nest_list = a.hits.map(b=>[b])
        if(no_merge){
            var nest_list_merged = [a.hits]
        }else{
            var nest_list_merged = merger(a.hits)
        }  
        // var nest_list_merged = merger(nest_list)
        nest_list_merged.map(c=>{
            if( no_merge == true ){ 
                c.fake = true 
            }else{
                c.fake = false 
            }
            // var unit = [a.kw,'a[1]_from_kw_cluster_wise_by_merge',c[0],c,'a[4]_from_kw_cluster_wise_by_merge','round_idx_from_kw_cluster_wise_by_merge','a[6]_from_kw_cluster_wise_by_merge']
            var unit = {}
            unit.query_type = a.query_type
            unit.super = a.super
            unit.equal = a.equal
            unit.kw = a.kw
            unit.hits = a.hits
            unit.dense_hits = c
            unit.no_merge = no_merge
            unit.round = 'round_idx_from_kw_cluster_wise_by_merge'
            each_kw_cluster_wise_list.push(unit)
        })
    })
    return each_kw_cluster_wise_list
}

function n_gram_quad_gen_from_list(kw_hits_obj_list,no_merge=false){
    var n_gram_quad_like_list = []
    for(var e of kw_hits_obj_list){      
        if(no_merge){
            var clusters_list = [e.hits]
        }else{
            var clusters_list = merger(e.hits)
        } 
        for(var cluster of clusters_list){
            if( no_merge == true ){ 
                cluster.fake = true 
            }else{
                cluster.fake = false 
            }
            // var unit = [e.kw,'clusters_flat',cluster[0],cluster,e.hits,'n_gram_round']
            var unit = {}
            unit.query_type = e.query_type
            unit.super = e.super
            unit.equal = e.equal
            unit.kw = e.kw
            unit.hits = e.hits
            unit.dense_hits = cluster
            unit.no_merge = no_merge
            unit.n = e.n
            unit.round = 'n_gram_round'
            n_gram_quad_like_list.push(unit)
        }
    }
    return n_gram_quad_like_list
}

// function n_gram_quad_gen(kw_hit_dict){
//     var n_gram_quad_like_list = []
//     for(var kw in kw_hit_dict){
//         for(var sent_idx of kw_hit_dict[kw]){
//             n_gram_quad_like_list.push([kw,'clusters_flat',sent_idx,[sent_idx],kw_hit_dict[kw],'n_gram_round'])
//         }
//     }
//     return n_gram_quad_like_list
// }

function merger(list,max_idx_diff=6){
    // log['merger'] = []
    if(typeof list[0] != 'object'){
        var nest_list = list.map(b=>[b])
    }else{
        var nest_list = list
    }
    if(nest_list.length == 1){
        return nest_list
    }
    // console.log('nest_list',nest_list)
    var trapped = false
    for(i=0; i<nest_list.length; i++){
        // console.log('nest_list[i],nest_list[i+1]',nest_list[i],nest_list[i+1])
        // console.log('nest_list[i+1][0],nest_list[i][nest_list[i].length-1]',nest_list[i+1][0],nest_list[i][nest_list[i].length-1])
        if(i+1<=nest_list.length-1){
            if(nest_list[i+1][0]-nest_list[i][nest_list[i].length-1]<=max_idx_diff){
                // console.log(nest_list[i],nest_list[i+1])
                var fuse = nest_list[i].concat(nest_list[i+1])
                // console.log('fuse',fuse)
                var nest_list_2 = nest_list.slice(0,i).concat([fuse]).concat(nest_list.slice(i+2,nest_list.length))
                // console.log('nest_list_2',nest_list_2)
                trapped = true
                return merger(nest_list_2)
            }
        }
        
    }
    if(trapped == false){
        for(var i in nest_list){
            log['merger'][i] = []
            var interval_list = []
            if(nest_list[i].length > 1){
                // console.log(nest_list[i])
                for(var j in nest_list[i]){
                    j = +j
                    // console.log(j)
                    // console.log(nest_list[i].length)
                    // console.log(j+1)
                    // console.log(+j+1)
                    // console.log(j+1 < nest_list[i].length)
                    if(j+1 < nest_list[i].length){
                        // console.log(j)
                        // console.log(nest_list[i][+j+1])
                        // console.log(nest_list[i][j])
                        // console.log(nest_list[i][j+1] - nest_list[i][j])
                        interval_list.push(nest_list[i][j+1] - nest_list[i][j])
                        log['merger'][i].push(nest_list[i][j+1] - nest_list[i][j])
                    }
                }
                nest_list[i].interval_list = interval_list
                var max_gap = _.max(interval_list)
                nest_list[i].max_gap = max_gap
                log['merger'][i].max_gap = max_gap
                log['merger'][i].std = math.std(nest_list[i])
                nest_list[i].std = math.round( math.std(nest_list[i]), 2 )
            } 
            
        }
        return nest_list
    }
}

function kw_pair_cluster_wise_by_merge(kw_pair_quad_like_list,max_idx_diff=6){
    var each_kw_pair_wise_list = []
    kw_pair_quad_like_list.map(a=>{
        var nest_list = a[6].map(b=>[b])
        var nest_list_merged = merger(nest_list,max_idx_diff)
        nest_list_merged.map(c=>{
            var unit = [a[0],a[1],c[0],c,a[4],a[5],a[6]]
            unit.query_type = a.query_type
            unit.super = a.super
            unit.equal = a.equal
            unit.kw = a.kw
            unit.hits = a.hits
            unit.dense_hits = c
            each_kw_pair_wise_list.push(unit)
        })
    })
    return each_kw_pair_wise_list
}

//obsoleted
function each_kw_pair_wise(kw_pair_quad_like_list){
    var each_kw_pair_wise_list = []
    kw_pair_quad_like_list.map(a=>{
        console.log('a[0]',a[0])
        console.log('a[4]',a[6])
        a[6].map(b=>{
            // [a[0]+' '+a[1],'clusters_flat',Math.round(a[3]),'dense_block','v','round_idx',a[4]]
            each_kw_pair_wise_list.push([a[0],a[1],b,a[3],a[4],a[5],a[6]])
        })
    })
    return each_kw_pair_wise_list
}

function truncated_kw_filter(kw_list){
    var kw_list_plain = []
    for (var i_kw = 0; i_kw< kw_list.length; i_kw++){
    if(typeof kw_list[i_kw] == 'string'){
        var kw = kw_list[i_kw]
      }else{
        var kw = kw_list[i_kw][0]
      }
    kw_list_plain.push(kw) 
    }

    kw_full_list = []
    kw_list_plain = kw_list_plain.sort()
    for (var i_kw = 0; i_kw < kw_list_plain.length; i_kw++) {
        var kw = kw_list_plain[i_kw]
        if(kw_full_list.length == 0){
            kw_full_list.push(kw)
        }else{
            var last_kw_of_kw_full_list = kw_full_list[kw_full_list.length - 1]
            if( kw.startsWith( last_kw_of_kw_full_list ) ){
                kw_full_list.pop()
                kw_full_list.push(kw)
            }else{
                kw_full_list.push(kw)
            }
        }
    }

    var kw_list_filtered = []
    for (var i_kw = 0; i_kw< kw_list.length; i_kw++){
        if(typeof kw_list[i_kw] == 'string'){
            var kw = kw_list[i_kw]
          }else{
            var kw = kw_list[i_kw][0]
          }
        if(kw_full_list.includes(kw)){
            kw_list_filtered.push(kw_list[i_kw])
        }
    }
    return kw_list_filtered
}

function cluster_gen(l,max_idx_diff,min_occurance) {

    clusters_nest =[];

    tmp=[];
    for (var i=0; i<l.length; i++){
    // for (i in range(len(l))) {
        if (l.length == 1) {

        } else if (i == 0) {
            if (l[i+1]-l[i] >=1 && l[i+1]-l[i]<= max_idx_diff) {
                tmp.push(l[i]);
            }
        } else if (i == l.length-1) {
            if (l[i] - l[i-1] >= 1 && l[i] - l[i-1] <=  max_idx_diff) {
                tmp.push(l[i]);
                if (tmp.length >= min_occurance) {
                    clusters_nest.push(tmp);
//                    print(tmp)
                    tmp = [];
                }
            }
        }
        else if (l[i+1]-l[i] >=1 && l[i+1]-l[i]<= max_idx_diff) {
            tmp.push(l[i]);
        } else if (l[i+1]-l[i] >=1 && l[i+1]-l[i] > max_idx_diff) {
            if (l[i] - l[i-1] >= 1 && l[i] - l[i-1] <= max_idx_diff) {
                tmp.push(l[i]);
                if (tmp.length >= min_occurance) {
                    clusters_nest.push(tmp);
                    // console.log('collecting tmp',tmp)
                    tmp = [];
                } else {
                    tmp = [];
                }
            }
        }
    }
//    print(clusters_nest)
    // clusters_flat = [i for sub in clusters_nest for i in sub]
    clusters_flat = []
    clusters_nest.forEach(function(i){
        // console.log('i',i)
        i.forEach(function(j){
            clusters_flat.push(j)
        })
    })
    // console.log('clusters_flat',clusters_flat)

    // clusters_nest.sort(key=lambda x:len(x),reverse = true);
    clusters_nest.sort(function(a,b){return b.length - a.length})

    try {
        dense_start = clusters_nest[0][0];
        dense_block = clusters_nest[0];
    } catch ( IndexError) {
        dense_start = null;
        dense_block = null;
        }
    // console.log("clusters_flat, clusters_nest, dense_start, dense_block",clusters_flat, clusters_nest, dense_start, dense_block)
    return [clusters_flat, clusters_nest, dense_start, dense_block];
    }

function sorter(kw_hits_obj_list,max_idx_diff,min_occurance,query_type,round_idx = 1) {
    console.log('from sorter',kw_hits_obj_list)
    local_max_list = []
    for (var i of kw_hits_obj_list){
        local_max_list.push(Math.max.apply(null,i.hits));
    }
    v_idx_max = Math.max.apply(null,local_max_list)//but won't be used for now

    cluster_ls = [];
    cluster_lsls = [];
    quad = [];

    var clusters_flat, clusters_nest, dense_idx, dense_block
    for (var k of kw_hits_obj_list) {
        var v = k.hits
        res = cluster_gen(v,max_idx_diff,min_occurance);
        clusters_flat = res[0], 
        clusters_nest = res[1], 
        dense_idx = res[2], 
        dense_block = res[3];
        // console.log('clusters_flat, clusters_nest, dense_idx, dense_block',clusters_flat, clusters_nest, dense_idx, dense_block)
    //    print(clusters_flat)
    //    print(v,clusters_flat)
        cluster_ls.push(clusters_flat);
        cluster_lsls.push(clusters_nest);
        if (dense_idx == null) {
            dense_idx = NaN;
            dense_block = [NaN];
            // dense_idx = v_idx_max;
            // dense_block = [v_idx_max];
        }
        // console.log(k,clusters_flat,dense_idx,dense_block)
        var unit = [k.kw,clusters_flat,dense_idx,dense_block,v,round_idx]
        unit.query_type = k.query_type
        unit.kw = k.kw
        unit.hits = v
        unit.dense_hits = dense_block
        quad.push(unit);
    }

    quad_non_NaN = []
    quad_NaN_only = []
    for (var i=0; i<quad.length; i++){
        if(!isNaN(quad[i][2])){
            quad_non_NaN.push(quad[i])
        }else{
            // console.log('quad_NaN_only pushing',quad[i])
            quad_NaN_only.push(quad[i])
        }
    }

    quad_non_NaN.sort(function(a,b){
        // console.log('a[2] b[2]',a[2],b[2])
        // if(isNaN(a[2]) && isNaN(b[2])){
        //     // console.log('a[2]==NaN && b[2]==NaN',a[2],b[2])
        //     return 0
        // }else if(a[2]>0 && isNaN(b[2])){
        //     // console.log('a[2]>0 && b[2]==NaN',a[2],b[2])
        //     return -1
        // }else if(isNaN(a[2]) && b[2]>0){
        //     // console.log('a[2]==NaN && b[2]>0',a[2],b[2])
        //     return 1
        // }else 
        if(a[2]-b[2]>0){
            // console.log('a[2]-b[2]>0',a[2],b[2])
            return 1
        }else if(a[2]-b[2]<0){
            // console.log('a[2]-b[2]<=0',a[2],b[2])
            return -1
        }else if(a[2]-b[2]==0){
            return 0
        }
    });

    return [quad,quad_non_NaN,quad_NaN_only]
}

// d = {'a':[1,2,7,8,9,10,15],'b':[11,13,17,19,20,22,23,30]}
// r = sorter(d)
// console.log(r)

// function kw_pair_cluster_wise(kw_pair_quad_like_list,max_idx_diff=6,min_occurance=0){
//     var each_kw_pair_wise_list = []
//     kw_pair_quad_like_list.map(a=>{
//         console.log('a[0]',a[0])
//         console.log('a[4]',a[6])
//         // for(i=0; i<a[6].length; i++){

//         // }

//         clusters_nest =[];

//         tmp=[];
//         var l = a[6]
//         for (var i=0; i<l.length; i++){
//         // for (i in range(len(l))) {
//             if (l.length == 1) {
//                 clusters_nest.push(l);
//                 each_kw_pair_wise_list.push([a[0],a[1],l[0],tmp,a[4],a[5],a[6]])
//             } else if (i == 0) {
//                 if (l[i+1]-l[i] >=1 && l[i+1]-l[i]<= max_idx_diff) {
//                     tmp.push(l[i]);
//                 }
//             } else if (i == l.length-1) {
//                 if (l[i] - l[i-1] >= 1 && l[i] - l[i-1] <=  max_idx_diff) {
//                     tmp.push(l[i]);
//                     if (tmp.length >= min_occurance) {
//                         clusters_nest.push(tmp);
//                         each_kw_pair_wise_list.push([a[0],a[1],tmp[0],tmp,a[4],a[5],a[6]])
//     //                    print(tmp)
//                         tmp = [];
//                     }
//                 }else{
//                     clusters_nest.push(tmp);
//                     each_kw_pair_wise_list.push([a[0],a[1],tmp[0],tmp,a[4],a[5],a[6]])
//                     tmp = [];
//                     clusters_nest.push([l[i]]);
//                     each_kw_pair_wise_list.push([a[0],a[1],[l[i]][0],[l[i]],a[4],a[5],a[6]])
//                 }
//             }
//             else if (l[i+1]-l[i] >=1 && l[i+1]-l[i]<= max_idx_diff) {
//                 tmp.push(l[i]);
//             } else if (l[i+1]-l[i] >=1 && l[i+1]-l[i] > max_idx_diff) {
//                 if (l[i] - l[i-1] >= 1 && l[i] - l[i-1] <= max_idx_diff) {
//                     tmp.push(l[i]);
//                     if (tmp.length >= min_occurance) {
//                         clusters_nest.push(tmp);
//                         each_kw_pair_wise_list.push([a[0],a[1],tmp[0],tmp,a[4],a[5],a[6]])
//                         // console.log('collecting tmp',tmp)
//                         tmp = [];
//                     } else {
//                         tmp = [];
//                     }
//                 }else if(l[i] - l[i-1] >= 1 && l[i] - l[i-1] > max_idx_diff){
//                     clusters_nest.push(tmp);
//                     each_kw_pair_wise_list.push([a[0],a[1],tmp[0],tmp,a[4],a[5],a[6]])
//                     tmp = [];
//                     clusters_nest.push([l[i]]);
//                     each_kw_pair_wise_list.push([a[0],a[1],[l[i]][0],[l[i]],a[4],a[5],a[6]])
//                 }
//             }
//         }

//     })
//     return each_kw_pair_wise_list
// }