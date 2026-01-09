// Game functionality
let isPlaying = false;

// Play game
async function playGame() {
    if (isPlaying || !state.user) return;

    isPlaying = true;
    const playButton = document.getElementById('playButton');
    const luckDisplay = document.getElementById('luckDisplay');
    const luckNumber = luckDisplay.querySelector('.luck-number');
    const resultMessage = document.getElementById('resultMessage');
    const resultEmoji = document.getElementById('resultEmoji');
    const resultText = document.getElementById('resultText');

    // Disable button
    playButton.disabled = true;
    playButton.innerHTML = '<span>🎲 Playing...</span>';

    // Hide previous result
    resultMessage.style.display = 'none';

    // Animate luck display
    luckNumber.textContent = '?';
    luckDisplay.classList.add('animate');

    // Show random numbers animation
    let animationCount = 0;
    const animationInterval = setInterval(() => {
        luckNumber.textContent = Math.floor(Math.random() * 100) + 1;
        animationCount++;

        if (animationCount >= 10) {
            clearInterval(animationInterval);
        }
    }, 100);

    try {
        // Call API
        const result = await apiCall('/game/play', {
            method: 'POST',
            body: JSON.stringify({ telegramId: state.user.telegram_id }),
        });

        if (result.success) {
            const { score, message, emoji, color, stats, challengeResult, newAchievements } = result.data;

            // Wait for animation to finish
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update display
            luckNumber.textContent = score;
            luckDisplay.style.background = color || 'var(--primary-gradient)';

            // Show result message
            resultEmoji.textContent = emoji;
            resultText.textContent = message;
            resultMessage.style.display = 'block';

            // Update stats
            updateUserStats(stats);

            // Show achievement notifications
            if (newAchievements && newAchievements.length > 0) {
                let delay = 1000;
                newAchievements.forEach((achievement, index) => {
                    setTimeout(() => {
                        showAchievementNotification(achievement);
                        tg.HapticFeedback.notificationOccurred('success');
                    }, delay + (index * 5000));
                });
            }

            // Check challenge completion
            if (challengeResult && challengeResult.completed && !challengeResult.alreadyCompleted) {
                setTimeout(() => {
                    tg.showAlert('🎯 Daily Challenge Completed!');
                    loadDailyChallenge();
                }, newAchievements.length > 0 ? 6000 : 2000);
            }

            // Haptic feedback based on score
            if (score >= 90) {
                tg.HapticFeedback.notificationOccurred('success');
            } else if (score >= 50) {
                tg.HapticFeedback.notificationOccurred('warning');
            } else {
                tg.HapticFeedback.notificationOccurred('error');
            }

        } else {
            throw new Error(result.error || 'Failed to play game');
        }
    } catch (error) {
        console.error('Game error:', error);
        luckNumber.textContent = '❌';
        resultText.textContent = 'Error playing game. Please try again.';
        resultMessage.style.display = 'block';
        tg.HapticFeedback.notificationOccurred('error');
    } finally {
        // Re-enable button
        isPlaying = false;
        playButton.disabled = false;
        playButton.innerHTML = '<span>🎲 Test Your Luck</span>';

        // Remove animation class
        setTimeout(() => {
            luckDisplay.classList.remove('animate');
            luckDisplay.style.background = 'var(--primary-gradient)';
        }, 3000);
    }
}

// Load achievements
async function loadAchievements() {
    if (!state.user) return;

    const unlockedContainer = document.getElementById('unlockedAchievements');
    const lockedContainer = document.getElementById('lockedAchievements');
    const progressText = document.getElementById('achievementProgressText');
    const progressPercent = document.getElementById('achievementProgressPercent');
    const progressFill = document.getElementById('achievementProgressFill');

    showLoading(unlockedContainer);
    showLoading(lockedContainer);

    try {
        const result = await apiCall(`/game/${state.user.telegram_id}/achievements`);

        if (result.success) {
            const { unlocked, locked, progress } = result.data;

            // Update progress
            progressText.textContent = `${progress.unlocked}/${progress.total} Unlocked`;
            progressPercent.textContent = `${progress.percentage}%`;
            progressFill.style.width = `${progress.percentage}%`;

            // Update achievements count in game tab
            document.getElementById('achievementsCount').textContent = progress.unlocked;

            // Display unlocked achievements
            if (unlocked.length > 0) {
                unlockedContainer.innerHTML = unlocked.map(ach => `
                    <div class="achievement-card unlocked">
                        <div class="achievement-card-icon">${ach.icon}</div>
                        <div class="achievement-card-name">${ach.name}</div>
                        <div class="achievement-card-desc">${ach.description}</div>
                    </div>
                `).join('');
            } else {
                unlockedContainer.innerHTML = '<div class="empty-state">No achievements unlocked yet</div>';
            }

            // Display locked achievements
            if (locked.length > 0) {
                lockedContainer.innerHTML = locked.map(ach => `
                    <div class="achievement-card locked">
                        <div class="achievement-card-icon">🔒</div>
                        <div class="achievement-card-name">${ach.name}</div>
                        <div class="achievement-card-desc">${ach.description}</div>
                    </div>
                `).join('');
            } else {
                lockedContainer.innerHTML = '<div class="empty-state">All achievements unlocked! 🎉</div>';
            }
        }
    } catch (error) {
        console.error('Failed to load achievements:', error);
        showError(unlockedContainer, 'Failed to load achievements');
        showError(lockedContainer, 'Failed to load achievements');
    }
}

// Load profile
async function loadProfile() {
    if (!state.user) return;

    try {
        // Load profile data
        const profileResult = await apiCall(`/user/${state.user.telegram_id}/profile`);

        if (profileResult.success) {
            const { user, stats, rank } = profileResult.data;

            // Update profile info
            document.getElementById('profileName').textContent =
                `${user.firstName} ${user.lastName || ''}`.trim();
            document.getElementById('profileUsername').textContent =
                user.username ? `@${user.username}` : '';

            // Update rank
            if (rank) {
                document.getElementById('rankIcon').textContent = rank.icon;
                document.getElementById('rankTitle').textContent = rank.title;
            }

            // Update stats
            document.getElementById('profileBestScore').textContent = stats.bestScore || 0;
            document.getElementById('profileTotalGames').textContent = formatNumber(stats.totalGames || 0);
            document.getElementById('profileTotalPoints').textContent = formatNumber(stats.totalPoints || 0);
            document.getElementById('profileCurrentStreak').textContent = `${stats.currentStreak || 0} days`;
            document.getElementById('profileLongestStreak').textContent = `${stats.longestStreak || 0} days`;
        }

        // Load user rank
        const rankResult = await apiCall(`/leaderboard/user/${state.user.telegram_id}/rank`);

        if (rankResult.success && rankResult.data.rank) {
            document.getElementById('profileGlobalRank').textContent = `#${rankResult.data.rank}`;
        } else {
            document.getElementById('profileGlobalRank').textContent = '#-';
        }

    } catch (error) {
        console.error('Failed to load profile:', error);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('playButton');
    if (playButton) {
        playButton.addEventListener('click', playGame);
    }
});
