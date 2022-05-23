const fs = require('fs');
const path = require('path');
const { stdout } = process;

const targetFolder = path.join(__dirname, 'styles');
const bundleFile = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));


async function createBundleFile(folder) {
  try {
    const files = await fs.promises.readdir(folder, { withFileTypes: true });
    for (let file of files) {
      let extension = path.extname(file.name).slice(1);
      if (file.isFile() && extension === 'css') {
        let stream = fs.createReadStream(path.join(folder, file.name), 'utf-8');
        stream.pipe(bundleFile);
      }
    }
    stdout.write('Задача выполнена успешно! Ваши стили готовы.');
  } catch (error) {
    stdout.write(error.message);
  }
}

createBundleFile(targetFolder);
