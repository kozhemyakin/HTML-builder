const fs = require('fs');
const path = require('path');

const { stdin, stdout } = process;

const writing = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const reading = fs.createReadStream(path.join(__dirname, 'index.js'));

stdout.write('Hi there! Please enter any text...\n');

stdin.on('data', (data) => {
  if (data.toString().includes('exit')) {
    stdout.write('All entered text was saved in text.txt file of the exercise folder. See you soon!');
    process.exit();
  }
  fs.appendFile(path.join(__dirname, 'text.txt'), data, (err) => {
    if (err) throw err;
  });
});

process.on('SIGINT', () => {
  stdout.write('All entered text was saved in text.txt file of the exercise folder. See you soon!');
  process.exit();
});