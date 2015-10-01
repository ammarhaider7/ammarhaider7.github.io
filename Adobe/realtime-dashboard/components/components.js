// Generated by CoffeeScript 1.9.3
(function() {
  var container, div, h6, insert, p, ref;
  ref = React.DOM, p = ref.p, h6 = ref.h6, div = ref.div;
  container = $('.timer-div')[0];
  insert = React.createElement;
  Realtime.Components.timer = React.createClass({
    getInitialState: function() {
      return {
        dateNow: '',
        timeNow: ''
      };
    },
    render: function() {
      return div({}, p({
        className: 'text-muted'
      }, this.state.dateNow), h6({
        className: 'time-text'
      }, this.state.timeNow));
    },
    tick: function() {
      var date, day, time;
      day = moment().format('dddd');
      date = moment().format('MMMM Do YYYY');
      time = moment().format('h:mm:ss a');
      return this.setState({
        dateNow: day + ", " + date,
        timeNow: "" + time
      });
    },
    componentDidMount: function() {
      return this.interval = setInterval(this.tick, 1000);
    }
  });
  return React.render(insert(Realtime.Components.timer, null), container);
})();

// Generated by CoffeeScript 1.9.3
(function() {
  var api, container, div, g, h4, h6, img, pageviews, ref, secret, span, svg, username;
  pageviews = new Realtime.Models.pageViewTotals;
  api = Realtime.api;
  username = Realtime.config.username;
  secret = Realtime.config.secret;
  container = $('.pageviews')[0];
  ref = React.DOM, div = ref.div, span = ref.span, h6 = ref.h6, h4 = ref.h4, img = ref.img, svg = ref.svg, g = ref.g;
  Realtime.Components.pageViewTotals = React.createClass({
    mixins: [Backbone.React.Component.mixin],
    getInitialState: function() {
      return {
        spinner: 'visible',
        margin: {
          top: 0,
          bottom: 20,
          right: 0,
          left: 20
        },
        width: 250,
        height: 90,
        y: function(data, state) {
          return d3.scale.linear().domain([
            0, d3.max(data, function(d) {
              return d.value;
            })
          ]).range([state.height, 0]);
        },
        x: function(data, state) {
          return d3.scale.ordinal().domain(d3.range(data.length)).rangeRoundBands([0, state.width], 0.3);
        }
      };
    },
    runAjax: function() {
      return pageviews.fetch({
        type: 'POST',
        data: pageviews.params,
        dataType: "json",
        headers: {
          'X-WSSE': api.wsse.generateAuth(username, secret)['X-WSSE']
        }
      }).then((function(_this) {
        return function() {
          var node;
          if (_this.isMounted()) {
            _this.setState({
              model: pageviews,
              spinner: 'hide'
            });
            node = React.findDOMNode(_this.refs.topBarChart);
            return _this.d3BarChart(node, pageviews.get('data'), _this.state);
          }
        };
      })(this));
    },
    componentDidMount: function() {
      this.runAjax();
      return setInterval(this.runAjax, Realtime.config.interval);
    },
    render: function() {
      return div({
        className: 'pageviews-div'
      }, h4({
        className: 'sec-colour funnel-header'
      }, 'Order Funnel'), img({
        src: 'https://cloud.githubusercontent.com/assets/10219824/9718875/60a4eac0-5577-11e5-92bc-d0b6cd391c6e.gif',
        className: 'order-funnel-spinner spinner ' + this.state.spinner
      }), svg({
        className: 'order-funnel-svg',
        width: this.state.width + this.state.margin.left + this.state.margin.right,
        height: this.state.height + this.state.margin.bottom + this.state.margin.top
      }, g({
        ref: 'topBarChart',
        transform: "translate( " + (-this.state.margin.left) + ", " + this.state.margin.top + " )"
      })));
    },
    d3BarChart: function(node, data, state) {
      var addComma, bars, fLine1, h, labels, p, percLabels, percent, values, w, x, y;
      window.d3BarChartNode = node;
      window.d3BarChartData = data;
      window.d3BarChartState = state;
      h = state.height;
      w = state.width;
      x = state.x(data, state);
      y = state.y(data, state);
      p = 10;
      addComma = d3.format(',');
      percent = d3.format('%');
      bars = d3.select(node).selectAll('rect').data(data);
      bars.enter().append('rect');
      bars.attr('height', function(d) {
        return h - y(d.value);
      }).attr('width', function(d, i) {
        return x.rangeBand();
      }).attr('fill', function(d, i) {
        if (d.name === 'Confirmation') {
          return '#77b300';
        } else {
          return 'rgb(31, 119, 180)';
        }
      }).attr('x', function(d, i) {
        return x(i);
      }).attr('rx', function(d, i) {
        return x(i) + 1;
      }).attr('y', function(d) {
        return y(d.value);
      }).attr('ry', 1).attr('class', 'bar');
      labels = d3.select(node).selectAll('text').data(data);
      labels.enter().append('text');
      labels.text(function(d) {
        return d.name;
      }).attr('class', 'label').attr('x', function(d, i) {
        return x(i) + (x.rangeBand() / 2);
      }).attr('y', function(d, i) {
        return h + p * 2;
      }).attr('text-anchor', 'middle');
      values = d3.select(node).selectAll('text#tooltip').data(data);
      values.enter().append('text');
      values.text(function(d) {
        return addComma(d.value);
      }).attr('id', 'tooltip').attr('x', function(d, i) {
        return x(i) + (x.rangeBand() / 2);
      }).attr('y', function(d, i) {
        return y(d.value) + ((h - y(d.value)) / 2);
      }).attr('text-anchor', 'middle');
      percLabels = d3.select(node).selectAll('text#percLabel').data(data);
      percLabels.enter().append('text');
      percLabels.text(function(d) {
        if (d.name === 'Confirmation') {
          return percent(d.value / state.model.get('metricOP2'));
        } else {
          return percent(d.value / state.model.get('metricOP1'));
        }
      }).attr('x', function(d, i) {
        return x(i) + (x.rangeBand() / 2);
      }).attr('y', function(d, i) {
        return y(d.value) - p;
      }).attr('text-anchor', 'middle').attr('id', 'percLabel');
      return fLine1 = d3.select('.funnelLine1')[0][0];
    }
  });
  Realtime.Components.pageViewTotals = React.createFactory(Realtime.Components.pageViewTotals);
  return React.render(Realtime.Components.pageViewTotals({
    model: pageviews
  }), container);
})();

