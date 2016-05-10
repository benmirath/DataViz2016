//App resources
var graph;
var DataType = {
    GOAL:"Goal",
    PLEDGED:"Pledged",
    PLEDGEHYPE:"PledgeHype",
    BACKERS:"Backers",
    BACKERHYPE:"BackerHype"
};

var appLimit = 50;
var appSort = "goal";
var appScaler = DataType.GOAL;

function generateGraph (data) {
    data.forEach(function(d) {
        d.Goal = parseInt (d.Goal);
        d.Pledged = parseInt (d.Pledged);
        d.PledgeHype = parseFloat (d.PledgeHype);
        d.Backers = parseInt(d.Backers);
        d.BackerHype = parseFloat(d.BackerHype);
        d.launched_at = new Date(d.launched_at);
        d.created_at = new Date(d.created_at);
        d.deadline = new Date(d.deadline);
    });
    graph = new Graph (data, appLimit);
    graph.setup ();
     $('#entriesSlider').on ("input", function (e) {
        var size = $(e.target).attr("value");
        resize (size);
    });
     $('#entriesLabel').on ("input", function (e) {
        var size = $(e.target).attr("value");
        resize (size);
     });
}

var Graph = function (_data, limit) {
	var obj = {};

	var margin = {top: 50, right: 100, bottom: 300, left: 100};
    var width = window.innerWidth - margin.left - margin.right;
    var height = window.innerHeight - margin.top - margin.bottom;

    var svg, chart,                	
    	xScale, yScale, 
    	xAxis, yAxis;

	var setupChart = function () {
		svg = d3.select('body')
            .append('svg')
            .attr('width', window.innerWidth)
            .attr('height', window.innerHeight)
            ;

        chart = svg.append('g')
            .attr('transform', 'translate('+margin.left+', '+margin.top+')')
            ;

        // Appending the axis
        chart.append('g')
            .attr('transform', 'translate(0, '+height+')')
            .attr('class', 'x axis')
            ;
        chart.append('g')
            .attr('class', 'y axis')
            ;

        $("#entriesSlider").attr('max', obj.data.length);
	}
	var setupControls = function () {
		var textStartY = height + 30;
		chart.append('text')
			.attr("id", "tooltipHeader")
			.attr("x", 0)
			.attr("y", textStartY)
			.text("Hover on a bar for more info.")
			.attr("font-weight", "bold")
			;

		textStartY += 30;
		chart.append('text')
			.attr("id", "tooltipDescription")
			.attr("x", 0)
			.attr("y", textStartY)
			.text("")
			;

		textStartY += 30;
		chart.append('text')
			.attr("id", "tooltipGoalLabel")
			.attr("x", 0)
			.attr("y", textStartY)
			.text("")
			;
		chart.append('text')
			.attr("id", "tooltipGoal")
			.attr("x", 45)
			.attr("y", textStartY)
			.text("")
			;

		textStartY += 30;	
		chart.append('text')
			.attr("id", "tooltipPledgedLabel")
			.attr("x", 0)
			.attr("y", textStartY)
			.text("")
			;
		chart.append('text')
			.attr("id", "tooltipPledged")
			.attr("x", 70)
			.attr("y", textStartY)
			.text("")
			;

		textStartY += 30;
		chart.append('text')
			.attr("id", "tooltipBackersLabel")
			.attr("x", 0)
			.attr("y", textStartY)
			.text("")
			;
		chart.append('text')
			.attr("id", "tooltipBackers")
			.attr("x", 70)
			.attr("y", textStartY)
			.text("")
			;
	}
	obj.data = _data;
	obj.subSelection;
    obj.yData;
    obj.xLimit = limit;
    obj.currentSort = appSort;
    obj.currentScaler = appScaler;
    
    obj.invertSort = false;
	obj.setup = function () {
        setupChart();
        setupControls();

        obj.fullSort();
        obj.update();
	};

	obj.fullSort = function () {
		var ascending = false;
       	var adj = ascending ? 1 : -1;
		obj.data.sort(function (a,b) {
			if (a[obj.currentScaler] > b[obj.currentScaler]) 
				return 1 * adj;
			else if (a[obj.currentScaler] < b[obj.currentScaler]) 
				return -1 * adj;
			else 
				return 0;
		});
	}

	obj.update = function () {
		obj.subSelection = obj.data.slice(0, obj.xLimit);
		console.log (obj.subSelection);

		var adj = obj.invertSort ? 1 : -1;
       	obj.subSelection.sort(function (a,b) {
       		if (obj.currentSort === "launched_at") {
       			return (a[obj.currentSort].getTime() - b[obj.currentSort].getTime()) * adj;
       		} else {
       			if (a[obj.currentSort] > b[obj.currentSort]) 
    				return 1 * adj;
    			else if (a[obj.currentSort] < b[obj.currentSort]) 
    				return -1 * adj;
    			else 
    				return 0;
       		}
			
		});

        console.log ("boop");

		//=====SCALE======
		var min = d3.min (obj.subSelection, function(d,i) { return d[obj.currentScaler]; });
        var max = d3.max (obj.subSelection, function(d,i) { return d[obj.currentScaler]; });       
		xScale = d3.scale.ordinal()
            .range([0, width])           // output (min, max)
            ;
        yScale = d3.scale.linear()
            .domain([min, max])
            .range([height, 0])           // output (min, max)
            ;   
    	
    	//=====AXIS======
        xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            ;
        yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            ;
        chart.select ('.x.axis')
        	.transition()
            .duration(2000)
        	.call(xAxis)
        	;
        chart.select ('.y.axis')
        	.transition()
            .duration(2000)
        	.call(yAxis)
        	;

        //====CLEAR TEXT======
        $('#tooltipHeader')
    		.text("Hover on a bar for more info")
    		;
    	$('#tooltipDescription')
    		.text("")
    		;
    	$('#tooltipGoalLabel')
    		.text("")
    		;
    	$('#tooltipGoal')
    		.text("")
    		;
    	$('#tooltipPledgedLabel')
    		.text("")
    		;
    	$('#tooltipPledged')
    		.text("")
    		;
    	$('#tooltipBackersLabel')
    		.text("")
    		;
    	$('#tooltipBackers')
    		.text("")
    		;

        $('#entriesLabel')
            // .text(obj.xLimit)
            .attr("value", obj.xLimit)
            ;
        //=====DRAW DATA======
        var barWidth = width / obj.xLimit;
        var barFill = barWidth * .85;
        
        var bar = chart.selectAll ('rect')
        	.data(obj.subSelection)
        	;
        var barEnter = bar.enter()
        	.append ('rect')
        	;
        var barUpdate = bar
        	.filter(function (d,i) { return i < obj.xLimit; })	//limit to top 50 options
        	.transition()
            .duration(2000)
        	.attr ('class', 'bar')
        	.attr ('x', function (d, i) { return (width / obj.xLimit) * i; })
        	.attr ('width', barFill)
        	.attr ("y", function(d, i) { 
        		var _y = yScale(d[obj.currentScaler]); 
        		if (_y === height) {
        			_y = height;
        		}
        		return _y;
        	})
        	.attr ("height", function(d) { 
        		var _height = height - yScale(d[obj.currentScaler])
        		if (_height === 0) {
        			_height = 6;
        		}
        		return _height; 
        	})
        	;
        var barInteraction = bar
        	.on ('mouseover', function (d, i) {
        		chart.select('#tooltipHeader')
        			.text(d["name"] + " - (Launched on " + d["launched_at"].toDateString() + ")");
        		chart.select('#tooltipDescription')
        			.text(d["blurb"]);
        		$('#tooltipGoalLabel')
        			.text("Goal:");
            	$('#tooltipGoal')
            		.text(d["Goal"]);
            	$('#tooltipPledgedLabel')
            		.text("Pledged: ");
            	$('#tooltipPledged')
            		.text(d["Pledged"] + " - Hype Value (" + d["PledgeHype"] + ")");
            	$('#tooltipBackersLabel')
            		.text("Backers: ");
            	$('#tooltipBackers')
            		.text(d["Backers"] + " - Hype Value (" + d["BackerHype"] + ")");
        	})
        var barExit = bar.exit()
        	.remove()
        	;	

        console.log ("boop");
	};

	return obj;
}

