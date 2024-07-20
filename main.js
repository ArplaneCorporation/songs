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
            const songName = row[0];
            html += `<li onclick="selectSong(${index})">${songName}</li>`;
        });
        document.getElementById('songs').innerHTML = html;
    });

function selectSong(index) {
    localStorage.setItem('currentSongIndex', index);
    window.location.href = 'play.html';
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}
