const audioPlayer = document.getElementById('audio-player');
const fileInput = document.getElementById('file-input');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const trackInfo = document.getElementById('track-info');
const artistName = document.getElementById('artist-name');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');
const trackList = document.getElementById('track-list');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const chooseFilesBtn = document.getElementById('choose-files-btn');


let trackQueue = []; // Queue of tracks to play
let currentTrackIndex = 0;
let isShuffle = false;
let isRepeat = false;
let isPlaying = false;

// Trigger file input click when the "Choose Tracks" button is clicked
chooseFilesBtn.addEventListener('click', () => {
    fileInput.click();
});

// Toggle shuffle mode
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    updateShuffleButton();
});

//Toggle repeat mode
repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    updateRepeatButton();
});

//Update Shuffle button UI state
function updateShuffleButton() {
    if (isShuffle) {
        shuffleBtn.style.color = 'green';
        shuffleBtn.style.backgroundColor = '#1db954';
    }
    else {
        shuffleBtn.style.color = '';
        shuffleBtn.style.backgroundColor = '';
    }
}

//Update Repeat button UI state
function updateRepeatButton() {
    if (isRepeat) {
        repeatBtn.style.color = 'green';
        repeatBtn.style.backgroundColor = '#1db954';
    }
    else {
        repeatBtn.style.color = '';
        repeatBtn.style.backgroundColor = '';
    }
}

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
    updateTrackList();

    // If no track is currently playing, start with the first track in the queue
    if (!isPlaying && trackQueue.length > 0) {
        currentTrackIndex = 0;
        loadTrack(currentTrackIndex);
    }
});

// Update the list when a new track is loaded
audioPlayer.addEventListener('loadedmetadata', updateTrackList);

// Play or pause the current track
playBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
});

// Listen for play and pause events to update the button text
audioPlayer.addEventListener('play', () => {
    isPlaying = true;
    updatePlayButton();
});
audioPlayer.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayButton();
})

// Update play button icon based on playback state
function updatePlayButton() {
    playBtn.textContent = isPlaying ? '⏸️ Pause' : '▶️ Play';
}

// Play the previous track in the queue
prevBtn.addEventListener('click', () => {
    if (currentTrackIndex > 0) {
        currentTrackIndex--;
    } else {
        currentTrackIndex = trackQueue.length - 1; //Loop to the last track
    }
    loadTrack(currentTrackIndex);
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
    isPlaying = false;
    updatePlayButton(); // Reset play button text
     // If repeat is enabled, replay the current track
     if (isRepeat) {
        loadTrack(currentTrackIndex);
        audioPlayer.play();
        return;
    }
    if (isShuffle) {
        currentTrackIndex = Math.floor(Math.random() * trackQueue.length);
    }
    else {
        // Normal mode: Move to the next track
        if (currentTrackIndex < trackQueue.length - 1) {
        currentTrackIndex++;
        }
        else {
            currentTrackIndex = 0; // Loop back to the start of the queue
        }
    }
    loadTrack(currentTrackIndex);
    audioPlayer.play(); // Start playing the next track
});

// Update the progress bar and time display during playback
audioPlayer.addEventListener('timeupdate', updateProgress);
progressBar.addEventListener('input', seekAudio);

// Load and play the track at the specified index in the queue
function loadTrack(index) {
    const track = trackQueue[index];
    audioPlayer.src = URL.createObjectURL(track);
    trackInfo.textContent = track.name;
    artistName.textContent = 'Unknown Artist'; // Placeholder for artist name
    // playBtn.textContent = '⏸️ Pause';
    audioPlayer.play();
    isPlaying = true;
    highlightCurrentTrack();
    audioPlayer.addEventListener('loadedmetadata', displayDuration);
}

//Highlight the currently playing track in the track list
function highlightCurrentTrack() {
    const trackItems = document.querySelectorAll('.track-item');
    trackItems.forEach((item, idx) => {
        item.classList.toggle('active', idx === currentTrackIndex);
    });
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

// Update the track queue display
function updateTrackList() {
    trackList.innerHTML = '';
    // Clear the existing list
    trackQueue.forEach((track, index) =>
    {
        const listItem = document.createElement('li');
        listItem.textContent = track.name;
        listItem.classList.add('track-item');
        if (index === currentTrackIndex) {
            listItem.classList.add('active');
            // Highlight the current track
        }
        listItem.addEventListener('click', () => {
            currentTrackIndex = index;
            loadTrack(currentTrackIndex);
        });
        trackList.appendChild(listItem);
    });
}
