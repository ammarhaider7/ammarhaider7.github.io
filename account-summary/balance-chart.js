(function ($) {

  $(function () {

    var BalanceChart = {

      dataset1: [{
        label: 'Abulia',
        count: 30
      }, {
        label: 'Betelgeuse',
        count: 0
      }],
      dataset2: [{
        label: 'Abulia',
        count: 20
      }, {
        label: 'Betelgeuse',
        count: 10
      }],
      destroyDataSet: [{
        label: 'Abulia',
        count: 0
      }, {
        label: 'Betelgeuse',
        count: 0
      }],
      margin: {
        top: 20,
        bottom: 0,
        left: 20,
        right: 20,
        p: 10
      },
      width: 320,
      height: 260,
      radius: null,
      ringWidth: 3.5,
      color: d3.scaleOrdinal(['#ffb913', '#e6e6e6']),
      initAnimationDuration: 1000,
      initAnimationDelay: 350,
      initDone: false,
      centerOffset: 95,

      constructor: function () {
        this.radius = Math.min(this.width, this.height) / 2;
      },

      buildChart: function () {

        var _this = this;
        var _a = this, dataset1 = _a.dataset1, dataset2 = _a.dataset2, margin = _a.margin, radius = _a.radius, width = _a.width, height = _a.height, color = _a.color, ringWidth = _a.ringWidth, centerOffset = _a.centerOffset;
        var svg = d3.select('#balance-chart')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + ((width + margin.left + margin.right) / 2) + ',' + (height / 2 + margin.top) + ')');
        var _arc = d3.arc()
          .innerRadius(radius - ringWidth)
          .outerRadius(radius);
        var _pie = d3.pie()
          .value(function (d) { return d.count; })
          .sort(null);
        var path = svg.selectAll('path')
          .data(_pie(this.destroyDataSet))
          .enter()
          .append('path')
          .attr('d', _arc)
          .attr('fill', function (d) { return color(d.data.label); })
          .each(function (d) { this._current = d; }); // store the initial angles
        var circle = svg.append('circle')
          .attr('r', 0)
          .attr('transform', 'translate(0,' + -(height / 2) + ')')
          .attr('class', 'balance-chart-point');
        var centerTitleG = svg.append('g')
          .attr('transform', 'translate(' + 0 + ',' + -(margin.p * 3) + ')');
        var centerTextG = svg.append('g')
          .attr('transform', 'translate(' + -centerOffset + ',' + (margin.p * 2.5) + ')');
        var centerTitle = centerTitleG.append('text')
          .text('Today\'s balance')
          .attr('class', 'body-md balance-chart-title')
          .attr('opacity', 0);
        var centerText = centerTextG.append('text');
        var centerTextPrefix = centerText.append('tspan')
          .text('£')
          .attr('class', 'balance-chart-text-prefix')
          .attr('opacity', 0);
        var centerTextAmont = centerText.append('tspan')
          .text('5,000')
          .attr('class', 'balance-chart-text')
          .attr('opacity', 0);
        // Store the displayed angles in _current.
        // Then, interpolate from _current to the new angles.
        // During the transition, _current is updated in-place by d3.interpolate.
        function arcTween(a) {
          var i = d3.interpolate(this._current, a);
          this._current = i(0);
          return function (t) {
            return _arc(i(t));
          };
        }
        // Returns an attrTween for translating along the specified path element.
        function translateAlong(_path) {
          var l = _path.getTotalLength();
          return function (d, i, a) {
            return function (t) {
              var p = _path.getPointAtLength(t * l);
              return 'translate(' + p.x + ',' + p.y + ')';
            };
          };
        }
        var animateToBalance = function () {
          path = path.data(_pie(dataset2)); // compute the new angles
          path.transition().duration(_this.initAnimationDuration).attrTween('d', arcTween); // redraw the arcs
          circle.transition()
            .duration(_this.initAnimationDuration)
            .attrTween('transform', translateAlong(path.nodes()[1]));
          _this.animateBalanceAmount();
        };
        var initAnimate = function () {
          circle
            .transition()
            .duration(_this.initAnimationDuration)
            .attr('r', 8);
          path = path.data(_pie(dataset1));
          path
            .transition()
            .duration(_this.initAnimationDuration)
            .attrTween('d', arcTween) // redraw the arcs
            .on('end', function () { return animateToBalance(); });
          var balanceTextEls = d3.selectAll('.balance-chart-text-prefix, .balance-chart-text, .balance-chart-title');
          balanceTextEls
            .transition()
            .duration(_this.initAnimationDuration)
            .attr('opacity', 1);
        };
        setTimeout(function () { return initAnimate(); }, this.initAnimationDelay);

      },

      animateBalanceAmount() {
        
        var commaSeparatorNumberStep = jQuery.animateNumber.numberStepFactories.separator(',');
        var balanceAmount = jQuery('.balance-chart-text');
        balanceAmount
            .prop('number', 5000)
            .animateNumber({
            number: 3700,
            numberStep: commaSeparatorNumberStep
        }, this.initAnimationDuration); // animate the balance amount
        
      },

      init: function () {
        this.constructor();
        this.buildChart();
      }

    }

    window.BalanceChart = BalanceChart;
    BalanceChart.init();

  });
})(jQuery);