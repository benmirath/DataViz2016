//App resources
var graph;
var DataType = {
    GOAL:"Goal",
    PLEDGED:"Pledged",
    PLEDGEHYPE:"PledgeHype",
    BACKERS:"Backers",
    BACKERHYPE:"BackerHype"
};

var someData;

function generateGraph (data, _appLimit, _appSort, _appScaler, _wrapper) {
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
    graph = new Graph (_wrapper);
    graph.setup (data, _appLimit, _appSort, _appScaler, _wrapper);
    $('#entriesLabel').on ("input", function (e) {
        var size = e.target.value;
        resize (size);
        refreshData ();
    });
    $('#entriesLabel').on ("blur", function (e) {
        console.log ("leaving");
        console.log (e.target.value);
        var size = e.target.value;
        console.log (size);
        console.log (graph.data);
        if (Number(size) > graph.data.length) {
            graph.xLimit = graph.data.length;
            _appLimit = graph.data.length;
            e.target.value = graph.data.length;
        }
    });
    $('.nav li').on ('click', function (e) {
        if (!e.target.classList.contains ("active")) {
             $('.nav li').each (function (index, value) {
                value.classList.remove("active");
            });

            if (e.target.dataset.target === "mainGraphWrapper") {
                $('#controllerNest').addClass ("active");
            } else {
                $('#controllerNest').removeClass ("active");
            }

            dat = e;
            e.target.classList.add ('active');

            $('.hiderContent.active').removeClass('active');
            $('#' + e.target.dataset.target).addClass ('active');
        }


        
    });
}


var dat;
function generateSideGraph1 (data, _appLimit, _appSort, _appScaler) {
    var sideGraph1Access ='/kickspotterAlt1?' 
        + 'category=' + "Video Games"
        + '&limit=' + 10
        + '&orderBy=' + "Backers"
        + '&sortType=' + (_inverseSort ? 1 : -1)
        ;

    d3.json(sideGraph1Access, function(error, data){
        console.log('called load data');
        if(error){
            console.log(error);
            // console.log('\');
        }else{
            console.log(data);
            // resort ();
            // generateSideGraph1 (data, _appLimit, _appSort, _appScaler, "#sideContent2");

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
            sideGraph1 = new Graph ("sideContent2");
            sideGraph1.setup (data, 10, _appSort, _appScaler, "sideContent2");

            refreshData ();
            // resort ();
        }
    });  
}
var sideGraph1;
// function generateSideGraph1 (data, _appLimit, _appSort, _appScaler, _wrapper) {
//     data.forEach(function(d) {
//         d.Goal = parseInt (d.Goal);
//         d.Pledged = parseInt (d.Pledged);
//         d.PledgeHype = parseFloat (d.PledgeHype);
//         d.Backers = parseInt(d.Backers);
//         d.BackerHype = parseFloat(d.BackerHype);
//         d.launched_at = new Date(d.launched_at);
//         d.created_at = new Date(d.created_at);
//         d.deadline = new Date(d.deadline);
//     });
//     console.log (_wrapper);
//     sideGraph1 = new Graph (_wrapper);
//     sideGraph1.setup (data, _appLimit, _appSort, _appScaler, _wrapper);
// }


