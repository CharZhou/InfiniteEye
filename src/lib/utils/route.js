const fs = require('fs');
const path = require('path');

const Router = require('koa-router');

async function loadRoutes (app) {
  const router = new Router();
  async function loadRoute (routeFile) {
    const route = require(routeFile.substring(0, routeFile.lastIndexOf('.')));
    router.use(route.basePath, route.router.routes());
  }

  async function listDir (baseDir) {
    const fileList = fs.readdirSync(baseDir, 'utf-8');

    for await (const filename of fileList) {
      const stat = fs.lstatSync(`${baseDir}/${filename}`);
      if (!stat.isDirectory()) {
        await loadRoute(`${baseDir}/${filename}`);
      }
    }
  }

  await listDir(path.join(__dirname, '../../framework/routes'));
  await app.use(router.routes());
}

module.exports = {
  loadRoutes,
};
