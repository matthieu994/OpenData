let gravite_chart;
var sum = 55314 + 53307 + 20858 + 3498;
const data_accidents = [
  (55314)/* / sum) * 100*/,
  (53307)/* / sum) * 100*/,
  (20858)/* / sum) * 100*/,
  (3498 )/*/ sum) * 100*/,
];

function graviteChart() {
  const DATA_COUNT = 4;

  const CHART_COLORS = {
    fi: "#2c9c69",
    s: "#dbba34",
    t: "#c62f29",
    fo: "#000000",
  };

  const data = {
    labels: ["Indemmes", "Blessés légers", "Blessés graves", "Décès"],
    datasets: [
      {
        label: "Comment se portent les accidentés après accident (pourcentage)",
        data: data_accidents,
        backgroundColor: Object.values(CHART_COLORS),
      },
    ],
  };

  const config = {
    type: "pie",
    data,
    options: {
      responsive: false,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Gravité de blessure de l'usager en FRANCE",
        },
      },
    },
  };

  gravite_chart = new Chart(document.getElementById("gravite"), config);
}

function updateGraviteChart(dept, dept_name) {
  if (dept === null) {
    gravite_chart.data.datasets[0].data = data_accidents;
    gravite_chart.options.plugins.title.text =
      "Gravité de blessure des usagers en FRANCE";
  } else {
    gravite_chart.data.datasets[0].data = distrib_dept_gravite[`${parseInt(dept)}`];
    gravite_chart.options.plugins.title.text =
      "Gravité de blessure des usagers à " + dept_name;
  }
  gravite_chart.update();
}

graviteChart();
