(function donut3() {

	//Data array for pie
	var data = [
	  { label: 'Apache', count: 10 }, 
	  { label: 'Sioux', count: 10 },
	  { label: 'Oglala', count: 10 },
	  { label: 'Cheyenne', count: 10 },
	  { label: 'Kickapoo', count: 10 },
	  { label: 'Kiowa', count: 10 },
	  { label: 'Cochise', count: 20 },
	  { label: 'Geronimo', count: 20 }
	];

	var w = 500,
		h = 400,
		r = (Math.min(w, h) / 2) - 20;
		p = 20;

	//Colour scale
	var color = d3.scale.category20();

	//Set inner and outer radii of arcs
	var arc = d3.svg.arc()
		.outerRadius(r * 0.9)
		.innerRadius(r * 0.8);

	var key = function(d, i) {
			return d.data.label;
		}

	//Arc function for labels
	var pos = d3.svg.arc()
		.innerRadius(r + 12)
		.outerRadius(r + 15); 

	//Set layout of pie
	var pie = d3.layout.pie()
		.sort(null)
		.value(function (d) {
			return d.count;
		});

	//Weird merge function, takes two arrays
	function mergeWithFirstEqualZero(first, second){
	    //d3.set() creates an object which has array like functions, e.g. .add(), .has() etc.
		var secondSet = d3.set(); 
	    //Loop through second array and add the label from each data point to secondSet
	    second.forEach(function(d) { 
	        secondSet.add(d.label); 
	    });
	    //Create new array which takes 'first' array and filters for labels that 
	    //DO NOT match up with secondSet
		var onlyFirst = first
			.filter(function(d){ 
	            return !secondSet.has(d.label) 
	        })
	    //Iterate through the filtered array and create an object for each data point 
	    //with label and value properties, value is set to 0
			.map(function(d) { 
	            return { label: d.label, count: 0 }; 
	        });
	    //Merge/Concatenate the 'second' and newly made 'OnlyFirst' arrays and sort 
	    //in ascending order
		return d3.merge([ second, onlyFirst ])
			.sort(function(a,b) {
				return d3.ascending(a.label, b.label);
			});
	}


	//SVG
	var svg = d3.selectAll('.donut3')
		.append('svg')
		.attr('width', w)
		.attr('height', h);

	//Path Group
	var g = svg.append('g')
		.attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")
		.attr('class', 'path-group');

	//Label group
	var lg = svg.append('g')
		.attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")
		.attr('class', 'label-group');

	//Paths
	var paths = g.selectAll('path')
		.data(pie(data), key)
		.enter()
		.append('path');

	paths.attr('d', arc)
		.style('fill', function(d, i) {
			return color(i);
		})
		.each(function(d) { this._current = d; }); // store the initial angles;

	//Labels
	var labels = lg.selectAll('text')
		.data(pie(data))
		.enter()
		.append('text');

	labels.text(function(d) {
			return d.data.label;
		})
	    .attr("transform", function(d) {
	    	return "translate(" + (pos.centroid(d)) + ")";
	    })
	    .attr("text-anchor", "middle");

	//Click handler
	d3.select('#donut3-btn').on('click', function() {

		//Declare new data
		var dataset = [
			{ label: 'Apache', count: 10 }, 
			{ label: 'Oglala', count: 3 },
			{ label: 'Sioux', count: 32 },
			{ label: 'Kiowa', count: 45 },
			{ label: 'Cochise', count: 10 }, 
			{ label: 'Geronimo', count: 25 },
			{ label: 'Cheyenne', count: 17 },
			{ label: 'Haiti', count: 14 },
			{ label: 'Kickapoo', count: 10 }, 
			{ label: 'jericho', count: 20 },
			{ label: 'kite', count: 30 },
			{ label: 'Feta', count: 40 }
		];

		//Set new colour scale
		color = d3.scale.category20();

		//arcTween function
		function arcTween(d) {	
		  var i = d3.interpolate(this._current, d);
		  return function(t) {
		    return arc(i(t));
		  };
		}

		var data0 = svg.select('g').selectAll("path")
			.data()
			.map(function(d) {
				return d.data;
			});

	    //If there is no current data, set data0 to randomized data
		if (data0.length == 0) data0 = dataset;

	    //First merge for 'was' var returns an array of the new
	    //randomised data with the new, randomised / *missing* elements from the join,
	    //the new elements have been given values of 0
		var was = mergeWithFirstEqualZero(dataset, data0);
	    //Second merge for 'is' var returns an array of just the 
	    //new randomised data with the old data but the old data
	    //values set to 0
		var is = mergeWithFirstEqualZero(data0, dataset);

		//Arcs Data join, update selection
		paths = g.datum(was).selectAll('path').data(pie, key);

		//Enter selection
		var pathEnter = paths.enter();		

		//Enter new elements
		pathEnter.append('path')
/*			.style('fill', function(d, i) {
				return color(i);
			})*/
			.each(function(d) {
				this._current = d;
			});				

		paths = g.datum(is).selectAll('path').data(pie, key);

		//Update
		paths.transition().duration(1000)
			.style('fill', function(d, i) {
				return color(i);
			})
			.attrTween('d', arcTween);

		paths = g.datum(dataset).selectAll('path').data(pie, key);

		//Exit selection
		var pathExit = paths.exit();

		//Remove old arcs
		pathExit.transition().delay(1000).duration(0)
			.remove();
		
		labels.transition().duration(500).style('fill-opacity', 0);

		//Data join, update selection
		labels = lg.datum(dataset).selectAll('text').data(pie, key);

		//Enter
		var labelsEnter = labels.enter();

		labelsEnter.append('text')
				.style('fill-opacity', 0)
				.attr("transform", function(d) {
			    	return "translate(" + (pos.centroid(d)) + ")";
			    })
			    .attr("text-anchor", "middle")
			    .text(function(d) {
					return d.data.label;
				})
				.transition()
				.delay(1000)
			    .duration(500)
			    .style('fill-opacity', 1);

		//Exit
		var labelsExit = labels.exit();

		//Remove old labels
		labelsExit.remove();

		setTimeout(function() {
			//Center
			labels.attr("transform", function(d) {
			    	return "translate(" + (pos.centroid(d)) + ")";
			    })
			    .attr("text-anchor", "middle")
			    .text(function(d) {
					return d.data.label;
				})
				.transition()
				.delay(500)
			    .duration(500)
			    .style('fill-opacity', 1)
			}, 400);

	});

})();
