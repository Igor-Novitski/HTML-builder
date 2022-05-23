const fs = require('fs');
const path = require('path');
const { stdout } = process;

const targetFolder = path.join(__dirname, 'files');
const newFolder = path.join(__dirname, 'files-copy');

async function copyFolder(folder) {
  try {
    const files = await fs.promises.readdir(folder, { withFileTypes: true });
    await fs.promises.rm(path.join(__dirname, 'files-copy'), { recursive: true, force: true });
    await fs.promises.mkdir(path.join(__dirname, 'files-copy'), { recursive: true });
    for (let file of files) {
      if (file.isFile()) {
        await fs.promises.copyFile(path.join(folder, file.name), path.join(newFolder, file.name));
      }
    }
    stdout.write('Задача выполнена успешно!');
  } catch (error) {
    stdout.write(error.message);
  }
}

copyFolder(targetFolder);
