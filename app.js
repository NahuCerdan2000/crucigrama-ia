/**
 * ACTIVIDAD GRUPO 8 - ARTIFICIAL INTELLIGENCE
 * High-Tech Interactive Crossword Application
 */

// =============================================================================
// 1. DATA DEFINITIONS & CROSSWORD PUZZLE STRUCTURE
// =============================================================================

const WORDS_DATA = [
  {
    id: 1,
    word: "ARTIFICIALINTELLIGENCE",
    displayWord: "ARTIFICIAL INTELLIGENCE",
    row: 5,
    col: 0,
    direction: "H",
    clueEn: "A technology that allows computers to think or do things that previously only people could do.",
    clueEs: "Una tecnología que permite a las computadoras pensar o hacer cosas que antes solo podían hacer las personas.",
    lengthText: "22 letters (10, 12)"
  },
  {
    id: 2,
    word: "COMPUTERS",
    displayWord: "COMPUTERS",
    row: 0,
    col: 2,
    direction: "V",
    clueEn: "Machines that process information and perform tasks.",
    clueEs: "Máquinas que procesan información y realizan tareas.",
    lengthText: "9 letters"
  },
  {
    id: 3,
    word: "REPETITIVE",
    displayWord: "REPETITIVE",
    row: 4,
    col: 13,
    direction: "V",
    clueEn: "Tasks that are repeated again and again.",
    clueEs: "Tareas que se repiten una y otra vez.",
    lengthText: "10 letters"
  },
  {
    id: 4,
    word: "ERRORS",
    displayWord: "ERRORS",
    row: 7,
    col: 1,
    direction: "H",
    clueEn: "Mistakes or problems in a computer program.",
    clueEs: "Errores o problemas en un programa informático.",
    lengthText: "6 letters"
  },
  {
    id: 5,
    word: "COMMUNICATION",
    displayWord: "COMMUNICATION",
    row: 1,
    col: 1,
    direction: "H",
    clueEn: "The exchange of information between people.",
    clueEs: "El intercambio de información entre personas.",
    lengthText: "13 letters"
  },
  {
    id: 6,
    word: "INFORMATION",
    displayWord: "INFORMATION",
    row: 4,
    col: 11,
    direction: "V",
    clueEn: "Facts or knowledge provided or received.",
    clueEs: "Datos o conocimientos que se proporcionan o reciben.",
    lengthText: "11 letters"
  },
  {
    id: 7,
    word: "ANALYSIS",
    displayWord: "ANALYSIS",
    row: 3,
    col: 8,
    direction: "V",
    clueEn: "The process of examining something in detail.",
    clueEs: "El proceso de examinar algo detalladamente.",
    lengthText: "8 letters"
  },
  {
    id: 8,
    word: "ECONOMICS",
    displayWord: "ECONOMICS",
    row: 4,
    col: 20,
    direction: "V",
    clueEn: "The field related to money, production and resources.",
    clueEs: "Campo relacionado con el dinero, la producción y los recursos.",
    lengthText: "9 letters"
  },
  {
    id: 9,
    word: "CAREERS",
    displayWord: "CAREERS",
    row: 10,
    col: 2,
    direction: "H",
    clueEn: "A person's profession or area of work.",
    clueEs: "La profesión o área de trabajo de una persona.",
    lengthText: "7 letters"
  },
  {
    id: 10,
    word: "TECHNOLOGY",
    displayWord: "TECHNOLOGY",
    row: 4,
    col: 18,
    direction: "V",
    clueEn: "The use of scientific knowledge to solve problems.",
    clueEs: "El uso del conocimiento científico para resolver problemas.",
    lengthText: "10 letters"
  }
];

const GRID_ROWS = 15;
const GRID_COLS = 22;

// Default high scores for initial challenge
const DEFAULT_LEADERBOARD = [
  { name: "Ada_Lovelace", timeSec: 104, penalties: 0, date: "2026-10-01" },
  { name: "Alan_Turing", timeSec: 135, penalties: 0, date: "2026-10-02" },
  { name: "Claude_Shannon", timeSec: 168, penalties: 0, date: "2026-10-03" },
  { name: "Grace_Hopper", timeSec: 195, penalties: 0, date: "2026-10-03" },
  { name: "John_McCarthy", timeSec: 220, penalties: 0, date: "2026-10-04" },
  { name: "Marvin_Minsky", timeSec: 245, penalties: 0, date: "2026-10-04" },
  { name: "Geoffrey_Hinton", timeSec: 270, penalties: 0, date: "2026-10-05" },
  { name: "Yann_LeCun", timeSec: 300, penalties: 0, date: "2026-10-05" },
  { name: "Demis_Hassabis", timeSec: 330, penalties: 0, date: "2026-10-06" },
  { name: "Fei_Fei_Li", timeSec: 360, penalties: 0, date: "2026-10-06" }
];

