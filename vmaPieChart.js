let vma_chart, all_data_vma, csv_file;

function vmaChart(csv) {
  csv_file = csv;
  all_data_vma = [
    csv[95]["50kmh"],
    csv[95]["80-90kmh"],
    csv[95]["110kmh"],
    csv[95]["130kmh"],
  ];
  console.log(all_data_vma);

  const DATA_COUNT = 4;

  const CHART_COLORS = {
    red: "rgb(255, 99, 132)",
    orange: "rgb(255, 159, 64)",
    yellow: "rgb(255, 205, 86)",
    green: "rgb(75, 192, 192)",
    blue: "rgb(54, 162, 235)",
    purple: "rgb(153, 102, 255)",
    grey: "rgb(201, 203, 207)",
  };

  const data = {
    labels: ["50 km/h", "80 à 90 km/h", "110 km/h", "130 km/h"],
    datasets: [
      {
        label: "Dataset 1",
        data: all_data_vma,
        backgroundColor: Object.values(CHART_COLORS),
      },
    ],
  };

  const config = {
    type: "pie",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Accidents par vitesses maximales autorisées en FRANCE",
        },
      },
    },
  };

  vma_chart = new Chart(document.getElementById("max_speed_pie_chart"), config);
}
d3.csv("data/vmaData.csv").then((data) => vmaChart(data));

function updateVMAChart(dept, dept_name) {
  if (dept === null) {
    vma_chart.options.plugins.title.text =
      "Accidents par vitesses maximales autorisées en FRANCE";
  } else {
    vma_chart.options.plugins.title.text =
      "Accidents par vitesses maximales autorisées à " + dept_name;
  }

  vma_chart.data.datasets[0].data = getDataForDepartement(dept);

  vma_chart.update();
}

function getDataForDepartement(dept) {
  if (dept === null) {
    return all_data_vma;
  } else {
    if (!csv_file[dept - 1]) dept = 75;
    return [
      csv_file[dept - 1]["50kmh"],
      csv_file[dept - 1]["80-90kmh"],
      csv_file[dept - 1]["110kmh"],
      csv_file[dept - 1]["130kmh"],
    ];
  }
}
