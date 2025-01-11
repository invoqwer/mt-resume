import puppeteer from 'puppeteer';
import path from 'path';

const log = console.log;
const renderPDF = async (pcfg, rcfg, saveFile=false) => {
  const pdfName = `${pcfg.resumeOutputName}.pdf`;
  const pdfPath = (saveFile) ? path.join(pcfg.distPath, pdfName) : '';
  log('===== Render PDF =====');
  const browser = await puppeteer.launch({
    headless: true,
    // needed for proper font rendering
    args: ['--font-render-hinting=none'],
  });
  const page = await browser.newPage();
  await page.goto(`http://localhost:${pcfg.port}/`, {
    // waitUntil: 'domcontentloaded',
    waitUntil: 'networkidle0',
  });
  // removeClass
  page.on('console', (consoleObj) => console.log(consoleObj.text()));
  const removeClass = rcfg.removeClass;
  log(`=> Removing Debug Classes: ${removeClass}`);
  await page.evaluate((cls) => {
    cls.forEach((tag) => {
      const elems = document.getElementsByClassName(tag);
      console.log(`Class: ${tag} - Num elems: ${elems.length}`);
      while (elems.length) {
        elems[0].classList.remove(tag);
      }
    });
  }, removeClass);
  // removeElement
  const removeElement = rcfg.removeElement;
  log(`=> Removing Debug Elements: ${removeElement}`);
  await page.evaluate((cls) => {
    cls.forEach((tag) => {
      const elems = document.getElementsByClassName(tag);
      console.log(`Class: ${tag} - Num elems: ${elems.length}`);
      while (elems.length) {
        elems[0].remove();
      }
    });
  }, removeElement);
  // generate pdf
  let pdf;
  try {
    pdf = await page.pdf({
      // format: 'A4',
      // width: '2480px',
      // height: '3508px',
      format: 'Letter',
      // width: '2551px',
      // height: '3295px',
      path: pdfPath,
      printBackground: true,
      pageRanges: '1',
    });
    if (pdfPath) {
      log(`saved PDF: ${pdfPath}`);
    }
  } catch (err) {
    log(err);
  }
  await browser.close();
  return pdf;
};

export {
  renderPDF as renderPDF,
};