// =============================================================================
// 2. STATE MANAGEMENT
// =============================================================================

const state = {
  operatorName: "",
  isPlaying: false,
  isFinished: false,
  timerSeconds: 0,
  penaltySeconds: 0,
  timerInterval: null,
  activeCell: null, // { r, c }
  activeWordId: 1,
  activeDirection: "H",
  userGrid: {}, // "r_c" -> char
  solutionGrid: {}, // "r_c" -> char
  cellMetadata: {}, // "r_c" -> { words: [wordObj], startNum: int or null }
  soundEnabled: true,
  spanishHintsVisible: false,
  lastCompletedWords: new Set()
};

// =============================================================================
// 3. SOUND SYNTHESIZER (WEB AUDIO API)
// =============================================================================

class CyberSoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playKey() {
    if (!state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(480, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(720, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {
      // Audio fallback silent
    }
  }

  playErase() {
    if (!state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  playWordComplete() {
    if (!state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

          gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start();
          osc.stop(this.ctx.currentTime + 0.2);
        } catch (e) {}
      }, idx * 75);
    });
  }

  playVictory() {
    if (!state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const fanfare = [
      { freq: 440, delay: 0, dur: 0.15 },
      { freq: 554.37, delay: 150, dur: 0.15 },
      { freq: 659.25, delay: 300, dur: 0.2 },
      { freq: 880, delay: 500, dur: 0.5 }
    ];

    fanfare.forEach(({ freq, delay, dur }) => {
      setTimeout(() => {
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

          gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start();
          osc.stop(this.ctx.currentTime + dur);
        } catch (e) {}
      }, delay);
    });
  }
}

const sfx = new CyberSoundFX();

// =============================================================================
// 4. GRID BUILDING & METADATA PREPARATION
// =============================================================================

function initializeCrosswordStructure() {
  state.solutionGrid = {};
  state.cellMetadata = {};

  WORDS_DATA.forEach(wordObj => {
    const dr = wordObj.direction === "H" ? 0 : 1;
    const dc = wordObj.direction === "H" ? 1 : 0;

    for (let i = 0; i < wordObj.word.length; i++) {
      const r = wordObj.row + dr * i;
      const c = wordObj.col + dc * i;
      const key = `${r}_${c}`;
      const char = wordObj.word[i];

      state.solutionGrid[key] = char;

      if (!state.cellMetadata[key]) {
        state.cellMetadata[key] = {
          row: r,
          col: c,
          words: [],
          startNum: null,
          isDivider: false
        };
      }

      state.cellMetadata[key].words.push(wordObj);

      // Check for word start number
      if (i === 0) {
        state.cellMetadata[key].startNum = wordObj.id;
      }

      // Word 1 (ARTIFICIAL INTELLIGENCE) divider at index 9 ("L" of ARTIFICIAL)
      if (wordObj.id === 1 && i === 9) {
        state.cellMetadata[key].isDivider = true;
      }
    }
  });
}

function renderCrosswordGrid() {
  const gridEl = document.getElementById("crosswordGrid");
  gridEl.innerHTML = "";

  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const key = `${r}_${c}`;
      const meta = state.cellMetadata[key];
      const cellEl = document.createElement("div");
      cellEl.className = "cw-cell";
      cellEl.dataset.row = r;
      cellEl.dataset.col = c;
      cellEl.setAttribute("role", "gridcell");

      if (meta) {
        cellEl.classList.add("playable");
        cellEl.tabIndex = 0;
        cellEl.id = `cell_${r}_${c}`;

        if (meta.startNum) {
          const numBadge = document.createElement("span");
          numBadge.className = "cell-number";
          numBadge.textContent = meta.startNum;
          cellEl.appendChild(numBadge);
        }

        if (meta.isDivider) {
          cellEl.classList.add("word-divider-right");
        }

        const letterSpan = document.createElement("span");
        letterSpan.className = "cell-letter";
        letterSpan.textContent = state.userGrid[key] || "";
        cellEl.appendChild(letterSpan);

        cellEl.addEventListener("click", () => handleCellClick(r, c));
      } else {
        cellEl.classList.add("empty");
        cellEl.setAttribute("aria-hidden", "true");
      }

      gridEl.appendChild(cellEl);
    }
  }
}

