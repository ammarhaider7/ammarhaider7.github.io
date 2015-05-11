/* Space IDs
1501 - UK Credit Expert - Prod
1503 - UK Credit Expert - Stage
7469 - UK Experian Corp - Prod
7709 - UK Experian Corp - Stage
*/

//Run ajax on Dom ready
$(function() {
    
	$('#compareTags').click(function() {
	
	var lArr = o.l.tags,
		rArr = o.r.tags;
	
	o.compareArrs(lArr,rArr,o.compareAttr);
	
	$('tr.tag').not('.match-found').css('background-color','rgb(129, 113, 32)');
	
	var c = $('.highlight').length/2;
	
	alert(c + ' inconsistencies found');
		
	});

    setTimeout(function() {
        $('.login').fadeIn('slow');
        loginVisible = true;
    }, 200);

    $('.login form').submit(function(e) {
        
        var username = $('.login #username').val();
        var password = $('.login #password').val();
        o.authAjax(username, password);
        e.preventDefault();
    });

    //Run deployment ajax when user clicks get code
    $('#getCode').click(function() {
		
			var SIDl = $('.main-left option:selected').attr('value'),
				auth = o.auth.access_token,
				SIDr = $('.main-right option:selected').attr('value'),
				lTable = '#TagDetails',
				rTable = '#TagsRight',
				lDiv = '.TagCode',
				rDiv = '.TagCodeRight',
				r = 'r',
				l = 'l';

			if(SIDl != 0) { 
				$(lTable).html('<tr><th>Tag Name</th><th>Attributes</th></tr>');
				//Ajax
				o.tagPull(auth,SIDl,lTable,lDiv,l) 
				}
			if(SIDr != 0) { 
				$(rTable).html('<tr><th>Tag Name</th><th>Attributes</th></tr>');
				//Ajax
				o.tagPull(auth,SIDr,rTable,rDiv,r) 
				}
    });
});

var o = {

    loggedIn: false,
    table: false,
	r: { table: false },
	l: { table: false },
    highlight: function(id, attr) {
				
					 var hue = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
							 
					 $('table tr.' + id + ' .' + attr).css('background-color', hue).addClass('highlight');
				},
	compareAttr: function(x,y) {
						
					metadata = [
						'executionTime',
						'lastAction',
						//'modifyDate',
						'conditionIds',
						'dependentDeployments',
						'comments',
						'status'
					];
					
					for (var i = 0; i < metadata.length; i++) {
						
						 if(x[metadata[i]] !== y[metadata[i]]) {
							 
							 var id = x.id,
								 attr = metadata[i];
							 	o.highlight(id,attr);
								 					 
						 }
					}		
				},
	compareArrs: function(arr1,arr2,fn) {
					for (var i = 0; i < arr1.length; i++) {
						for (var j = 0; j < arr2.length; j++) {
							if (arr1[i].id === arr2[j].id) {
								 fn(arr1[i],arr2[j]);
								 $('tr.' + arr1[i].id).addClass('match-found');
								}
							}
						}
				},
    //CORS using jQuery
    authAjax: function(username,password) {
            $.ajax({
                  type: 'POST',
                  url: '//manage-api.ensighten.com/auth/token',
                  data: 'grant_type=password',
                  contentType: 'application/x-www-form-urlencoded',
                  headers: {
                      "Authorization": "Basic " + btoa("experian" + ":" + username + ":" + password)
                  },
                  success: function(response) {
                    // Here's where you handle a successful response.
                      o.auth = response;
                      o.loggedIn = true;
                      $('body').css({'background-color': '#333', color: 'rgba(200, 200, 200, 1)'});
                      $('.login').remove();
                      $('#main').show();
                      //Set a cookie lasting 60 mins so the user doesn't get logged out
                      
                  }, 
                  error: function() {
                      //console.log('Didn\'t work');
                      alert("Log in failed");

                  }
                })
            },

    //Get some deployments
    tagPull: function(token, SID, selector, div, r_l) {
                $.ajax({
                      type: 'GET',
                      url: '//manage-api.ensighten.com/manage/deployments?spaceId=' + SID + '&status=enabled_published',
                      contentType: 'application/x-www-form-urlencoded',
                      headers: {
                          "Authorization": "Bearer " + token,
                          "Accept": "application/json"
                      },
                      success: function(response) {
                                  o[r_l].tags = response;
						  		  o[r_l].tags.forEach(function(el) {
								    var name = el.name,
                                        exec = el.executionTime,
                                        lastAct = el.lastAction,
                                        lastMod = el.modifyDate,
                                        conditions = el.conditionIds,
                                        comments = el.comments,
										id = el.id,
										status = el.status,
                                        code = el.code;
									    el.conditionIds = el.conditionIds.join(','),
										el.dependentDeployments = (function() {
																	var str = '',
																		delimit;
																		for(var i = 0; i<el.dependentDeployments.length; i++) {
																			if(el.dependentDeployments.length > 1) {
																					delimit = ',';
																			} else {
																					delimit = '';
																			}
																			str += el.dependentDeployments[i].deploymentId + delimit;
																		}
																	return str;
																	})();
								   var dependencies = el.dependentDeployments;
									  
										$(selector).append('<tr class="tag ' + id + '"><td>' + name + '</td><td><table><tr class="executionTime"><td><u>Execution time: </u></td><td class="exec">' + exec + '</td></tr><tr class="lastAction"><td><u>Last action: </u></td><td class="last-act">' + lastAct + '</td></tr><tr class="modifyDate"><td><u>Last modified: </u></td><td class="last-mod">' + lastMod + '</td></tr><tr class="conditionIds"><td><u>Conditions: </u></td><td class="cond">' + conditions + '</td></tr><tr class="dependentDeployments"><td><u>Dependencies: </u></td><td class="depend">' + dependencies + '</td></tr><tr class="comments"><td><u>Comments: </u></td><td class="comm">' + comments + '</td></tr></table></td></tr><tr class="status"><td><u>Status: </u></td><td class="comm">' + status + '</td></tr></table></td></tr>');
									  
								  });
                                  //$(selector).before('<p class="numTags">No. tags: ' + o.tags.length + '</p>');
                                  //o.table = true;
                                  $(div).show();
						  		  o[r_l].table = true;
                                  },
                          
                      error: function() {
                          //console.log('Didn\'t work');
                          $('.TagCode code').text("There was an error retrieving the code");
                          $('.TagCode').show();

                      }
                });
            }

}
