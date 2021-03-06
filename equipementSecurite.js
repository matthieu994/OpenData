let securite_gravite_chart, all_values_securite_bar;
let securite_gravite_dept,
  selected_vehicle = "allVehiclesSeverity";

function securiteGraviteChart(values) {
  all_values_securite_bar = values;

  let [indemnes, deces, graves, legers, tot] = getSecuriteDataForDept(95);
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
  const data = {
    labels: ["Indemnes", "Blessés légers", "Blessés graves", "Décès"],
    datasets: [
      {
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
          text: "Gravité des accidents en fonction du type de véhicule en FRANCE",
        },
      },
    },
  };

  securite_gravite_chart = new Chart(document.getElementById("securite_gravite"), config);
  secuGraviteChart(values);
}
d3.json(
  "https://raw.githubusercontent.com/matthieu994/OpenData/master/data/securityEquipements.json"
).then((data) => securiteGraviteChart(data));

function updateSecuriteGraviteChart(dept, dept_name, vehicle) {
  let code = dept ? dept : securite_gravite_dept;

  if (!vehicle) {
    if (dept === null) {
      code = 95;
      securite_gravite_chart.options.plugins.title.text =
        "Gravité des accidents en fonction du type de véhicule en FRANCE";
    } else {
      securite_gravite_chart.options.plugins.title.text =
        "Gravité des accidents en fonction du type de véhicule en " + dept_name + "";
    }
  }

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
  var data = all_values_securite_bar[dept][vehicle];

  return [[data["1"]], [data["2"]], [data["3"]], [data["4"]], [data["tot"]]];
}
document.querySelector("#selectVehicle").addEventListener("change", (e) => {
  selected_vehicle = e.target.value;
  updateSecuriteGraviteChart(null, null, selected_vehicle);
});
