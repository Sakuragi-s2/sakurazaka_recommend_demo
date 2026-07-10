// =============================
// 楽曲データ（ダミーデータ）
// =============================
// videoId はダミーの値です。実際に公開する際は、各曲の公式YouTube動画IDに置き換えてください。
const songs = [
  {
    title: "自分の意志",
    tags: ["元気になりたい", "背中を押されたい", "テンション上げたい"],
    videoId: "dummy_jibunnoishi"
  },
  {
    title: "承認欲求",
    tags: ["モヤモヤする", "悩んでいる", "背中を押されたい"],
    videoId: "dummy_shouninyokkyu"
  },
  {
    title: "BAN",
    tags: ["テンション上げたい", "怒っている", "スカッとしたい"],
    videoId: "dummy_ban"
  },
  {
    title: "何歳の頃に戻りたいのか?",
    tags: ["懐かしい気分", "切ない", "悲しい"],
    videoId: "dummy_nansai"
  },
  {
    title: "五月雨よ",
    tags: ["悲しい", "切ない", "一人になりたい"],
    videoId: "dummy_samidareyo"
  },
  {
    title: "Nobody's fault",
    tags: ["モヤモヤする", "悩んでいる", "一人になりたい"],
    videoId: "dummy_nobodysfault"
  },
  {
    title: "キミのことが知りたいんだ",
    tags: ["ときめきたい", "元気になりたい", "テンション上げたい"],
    videoId: "dummy_kiminokoto"
  },
  {
    title: "Buddies",
    tags: ["元気になりたい", "背中を押されたい", "懐かしい気分"],
    videoId: "dummy_buddies"
  },
  {
    title: "何かの間違いだった",
    tags: ["切ない", "悲しい", "モヤモヤする"],
    videoId: "dummy_nanikanomachigai"
  },
  {
    title: "流れ弾",
    tags: ["怒っている", "スカッとしたい", "テンション上げたい"],
    videoId: "dummy_nagaredama"
  }
];

// =============================
// 感情タグ一覧（楽曲データから重複なしで自動抽出）
// =============================
const allTags = [...new Set(songs.flatMap(song => song.tags))];

// =============================
// 状態管理
// =============================
const MAX_SELECT = 3;
let selectedTags = [];

// =============================
// DOM要素の取得
// =============================
const tagListEl = document.getElementById("tag-list");
const selectedCountNumEl = document.getElementById("selected-count-num");
const recommendBtn = document.getElementById("recommend-btn");
const selectScreen = document.getElementById("select-screen");
const resultScreen = document.getElementById("result-screen");
const resultTitleEl = document.getElementById("result-title");
const resultMatchedTagsEl = document.getElementById("result-matched-tags");
const resultVideoEl = document.getElementById("result-video");
const resultLinkEl = document.getElementById("result-link");
const resetBtn = document.getElementById("reset-btn");

// =============================
// タグ一覧の描画
// =============================
function renderTags() {
  tagListEl.innerHTML = "";
  allTags.forEach(tag => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tag-btn";
    btn.textContent = tag;
    btn.dataset.tag = tag;

    const isSelected = selectedTags.includes(tag);
    const isMaxReachedAndNotSelected =
      selectedTags.length >= MAX_SELECT && !isSelected;

    if (isSelected) {
      btn.classList.add("selected");
    }
    if (isMaxReachedAndNotSelected) {
      btn.classList.add("disabled");
    }

    btn.addEventListener("click", () => onTagClick(tag));
    tagListEl.appendChild(btn);
  });

  selectedCountNumEl.textContent = selectedTags.length;
  recommendBtn.disabled = selectedTags.length === 0;
}

// =============================
// タグクリック時の処理
// =============================
function onTagClick(tag) {
  const isSelected = selectedTags.includes(tag);

  if (isSelected) {
    // 選択解除
    selectedTags = selectedTags.filter(t => t !== tag);
  } else {
    // 上限に達していなければ選択
    if (selectedTags.length >= MAX_SELECT) {
      return;
    }
    selectedTags.push(tag);
  }

  renderTags();

  // 3つ選んだ時点で自動的におすすめを表示
  if (selectedTags.length === MAX_SELECT) {
    showRecommendation();
  }
}

// =============================
// レコメンドロジック
// =============================
function getRecommendedSong() {
  let bestSong = null;
  let bestScore = -1;
  let bestMatchedTags = [];

  songs.forEach(song => {
    const matchedTags = song.tags.filter(tag => selectedTags.includes(tag));
    const score = matchedTags.length;

    if (score > bestScore) {
      bestScore = score;
      bestSong = song;
      bestMatchedTags = matchedTags;
    }
  });

  return { song: bestSong, matchedTags: bestMatchedTags };
}

// =============================
// 結果表示
// =============================
function showRecommendation() {
  const { song, matchedTags } = getRecommendedSong();

  if (!song) {
    return;
  }

  resultTitleEl.textContent = song.title;

  resultMatchedTagsEl.innerHTML = "";
  matchedTags.forEach(tag => {
    const span = document.createElement("span");
    span.className = "matched-tag";
    span.textContent = tag;
    resultMatchedTagsEl.appendChild(span);
  });

  const youtubeUrl = `https://www.youtube.com/watch?v=${song.videoId}`;
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${song.videoId}`;

  resultVideoEl.src = youtubeEmbedUrl;
  resultLinkEl.href = youtubeUrl;

  selectScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
}

// =============================
// リセット処理
// =============================
function resetApp() {
  selectedTags = [];
  resultVideoEl.src = "";
  resultScreen.classList.add("hidden");
  selectScreen.classList.remove("hidden");
  renderTags();
}

// =============================
// イベントリスナー登録
// =============================
recommendBtn.addEventListener("click", showRecommendation);
resetBtn.addEventListener("click", resetApp);

// =============================
// 初期化
// =============================
renderTags();