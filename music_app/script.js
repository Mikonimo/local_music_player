// JavaScript for Full Screen Local Music Player

const audioPlayer = document.getElementById('audio-player');
const fileInput = document.getElementById('file-input');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const favouriteBtn = document.getElementById('favourite-btn');
const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const addTracksBtn = document.getElementById('add-tracks-btn');
const trackList = document.getElementById('track-list');
const trackListUL = document.getElementById('track-list-ul');
const toggleTracklistBtn = document.getElementById('toggle-tracklist-btn');
const trackInfo = document.getElementById('track-title');
const albumArt = document.getElementById('album-art');

let trackQueue = []; // Queue of tracks to play
let currentTrackIndex = 0;
let isShuffle = false;
let isRepeat = false;
let isPlaying = false;
let previousVolume = 0.5;
let favouriteTracks = new Set(); // Set to  track favourite tracks



// Load selected files into the track queue and display in track list
fileInput.addEventListener('change', (event) => {
    const newTracks = Array.from(event.target.files);
    trackQueue.push(...newTracks);
    renderTrackList();

    // If no track is currently playing, start with the first track in the queue
    if (!isPlaying && trackQueue.length > 0) {
        currentTrackIndex = 0;
        loadTrack(currentTrackIndex);
    }
});

// Render the track list on the UI
function renderTrackList() {
    trackListUL.innerHTML = ''; // Clear existing list
    trackQueue.forEach((track, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = track.name;
        listItem.classList.add('track-item');
        if (index === currentTrackIndex) {
            listItem.classList.add('active');
        }
        if (favouriteTracks.has(track)) {
            listItem.classList.add('favourite');
        }
        listItem.addEventListener('click', () => {
            currentTrackIndex = index;
            loadTrack(currentTrackIndex);
        });
        trackListUL.appendChild(listItem);
    });
}

// Load and play the track at the specified index in the queue
function loadTrack(index) {
    const track = trackQueue[index];
    audioPlayer.src = URL.createObjectURL(track);
    trackInfo.textContent = track.name;
    audioPlayer.play();
    isPlaying = true;
    updatePlayButton();
    highlightCurrentTrack();
    // Update favourite button state
    if (favouriteTracks.has(track)) {
        favouriteBtn.classList.add('active');
    } else {
        favouriteBtn.classList.remove('active');
    }
}
audioPlayer.addEventListener('loadedmetadata', displayDuration);

// Highlight the currently playing track in the track list
function highlightCurrentTrack() {
    const trackItems = document.querySelectorAll('.track-item');
    trackItems.forEach((item, idx) => {
        item.classList.toggle('active', idx === currentTrackIndex);
    });
}

// Play or pause the current track
playBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
});

// Play the previous track in the queue
prevBtn.addEventListener('click', () => {
    if (currentTrackIndex >  0) {
        currentTrackIndex--;
    } else {
        currentTrackIndex = trackQueue.length - 1 // Loop to the last track
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

// Listen for play and pause events to update the button text
audioPlayer.addEventListener('play', () => {
    isPlaying = true;
    updatePlayButton();
    highlightCurrentTrack();
});

audioPlayer.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayButton();
});

// Auto-play the next track when the current track ends
audioPlayer.addEventListener('ended', () => {
    if (isRepeat) {
        // If repeat is enabled, replay the current track
        loadTrack(currentTrackIndex);
        audioPlayer.play();
        return;
    }

    // Handle shuffle mode
    if (isShuffle) {
        currentTrackIndex = Math.floor(Math.random() * trackQueue.length);
    } else {
        // Normal mode: Move to the next track
        if (currentTrackIndex < trackQueue.length - 1) {
            currentTrackIndex++;
        } else {
            currentTrackIndex = 0; // Loop back to the start of the queue
        }
    }

    // Load and play the next track
    loadTrack(currentTrackIndex);
    audioPlayer.play();
});

// Update play button icon based on playback state
function updatePlayButton() {
    playBtn.textContent = isPlaying ? '⏸️' : '▶️';
}

// Update the progress bar and current time display during playback
audioPlayer.addEventListener('timeupdate', updateProgress);
progressBar.addEventListener('input', seekAudio);

// Update the progress bar and current time display
function updateProgress() {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    if (!isNaN(duration)) {
        progressBar.value = (currentTime / duration) * 100 || 0;
        currentTimeDisplay.textContent = formatTime(currentTime);
    }
}

// Seek to a specific point in the track
function seekAudio() {
    const duration = audioPlayer.duration;
    if (!isNaN(duration)) {
        audioPlayer.currentTime = (progressBar.value / 100) * duration;

    }

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

// Toggle shuffle mode
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
    updateShuffleButton();
});

// Update shuffle button UI state
function updateShuffleButton() {
    shuffleBtn.style.color = isShuffle ? '#1db954' : '';
}

// Toggle repeat mode
repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
    updateRepeatButton();
});

// Update repeat button UI state
function updateRepeatButton() {
    repeatBtn.style.color = isRepeat ? '#1db954' : '';
}

// Update volume when slider changes
volumeSlider.addEventListener('input', () => {
    audioPlayer.volume = volumeSlider.value;
    updateVolumeIcon();
});

// Click on the volume icon to mute/unmute
volumeIcon.addEventListener('click', () => {
    if (audioPlayer.volume > 0) {
        previousVolume = audioPlayer.volume;
        audioPlayer.volume = 0;
        volumeSlider.value = 0;
    } else {
        audioPlayer.volume = previousVolume; // Set to a default volume if muted
        volumeSlider.value = previousVolume;
    }
    updateVolumeIcon();
});

// Update the volume icon based on the current volume level
function updateVolumeIcon() {
    const volume = audioPlayer.volume;
    if (volume === 0) {
        volumeIcon.textContent = '🔇'; // Muted icon
    } else if (volume < 0.5) {
        volumeIcon.textContent = '🔉'; // Low volume icon
    } else {
        volumeIcon.textContent = '🔊'; // High volume icon
    }
}

// Toggle tracklist visibility
toggleTracklistBtn.addEventListener('click', () => {
    if (trackList.style.display === 'none' || trackList.style.display === '') {
        trackList.style.display = 'block';
        albumArt.style.display = 'none';
    } else {
        trackList.style.display = 'none';
        albumArt.style.display = 'block';
    }
});

// Trigger file input click when the "Add Tracks" button is clicked
addTracksBtn.addEventListener('click', () => {
    fileInput.click();
});

// Toggle the favourite status of the current track
favouriteBtn.addEventListener('click', () => {
    const currentTrack = trackQueue[currentTrackIndex];

    if (favouriteTracks.has(currentTrack)) {
        favouriteTracks.delete(currentTrack);
        favouriteBtn.classList.remove('active');
    } else {
        favouriteTracks.add(currentTrack);
        favouriteBtn.classList.add('active');
    }
    renderTrackList(); // Update the track list to reflect favourite tracks
});


