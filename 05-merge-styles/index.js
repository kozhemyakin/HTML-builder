const path = require('path');
const { createReadStream, createWriteStream } = require('fs');
const { rm, readdir } = require('node:fs/promises');

const filesPathStyles = path.join(__dirname, 'styles');
const filesPathBundle = path.join(__dirname, 'project-dist', 'bundle.css');

async function readStylesFolder(filePath, bundle) {
  try {
    await rm(bundle, { force: true });
    const files = await readdir(filePath, { withFileTypes: true });

    for (const file of files) {
      let fileExt = file.name.split('.')[1];
      if (file.isFile() && fileExt === 'css') {
        let bundleChunk = createReadStream(path.join(filePath, file.name), 'utf-8');
        bundleChunk.pipe(createWriteStream(bundle, { flags: 'a' }));
      }
    }
    console.log('Success! All styles from the styles folder file are saved into bundle.css');

  } catch (err) {
    console.error(err);

  }
}

readStylesFolder(filesPathStyles, filesPathBundle);