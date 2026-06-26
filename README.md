# 🌌 Dijital Oda (Digital Room)

[![Live Demo](https://img.shields.io/badge/Canlı_Yayın-Dijital_Oda-32d74b?style=for-the-badge&logo=github)](https://zekioz0.github.io/Dijital_Oda/)

**Dijital Oda**, sıradan portfolyo sitelerinin dışına çıkan, retro, interaktif ve tamamen "oyunlaştırılmış" bir kişisel web sitesi deneyimidir. Odadaki bilgisayar terminalini kontrol ederek hakkımda bilgi alabilir, gitar çalabilir veya odadaki atari makinesinden mini oyunlar oynayabilirsiniz.

## ✨ Özellikler

- **💻 İnteraktif Terminal (ZekiOS):** 
  - `profile` komutu ile yeteneklerime ve eğitim geçmişime erişim.
  - `projects` komutu ile GitHub API üzerinden en güncel projelerimi otomatik listeleme.
  - `help`, `whoami`, `skills`, `clear` gibi klasik terminal komutları.
- **🎮 Entegre Mini Oyunlar:** 
  - **Tyranid Swarm (Space Invaders):** 3 Farklı zorluk seviyesiyle entegre uzay savaş oyunu.
  - **Flappy Servo-Skull:** Özelleştirilmiş mekanikleriyle arcade tarzı kuş uçurma oyunu.
- **🎧 Lofi Müzik Çalar:** Arka planda kod yazarken dinlenecek rahatlatıcı Lofi ezgileri.
- **🖱️ Parallax Oda Efekti:** Farenizin hareketlerine göre odanın (masanın, bilgisayarın vb.) hareket ettiği, GPU destekli (Hardware Acceleration) performanslı ve hissiyatlı görsel deneyim.
- **⚡ Gece/Gündüz Modu:** Odanın aydınlatmasını ruh halinize göre değiştirebilirsiniz.

## 🛠️ Teknolojiler

- **Frontend Framework:** React (Vite)
- **Animasyon & Efektler:** Framer Motion
- **Stil & Tasarım:** Vanilla CSS (Modern CSS özellikleri ve Glassmorphism)
- **İkonlar:** Lucide-React
- **Deploy:** GitHub Pages

## 🚀 Yerelde Çalıştırma

Projeyi kendi makinenizde çalıştırmak için aşağıdaki adımları izleyebilirsiniz:

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/zekioz0/Dijital_Oda.git
   ```
2. Proje dizinine girin:
   ```bash
   cd Dijital_Oda
   ```
3. Gerekli paketleri yükleyin:
   ```bash
   npm install
   ```
4. Geliştirici sunucusunu başlatın:
   ```bash
   npm run dev
   ```

## 🌐 Dağıtım (Deploy)

Uygulamanızı GitHub Pages üzerinde güncellemek için tek yapmanız gereken:
```bash
npm run deploy
```
*Bu komut önce `npm run build` ile projeyi derler, ardından `dist` klasörünü otomatik olarak `gh-pages` dalına (branch) gönderir.*

---
*Geliştirici:* [Zeki](https://github.com/zekioz0) | *Bilgisayar Mühendisliği Öğrencisi & Geliştirici*
