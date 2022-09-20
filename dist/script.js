/*
js-code by - https://codepen.io/JavaScriptJunkie/pen/qBWrRyg?editors=1000
design by Filip Legierski.
design: https://dribbble.com/shots/9338617-Simple-Music-Player
*/

var app = new Vue({
	el: "#app",
	data: {
		audio: "",
		imgLoaded: false,
		currentlyPlaying: false,
		currentlyStopped: false,
		currentTime: 0,
		checkingCurrentPositionInTrack: "",
		trackDuration: 0,
		currentProgressBar: 0,
		isPlaylistActive: false,
		currentSong: 0,
		debug: false,
		musicPlaylist: [
        {
          title: "AIRBORNE",
          artist: "คำตอบสุดท้าย",
          image: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/6.jpg",
          url: "mp3/AIRBORNE - คำตอบสุดท้าย.mp3",
        },
				{
          title: "ปิดตาข้างนึง",
          artist: "ทรงไทย",
          image: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/3.jpg",
          url: "mp3/ปิดตาข้างนึง - ทรงไทย.mp3",
        },
        {
          title: "สบายดีไหม",
          artist: "PARATA",
          image: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/2.jpg",
          url: "mp3/สบายดีไหม - PARATA.mp3",
        },

        {
          title: "ได้แค่ไหน เอาแค่นั้น",
          artist: "Mummy Daddy",
          image: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/4.jpg",
          url: "mp3/ได้แค่ไหน เอาแค่นั้น - Mummy Daddy.mp3",
        },
        {
          title: "อย่ากลัวการกลับมา",
          artist: "THE HOOK",
          image: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/5.jpg",
          url: "mp3/THE HOOK - อย่ากลัวการกลับมา.mp3",
        },
        {
          title: "APRIL",
          artist: "SIRIMONGKOL",
          image: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/7.jpg",
          url: "mp3/SIRIMONGKOL - APRIL.mp3",
        },
        {
          title: "ขอ",
          artist: "LOMOSONIC",
          image: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/8.jpg",
          url: "mp3/LOMOSONIC - ขอ.mp3",
        },
				{
          title: "ความรู้สึกของวันนี้",
          artist: "LOMOSONIC",
          image: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/1.jpg",
          url: "mp3/LOMOSONIC - ความรู้สึกของวันนี้.mp3",
        },
        {
          title: "เรื่องจริง",
          artist: "คืนวันเสาร์",
          image: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/9.jpg",
          url: "mp3/เรื่องจริง Ost.คืนวันเสาร์.mp3",
        }
		],
		audioFile: ""
	},
	mounted: function() {
		this.changeSong();
		this.audio.loop = false;
	},
	filters: {
		fancyTimeFormat: function(s) {
			return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
		}
	},
	methods: {
		togglePlaylist: function() {
			this.isPlaylistActive = !this.isPlaylistActive;
		},
		nextSong: function() {
			if (this.currentSong < this.musicPlaylist.length - 1)
				this.changeSong(this.currentSong + 1);
		},
		prevSong: function() {
			if (this.currentSong > 0) this.changeSong(this.currentSong - 1);
		},
		changeSong: function(index) {
			var wasPlaying = this.currentlyPlaying;
			this.imageLoaded = false;
			if (index !== undefined) {
				this.stopAudio();
				this.currentSong = index;
			}
			this.audioFile = this.musicPlaylist[this.currentSong].url;
			this.audio = new Audio(this.audioFile);
			var localThis = this;
			this.audio.addEventListener("loadedmetadata", function() {
				localThis.trackDuration = Math.round(this.duration);
			});
			this.audio.addEventListener("ended", this.handleEnded);
			if (wasPlaying) {
				this.playAudio();
			}
		},
		isCurrentSong: function(index) {
			if (this.currentSong == index) {
				return true;
			}
			return false;
		},
		getCurrentSong: function(currentSong) {
			return this.musicPlaylist[currentSong].url;
		},
		playAudio: function() {
			if (
				this.currentlyStopped == true &&
				this.currentSong + 1 == this.musicPlaylist.length
			) {
				this.currentSong = 0;
				this.changeSong();
			}
			if (!this.currentlyPlaying) {
				this.getCurrentTimeEverySecond(true);
				this.currentlyPlaying = true;
				this.audio.play();
			} else {
				this.stopAudio();
			}
			this.currentlyStopped = false;
		},
		stopAudio: function() {
			this.audio.pause();
			this.currentlyPlaying = false;
			this.pausedMusic();
		},
		handleEnded: function() {
			if (this.currentSong + 1 == this.musicPlaylist.length) {
				this.stopAudio();
				this.currentlyPlaying = false;
				this.currentlyStopped = true;
			} else {
				this.currentlyPlaying = false;
				this.currentSong++;
				this.changeSong();
				this.playAudio();
			}
		},
		onImageLoaded: function() {
			this.imgLoaded = true;
		},
		getCurrentTimeEverySecond: function(startStop) {
			var localThis = this;
			this.checkingCurrentPositionInTrack = setTimeout(
				function() {
					localThis.currentTime = localThis.audio.currentTime;
					localThis.currentProgressBar =
						localThis.audio.currentTime / localThis.trackDuration * 100;
					localThis.getCurrentTimeEverySecond(true);
				}.bind(this),
				1000
			);
		},
		pausedMusic: function() {
			clearTimeout(this.checkingCurrentPositionInTrack);
		},
		toggleDebug: function(){
			this.debug=!this.debug;
			document.body.classList.toggle('debug');
		}
	},
	watch: {
		currentTime: function() {
			this.currentTime = Math.round(this.currentTime);
		}
	},
	beforeDestroy: function() {
		this.audio.removeEventListener("ended", this.handleEnded);
		this.audio.removeEventListener("loadedmetadata", this.handleEnded);

		clearTimeout(this.checkingCurrentPositionInTrack);
	}
});