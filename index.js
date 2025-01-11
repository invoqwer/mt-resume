import express from 'express';
import path from 'path';
import {resumeConfig, projectConfig} from './config.js';
import {renderPDF} from './renderpdf.js';

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
  const pcfg = await projectConfig();
  const rcfg = await resumeConfig(pcfg);

  const app = express();
  app.use(express.static(pcfg.layoutPath));
  app.use('/fonts', express.static(fontsPath));
  app.set('view engine', 'pug');
  app.set('views', pcfg.layoutPath);
  const pdfPath = path.join(pcfg.distPath, `${pcfg.resumeOutputName}.pdf`);
  const pdfName = `${pcfg.resumeOutputName}.pdf`;
  app.use(`/${pdfName}`, express.static(pdfPath));

  // html
  app.get('/', async (req, res) => {
    res.render('resume', {
      r: pcfg.resumeContent,
      pdfName: `./${pdfName}`,
    });
  });

  // pdf
  app.get('/pdf', async (req, res) => {
    const pdf = await renderPDF(pcfg, rcfg, false);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdf.length,
      'Content-Disposition': `inline;filename=${pcfg.resumeOutputName}.pdf`,
    });
    res.send(pdf);
  });

  app.listen(pcfg.port, () => {
    log(`MT Resume: http://localhost:${pcfg.port}`);
  });
})();


