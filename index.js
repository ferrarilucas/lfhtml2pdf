import { chromium } from 'playwright';
import { fs } from 'fs';
import { path } from 'path';

function isBrowserDownloaded(browserPath) {
  return fs.existsSync(browserPath);
}
async function downloadBrowsers() {
  await require('playwright').downloadBrowser('chromium');
}
async function main(base64String) {
  const browsersPath = path.join(process.env.HOME || process.env.USERPROFILE, '.cache/ms-playwright');
 if (!isBrowserDownloaded(path.join(browsersPath, 'chromium'))){
  downloadBrowsers();
 }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Decodifica a string base64 para HTML
  const htmlContent = Buffer.from(base64String, 'base64').toString('utf8');

  // Carrega o HTML no navegador headless
  await page.setContent(htmlContent, { waitUntil: 'networkidle' });
  const finalHtml = await page.content();
  const pdf = await page.pdf({ path: "teste.pdf", format: "A4", printBackground: true, margin: { top: "0", right: "0", bottom: "0", left: "0" } });

  console.log(pdf.toString('base64'));
  await browser.close();
}

const [,,htmlBase64Input] = process.argv;

if (!htmlBase64Input) {
  console.log('Por favor, forneça uma string base64 como argumento.');
  process.exit(1);
}

main(htmlBase64Input)
  .then((pdfBase64) => console.log(pdfBase64))
  .catch((error) => console.error('Erro ao gerar PDF:', error));
