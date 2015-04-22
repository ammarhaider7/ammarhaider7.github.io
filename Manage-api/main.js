//CORS using jQuery

$.ajax({

  // The 'type' property sets the HTTP method.
  // A value of 'PUT' or 'DELETE' will trigger a preflight request.
  type: 'POST',

  // The URL to make the request to.
  url: '//manage-api.ensighten.com/auth/token',
  data: 'grant_type=password',

  // The 'contentType' property sets the 'Content-Type' header.
  // The JQuery default for this property is
  // 'application/x-www-form-urlencoded; charset=UTF-8', which does not trigger
  // a preflight. If you set this value to anything other than
  // application/x-www-form-urlencoded, multipart/form-data, or text/plain,
  // you will trigger a preflight request.
  contentType: 'application/x-www-form-urlencoded',

  headers: {
    // Set any custom headers here.
    // If you set any non-simple headers, your server must include these
    // headers in the 'Access-Control-Allow-Headers' response header.
      "Authorization": "Basic " + btoa("experian" + ":" + "ammar.haider" + ":" + 'Haider26463.1!')
  },

  success: function(response) {
    // Here's where you handle a successful response.
      console.log(response);
  },

  error: function() {
    // Here's where you handle an error response.
    // Note that if the error was due to a CORS issue,
    // this function will still fire, but there won't be any additional
    // information about the error.
      console.log('Didn\'t work');
  }
});
