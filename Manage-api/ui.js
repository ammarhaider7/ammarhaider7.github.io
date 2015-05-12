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
	
	//$('tr.tag').not('.match-found').css('background-color','rgb(129, 113, 32)');
	
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
		$('.spinner').css('display','block');
		var SIDl = $('.main-left option:selected').attr('value'),
			SIDr = $('.main-right option:selected').attr('value'),
			lTable = '#TagDetails',
			rTable = 'tr.tag';

		if(SIDl != 0 && SIDr != 0) { 
			$(lTable).html('<tr><th>Tag Name</th><th>Space # 1</th><th>Space # 2</th></tr>');
			//Ajax
			o.tagPull(o.auth.access_token,SIDl,SIDr,lTable,rTable);
			} else {
				$('.TagCode').text('Please select two spaces');
			}
    });
});

var o = {

    loggedIn: false,
    table: false,
	r: {},
	l: {},
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
    tagPull: function(token,SID1,SID2,selector1,selector2) {
            $.when(    
                $.ajax({
                      type: 'GET',
                      url: '//manage-api.ensighten.com/manage/deployments?spaceId=' + SID1 + '&status=enabled_published',
                      contentType: 'application/x-www-form-urlencoded',
                      headers: {
                          "Authorization": "Bearer " + token,
                          "Accept": "application/json"
                      },
                      success: function(response) {
				o.l.tags = response;
		  		o.l.idArr = [];
				o.l.tags.forEach(function(el) {
					o.l.name = el.name;
					o.l.exec = el.executionTime;
					o.l.lastAct = el.lastAction;
					o.l.lastMod = el.modifyDate;
					o.l.conditions = el.conditionIds;
					o.l.comments = el.comments;
					o.l.id = el.id;
					o.l.idArr.push(o.l.id);
					o.l.status = el.status;
					o.l.code = el.code;
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
				   o.l.dependencies = el.dependentDeployments;

					$(selector1).append('<tr class="tag ' + o.l.id + '"><td>' + o.l.name + '</td><td><table><tr class="executionTime"><td><u>Execution time: </u></td><td class="exec">' + o.l.exec + '</td></tr><tr class="lastAction"><td><u>Last action: </u></td><td class="last-act">' + o.l.lastAct + '</td></tr><tr class="modifyDate"><td><u>Last modified: </u></td><td class="last-mod">' + o.l.lastMod + '</td></tr><tr class="conditionIds"><td><u>Conditions: </u></td><td class="cond">' + o.l.conditions + '</td></tr><tr class="dependentDeployments"><td><u>Dependencies: </u></td><td class="depend">' + o.l.dependencies + '</td></tr><tr class="comments"><td><u>Comments: </u></td><td class="comm">' + o.l.comments + '</td></tr><tr class="status"><td><u>Status: </u></td><td class="status">' + o.l.status + '</td></tr></td></tr></table></td></tr>');

				  })
			  },
                          
                      error: function() {
                          //console.log('Didn\'t work');
                          $('.TagCode code').text("There was an error retrieving the code");
                          $('.TagCode').show();

                      }
                }), $.ajax({
                      type: 'GET',
                      url: '//manage-api.ensighten.com/manage/deployments?spaceId=' + SID2 + '&status=enabled_published',
                      contentType: 'application/x-www-form-urlencoded',
                      headers: {
                          "Authorization": "Bearer " + token,
                          "Accept": "application/json"
                      },
		  success: function(response) {
				o.r.tags = response;
		  		o.r.idArr = [];
				o.r.tags.forEach(function(el) {
					o.r.name = el.name;
					o.r.exec = el.executionTime;
					o.r.lastAct = el.lastAction;
					o.r.lastMod = el.modifyDate;
					o.r.conditions = el.conditionIds;
					o.r.comments = el.comments;
					o.r.id = el.id;
					o.r.idArr.push(o.r.id);
					o.r.status = el.status;
					o.r.code = el.code;
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
				   o.r.dependencies = el.dependentDeployments;
					
				   $(selector2 + '.' + o.r.id).append('<td><table><tr class="executionTime"><td><u>Execution time: </u></td><td class="exec">' + o.r.exec + '</td></tr><tr class="lastAction"><td><u>Last action: </u></td><td class="last-act">' + o.r.lastAct + '</td></tr><tr class="modifyDate"><td><u>Last modified: </u></td><td class="last-mod">' + o.r.lastMod + '</td></tr><tr class="conditionIds"><td><u>Conditions: </u></td><td class="cond">' + o.r.conditions + '</td></tr><tr class="dependentDeployments"><td><u>Dependencies: </u></td><td class="depend">' + o.r.dependencies + '</td></tr><tr class="comments"><td><u>Comments: </u></td><td class="comm">' + o.r.comments + '</td></tr><tr class="status"><td><u>Status: </u></td><td class="status">' + o.r.status + '</td></tr></td></tr></table></td></tr>');

				  })
				  },

		  error: function() {
			  //console.log('Didn\'t work');
			  $('.TagCode').text("There was an error retrieving the code");
			  $('.TagCode').show();

		  }
		})).done(function() {
				$('.spinner').remove();
				$('.TagCode').show();

		});
            }
}
