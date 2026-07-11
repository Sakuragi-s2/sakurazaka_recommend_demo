// 1. 楽曲データ（最低5曲、各タグ3つ以上、YouTube動画IDを含む）
const songs = [
    {
        title: "Nobody's fault",
        tags: ["かっこいい", "決意", "孤独", "メッセージ性", "力強い"],
        videoId: "f_zH3HofFow"
    },
    {
        title: "BAN",
        tags: ["焦り", "激しい", "かっこいい", "絶望", "疾走感"],
        videoId: "fpoRFI8h2u4"
    },
    {
        title: "なぜ 恋をして来なかったんだろう？",
        tags: ["恋愛", "楽しい", "ポップ", "ワクワク", "幸せ"],
        videoId: "a35AyyHivm8"
    },
    {
        title: "Start over!",
        tags: ["爆発力", "自由", "破壊", "テンション上げたい", "かっこいい"],
        videoId: "YJRFD1OAW-Q"
    },
    {
        title: "承認欲求",
        tags: ["葛藤", "メッセージ性", "現代的", "ダンス", "孤独"],
        videoId: "5W89Ylt0F4Q"
    },
    {
        title: "桜月",
        tags: ["悲しい", "切ない", "美しい", "別れ", "恋愛"],
        videoId: "OQx8HtcwBfs"
    }
];

// 全てのタグを重複なしで抽出
const allTagsSet = new Set();
songs.forEach(song => {
    song.tags.forEach(tag => allTagsSet.add(tag));
});
const allTags = Array.from(allTagsSet);

let selectedTags = [];

// DOM要素の取得
const tagsContainer = document.getElementById('tags-container');
const selectedCountEl = document.getElementById('selected-count');
const recommendBtn = document.getElementById('recommend-btn');
const selectionArea = document.getElementById('selection-area');
const resultArea = document.getElementById('result-area');

const resultTitle = document.getElementById('result-title');
const resultMatchedTags = document.getElementById('result-matched-tags');
const resultLink = document.getElementById('result-link');
const resultThumbnail = document.getElementById('result-thumbnail');
const restartBtn = document.getElementById('restart-btn');

// タグの描画処理
function renderTags() {
    tagsContainer.innerHTML = '';
    
    allTags.forEach(tag => {
        const tagEl = document.createElement('div');
        tagEl.classList.add('tag');
        tagEl.textContent = tag;

        const isSelected = selectedTags.includes(tag);
        const isMaxSelected = selectedTags.length >= 3;

        if (isSelected) {
            tagEl.classList.add('selected');
        } else if (isMaxSelected) {
            tagEl.classList.add('disabled');
        }

        tagEl.addEventListener('click', () => {
            if (isSelected) {
                // 選択解除
                selectedTags = selectedTags.filter(t => t !== tag);
                renderTags();
            } else if (!isMaxSelected) {
                // 選択追加
                selectedTags.push(tag);
                renderTags();
            }
        });

        tagsContainer.appendChild(tagEl);
    });

    selectedCountEl.textContent = selectedTags.length;
    recommendBtn.disabled = selectedTags.length === 0;
}

// 検索ロジック処理
recommendBtn.addEventListener('click', () => {
    let maxScore = -1;
    let candidates = [];

    songs.forEach(song => {
        // 選択されたタグが楽曲のタグに含まれている数をカウント
        const matchedTags = song.tags.filter(t => selectedTags.includes(t));
        const score = matchedTags.length;

        if (score > maxScore) {
            maxScore = score;
            candidates = [{ song, matchedTags }];
        } else if (score === maxScore) {
            candidates.push({ song, matchedTags });
        }
    });

    // 同点の場合はランダムに1曲選出
    const randomIndex = Math.floor(Math.random() * candidates.length);
    const result = candidates[randomIndex];

    showResult(result.song, result.matchedTags);
});

// 結果表示処理
function showResult(song, matchedTags) {
    resultTitle.textContent = song.title;
    resultMatchedTags.textContent = matchedTags.length > 0 ? matchedTags.join('、 ') : 'なし';
    
    // サムネイルとリンクの設定（iframeを使用せず別タブで開く）
    resultThumbnail.src = `https://img.youtube.com/vi/${song.videoId}/maxresdefault.jpg`;
    resultLink.href = `https://www.youtube.com/watch?v=${song.videoId}`;
    
    selectionArea.classList.add('hidden');
    resultArea.classList.remove('hidden');
}

// やり直し処理
restartBtn.addEventListener('click', () => {
    selectedTags = [];
    renderTags();
    resultArea.classList.add('hidden');
    selectionArea.classList.remove('hidden');
});

// 初期描画の実行
renderTags();