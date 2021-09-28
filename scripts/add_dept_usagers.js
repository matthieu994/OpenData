const fs = require("fs");
const parse = require("csv-parse");
const { exit } = require("process");

// Add dept to usagers
fs.readFile("./usagers-2019.csv", "utf8", (err, usagers) => {
  if (err) {
    console.error(err);
    return;
  }

  fs.readFile("./caracteristiques-2019-test.csv", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const dict = {};
    let output = "";
    const parser_depts = parse(data, {
      delimiter: ",",
    });
    const parser = parse(usagers, {
      delimiter: ";",
    });

    // Associate num and dept
    parser_depts.on("readable", function () {
      let record = parser_depts.read();

      const handle = (num, dept) => {
        dict[num] = dept;
      };

      while ((record = parser_depts.read())) {
        handle(record[0], record[6]);
        if (record[6] == 75) {
          handle(record[0], record[7]);
        }
      }
    });

    parser.on("readable", function () {
      let record = parser.read();
      if (record.includes("dept")) exit();
      record.push("dept");
      output += record.join(";");

      while ((record = parser.read())) {
        record.push(dict[record[0]]);
        output += "\n" + record.join(";");
      }
      fs.writeFile("./usagers-2019.csv", output, (err, _) => {
        if (err) console.log(err);
      });
    });
  });
});