function renderCluesList() {
  const acrossList = document.getElementById("acrossCluesList");
  const downList = document.getElementById("downCluesList");

  acrossList.innerHTML = "";
  downList.innerHTML = "";

  WORDS_DATA.forEach(w => {
    const li = document.createElement("li");
    li.className = "clue-item";
    li.id = `clue_item_${w.id}`;
    li.dataset.wordId = w.id;

    li.innerHTML = `
      <div class="clue-item-header">
        <span class="clue-item-num">#${w.id}</span>
        <span class="clue-item-length">${w.lengthText}</span>
      </div>
      <p class="clue-item-text">${w.clueEn}</p>
      <p class="clue-item-spanish ${state.spanishHintsVisible ? 'visible' : ''}">💡 ${w.clueEs}</p>
    `;

    li.addEventListener("click", () => {
      selectWord(w.id);
    });

    if (w.direction === "H") {
      acrossList.appendChild(li);
    } else {
      downList.appendChild(li);
    }
  });
}

// =============================================================================
// 5. SELECTION & NAVIGATION LOGIC
// =============================================================================

function handleCellClick(r, c) {
  const key = `${r}_${c}`;
  const meta = state.cellMetadata[key];
  if (!meta) return;

  // If clicked the current active cell, toggle direction if cell has 2 intersecting words
  if (state.activeCell && state.activeCell.r === r && state.activeCell.c === c) {
    if (meta.words.length > 1) {
      const otherWord = meta.words.find(w => w.id !== state.activeWordId);
      if (otherWord) {
        state.activeWordId = otherWord.id;
        state.activeDirection = otherWord.direction;
      }
    }
  } else {
    // New cell clicked
    state.activeCell = { r, c };

    // Check if current activeWord contains this cell
    const currentWordContains = meta.words.some(w => w.id === state.activeWordId);
    if (!currentWordContains) {
      // Switch active word to the first word belonging to this cell
      const chosenWord = meta.words.find(w => w.direction === state.activeDirection) || meta.words[0];
      state.activeWordId = chosenWord.id;
      state.activeDirection = chosenWord.direction;
    }
  }

  updateSelectionUI();
}

function selectWord(wordId, cellIndex = 0) {
  const wordObj = WORDS_DATA.find(w => w.id === wordId);
  if (!wordObj) return;

  state.activeWordId = wordObj.id;
  state.activeDirection = wordObj.direction;

  const dr = wordObj.direction === "H" ? 0 : 1;
  const dc = wordObj.direction === "H" ? 1 : 0;
  const targetR = wordObj.row + dr * cellIndex;
  const targetC = wordObj.col + dc * cellIndex;

  state.activeCell = { r: targetR, c: targetC };

  updateSelectionUI();
  scrollCellIntoView(targetR, targetC);
}

