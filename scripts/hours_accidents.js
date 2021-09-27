const fs = require("fs");
const parse = require("csv-parse");

fs.readFile("./caracteristiques-2019-test.csv", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  fs.readFile("./population.csv", "utf8", (err, pop) => {
    if (err) {
      console.error(err);
      return;
    }

    const output = {};
    const parser = parse(data, {
      delimiter: ",",
    });
    const sum_accidents = {};
    let output_pop = "";
    const parser_pop = parse(pop, {
      delimiter: ",",
    });

    parser.on("readable", function () {
      let record = parser.read();
      let dept;
      while ((record = parser.read())) {
        dept = record[6];

        if (!output[dept]) output[dept] = new Array(24).fill(0);
        if (!sum_accidents[dept]) sum_accidents[dept] = 0;

        output[dept][parseInt(record[4].substr(0, 2))]++;
        sum_accidents[dept]++;
      }

      fs.writeFile(
        "../data/distrib_hours_accidents_dept.json",
        JSON.stringify(output),
        (err, _) => {
          if (err) console.log(err);

          parser_pop.on("readable", function () {
            let record = parser_pop.read(),
              dept;
            record.push("ACCIDENTS");
            output_pop += record.join(",");
            while ((record = parser_pop.read())) {
              dept = !record[0].match(/[A-Z]/gi) ? parseInt(record[0]) : record[0];
              record.push(sum_accidents[dept]);
              output_pop += "\n" + record.join(",");
            }

            fs.writeFile("../data/pop_accidents.csv", output_pop, (err, _) => {
              if (err) console.log(err);
            });
          });
        }
      );
    });
  });
});
