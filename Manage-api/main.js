//CORS using jQuery

$.ajax({

  // The 'type' property sets the HTTP method.
  // A value of 'PUT' or 'DELETE' will trigger a preflight request.
  type: 'POST',

  // The URL to make the request to.
  url: 'https://manage-api.ensighten.com/auth/token',
  data: 'grant_type=password',

  // The 'contentType' property sets the 'Content-Type' header.
  // The JQuery default for this property is
  // 'application/x-www-form-urlencoded; charset=UTF-8', which does not trigger
  // a preflight. If you set this value to anything other than
  // application/x-www-form-urlencoded, multipart/form-data, or text/plain,
  // you will trigger a preflight request.
  contentType: 'application/x-www-form-urlencoded',

  xhrFields: {
    // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
    // This can be used to set the 'withCredentials' property.
    // Set the value to 'true' if you'd like to pass cookies to the server.
    // If this is enabled, your server must respond with the header
    // 'Access-Control-Allow-Credentials: true'.
    withCredentials: false
  },

  headers: {
    // Set any custom headers here.
    // If you set any non-simple headers, your server must include these
    // headers in the 'Access-Control-Allow-Headers' response header.
      "Accept": "application/vnd.com.ensighten.manage-v1+json",
      "Authorization": "Basic " + btoa("ammar.haider" + ":" + 'Haider26463.1!'),
  },

  success: function() {
    // Here's where you handle a successful response.
  },

  error: function() {
    // Here's where you handle an error response.
    // Note that if the error was due to a CORS issue,
    // this function will still fire, but there won't be any additional
    // information about the error.
  }
});


/* //A simple helper method to help sort out the browser differences 

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);

    } else if (typeof XDomainRequest != "undefined") {

        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url);

    } else {
        // Otherwise, CORS is not supported by the browser.
        xhr = null;

    }
    return xhr;
}

// Make the actual CORS request.
function makeCorsRequest() {
    var method = 'POST';
    var url = "//manage-api.ensighten.com/auth/token";
    var xhr = createCORSRequest(method, url);
        xhr.withCredentials = true;
    if (!xhr) {
        throw new Error('CORS not supported');
    }
}

xhr.onload = function () {
    var responseText = xhr.responseText;
    console.log(responseText);
    // process the response.
};

xhr.onerror = function () {
    console.log('There was an error!');
};

var body = 'grant_type=password'

//Make request
xhr.send(body);*/