// Generated by CoffeeScript 1.9.3
(function() {
  var button, container, div, g, h3, img, insert, ref, svg, theModel;
  theModel = new Realtime.Models.orderTable;
  container = $('.last-touch-chart')[0];
  ref = React.DOM, svg = ref.svg, g = ref.g, div = ref.div, button = ref.button, h3 = ref.h3, img = ref.img;
  insert = React.createElement;
  Realtime.Components.spinnerComp = React.createClass({
    render: function() {
      return img({
        src: 'https://cloud.githubusercontent.com/assets/10219824/9718875/60a4eac0-5577-11e5-92bc-d0b6cd391c6e.gif',
        className: 'spinner ' + this.props.spinner
      });
    }
  });
  Realtime.Components.ordersTable = React.createClass({
    mixins: [Backbone.React.Component.mixin],
    getInitialState: function() {
      return {
        api: Realtime.api,
        username: Realtime.config.username,
        secret: Realtime.config.secret,
        margin: {
          top: 20,
          bottom: 20,
          right: 55,
          left: 70
        },
        width: 300,
        height: 350,
        spinner: 'visible',
        c: 0,
        x: function(data, state) {
          return d3.scale.linear().domain([
            0, d3.max(data, function(d) {
              return d.value;
            })
          ]).range([0, state.width]);
        },
        y: function(data, state) {
          return d3.scale.ordinal().domain(d3.range(data.length)).rangeRoundBands([0, state.height], 0.1);
        },
        c: 0
      };
    },
    runAjax: function() {
      this.state.c++;
      return theModel.fetch({
        type: 'POST',
        data: theModel.params,
        dataType: "json",
        headers: {
          'X-WSSE': this.state.api.wsse.generateAuth(this.state.username, this.state.secret)['X-WSSE']
        }
      }).then((function(_this) {
        return function() {
          var node;
          if (_this.isMounted()) {
            _this.setState({
              model: theModel,
              spinner: 'hide'
            });
            node = React.findDOMNode(_this.refs.groupEl);
            return _this.d3ChartInit(node, theModel.get('data'), _this.state);
          }
        };
      })(this));
    },
    render: function() {
      var addComma;
      addComma = d3.format(',');
      return div({
        className: 'last-touch-orders-chart'
      }, h3({
        className: 'sec-colour'
      }, 'Sign-ups by channel'), insert(Realtime.Components.spinnerComp, {
        spinner: this.state.spinner
      }), div({
        id: 'ordersChannelsChartDiv'
      }, svg({
        width: this.state.width + this.state.margin.left * 2 + this.state.margin.right,
        height: this.state.height
      }, g({
        ref: 'groupEl',
        transform: "translate( " + (this.state.margin.left * 2 + 15) + ", 0 )"
      }))));
    },
    componentDidMount: function() {
      this.runAjax();
      return setInterval(this.runAjax, Realtime.config.interval);
    },
    d3ChartInit: function(node, data, state) {
      var addComma, bars, h, labels, values, w, x, y;
      h = state.height;
      w = state.width;
      x = state.x(data, state);
      y = state.y(data, state);
      addComma = d3.format(',');
      bars = d3.select(node).selectAll('rect').data(data);
      bars.enter().append('rect');
      bars.attr('width', function(d) {
        return x(d.value);
      }).attr('height', function(d, i) {
        return y.rangeBand();
      }).attr('fill', 'rgb(31, 119, 180)').attr('y', function(d, i) {
        return y(i);
      }).attr('x', 0).attr('rx', 1).attr('ry', function(d, i) {
        return y(i + 1);
      }).attr('class', 'bar');
      labels = d3.select(node).selectAll('text').data(data);
      labels.enter().append('text');
      labels.text(function(d) {
        return d.name;
      }).attr('class', 'label').attr('x', -5).attr('y', function(d, i) {
        return y(i) + (y.rangeBand() / 2) + 4;
      }).attr('text-anchor', 'end');
      values = d3.select(node).selectAll('text#tooltip').data(data);
      values.enter().append('text');
      return values.text(function(d) {
        return addComma(d.value);
      }).attr('id', 'tooltip').attr('x', function(d) {
        return x(d.value) + 5;
      }).attr('y', function(d, i) {
        return y(i) + (y.rangeBand() / 2) + 4;
      }).attr('text-anchor', 'start');
    }
  });
  Realtime.Components.ordersTable = React.createFactory(Realtime.Components.ordersTable);
  return React.render(Realtime.Components.ordersTable({
    model: theModel
  }), container);
})();

