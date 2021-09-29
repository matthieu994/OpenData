let vma_gravite_chart, all_values_vma_bar;

function vmaGraviteChart(values) {
  const DATA_COUNT = 4;
  all_values_vma_bar = values;

  let [indemnes, deces, graves, legers] = getVMADataForDept(95);

  const labels = ["50km/h", "80-90km/h", "110km/h", "130km/h"];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Indemnes",
        data: indemnes,
        backgroundColor: "#2c9c69",
      },
      {
        label: "Blessés légers",
        data: legers,
        backgroundColor: "#dbba34",
      },
      {
        label: "Blessés graves",
        data: graves,
        backgroundColor: "#c62f29",
      },
      {
        label: "Décès",
        data: deces,
        backgroundColor: "#000000",
      },
    ],
  };

  const config = {
    type: "bar",
    data: data,
    options: {
      plugins: {
        title: {
          display: true,
          text: "Gravité des accidents en fonction de la VMA en FRANCE",
        },
      },
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  };

  vma_gravite_chart = new Chart(document.getElementById("vmagravite"), config);
}
d3.csv(
  "https://raw.githubusercontent.com/matthieu994/OpenData/master/data/vmaGraviteData.csv"
).then((data) => vmaGraviteChart(data));

function updateVmaGraviteChart(dept, dept_name) {
  let code = dept;

  if (dept === null) {
    code = 95;
    vma_gravite_chart.options.plugins.title.text =
      "Gravité des accidents en fonction de la VMA en FRANCE";
  } else {
    vma_gravite_chart.options.plugins.title.text =
      "Gravité des accidents en fonction de la VMA en " + dept_name;
  }

  let [indemnes, deces, graves, legers] = getVMADataForDept(code);
  vma_gravite_chart.data.datasets[0].data = indemnes;
  vma_gravite_chart.data.datasets[1].data = legers;
  vma_gravite_chart.data.datasets[2].data = graves;
  vma_gravite_chart.data.datasets[3].data = deces;
  vma_gravite_chart.update();
}

function getVMADataForDept(dept) {
  if (!all_values_vma_bar[dept]) dept = 75;

  var vma50 = JSON.parse(all_values_vma_bar[dept]["50kmh"]);
  var vma80to90 = JSON.parse(all_values_vma_bar[dept]["80to90kmh"]);
  var vma110 = JSON.parse(all_values_vma_bar[dept]["110kmh"]);
  var vma130 = JSON.parse(all_values_vma_bar[dept]["130kmh"]);

  return [
    [vma50[0], vma80to90[0], vma110[0], vma130[0]],
    [vma50[1], vma80to90[1], vma110[1], vma130[1]],
    [vma50[2], vma80to90[2], vma110[2], vma130[2]],
    [vma50[3], vma80to90[3], vma110[3], vma130[3]],
  ];
}
