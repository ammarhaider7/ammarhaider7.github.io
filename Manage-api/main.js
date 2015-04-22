/* Space IDs
1501 - UK Credit Expert - Prod
1503 - UK Credit Expert - Stage
7469 - UK Experian Corp - Prod
7709 - UK Experian Corp - Stage
*/

//Run ajax on Dom ready
$(function() {
    var username = prompt("Username");
    var password = prompt("Password");
    o.authAjax(username,password);
    //Run deployment ajax when user clicks get code
    $('#getCode').click(function() {
        var spaceVal = $(this).val();
        !!o.loggedIn ? o.tagPull(o.auth.access_token, o.spaces.spaceVal) : alert('Not logged in');
    })
});

var o = {
    
    loggedIn: false,
    
    spaces: {
                ceProd: "1501",
                ceStage: "1503",
                expProd: "7649",
                expStage: "7709"
            },
    //CORS using jQuery
    authAjax: function(username,password) {
            $.ajax({
                  type: 'POST',
                  url: '//manage-api.ensighten.com/auth/token',
                  data: 'grant_type=password',
                  contentType: 'application/x-www-form-urlencoded',

                  headers: {
                      "Authorization": "Basic " + btoa("experian" + ":" + "username" + ":" + 'password')
                  },
                  success: function(response) {
                    // Here's where you handle a successful response.
                      o.auth = response;
                      loggedIn = true;
                  },

                  error: function() {
                      console.log('Didn\'t work');
                      alert('Access denied');
                  }
                })
            },

    //Get some deployments
    tagPull: function(auth, DID) {
                $.ajax({
                      type: 'GET',
                      url: '//manage-api.ensighten.com/manage/spaces/1501/deployments/' + DID,
                      contentType: 'application/x-www-form-urlencoded',
                      headers: {
                          "Authorization": "Bearer " + auth.access_token,
                          "Accept": "application/json"
                      },
                      success: function(response) {
                          console.log(response);
                          o.siteCatPageTag = response;
                      },
                      error: function() {
                          console.log('Didn\'t work');
                      }
                })
            }

}
