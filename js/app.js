/**
 * Shopping List Application
 * =========================
 * A simple shopping list with QR code and link sharing.
 * Data is encoded in URL for sharing across devices.
 * 
 * Files:
 * - index.html    : Main HTML structure
 * - css/style.css : All styles
 * - js/app.js     : This file - all functionality
 */

// ========================================
// Global Variables
// ========================================

let shoppingList = [];

// ========================================
// Initialization
// ========================================

/**
 * Initialize the application
 * Checks for shared data in URL or loads from localStorage
 */
function init() {
    // Check if there's shared data in URL
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('list');
    
    if (sharedData) {
        try {
            // Decode the shared list from URL
            const decoded = atob(sharedData);
            shoppingList = JSON.parse(decoded);
            document.getElementById('sharedBadge').style.display = 'inline-flex';
        } catch (e) {
            console.error('Failed to parse shared list:', e);
            shoppingList = loadFromStorage();
        }
    } else {
        // Load from localStorage if no shared data
        shoppingList = loadFromStorage();
    }

    renderList();
}

// ========================================
// Storage Functions
// ========================================

/**
 * Save the shopping list to localStorage
 */
function saveToStorage() {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}

/**
 * Load the shopping list from localStorage
 * @returns {Array} The saved shopping list or empty array
 */
function loadFromStorage() {
    const saved = localStorage.getItem('shoppingList');
    return saved ? JSON.parse(saved) : [];
}

// ========================================
// Item Management Functions
// ========================================

/**
 * Add a new item to the shopping list
 */
function addItem() {
    const input = document.getElementById('itemInput');
    const text = input.value.trim();
    
    if (text) {
        shoppingList.push({
            id: Date.now(),
            text: text,
            completed: false
        });
        input.value = '';
        saveToStorage();
        renderList();
    }
    
    input.focus();
}

/**
 * Handle Enter key press in the input field
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        addItem();
    }
}

/**
 * Toggle the completed status of an item
 * @param {number} id - The ID of the item to toggle
 */
function toggleItem(id) {
    const item = shoppingList.find(item => item.id === id);
    if (item) {
        item.completed = !item.completed;
        saveToStorage();
        renderList();
    }
}

/**
 * Delete an item from the shopping list
 * @param {number} id - The ID of the item to delete
 */
function deleteItem(id) {
    shoppingList = shoppingList.filter(item => item.id !== id);
    saveToStorage();
    renderList();
}

/**
 * Clear all completed items from the list
 */
function clearCompleted() {
    shoppingList = shoppingList.filter(item => !item.completed);
    saveToStorage();
    renderList();
}

// ========================================
// Rendering Functions
// ========================================

/**
 * Render the shopping list to the DOM
 */
function renderList() {
    const container = document.getElementById('listContainer');
    const totalCount = document.getElementById('totalCount');
    const completedCount = document.getElementById('completedCount');
    const shareBtn = document.getElementById('shareBtn');
    
    // Update stats
    const total = shoppingList.length;
    const completed = shoppingList.filter(item => item.completed).length;
    totalCount.textContent = `📝 ${total} item${total !== 1 ? 's' : ''}`;
    completedCount.textContent = `✅ ${completed} done`;
    
    // Show/hide share button
    shareBtn.style.display = total > 0 ? 'flex' : 'none';
    
    // Show empty state if no items
    if (total === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">🛍️</div>
                <p>Your shopping list is empty.<br>Add some items to get started!</p>
            </div>
        `;
        return;
    }
    
    // Render items
    container.innerHTML = shoppingList.map(item => `
        <div class="list-item ${item.completed ? 'completed' : ''}">
            <div class="checkbox ${item.completed ? 'checked' : ''}" onclick="toggleItem(${item.id})"></div>
            <span class="item-text">${escapeHtml(item.text)}</span>
            <button class="delete-btn" onclick="deleteItem(${item.id})" title="Delete">✕</button>
        </div>
    `).join('');
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - The text to escape
 * @returns {string} The escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// Sharing Functions
// ========================================

/**
 * Generate a shareable URL with the shopping list encoded
 * @returns {string} The shareable URL
 */
function generateShareLink() {
    const baseUrl = window.location.origin + window.location.pathname;
    const encodedData = btoa(JSON.stringify(shoppingList));
    return `${baseUrl}?list=${encodeURIComponent(encodedData)}`;
}

/**
 * Open the share modal with QR code and link
 */
function openShareModal() {
    if (shoppingList.length === 0) {
        showToast('Add some items first!');
        return;
    }
    
    const shareLink = generateShareLink();
    document.getElementById('shareLink').textContent = shareLink;
    
    // Generate QR code
    const canvas = document.getElementById('qrCanvas');
    QRCode.toCanvas(canvas, shareLink, {
        width: 200,
        margin: 2,
        color: {
            dark: '#333333',
            light: '#ffffff'
        }
    }, function(error) {
        if (error) {
            console.error('QR Code error:', error);
        }
    });
    
    document.getElementById('shareModal').classList.add('active');
}

/**
 * Close the share modal
 */
function closeShareModal() {
    document.getElementById('shareModal').classList.remove('active');
}

/**
 * Copy the share link to clipboard
 */
function copyLink() {
    const shareLink = generateShareLink();
    
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareLink).then(() => {
            showToast('Link copied to clipboard!');
        }).catch(() => {
            fallbackCopy(shareLink);
        });
    } else {
        fallbackCopy(shareLink);
    }
}

/**
 * Fallback method to copy text to clipboard
 * @param {string} text - The text to copy
 */
function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showToast('Link copied to clipboard!');
    } catch (e) {
        showToast('Failed to copy. Please copy manually.');
    }
    
    document.body.removeChild(textarea);
}

// ========================================
// UI Helper Functions
// ========================================

/**
 * Show a toast notification
 * @param {string} message - The message to display
 */
function showToast(message) {
    // Remove existing toast if any
    const existing = document.querySelector('.toast');
    if (existing) {
        existing.remove();
    }
    
    // Create and show new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ========================================
// Event Listeners
// ========================================

// Close modal when clicking outside
document.getElementById('shareModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeShareModal();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