// Generated by CoffeeScript 1.9.3
(function() {
  var _body, api, div, h1, img, ref, secret, span, total, username;
  total = new Realtime.Models.orderTotal;
  api = Realtime.api;
  username = Realtime.config.username;
  secret = Realtime.config.secret;
  _body = $('.orderTotal')[0];
  ref = React.DOM, div = ref.div, span = ref.span, h1 = ref.h1, img = ref.img;
  Realtime.Components.ordersTotal = React.createClass({
    mixins: [Backbone.React.Component.mixin],
    getInitialState: function() {
      return {
        spinner: 'visible'
      };
    },
    runAjax: function() {
      return total.fetch({
        type: 'POST',
        data: total.params,
        dataType: "json",
        headers: {
          'X-WSSE': api.wsse.generateAuth(username, secret)['X-WSSE']
        }
      }).then((function(_this) {
        return function() {
          if (_this.isMounted()) {
            return _this.setState({
              model: total,
              spinner: 'hide'
            });
          }
        };
      })(this));
    },
    render: function() {
      return div({
        className: 'totals-div inline'
      }, h1({
        className: 'sec-colour'
      }, 'Sign-ups', div({
        id: 'totals'
      }, img({
        src: 'https://cloud.githubusercontent.com/assets/10219824/9718875/60a4eac0-5577-11e5-92bc-d0b6cd391c6e.gif',
        className: 'spinner ' + this.state.spinner
      }), span({
        id: 'totalOrders',
        className: 'number pri-colour'
      }, this.state.model.metric))));
    },
    componentDidMount: function() {
      this.runAjax();
      return setInterval(this.runAjax, 10000);
    },
    componentDidUpdate: function() {
      if (this.state.model.metric > 0) {
        return this.animateNumber();
      }
    },
    animateNumber: function() {
      var commaStep;
      commaStep = $.animateNumber.numberStepFactories.separator(',');
      return $('#totalOrders').animateNumber({
        number: this.state.model.metric,
        numberStep: commaStep
      }, 500);
    }
  });
  Realtime.Components.ordersTotal = React.createFactory(Realtime.Components.ordersTotal);
  return React.render(Realtime.Components.ordersTotal({
    model: total
  }), _body);
})();

