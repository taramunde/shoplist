document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Base & Share
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

    // DOM Elements - Scan
    const scanBtn = document.getElementById('scanBtn');
    const scanModal = document.getElementById('scanModal');
    const closeScanBtn = document.querySelector('.close-scan-btn');

    // State
    let items = [];
    let html5QrcodeScanner = null; // Guardará la instancia de la cámara

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

    // --- Basic Event Listeners ---

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

    // --- Scanning Logic ---

    scanBtn.addEventListener('click', () => {
        scanModal.style.display = 'block';
        
        // Inicializar el escáner cuando se abre el modal
        html5QrcodeScanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: {width: 250, height: 250} },
            false
        );
        
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    });

    function onScanSuccess(decodedText, decodedResult) {
        // Detener la cámara y cerrar el modal
        html5QrcodeScanner.clear();
        scanModal.style.display = 'none';
        
        // Comprobar si es un enlace de nuestra app
        if (decodedText.includes('?data=')) {
            window.location.href = decodedText;
        } else {
            alert("This QR code doesn't seem to be a valid shopping list.");
        }
    }

    function onScanFailure(error) {
        // Normalmente se ignora porque la cámara lee constantemente buscando el código
    }

    closeScanBtn.addEventListener('click', () => {
        scanModal.style.display = 'none';
        if (html5QrcodeScanner) {
            html5QrcodeScanner.clear(); // Apagar cámara
        }
    });

    // --- Sharing Logic ---

    shareBtn.addEventListener('click', () => {
        if (items.length === 0) {
            alert("Add items to the list before sharing!");
            return;
        }

        updateUrl();
        const currentUrl = window.location.href;
        shareLinkInput.value = currentUrl;

        qrcodeContainer.innerHTML = '';

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

    copyBtn.addEventListener('click', () => {
        shareLinkInput.select();
        navigator.clipboard.writeText(shareLinkInput.value)
            .then(() => {
                copyBtn.textContent = "Copied!";
                setTimeout(() => copyBtn.textContent = "Copy", 2000);
            })
            .catch(err => console.error('Failed to copy', err));
    });

    // --- Global Window Clicks ---
    
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
        if (e.target == scanModal) {
            scanModal.style.display = 'none';
            if (html5QrcodeScanner) {
                html5QrcodeScanner.clear(); // Apagar cámara si cierras haciendo clic fuera
            }
        }
    });

    // Initialize App
    init();
});
