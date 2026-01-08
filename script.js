document.addEventListener("DOMContentLoaded", () => {
  console.log("🔥 RAGE APP LOADED!");

  // ====================
  // 1. GET ALL ELEMENTS - FIX INI!
  // ====================
  const tombol = document.getElementById("lampiaskan");
  const rageBtn = document.getElementById("rage-btn");
  const docsBtn = document.querySelector(".nav-btn"); // INI YG BENER! PAKE QUERYSELECTOR
  const input = document.getElementById("text");
  const notif = document.getElementById("notif");
  const ragePanel = document.getElementById("rage-out-panel");
  const docsPanel = document.getElementById("docs-panel");
  const closePanel = document.getElementById("close-panel");
  const closeDocs = document.getElementById("close-docs");
  const rageList = document.getElementById("rage-list");

  // ====================
  // 2. HARDCODE CHECK - DENGAN LOGIKA BARU
  // ====================
  console.log("✅ Tombol lampiaskan:", tombol ? "FOUND" : "MISSING");
  console.log("✅ Tombol rage-btn:", rageBtn ? "FOUND" : "MISSING");
  
  // CARI DOCS BUTTON YANG BENER
  let docsButton = null;
  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach(btn => {
    if (btn.textContent.trim() === "Docs") {
      docsButton = btn;
      console.log("✅ Tombol Docs ditemukan (via text content):", docsButton);
    }
  });
  
  // Kalo masih ga ketemu, cari pertama .nav-btn
  if (!docsButton && navButtons.length > 0) {
    docsButton = navButtons[0];
    console.log("ℹ️  Menggunakan .nav-btn pertama sebagai Docs button");
  }

  // Kalo tombol utama ga ketemu, berhenti
  if (!tombol || !rageBtn) {
    console.error("🚨 Tombol utama ga ketemu!");
    showNotif("Error: Tombol ga ditemukan!", true);
    return;
  }

  // ====================
  // 3. CREATE DOCS PANEL IF NOT EXISTS
  // ====================
  if (!docsPanel) {
    console.log("📄 Creating docs panel...");
    const docsDiv = document.createElement("div");
    docsDiv.id = "docs-panel";
    docsDiv.style.cssText = `
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 10000;
      justify-content: center;
      align-items: center;
    `;

    docsDiv.innerHTML = `
      <div style="
        background: black;
        padding: 30px;
        border-radius: 15px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
      ">
        <button id="close-docs-manual" style="
          position: absolute;
          top: 15px;
          right: 15px;
          background: black;
          color: white;
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">×</button>
        
        <h2 style="color: #ff4757; margin-top: 0;">📖 Tentang PelampiasanAmarah</h2>
        
        <div style="line-height: 1.6;">
          <p><strong>🌐 Website:</strong> pelampiasanamarah.netlify.app</p>
          
          <p><strong>🎯 Apa ini?</strong><br>
          Website untuk melampiaskan amarah dan kekesalan dengan cara yang sehat! 
          Terkadang kita butuh tempat untuk mencurahkan perasaan tanpa harus menyakiti orang lain.</p>
          
          <p><strong>✨ Fitur:</strong></p>
          <ul>
            <li><strong>🔥 Lampiaskan:</strong> Tulis amarahmu dan kirim sebagai User1 (Owner)</li>
            <li><strong>📂 Rage Out:</strong> Lihat semua amarah yang sudah dilampiaskan</li>
            <li><strong>👑 Owner Privilege:</strong> Hanya User1 yang bisa menghapus/sharing amarahnya</li>
            <li><strong>👤 User Lain:</strong> Simulasi user lain untuk membuat suasana grup</li>
            <li><strong>📱 Responsif:</strong> Bisa digunakan di desktop dan mobile</li>
          </ul>
          
          <p><strong>🔧 Cara Pakai:</strong></p>
          <ol>
            <li>Isi amarahmu di textbox</li>
            <li>Klik "Lampiaskan!" untuk mengirim</li>
            <li>Klik "Rage Out" untuk melihat semua amarah</li>
            <li>Klik "⋯" di postinganmu untuk menghapus/sharing</li>
            <li>Klik "Docs" untuk informasi website</li>
          </ol>
          
          <p><strong>⚠️ Disclaimer:</strong><br>
          Website ini dibuat untuk hiburan dan pelampiasan virtual. 
          Jangan digunakan untuk cyberbullying atau menyebarkan kebencian!</p>
          
          <p><strong>💖 Ingat:</strong> Setelah melampiaskan di sini, coba tarik napas dalam-dalam dan lanjutkan harimu dengan lebih ringan! 😊</p>
          
          <div style="
            background: #ffeaa7;
            padding: 15px;
            border-radius: 10px;
            margin-top: 20px;
            border-left: 5px solid #fdcb6e;
          ">
            <strong>💡 Tips:</strong> Gunakan website ini ketika kamu merasa:
            <ul style="margin-bottom: 0;">
              <li>Frustasi dengan pekerjaan</li>
              <li>Kesal dengan seseorang</li>
              <li>Stress dengan deadline</li>
              <li>Butuh tempat curhat virtual</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(docsDiv);
  }

  // ====================
  // 4. VARIABLES
  // ====================
  const OWNER_ID = "User1";
  let amarahList = [];
  let otherUserCounter = 2;

  // ====================
  // 5. NOTIFICATION FUNCTION
  // ====================
  function showNotif(message, isError = false) {
    let notifElement = document.getElementById("notif");
    if (!notifElement) {
      // Create notification if not exists
      const notifDiv = document.createElement("div");
      notifDiv.id = "notif";
      notifDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.8);
        background: ${isError ? "#ff4757" : "#2ed573"};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10001;
        opacity: 0;
        transition: all 0.3s;
        font-weight: bold;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      `;
      document.body.appendChild(notifDiv);
      notifElement = notifDiv;
    }

    notifElement.textContent = message;
    notifElement.style.background = isError ? "#ff4757" : "#2ed573";
    notifElement.style.opacity = "1";
    notifElement.style.transform = "translate(-50%, -50%) scale(1)";

    setTimeout(() => {
      notifElement.style.opacity = "0";
      notifElement.style.transform = "translate(-50%, -50%) scale(0.8)";
    }, 2000);
  }

  // ====================
  // 6. LAMPIASKAN FUNCTION
  // ====================
  tombol.addEventListener("click", () => {
    console.log("🎯 Tombol 'Lampiaskan' diklik!");

    const isi = input.value.trim();
    if (!isi) {
      showNotif("Tolong isi amarahmu dulu! 😠");
      return;
    }

    // OWNER SELALU YANG KIRIM
    const newAmarah = {
      id: Date.now(),
      text: isi,
      owner: OWNER_ID,
      isOwner: true,
      isOther: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    amarahList.push(newAmarah);
    input.value = "";
    input.focus();

    console.log("📝 Postingan baru:", newAmarah);
    showNotif(`Amarah #${amarahList.length} dilampiaskan! 🔥`);

    if (ragePanel && ragePanel.style.display === "flex") {
      renderRageList();
    }
  });

  // ====================
  // 7. RAGE OUT PANEL FUNCTIONS
  // ====================
  rageBtn.addEventListener("click", () => {
    console.log("📂 Buka panel Rage Out");
    renderRageList();
    if (ragePanel) {
      ragePanel.style.display = "flex";
      // Tutup docs panel kalo terbuka
      const docsPanel = document.getElementById("docs-panel");
      if (docsPanel) docsPanel.style.display = "none";
    }
  });

  if (closePanel) {
    closePanel.addEventListener("click", () => {
      if (ragePanel) ragePanel.style.display = "none";
    });
  }

  // ====================
  // 8. DOCS PANEL FUNCTIONS - PAKE DOCSBUTTON YANG SUDAH DITEMUKAN
  // ====================
  if (docsButton) {
    docsButton.addEventListener("click", () => {
      console.log("📖 Tombol 'Docs' diklik!");

      // Tutup panel lain kalo terbuka
      if (ragePanel) ragePanel.style.display = "none";

      // Buka docs panel
      const panel = document.getElementById("docs-panel");
      if (panel) {
        panel.style.display = "flex";
        showNotif("Membuka dokumentasi 📖");
      } else {
        console.error("Docs panel tidak ditemukan!");
        showNotif("Error: Docs panel tidak ditemukan!", true);
      }
    });

    // Hover effect untuk docs button
    docsButton.style.cursor = "pointer";
    docsButton.addEventListener("mouseenter", () => {
      docsButton.style.transform = "scale(1.1)";
      docsButton.style.transition = "transform 0.2s";
    });

    docsButton.addEventListener("mouseleave", () => {
      docsButton.style.transform = "scale(1)";
    });
  } else {
    console.warn("⚠️ Tombol Docs tidak ditemukan!");
  }

  // Close docs panel
  const closeDocsBtn = document.getElementById("close-docs") || document.getElementById("close-docs-manual");
  if (closeDocsBtn) {
    closeDocsBtn.addEventListener("click", () => {
      const panel = document.getElementById("docs-panel");
      if (panel) {
        panel.style.display = "none";
        console.log("📕 Docs panel ditutup");
      }
    });
  }

  // Click outside to close docs
  document.addEventListener("click", (e) => {
    const panel = document.getElementById("docs-panel");
    if (panel && panel.style.display === "flex") {
      const content = panel.querySelector("div > div");
      if (content && !content.contains(e.target) && e.target !== docsButton) {
        panel.style.display = "none";
      }
    }
  });

  // ESC key to close both panels
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const panel = document.getElementById("docs-panel");
      if (panel && panel.style.display === "flex") {
        panel.style.display = "none";
        console.log("📕 Docs panel ditutup (ESC)");
      }
      if (ragePanel && ragePanel.style.display === "flex") {
        ragePanel.style.display = "none";
        console.log("📂 Rage panel ditutup (ESC)");
      }
    }
  });

  // ====================
  // 9. RENDER RAGE LIST
  // ====================
  function renderRageList() {
    if (!rageList) {
      console.error("Rage list element tidak ditemukan!");
      return;
    }

    rageList.innerHTML = "";

    if (amarahList.length === 0) {
      rageList.innerHTML = `
        <div class="rage-bubble" style="
          padding: 20px;
          text-align: center;
          color: #666;
          font-style: italic;
        ">
          Belum ada amarah yang dilampiaskan 😅<br>
          <small>Isi dulu di atas, lalu klik "Lampiaskan!"</small>
        </div>
      `;
      return;
    }

    console.log(`📊 Rendering ${amarahList.length} amarah...`);

    // RENDER SEMUA POSTINGAN
    amarahList.forEach((item, index) => {
      const bubble = document.createElement("div");
      bubble.className = "rage-bubble";
      bubble.style.cssText = `
        background: ${item.isOwner ? "#ffeaa7" : "#dfe6e9"};
        border-left: 5px solid ${item.isOwner ? "#fdcb6e" : "#b2bec3"};
        padding: 15px;
        margin-bottom: 10px;
        border-radius: 10px;
        position: relative;
        word-break: break-word;
        transition: transform 0.2s;
      `;

      // Hover effect untuk bubble
      bubble.addEventListener("mouseenter", () => {
        bubble.style.transform = "translateY(-2px)";
      });

      bubble.addEventListener("mouseleave", () => {
        bubble.style.transform = "translateY(0)";
      });

      // HEADER: Username + timestamp
      const header = document.createElement("div");
      header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        font-weight: bold;
      `;

      const userSpan = document.createElement("span");
      userSpan.innerHTML = `${item.owner} ${item.isOwner ? '👑' : '👤'}`;
      userSpan.style.color = item.isOwner ? "#e17055" : "#636e72";

      const timeSpan = document.createElement("span");
      timeSpan.textContent = item.timestamp;
      timeSpan.style.fontSize = "0.8em";
      timeSpan.style.color = "#888";

      header.appendChild(userSpan);
      header.appendChild(timeSpan);

      // CONTENT: Text
      const content = document.createElement("div");
      content.textContent = item.text;
      content.style.cssText = `
        margin-bottom: 10px;
        line-height: 1.4;
      `;

      // MENU HANYA UNTUK OWNER
      if (item.isOwner && item.owner === OWNER_ID) {
        const menuBtn = document.createElement("button");
        menuBtn.innerHTML = "⋯";
        menuBtn.title = "Menu";
        menuBtn.style.cssText = `
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #666;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        `;

        menuBtn.addEventListener("mouseenter", () => {
          menuBtn.style.background = "rgba(0,0,0,0.1)";
        });

        menuBtn.addEventListener("mouseleave", () => {
          menuBtn.style.background = "none";
        });

        const menu = document.createElement("div");
        menu.style.cssText = `
          display: none;
          position: absolute;
          bottom: 40px;
          right: 10px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          z-index: 100;
          min-width: 120px;
          overflow: hidden;
        `;

        // HAPUS
        const deleteBtn = document.createElement("div");
        deleteBtn.innerHTML = "🗑 Hapus";
        deleteBtn.style.cssText = `
          padding: 10px 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s;
        `;

        deleteBtn.addEventListener("mouseenter", () => {
          deleteBtn.style.background = "#ffeaa7";
        });

        deleteBtn.addEventListener("mouseleave", () => {
          deleteBtn.style.background = "white";
        });

        deleteBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          amarahList.splice(index, 1);
          renderRageList();
          showNotif("Amarah dihapus! 🗑️");
        });

        // SHARE
        const shareBtn = document.createElement("div");
        shareBtn.innerHTML = "📤 Share";
        shareBtn.style.cssText = `
          padding: 10px 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          border-top: 1px solid #eee;
          transition: background 0.2s;
        `;

        shareBtn.addEventListener("mouseenter", () => {
          shareBtn.style.background = "#dfe6e9";
        });

        shareBtn.addEventListener("mouseleave", () => {
          shareBtn.style.background = "white";
        });

        shareBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(item.text)
            .then(() => showNotif("Teks dicopy! 📋"))
            .catch(() => showNotif("Gagal copy 😢"));
        });

        menu.appendChild(deleteBtn);
        menu.appendChild(shareBtn);
        bubble.appendChild(menu);

        menuBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          e.preventDefault();
          
          // Tutup semua menu lain
          document.querySelectorAll(".rage-bubble div[style*='position: absolute']").forEach(m => {
            if (m !== menu) m.style.display = "none";
          });

          // Toggle menu ini
          menu.style.display = menu.style.display === "block" ? "none" : "block";
        });

        bubble.appendChild(menuBtn);

        // KLIK DI LUAR UNTUK TUTUP MENU
        document.addEventListener("click", (e) => {
          if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
            menu.style.display = "none";
          }
        });
      }

      bubble.appendChild(header);
      bubble.appendChild(content);
      rageList.appendChild(bubble);
    });
  }

  // ====================
  // 10. ENHANCE BUTTONS
  // ====================
  tombol.style.cursor = "pointer";
  rageBtn.style.cursor = "pointer";

  tombol.addEventListener("mouseenter", () => {
    tombol.style.transform = "scale(1.05)";
    tombol.style.transition = "transform 0.2s";
  });

  tombol.addEventListener("mouseleave", () => {
    tombol.style.transform = "scale(1)";
  });

  rageBtn.addEventListener("mouseenter", () => {
    rageBtn.style.transform = "scale(1.05)";
    rageBtn.style.transition = "transform 0.2s";
  });

  rageBtn.addEventListener("mouseleave", () => {
    rageBtn.style.transform = "scale(1)";
  });

  // ====================
  // 11. INITIAL MESSAGE
  // ====================
  console.log("✅ Semua event listener terpasang!");
  console.log("✅ Owner:", OWNER_ID);
  console.log("✅ Docs button ditemukan:", docsButton ? "YA" : "TIDAK");
  console.log("✅ Siap melampiaskan amarah! 🔥");

  // Auto-focus input
  setTimeout(() => {
    if (input) {
      input.focus();
      console.log("🎯 Input auto-focused");
    }
  }, 500);
});
