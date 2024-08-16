import fs from 'node:fs';
import { parse } from 'csv-parse';

// const csvPath = new URL("./tasks", import.meta.url);

// const stream = fs.createReadStream(csvPath);

// const csvParse = parse({
//   delimiter: ",",
//   skipEmptyLines: true,
//   fromLine: 2 // skip the header line
// });

// const readAndParseCSV = stream.pipe(csvParse);

async function execute() {
  const readAndParseCSV = fs.createReadStream("./tasks.csv")
  .pipe(parse({
    delimiter: ","
  }));

  for await (const line of readAndParseCSV) {
    const [ title, description ] = line;

    await fetch("http://localhost:3333/tasks", {
      method: "POST",
      body: JSON.stringify({
        title,
        description
      })
    });

    await watchingExecution(1000);
  }
}

execute();

function watchingExecution(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
