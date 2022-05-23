const fs = require('fs');
const path = require('path');
const { stdout } = process;

const targetFolder = path.join(__dirname, 'secret-folder');

async function readFolder(folder) {
  const files = await fs.promises.readdir(folder, { withFileTypes: true });
  for (let file of files) {
    if (file.isFile()) {
      let name = file.name.slice(0, file.name.lastIndexOf('.'));
      let extension = path.extname(file.name).slice(1);
      let stats = await fs.promises.stat(path.join(folder, file.name));
      stdout.write(`${name} - ${extension} - ${(stats.size / 1024).toFixed(3)} kb\n`);
    }
  }
}

try {
  readFolder(targetFolder);
} catch (error) {
  console.log(error.message);
}