function updateSelectionUI() {
  if (!state.activeCell) return;

  const activeWordObj = WORDS_DATA.find(w => w.id === state.activeWordId);

  // Update banner
  if (activeWordObj) {
    document.getElementById("activeClueTag").textContent = `#${activeWordObj.id} ${activeWordObj.displayWord.toUpperCase()} [${activeWordObj.lengthText}]`;
    document.getElementById("activeDirectionTag").textContent = activeWordObj.direction === "H" ? "ACROSS ➔" : "DOWN ⬇";
    document.getElementById("activeClueText").textContent = activeWordObj.clueEn;

    const spanishEl = document.getElementById("activeClueSpanish");
    spanishEl.textContent = `Pista en español: ${activeWordObj.clueEs}`;
    if (state.spanishHintsVisible) {
      spanishEl.classList.add("visible");
    } else {
      spanishEl.classList.remove("visible");
    }
  }

  // Clear previous highlights
  document.querySelectorAll(".cw-cell").forEach(cell => {
    cell.classList.remove("active-focus", "word-active");
  });

  // Highlight all cells in the active word
  if (activeWordObj) {
    const dr = activeWordObj.direction === "H" ? 0 : 1;
    const dc = activeWordObj.direction === "H" ? 1 : 0;

    for (let i = 0; i < activeWordObj.word.length; i++) {
      const r = activeWordObj.row + dr * i;
      const c = activeWordObj.col + dc * i;
      const cellEl = document.getElementById(`cell_${r}_${c}`);
      if (cellEl) {
        cellEl.classList.add("word-active");
      }
    }
  }

  // Highlight active focused cell
  const currentCellEl = document.getElementById(`cell_${state.activeCell.r}_${state.activeCell.c}`);
  if (currentCellEl) {
    currentCellEl.classList.add("active-focus");
    currentCellEl.focus();
  }

  // Highlight active clue in sidebar
  document.querySelectorAll(".clue-item").forEach(item => {
    item.classList.remove("active");
  });
  const activeClueItem = document.getElementById(`clue_item_${state.activeWordId}`);
  if (activeClueItem) {
    activeClueItem.classList.add("active");
    activeClueItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function scrollCellIntoView(r, c) {
  const cellEl = document.getElementById(`cell_${r}_${c}`);
  if (cellEl) {
    cellEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }
}

// Move to next cell in current word
function advanceActiveCell(forward = true) {
  const wordObj = WORDS_DATA.find(w => w.id === state.activeWordId);
  if (!wordObj || !state.activeCell) return;

  const dr = wordObj.direction === "H" ? 0 : 1;
  const dc = wordObj.direction === "H" ? 1 : 0;

  // Find index of current cell within active word
  const deltaR = state.activeCell.r - wordObj.row;
  const deltaC = state.activeCell.c - wordObj.col;
  const currentIndex = wordObj.direction === "H" ? deltaC : deltaR;

  const nextIndex = currentIndex + (forward ? 1 : -1);

  if (nextIndex >= 0 && nextIndex < wordObj.word.length) {
    state.activeCell = {
      r: wordObj.row + dr * nextIndex,
      c: wordObj.col + dc * nextIndex
    };
    updateSelectionUI();
  }
}

// Arrow key navigation across the entire board
function moveByArrow(dr, dc) {
  if (!state.activeCell) return;
  const targetR = state.activeCell.r + dr;
  const targetC = state.activeCell.c + dc;
  const targetKey = `${targetR}_${targetC}`;

  if (state.cellMetadata[targetKey]) {
    handleCellClick(targetR, targetC);
  }
}

// Cycle to next word
function cycleNextWord() {
  const currentIndex = WORDS_DATA.findIndex(w => w.id === state.activeWordId);
  const nextWord = WORDS_DATA[(currentIndex + 1) % WORDS_DATA.length];
  selectWord(nextWord.id);
}

// =============================================================================
// 6. KEYBOARD & INPUT HANDLING
// =============================================================================

function setupKeyboardListeners() {
  window.addEventListener("keydown", (e) => {
    // If typing in an input field (like username prompt), ignore game keyboard
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (!state.isPlaying || state.isFinished) return;
    if (!state.activeCell) return;

    const key = e.key;
    const currentCoordKey = `${state.activeCell.r}_${state.activeCell.c}`;

    // Alphabet Letters (A-Z)
    if (/^[a-zA-Z]$/.test(key)) {
      e.preventDefault();
      const letter = key.toUpperCase();
      state.userGrid[currentCoordKey] = letter;

      const cellEl = document.getElementById(`cell_${state.activeCell.r}_${state.activeCell.c}`);
      if (cellEl) {
        const letterSpan = cellEl.querySelector(".cell-letter");
        if (letterSpan) letterSpan.textContent = letter;
      }

      sfx.playKey();
      advanceActiveCell(true);
      checkAllWordsProgress();
      return;
    }

    // Backspace / Delete
    if (key === "Backspace" || key === "Delete") {
      e.preventDefault();
      if (state.userGrid[currentCoordKey]) {
        delete state.userGrid[currentCoordKey];
        const cellEl = document.getElementById(`cell_${state.activeCell.r}_${state.activeCell.c}`);
        if (cellEl) {
          const letterSpan = cellEl.querySelector(".cell-letter");
          if (letterSpan) letterSpan.textContent = "";
        }
        sfx.playErase();
      } else {
        // Empty already, move back and delete previous
        advanceActiveCell(false);
        const prevKey = `${state.activeCell.r}_${state.activeCell.c}`;
        delete state.userGrid[prevKey];
        const prevCellEl = document.getElementById(`cell_${state.activeCell.r}_${state.activeCell.c}`);
        if (prevCellEl) {
          const letterSpan = prevCellEl.querySelector(".cell-letter");
          if (letterSpan) letterSpan.textContent = "";
        }
        sfx.playErase();
      }
      checkAllWordsProgress();
      return;
    }

    // Spacebar toggles word direction if at an intersection
    if (key === " ") {
      e.preventDefault();
      const meta = state.cellMetadata[currentCoordKey];
      if (meta && meta.words.length > 1) {
        const otherWord = meta.words.find(w => w.id !== state.activeWordId);
        if (otherWord) {
          state.activeWordId = otherWord.id;
          state.activeDirection = otherWord.direction;
          updateSelectionUI();
        }
      }
      return;
    }

    // Tab moves to next word
    if (key === "Tab") {
      e.preventDefault();
      cycleNextWord();
      return;
    }

    // Navigation Arrows
    if (key === "ArrowUp") { e.preventDefault(); moveByArrow(-1, 0); }
    if (key === "ArrowDown") { e.preventDefault(); moveByArrow(1, 0); }
    if (key === "ArrowLeft") { e.preventDefault(); moveByArrow(0, -1); }
    if (key === "ArrowRight") { e.preventDefault(); moveByArrow(0, 1); }
  });
}

// =============================================================================
// 7. PUZZLE PROGRESSION & VICTORY LOGIC
// =============================================================================

function checkAllWordsProgress() {
  let completedCount = 0;

  WORDS_DATA.forEach(wordObj => {
    const dr = wordObj.direction === "H" ? 0 : 1;
    const dc = wordObj.direction === "H" ? 1 : 0;

    let isWordCorrect = true;
    for (let i = 0; i < wordObj.word.length; i++) {
      const r = wordObj.row + dr * i;
      const c = wordObj.col + dc * i;
      const key = `${r}_${c}`;
      if (state.userGrid[key] !== wordObj.word[i]) {
        isWordCorrect = false;
        break;
      }
    }

    const clueItem = document.getElementById(`clue_item_${wordObj.id}`);

    if (isWordCorrect) {
      completedCount++;
      if (clueItem) clueItem.classList.add("completed");

      // Highlight word cells
      for (let i = 0; i < wordObj.word.length; i++) {
        const r = wordObj.row + dr * i;
        const c = wordObj.col + dc * i;
        const cellEl = document.getElementById(`cell_${r}_${c}`);
        if (cellEl) cellEl.classList.add("word-completed");
      }

      // Play completion chime once upon newly solved
      if (!state.lastCompletedWords.has(wordObj.id)) {
        state.lastCompletedWords.add(wordObj.id);
        sfx.playWordComplete();
      }
    } else {
      if (clueItem) clueItem.classList.remove("completed");
      state.lastCompletedWords.delete(wordObj.id);

      // Remove completed styling from cells that are not part of other completed words
      for (let i = 0; i < wordObj.word.length; i++) {
        const r = wordObj.row + dr * i;
        const c = wordObj.col + dc * i;
        const cellKey = `${r}_${c}`;
        const meta = state.cellMetadata[cellKey];
        const isPartOfOtherCompleted = meta && meta.words.some(
          other => other.id !== wordObj.id && state.lastCompletedWords.has(other.id)
        );
        if (!isPartOfOtherCompleted) {
          const cellEl = document.getElementById(`cell_${r}_${c}`);
          if (cellEl) cellEl.classList.remove("word-completed");
        }
      }
    }
  });

  // Update HUD solved count
  document.getElementById("solvedCount").textContent = completedCount;

  // Check for Total Victory (all 10 words complete)
  if (completedCount === WORDS_DATA.length && !state.isFinished) {
    triggerVictorySequence();
  }
}

async function triggerVictorySequence() {
  state.isFinished = true;
  state.isPlaying = false;
  clearInterval(state.timerInterval);

  sfx.playVictory();

  const totalTimeSec = state.timerSeconds + state.penaltySeconds;
  const timeFormatted = formatTime(totalTimeSec);

  // Record to Top 10 Leaderboard (Supabase Cloud + LocalStorage)
  const rankResult = await recordLeaderboardEntry(state.operatorName, totalTimeSec, state.penaltySeconds);

  // Fill Victory Modal Stats
  document.getElementById("victoryOperator").textContent = state.operatorName;
  document.getElementById("victoryTime").textContent = timeFormatted;
  document.getElementById("victoryRank").textContent = rankResult.rank ? `#${rankResult.rank}` : "UNRANKED";

  const rankMsgEl = document.getElementById("victoryRankMessage");
  if (rankResult.isTop10) {
    rankMsgEl.textContent = `🚀 Outstanding performance! You claimed Rank #${rankResult.rank} in the Top 10!`;
    rankMsgEl.style.color = "var(--accent-green)";
  } else {
    rankMsgEl.textContent = `Excellent job! Completed in ${timeFormatted}. Try again to beat the Top 10!`;
    rankMsgEl.style.color = "var(--accent-cyan)";
  }

  // Show victory modal
  setTimeout(() => {
    document.getElementById("victoryModal").classList.remove("hidden");
  }, 400);
}

// =============================================================================
// 8. TIMER & HUD
// =============================================================================

function startTimer() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    if (state.isPlaying && !state.isFinished) {
      state.timerSeconds++;
      updateTimerDisplay();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const currentTotal = state.timerSeconds + state.penaltySeconds;
  document.getElementById("timerDisplay").textContent = formatTime(currentTotal);
}

function formatTime(totalSec) {
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// =============================================================================
// 9. LEADERBOARD SYSTEM (SUPABASE CLOUD + LOCALSTORAGE FALLBACK)
// =============================================================================

const LEADERBOARD_KEY = "ai_crossword_leaderboard_v1";
let supabaseClient = null;

function initSupabase() {
  const cfg = window.SUPABASE_CONFIG || {};
  let url = cfg.url || "";
  let anonKey = cfg.anonKey || "";

  const stored = localStorage.getItem("ai_supabase_credentials");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.url && parsed.anonKey) {
        url = parsed.url;
        anonKey = parsed.anonKey;
      }
    } catch (e) {}
  }

  if (url && anonKey && window.supabase && typeof window.supabase.createClient === "function") {
    try {
      supabaseClient = window.supabase.createClient(url, anonKey);
      updateCloudStatusUI(true);
      setupSupabaseRealtime();
      return;
    } catch (err) {
      console.warn("Supabase init error:", err);
    }
  }

  updateCloudStatusUI(false);
}

