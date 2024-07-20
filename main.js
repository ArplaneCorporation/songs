const apiKey = 'AIzaSyDgxTWXvIUQND4C7gzapRW6KNqEaBPQ8Y0';
const sheetId = '1RghErH0w2v3msmgsNubUZxchF14ROg0WWNrKMsBZ6Ug';
const sheetName = 'Songs';
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

fetch(url)
    .then(response => response.json())
    .then(data => {
        const rowData = data.values.slice(1); // ละเว้นแถวหัวเรื่อง
        let html = '';
        rowData.forEach((row, index) => {
            html += `
                <tr>
                    <td>${row[0]}</td>
                    <td>${row[1]}</td>
                    <td><a href="play.html?songId=${index}" target="_blank">${row[2]}</a></td>
                </tr>
            `;
        });
        document.querySelector('#songs tbody').innerHTML = html;
    });

function goBack() {
    window.location.href = 'index.html';
}

function embedSong() {
    const songId = new URLSearchParams(window.location.search).get('songId');
    const embedUrl = `https://arplanecorporation.github.io/songs/embed.html?songId=${songId}`;
    prompt('ฝังเพลงโดยใช้ URL นี้:', embedUrl);
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('play.html')) {
        playSong();
    }
});

function playSong() {
    const currentIndex = new URLSearchParams(window.location.search).get('songId');
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const rowData = data.values.slice(1); // ละเว้นแถวหัวเรื่อง
            const song = rowData[currentIndex];

            document.getElementById('song-title').innerText = song[0];
            const audio = document.getElementById('audio');
            audio.src = song[2];
            document.getElementById('lyrics').innerText = song[1];

            const playPauseButton = document.getElementById('play-pause');
            const repeatButton = document.getElementById('repeat');
            let isRepeating = false;

            playPauseButton.addEventListener('click', () => {
                if (audio.paused) {
                    audio.play();
                    playPauseButton.innerText = 'หยุด';
                } else {
                    audio.pause();
                    playPauseButton.innerText = 'เล่น';
                }
            });

            repeatButton.addEventListener('click', () => {
                isRepeating = !isRepeating;
                repeatButton.innerText = isRepeating ? 'หยุดเล่นซ้ำ' : 'เล่นซ้ำ';
            });

            const progress = document.getElementById('progress');
            progress.addEventListener('input', () => {
                audio.currentTime = (progress.value / 100) * audio.duration;
            });

            audio.addEventListener('timeupdate', () => {
                progress.value = (audio.currentTime / audio.duration) * 100;
                document.getElementById('current-time').innerText = formatTime(audio.currentTime);
                document.getElementById('duration').innerText = formatTime(audio.duration);
            });

            audio.addEventListener('ended', () => {
                if (isRepeating) {
                    audio.currentTime = 0;
                    audio.play();
                } else {
                    playPauseButton.innerText = 'เล่น';
                }
            });

            audio.addEventListener('loadedmetadata', () => {
                document.getElementById('duration').innerText = formatTime(audio.duration);
            });
        });
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}
