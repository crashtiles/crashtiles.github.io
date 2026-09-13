// Crash Tiles Fruit & Produce Interactive Mini Game
document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navbar Scroll Effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. Interactive Fruit Tile Match Mini-Game Demo (4 Tray Slots matching in-game screenshot)
  const tilesGrid = document.getElementById('demoTilesGrid');
  const traySlots = document.querySelectorAll('.tray-slot');
  const scoreDisplay = document.getElementById('demoScore');
  const comboDisplay = document.getElementById('demoCombo');
  const iqDisplay = document.getElementById('demoIQ');
  const resetBtn = document.getElementById('resetDemoBtn');

  // Exact fruit & produce symbols matching game screenshot
  const fruitSymbols = [
    { icon: '🍐', name: 'Armut' },
    { icon: '🥒', name: 'Salatalık' },
    { icon: '🥑', name: 'Avokado' },
    { icon: '🍉', name: 'Karpuz' },
    { icon: '🍌', name: 'Muz' },
    { icon: '🌶️', name: 'Biber' },
    { icon: '🍄', name: 'Mantar' },
    { icon: '🌽', name: 'Mısır' },
    { icon: '⚡+1', name: 'Bonus +1' }
  ];

  let currentScore = 300; // Initial score from screenshot
  let currentCombo = 0;
  let currentIQ = 70;    // Initial IQ from screenshot
  let tray = [];

  function initDemoGame() {
    if (!tilesGrid) return;
    tilesGrid.innerHTML = '';
    tray = [];
    currentScore = 300;
    currentCombo = 0;
    currentIQ = 70;
    updateDisplays();
    updateTray();

    // Create 8 tiles (pairs of fruit symbols + 1 closed tile)
    const pairs = [0, 0, 1, 1, 2, 2, 3, 3];
    pairs.sort(() => Math.random() - 0.5);

    pairs.forEach((symbolIdx, index) => {
      const tileEl = document.createElement('div');
      
      // Randomly make 1-2 tiles facedown purple like in the screenshot
      if (index === 2) {
        tileEl.className = 'demo-tile facedown';
        tileEl.innerHTML = `<span>✨</span>`;
        tileEl.dataset.facedown = 'true';
      } else {
        tileEl.className = 'demo-tile';
        tileEl.innerHTML = `<span>${fruitSymbols[symbolIdx].icon}</span>`;
      }
      
      tileEl.dataset.symbol = symbolIdx;
      tileEl.dataset.index = index;

      tileEl.addEventListener('click', () => handleTileClick(tileEl, symbolIdx));
      tilesGrid.appendChild(tileEl);
    });
  }

  function handleTileClick(tileEl, symbolIdx) {
    if (tileEl.classList.contains('matched') || tray.length >= 4) return;

    // If tile was facedown purple, reveal fruit first
    if (tileEl.dataset.facedown === 'true') {
      tileEl.dataset.facedown = 'false';
      tileEl.className = 'demo-tile';
      tileEl.innerHTML = `<span>${fruitSymbols[symbolIdx].icon}</span>`;
      // Small sparkle animation delay
      setTimeout(() => pickTileToTray(tileEl, symbolIdx), 150);
      return;
    }

    pickTileToTray(tileEl, symbolIdx);
  }

  function pickTileToTray(tileEl, symbolIdx) {
    tileEl.classList.add('matched');
    tray.push({ symbolIdx, el: tileEl });
    updateTray();

    setTimeout(checkMatches, 200);
  }

  function updateTray() {
    traySlots.forEach((slot, index) => {
      if (index < tray.length) {
        slot.innerHTML = fruitSymbols[tray[index].symbolIdx].icon;
        slot.classList.add('filled');
      } else {
        slot.innerHTML = '';
        slot.classList.remove('filled');
      }
    });
  }

  function checkMatches() {
    if (tray.length < 2) return;

    // Count occurrences
    const counts = {};
    tray.forEach(item => {
      counts[item.symbolIdx] = (counts[item.symbolIdx] || 0) + 1;
    });

    let matchedSymbol = null;
    for (const symbol in counts) {
      if (counts[symbol] >= 2) {
        matchedSymbol = parseInt(symbol);
        break;
      }
    }

    if (matchedSymbol !== null) {
      // Remove matched pair from 4-slot tray
      let removeCount = 0;
      tray = tray.filter(item => {
        if (item.symbolIdx === matchedSymbol && removeCount < 2) {
          removeCount++;
          return false;
        }
        return true;
      });

      // Update stats
      currentCombo++;
      currentScore += 300 * currentCombo;
      currentIQ = Math.min(200, currentIQ + 10);

      updateDisplays();
      updateTray();

      // Check win condition
      const remainingTiles = document.querySelectorAll('.demo-tile:not(.matched)');
      if (remainingTiles.length === 0 && tray.length === 0) {
        setTimeout(() => {
          alert('🎉 Harika! Tüm Meyveleri Eşleştirdiniz! / Level Cleared!');
          initDemoGame();
        }, 300);
      }
    } else if (tray.length >= 4) {
      // 4-slot tray full
      setTimeout(() => {
        alert('⚠️ Hazne Doldu! Tekrar deneyin. / Tray full! Try again.');
        initDemoGame();
      }, 300);
    }
  }

  function updateDisplays() {
    if (scoreDisplay) scoreDisplay.textContent = currentScore;
    if (comboDisplay) comboDisplay.textContent = currentCombo > 0 ? `${currentCombo}x` : '-';
    if (iqDisplay) iqDisplay.textContent = currentIQ;
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', initDemoGame);
  }

  initDemoGame();
});
