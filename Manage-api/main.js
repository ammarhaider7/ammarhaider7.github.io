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
    
    $('.enviar').click(function() {
        
        var username = $('.login #username').val();
        var password = $('.login #password').val();
        o.authAjax(username, password);
    
    })
    
//    var username = prompt("Username");
//    var password = prompt("Password");
//    o.authAjax(username,password);
    //Run deployment ajax when user clicks get code
    $('#getCode').click(function() {
        var DID = $('#field1').val();
        var SID = $('option:selected').attr('value');
        o.loggedIn ? o.tagPull(o.auth.access_token, SID, DID) : alert('Not logged in');
    })
});

var o = {
    
    loggedIn: false,
    
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
                      $('.login form #success').show();
                      $('.login').remove();
                      $('#main').show();
                  },

                  error: function() {
                      console.log('Didn\'t work');
                      $('.login form #fail').show();

                  }
                })
            },

    //Get some deployments
    tagPull: function(token, SID, DID) {
                $.ajax({
                      type: 'GET',
                      url: '//manage-api.ensighten.com/manage/spaces/' + SID + '/deployments/' + DID,
                      contentType: 'application/x-www-form-urlencoded',
                      headers: {
                          "Authorization": "Bearer " + token,
                          "Accept": "application/json"
                      },
                      success: function(response) {
                          $('.login').fadeOut('slow');
                          $('#main').show();
                          console.log(response);
                          o.siteCatPageTag = response;
                      },
                      error: function() {
                          console.log('Didn\'t work');

                      }
                })
            }

}
