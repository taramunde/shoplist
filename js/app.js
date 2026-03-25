document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const itemInput = document.getElementById('itemInput');
    const addBtn = document.getElementById('addBtn');
    const shoppingList = document.getElementById('shoppingList');
    const emptyMsg = document.getElementById('emptyMsg');
    const shareBtn = document.getElementById('shareBtn');
    const clearBtn = document.getElementById('clearBtn');
    const modal = document.getElementById('shareModal');
    const closeBtn = document.querySelector('.close-btn');
    const qrcodeContainer = document.getElementById('qrcodeContainer');
    const shareLinkInput = document.getElementById('shareLink');
    const copyBtn = document.getElementById('copyBtn');

    // State
    let items = [];

    // --- Core Functions ---

    // 1. Initialize: Check if URL contains data
    function init() {
        const params = new URLSearchParams(window.location.search);
        const data = params.get('data');
        
        if (data) {
            try {
                // Decode Base64 string back to JSON
                const decoded = atob(decodeURIComponent(data));
                items = JSON.parse(decoded);
            } catch (e) {
                console.error("Could not load list from URL", e);
                items = [];
            }
        }
        renderList();
    }

    // 2. Update URL without reloading page
    function updateUrl() {
        if (items.length === 0) {
            // Clean URL if list is empty
            window.history.replaceState({}, '', window.location.pathname);
            return;
        }

        // Convert items to JSON -> Base64
        const jsonString = JSON.stringify(items);
        const encodedData = btoa(unescape(encodeURIComponent(jsonString)));
        const newUrl = `${window.location.origin}${window.location.pathname}?data=${encodeURIComponent(encodedData)}`;
        
        window.history.replaceState({}, '', newUrl);
    }

    // 3. Render List to DOM
    function renderList() {
        shoppingList.innerHTML = '';
        
        if (items.length === 0) {
            emptyMsg.style.display = 'block';
        } else {
            emptyMsg.style.display = 'none';
            items.forEach((item, index) => {
                const li = document.createElement('li');
                li.className = `list-item ${item.checked ? 'checked' : ''}`;
                li.innerHTML = `
                    <span onclick="toggleItem(${index})" style="cursor:pointer; flex:1;">${item.text}</span>
                    <button class="delete-btn" onclick="deleteItem(${index})">X</button>
                `;
                shoppingList.appendChild(li);
            });
        }
        updateUrl();
    }

    // 4. Add Item
    function addItem() {
        const text = itemInput.value.trim();
        if (text) {
            items.push({ text: text, checked: false });
            itemInput.value = '';
            renderList();
        }
    }

    // Make functions global for inline onclick handlers
    window.toggleItem = (index) => {
        items[index].checked = !items[index].checked;
        renderList();
    };

    window.deleteItem = (index) => {
        items.splice(index, 1);
        renderList();
    };

    // --- Event Listeners ---

    addBtn.addEventListener('click', addItem);
    itemInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addItem();
    });

    clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the list?')) {
            items = [];
            renderList();
        }
    });

    // --- Sharing Logic ---

    shareBtn.addEventListener('click', () => {
        if (items.length === 0) {
            alert("Add items to the list before sharing!");
            return;
        }

        // Ensure URL is up to date
        updateUrl();
        const currentUrl = window.location.href;
        shareLinkInput.value = currentUrl;

        // Clear previous QR code
        qrcodeContainer.innerHTML = '';

        // Generate new QR code
        new QRCode(qrcodeContainer, {
            text: currentUrl,
            width: 200,
            height: 200,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    copyBtn.addEventListener('click', () => {
        shareLinkInput.select();
        navigator.clipboard.writeText(shareLinkInput.value)
            .then(() => {
                copyBtn.textContent = "Copied!";
                setTimeout(() => copyBtn.textContent = "Copy", 2000);
            })
            .catch(err => console.error('Failed to copy', err));
    });

    // Initialize App
    init();
});
