// Leaderboard functionality
let currentFilter = 'score';

// Load leaderboard
async function loadLeaderboard(filter = 'score') {
    currentFilter = filter;
    const leaderboardList = document.getElementById('leaderboardList');

    showLoading(leaderboardList);

    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        }
    });

    try {
        let endpoint = '/leaderboard';
        if (filter === 'games') {
            endpoint = '/leaderboard/games';
        } else if (filter === 'streak') {
            endpoint = '/leaderboard/streak';
        }

        const result = await apiCall(endpoint);

        if (result.success && result.data.length > 0) {
            leaderboardList.innerHTML = result.data.map(player => {
                const isCurrentUser = state.user && player.id === state.user.telegram_id;
                const rankDisplay = getRankDisplay(player.rank);
                const playerName = `${player.firstName} ${player.lastName || ''}`.trim();
                const scoreValue = getScoreValue(player, filter);

                return `
                    <div class="leaderboard-item ${isCurrentUser ? 'current-user' : ''}">
                        <div class="rank-badge ${rankDisplay.class}">${rankDisplay.display}</div>
                        <div class="player-info">
                            <div class="player-name">
                                ${playerName} ${isCurrentUser ? '(You)' : ''}
                            </div>
                            <div class="player-stats">
                                ${getPlayerStats(player, filter)}
                            </div>
                        </div>
                        <div class="score-badge">${scoreValue}</div>
                    </div>
                `;
            }).join('');
        } else {
            leaderboardList.innerHTML = `
                <div class="empty-state">
                    <div style="font-size: 48px; margin-bottom: 10px;">🏆</div>
                    <div>No players yet. Be the first to play!</div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Failed to load leaderboard:', error);
        showError(leaderboardList, 'Failed to load leaderboard');
    }
}

// Get rank display
function getRankDisplay(rank) {
    if (rank === 1) {
        return { display: '🥇', class: 'gold' };
    } else if (rank === 2) {
        return { display: '🥈', class: 'silver' };
    } else if (rank === 3) {
        return { display: '🥉', class: 'bronze' };
    } else {
        return { display: `${rank}.`, class: '' };
    }
}

// Get score value based on filter
function getScoreValue(player, filter) {
    if (filter === 'games') {
        return formatNumber(player.totalGames);
    } else if (filter === 'streak') {
        return `${player.currentStreak} 🔥`;
    } else {
        return player.bestScore;
    }
}

// Get player stats based on filter
function getPlayerStats(player, filter) {
    if (filter === 'games') {
        return `Best Score: ${player.bestScore} • Total Points: ${formatNumber(player.totalPoints || 0)}`;
    } else if (filter === 'streak') {
        return `Best Score: ${player.bestScore} • Longest: ${player.longestStreak} days`;
    } else {
        return `${formatNumber(player.totalGames)} games played • ${formatNumber(player.totalPoints || 0)} points`;
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            loadLeaderboard(filter);
        });
    });
});
