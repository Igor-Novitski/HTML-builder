const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const targetFile = path.join(__dirname, 'text.txt');
const doc = fs.createWriteStream(targetFile, 'utf-8');

stdout.write('Привет. Ввидите какой-нибудь текст: \n');

stdin.on('data', data => {
  const text = data.toString().trim();
  if (text === 'exit') process.exit();
  doc.write(data);
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('Конец программы. Удачи!'));
