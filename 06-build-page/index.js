const path = require('path');
const fs = require('fs');
const { createReadStream, createWriteStream } = require('fs');
const { mkdir, rm, readdir, copyFile, readFile, writeFile } = require('node:fs/promises');
const pathProjectDist = path.join(__dirname, 'project-dist');
const pathSourseAssets = path.join(__dirname, 'assets');
const pathCopyAssets = path.join(pathProjectDist, 'assets');

rm(pathCopyAssets, { recursive: true, force: true })
  .then(() => {
    mkdir(pathCopyAssets, { recursive: true })
      .then(() => {
        createIndexHtml();
      })
      .then(() => {
        copyDir(pathSourseAssets, pathCopyAssets);
      })
      .then(() => {
        readStylesFolder(pathStyles, pathBundle);
      })
      .then(() => {
        console.log('Project successfully build!');
      });
  })
  .catch((error) => console.log(error));

function copyDir(pathSourseAssets, pathCopyAssets) {
  readdir(pathSourseAssets, { withFileTypes: true })
    .then((data) => {
      data.forEach((file) => {
        let fileLink = path.join(pathSourseAssets, file.name);
        let fileToCopy = path.join(pathCopyAssets, file.name);

        if (file.isDirectory()) {
          rm(fileToCopy, { recursive: true, force: true }).then((err) => {
            if (err) console.log(err);

            mkdir(fileToCopy, { recursive: true }).then((err) => {
              if (err) console.log(err);
              copyDir(fileLink, fileToCopy);
            });
          });
        } else {
          copyFile(fileLink, fileToCopy).then((err) => {
            if (err) console.log(err);
          });
        }
      });
    })
    .catch((error) => console.error(error));
}

const pathStyles = path.join(__dirname, 'styles');
const pathBundle = path.join(pathProjectDist, 'style.css');

async function readStylesFolder(filePath, bundle) {
  try {
    const files = await readdir(filePath, { withFileTypes: true });

    for (const file of files) {
      let fileExt = file.name.split('.')[1];
      if (file.isFile() && fileExt === 'css') {
        let bundleChunk = createReadStream(path.join(filePath, file.name), 'utf-8');
        bundleChunk.pipe(createWriteStream(bundle, { flags: 'a' }));
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function createIndexHtml() {
  try {
    const tamplate = await readFile(path.join(__dirname, 'template.html'), 'utf-8', (err) => {
      console.log(err);
    });

    let tamplateHTML = tamplate;

    const files = await readdir(path.join(__dirname, 'components'), { withFileTypes: true });

    for (const file of files) {
      const pathToComponents = path.join(__dirname, 'components', file.name);
      let fileExt = file.name.split('.')[1];
      let fileName = file.name.split('.')[0];
      if (file.isFile() && fileExt === 'html') {
        let readHtml = await readFile(pathToComponents, 'utf8');
        let regexp = new RegExp(`{{${fileName}}}`);

        tamplateHTML = tamplateHTML.replace(regexp, readHtml);
      }
    }

    await writeFile(path.join(pathProjectDist, 'index.html'), tamplateHTML);
  } catch (err) {
    console.log(err);
  }
}