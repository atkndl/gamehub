# 🎮 GameHub - Çok Oyunculu Türkçe Wordle & Parti Oyunları

Modern, ferah arayüzlü, hem mobilde hem masaüstünde kusursuz çalışan çok oyunculu (multiplayer) GameHub platformu.

## 🚀 Özellikler

### 1. Oda Sistemi (ODA KUR - ODAYA KATIL)
- **Oda Kodu**: 5 haneli otomatik oluşturulan benzersiz kodlar (Örn: `KALE7`).
- **Doğrudan Bağlantı Paylaşımı**: `http://localhost:3000?oda=KALE7` şeklinde tek tıkla arkadaş daveti.
- **Canlı Lobi**: Oyuncu listesi, avatarlar (🦁, 🦊, 🐼, 🚀 vb.), oda sahibi (👑 Host) ve hazır olma durumu.
- **Oyun Seçim Izgarası (Game Grid)**: Wordle (aktif) ve gelecekteki parti oyunları (Codenames, Çiz & Bil, Trivia, XOX vb.) için modüler grid yapısı.
- **Lobi İçi Canlı Sohbet & Hızlı Emojiler** (👋, 🔥, 🏆, 😎, 😂, 👏).

---

### 2. Türkçe Wordle Oyunu
Kullanıcının ilettiği **13.351 adet 5 harfli Türkçe kelime** kütüphanesi entegre edilmiştir.

- **Wordle Kuralları**:
  - 5 harfli gizli kelime.
  - 6 tahmin hakkı.
  - 🟩 **Yeşil**: Harf doğru yerde.
  - 🟨 **Sarı**: Harf kelimede var ancak yeri yanlış.
  - ⬛ / ⬜ **Koyu Gri**: Harf kelimede yok.
  - Türkçe çift harf ve harf sıklığı kuralları (Wordle resmi algoritması).
  - Türkçe karakter desteği (`İ`, `I`, `Ş`, `Ğ`, `Ü`, `Ö`, `Ç`).
  - Sanal Türkçe Q klavye ve fiziksel klavye desteği.

- **Özelleştirilebilir Oyun Ayarları (Oda Sahibi Belirler)**:
  1. **Kelime Sayısı**:
     - 1 Kelime
     - 3 Kelime
     - 5 Kelime
     - 10 Kelime
  2. **İki Farklı Oyun Modu**:
     - ⚡ **1. Hız Modu (Yarış)**:
       - Bir kelimeyi bilen hemen 2. kelimeye geçer, gruptaki diğer kişileri beklemez.
       - Diğerleri kendi kelimesinde oynamaya devam eder.
       - Toplam kelimeleri (ör. 10. soruyu) ilk bitiren kazanır!
       - Canlı rakip takipçisi: Rakiplerin hangi kelimede olduğunu ve harfleri gizli renk bloklarını (🟩🟨⬛) anlık gösterir.
     - 🎯 **2. Puan Modu (Tur Bazlı / Eşzamanlı)**:
       - Bir kişi soruyu bilse bile odadaki herkes o soruyu tamamlayana kadar bekleme modunda bekler.
       - Herkes her kelimeye aynı anda geçer.
       - **Puanlama Kriteri Seçeneği**:
         - ⏱️ **Süre Bonusu**: "Her kelimeyi en kısa sürede bilen daha yüksek puan alsın."
         - 🎯 **Deneme Bonusu**: "En az denemede bilen daha yüksek puan alsın."
  3. **Kelime Havuzu**:
     - ⭐ Yaygın Kelimeler (Önerilen)
     - 🔥 Tüm 13.000 Kelime (Zor Mod)

- **Oyun Sonu & Podyum**:
  - 🥇 1., 🥈 2., 🥉 3. Podyum görseli.
  - Konfeti patlaması (canvas-confetti).
  - Tüm gizli kelimelerin listesi.
  - "Tekrar Oyna" (Rematch) ve "Lobiye Dön" butonları.

- **Ses Efektleri**:
  - Web Audio API synthesizer ile harici dosya indirmeden tuş tıklama, yeşil harf açılma, yanlış bip ve zafer melodisi. İstenildiğinde sağ üstten sessize alınabilir.

---

## 🛠️ Kurulum ve Çalıştırma

### Geliştirme Modunda (Vite + Node Server):
```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın (Port 5173 -> 3000 proxy)
npm run dev
```

### Canlı / Prodüksiyon Modunda (Unified Server):
```bash
# Projeyi derleyin
npm run build

# Tek portta hem frontend'i hem WebSocket backend'i çalıştırın (Port 3000)
npm start
```
Tarayıcınızda açın: `http://localhost:3000`

---

## 🌐 Canlıya Alma (Deployment)
Proje tek bir komutla (`npm run build && npm start`) tüm modern platformlara (Render, Railway, Fly.io, Heroku veya Docker) dağıtılabilir.
`PORT` ortam değişkenini otomatik olarak dinler.