var Graph = function (_wrapper) {
	var obj = {};
    console.log (_wrapper);
	var margin = {top: 50, right: 100, bottom: 300, left: 100};
   
    // var wrapper = $('#mainGraphWrapper');
    // someData = wrapper;
    // console.log (wrapper);
    var wrapper = $('#' + _wrapper)
    var width = wrapper.innerWidth() - margin.left - margin.right;
    var height = wrapper.innerHeight() - margin.top - margin.bottom;
    // var width = window.innerWidth - margin.left - margin.right;
    // var height = window.innerHeight - margin.top - margin.bottom;
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return d['name'];
        })
        ;             

    var svg, chart,                	
    	xScale, yScale, 
    	xAxis, yAxis;

    // console.log (someData);

    obj.data;
    obj.xLimit;
    obj.currentSort;
    obj.currentScaler;

    obj.subSelection;
    obj.yData;

    
    obj.invertSort = false;
    
    obj.setup = function (data, _appLimit, _appSort, _appScaler, _wrapper) {
        setupChart(data, _appLimit, _appSort, _appScaler, _wrapper);
        setupControls();

        // obj.fullSort();
        obj.update();
    };

	var setupChart = function (_data, _appLimit, _appSort, _appScaler, _wrapper) {
        obj.data = _data;
        obj.xLimit = _appLimit;
        obj.currentSort = _appSort;
        obj.currentScaler = _appScaler;

        console.log(_wrapper);
		svg = d3.select('#' + _wrapper)
            .append('svg')
            .attr('width', window.innerWidth)
            .attr('height', window.innerHeight)
            ;

        svg.call(tip);

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
			.attr("id", _wrapper + '_' + "tooltipHeader")
			.attr("x", 0)
			.attr("y", textStartY)
			.text("Hover on a bar for more info.")
			.attr("font-weight", "bold")
			;

		textStartY += 30;
		chart.append('text')
			.attr("id", _wrapper + '_' + "tooltipDescription")
			.attr("x", 0)
			.attr("y", textStartY)
			.text("")
			;

		textStartY += 30;
		chart.append('text')
			.attr("id", _wrapper + '_' + "tooltipGoalLabel")
			.attr("x", 0)
			.attr("y", textStartY)
			.text("")
			;
		chart.append('text')
			.attr("id", _wrapper + '_' + "tooltipGoal")
			.attr("x", 45)
			.attr("y", textStartY)
			.text("")
			;

		textStartY += 30;	
		chart.append('text')
			.attr("id", _wrapper + '_' + "tooltipPledgedLabel")
			.attr("x", 0)
			.attr("y", textStartY)
			.text("")
			;
		chart.append('text')
			.attr("id", _wrapper + '_' + "tooltipPledged")
			.attr("x", 70)
			.attr("y", textStartY)
			.text("")
			;

		textStartY += 30;
		chart.append('text')
			.attr("id", _wrapper + '_' + "tooltipBackersLabel")
			.attr("x", 0)
			.attr("y", textStartY)
			.text("")
			;
		chart.append('text')
			.attr("id", _wrapper + '_' + "tooltipBackers")
			.attr("x", 70)
			.attr("y", textStartY)
			.text("")
			;
	}
    
	
	// obj.fullSort = function () {
	// 	var ascending = false;
 //       	var adj = ascending ? 1 : -1;
	// 	obj.data.sort(function (a,b) {
	// 		if (a[obj.currentScaler] > b[obj.currentScaler]) 
	// 			return 1 * adj;
	// 		else if (a[obj.currentScaler] < b[obj.currentScaler]) 
	// 			return -1 * adj;
	// 		else 
	// 			return 0;
	// 	});
	// }

    obj.set = function (__data, __appLimit, __appSort, __appScaler) {
        console.log ("SETTING");
        obj.data = __data;
        obj.data.forEach(function(d) {
            d.Goal = parseInt (d.Goal);
            d.Pledged = parseInt (d.Pledged);
            d.PledgeHype = parseFloat (d.PledgeHype);
            d.Backers = parseInt(d.Backers);
            d.BackerHype = parseFloat(d.BackerHype);
            d.launched_at = new Date(d.launched_at);
            d.created_at = new Date(d.created_at);
            d.deadline = new Date(d.deadline);
        });

        obj.xLimit = obj.xLimit = __appLimit;
        obj.currentSort = __appSort;
        obj.currentScaler = __appScaler;
    }

	obj.update = function () {
		// obj.subSelection = obj.data.slice(0, obj.xLimit);
        obj.subSelection = obj.data;
		// console.log (obj.subSelection);

		// var adj = obj.invertSort ? 1 : -1;
  //      	obj.subSelection.sort(function (a,b) {
  //      		if (obj.currentSort === "launched_at") {
  //      			return (a[obj.currentSort].getTime() - b[obj.currentSort].getTime()) * adj;
  //      		} else {
  //      			if (a[obj.currentSort] > b[obj.currentSort]) 
  //   				return 1 * adj;
  //   			else if (a[obj.currentSort] < b[obj.currentSort]) 
  //   				return -1 * adj;
  //   			else 
  //   				return 0;
  //      		}
			
		// });

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
        $('#' +_wrapper + '_' + 'tooltipHeader')
    		.text("Hover on a bar for more info")
    		;
    	$('#' +_wrapper + '_' + 'tooltipDescription')
    		.text("")
    		;
    	$('#' +_wrapper + '_' + 'tooltipGoalLabel')
    		.text("")
    		;
    	$('#' +_wrapper + '_' + 'tooltipGoal')
    		.text("")
    		;
    	$('#' +_wrapper + '_' + 'tooltipPledgedLabel')
    		.text("")
    		;
    	$('#' +_wrapper + '_' + 'tooltipPledged')
    		.text("")
    		;
    	$('#' +_wrapper + '_' + 'tooltipBackersLabel')
    		.text("")
    		;
    	$('#' +_wrapper + '_' + 'tooltipBackers')
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
        		chart.select('#' +_wrapper + '_' + 'tooltipHeader')
        			.text(d["name"] + " - (Launched on " + d["launched_at"].toDateString() + ")");
        		chart.select('#' +_wrapper + '_' + 'tooltipDescription')
        			.text(d["blurb"]);
        		$('#' +_wrapper + '_' + 'tooltipGoalLabel')
        			.text("Goal:");
            	$('#' +_wrapper + '_' + 'tooltipGoal')
            		.text(d["Goal"]);
            	$('#' +_wrapper + '_' + 'tooltipPledgedLabel')
            		.text("Pledged: ");
            	$('#' +_wrapper + '_' + 'tooltipPledged')
            		.text(d["Pledged"] + " - Hype Value (" + d["PledgeHype"] + ")");
            	$('#' +_wrapper + '_' + 'tooltipBackersLabel')
            		.text("Backers: ");
            	$('#' +_wrapper + '_' + 'tooltipBackers')
            		.text(d["Backers"] + " - Hype Value (" + d["BackerHype"] + ")");

                tip.show (d);
        	})
            .on ('mouseout', function (d, i) {
                tip.hide (d);
            })
            ;
        var barExit = bar.exit()
        	.remove()
        	;
	};

	return obj;
}

