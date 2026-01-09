// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

// Global state
const state = {
    user: null,
    currentTab: 'game',
};

// API base URL
const API_URL = window.location.origin + '/api';

// Utility functions
function showLoading(element) {
    if (element) {
        element.innerHTML = '<div class="loading">Loading...</div>';
    }
}

function showError(element, message) {
    if (element) {
        element.innerHTML = `<div class="empty-state">❌ ${message}</div>`;
    }
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// API calls
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

// Initialize user
async function initUser() {
    if (!tg.initDataUnsafe.user) {
        console.warn('No Telegram user data available');
        return;
    }

    const userData = {
        telegramId: tg.initDataUnsafe.user.id,
        firstName: tg.initDataUnsafe.user.first_name,
        lastName: tg.initDataUnsafe.user.last_name || '',
        username: tg.initDataUnsafe.user.username || '',
    };

    try {
        const result = await apiCall('/user', {
            method: 'POST',
            body: JSON.stringify(userData),
        });

        if (result.success) {
            state.user = result.data.user;
            updateUserStats(result.data.stats);
            updateUserRank(result.data.rank);
            loadDailyChallenge();
        }
    } catch (error) {
        console.error('Failed to initialize user:', error);
    }
}

// Update user stats display
function updateUserStats(stats) {
    document.getElementById('bestScore').textContent = stats.bestScore || 0;
    document.getElementById('totalGames').textContent = stats.totalGames || 0;
    document.getElementById('currentStreak').textContent = stats.currentStreak || 0;

    // Update achievements count if available
    if (stats.achievements !== undefined) {
        document.getElementById('achievementsCount').textContent = stats.achievements;
    }
}

// Update user rank display
function updateUserRank(rank) {
    if (!rank) return;

    const rankIcon = document.getElementById('rankIcon');
    const rankTitle = document.getElementById('rankTitle');

    if (rankIcon) rankIcon.textContent = rank.icon;
    if (rankTitle) rankTitle.textContent = rank.title;
}

// Load daily challenge
async function loadDailyChallenge() {
    if (!state.user) return;

    try {
        const result = await apiCall(`/game/${state.user.telegram_id}/daily-challenge`);

        if (result.success && result.data.challenge) {
            const challenge = result.data.challenge;
            const card = document.getElementById('dailyChallengeCard');
            const text = document.getElementById('challengeText');
            const claimBtn = document.getElementById('claimRewardBtn');

            card.style.display = 'block';

            if (challenge.completed && !challenge.reward_claimed) {
                text.textContent = `Challenge completed! Score ${challenge.target_score}+ achieved! 🎉`;
                claimBtn.style.display = 'block';
            } else if (challenge.completed && challenge.reward_claimed) {
                text.textContent = `Today's challenge completed! Come back tomorrow for a new challenge!`;
                claimBtn.style.display = 'none';
            } else {
                text.textContent = `Score ${challenge.target_score} or higher to complete today's challenge!`;
                claimBtn.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Failed to load daily challenge:', error);
    }
}

// Claim challenge reward
async function claimChallengeReward() {
    if (!state.user) return;

    try {
        const result = await apiCall('/game/claim-challenge-reward', {
            method: 'POST',
            body: JSON.stringify({ telegramId: state.user.telegram_id }),
        });

        if (result.success) {
            tg.showAlert('🎁 Reward claimed! +50 points!');
            loadDailyChallenge();
            loadUserStats();
        } else {
            tg.showAlert('❌ ' + (result.error || 'Failed to claim reward'));
        }
    } catch (error) {
        console.error('Failed to claim reward:', error);
        tg.showAlert('❌ Failed to claim reward');
    }
}

// Load user stats
async function loadUserStats() {
    if (!state.user) return;

    try {
        const result = await apiCall(`/user/${state.user.telegram_id}/stats`);
        if (result.success) {
            updateUserStats(result.data);
            if (result.data.rank) {
                updateUserRank(result.data.rank);
            }
        }
    } catch (error) {
        console.error('Failed to load user stats:', error);
    }
}

// Tab switching
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');

    state.currentTab = tabName;

    // Load data for the active tab
    if (tabName === 'leaderboard') {
        loadLeaderboard('score');
    } else if (tabName === 'achievements') {
        loadAchievements();
    } else if (tabName === 'profile') {
        loadProfile();
    }
}

// Show achievement notification
function showAchievementNotification(achievement) {
    const notification = document.getElementById('achievementNotification');
    const icon = document.getElementById('achievementIcon');
    const name = document.getElementById('achievementName');
    const desc = document.getElementById('achievementDesc');

    icon.textContent = achievement.icon;
    name.textContent = `🎉 ${achievement.name} Unlocked!`;
    desc.textContent = achievement.description;

    notification.style.display = 'flex';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Claim reward button
    const claimBtn = document.getElementById('claimRewardBtn');
    if (claimBtn) {
        claimBtn.addEventListener('click', claimChallengeReward);
    }

    // Initialize
    initUser();
});

// Apply Telegram theme
if (tg.themeParams.bg_color) {
    document.body.style.background = tg.themeParams.bg_color;
}
