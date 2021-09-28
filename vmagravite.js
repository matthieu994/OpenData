var vma_gravite_chart;
function vmaGraviteChart(dept, name) {
	const DATA_COUNT = 4;
	promises[4].then(function (values) {
		var vma50 		= JSON.parse(values[dept]["50kmh"]);
		var vma80to90 	= JSON.parse(values[dept]["80to90kmh"]);
		var vma110 		= JSON.parse(values[dept]["110kmh"]);
		var vma130 		= JSON.parse(values[dept]["130kmh"]);

		var indemmes 	= [vma50[0], vma80to90[0], vma110[0], vma130[0]];
		var deces 		= [vma50[1], vma80to90[1], vma110[1], vma130[1]];
		var graves 		= [vma50[2], vma80to90[2], vma110[2], vma130[2]];
		var legers 		= [vma50[3], vma80to90[3], vma110[3], vma130[3]];
		console.log(vma50);
		console.log(vma80to90);
		console.log(vma110);
		console.log(vma130);

		const labels = ["50km/h", "80-90km/h", "110km/h", "130km/h"];
		const data = {
		  	labels: labels,
		  	datasets: [
		  	  	{
		  	  	  	label: 'Indemmes',
		  	  	  	data: indemmes,
		  	  	  	backgroundColor: '#2c9c69',
		  	  	},
		  	  	{
		  	  	  	label: 'Blessés légers',
		  	  	  	data: legers,
		  	  	  	backgroundColor: '#dbba34',
		  	  	},
		  	  	{
		  	  	  	label: 'Blessés graves',
		  	  	  	data: graves,
		  	  	  	backgroundColor: '#c62f29',
		  	  	},
		  	  	{
		  	  	  	label: 'Décès',
		  	  	  	data: deces,
		  	  	  	backgroundColor: '#000000',
		  	  	}
		  	]
		};


		const config = {
		  	type: 'bar',
		  	data: data,
		  	options: {
		  	  	plugins: {
		  	  	  	title: {
		  	  	  	  display: true,
		  	  	  	  text: 'Gravité des accidents en fonction de la VMA à '+name
		  	  	  	},
		  	  	},
		  	  	responsive: true,
		  	  	scales: {
		  	  	  	x: {
		  	  	  	  stacked: true,
		  	  	  	},
		  	  	  	y: {
		  	  	  	  stacked: true
		  	  	  	}
		  	  	}
		  	}
		};

	  	vma_gravite_chart = new Chart(document.getElementById('vmagravite'), config);
	});
}
function updateVmaGraviteChart(dept, dept_name) {
  vma_gravite_chart.destroy();
  if (dept === null) {
  	vmaGraviteChart(95, "FRANCE");
  } else {
  	vmaGraviteChart(dept, dept_name);
  }
}
vmaGraviteChart(95, "FRANCE");
