const fs = require('fs');
const path = require('path');

const { readdir } = require('node:fs/promises');
const { stat } = require('fs');

const filesPath = path.join(__dirname, 'secret-folder');

readdir(filesPath, { withFileTypes: true })
  .then((data) => {
    data.forEach((file) => {
      let dataFileName = path.join(filesPath, file.name);

      if (file.isFile()) {
        let fileName = file.name.split('.')[0];
        let fileExt = file.name.split('.')[1];

        stat(dataFileName, (err, stats) => {
          let fileSize = (stats.size / 1024).toFixed(3);
          console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
        });
      }
    });
  })
  .catch((err) => console.error(err));