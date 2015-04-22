(function() {
    
    //Run ajax on Dom ready
    $(function() {
        o.authAjax();
    });
    
    var o = {

        //CORS using jQuery
        authAjax: function() {
                $.ajax({
                      type: 'POST',
                      url: '//manage-api.ensighten.com/auth/token',
                      data: 'grant_type=password',
                      contentType: 'application/x-www-form-urlencoded',

                      headers: {
                          "Authorization": "Basic " + btoa("experian" + ":" + "ammar.haider" + ":" + 'Haider26463.1!')
                      },
                      success: function(response) {
                        // Here's where you handle a successful response.
                          o.auth = response;
                          o.tagPull(o.auth);
                      },

                      error: function() {
                          console.log('Didn\'t work');
                      }
                    })
                },
             
        //Get some deployments
        tagPull: function(auth) {
                    $.ajax({
                          type: 'GET',
                          url: '//manage-api.ensighten.com/manage/deployments?name="UK SiteCatalyst Page Code"&spaceId="1501"}',
                          data: 'grant_type=password',
                          contentType: 'application/x-www-form-urlencoded',
                          headers: {
                              "Authorization": "Bearer " + auth.access_token,
                              "Accept": "application/json"
                          },
                          success: function(response) {
                              console.log(response);
                          },
                          error: function() {
                              console.log('Didn\'t work');
                          }
                    })
                }

    }
    
})();