// Generated by CoffeeScript 1.9.3
(function() {
  var button, container, div, g, h3, img, insert, pageviewsBd, ref, svg;
  pageviewsBd = new Realtime.Models.pageViewBreakdown;
  container = $('.pageviews-pie-chart')[0];
  ref = React.DOM, svg = ref.svg, g = ref.g, div = ref.div, button = ref.button, h3 = ref.h3, img = ref.img;
  insert = React.createElement;
  Realtime.Components.pageViewsBreakdown = React.createClass({
    getInitialState: function() {
      return {
        api: Realtime.api,
        username: Realtime.config.username,
        secret: Realtime.config.secret,
        margin: {
          top: 20,
          bottom: 20,
          right: 55,
          left: 70
        },
        width: 600,
        height: 380,
        spinner: 'visible',
        c: 0
      };
    },
    ajax: function() {
      return pageviewsBd.fetch({
        type: 'POST',
        data: pageviewsBd.params,
        dataType: "json",
        headers: {
          'X-WSSE': this.state.api.wsse.generateAuth(this.state.username, this.state.secret)['X-WSSE']
        }
      }).then((function(_this) {
        return function() {
          var node;
          if (_this.isMounted()) {
            _this.setState({
              model: pageviewsBd.get('data'),
              spinner: 'hide'
            });
            node = React.findDOMNode(_this.refs.groupEl);
            return _this.d3PieChartInit(node, pageviewsBd.get('data'), _this.state);
          }
        };
      })(this));
    },
    componentDidMount: function() {
      this.ajax();
      return setInterval(this.ajax, 10000);
    },
    render: function() {
      var addComma;
      addComma = d3.format(',');
      return div({
        className: 'pageViewBreakdownChart'
      }, h3({
        className: 'sec-colour pieHeader'
      }, 'Top Pages'), insert(Realtime.Components.spinnerComp, {
        spinner: this.state.spinner
      }), div({
        id: 'pageViewBreakdownDiv'
      }, svg({
        width: this.state.width + this.state.margin.left + this.state.margin.right,
        height: this.state.height
      }, g({
        ref: 'pvGroupEl',
        className: 'path-group',
        transform: "translate( " + (this.state.width / 2 - this.state.margin.right) + ", " + (this.state.height / 2) + " )"
      }), g({
        className: 'label-group',
        transform: "translate( " + (this.state.width - this.state.margin.right - this.state.margin.left) + ", " + this.state.margin.top + " )"
      }), g({
        className: 'line-group',
        transform: "translate( " + (this.state.width / 2) + ", " + (this.state.height / 2) + " )"
      }), g({
        className: 'value-label-group',
        transform: "translate( " + (this.state.width / 2 - this.state.margin.right) + ", " + (this.state.height / 2) + " )"
      }), g({
        className: 'center-group',
        transform: "translate( " + (this.state.width / 2 - this.state.margin.right) + ", " + (this.state.height / 2) + " )"
      }))));
    },
    d3PieChartInit: function(node, data, state) {
      var _g, addComma, arc, centerG, centerText, cleanLabel, colour, h, key, keyRects, labels, lg, lineG, lines, p, paths, pie, pos, pos2, r, valLabels, vg, w, y;
      h = state.height;
      w = state.width;
      r = (Math.min(w, h) / 2) - 20;
      p = 5;
      addComma = d3.format(',');
      colour = d3.scale.category10();
      y = d3.scale.ordinal().domain(d3.range(data.length)).rangeRoundBands([0, state.height], 0);
      cleanLabel = function(str) {
        var lastPortion;
        lastPortion = str.substr(str.lastIndexOf(':') + 2, str.length);
        if (lastPortion.indexOf('Home' === -1)) {
          return lastPortion;
        } else {
          return str.substr(str.indexOf(':') + 2, str.length);
        }
      };
      arc = d3.svg.arc().outerRadius(r * 0.9).innerRadius(r * 0.75);
      key = function(d, i) {
        return d.data.name;
      };
      pos = d3.svg.arc().innerRadius(r * 1.05).outerRadius(r * 1.05);
      pos2 = d3.svg.arc().innerRadius(r * 0.9).outerRadius(r);
      pie = d3.layout.pie().sort(null).value(function(d) {
        return d.value;
      });
      _g = d3.select('.path-group');
      paths = _g.selectAll('path').data(pie(data), key);
      paths.enter().append('path');
      paths.attr('d', arc).style('fill', function(d, i) {
        return colour(i);
      }).attr('class', 'arc').each(function(d) {
        return this._current = d;
      });
      vg = d3.select('.value-label-group');
      valLabels = vg.selectAll('text').data(pie(data));
      valLabels.enter().append('text');
      valLabels.text(function(d) {
        return addComma(d.data.value);
      }).attr('transform', function(d) {
        return "translate(" + (pos.centroid(d)) + ")";
      }).attr('text-anchor', 'middle').attr('class', 'sec-colour');
      lg = d3.select('.label-group');
      labels = lg.selectAll('text').data(data);
      labels.enter().append('text');
      labels.text(function(d) {
        return d.name;
      }).attr('x', 0).attr('y', function(d, i) {
        return y(i);
      }).attr('text-anchor', 'start').attr('class', 'pieLabel');
      keyRects = lg.selectAll('rect').data(data);
      keyRects.enter().append('rect');
      keyRects.attr('fill', function(d, i) {
        return colour(i);
      }).attr('x', -(p * 4)).attr('width', p * 3).attr('height', p * 3).attr('y', function(d, i) {
        return y(i) - p * 2;
      });
      lineG = d3.select('.line-group');
      lines = lineG.selectAll('polyline').data(pie(data), key);
      lines.enter().append('polyline');
      lines.style('opacity', 1).attr('fill', '#ffffff').attr('points', function(d) {
        return [arc.centroid(d), pos2.centroid(d)];
      });
      lines.attr('class', 'polyline').each(function(d) {
        return this.current = d;
      });
      centerText = d3.select('.center-text')[0][0];
      if (centerText == null) {
        centerG = d3.select('.center-group');
        return centerG.append('text').html("<tspan x=\"0\" dy=\"0em\">Top 10 Pages</tspan>\n<tspan x=\"0\" dy=\"1em\">by Pageviews</tspan>").attr('text-anchor', 'middle').attr('class', 'center-text');
      }
    }
  });
  Realtime.Components.pageViewsBreakdown = React.createFactory(Realtime.Components.pageViewsBreakdown);
  return React.render(Realtime.Components.pageViewsBreakdown({
    model: pageviewsBd
  }), container);
})();

