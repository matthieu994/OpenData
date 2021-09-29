let secu_gravite_chart, all_values_secu_bar;

function secuGraviteChart(values) {
  const DATA_COUNT = 2;
  all_values_secu_bar = values;
  let [indemnes, deces, graves, legers] = getSecuDataForDept("all");

  const labels = ["Avec ceinture", "Sans ceinture"];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Indemmes",
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
          text: "Gravité des accidents en fonction du port de la ceinture en FRANCE (pourcentage)",
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

  secu_gravite_chart = new Chart(document.getElementById("secugravite"), config);
}
d3.json("https://raw.githubusercontent.com/matthieu994/OpenData/master/data/securityEquipaments.json").then((data) => secuGraviteChart(data));

function updateSecuGraviteChart(dept, dept_name) {
  if (dept === null) {
    code = "all";
    secu_gravite_chart.options.plugins.title.text =
      "Gravité des accidents en fonction du port de la ceinture en FRANCE (pourcentage)";
  } else {
    code = dept;
    secu_gravite_chart.options.plugins.title.text =
      "Gravité des accidents en fonction du port de la ceinture à " + dept_name + " (pourcentage)";
  }

  let [indemnes, deces, graves, legers] = getSecuDataForDept(code);
  secu_gravite_chart.data.datasets[0].data = indemnes;
  secu_gravite_chart.data.datasets[1].data = legers;
  secu_gravite_chart.data.datasets[2].data = graves;
  secu_gravite_chart.data.datasets[3].data = deces;
  secu_gravite_chart.update();
}

function getSecuDataForDept(dept) {
  if (!all_values_secu_bar[dept]) dept = "75";

  var val = all_values_secu_bar[dept];

  return [
    [val["car"]["belt"]["1"]/val["car"]["belt"]["tot"]*100, val["car"]["nothing"]["1"]/val["car"]["nothing"]["tot"]*100],
    [val["car"]["belt"]["4"]/val["car"]["belt"]["tot"]*100, val["car"]["nothing"]["4"]/val["car"]["nothing"]["tot"]*100],
    [val["car"]["belt"]["3"]/val["car"]["belt"]["tot"]*100, val["car"]["nothing"]["3"]/val["car"]["nothing"]["tot"]*100],
    [val["car"]["belt"]["2"]/val["car"]["belt"]["tot"]*100, val["car"]["nothing"]["2"]/val["car"]["nothing"]["tot"]*100],
  ];
}
