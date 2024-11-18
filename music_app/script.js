const audioPlayer = document.getElementById('audio-player');
const fileInput = document.getElementById('file-input');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const trackInfo = document.getElementById('track-info');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');

let trackQueue = []; // Queue of tracks to play
let currentTrackIndex = 0;

//Set initial volume
audioPlayer.volume = volumeSlider.value;
//Update volume when slider changes
volumeSlider.addEventListener('input', () => {
    audioPlayer.volume = volumeSlider.value;
});

// Load selected files into the track queue and start playing the first track if none is playing
fileInput.addEventListener('change', (event) => {
    const newTracks = Array.from(event.target.files);
    trackQueue.push(...newTracks); // Add new tracks to the queue

    // If no track is currently playing, start with the first track in the queue
    if (audioPlayer.paused && trackQueue.length > 0) {
        currentTrackIndex = 0;
        loadTrack(currentTrackIndex);
    }
});

// Play or pause the current track
playBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playBtn.textContent = '⏸️ Pause';
    } else {
        audioPlayer.pause();
        playBtn.textContent = '▶️ Play';
    }
});

// Play the previous track in the queue
prevBtn.addEventListener('click', () => {
    if (currentTrackIndex > 0) {
        currentTrackIndex--;
        loadTrack(currentTrackIndex);
    }
});

// Play the next track in the queue
nextBtn.addEventListener('click', () => {
    if (currentTrackIndex < trackQueue.length - 1) {
        currentTrackIndex++;
    } else {
        currentTrackIndex = 0; // Loop back to the start if at the end of the queue
    }
    loadTrack(currentTrackIndex);
});

// Auto-play the next track when the current track ends
audioPlayer.addEventListener('ended', () => {
    if (currentTrackIndex < trackQueue.length - 1) {
        currentTrackIndex++;
        loadTrack(currentTrackIndex);
    } else {
        currentTrackIndex = 0; // Loop back to start if at end of queue
        loadTrack(currentTrackIndex);
    }
    // Reset play button text
    playBtn.textContent = '▶️ Play';
});

// Update the progress bar and time display during playback
audioPlayer.addEventListener('timeupdate', updateProgress);
progressBar.addEventListener('input', seekAudio);

// Load and play the track at the specified index in the queue
function loadTrack(index) {
    const track = trackQueue[index];
    audioPlayer.src = URL.createObjectURL(track);
    trackInfo.textContent = `Track: ${track.name}`;
    playBtn.textContent = '⏸️ Pause';
    audioPlayer.play();
    audioPlayer.addEventListener('loadedmetadata', displayDuration);
}

// Update the progress bar and current time display
function updateProgress() {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    // Ensure duration is a valid number before updating the progress bar
    if (!isNaN(duration)) {
        progressBar.value = (currentTime / duration) * 100 || 0;
        currentTimeDisplay.textContent = formatTime(currentTime);
    }
}

// Seek to a specific point in the track
function seekAudio() {
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (progressBar.value / 100) * duration;
}

// Display the duration of the current track
function displayDuration() {
    durationDisplay.textContent = formatTime(audioPlayer.duration);
}

// Format time in minutes:seconds
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
