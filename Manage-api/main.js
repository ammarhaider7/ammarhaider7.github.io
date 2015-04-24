/* Space IDs
1501 - UK Credit Expert - Prod
1503 - UK Credit Expert - Stage
7469 - UK Experian Corp - Prod
7709 - UK Experian Corp - Stage
*/

//Run ajax on Dom ready
$(function() {

    var loginVisible = false;

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
        if(!o.table) {
            var SID = $('option:selected').attr('value');
            o.loggedIn ? o.tagPull(o.auth.access_token, SID) : alert('Not logged in');
        } else {
            $('#TagDetails tbody tr').remove();
            var SID = $('option:selected').attr('value');
            o.loggedIn ? o.tagPull(o.auth.access_token, SID) : alert('Not logged in');
        }
    })
});

var o = {

    loggedIn: false,
    table: false,

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
    tagPull: function(token, SID) {
                $.ajax({
                      type: 'GET',
                      url: '//manage-api.ensighten.com/manage/deployments?spaceId=' + SID + '&status=enabled_published',
                      contentType: 'application/x-www-form-urlencoded',
                      headers: {
                          "Authorization": "Bearer " + token,
                          "Accept": "application/json"
                      },
                      success: function(response) {
                                  o.tags = response;
                                  for (var i = 0; i < o.tags.length; i++) {
                                    var name = o.tags[i].name,
                                        exec = o.tags[i].executionTime,
                                        lastAct = o.tags[i].lastAction,
                                        lastMod = o.tags[i].modifyDate,
                                        conditions = o.tags[i].conditionIds,
                                        dependencies = o.tags[i].dependentDeployments,
                                        comments = o.tags[i].comments,
                                        code = o.tags[i].code;
                                      
                                        $('#TagDetails').before('<p>No. tags: ' + o.tags.length + '</p>');

                                        $('#TagDetails').append('<tr><td>' + name + '</td><td>' + exec + '</td><td>' + lastAct + '</td><td>' + lastMod + '</td><td>' + conditions + '</td><td>' + dependencies + '</td><td>' + comments + '</td></tr>');
                                    
                                    }
                                  o.table = true;
                                  $('.TagCode').show();

                                  },
                          
                      error: function() {
                          //console.log('Didn\'t work');
                          $('.TagCode code').text("There was an error retrieving the code");
                          $('.TagCode').show();

                      }
                });
            }

}