// Generated by CoffeeScript 1.9.3
(function() {
  var div, form, h6, insert, option, ref, select;
  ref = React.DOM, h6 = ref.h6, div = ref.div, select = ref.select, option = ref.option, form = ref.form;
  insert = React.createElement;
  return Realtime.Components.timePicker = React.createClass({
    render: function() {
      return div({
        id: 'time-picker'
      }, form({}, select({
        onChange: this.props.onChange,
        className: 'form-control input-sm'
      }, this.props.options.map(function(el) {
        return option({
          key: el.id,
          value: el.id
        }, el.text);
      }))));
    }
  });
})();

// Generated by CoffeeScript 1.9.3
(function() {
  var api, container, div, g, h3, img, insert, ref, secret, span, svg, trend, username;
  trend = new Realtime.Models.ordersTrend;
  api = Realtime.api;
  username = Realtime.config.username;
  secret = Realtime.config.secret;
  container = $('div.orderTrend')[0];
  insert = React.createElement;
  ref = React.DOM, div = ref.div, span = ref.span, h3 = ref.h3, img = ref.img, svg = ref.svg, g = ref.g;
  Realtime.Components.ordersTrend = React.createClass({
    mixins: [Backbone.React.Component.mixin],
    getInitialState: function() {
      return {
        spinner: 'visible',
        updateSpinner: 'invisible',
        margin: {
          top: 20,
          bottom: 20,
          right: 70,
          left: 35
        },
        width: 800,
        height: 250,
        formatTime: (function() {
          return d3.time.format("%H:%M");
        })(),
        y: function(data, state) {
          return d3.scale.linear().range([state.height, 0]).domain(d3.extent(data, function(d) {
            return +d.value;
          }));
        },
        x: function(data, state) {
          return d3.time.scale().range([0, state.width]).domain(d3.extent(data, function(d) {
            return d.name;
          }));
        },
        xAxis: function(data, state) {
          return d3.svg.axis().scale(state.x(data, state)).orient("bottom");
        },
        yAxis: function(data, state) {
          return d3.svg.axis().scale(state.y(data, state)).orient("left");
        },
        line: function(data, state) {
          return d3.svg.line().interpolate("cardinal").x(function(d) {
            var _x;
            _x = state.x(data, state);
            return _x(d.name);
          }).y(function(d) {
            var _y;
            _y = state.y(data, state);
            return _y(+d.value);
          });
        }
      };
    },
    runAjax: function() {
      return trend.fetch({
        type: 'POST',
        data: trend.params(),
        dataType: "json",
        headers: {
          'X-WSSE': api.wsse.generateAuth(username, secret)['X-WSSE']
        }
      }).then((function(_this) {
        return function() {
          var node;
          if (_this.isMounted()) {
            _this.setState({
              model: trend,
              spinner: 'hide'
            });
            node = React.findDOMNode(_this.refs.trendChart);
            if (trend.get('update') === false) {
              return _this.d3TrendChart(node, trend.get('data'), _this.state);
            } else {
              _this.d3TrendChartUpdate(node, trend.get('data'), _this.state);
              trend.set('update', true);
              return _this.setState({
                updateSpinner: 'invisible'
              });
            }
          }
        };
      })(this));
    },
    optionsArr: [
      {
        id: '-12 hours|minute:12',
        text: 'Last 12 hours'
      },
      {
        id: '-1 hour|minute:1',
        text: 'Last hour'
      }, {
        id: '-2 hour|minute:2',
        text: 'Last 2 hours'
      }, {
        id: '-3 hour|minute:3',
        text: 'Last 3 hours'
      },
      {
        id: 'today|minute:20',
        text: 'Today'
      } 
    ],
    handleChange: function(event) {
      var date, hours, splitVal;
      this.setState({
        updateSpinner: 'visible'
      });
      splitVal = event.target.value.split('|');
      trend.set('dateFrom', splitVal[0]);
      if (splitVal[0] === 'today') {
        date = new Date;
        hours = date.getHours();
        trend.set('dateGranularity', "minute:" + (hours + 1));
      } else {
        trend.set('dateGranularity', splitVal[1]);
      }
      return this.runAjax();
    },
    render: function() {
      return div({
        className: 'trend-div inline'
      }, h3({
        className: 'sec-colour'
      }, 'Sign-ups trend', insert(Realtime.Components.timePicker, {
        options: this.optionsArr,
        onChange: this.handleChange,
        updateSpinner: this.state.updateSpinner
      }), insert(Realtime.Components.spinnerComp, {
        spinner: this.state.updateSpinner
      }), div({
        id: 'trend'
      }, img({
        src: 'https://cloud.githubusercontent.com/assets/10219824/9718875/60a4eac0-5577-11e5-92bc-d0b6cd391c6e.gif',
        className: 'spinner ' + this.state.spinner
      }), svg({
        className: 'order-trend-svg',
        width: this.state.width + this.state.margin.left + this.state.margin.right,
        height: this.state.height + this.state.margin.bottom + this.state.margin.top
      }, g({
        ref: 'trendChart',
        transform: "translate( " + this.state.margin.left + ", " + this.state.margin.top + " )"
      }, g({
        className: 'x axis',
        transform: "translate( 0, " + this.state.height + " )"
      }), g({
        className: 'y axis'
      }), g({
        className: 'focus'
      }))))));
    },
    componentDidMount: function() {
      this.runAjax();
      return setInterval(this.runAjax, Realtime.config.interval * 6);
    },
    d3TrendChart: function(node, data, state) {
      var _line, _xAxis, _yAxis, focus, formatTime, mousemove, overlayRect, trendLine;
      formatTime = state.formatTime;
      node = d3.select(node);
      _line = state.line(data, state);
      _xAxis = node.select('.x.axis').call(state.xAxis(data, state));
      _yAxis = node.select('.y.axis').call(state.yAxis(data, state)).append('text').attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Sign-ups");
      trendLine = d3.select('.order-trend-svg .trend-line')[0][0];
      if (trendLine == null) {
        trendLine = node.append('path').datum(data).attr('class', 'trend-line').attr('d', _line);
        focus = node.select('.focus');
        focus.append('circle').attr('r', 3).attr('class', 'tracker-circle');
        focus.append('text').attr('x', -45).attr('dy', '-0.5em').attr('class', 'tracker-text');
        focus.append("line").attr("class", "xGuide").style("stroke", "rgb(31, 119, 180);").style("stroke-dasharray", "3,3").style("opacity", 0.75).attr("y1", 0).attr("y2", state.height);
        focus.append("line").attr("class", "yGuide").style("stroke", "rgb(31, 119, 180);").style("stroke-dasharray", "3,3").style("opacity", 0.75).attr("x1", state.width).attr("x2", state.width);
      }
      overlayRect = d3.select('.order-trend-svg .overlay')[0][0];
      mousemove = function() {
        var _x, _y, bisectDate, d, d0, d1, i, x0, xCoord, yCoord;
        bisectDate = d3.bisector(function(d) {
          return d.name;
        }).left;
        _x = state.x(data, state);
        _y = state.y(data, state);
        x0 = _x.invert(d3.mouse(this)[0]);
        i = bisectDate(data, x0, 1);
        d0 = data[i - 1];
        d1 = data[i];
        d = x0 - (d0.name.getHours()) > d1.name.getHours() - x0 ? d1 : d0;
        xCoord = _x(d.name);
        yCoord = _y(d.value);
        focus.select('text').attr('transform', 'translate(' + xCoord + ',' + yCoord + ')').text((formatTime(d.name)) + " - " + d.value + " orders");
        focus.select('circle').attr('transform', 'translate(' + xCoord + ',' + yCoord + ')');
        focus.select(".xGuide").attr("transform", "translate(" + xCoord + "," + yCoord + ")").attr("y2", state.height - yCoord);
        return focus.select(".yGuide").attr("transform", "translate(" + state.width * -1 + "," + yCoord + ")").attr("x2", state.width + state.width);
      };
      if (overlayRect == null) {
        return node.append('rect').attr('class', 'overlay').attr('width', state.width).attr('height', state.height).on('mouseover', function() {
          return focus.style('display', 'block');
        }).on('mouseout', function() {
          return focus.style('display', 'none');
        }).on('mousemove', mousemove);
      }
    },
    d3TrendChartUpdate: function(node, data, state) {
      var _mousemove, _xAxis, _yAxis, formatTime, trendLine;
      node = d3.select(node);
      formatTime = state.formatTime;
      _xAxis = node.select('.x.axis').transition().duration(1000).call(state.xAxis(data, state));
      _yAxis = node.select('.y.axis').transition().duration(1000).call(state.yAxis(data, state));
      trendLine = d3.select('.order-trend-svg path.trend-line');
      trendLine.datum(data).transition().duration(1000).attr('d', state.line(data, state));
      _mousemove = function() {
        var _x, _y, bisectDate, d, d0, d1, i, x0, xCoord, yCoord;
        bisectDate = d3.bisector(function(d) {
          return d.name;
        }).left;
        _x = state.x(data, state);
        _y = state.y(data, state);
        x0 = _x.invert(d3.mouse(this)[0]);
        i = bisectDate(data, x0, 1);
        d0 = data[i - 1];
        d1 = data[i];
        d = x0 - (d0.name.getHours()) > d1.name.getHours() - x0 ? d1 : d0;
        xCoord = _x(d.name);
        yCoord = _y(d.value);
        node.select('text.tracker-text').attr('transform', 'translate(' + xCoord + ',' + yCoord + ')').text((formatTime(d.name)) + " - " + d.value + " orders");
        node.select('circle').attr('transform', 'translate(' + xCoord + ',' + yCoord + ')');
        node.select(".xGuide").attr("transform", "translate(" + xCoord + "," + yCoord + ")").attr("y2", state.height - yCoord);
        return node.select(".yGuide").attr("transform", "translate(" + state.width * -1 + "," + yCoord + ")").attr("x2", state.width + state.width);
      };
      return node.select('.overlay').on('mousemove', _mousemove);
    }
  });
  Realtime.Components.ordersTrend = React.createFactory(Realtime.Components.ordersTrend);
  React.render(Realtime.Components.ordersTrend({model: trend}), container);
})();
