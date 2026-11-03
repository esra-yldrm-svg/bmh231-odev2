
const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const root = path.resolve(__dirname, 'public');

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8'
};

function send(res, status, body, type = 'text/plain; charset=utf-8', extra = {}) {
  res.writeHead(status, {
    'Content-Type': type,
    ...extra
  });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  let url;

  try {
    url = new URL(req.url, 'http://localhost:3000');
  } catch {
    return send(res, 400, 'Geçersiz istek');
  }

  console.log(req.method, url.pathname + url.search);

  if (req.method !== 'GET') {
    return send(
      res,
      405,
      'Yönteme izin verilmiyor',
      'text/plain; charset=utf-8',
      { Allow: 'GET' }
    );
  }

  // API istekleri
  if (
    url.pathname === '/api/etkinlikler' ||
    /^\/api\/etkinlikler\/\d+$/.test(url.pathname)
  ) {
    try {
      const dosya = path.join(__dirname, 'etkinlikler.json');
      const items = JSON.parse(await fs.readFile(dosya, 'utf8'));

      // Tüm etkinlikler veya türe göre filtreleme
      if (url.pathname === '/api/etkinlikler') {
        const secilenTur = url.searchParams.get('tur');

        const sonuc = secilenTur === null
          ? items
          : items.filter(item => item.tur === secilenTur);

        return send(
          res,
          200,
          JSON.stringify(sonuc),
          'application/json; charset=utf-8'
        );
      }

      // ID ile tek etkinlik
      const id = Number(url.pathname.split('/').pop());
      const item = items.find(x => x.id === id);

      return send(
        res,
        item ? 200 : 404,
        JSON.stringify(item || { hata: 'Etkinlik bulunamadı' }),
        'application/json; charset=utf-8'
      );

    } catch (hata) {
      console.error('API hatası:', hata);

      return send(
        res,
        500,
        JSON.stringify({ hata: 'Sunucu hatası' }),
        'application/json; charset=utf-8'
      );
    }
  }

  // Statik dosya istekleri
  let relative;

  try {
    relative = decodeURIComponent(
      url.pathname === '/' ? '/index.html' : url.pathname
    );
  } catch {
    return send(res, 400, 'Geçersiz dosya yolu');
  }

  // Windows dahil tüm sistemlerde yol güvenliği
  if (relative.includes('\\') || relative.includes('\0')) {
    return send(res, 400, 'Geçersiz dosya yolu');
  }

  const target = path.resolve(root, '.' + relative);

  if (!target.startsWith(root + path.sep)) {
    return send(res, 404, 'Sayfa bulunamadı');
  }

  const type = types[path.extname(target)];

  if (!type) {
    return send(res, 404, 'Sayfa bulunamadı');
  }

  try {
    const icerik = await fs.readFile(target);
    return send(res, 200, icerik, type);

  } catch (hata) {
    if (hata.code !== 'ENOENT') {
      console.error('Dosya okuma hatası:', hata);
    }

    return send(res, 404, 'Sayfa bulunamadı');
  }
});

server.listen(3000, () => {
  console.log('Sunucu çalışıyor: http://localhost:3000');
});
