// =========================================================
// 楽曲データ（ダミーデータ）
// ※YouTubeの動画IDはサンプル用の架空のIDです。
//   実際に公開する際は正しい動画IDに置き換えてください。
// =========================================================
const songs = [
  {
    title: "自業自得",
    tags: ["悲しい", "切ない", "強がりたい", "後悔"],
    platform: "youtube",
    youtubeId: "dQw4w9WgXcQ"
  },
  {
    title: "BAN",
    tags: ["テンション上げたい", "元気を出したい", "怒り", "強くなりたい", "解放されたい"],
    platform: "youtube",
    youtubeId: "3JZ4pnNtyxQ"
  },
  {
    title: "承認欲求",
    tags: ["不安", "焦り", "認められたい", "孤独"],
    platform: "spotify",
    spotifyUrl: "https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC"
  },
  {
    title: "五月雨よ",
    tags: ["切ない", "悲しい", "懐かしい", "しんみりしたい"],
    platform: "youtube",
    youtubeId: "9bZkp7q19f0"
  },
  {
    title: "偶然の答え",
    tags: ["前向きになりたい", "元気を出したい", "希望", "頑張りたい", "応援されたい"],
    platform: "spotify",
    spotifyUrl: "https://open.spotify.com/track/2takcwOaAZWiXQijPHIx7B"
  },
  {
    title: "Nobody's fault",
    tags: ["怒り", "モヤモヤ", "強がりたい", "テンション上げたい"],
    platform: "youtube",
    youtubeId: "eYq7WapuDLU"
  },
  {
    title: "何度も夢の中で",
    tags: ["寂しい", "会いたい", "切ない", "懐かしい", "しんみりしたい"],
    platform: "spotify",
    spotifyUrl: "https://open.spotify.com/track/6RMlIzTgmHaEz1lc0GTeuS"
  },
  {
    title: "Start over!",
    tags: ["前向きになりたい", "元気を出したい", "希望", "新しい一歩", "テンション上げたい"],
    platform: "youtube",
    youtubeId: "6BbdSXwEDgY"
  }
];

// 感情タグ一覧（表示順）
const allTags = [
  "悲しい", "切ない", "強がりたい", "後悔",
  "テンション上げたい", "元気を出したい", "怒り", "強くなりたい", "解放されたい",
  "不安", "焦り", "認められたい", "孤独",
  "懐かしい", "しんみりしたい",
  "前向きになりたい", "希望", "頑張りたい", "応援されたい",
  "モヤモヤ", "寂しい", "会いたい", "新しい一歩"
];

// 重複を除去
const uniqueTags = [...new Set(allTags)];

// 選択中のタグ
let selectedTags = [];

// =========================================================
// DOM要素
// =========================================================
const tagListEl = document.getElementById("tagList");
const selectedCountEl = document.getElementById("selectedCount");
const recommendBtn = document.getElementById("recommendBtn");
const selectScreen = document.getElementById("selectScreen");
const resultScreen = document.getElementById("resultScreen");
const resultTitleEl = document.getElementById("resultTitle");
const matchedTagsEl = document.getElementById("matchedTags");
const mediaAreaEl = document.getElementById("mediaArea");
const resetBtn = document.getElementById("resetBtn");

// =========================================================
// タグ一覧の描画
// =========================================================
function renderTags() {
  tagListEl.innerHTML = "";

  uniqueTags.forEach((tag) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tag-btn";
    btn.textContent = tag;

    const isSelected = selectedTags.includes(tag);
    if (isSelected) {
      btn.classList.add("selected");
    }

    // 3つ選択済みで、かつこのタグが未選択なら無効化
    if (selectedTags.length >= 3 && !isSelected) {
      btn.disabled = true;
    }

    btn.addEventListener("click", () => toggleTag(tag));
    tagListEl.appendChild(btn);
  });

  selectedCountEl.textContent = selectedTags.length;
  recommendBtn.disabled = selectedTags.length === 0;
}

// タグの選択・解除
function toggleTag(tag) {
  const index = selectedTags.indexOf(tag);

  if (index >= 0) {
    // 選択済み → 解除
    selectedTags.splice(index, 1);
  } else {
    // 未選択 → 追加（最大3つまで）
    if (selectedTags.length >= 3) {
      return;
    }
    selectedTags.push(tag);
  }

  renderTags();
}

// =========================================================
// レコメンドロジック
// =========================================================
function recommendSong() {
  if (selectedTags.length === 0) return;

  let bestScore = 0;
  let bestSongs = [];

  songs.forEach((song) => {
    const matchCount = song.tags.filter((t) => selectedTags.includes(t)).length;

    if (matchCount > bestScore) {
      bestScore = matchCount;
      bestSongs = [song];
    } else if (matchCount === bestScore && matchCount > 0) {
      bestSongs.push(song);
    }
  });

  // 一致数0の場合は全曲対象からランダムに選出（フォールバック）
  if (bestScore === 0) {
    bestSongs = songs;
  }

  // 同点の場合はランダムに1曲選出
  const chosenSong = bestSongs[Math.floor(Math.random() * bestSongs.length)];

  const matchedTags = chosenSong.tags.filter((t) => selectedTags.includes(t));

  showResult(chosenSong, matchedTags);
}

// =========================================================
// 結果表示
// =========================================================
function showResult(song, matchedTags) {
  resultTitleEl.textContent = song.title;

  // 一致タグの描画
  matchedTagsEl.innerHTML = "";
  if (matchedTags.length > 0) {
    matchedTags.forEach((tag) => {
      const span = document.createElement("span");
      span.className = "matched-tag";
      span.textContent = tag;
      matchedTagsEl.appendChild(span);
    });
  } else {
    const span = document.createElement("span");
    span.className = "matched-tag";
    span.textContent = "一致なし（おまかせ選出）";
    matchedTagsEl.appendChild(span);
  }

  // メディアエリアの描画
  mediaAreaEl.innerHTML = "";

  if (song.platform === "youtube") {
    const wrapper = document.createElement("div");
    wrapper.className = "youtube-thumb-wrapper";

    const img = document.createElement("img");
    img.className = "youtube-thumb";
    img.src = `https://img.youtube.com/vi/${song.youtubeId}/maxresdefault.jpg`;
    img.alt = song.title;

    const playIcon = document.createElement("div");
    playIcon.className = "play-icon";

    wrapper.appendChild(img);
    wrapper.appendChild(playIcon);

    wrapper.addEventListener("click", () => {
      window.open(`https://www.youtube.com/watch?v=${song.youtubeId}`, "_blank");
    });

    mediaAreaEl.appendChild(wrapper);
  } else if (song.platform === "spotify") {
    const link = document.createElement("a");
    link.className = "spotify-link";
    link.href = song.spotifyUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Spotifyで聴く";

    mediaAreaEl.appendChild(link);
  }

  // 画面切り替え
  selectScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
}

// =========================================================
// リセット処理
// =========================================================
function resetApp() {
  selectedTags = [];
  renderTags();

  resultScreen.classList.add("hidden");
  selectScreen.classList.remove("hidden");
}

// =========================================================
// イベント登録
// =========================================================
recommendBtn.addEventListener("click", recommendSong);
resetBtn.addEventListener("click", resetApp);

// =========================================================
// 初期化
// =========================================================
renderTags();