function updateCloudStatusUI(isOnline) {
  const btn = document.getElementById("cloudDbConfigBtn");
  if (btn) {
    btn.innerHTML = isOnline ? "☁️ Supabase: Online 🟢" : "☁️ Supabase Setup";
    btn.classList.toggle("hud-btn-accent", isOnline);
  }
}

function setupSupabaseRealtime() {
  if (!supabaseClient) return;
  try {
    supabaseClient
      .channel("public:leaderboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "leaderboard" }, () => {
        const modal = document.getElementById("leaderboardModal");
        if (modal && !modal.classList.contains("hidden")) {
          renderLeaderboardModal(state.operatorName);
        }
      })
      .subscribe();
  } catch (e) {}
}

async function getLeaderboard() {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from("leaderboard")
        .select("*")
        .order("time_sec", { ascending: true })
        .limit(10);

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map(item => ({
          name: item.name,
          timeSec: item.time_sec,
          penalties: item.penalties || 0,
          date: item.created_at ? item.created_at.split("T")[0] : (item.date || "")
        }));
      }
    } catch (err) {
      console.warn("Supabase query error, fallback to local:", err);
    }
  }

  // Fallback to localStorage
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(DEFAULT_LEADERBOARD));
      return [...DEFAULT_LEADERBOARD];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...DEFAULT_LEADERBOARD];
  } catch (e) {
    return [...DEFAULT_LEADERBOARD];
  }
}

