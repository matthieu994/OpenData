(() => {
        const DATA_COUNT = 4;

        const CHART_COLORS = {
          fi: '#2c9c69',
          s: '#dbba34',
          t: '#c62f29',
          fo: '#000000'
        };

        var sum = 55314+53307+20858+3498;
        const data = {
        labels: ['Indemmes', 'Blessés légers', 'Blessés graves', 'Décès'],
        datasets: [
        {
          label: 'Comment se portent les accidentés après accident (pourcentage)',
          data: [55314/sum*100, 53307/sum*100, 20858/sum*100, 3498/sum*100],
          backgroundColor: Object.values(CHART_COLORS),
        }]};
          
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
              text: 'Comment se portent les accidentés après accident'
              }
            }
          },
        };
          
        var pieChart = new Chart(
          document.getElementById('gravite'),
          config);
      })();