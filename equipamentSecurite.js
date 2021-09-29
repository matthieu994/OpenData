let securite_gravite_chart, all_values_securite_bar;
let securite_gravite_dept,
  selected_vehicle = "allVehiclesSeverity";

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
    (legers / tot) * 100,
    (graves / tot) * 100,
    (deces / tot) * 100,
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
d3.json(
  "https://raw.githubusercontent.com/matthieu994/OpenData/master/data/securityEquipaments.json"
).then((data) => securiteGraviteChart(data));

function updateSecuriteGraviteChart(dept, dept_name, vehicle) {
  let code = dept ? parseInt(dept) : securite_gravite_dept;

  if (dept && dept_name) {
    if (dept === null) {
      code = 95;
      securite_gravite_chart.options.plugins.title.text =
        "Gravité des accidents en fonction de l'utilisation des équipaments de securité en FRANCE";
    } else {
      securite_gravite_chart.options.plugins.title.text =
        "Gravité des accidents en fonction de l'utilisation des équipaments de securité à " +
        dept_name;
    }
  }

  console.log(code, vehicle);
  let [indemnes, deces, graves, legers, tot] = getSecuriteDataForDept(code, vehicle);
  securite_gravite_chart.data.datasets[0].data[0] = (indemnes / tot) * 100;
  securite_gravite_chart.data.datasets[0].data[1] = (legers / tot) * 100;
  securite_gravite_chart.data.datasets[0].data[2] = (graves / tot) * 100;
  securite_gravite_chart.data.datasets[0].data[3] = (deces / tot) * 100;
  securite_gravite_chart.update();
}
function getSecuriteDataForDept(dept, vehicle = selected_vehicle) {
  securite_gravite_dept = dept;
  if (!vehicle) vehicle = selected_vehicle;

  if (!all_values_securite_bar[dept]) dept = "all";
  else dept = String(dept);
  var vma50 = all_values_securite_bar[dept][vehicle];

  console.log(dept, vehicle, vma50);

  return [[vma50["1"]], [vma50["2"]], [vma50["3"]], [vma50["4"]], [vma50["tot"]]];
}
document.querySelector("#selectVehicle").addEventListener("change", (e) => {
  selected_vehicle = e.target.value;
  updateSecuriteGraviteChart(null, null, selected_vehicle);
});
