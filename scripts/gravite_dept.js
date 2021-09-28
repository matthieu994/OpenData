const fs = require("fs");
const parse = require("csv-parse");
const { exit } = require("process");

// Add dept to usagers
fs.readFile("./usagers-2019.csv", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const output_gravite = {};
  const parser = parse(data, {
    delimiter: ";",
  });

  // Associate num and dept
  parser.on("readable", function () {
    let record = parser.read();

    const handle = (dept) => {
      let gravite = parseInt(record[5]) - 1;
      let index = gravite == 1 ? 3 : gravite == 3 ? 1 : gravite;
      if (!output_gravite[dept]) output_gravite[dept] = new Array(4).fill(0);

      output_gravite[dept][index]++;
    };

    while ((record = parser.read())) {
      handle(record[record.length - 1]);
      if (record[record.length - 1].substr(0, 2) == 75) handle(75);
    }

    fs.writeFile(
      "../data/distrib_gravite.json",
      JSON.stringify(output_gravite),
      (err, _) => {
        if (err) console.log(err);
      }
    );
  });
});