function saveLeaderboard(data) {
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(data));
  } catch (e) {}
}

async function recordLeaderboardEntry(name, totalSeconds, penalties) {
  const today = new Date().toISOString().split("T")[0];
  const newEntry = {
    name: name || "Anonymous_Agent",
    timeSec: totalSeconds,
    penalties: penalties,
    date: today
  };

  // 1. Save to Supabase Cloud if connected
  if (supabaseClient) {
    try {
      await supabaseClient.from("leaderboard").insert([{
        name: newEntry.name,
        time_sec: newEntry.timeSec,
        penalties: newEntry.penalties
      }]);
    } catch (e) {
      console.warn("Failed to insert into Supabase:", e);
    }
  }

  // 2. Always persist locally as well
  let localList = [];
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    localList = raw ? JSON.parse(raw) : [...DEFAULT_LEADERBOARD];
  } catch (e) {
    localList = [...DEFAULT_LEADERBOARD];
  }

  localList.push(newEntry);
  localList.sort((a, b) => a.timeSec - b.timeSec);
  const top10 = localList.slice(0, 10);
  saveLeaderboard(top10);

  // 3. Check rank position
  const currentScores = await getLeaderboard();
  const rankIdx = currentScores.findIndex(s => s.name === newEntry.name && s.timeSec === newEntry.timeSec);

  return {
    isTop10: rankIdx !== -1,
    rank: rankIdx !== -1 ? rankIdx + 1 : null
  };
}

