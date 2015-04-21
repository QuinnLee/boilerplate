var timeFormat = d3.time.format("%Y-%m-%d");

var dateCountLineChart = dc.lineChart('#date-count-line-chart');

d3.csv('vendor/data/challenge_clientdata.csv', function(error, csv){
  csv.forEach(function(datum) {
    datum.initial_visit_date = timeFormat.parse(datum.initial_visit_date);
    datum.latitude = Number(datum.latitude);
    datum.longitude = Number(datum.longitude);
    datum.product_count = Number(datum.product_count);
  });
  var crossData = crossfilter(csv);

  var cityDimension = crossData.dimension(function(d) { return d.city;});
  var referrerCodeDimension = crossData.dimension(function(d) { return d.referrer_code;});
  var productCountDimension = crossData.dimension(function(d) { return d.product_count;});
  var dateDimension = crossData.dimension(function(d) { return d.initial_visit_date;});

  var add = function(p,v){
    ++p.count;
    p.clients.add(v.client_id);
    p.product_sum += v.product_count;
    return p;
  };
  var remove = function(p,v){
    --p.count;
    p.clients.remove(v.client_id);
    p.product_sum -= v.product_count;
    return p;
  };
  var inital = function(){ return { count: 0, clients: d3.set(), product_sum: 0 } }

  var cityGroup = cityDimension.group().reduce(add, remove, inital);
  var referrerCodeGroup = referrerCodeDimension.group().reduce(add, remove, inital);
  var productCountGroup = productCountDimension.group().reduce(add, remove, inital);
  var dateGroup = dateDimension.group().reduce(add, remove, inital);

  dateCountLineChart
    .height(300)
    .width(800)
    .margins({top: 0, right: 30, bottom: 40, left: 50})
    .dimension(dateDimension)
    .group(dateGroup)
    .elasticX(true)
    .x(d3.time.scale())
    .xUnits(d3.time.years)
    .valueAccessor(function (d) {
      return d.value.clients;
    })



  dc.renderAll();
});

