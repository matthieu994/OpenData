(() => {
	Promise.all(promises).then(function (values) {
		const csv = values[4];
		
		
		const allData = [csv[93]["50kmh"], csv[93]["80-90kmh"], csv[93]["110kmh"], csv[93]["130kmh"]]
		console.log(allData)
		
		const DATA_COUNT = 4;

		const CHART_COLORS = {
			red: 'rgb(255, 99, 132)',
			orange: 'rgb(255, 159, 64)',
			yellow: 'rgb(255, 205, 86)',
			green: 'rgb(75, 192, 192)',
			blue: 'rgb(54, 162, 235)',
			purple: 'rgb(153, 102, 255)',
			grey: 'rgb(201, 203, 207)'
		};

		const data = {
			labels: ['50 km/h', '80 à 90 km/h', '110 km/h', '130 km/h'],
			datasets: [
			{
				label: 'Dataset 1',
				data: allData,
				backgroundColor: Object.values(CHART_COLORS),
			}
			]
		};
		
		const config = {
			type: 'pie',
			data: data,
			options: {
				responsive: true,
				plugins: {
					legend: {
					position: 'top',
				  },
				  title: {
					display: true,
					text: 'Accidents par vitesses maximales autorisées'
				  }
				}
			},
		};
		  
		var pieChart = new Chart(
			document.getElementById('max_speed_pie_chart'),
			config);
	});
})();
