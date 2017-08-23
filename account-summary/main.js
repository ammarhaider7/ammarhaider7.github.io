(function ($) {

  $(function () {

    var PaymentHistory = {

      paymentsData: [
        { amount: 343.64, month: 'Jan', year: '2016', paid: true },
        { amount: 343.64, month: 'Feb', year: '2016', paid: true },
        { amount: 343.64, month: 'Mar', year: '2016', paid: true },
        { amount: 343.64, month: 'Oct', year: '2016', paid: true },
        { amount: 343.64, month: 'Dec', year: '2016', paid: true },
        { amount: 343.64, month: 'Jan', year: '2017', paid: true },
        { amount: 343.64, month: 'Feb', year: '2017', paid: true },
        { amount: 343.64, month: 'Mar', year: '2017', paid: true },
        { amount: 343.64, month: 'Apr', year: '2017', paid: true },
        { amount: 343.64, month: 'May', year: '2017', paid: true },
        { amount: 343.64, month: 'Jun', year: '2017', paid: true },
        { amount: 343.64, month: 'Jul', year: '2017', paid: true },
        { amount: 343.64, month: 'Dec', year: '2016', paid: true },
        { amount: 343.64, month: 'Jan', year: '2017', paid: true },
        { amount: 343.64, month: 'Feb', year: '2017', paid: true },
        { amount: 343.64, month: 'Mar', year: '2017', paid: true },
        { amount: 343.64, month: 'Apr', year: '2017', next: true },
        { amount: 343.64, month: 'May', year: '2017', future: true },
        { amount: 343.64, month: 'Jun', year: '2017', future: true },
        { amount: 343.64, month: 'Jul', year: '2017', future: true },
        { amount: 343.64, month: 'Aug', year: '2017', future: true },
        { amount: 343.64, month: 'Sep', year: '2017', future: true },
        { amount: 343.64, month: 'Oct', year: '2017', future: true },
        { amount: 343.64, month: 'Nov', year: '2017', future: true }
      ],

      innerCircleRadius: null,
      width: 320,
      height: 200,
      margin: {
        top: 55,
        bottom: 75,
        left: 10,
        right: 10,
        p: 10
      },
      segmentXOffset: 10,
      paymentsRadialScale: null,
      circumference: null,
      centerOffset: 65,
      initTransitionDuration: 300,
      exitTransitionDuration: 500,
      maxSegmentWidth: 27,
      nextPaymentSegmentYOffset: 15,
      numPaymentsCompleted: null,

      constructor: function () {
        this.innerCircleRadius = Math.min(this.width, this.height) / 2;
        this.circumference = 2 * Math.PI * this.innerCircleRadius;
        this.paymentsRadialScale = d3.scaleLinear()
          .range([0, 360])
          .domain([0, this.paymentsData.length]);
        this.numPaymentsCompleted = this.paymentsData.filter(function (payment) { return payment.paid === true; }).length;
      },

      getPaymentSegmentClass: function (d) {
        if (d.paid) { 
          return 'payment-segment-paid';
        } else if (d.paid === false) {
          return 'payment-segment-unpaid';
        } else if (d.future) {
          return 'payment-segment-future';
        } else if (d.next) {
          return 'payment-segment-next';
        }
      },

      getComputedWidth: function () {
        var computedWidth = (this.circumference / this.paymentsData.length) - 5;
        if (computedWidth > this.maxSegmentWidth) {
          return this.maxSegmentWidth;
        }
        else {
          return computedWidth;
        }
      },

      buildChart: function () {

        var _this = this;
        var _a = this, innerCircleRadius = _a.innerCircleRadius, margin = _a.margin, width = _a.width, height = _a.height, paymentsRadialScale = _a.paymentsRadialScale, segmentXOffset = _a.segmentXOffset, initTransitionDuration = _a.initTransitionDuration, centerOffset = _a.centerOffset;
        var svg = d3.select('#payment-history')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + ((width + margin.left + margin.right) / 2) + ',' + (height / 2 + margin.top) + ')');
        var transitionNextPaymentSegment = function () {
          var nextPaymentSegment = svg.select('.payment-segment-next')
            .transition()
            .duration(300)
            .ease(d3.easeBackOut)
            .attr('y', function (d, i, el) { return +el[0].getAttribute('y') + _this.nextPaymentSegmentYOffset; });
        };
        var innerCircle = svg.append('circle')
          .attr('transform', 'translate(0,0)')
          .attr('r', innerCircleRadius)
          .attr('fill', 'white')
          .attr('opacity', 0)
          .attr('class', 'inner-circle')
          .transition()
          .duration(initTransitionDuration)
          .attr('opacity', 1);
        var centerTitleG = svg.append('g')
          .attr('transform', 'translate(' + 0 + ',' + -(margin.p * 3) + ')');
        var centerTextG = svg.append('g')
          .attr('transform', 'translate(' + -centerOffset + ',' + (margin.p * 2) + ')');
        var centerTitle = centerTitleG.append('text')
          .text('Completed payments')
          .attr('class', 'body-md payment-clock-title')
          .attr('opacity', 0)
          .transition()
          .duration(initTransitionDuration * 3)
          .attr('opacity', 1);
        var centerText = centerTextG.append('text');
        var centerTextAmount = centerText.append('tspan')
          .text(this.numPaymentsCompleted + " / " + this.paymentsData.length)
          .attr('class', 'payment-clock-text')
          .attr('opacity', 0)
          .transition()
          .duration(initTransitionDuration * 3)
          .attr('opacity', 1);
        var centerLink = svg.append('g')
          .attr('transform', 'translate(0,' + (margin.p * 5) + ')')
          .append('text')
          .text('View as list')
          .attr('class', 'center-text-link');
        var paymentSegments = svg.selectAll('.payment-segment')
          .data(this.paymentsData)
          .enter()
          .append('rect')
          .attr('transform', function (d, i) { return "rotate(" + (paymentsRadialScale(i) + 180) + ")"; })
          .attr('x', -segmentXOffset)
          .attr('y', innerCircleRadius)
          .attr('width', this.getComputedWidth())
          .attr('height', 0)
          .attr('class', function (d) { return _this.getPaymentSegmentClass(d); })
          .classed('payment-segment', true)
          .transition()
          .duration(initTransitionDuration)
          .ease(d3.easeBackOut)
          .delay(function (d, i) { return i * 25; })
          .attr('height', 40)
          .attr('opacity', 1)
          .on('end', function (d, i) {
            if (i === _this.paymentsData.length - 1) {
              transitionNextPaymentSegment();
            }
          });

      },

      init: function() {
        this.constructor();
        this.buildChart();
      }

    }

    window.PaymentHistory = PaymentHistory;
    PaymentHistory.init();

  });
})(jQuery);