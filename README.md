
# Kampüs Etkinlik Panosu

BMH231 Ödev 2 kapsamında geliştirilmiş, kampüs etkinliklerini listeleyen ve etkinlik önerisi alınmasını sağlayan web uygulamasıdır.

## Kullanılan Teknolojiler

- HTML5 (Semantik HTML)
- CSS3 (Grid, Flexbox, Responsive Tasarım)
- JavaScript
- Node.js
- Git ve GitHub

## Proje Özellikleri

- Kampüs etkinliklerini listeleme
- Etkinlik başlığına göre arama
- Etkinlik türüne göre filtreleme
- Mobil cihazlara uyumlu tasarım
- Etkinlik öneri formu
- Form doğrulama ve kullanıcıya geri bildirim
- REST API üzerinden etkinlik verilerini görüntüleme

## Kurulum

```bash
git clone https://github.com/esra-yldrm-svg/bmh231-odev2.git
cd bmh231-odev2
npm start
```

Tarayıcıdan http://localhost:3000 adresini açın.

## API Uç Noktaları

| Yöntem | Yol | Açıklama |
|---|---|---|
| GET | / | Ana sayfa |
| GET | /api/etkinlikler | Tüm etkinlikler |
| GET | /api/etkinlikler?tur=atolye | Etkinlik türüne göre filtreleme |
| GET | /api/etkinlikler/3 | ID ile tek etkinlik |

## Testler

- Mobil görünüm kontrolü
- Lighthouse erişilebilirlik testi
- API GET isteklerinin kontrolü
- Form doğrulama testi
- Ağ performansının incelenmesi

## Geliştirici

Esra Yıldırım

Yozgat Bozok Üniversitesi

Bilgisayar Mühendisliği

BMH231 - Ödev 2
