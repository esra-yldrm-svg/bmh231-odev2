
const kartlar = document.querySelector('#kartlar');
const durum = document.querySelector('#durum');
const arama = document.querySelector('#arama');
const dugmeler = [...document.querySelectorAll('[data-tur]')];

let etkinlikler = [];
let tur = 'tumu';

// Etkinlik kartı oluşturma
function kartOlustur(e) {
    const kart = document.createElement('article');
    kart.className = 'kart';

    const baslik = document.createElement('h2');
    baslik.textContent = e.baslik;
    kart.append(baslik);

    const etiket = document.createElement('p');
    etiket.className = 'etiket';
    etiket.textContent = ({
        atolye: 'Atölye',
        soylesi: 'Söyleşi',
        topluluk: 'Topluluk'
    })[e.tur] || e.tur;

    kart.append(etiket);

    const bilgiler = [
        ['Tarih', new Date(e.tarih + 'T12:00:00').toLocaleDateString('tr-TR')],
        ['Yer', e.yer],
        ['Kontenjan', e.kontenjan]
    ];

    for (const [ad, deger] of bilgiler) {
        const p = document.createElement('p');
        p.textContent = ad + ': ' + deger;
        kart.append(p);
    }

    return kart;
}

// Etkinlikleri listeleme ve filtreleme
function ciz() {
    kartlar.replaceChildren();
    durum.textContent = '';

    const sorgu = arama.value.trim().toLocaleLowerCase('tr-TR');

    const sonuc = etkinlikler.filter(e =>
        (tur === 'tumu' || e.tur === tur) &&
        e.baslik.toLocaleLowerCase('tr-TR').includes(sorgu)
    );

    if (!sonuc.length) {
        durum.textContent = 'Aramanıza uygun etkinlik yok.';
        return;
    }

    sonuc.forEach(e => kartlar.append(kartOlustur(e)));
}

// Filtre butonları
dugmeler.forEach(b => {
    b.addEventListener('click', () => {
        tur = b.dataset.tur;

        dugmeler.forEach(x => {
            x.classList.toggle('secili', x === b);
            x.setAttribute('aria-pressed', String(x === b));
        });

        ciz();
    });
});

dugmeler.forEach(b => {
    b.setAttribute(
        'aria-pressed',
        String(b.classList.contains('secili'))
    );
});

// Arama işlemi
arama.addEventListener('input', ciz);

// API üzerinden etkinlikleri yükleme
async function etkinlikleriYukle() {
    durum.textContent = 'Yükleniyor...';
    kartlar.replaceChildren();

    try {
        const response = await fetch('/api/etkinlikler');

        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }

        etkinlikler = await response.json();
        ciz();

    } catch (hata) {
        console.error('API isteği başarısız:', hata);

        durum.textContent =
            'Etkinlikler yüklenemedi. Lütfen daha sonra tekrar deneyin.';
    }
}

// Etkinlik öneri formu
const form = document.querySelector('#form');
const mesaj = document.querySelector('#form-mesaj');

form.addEventListener('submit', event => {
    event.preventDefault();

    const ad = document.querySelector('#ad').value.trim();
    const tarih = document.querySelector('#tarih').value;
    const eposta = document.querySelector('#eposta').value.trim();

    const bugun = new Date();

    const bugunStr = [
        bugun.getFullYear(),
        String(bugun.getMonth() + 1).padStart(2, '0'),
        String(bugun.getDate()).padStart(2, '0')
    ].join('-');

    const hatalar = [];

    // Etkinlik adı kontrolü
    if (ad.length < 5) {
        hatalar.push('Etkinlik adı en az 5 karakter olmalı.');
    }

    // Tarih kontrolü
    if (!tarih || tarih < bugunStr) {
        hatalar.push(
            'Geçerli ve geçmişte olmayan bir tarih seçin.'
        );
    }

    // E-posta kontrolü
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eposta)) {
        hatalar.push('Geçerli bir e-posta yazın.');
    }

    // Form sonucunu gösterme
    mesaj.className = hatalar.length ? 'hata' : 'basari';

    mesaj.textContent = hatalar.length
        ? hatalar.join(' ')
        : 'Teşekkürler! Öneriniz alındı.';

    if (!hatalar.length) {
        form.reset();
    }
});

// Sayfa açıldığında etkinlikleri yükle
etkinlikleriYukle();
