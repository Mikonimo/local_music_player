# Local Music Player

A simple web-based music player that allows users to load and play local audio files. It supports basic playback controls such as play/pause, next/previous, and displays track information. Users can also manage a queue of tracks that automatically plays one after another.

## Features

- Load and play multiple local audio files.
- Basic controls: Play, Pause, Next, Previous.
- Displays track information (name, current time, and duration).
- Track queue: Automatically play the next track in the queue after one finishes.
- Progress bar with seek functionality.
- Queue loops to the beginning when all tracks have played.

## Technologies Used

- **HTML5**: Structure of the player interface.
- **CSS3**: Basic styling for the player.
- **JavaScript**: Core logic for track playback and queue management.
- **HTML5 Audio API**: For handling audio playback.

## Getting Started

### Prerequisites

To run the project, you only need a modern web browser.

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Mikonimo/local_music_player.git

2. **Navigate to the project directory**

   ```bash
   cd local_music_player

3. **Open `index.html` in your web browser**
   - You can simply double-click `index.html to open it in a browser.
   - Alternatively, you can open the file using a local development server or live preview in a code editor like VSCode.

### Usage
1. Open the player in your browser.
2. Use the "Choose Files" button to select multiple local audio files (MP3, WAB, etc.).
3. The first track will load and start playing automatically.
4. Use the controls to:
  - **Prev**: Play the previous track in the queue.
  - **Play/Pause**: Start or pause the current track.
  - **Next: Skip to the next track in the queue.
5. You can also seek within a track using the progress bar.

## Project Structure
   ```perl
   local-music-player/
│
├── index.html       # Main HTML file
├── styles.css       # Stylesheet for the player
└── script.js        # JavaScript logic for the player
```

## Future Improvements

Here are some planned features and improvements for future versions:

- **Track Queue Display**: Show the entire tracklist and allow users to select tracks manually from the queue.
- **Volume Control**: Add a volume slider to control the audio output.
- **Shuffle and Repeat Modes**: Add shuffle and repeat modes for more flexible playback.
- **Playlist Support**: Allow users to save and load playlists.
- **Mobile-Friendly UI**: Improve the interface for mobile devices.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributions

Contributions are welcome! Feel free to open issues or submit pull requests to improve the project.

## Authors
Mark Manani - [Github](https://github.com/Mikonimo)
Evans Otieno - [Github](https://github.com)
Victor Muita - [Github](https://github.com)
Micky Mwita - [Github](https://github.com)
Teddy Oduor - [Github](https://github.com)
Collins Kimani - [Github](https://github.com)

## Acknowledgments

Thanks to the developers of the [HTML5 Audio API](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) for their comprehensive documentation.
```
