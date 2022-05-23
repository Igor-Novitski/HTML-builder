const fs = require('fs');
const path = require('path');
const { stdout } = process;

const sourceCssFolder = path.join(__dirname, 'styles');
const assetsFolder = path.join(__dirname, 'assets');
const newAssetsFolder = path.join(__dirname, 'project-dist', 'assets');
const sourceHtml = path.join(__dirname, 'template.html');
const components = path.join(__dirname, 'components');

async function createHtmlFile(sourceFile, components) {
  try {
    let newHtmlFile = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
    const files = await fs.promises.readdir(components, { withFileTypes: true });

    let stream = fs.createReadStream(sourceFile, 'utf-8');
    let data = '';
    stream.on('data', chunk => data += chunk);
    stream.on('end', () => {

      let dataHtml = data;
      for (let file of files) {
        let extension = path.extname(file.name).slice(1);
        if (file.isFile() && extension === 'html') {
          let streamComp = fs.createReadStream(path.join(components, file.name), 'utf-8');
          let dataComp = '';
          streamComp.on('data', chunk => dataComp += chunk);
          streamComp.on('end', () => {
            let name = file.name.slice(0, file.name.lastIndexOf('.'));
            dataHtml = dataHtml.replace(new RegExp(`{{${name}}}`, 'g'), dataComp);
            if (file == files[files.length - 1]) newHtmlFile.write(`${dataHtml}\n`);;
          });
        }
      }
    });
  } catch (error) {
    stdout.write(error.message);
  }
}

async function copyFolder(folder, target) {
  try {
    const files = await fs.promises.readdir(folder, { withFileTypes: true });
    for (let file of files) {
      if (file.isFile()) {
        await fs.promises.copyFile(path.join(folder, file.name), path.join(target, file.name));
      } else if (file.isDirectory()) {
        await fs.promises.mkdir(path.join(target, file.name));
        await copyFolder(path.join(folder, file.name), path.join(target, file.name));
      }
    }
  } catch (error) {
    stdout.write(error.message);
  }
}

async function createStyles(folder) {
  try {
    const bundleCssFile = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
    const files = await fs.promises.readdir(folder, { withFileTypes: true });
    for (let file of files) {
      let extension = path.extname(file.name).slice(1);
      if (file.isFile() && extension === 'css') {
        let stream = fs.createReadStream(path.join(folder, file.name), 'utf-8');
        stream.pipe(bundleCssFile);
      }
    }
  } catch (error) {
    stdout.write(error.message);
  }
}

async function buildPage() {
  try {
    await fs.promises.rm(path.join(__dirname, 'project-dist'), { recursive: true, force: true });
    await fs.promises.mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true });
    createHtmlFile(sourceHtml, components);
    copyFolder(assetsFolder, newAssetsFolder);
    createStyles(sourceCssFolder);
    stdout.write('Задача выполнена успешно!');
  } catch (error) {
    stdout.write(error.message);
  }
}

buildPage();