// 音乐播放器初始化脚本
// 等待DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  try {
    // 1. 先获取所有需要的DOM元素，确保它们存在
    const domElements = {
      musicContainer: document.querySelector('.music-container'),
      playPauseBtn: document.querySelector('.btn-play-pause'),
      prevBtn: document.querySelector('.btn-prev'),
      nextBtn: document.querySelector('.btn-next'),
      randomBtn: document.querySelector('.btn-toggle'),
      progressContainer: document.querySelector('.progress-container'),
      progressBar: document.querySelector('.progress-bar'),
      progressKnob: document.querySelector('.progress-knob'),
      volumeControl: document.querySelector('.volume-control'),
      volumeIcon: document.querySelector('.volume-control i'),
      volumeSliderContainer: document.querySelector('.volume-slider-container'),
      volumeBar: document.querySelector('.volume-bar'),
      currentTime: document.querySelector('.current-time'),
      totalTime: document.querySelector('.total-time'),
      currentSongTitle: document.querySelector('.current-song-title'),
      currentSongArtist: document.querySelector('.current-song-artist'),
      coverImage: document.querySelector('.cover-image'),
      musicLyrics: document.querySelector('.music-lyrics'),
      musicList: document.querySelector('.music-list')
    };

    // 2. 检查必要的DOM元素是否存在
    const missingElements = Object.entries(domElements).filter(([key, element]) => !element);
    if (missingElements.length > 0) {
      console.error('缺少必要的DOM元素:', missingElements.map(([key]) => key));
      return;
    }

    // 3. 确保歌词容器高度固定
    if (domElements.musicLyrics) {
      domElements.musicLyrics.style.height = '300px';
      domElements.musicLyrics.style.overflow = 'hidden';
      domElements.musicLyrics.style.textAlign = 'center';
      domElements.musicLyrics.style.position = 'relative';
      domElements.musicLyrics.style.boxSizing = 'border-box';
    }

    // 4. 加载歌曲数据
    fetch('/js/music/music.json')
      .then(response => response.json())
      .then(songs => {
        if (!songs || songs.length === 0) {
          console.error('歌曲列表为空');
          return;
        }

        // 5. 动态生成播放列表
        domElements.musicList.innerHTML = '';
        songs.forEach((song, index) => {
          const li = document.createElement('li');
          li.className = 'music-item';
          li.innerHTML = `
            <div class="music-index">${index + 1}</div>
            <div class="music-title">${song.name}</div>
            <div class="music-artist">${song.artist}</div>
          `;
          domElements.musicList.appendChild(li);
        });

        // 更新DOM元素引用
        const musicItems = document.querySelectorAll('.music-item');


        // 6. 创建音频元素（直接使用原生audio元素，更可靠）
        const audio = new Audio();
        audio.volume = 0.7;
        audio.loop = false;


        // 7. 播放器状态
        let currentIndex = 0;
        // 播放模式：0-顺序播放，1-随机播放，2-单曲循环
        let playMode = 0;
        let isPlaying = false;
        let lrcData = [];
        let currentLineIndex = 0; // 当前歌词行索引
        // 移除旧的isRandom变量，统一使用playMode

        // 格式化时间函数：将秒数转换为分:秒格式
        function formatTime(seconds) {
          if (isNaN(seconds) || seconds < 0) return '0:00';
          const mins = Math.floor(seconds / 60);
          const secs = Math.floor(seconds % 60);
          return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        // 8. 更新进度条的函数
        function updateProgressBar(currentTime, duration) {
          if (isNaN(duration) || duration <= 0) {

            return;
          }
          const percent = (currentTime / duration) * 100;
          
          // 更新进度条
          if (domElements.progressBar) {
            domElements.progressBar.style.width = percent + '%';
          }
          if (domElements.progressKnob) {
            domElements.progressKnob.style.left = percent + '%';
          }
          
          // 更新时长显示
          if (domElements.currentTime) {
            domElements.currentTime.textContent = formatTime(currentTime);
          }
        }

        // 9. 渲染歌词的函数 - 简化实现
        function renderLyrics() {
          if (!lrcData || lrcData.length === 0) {
            if (domElements.musicLyrics) {
              domElements.musicLyrics.innerHTML = '<p style="color: rgba(255, 255, 255, 0.7);">暂无歌词</p>';
            }
            return;
          }
          
          // 创建歌词容器
          const lyricsContainer = document.createElement('div');
          lyricsContainer.className = 'lyrics-container';
          
          // 渲染所有歌词行
          lrcData.forEach((line, index) => {
            const lineEl = document.createElement('div');
            lineEl.className = 'lyric-line';
            lineEl.textContent = line.text;
            lineEl.dataset.index = index;
            
            // 设置基础样式
            lineEl.style.margin = '10px 0';
            lineEl.style.lineHeight = '2.2';
            lineEl.style.textAlign = 'center';
            lineEl.style.transition = 'all 0.3s ease';
            
            lyricsContainer.appendChild(lineEl);
          });
          
          if (domElements.musicLyrics) {
            domElements.musicLyrics.innerHTML = '';
            domElements.musicLyrics.appendChild(lyricsContainer);
            
            // 更新当前歌词样式
            updateCurrentLyricStyle();
            // 滚动到当前歌词
            scrollToCurrentLyric();
          }
        }

        // 10. 更新当前歌词样式
        function updateCurrentLyricStyle() {
          if (!domElements.musicLyrics) return;
          
          const lyricsContainer = domElements.musicLyrics.querySelector('.lyrics-container');
          if (!lyricsContainer) return;
          
          const allLines = lyricsContainer.querySelectorAll('.lyric-line');
          allLines.forEach((line, index) => {
            const isCurrent = index === currentLineIndex;
            
            if (isCurrent) {
              // 当前歌词样式
              line.style.opacity = '1';
              line.style.fontSize = '20px';
              line.style.fontWeight = 'bold';
              line.style.color = 'white';
            } else {
              // 普通歌词样式
              line.style.opacity = '0.5';
              line.style.fontSize = '16px';
              line.style.fontWeight = 'normal';
              line.style.color = 'rgba(255, 255, 255, 0.6)';
            }
          });
        }

        // 11. 滚动到当前歌词
        function scrollToCurrentLyric() {
          if (!domElements.musicLyrics) return;
          
          const lyricsContainer = domElements.musicLyrics.querySelector('.lyrics-container');
          if (!lyricsContainer) return;
          
          const currentLine = lyricsContainer.querySelector(`[data-index="${currentLineIndex}"]`);
          if (!currentLine) return;
          
          // 计算滚动位置，使当前歌词居中
          const containerHeight = domElements.musicLyrics.clientHeight;
          const lineTop = currentLine.offsetTop;
          const scrollAmount = lineTop - (containerHeight / 2) + (currentLine.clientHeight / 2);
          
          // 使用transform实现平滑滚动
          lyricsContainer.style.transform = `translateY(-${scrollAmount}px)`;
          lyricsContainer.style.transition = 'transform 0.3s ease';
        }

        // 12. 更新歌词的函数
        function updateLyrics(currentTime) {
          if (!lrcData || lrcData.length === 0) {
            return;
          }
          
          // 查找当前时间对应的歌词行
          let newLineIndex = 0;
          for (let i = lrcData.length - 1; i >= 0; i--) {
            if (currentTime >= lrcData[i].time) {
              newLineIndex = i;
              break;
            }
          }
          
          // 如果歌词行发生变化
          if (newLineIndex !== currentLineIndex) {
            currentLineIndex = newLineIndex;
            updateCurrentLyricStyle();
            scrollToCurrentLyric();
          }
        }

        // 13. 解析LRC歌词的函数
        function parseLRC(lrcText) {
          const lines = lrcText.split('\n');
          const result = [];
          
          const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;
          
          lines.forEach(line => {
            const matches = [...line.matchAll(timeRegex)];
            if (matches.length > 0) {
              const text = line.replace(timeRegex, '').trim();
              if (text) {
                matches.forEach(match => {
                  const minutes = parseInt(match[1]);
                  const seconds = parseInt(match[2]);
                  const milliseconds = parseInt(match[3].padEnd(3, '0'));
                  const time = minutes * 60 + seconds + milliseconds / 1000;
                  result.push({ time, text });
                });
              }
            }
          });
          
          // 按时间排序
          result.sort((a, b) => a.time - b.time);
          return result;
        }

        // 14. 加载歌词的函数
        function loadLyrics(url) {

          fetch(url)
            .then(response => response.text())
            .then(text => {

              lrcData = parseLRC(text);
              currentLineIndex = 0;

              renderLyrics();
            })
            .catch(error => {
              console.error('加载歌词失败:', error);
              lrcData = [];
              currentLineIndex = 0;
              renderLyrics();
            });
        }

        // 15. 加载并播放指定索引的歌曲
        function loadAndPlay(index) {

          if (index < 0 || index >= songs.length) {
            console.error('无效的歌曲索引:', index);
            return;
          }
          
          currentIndex = index;
          const song = songs[index];
          
          // 更新当前歌曲信息
          if (domElements.currentSongTitle) {
            domElements.currentSongTitle.textContent = song.name;
          }
          if (domElements.currentSongArtist) {
            domElements.currentSongArtist.textContent = song.artist;
          }
          if (domElements.coverImage) {
            domElements.coverImage.style.backgroundImage = 'url(' + song.cover + ')';
            domElements.coverImage.style.backgroundSize = 'cover';
            domElements.coverImage.style.backgroundPosition = 'center';
          }
          
          // 更新背景图片为当前歌曲封面（毛玻璃效果）
          const coverBlurElement = document.querySelector('.cover-blur');
          if (coverBlurElement) {
            coverBlurElement.style.backgroundImage = 'url(' + song.cover + ')';
          }
          
          // 更新播放列表选中状态
          musicItems.forEach((item, i) => {
            if (i === index) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
          
          // 加载歌词
          loadLyrics(song.lrc);
          
          // 加载并播放音频
          audio.src = song.url;
          audio.play().then(() => {
            isPlaying = true;
            if (domElements.playPauseBtn.querySelector('i')) {
              domElements.playPauseBtn.querySelector('i').className = 'fas fa-pause';
            }

          }).catch(error => {
            console.error('播放失败:', error);
            isPlaying = false;
          });
        }

        // 16. 播放/暂停切换
        function togglePlayPause() {

          if (isPlaying) {
            audio.pause();
            isPlaying = false;
            if (domElements.playPauseBtn.querySelector('i')) {
              domElements.playPauseBtn.querySelector('i').className = 'fas fa-play';
            }

          } else {
            if (audio.src) {
              audio.play().then(() => {
                isPlaying = true;
                if (domElements.playPauseBtn.querySelector('i')) {
                  domElements.playPauseBtn.querySelector('i').className = 'fas fa-pause';
                }

              }).catch(error => {
                console.error('播放失败:', error);
              });
            } else {
              // 如果还没有加载歌曲，加载第一首
              loadAndPlay(currentIndex);
            }
          }
        }

        // 17. 播放下一首
        function playNext() {

          let nextIndex;
          
          if (playMode === 2) {
            // 单曲循环：播放当前歌曲
            nextIndex = currentIndex;
          } else if (playMode === 1) {
            // 随机播放
            nextIndex = Math.floor(Math.random() * songs.length);
            while (nextIndex === currentIndex) {
              nextIndex = Math.floor(Math.random() * songs.length);
            }
          } else {
            // 顺序播放
            nextIndex = (currentIndex + 1) % songs.length;
          }
          loadAndPlay(nextIndex);
        }

        // 18. 播放上一首
        function playPrev() {

          let prevIndex;
          if (playMode === 1) { // 随机播放
            prevIndex = Math.floor(Math.random() * songs.length);
            while (prevIndex === currentIndex) {
              prevIndex = Math.floor(Math.random() * songs.length);
            }
          } else if (playMode === 2) { // 单曲循环
            prevIndex = currentIndex;
          } else { // 顺序播放
            prevIndex = (currentIndex - 1 + songs.length) % songs.length;
          }
          loadAndPlay(prevIndex);
        }

        // 19. 切换播放模式（顺序->随机->单曲循环->顺序...）
        function togglePlayMode() {
          // 循环切换播放模式：0-顺序播放，1-随机播放，2-单曲循环
          playMode = (playMode + 1) % 3;

          
          const icon = domElements.randomBtn.querySelector('i');
          if (icon) {
            // 根据播放模式设置对应的图标（使用Font Awesome 7.1.0兼容的图标）
            switch (playMode) {
              case 0: // 顺序播放
                icon.className = 'fas fa-list';
                break;
              case 1: // 随机播放
                icon.className = 'fas fa-shuffle';
                break;
              case 2: // 单曲循环
                icon.className = 'fas fa-repeat';
                break;
            }
          }
        }

        // 20. 绑定播放/暂停按钮
        domElements.playPauseBtn.addEventListener('click', togglePlayPause);

        // 21. 绑定上一曲按钮
        domElements.prevBtn.addEventListener('click', playPrev);

        // 22. 绑定下一曲按钮
        domElements.nextBtn.addEventListener('click', playNext);

        // 23. 绑定播放模式切换按钮
        domElements.randomBtn.addEventListener('click', togglePlayMode);

        // 24. 绑定进度条点击
        domElements.progressContainer.addEventListener('click', (e) => {

          const rect = domElements.progressContainer.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          const seekTime = percent * audio.duration;
          audio.currentTime = seekTime;
          updateProgressBar(seekTime, audio.duration);
          updateLyrics(seekTime);
        });

        // 25. 绑定音量条点击
        if (domElements.volumeBar) {
          domElements.volumeBar.addEventListener('click', (e) => {

            const rect = domElements.volumeBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audio.volume = percent;
            
            // 更新音量图标
            updateVolumeIcon();
          });
        }
        
        // 更新音量图标
        function updateVolumeIcon() {
          if (!domElements.volumeIcon) return;
          
          if (audio.volume === 0) {
            domElements.volumeIcon.className = 'fas fa-volume-mute';
          } else if (audio.volume < 0.5) {
            domElements.volumeIcon.className = 'fas fa-volume-down';
          } else {
            domElements.volumeIcon.className = 'fas fa-volume-up';
          }
        }
        
        // 更新音量进度条
        function updateVolumeProgress() {
          // 创建音量进度条元素（如果不存在）
          let volumeProgress = domElements.volumeBar.querySelector('.volume-progress');
          if (!volumeProgress) {
            volumeProgress = document.createElement('div');
            volumeProgress.className = 'volume-progress';
            domElements.volumeBar.appendChild(volumeProgress);
          }
          
          // 创建音量滑块元素（如果不存在）
          let volumeKnob = domElements.volumeBar.querySelector('.volume-knob');
          if (!volumeKnob) {
            volumeKnob = document.createElement('div');
            volumeKnob.className = 'volume-knob';
            domElements.volumeBar.appendChild(volumeKnob);
            
            // 绑定鼠标拖动事件
            bindVolumeDragging(volumeKnob);
          }
          
          // 更新音量进度（垂直方向）
          const volumePercent = audio.volume * 100;
          volumeProgress.style.height = volumePercent + '%';
          volumeKnob.style.top = (100 - volumePercent) + '%';
        }
        
        // 切换音量滑块显示/隐藏
        function toggleVolumeSlider() {
          if (!domElements.volumeControl) return;
          domElements.volumeControl.classList.toggle('active');
        }
        
        // 绑定音量滑块拖动事件
        function bindVolumeDragging(volumeKnob) {
          let isDragging = false;
          
          // 鼠标按下事件
          volumeKnob.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.stopPropagation();
          });
          
          // 鼠标移动事件
          document.addEventListener('mousemove', (e) => {
            if (!isDragging || !domElements.volumeBar) return;
            
            const rect = domElements.volumeBar.getBoundingClientRect();
            // 计算垂直方向的百分比（从底部开始）
            const percent = Math.max(0, Math.min(100, 100 - ((e.clientY - rect.top) / rect.height) * 100));
            audio.volume = percent / 100;
            updateVolumeProgress();
            updateVolumeIcon();
            e.stopPropagation();
          });
          
          // 鼠标释放事件
          document.addEventListener('mouseup', () => {
            if (isDragging) {
              isDragging = false;
            }
          });
        }
        
        // 26. 绑定播放列表点击
        musicItems.forEach((item, index) => {
          item.addEventListener('click', () => {
  
            loadAndPlay(index);
          });
        });

        // 27. 绑定音量图标点击
        if (domElements.volumeIcon) {
          domElements.volumeIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleVolumeSlider();
          });
        }
        
        // 28. 绑定音量条点击
        if (domElements.volumeBar) {
          domElements.volumeBar.addEventListener('click', (e) => {
            e.stopPropagation();
            const rect = domElements.volumeBar.getBoundingClientRect();
            // 计算垂直方向的百分比（从底部开始）
            const percent = Math.max(0, Math.min(100, 100 - ((e.clientY - rect.top) / rect.height) * 100));
            audio.volume = percent / 100;
            updateVolumeProgress();
            updateVolumeIcon();
          });
        }
        
        // 29. 点击页面其他地方隐藏音量滑块
        document.addEventListener('click', (e) => {
          if (domElements.volumeControl && !domElements.volumeControl.contains(e.target)) {
            domElements.volumeControl.classList.remove('active');
          }
        });

        // 30. 初始化进度条和音量进度条
        updateProgressBar(0, 1); // 初始进度条位置为0%
        updateVolumeProgress();

        // 31. 监听音频事件
        audio.addEventListener('timeupdate', () => {
          // 更新进度条
          updateProgressBar(audio.currentTime, audio.duration);
          // 更新歌词
          updateLyrics(audio.currentTime);
        });

        audio.addEventListener('loadedmetadata', () => {

          
          // 更新当前歌曲的时长显示
          const durationElement = musicItems[currentIndex].querySelector('.music-duration');
          if (durationElement) {
            durationElement.textContent = formatTime(audio.duration);
          }
          
          // 更新总时长显示
          if (domElements.totalTime) {
            domElements.totalTime.textContent = formatTime(audio.duration);
          }
        });

        audio.addEventListener('ended', () => {

          playNext();
        });

        audio.addEventListener('play', () => {
          isPlaying = true;
          if (domElements.playPauseBtn.querySelector('i')) {
            domElements.playPauseBtn.querySelector('i').className = 'fas fa-pause';
          }

        });

        audio.addEventListener('pause', () => {
          isPlaying = false;
          if (domElements.playPauseBtn.querySelector('i')) {
            domElements.playPauseBtn.querySelector('i').className = 'fas fa-play';
          }

        });

        // 28. 初始化第一首歌的信息
        if (songs.length > 0) {
          const firstSong = songs[0];
          if (domElements.currentSongTitle) {
            domElements.currentSongTitle.textContent = firstSong.name;
          }
          if (domElements.currentSongArtist) {
            domElements.currentSongArtist.textContent = firstSong.artist;
          }
          if (domElements.coverImage) {
            domElements.coverImage.style.backgroundImage = 'url(' + firstSong.cover + ')';
            domElements.coverImage.style.backgroundSize = 'cover';
            domElements.coverImage.style.backgroundPosition = 'center';
          }
          
          // 初始状态不设置背景图片，保持完全透明
          // 只在播放时才设置背景
          
          if (musicItems.length > 0) {
            musicItems[0].classList.add('active');
          }
          // 预加载第一首歌的歌词
          loadLyrics(firstSong.lrc);
        }


      })
      .catch(error => {
        console.error('加载歌曲数据失败:', error);
      });
  } catch (error) {
    console.error('音乐播放器初始化异常:', error);
  }
});
