const fs = require('fs');
const path = require('path');

const { mkdir, readdir, copyFile } = require('node:fs/promises');

const filesPathCopy = path.join(__dirname, 'files-copy');
const filesPathCurrent = path.join(__dirname, 'files');

mkdir(filesPathCopy, { recursive: true })
  .then((err) => {
    if (err) console.log(err);
  })
  .catch((error) => console.error(error));

function copyDir(current, copy) {
  readdir(current, { withFileTypes: true }).then((data) => {
    data.forEach((file) => {
      let fileLink = path.join(current, file.name);
      let fileToCopy = path.join(copy, file.name);
      copyFile(fileLink, fileToCopy).then((err) => {
        if (err) console.log(err);
      });
    });
  });
}

copyDir(filesPathCurrent, filesPathCopy);