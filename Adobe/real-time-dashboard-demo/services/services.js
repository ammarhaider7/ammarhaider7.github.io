(function($) {
  Realtime.api = {
    env:   {},
    wsse:  new Wsse(),

    /** Make the api request */
    /* callback should follow standard jQuery request format:
     *    function callback(data)
     */
    ajax: function (params) {
        var headers = Realtime.api.wsse.generateAuth(Realtime.config.username, Realtime.config.secret);
        var url = 'https://'+Realtime.config.endpoint+'/admin/1.4/rest/?method='+ Realtime.config.method;
        $.ajax(url, {
            type:'POST',
            data: params,
            dataType: "json",
            headers: {
                'X-WSSE': headers['X-WSSE']
            }
        });
    },
    params: function(metric, element, dateFrom, top, search, dateGranularity) {
        // console.log(arguments);
        if (top == null) {
          top = 10;
        }       
        if (dateFrom == null) {
          dateFrom = "today";
        }
        if (search == null) {
          search = {};
        }
        if (dateGranularity == null) {
          dateGranularity = 'minute:60';
        }
        return {
          'reportDescription': {
            'source': 'realtime',
            'reportSuiteID': Realtime.config.reportSuite,
            'metrics': [
              {
                'id': metric
              }
            ],
            'elements': [
              {
                'id': element,
                'top': top,
                'search': search
              }
            ],
            'dateGranularity': dateGranularity,
            'dateFrom': dateFrom
          }
        };
    }
  }
})(jQuery);