async function renderLeaderboardModal(highlightName = null) {
  const tbody = document.getElementById("leaderboardBody");
  tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 1.25rem; color: var(--accent-cyan);">⚡ Fetching live scores...</td></tr>`;

  const list = await getLeaderboard();
  tbody.innerHTML = "";

  list.forEach((entry, idx) => {
    const tr = document.createElement("tr");
    const rank = idx + 1;

    let badgeClass = "rank-normal";
    let medalEmoji = `#${rank}`;
    if (rank === 1) { badgeClass = "rank-gold"; medalEmoji = "🥇"; }
    else if (rank === 2) { badgeClass = "rank-silver"; medalEmoji = "🥈"; }
    else if (rank === 3) { badgeClass = "rank-bronze"; medalEmoji = "🥉"; }

    if (highlightName && entry.name.toLowerCase() === highlightName.toLowerCase()) {
      tr.classList.add("current-user-row");
    }

    tr.innerHTML = `
      <td><span class="rank-badge ${badgeClass}">${medalEmoji}</span></td>
      <td><strong>${escapeHtml(entry.name)}</strong></td>
      <td><span class="time-highlight">${formatTime(entry.timeSec)}</span></td>
      <td>${entry.penalties > 0 ? `+${entry.penalties}s` : '0s'}</td>
      <td style="color: var(--text-muted); font-size: 0.75rem;">${entry.date || '---'}</td>
    `;

    tbody.appendChild(tr);
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// =============================================================================
// 10. ACTION CONTROLS (CHECK, REVEAL, CLEAR)
// =============================================================================

function checkPuzzleAnswers() {
  sfx.init();
  let foundAny = false;

  Object.keys(state.solutionGrid).forEach(key => {
    const entered = state.userGrid[key];
    const correct = state.solutionGrid[key];
    const [r, c] = key.split("_");
    const cellEl = document.getElementById(`cell_${r}_${c}`);

    if (cellEl && entered) {
      foundAny = true;
      if (entered === correct) {
        cellEl.classList.add("status-correct");
        setTimeout(() => cellEl.classList.remove("status-correct"), 1600);
      } else {
        cellEl.classList.add("status-error");
        setTimeout(() => cellEl.classList.remove("status-error"), 1600);
      }
    }
  });

  if (!foundAny) {
    alert("Type some letters before checking answers.");
  }
}

function revealCurrentLetter() {
  if (!state.activeCell) {
    alert("Select a crossword cell to reveal.");
    return;
  }

  const key = `${state.activeCell.r}_${state.activeCell.c}`;
  const correctLetter = state.solutionGrid[key];
  if (!correctLetter) return;

  const currentEntered = state.userGrid[key];
  if (currentEntered === correctLetter) {
    advanceActiveCell(true);
    return;
  }

  // Apply +15s penalty to leaderboard time
  state.penaltySeconds += 15;
  updateTimerDisplay();

  state.userGrid[key] = correctLetter;
  const cellEl = document.getElementById(`cell_${state.activeCell.r}_${state.activeCell.c}`);
  if (cellEl) {
    const letterSpan = cellEl.querySelector(".cell-letter");
    if (letterSpan) letterSpan.textContent = correctLetter;
    cellEl.classList.add("status-correct");
    setTimeout(() => cellEl.classList.remove("status-correct"), 1200);
  }

  sfx.playKey();
  advanceActiveCell(true);
  checkAllWordsProgress();
}

function clearCrosswordBoard() {
  if (!confirm("Are you sure you want to clear all entered letters?")) return;

  state.userGrid = {};
  state.lastCompletedWords.clear();

  document.querySelectorAll(".cw-cell.playable").forEach(cell => {
    const letterSpan = cell.querySelector(".cell-letter");
    if (letterSpan) letterSpan.textContent = "";
    cell.classList.remove("word-completed", "status-correct", "status-error");
  });

  document.querySelectorAll(".clue-item").forEach(item => {
    item.classList.remove("completed");
  });

  document.getElementById("solvedCount").textContent = "0";
  sfx.playErase();
}

// =============================================================================
// 11. NEURAL PARTICLE CANVAS BACKGROUND
// =============================================================================

function setupNeuralCanvas() {
  const canvas = document.getElementById("neuralCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = 42;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 1.8 + 1
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Update & draw particles
    for (let i = 0; i < particleCount; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 240, 255, 0.4)";
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particleCount; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

// =============================================================================
// 12. INITIALIZATION & UI EVENT ATTACHMENTS
// =============================================================================

document.addEventListener("DOMContentLoaded", () => {
  initializeCrosswordStructure();
  renderCrosswordGrid();
  renderCluesList();
  setupKeyboardListeners();
  setupNeuralCanvas();
  initSupabase();

  // Check stored operator
  const storedName = localStorage.getItem("ai_operator_name");
  if (storedName) {
    document.getElementById("usernameInput").value = storedName;
  }

  // Pre-fill Supabase modal inputs if available
  const storedCloud = localStorage.getItem("ai_supabase_credentials");
  if (storedCloud) {
    try {
      const parsed = JSON.parse(storedCloud);
      if (parsed.url) document.getElementById("supabaseUrlInput").value = parsed.url;
      if (parsed.anonKey) document.getElementById("supabaseKeyInput").value = parsed.anonKey;
    } catch (e) {}
  } else if (window.SUPABASE_CONFIG) {
    if (window.SUPABASE_CONFIG.url) document.getElementById("supabaseUrlInput").value = window.SUPABASE_CONFIG.url;
    if (window.SUPABASE_CONFIG.anonKey) document.getElementById("supabaseKeyInput").value = window.SUPABASE_CONFIG.anonKey;
  }

  // Cloud Config Modal Handlers
  const cloudModal = document.getElementById("cloudConfigModal");
  document.getElementById("cloudDbConfigBtn").addEventListener("click", () => {
    cloudModal.classList.remove("hidden");
  });
  document.getElementById("closeCloudConfigBtn").addEventListener("click", () => {
    cloudModal.classList.add("hidden");
  });

  document.getElementById("cloudConfigForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const url = document.getElementById("supabaseUrlInput").value.trim();
    const anonKey = document.getElementById("supabaseKeyInput").value.trim();

    if (!url || !anonKey) {
      alert("Please provide both the Supabase URL and Anon Key.");
      return;
    }

    localStorage.setItem("ai_supabase_credentials", JSON.stringify({ url, anonKey }));
    initSupabase();
    cloudModal.classList.add("hidden");
    alert("Supabase credentials saved! Connecting to cloud database...");
    renderLeaderboardModal(state.operatorName);
  });

  document.getElementById("disconnectCloudBtn").addEventListener("click", () => {
    localStorage.removeItem("ai_supabase_credentials");
    supabaseClient = null;
    updateCloudStatusUI(false);
    cloudModal.classList.add("hidden");
    alert("Switched back to Local Storage mode.");
    renderLeaderboardModal(state.operatorName);
  });

  // Login Form Submission
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("usernameInput").value.trim();
    if (nameInput.length < 2) {
      alert("Please enter a username with at least 2 characters.");
      return;
    }

    state.operatorName = nameInput;
    localStorage.setItem("ai_operator_name", state.operatorName);
    document.getElementById("currentOperatorName").textContent = state.operatorName;

    // Hide Login Modal & Start Game
    document.getElementById("loginModal").classList.add("hidden");
    state.isPlaying = true;
    state.isFinished = false;
    startTimer();

    // Select Word 1 by default
    selectWord(1);
    sfx.init();
  });

  // Sound Toggle
  const soundBtn = document.getElementById("soundToggleBtn");
  soundBtn.addEventListener("click", () => {
    state.soundEnabled = !state.soundEnabled;
    document.getElementById("soundIcon").textContent = state.soundEnabled ? "🔊" : "🔇";
    soundBtn.title = state.soundEnabled ? "Sound: ON" : "Sound: OFF";
  });

  // Spanish Hints Toggle
  const spanishBtn = document.getElementById("toggleSpanishBtn");
  spanishBtn.addEventListener("click", () => {
    state.spanishHintsVisible = !state.spanishHintsVisible;
    spanishBtn.classList.toggle("active", state.spanishHintsVisible);
    document.getElementById("spanishToggleLabel").textContent = state.spanishHintsVisible 
      ? "Spanish Hints: ON" 
      : "Spanish Hints: OFF";

    document.querySelectorAll(".clue-item-spanish").forEach(el => {
      el.classList.toggle("visible", state.spanishHintsVisible);
    });

    const activeSpanish = document.getElementById("activeClueSpanish");
    if (activeSpanish && activeSpanish.textContent) {
      activeSpanish.classList.toggle("visible", state.spanishHintsVisible);
    }
  });

  // Leaderboard Modal Open/Close
  const leaderboardModal = document.getElementById("leaderboardModal");
  const openLeaderboard = () => {
    renderLeaderboardModal(state.operatorName);
    leaderboardModal.classList.remove("hidden");
  };
  const closeLeaderboard = () => {
    leaderboardModal.classList.add("hidden");
  };

  document.getElementById("leaderboardBtn").addEventListener("click", openLeaderboard);
  document.getElementById("closeLeaderboardBtn").addEventListener("click", closeLeaderboard);
  document.getElementById("resumeFromLeaderboardBtn").addEventListener("click", closeLeaderboard);

  // Reset Leaderboard to default
  document.getElementById("resetLeaderboardBtn").addEventListener("click", () => {
    if (confirm("Reset the leaderboard back to standard AI benchmark scores?")) {
      saveLeaderboard(DEFAULT_LEADERBOARD);
      renderLeaderboardModal(state.operatorName);
    }
  });

  // Action Buttons
  document.getElementById("checkPuzzleBtn").addEventListener("click", checkPuzzleAnswers);
  document.getElementById("revealLetterBtn").addEventListener("click", revealCurrentLetter);
  document.getElementById("clearBoardBtn").addEventListener("click", clearCrosswordBoard);

  // Change User Button
  document.getElementById("changeUserBtn").addEventListener("click", () => {
    document.getElementById("loginModal").classList.remove("hidden");
    document.getElementById("usernameInput").focus();
  });

  // Victory Modal Actions
  document.getElementById("viewLeaderboardFromVictoryBtn").addEventListener("click", () => {
    document.getElementById("victoryModal").classList.add("hidden");
    openLeaderboard();
  });

  document.getElementById("playAgainBtn").addEventListener("click", () => {
    document.getElementById("victoryModal").classList.add("hidden");
    clearCrosswordBoard();
    state.timerSeconds = 0;
    state.penaltySeconds = 0;
    state.isFinished = false;
    state.isPlaying = true;
    updateTimerDisplay();
    startTimer();
    selectWord(1);
  });
});
