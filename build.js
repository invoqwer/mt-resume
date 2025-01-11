import {resumeConfig, projectConfig} from './config.js';
import pug from 'pug';
import path from 'path';
import {stat, readdir, rmdir, unlink, mkdir, copyFile, writeFile}
  from 'fs/promises';
import {renderPDF} from './renderpdf.js';
import cp from 'child_process';

// build static website
// layout:
// dist
//  - fonts/
//  - index.html
//  - ${resumeOutputName}.pdf
const log = console.log;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const __root = path.resolve();

// recursively clean all containing files / folders
const removeFolder = async (folder) => {
  try {
    log(`===== Cleaning dir: ${folder} =====`);
    const files = await readdir(folder);
    for (const file of files) {
      const fPath = path.join(folder, file);
      const fStat = await stat(fPath);
      if (fStat.isDirectory()) {
        await removeFolder(fPath);
        log(`Removed Dir: ${file}`);
        await rmdir(fPath);
      } else if (fStat.isFile()) {
        await unlink(fPath);
        log(`Removed: ${file}`);
      }
    }
  } catch (err) {
    log(err);
  }
};

// recursively copy src folder -> dst
// e.g. copyFolder(../src/a, ../src/b) will create ../src/b/a
const copyFolder = async (src, dst) => {
  try {
    log(`===== Copying dir: ${src} to ${dst} =====`);
    dst = path.join(dst, path.parse(src).name);
    await mkdir(dst);
    const files = await readdir(src);
    for (const file of files) {
      const newSrc = path.join(src, file);
      const fStat = await stat(newSrc);
      if (fStat.isDirectory()) {
        await copyFolder(newSrc, dst);
        log(`Created dir: ${file}`);
      } else if (fStat.isFile()) {
        const newDst = path.join(dst, file);
        await copyFile(newSrc, newDst);
        log(`Copied: ${file}`);
      }
    }
  } catch (err) {
    log(err);
  }
};

(async () => {
  const pcfg = await projectConfig();
  const rcfg = await resumeConfig(pcfg);
  // outputs
  const htmlPath = path.join(pcfg.distPath, 'index.html');

  // clean dist folder
  await removeFolder(pcfg.distPath);

  // render html
  try {
    log('===== Render HTML =====');
    const resumeTemplate = pug.compileFile(
        path.join(pcfg.layoutPath, 'resume.pug'),
    );
    const resumeHTML = resumeTemplate({
      r: pcfg.resumeContent,
      pdfName: `${pcfg.resumeOutputName}.pdf`,
    });
    await writeFile(htmlPath, resumeHTML);
    log(`saved HTML: ${htmlPath}`);
  } catch (err) {
    log(err);
  }

  // copy over assets
  const fontsPath = path.join(__root, 'fonts');
  await copyFolder(fontsPath, pcfg.distPath);
  const [cssName, jsName] = ['resume.css', 'resume.js'];
  await copyFile(
      path.join(pcfg.layoutPath, cssName),
      path.join(pcfg.distPath, cssName),
  );
  await copyFile(
      path.join(pcfg.layoutPath, jsName),
      path.join(pcfg.distPath, jsName),
  );

  // render pdf
  const server = cp.spawn('node', ['index.js'], {
    detatched: true,
  });
  await sleep(500);
  await renderPDF(pcfg, rcfg, true);
  await sleep(500);
  server.kill();
})();
