// ==========================================================================
// 1. Audio Track Data Structure
// ==========================================================================
const songs = [
  {
    title: "Acoustic Breeze",
    artist: "Benjamin Tissot",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Ukulele Joy",
    artist: "Royalty Free Music",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Creative Minds",
    artist: "SoundHelix Sample",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=400&q=80",
  },
];

// ==========================================================================
// 2. DOM Elements & State Variables
// ==========================================================================
const audio = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");
const volumeSlider = document.getElementById("volumeSlider");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const coverArt = document.getElementById("coverArt");
const currentTimeEl = document.getElementById("currentTime");
const totalDurationEl = document.getElementById("totalDuration");
const playlistEl = document.getElementById("playlist");

let currentTrackIndex = 0;
let isPlaying = false;

// ==========================================================================
// 3. Track Loading & Playback Controls
// ==========================================================================

// Loads chosen song details into the HTML audio player
function loadTrack(index) {
  const track = songs[index];
  songTitle.textContent = track.title;
  songArtist.textContent = track.artist;
  coverArt.src = track.cover;
  audio.src = track.src;

  updatePlaylistHighlight();
}

// Play song
function playTrack() {
  isPlaying = true;
  audio.play();
  playPauseBtn.textContent = "⏸";
}

// Pause song
function pauseTrack() {
  isPlaying = false;
  audio.pause();
  playPauseBtn.textContent = "▶";
}

// Toggle Play/Pause state
function togglePlayPause() {
  if (isPlaying) pauseTrack();
  else playTrack();
}

// Skip to previous track
function prevTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + songs.length) % songs.length;
  loadTrack(currentTrackIndex);
  playTrack();
}

// Skip to next track
function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % songs.length;
  loadTrack(currentTrackIndex);
  playTrack();
}

// ==========================================================================
// 4. Progress Bar & Time Formatter
// ==========================================================================

// Format seconds into standard MM:SS string
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// Synchronize progress slider with audio runtime
function updateProgress() {
  if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progressPercent;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    totalDurationEl.textContent = formatTime(audio.duration);
  }
}

// Seek audio location when dragging progress slider
function setProgress() {
  const newTime = (progressBar.value / 100) * audio.duration;
  audio.currentTime = newTime;
}

// Update Audio volume from slider
function setVolume() {
  audio.volume = volumeSlider.value;
}

// ==========================================================================
// 5. Playlist Management & Bonus Autoplay
// ==========================================================================

// Render playlist items dynamically into UI
function renderPlaylist() {
  playlistEl.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.className = `playlist-item ${index === currentTrackIndex ? "active" : ""}`;
    li.innerHTML = `<span>${song.title}</span><span style="color:var(--text-muted);">${song.artist}</span>`;

    li.addEventListener("click", () => {
      currentTrackIndex = index;
      loadTrack(currentTrackIndex);
      playTrack();
    });

    playlistEl.appendChild(li);
  });
}

// Update CSS highlight on active playlist item
function updatePlaylistHighlight() {
  const items = playlistEl.querySelectorAll(".playlist-item");
  items.forEach((item, index) => {
    if (index === currentTrackIndex) item.classList.add("active");
    else item.classList.remove("active");
  });
}

// ==========================================================================
// 6. Event Listeners
// ==========================================================================
playPauseBtn.addEventListener("click", togglePlayPause);
prevBtn.addEventListener("click", prevTrack);
nextBtn.addEventListener("click", nextTrack);

audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", nextTrack); // Bonus: Autoplay next track when finished

progressBar.addEventListener("input", setProgress);
volumeSlider.addEventListener("input", setVolume);

// Initialize player
renderPlaylist();
loadTrack(currentTrackIndex);
