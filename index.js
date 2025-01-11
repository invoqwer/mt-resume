import browserSync from 'browser-sync';
import express from 'express';
import path from 'path';
import {resumeConfig, projectConfig} from './config.js';
import {renderPDF} from './renderpdf.js';

const bs = browserSync.create();
const log = console.log;

// Select which resume version to render
// version should match the folder name
// Example:
// v1-technical.yaml
// v1: resume version
// technical: layout to use

const __root = path.resolve();
const fontsPath = path.join(__root, 'fonts');

(async () => {
  let pcfg = await projectConfig();
  let rcfg = await resumeConfig(pcfg);

  const app = express();
  app.use(express.static(pcfg.layoutPath));
  app.use('/fonts', express.static(fontsPath));
  app.set('view engine', 'pug');
  app.set('views', pcfg.layoutPath);
  const pdfPath = path.join(pcfg.distPath, `${pcfg.resumeOutputName}.pdf`);
  const pdfName = `${pcfg.resumeOutputName}.pdf`;
  app.use(`/${pdfName}`, express.static(pdfPath));

  // dev
  app.get('/', async (_, res) => {
    pcfg = await projectConfig();
    res.render('resume', {
      r: pcfg.resumeContent,
      pdfName: `./${pdfName}`,
    });
  });

  // prod
  app.get('/dist', (_, res) => {
    res.sendFile(path.join(__root, 'dist', 'index.html'));
  });

  // pdf
  app.get('/pdf', async (_, res) => {
    pcfg = await projectConfig();
    rcfg = await resumeConfig(pcfg);
    const pdf = await renderPDF(pcfg, rcfg, false);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdf.length,
      'Content-Disposition': `inline;filename=${pcfg.resumeOutputName}.pdf`,
    });
    res.send(pdf);
    bs.exit();
  });

  // serve
  app.listen(pcfg.port, () => {
    log(`MT Resume: http://localhost:${pcfg.port}`);

    // browsersync for live reload
    bs.init({
      proxy: `localhost:${pcfg.port}`,
      files: ['**/*.*'], // watch all files
      port: pcfg.port+1,
      open: true,
      notify: false,
    });
  });
})();


