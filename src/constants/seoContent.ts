export interface FAQItem {
  q: string;
  a: string;
}

export interface ToolSEOData {
  title: string;
  metaDesc: string;
  h1: string;
  intro: string;
  faqs: FAQItem[];
}

export const seoContent: Record<'en' | 'id', Record<string, ToolSEOData>> = {
  en: {
    resize: {
      title: 'Free Image Resizer Online - Resize Images Without Quality Loss',
      metaDesc: 'Resize images online for free. Adjust pixels, percentages, aspect ratio lock, or use social media presets. 100% local client-side processing.',
      h1: 'Free Online Image Resizer',
      intro: 'Adjust image dimensions instantly. Resize your photos by width and height, lock aspect ratio, scale by percentage, or choose pre-defined dimensions for social media profile headers and posts. Everything runs directly inside your browser for maximum security.',
      faqs: [
        {
          q: 'How does the online image resizer work?',
          a: 'It uses HTML5 Canvas APIs inside your web browser. When you select an image, our local script rescales the pixels based on your settings. No files are uploaded to any server, making the process instant and 100% private.'
        },
        {
          q: 'Will my image lose quality after resizing?',
          a: 'Our resizer uses high-quality canvas resampling. However, scaling an image up significantly beyond its original size will naturally make it pixelated. Downscaling or scaling proportionally retains maximum clarity.'
        },
        {
          q: 'Is there a limit on the file size or quantity?',
          a: 'No. Because all calculations are handled by your local computer hardware (client-side processing), there are no server limitations. You can resize large photos and process multiple files in batches.'
        }
      ]
    },
    convert: {
      title: 'Online Image Format Converter - Convert JPG, PNG, WebP Instantly',
      metaDesc: 'Convert image formats between JPG, PNG, and WebP instantly in your browser. 100% local, fast batch conversion, secure serverless execution.',
      h1: 'Fast Image Format Converter',
      intro: 'Convert your image formats seamlessly. Choose between PNG (lossless with transparency support), JPG (optimal compression for photographs), and WebP (modern web standard for light and fast loading). Free, instant, and private.',
      faqs: [
        {
          q: 'Is converting images on PhotoToolkit safe?',
          a: 'Absolutely. Since there is zero server-side logic and no upload database, your files never leave your computer. The translation is done directly inside your browser using standard web rendering mechanics.'
        },
        {
          q: 'Which format should I choose: JPG, PNG, or WebP?',
          a: 'Choose PNG if you need transparent backgrounds or lossless text-heavy graphics. Choose JPG for general photography where small file size is preferred. Choose WebP for websites and modern apps to save bandwidth without visible quality degradation.'
        },
        {
          q: 'Does it support batch image conversion?',
          a: 'Yes, you can upload multiple files at once. Configure the output format and click process; all converted images can be downloaded individually or together as a single ZIP file.'
        }
      ]
    },
    compress: {
      title: 'Free Image Compressor Online - Compress JPG, PNG, WebP to KB',
      metaDesc: 'Reduce image file size in KB or MB without losing visual quality. Adjust quality levels with a live slider. 100% safe client-side compressor.',
      h1: 'Smart Image File Compressor',
      intro: 'Reduce the file size of your photos in seconds. Use our interactive slider to fine-tune the compression level and preview the savings instantly. Shrink images for emails, blogs, or web speed optimization without sacrificing details.',
      faqs: [
        {
          q: 'Can I compress images to a specific target KB?',
          a: 'Yes. By shifting the quality slider, you can observe the estimated file size before downloading. This allows you to easily find the sweet spot between file size and visual clarity.'
        },
        {
          q: 'Is my original image overwritten or deleted?',
          a: 'No, your original image remains untouched on your device. The compressed version is generated as a new file in your downloads folder.'
        },
        {
          q: 'Why should I compress WebP or JPG files?',
          a: 'Uncompressed images load slowly on mobile networks and negatively affect SEO performance. Compressing images speeds up your website, reduces server bandwidth, and improves user experience.'
        }
      ]
    },
    passport: {
      title: 'Auto Passport Photo Maker - 2x3, 3x4, 4x6 Size Generator',
      metaDesc: 'Generate professional passport photos online for free. Auto face-centering, background coloring (red, blue, white), and standard layout output.',
      h1: 'Auto Passport Photo Generator',
      intro: 'Convert any portrait photo into a compliant passport size photo instantly. Our client-side algorithm detects and centers your face automatically. Choose official dimensions like 2x3, 3x4, or 4x6, and customize background colors to fit national requirements.',
      faqs: [
        {
          q: 'What are the default passport photo sizes?',
          a: 'We offer standard official ratios: 2x3 cm, 3x4 cm, and 4x6 cm. These sizes are universally accepted for official documents, identity cards, CVs, and visa applications.'
        },
        {
          q: 'How does auto-centering work?',
          a: 'We utilize localized face-centering calculations on the canvas to crop and align your head to the standard passport layout grid. Best results are achieved with clear front-facing portrait photos.'
        },
        {
          q: 'Can I change the passport background color?',
          a: 'Yes. You can instantly replace the background with standard official colors (White, Blue, or Red) or leave it transparent. Solid backgrounds give the most professional look.'
        }
      ]
    },
    'bg-remover': {
      title: 'AI Background Remover Online - Free Background Eraser',
      metaDesc: 'Remove backgrounds from photos instantly using local AI. Free, private, zero server uploads, and high quality transparent PNG output.',
      h1: 'AI-Powered Background Remover',
      intro: 'Erase image backgrounds automatically. Driven by MediaPipe Selfie Segmentation running directly inside your browser, the AI separates the human subject from the background instantly. Edit boundaries manually for flawless results.',
      faqs: [
        {
          q: 'Is my photo sent to an AI server to remove the background?',
          a: 'No. The AI model runs entirely inside your browser sandbox on your own computer. This keeps your photo private and lets you process backgrounds even when offline.'
        },
        {
          q: 'Can I restore or erase specific parts of the background?',
          a: 'Yes! PhotoToolkit includes a manual canvas mask editor. If the AI misses any details, you can manually brush over parts to erase or restore them for a perfect cut-out.'
        },
        {
          q: 'Which background colors can I apply?',
          a: 'You can leave the background transparent (PNG) or replace it with solid colors (white, red, blue) or custom professional background templates provided in the panel.'
        }
      ]
    }
  },
  id: {
    resize: {
      title: 'Ubah Ukuran Gambar Gratis - Resize Foto Tanpa Pecah Online',
      metaDesc: 'Ubah resolusi gambar secara online gratis. Sesuaikan piksel, persentase, kunci rasio aspek, atau gunakan preset media sosial. 100% lokal aman.',
      h1: 'Resize Gambar Online Gratis',
      intro: 'Ubah dimensi lebar dan tinggi foto Anda secara instan. Kunci rasio aspek agar gambar tidak mulur, skala dengan persentase, atau gunakan preset ukuran profil media sosial. Diproses 100% lokal di browser Anda untuk keamanan privasi penuh.',
      faqs: [
        {
          q: 'Bagaimana cara kerja resize gambar online ini?',
          a: 'Fitur ini menggunakan API Canvas HTML5 di dalam browser Anda. Ketika Anda memilih gambar, skrip lokal kami mengatur ulang piksel sesuai setelan Anda. Tidak ada data yang diunggah ke server, proses instan dan privat.'
        },
        {
          q: 'Apakah gambar akan pecah atau buram setelah di-resize?',
          a: 'Sistem kami menggunakan algoritma resampling berkualitas tinggi. Namun, memperbesar ukuran gambar jauh melebihi ukuran aslinya akan membuatnya pecah secara alami. Memperkecil dimensi tidak akan mengurangi ketajaman.'
        },
        {
          q: 'Apakah ada batasan jumlah foto atau ukuran file?',
          a: 'Tidak ada. Karena pemrosesan dilakukan oleh perangkat keras komputer Anda sendiri (pemrosesan sisi klien), tidak ada limit server. Anda bisa memproses foto resolusi tinggi secara massal.'
        }
      ]
    },
    convert: {
      title: 'Konversi Format Gambar Online - Ubah JPG, PNG, WebP Instan',
      metaDesc: 'Ubah format gambar menjadi JPG, PNG, atau WebP gratis langsung di browser Anda. Pemrosesan lokal, konversi massal cepat, aman tanpa upload.',
      h1: 'Konversi Format Foto Instan',
      intro: 'Ubah format file gambar dengan mudah. Pilih PNG (kualitas tinggi dengan latar transparan), JPG (kompresi optimal untuk foto biasa), atau WebP (standar web modern yang sangat ringan). Gratis, cepat, dan aman.',
      faqs: [
        {
          q: 'Apakah aman mengonversi gambar di PhotoToolkit?',
          a: 'Sangat aman. Kami tidak mengirimkan gambar Anda ke server mana pun. Seluruh proses konversi format dilakukan langsung secara lokal di dalam browser Anda.'
        },
        {
          q: 'Kapan saya harus menggunakan JPG, PNG, atau WebP?',
          a: 'Gunakan PNG untuk logo atau grafik dengan teks yang butuh latar transparan. Gunakan JPG untuk foto biasa agar file lebih kecil. Gunakan WebP jika Anda ingin menampilkan gambar cepat di website tanpa mengorbankan kualitas.'
        },
        {
          q: 'Apakah mendukung konversi banyak gambar sekaligus?',
          a: 'Ya, Anda dapat mengunggah banyak gambar secara massal. Atur format keluaran, proses, dan unduh semua hasilnya sebagai satu file ZIP.'
        }
      ]
    },
    compress: {
      title: 'Kompres Gambar Gratis Online - Perkecil Ukuran KB & MB Foto',
      metaDesc: 'Kurangi ukuran file gambar dalam KB/MB tanpa merusak kualitas visual. Gunakan slider kompresi interaktif. 100% aman di browser Anda.',
      h1: 'Kompresor File Gambar Pintar',
      intro: 'Perkecil ukuran penyimpanan foto Anda dalam hitungan detik. Gunakan slider interaktif kami untuk menyesuaikan tingkat kompresi dan lihat estimasi ukuran file hasil kompresi secara real-time. Cocok untuk menghemat kuota dan mematuhi batas upload email atau formulir.',
      faqs: [
        {
          q: 'Bagaimana cara menentukan target ukuran KB?',
          a: 'Dengan menggeser slider kualitas, Anda bisa langsung melihat perkiraan ukuran file hasil kompresi sebelum mengunduhnya. Ini memudahkan Anda mencari kompromi terbaik antara ukuran KB kecil dan kualitas gambar.'
        },
        {
          q: 'Apakah foto asli saya akan tertimpa atau terhapus?',
          a: 'Tidak, foto asli Anda tetap utuh di perangkat Anda. Versi hasil kompresi akan diunduh sebagai file baru di folder unduhan Anda.'
        },
        {
          q: 'Mengapa penting melakukan kompresi gambar?',
          a: 'Gambar yang terlalu besar membuat loading website lambat dan memakan banyak memori. Kompresi gambar mempercepat pemuatan halaman web, menghemat penyimpanan, dan mempermudah proses pengiriman berkas.'
        }
      ]
    },
    passport: {
      title: 'Pembuat Pas Foto Otomatis - Cetak Ukuran 2x3, 3x4, 4x6 Gratis',
      metaDesc: 'Buat pas foto ukuran resmi secara online gratis. Fitur auto-center wajah, ganti warna latar (merah, biru, putih) instan tanpa aplikasi.',
      h1: 'Pembuat Pas Foto Otomatis',
      intro: 'Ubah foto portrait biasa menjadi pas foto resmi siap cetak secara instan. Algoritma lokal kami mendeteksi wajah dan memposisikannya secara presisi di tengah. Atur ukuran resmi seperti 2x3, 3x4, atau 4x6, serta pilih warna latar belakang sesuai persyaratan administrasi negara.',
      faqs: [
        {
          q: 'Berapa ukuran standar pas foto yang disediakan?',
          a: 'Kami menyediakan rasio pas foto resmi standar Indonesia: 2x3 cm, 3x4 cm, dan 4x6 cm. Ukuran ini dapat digunakan untuk berkas lamaran kerja, buku nikah, visa, paspor, atau ijazah.'
        },
        {
          q: 'Bagaimana fitur auto-center bekerja?',
          a: 'Kami mendeteksi posisi kepala pada kanvas dan secara otomatis memotong (*crop*) serta menyesuaikan letak wajah agar simetris di tengah bingkai. Disarankan menggunakan foto portrait dengan posisi wajah tegak menghadap ke depan.'
        },
        {
          q: 'Apakah latar belakang bisa diganti warna?',
          a: 'Tentu. Anda bisa mengganti latar belakang menjadi warna solid seperti Merah (untuk tahun kelahiran ganjil), Biru (tahun genap), Putih, atau transparan.'
        }
      ]
    },
    'bg-remover': {
      title: 'Hapus Background Foto AI Online - Penghapus Latar Belakang Gratis',
      metaDesc: 'Hapus latar belakang foto otomatis menggunakan AI lokal. Gratis, aman tanpa upload server, dan menghasilkan file PNG transparan beresolusi tinggi.',
      h1: 'AI Penghapus Background Foto',
      intro: 'Hilangkan latar belakang foto secara otomatis dengan cepat. Menggunakan teknologi MediaPipe Selfie Segmentation yang berjalan langsung di browser, AI kami memisahkan subjek manusia secara instan. Tersedia kuas manual untuk perbaikan detail yang sempurna.',
      faqs: [
        {
          q: 'Apakah foto saya dikirim ke server AI untuk dihapus background-nya?',
          a: 'Tidak. Model AI berjalan 100% di dalam browser Anda menggunakan memori lokal perangkat Anda. Tidak ada data gambar yang dikirim atau disimpan di server kami, menjamin privasi absolut.'
        },
        {
          q: 'Bagaimana jika hasil pemotongan AI kurang rapi?',
          a: 'Jangan khawatir, PhotoToolkit dilengkapi dengan Manual Mask Editor (kuas manual). Anda dapat dengan mudah menggosok bagian tertentu untuk mengembalikan detail yang hilang atau menghapus sisa latar belakang secara detail.'
        },
        {
          q: 'Apakah saya bisa mengganti background dengan warna atau gambar lain?',
          a: 'Ya. Anda bisa membiarkannya transparan (format PNG) atau menggantinya dengan warna solid (merah, biru, putih) maupun menggunakan pilihan template latar belakang premium yang kami sediakan.'
        }
      ]
    }
  }
};