function resort () {

	var sort = document.getElementById("resort").value;
    console.log (sort);
	var currentSort = graph.currentSort;
	var currentScaler = graph.currentScaler;
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

    _appSort = currentSort;
	graph.currentSort = _appSort;
    // refreshData ();
    // refreshGraph ();
	// graph.update();
}


function invertSort () {
	console.log ("click logged!");
    _inverseSort = !_inverseSort;
	graph.invertSort = _inverseSort;
    var labelString = _inverseSort ? "Invert" : "Uninvert";
    document.getElementById ("xInverter").value = labelString;
    refreshData ();
}
function resize(val) {
    val = Number (val);
    _appLimit = val;
    graph.xLimit = val;
    // refreshData ();
}
function rescale () {
    _appScaler = document.getElementById("rescale").value;
    console.log (_appScaler);
    graph.currentScaler = _appScaler;
}
function refreshCategory () {
    var newCategory = document.getElementById("category").value;
    _appCategory = newCategory;
    refreshData ();
}

function refreshData () {
    rescale ();
    resort ();
    access = urlChain ();
    d3.json(access, function(error, data) {
        console.log('called load data');
        if(error){
            console.log(error);
        }else{
            console.log(data);
            console.log(data.length);
            if ( _appLimit > data.length) {
                graph.xLimit = data.length;
                _appLimit = data.length;
                $('#entriesLabel').attr ("value", data.length);
            }
            graph.set (data, _appLimit, _appSort, _appScaler);
            graph.update ();
        }
    });

    // var currentLimit = $('#entriesLabel').attr("value");

    // console.log (currentLimit);
}

var _appLimit = 50;
var _appSort = "launched_at";  //Time, Total, Hype
var _appScaler = DataType.GOAL;
var _appCategory = "Apps";
var _inverseSort = false;
function urlChain () {
    var newString ='/kickspotter?' 
        + 'category=' + _appCategory
        + '&limit=' + _appLimit
        + '&orderBy=' + _appSort
        + '&sortType=' + (_inverseSort ? 1 : -1)
        ;
    return newString;
}

var access = urlChain ();

d3.json(access, function(error, data){
    console.log('called load data');
    if(error){
        console.log(error);
        // console.log('\');
    }else{
        console.log(data);
        // resort ();
        generateGraph (data, _appLimit, _appSort, _appScaler, "mainGraphWrapper");
        refreshData ();
        // resort ();
    }
});  

d3.json(access, function(error, data){
    console.log('called load data');
    if(error){
        console.log(error);
    }else{
        console.log(data);
        generateSideGraph1 (data, 10, _appSort, _appScaler);
        refreshData ();
    }
});  
