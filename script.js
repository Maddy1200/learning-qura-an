const surahSelect = document.getElementById("surahSelect");
const quranContainer = document.getElementById("quranContainer");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

let completedVerses = Number(localStorage.getItem("completedVerses")) || 0;
let totalVerses = 6236;

updateProgress();

/* ================= SURAH SECTION ================= */

async function loadSurahList() {
  const response = await fetch("https://api.alquran.cloud/v1/surah");
  const data = await response.json();

  data.data.forEach((surah) => {
    const option = document.createElement("option");
    option.value = surah.number;
    option.textContent = `${surah.number}. ${surah.englishName}`;
    surahSelect.appendChild(option);
  });

  loadSurah();
}

async function loadSurah() {
  const surahNumber = surahSelect.value;
  quranContainer.innerHTML = "Loading...";

  const arabicRes = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`);
  const translationRes = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`);
  const transliterationRes = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.transliteration`);

  const arabicData = await arabicRes.json();
  const translationData = await translationRes.json();
  const transliterationData = await transliterationRes.json();

  quranContainer.innerHTML = "";

  arabicData.data.ayahs.forEach((ayah, index) => {
    const verseDiv = document.createElement("div");
    verseDiv.classList.add("verse");

    verseDiv.innerHTML = `
      <div class="arabic">${ayah.text}</div>
      <div class="transliteration">${transliterationData.data.ayahs[index].text}</div>
      <div class="translation">${translationData.data.ayahs[index].text}</div>
      <button onclick="playAudio('${ayah.audio}', this)">🔊 Play</button>
      <button onclick="markComplete()">✅ Complete</button>
    `;

    quranContainer.appendChild(verseDiv);
  });
}

function playAudio(url, button) {
  const audio = new Audio(url);

  document.querySelectorAll(".verse").forEach(v =>
    v.classList.remove("highlight")
  );

  button.parentElement.classList.add("highlight");
  audio.play();
}

function markComplete() {
  completedVerses++;
  localStorage.setItem("completedVerses", completedVerses);
  updateProgress();
}

function updateProgress() {
  const percent = (completedVerses / totalVerses) * 100;
  progressFill.style.width = percent + "%";
  progressText.innerText = `${completedVerses} verses completed`;
}

surahSelect.addEventListener("change", loadSurah);
loadSurahList();

/* ================= MAKHRAJ SECTION ================= */

const makhrajLetters = [
  { letter: "ا", place: "From throat", audio: "audio/alif.mp3" },
  { letter: "ب", place: "From lips", audio: "audio/ba.mp3" },
  { letter: "ت", place: "From tip of tongue", audio: "audio/ta.mp3" }
];

let currentMakhraj = 0;

function loadMakhraj() {
  document.getElementById("makhrajLetter").innerText =
    makhrajLetters[currentMakhraj].letter;

  document.getElementById("makhrajPlace").innerText =
    "Makhraj: " + makhrajLetters[currentMakhraj].place;
}

function playMakhrajAudio() {
  const audio = new Audio(makhrajLetters[currentMakhraj].audio);
  audio.play();

  currentMakhraj++;
  if (currentMakhraj >= makhrajLetters.length)
    currentMakhraj = 0;

  setTimeout(loadMakhraj, 1000);
}

loadMakhraj();