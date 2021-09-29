let securite_gravite_chart, all_values_securite_bar;

function securiteGraviteChart(values) {
  const DATA_COUNT = 4;
  all_values_securite_bar = values;

  let [indemnes, deces, graves, legers, tot] = getSecuriteDataForDept(95);
  console.log([indemnes, deces, graves, legers, tot]);
  const CHART_COLORS = {
    fi: "#2c9c69",
    s: "#dbba34",
    t: "#c62f29",
    fo: "#000000",
  };
  var data_accidents = [
    (indemnes / tot) * 100,
    (deces / tot) * 100,
    (graves / tot) * 100,
    (legers / tot) * 100,
  ];
  console.log(data_accidents);
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
    type: "doughnut",
    data,
    options: {
      responsive: false,
      plugins: {
        legend: {
          position: "right",
        },
        title: {
          display: true,
          text: "Gravité de blessure de l'usager en FRANCE",
        },
      },
    },
  };

  securite_gravite_chart = new Chart(document.getElementById("securite_gravite"), config);
}
d3.json("data/securityEquipaments.json").then((data) => securiteGraviteChart(data));

function updateSecuriteGraviteChart(dept, dept_name) {
  let code = parseInt(dept);

  if (dept === null) {
    code = 95;
    securite_gravite_chart.options.plugins.title.text =
      "Gravité des accidents en fonction de l'utilisation des équipaments de securité en FRANCE";
  } else {
    securite_gravite_chart.options.plugins.title.text =
      "Gravité des accidents en fonction de l'utilisation des équipaments de securité à " +
      dept_name;
  }

  let [indemnes, deces, graves, legers, tot] = getSecuriteDataForDept(code);
  console.log(securite_gravite_chart.data.datasets);
  securite_gravite_chart.data.datasets[0].data[0] = (indemnes / tot) * 100;
  securite_gravite_chart.data.datasets[0].data[1] = (legers / tot) * 100;
  securite_gravite_chart.data.datasets[0].data[2] = (graves / tot) * 100;
  securite_gravite_chart.data.datasets[0].data[3] = (deces / tot) * 100;
  securite_gravite_chart.update();
}
function getSecuriteDataForDept(dept, vehicle) {

  if (!all_values_securite_bar[dept]) dept = "all";
  else dept = String(dept);
  var vma50 = all_values_securite_bar[dept][vehicle];
  // console.log(vma50);
  // var vma80to90 = JSON.parse(all_values_securite_bar[dept]["80to90kmh"]);
  // var vma110 = JSON.parse(all_values_securite_bar[dept]["110kmh"]);
  // var vma130 = JSON.parse(all_values_securite_bar[dept]["130kmh"]);

  return [
    [vma50["1"]], // vma80to90[0], vma110[0], vma130[0]],
    [vma50["2"]], // vma80to90[1], vma110[1], vma130[1]],
    [vma50["3"]], // vma80to90[2], vma110[2], vma130[2]],
    [vma50["4"]], //vma80to90[3], vma110[3], vma130[3]],
    [vma50["tot"]],
  ];
}
document.querySelector("#selectVehicle").addEventListener("change", (e) => {
   const vehicle = e.target.value;
});
