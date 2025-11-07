class NewYearCountdown {
    constructor() {
        this.daysElement = document.getElementById('days');
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.messageElement = document.getElementById('message');
        this.zodiacYearElement = document.getElementById('zodiacYear');
        this.blessingsElement = document.getElementById('blessings');
        this.musicToggle = document.getElementById('musicToggle');
        this.musicMute = document.getElementById('musicMute');
        this.fireworksBtn = document.getElementById('fireworksBtn');
        this.redEnvelopeBtn = document.getElementById('redEnvelopeBtn');
        this.snowBtn = document.getElementById('snowBtn');
        
        this.nextYear = new Date().getFullYear() + 1;
        this.targetDate = new Date(`January 1, ${this.nextYear} 00:00:00`).getTime();
        this.isMusicPlaying = false;
        this.isMuted = false;
        this.bgMusic = null;
        
        this.blessings = [
            '新年快乐，万事如意！',
            '恭喜发财，红包拿来！',
            '身体健康，阖家欢乐！',
            '学业进步，事业有成！',
            '心想事成，梦想成真！',
            '财源广进，好运连连！',
            '福星高照，喜气洋洋！',
            '龙马精神，步步高升！'
        ];
        
        this.zodiacAnimals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
        
        // 状态变量
        this.isSnowing = false;
        this.isNewYear = false;
        this.snowInterval = null;
        this.newYearFireworkInterval = null;
        this.celebrationInterval = null;
        
        // 记录相关
        this.serverURL = this.getServerURL();
        
        this.init();
    }

    // 动态获取服务器URL
    getServerURL() {
        // 如果当前端口是8080，则使用8000端口作为IP服务器
        if (window.location.port === '8080') {
            return `${window.location.protocol}//${window.location.hostname}:8000`;
        }
        
        // 如果当前端口是8000，则使用当前URL（IP服务器自身）
        if (window.location.port === '8000') {
            return window.location.origin;
        }
        
        // 默认使用8000端口
        return `${window.location.protocol}//${window.location.hostname}:8000`;
    }

    init() {
        this.loadBackgroundMusic();
        this.setupMusicControls();
        this.setupInteractiveButtons();
        this.setupClickEffects();
        this.updateCountdown();
        this.updateZodiacYear();
        this.startBlessingsRotation();
        this.setupZodiacWheel();
        this.logVisitorIP();
        setInterval(() => this.updateCountdown(), 1000);
        this.setupFireworks();
        
        // 自动播放音乐
        setTimeout(() => {
            this.startMusic();
        }, 1000);
    }
    
    loadBackgroundMusic() {
        // 动态创建音频对象
        this.bgMusic = new Audio();
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.5;
        
        // 显示加载提示
        console.log('正在加载背景音乐...');
        
        // 优先尝试MP3格式（兼容性更好）
        // 对中文文件名进行URL编码
        this.bgMusic.src = encodeURI('恭喜发财.mp3');
        this.bgMusic.preload = 'auto';
        
        // 监听加载事件
        this.bgMusic.addEventListener('canplaythrough', () => {
            console.log('MP3背景音乐加载完成，准备就绪');
            this.musicLoaded = true;
        });
        
        this.bgMusic.addEventListener('error', (e) => {
            console.error('MP3音乐加载失败，错误详情:', e);
            console.log('MP3错误代码:', this.bgMusic.error?.code);
            console.log('MP3错误消息:', this.bgMusic.error?.message);
            console.log('尝试M4A格式作为回退...');
            
            // 如果.mp3加载失败，尝试回退到.m4a
            this.bgMusic.src = encodeURI('恭喜发财 .m4a');
            
            // 设置新的加载完成监听器
            const m4aLoadHandler = () => {
                console.log('M4A背景音乐加载完成');
                this.musicLoaded = true;
                this.bgMusic.removeEventListener('canplaythrough', m4aLoadHandler);
            };
            
            const m4aErrorHandler = (e2) => {
                console.error('所有音乐文件加载失败，错误详情:', e2);
                console.log('M4A错误代码:', this.bgMusic.error?.code);
                console.log('M4A错误消息:', this.bgMusic.error?.message);
                console.log('MP3文件URL:', '恭喜发财.mp3');
                console.log('M4A文件URL:', '恭喜发财 .m4a');
                this.showMusicError();
                this.bgMusic.removeEventListener('error', m4aErrorHandler);
            };
            
            this.bgMusic.addEventListener('canplaythrough', m4aLoadHandler);
            this.bgMusic.addEventListener('error', m4aErrorHandler);
            
            this.bgMusic.load();
        });
        
        // 预加载音乐
        this.bgMusic.load();
    }
    
    showMusicError() {
        const musicControls = document.querySelector('.music-controls');
        const errorMsg = document.createElement('div');
        errorMsg.className = 'music-error';
        errorMsg.textContent = '音乐加载失败';
        errorMsg.style.cssText = 'color: #ff6b6b; font-size: 12px; margin-top: 5px;';
        musicControls.appendChild(errorMsg);
    }
    
    updateCountdown() {
        const now = new Date().getTime();
        const distance = this.targetDate - now;
        
        if (distance < 0) {
            this.handleNewYear();
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        this.updateDisplay(days, hours, minutes, seconds);
    }
    
    updateDisplay(days, hours, minutes, seconds) {
        this.daysElement.textContent = this.formatTime(days);
        this.hoursElement.textContent = this.formatTime(hours);
        this.minutesElement.textContent = this.formatTime(minutes);
        this.secondsElement.textContent = this.formatTime(seconds);
        
        this.animateNumber(this.daysElement);
        this.animateNumber(this.hoursElement);
        this.animateNumber(this.minutesElement);
        this.animateNumber(this.secondsElement);
    }
    
    formatTime(time) {
        return time < 10 ? `0${time}` : time;
    }
    
    animateNumber(element) {
        element.style.animation = 'none';
        element.offsetHeight;
        element.style.animation = 'bounce 1s ease-in-out';
    }
    
    handleNewYear() {
        this.messageElement.textContent = '🎉 新年快乐！🎉';
        this.messageElement.style.fontSize = '2.5rem';
        this.messageElement.style.color = '#ffeb3b';
        
        this.daysElement.textContent = '00';
        this.hoursElement.textContent = '00';
        this.minutesElement.textContent = '00';
        this.secondsElement.textContent = '00';
        
        // 新年特效
        this.startNewYearCelebration();
        
        // 自动播放音乐（如果未静音）
        if (!this.isMuted && !this.isMusicPlaying) {
            this.startMusic();
        }
    }
    
    startNewYearCelebration() {
        // 大量烟花效果
        this.createFireworksBurst();
        
        // 自动红包雨
        this.createRedEnvelopeRain();
        
        // 自动下雪
        if (!this.isSnowing) {
            this.startSnow();
        }
        
        // 持续烟花效果
        this.newYearFireworkInterval = setInterval(() => {
            this.createRandomFirework();
        }, 500);
        
        // 祝福语快速轮播
        let celebrationIndex = 0;
        this.celebrationInterval = setInterval(() => {
            this.blessingsElement.textContent = this.blessings[celebrationIndex];
            celebrationIndex = (celebrationIndex + 1) % this.blessings.length;
        }, 1000);
        
        this.isNewYear = true;
    }
    
    // 清理定时器，避免内存泄漏
    cleanup() {
        if (this.newYearFireworkInterval) {
            clearInterval(this.newYearFireworkInterval);
        }
        if (this.celebrationInterval) {
            clearInterval(this.celebrationInterval);
        }
        if (this.snowInterval) {
            clearInterval(this.snowInterval);
        }
    }

    // 记录功能
    async logVisitorIP() {
        try {
            // 添加超时处理
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch(`${this.serverURL}/log-ip`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    page: '新年倒计时',
                    action: '页面访问',
                    timestamp: new Date().toISOString(),
                    screenResolution: `${screen.width}x${screen.height}`,
                    language: navigator.language,
                    platform: navigator.platform,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const result = await response.json();
                console.log('✅ IP记录成功:', result.yourIP);
                
                // 在控制台显示友好的提示
                this.showConsoleMessage(`🌐 您的IP地址: ${result.yourIP} 已记录`);
            } else {
                console.warn('⚠️ IP记录失败，服务器可能未启动');
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.warn('⏰ IP记录超时，服务器可能未运行');
            } else {
                console.warn('❌ 无法连接到IP记录服务器:', error.message);
            }
        }
    }

    // 在控制台显示友好消息
    showConsoleMessage(message) {
        const styles = [
            'background: linear-gradient(45deg, #ff6b6b, #ffd700)',
            'color: white',
            'padding: 4px 8px',
            'border-radius: 4px',
            'font-weight: bold'
        ].join(';');
        
        console.log(`%c${message}`, styles);
    }

    // 获取IP记录统计
    async getIPStats() {
        try {
            const response = await fetch(`${this.serverURL}/get-ips`);
            if (response.ok) {
                const result = await response.json();
                console.log('IP访问统计:', result);
                return result;
            }
        } catch (error) {
            console.warn('无法获取IP统计:', error.message);
        }
        return null;
    }

    setupFireworks() {
        const fireworks = document.querySelectorAll('.firework');
        fireworks.forEach(firework => {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const xEnd = (Math.random() - 0.5) * 200;
            const yEnd = (Math.random() - 0.5) * 200;
            
            firework.style.setProperty('--x', `${x}%`);
            firework.style.setProperty('--y', `${y}%`);
            firework.style.setProperty('--x-end', `${xEnd}px`);
            firework.style.setProperty('--y-end', `${yEnd}px`);
        });
    }
    
    createFireworks() {
        const container = document.querySelector('.fireworks');
        
        setInterval(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            
            const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            firework.style.background = color;
            firework.style.left = `${Math.random() * 100}%`;
            firework.style.top = `${Math.random() * 100}%`;
            
            const xEnd = (Math.random() - 0.5) * 300;
            const yEnd = (Math.random() - 0.5) * 300;
            
            firework.style.setProperty('--x-end', `${xEnd}px`);
            firework.style.setProperty('--y-end', `${yEnd}px`);
            
            container.appendChild(firework);
            
            setTimeout(() => {
                if (firework.parentNode) {
                    firework.parentNode.removeChild(firework);
                }
            }, 2000);
        }, 500);
    }
    
    setupMusicControls() {
        // 音乐控制按钮事件
        this.musicToggle.addEventListener('click', () => {
            this.toggleMusic();
        });
        
        this.musicMute.addEventListener('click', () => {
            this.toggleMute();
        });
        
        // 设置音量
        this.bgMusic.volume = 0.5;
    }
    
    toggleMusic() {
        if (this.isMusicPlaying) {
            this.stopMusic();
        } else {
            this.startMusic();
        }
    }
    
    startMusic() {
        if (this.isMuted || !this.bgMusic) return;
        
        // 检查音乐是否已加载
        if (this.bgMusic.readyState < 3) {
            console.log('音乐仍在加载中，请稍候...');
            return;
        }
        
        this.bgMusic.play().then(() => {
            this.isMusicPlaying = true;
            this.musicToggle.textContent = '⏸️ 暂停音乐';
        }).catch(error => {
            console.log('自动播放被阻止，需要用户交互');
            this.musicToggle.textContent = '▶️ 播放音乐';
        });
    }
    
    stopMusic() {
        if (this.bgMusic) {
            this.bgMusic.pause();
        }
        this.isMusicPlaying = false;
        this.musicToggle.textContent = '▶️ 播放音乐';
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.bgMusic) {
            this.bgMusic.muted = this.isMuted;
        }
        this.musicMute.textContent = this.isMuted ? '🔊' : '🔇';
        
        if (this.isMuted && this.isMusicPlaying) {
            this.stopMusic();
        }
    }
    
    setupInteractiveButtons() {
        this.fireworksBtn.addEventListener('click', () => {
            this.createFireworksBurst();
        });
        
        this.redEnvelopeBtn.addEventListener('click', () => {
            this.createRedEnvelopeRain();
        });
        
        this.snowBtn.addEventListener('click', () => {
            this.toggleSnow();
        });
    }
    
    createFireworksBurst() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createRandomFirework();
            }, i * 100);
        }
    }
    
    updateZodiacYear() {
        const zodiacIndex = (this.nextYear - 4) % 12;
        const zodiacAnimal = this.zodiacAnimals[zodiacIndex];
        this.zodiacYearElement.textContent = `${this.nextYear}年 ${zodiacAnimal}年`;
    }
    
    startBlessingsRotation() {
        let currentIndex = 0;
        setInterval(() => {
            this.blessingsElement.style.opacity = '0';
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % this.blessings.length;
                this.blessingsElement.textContent = this.blessings[currentIndex];
                this.blessingsElement.style.opacity = '1';
            }, 500);
        }, 3000);
    }
    
    setupZodiacWheel() {
        const zodiacIcons = document.querySelectorAll('.zodiac-icon');
        zodiacIcons.forEach((icon, index) => {
            const rotation = index * 30;
            icon.style.setProperty('--rotation', `${rotation}deg`);
            
            // 添加鼠标悬停效果
            icon.addEventListener('mouseenter', () => {
                icon.style.transform = `rotate(${rotation}deg) translateY(-160px) rotate(${-rotation}deg) scale(1.2)`;
                icon.style.background = 'rgba(255, 215, 0, 0.6)';
            });
            
            icon.addEventListener('mouseleave', () => {
                icon.style.transform = `rotate(${rotation}deg) translateY(-150px) rotate(${-rotation}deg) scale(1)`;
                icon.style.background = 'rgba(255, 215, 0, 0.3)';
            });
        });
    }
    
    
    
    
    
    setupClickEffects() {
        document.addEventListener('click', (e) => {
            // 跳过音乐按钮和互动按钮的点击
            if (e.target.closest('.music-controls') || e.target.closest('.interactive-buttons')) {
                return;
            }
            this.createClickFirework(e.clientX, e.clientY);
        });
    }
    
    createClickFirework(x, y) {
        const firework = document.createElement('div');
        firework.className = 'click-firework';
        firework.style.left = `${x}px`;
        firework.style.top = `${y}px`;
        
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        firework.style.background = color;
        
        document.body.appendChild(firework);
        
        setTimeout(() => {
            if (firework.parentNode) {
                firework.parentNode.removeChild(firework);
            }
        }, 1000);
    }
    
    
    
    createRedEnvelopeRain() {
        const container = document.getElementById('redEnvelopeContainer');
        const envelopeCount = 30;
        
        for (let i = 0; i < envelopeCount; i++) {
            setTimeout(() => {
                this.createRedEnvelope();
            }, i * 200);
        }
    }
    
    createRedEnvelope() {
        const container = document.getElementById('redEnvelopeContainer');
        const envelope = document.createElement('div');
        envelope.className = 'red-envelope';
        
        const messages = ['恭喜发财', '红包拿来', '新年快乐', '万事如意'];
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        envelope.textContent = message;
        envelope.style.left = `${Math.random() * 100}%`;
        envelope.style.animationDuration = `${Math.random() * 3 + 2}s`;
        envelope.style.animationDelay = `${Math.random() * 2}s`;
        
        container.appendChild(envelope);
        
        setTimeout(() => {
            if (envelope.parentNode) {
                envelope.parentNode.removeChild(envelope);
            }
        }, 5000);
    }
    
    toggleSnow() {
        const container = document.getElementById('snowContainer');
        const isSnowing = container.hasChildNodes();
        
        if (isSnowing) {
            this.stopSnow();
            this.snowBtn.textContent = '❄️ 下雪了';
        } else {
            this.startSnow();
            this.snowBtn.textContent = '☀️ 停止下雪';
        }
    }
    
    stopSnow() {
        const container = document.getElementById('snowContainer');
        container.innerHTML = '';
        if (this.snowInterval) {
            clearInterval(this.snowInterval);
            this.snowInterval = null;
        }
        this.isSnowing = false;
    }
    
    startSnow() {
        const container = document.getElementById('snowContainer');
        const snowflakeCount = 50;
        
        for (let i = 0; i < snowflakeCount; i++) {
            this.createSnowflake();
        }
        
        this.snowInterval = setInterval(() => {
            this.createSnowflake();
        }, 300);
        
        this.isSnowing = true;
    }
    
    createRandomFirework() {
        const container = document.querySelector('.fireworks');
        const firework = document.createElement('div');
        firework.className = 'firework';
        
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        firework.style.background = color;
        firework.style.left = `${Math.random() * 100}%`;
        firework.style.top = `${Math.random() * 100}%`;
        
        const xEnd = (Math.random() - 0.5) * 300;
        const yEnd = (Math.random() - 0.5) * 300;
        
        firework.style.setProperty('--x-end', `${xEnd}px`);
        firework.style.setProperty('--y-end', `${yEnd}px`);
        
        container.appendChild(firework);
        
        setTimeout(() => {
            if (firework.parentNode) {
                firework.parentNode.removeChild(firework);
            }
        }, 2000);
    }
    
    createSnowflake() {
        const container = document.getElementById('snowContainer');
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = '❄';
        
        snowflake.style.left = `${Math.random() * 100}%`;
        snowflake.style.animationDuration = `${Math.random() * 5 + 5}s`;
        snowflake.style.animationDelay = `${Math.random() * 2}s`;
        snowflake.style.fontSize = `${Math.random() * 10 + 15}px`;
        snowflake.style.opacity = `${Math.random() * 0.5 + 0.5}`;
        
        container.appendChild(snowflake);
        
        setTimeout(() => {
            if (snowflake.parentNode) {
                snowflake.parentNode.removeChild(snowflake);
            }
        }, 10000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NewYearCountdown();
});