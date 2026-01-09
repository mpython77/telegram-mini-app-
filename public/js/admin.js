// Admin Panel JavaScript
const API_URL = window.location.origin;
let authToken = localStorage.getItem('adminToken');

// Utility functions
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// API calls
async function apiCall(endpoint, options = {}) {
    try {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            headers,
            ...options,
        });

        const data = await response.json();

        if (response.status === 401) {
            logout();
            throw new Error('Unauthorized');
        }

        return data;
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

// Login
async function login(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    try {
        const result = await apiCall('/admin/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });

        if (result.success) {
            authToken = result.data.token;
            localStorage.setItem('adminToken', authToken);
            showDashboard();
        } else {
            errorDiv.textContent = result.error || 'Login failed';
        }
    } catch (error) {
        errorDiv.textContent = 'Login failed. Please try again.';
    }
}

// Logout
function logout() {
    authToken = null;
    localStorage.removeItem('adminToken');
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
}

// Show dashboard
function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    loadDashboard();
}

// Load dashboard
async function loadDashboard() {
    try {
        const result = await apiCall('/admin/stats');

        if (result.success) {
            const { totalUsers, totalGames, averageScore, activeUsers, recentGames, topPlayers } = result.data;

            // Update stats
            document.getElementById('totalUsers').textContent = formatNumber(totalUsers);
            document.getElementById('totalGames').textContent = formatNumber(totalGames);
            document.getElementById('averageScore').textContent = averageScore;
            document.getElementById('activeUsers').textContent = formatNumber(activeUsers);

            // Display recent games
            displayRecentGames(recentGames);

            // Display top players (will be shown when user switches to that tab)
            window.topPlayersData = topPlayers;
        }
    } catch (error) {
        console.error('Failed to load dashboard:', error);
    }
}

// Display recent games
function displayRecentGames(games) {
    const container = document.getElementById('recentGamesList');

    if (games && games.length > 0) {
        container.innerHTML = games.map(game => `
            <div class="game-item">
                <div>
                    <div class="game-player">${game.first_name} ${game.last_name || ''}</div>
                    <div class="game-time">${formatDate(game.created_at)}</div>
                </div>
                <div class="game-score">${game.score}</div>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<div class="loading">No games yet</div>';
    }
}

// Load users
async function loadUsers() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '<tr><td colspan="7" class="loading">Loading...</td></tr>';

    try {
        const result = await apiCall('/admin/users');

        if (result.success && result.data.users.length > 0) {
            tbody.innerHTML = result.data.users.map(user => `
                <tr>
                    <td>${user.telegram_id}</td>
                    <td>${user.first_name} ${user.last_name || ''}</td>
                    <td>${user.username ? '@' + user.username : '-'}</td>
                    <td><strong>${user.best_score}</strong></td>
                    <td>${formatNumber(user.total_games)}</td>
                    <td>${formatNumber(user.total_points)}</td>
                    <td>${formatDate(user.created_at)}</td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="7" class="loading">No users found</td></tr>';
        }
    } catch (error) {
        console.error('Failed to load users:', error);
        tbody.innerHTML = '<tr><td colspan="7" class="loading">Error loading users</td></tr>';
    }
}

// Load games
async function loadGames() {
    const tbody = document.getElementById('gamesTableBody');
    tbody.innerHTML = '<tr><td colspan="5" class="loading">Loading...</td></tr>';

    try {
        const result = await apiCall('/admin/games');

        if (result.success && result.data.games.length > 0) {
            tbody.innerHTML = result.data.games.map(game => `
                <tr>
                    <td>${game.id}</td>
                    <td>${game.first_name} ${game.last_name || ''}</td>
                    <td><strong>${game.score}</strong></td>
                    <td>${game.game_type}</td>
                    <td>${formatDate(game.created_at)}</td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="5" class="loading">No games found</td></tr>';
        }
    } catch (error) {
        console.error('Failed to load games:', error);
        tbody.innerHTML = '<tr><td colspan="5" class="loading">Error loading games</td></tr>';
    }
}

// Load top players
function loadTopPlayers() {
    const container = document.getElementById('topPlayersList');

    if (window.topPlayersData && window.topPlayersData.length > 0) {
        container.innerHTML = window.topPlayersData.map((player, index) => {
            const rank = index + 1;
            let rankClass = '';
            let rankDisplay = `${rank}.`;

            if (rank === 1) { rankClass = 'gold'; rankDisplay = '🥇'; }
            else if (rank === 2) { rankClass = 'silver'; rankDisplay = '🥈'; }
            else if (rank === 3) { rankClass = 'bronze'; rankDisplay = '🥉'; }

            return `
                <div class="player-card">
                    <div class="player-rank ${rankClass}">${rankDisplay}</div>
                    <div class="player-details">
                        <div class="player-name">${player.first_name} ${player.last_name || ''}</div>
                        <div class="player-stats">
                            ${formatNumber(player.total_games)} games • ${formatNumber(player.total_points)} points
                        </div>
                    </div>
                    <div class="player-score">${player.best_score}</div>
                </div>
            `;
        }).join('');
    } else {
        container.innerHTML = '<div class="loading">No players yet</div>';
    }
}

// Switch sections
function switchSection(sectionName) {
    // Update tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

    // Update sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${sectionName}Section`).classList.add('active');

    // Load data for the active section
    if (sectionName === 'users') {
        loadUsers();
    } else if (sectionName === 'games') {
        loadGames();
    } else if (sectionName === 'top-players') {
        loadTopPlayers();
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', login);

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Tab switching
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const section = tab.getAttribute('data-section');
            switchSection(section);
        });
    });

    // Check if already logged in
    if (authToken) {
        showDashboard();
    }
});
