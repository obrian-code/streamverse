import 'zone.js/dist/zone-node';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { AppServerModule } from './src/app/app.server.module';

const commonEngine = new CommonEngine();

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  server.get('*', (req, res, next) => {
    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: req.url,
        publicPath: browserDistFolder,
        providers: [{ provide: 'REQUEST', useValue: req }],
      })
      .then(html => res.send(html))
      .catch(err => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`StreamVerse SSR server listening on http://localhost:${port}`);
  });
}

declare const __non_webpack_require__: any;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === fileURLToPath(import.meta.url)) {
  run();
}

export default app;
