// ==========================================================
// 感情タグ一覧
// ==========================================================
const EMOTION_TAGS = [
  "悲しい",
  "テンション上げたい",
  "応援されたい",
  "切ない",
  "元気になりたい",
  "泣きたい",
  "前向きになりたい",
  "一人を感じたい",
  "恋したい",
  "強くなりたい"
];

// ==========================================================
// 楽曲データ（ダミーデータ）
// 各楽曲は感情タグを4〜6個保持する
// videoId は実際のYouTube動画IDに差し替えて使用してください
// ==========================================================
const SONGS = [
  {
    title: "木枯らしは泣かない",
    tags: ["悲しい", "切ない", "泣きたい", "一人を感じたい"],
    videoId: "sample000001"
  },
  {
    title: "Anthem time",
    tags: ["テンション上げたい", "元気になりたい", "前向きになりたい", "応援されたい"],
    videoId: "sample000002"
  },
  {
    title: "青空が見えるまで",
    tags: ["応援されたい", "前向きになりたい", "強くなりたい", "元気になりたい", "テンション上げたい"],
    videoId: "sample000003"
  },
  {
    title: "本質的なこと",
    tags: ["切ない", "恋したい", "一人を感じたい", "悲しい"],
    videoId: "sample000004"
  },
  {
    title: "The growing up train",
    tags: ["強くなりたい", "前向きになりたい", "テンション上げたい", "応援されたい", "元気になりたい"],
    videoId: "sample000005"
  },
  {
    title: "紋白蝶が確か飛んでた",
    tags: ["恋したい", "切ない", "元気になりたい", "泣きたい"],
    videoId: "sample000006"
  },
  {
    title: "モノクロの回廊",
    tags: ["悲しい", "一人を感じたい", "泣きたい", "切ない", "強くなりたい"],
    videoId: "sample000007"
  },
  {
    title: "ドローン旋回中",
    tags: ["前向きになりたい", "強くなりたい", "応援されたい", "テンション上げたい", "元気になりたい", "恋したい"],
    videoId: "sample000008"
  }
];

const MAX_SELECTION = 3;

// ==========================================================
// 状態
// ==========================================================
let selectedTags = [];

// ==========================================================
// DOM取得
// ==========================================================
const tagListEl = document.getElementById("tagList");
const selectedCountEl = document.getElementById("selectedCount");
const recommendBtn = document.getElementById("recommendBtn");
const retryBtn = document.getElementById("retryBtn");

const screenSelect = document.getElementById("screen-select");
const screenResult = document.getElementById("screen-result");

const resultSongName = document.getElementById("resultSongName");
const resultThumb = document.getElementById("resultThumb");
const resultThumbLink = document.getElementById("resultThumbLink");
const resultMatchTags = document.getElementById("resultMatchTags");

// ==========================================================
// 初期描画
// ==========================================================
function renderTags() {
  tagListEl.innerHTML = "";

  EMOTION_TAGS.forEach((tag) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tag";
    btn.textContent = tag;

    const isSelected = selectedTags.includes(tag);
    const isDisabled = !isSelected && selectedTags.length >= MAX_SELECTION;

    if (isSelected) {
      btn.classList.add("tag--selected");
    }
    if (isDisabled) {
      btn.classList.add("tag--disabled");
      btn.disabled = true;
    }

    btn.addEventListener("click", () => onTagClick(tag));

    tagListEl.appendChild(btn);
  });

  selectedCountEl.textContent = selectedTags.length;
  recommendBtn.disabled = selectedTags.length !== MAX_SELECTION;
}

// ==========================================================
// タグクリック処理
// ==========================================================
function onTagClick(tag) {
  if (selectedTags.includes(tag)) {
    // 選択解除
    selectedTags = selectedTags.filter((t) => t !== tag);
  } else {
    if (selectedTags.length >= MAX_SELECTION) {
      return;
    }
    selectedTags.push(tag);
  }
  renderTags();
}

// ==========================================================
// おすすめ楽曲の選出ロジック
// ==========================================================
function pickRecommendedSong() {
  let bestScore = -1;
  let candidates = [];

  SONGS.forEach((song) => {
    const matchCount = song.tags.filter((t) => selectedTags.includes(t)).length;

    if (matchCount > bestScore) {
      bestScore = matchCount;
      candidates = [song];
    } else if (matchCount === bestScore) {
      candidates.push(song);
    }
  });

  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  const matchedTags = chosen.tags.filter((t) => selectedTags.includes(t));

  return { song: chosen, matchedTags };
}

// ==========================================================
// 結果描画
// ==========================================================
function renderResult(song, matchedTags) {
  resultSongName.textContent = song.title;

  const youtubeUrl = `https://www.youtube.com/watch?v=${song.videoId}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${song.videoId}/maxresdefault.jpg`;

  resultThumb.src = thumbnailUrl;
  resultThumb.alt = `${song.title} サムネイル`;
  resultThumbLink.href = youtubeUrl;

  resultMatchTags.innerHTML = "";
  matchedTags.forEach((tag) => {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = tag;
    resultMatchTags.appendChild(span);
  });
}

// ==========================================================
// 画面切り替え
// ==========================================================
function showResultScreen() {
  screenSelect.classList.add("screen--hidden");
  screenResult.classList.remove("screen--hidden");
}

function showSelectScreen() {
  screenResult.classList.add("screen--hidden");
  screenSelect.classList.remove("screen--hidden");
}

// ==========================================================
// イベント登録
// ==========================================================
recommendBtn.addEventListener("click", () => {
  if (selectedTags.length !== MAX_SELECTION) return;

  const { song, matchedTags } = pickRecommendedSong();
  renderResult(song, matchedTags);
  showResultScreen();
});

retryBtn.addEventListener("click", () => {
  selectedTags = [];
  renderTags();
  showSelectScreen();
});

// ==========================================================
// 初期化
// ==========================================================
renderTags();