function resort () {
    console.log ("resort");
	var sort = document.getElementById("resort").value;
	var currentSort = graph.currentSort;
	var currentScaler = graph.currentScaler;
	console.log(sort)
	console.log(sort === "Total");
	console.log(sort == "Total");
	if (sort === "Time") {
		currentSort = "launched_at";
		// console.log ()
	} else if (sort === "Total") {
		if (currentScaler === "Goal" || currentScaler === "Pledged" || currentScaler === "Backers") {
			currentSort = currentScaler;	
		} else {
			if (currentScaler === "PledgeHype") {
				currentSort = "Pledged";
			} else if (currentScaler === "BackerHype") {
				currentSort = "Backers";
			} else {
    			console.log("nuthin");
    		}

		} 
	} else if (sort === "Hype") {

		if (currentScaler === "PledgeHype" || currentScaler === "BackerHype") {
			currentSort = currentScaler;
		} else {
			if (currentScaler === "Goal" || currentScaler === "Pledged") {
				currentSort = "PledgeHype";
			} else if (currentScaler === "Backers") {
				currentSort = "BackerHype";
			}
		}
	}

	// console.log(currentSort);
	// console.log(graph.currentSort);
	graph.currentSort = currentSort;
	graph.update();
}

function rescale () {
	console.log ("rescale");
	graph.currentScaler = document.getElementById("rescale").value;
	resort();
	graph.update ();
}
function invertSort () {
	console.log ("click logged!");
	graph.invertSort = !graph.invertSort;
	graph.update ();
}
function resize(val) {
    console.log ("resize");
	// console.log ($("#entriesSlider").attr('value'));
	graph.xLimit = val;
    $("#entriesSlider").attr('value', val);
	$("#entriesLabel").text(val);
	graph.update ();
}