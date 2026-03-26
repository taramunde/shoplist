document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const itemInput = document.getElementById('itemInput');
    const priceInput = document.getElementById('priceInput');
    const categoryInput = document.getElementById('categoryInput');
    const storeInput = document.getElementById('storeInput');
    const displayStoreName = document.getElementById('displayStoreName');
    const addBtn = document.getElementById('addBtn');
    const shoppingList = document.getElementById('shoppingList');
    const totalPriceEl = document.getElementById('totalPrice');
    const emptyMsg = document.getElementById('emptyMsg');

    let state = {
        storeName: "Mi Lista",
        items: []
    };

    let html5QrcodeScanner = null;

    // 1. Inicializar
    function init() {
        const params = new URLSearchParams(window.location.search);
        const data = params.get('data');
        
        if (data) {
            try {
                const decoded = atob(decodeURIComponent(data));
                state = JSON.parse(decoded);
                storeInput.value = state.storeName;
            } catch (e) {
                console.error("Error cargando datos", e);
            }
        }
        render();
    }

    // 2. Guardar y Actualizar URL
    function updateUrl() {
        state.storeName = storeInput.value || "Mi Lista";
        displayStoreName.textContent = state.storeName;

        if (state.items.length === 0 && state.storeName === "Mi Lista") {
            window.history.replaceState({}, '', window.location.pathname);
            return;
        }

        const jsonString = JSON.stringify(state);
        const encodedData = btoa(unescape(encodeURIComponent(jsonString)));
        const newUrl = `${window.location.origin}${window.location.pathname}?data=${encodeURIComponent(encodedData)}`;
        window.history.replaceState({}, '', newUrl);
    }

    // 3. Renderizado Agrupado por Categoría
    function render() {
        shoppingList.innerHTML = '';
        let total = 0;

        if (state.items.length === 0) {
            emptyMsg.style.display = 'block';
            totalPriceEl.textContent = "0.00";
        } else {
            emptyMsg.style.display = 'none';
            
            // Agrupar items por categoría
            const groups = state.items.reduce((acc, item) => {
                if (!acc[item.category]) acc[item.category] = [];
                acc[item.category].push(item);
                return acc;
            }, {});

            for (const category in groups) {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'category-group';
                groupDiv.innerHTML = `<div class="category-title">${category}</div>`;

                groups[category].forEach((item) => {
                    const idx = state.items.indexOf(item);
                    const itemPrice = parseFloat(item.price) || 0;
                    total += item.checked ? 0 : itemPrice;

                    const li = document.createElement('div');
                    li.className = `list-item ${item.checked ? 'checked' : ''}`;
                    li.innerHTML = `
                        <div onclick="toggleItem(${idx})" style="flex:1; cursor:pointer">
                            <span>${item.text}</span>
                            <small style="display:block; color:#888">${itemPrice > 0 ? itemPrice.toFixed(2) + '€' : ''}</small>
                        </div>
                        <button onclick="deleteItem(${idx})" style="color:red; background:none; border:none; font-weight:bold; padding:10px">X</button>
                    `;
                    groupDiv.appendChild(li);
                });
                shoppingList.appendChild(groupDiv);
            }
            totalPriceEl.textContent = total.toFixed(2);
        }
        updateUrl();
    }

    // 4. Acciones
    function addItem() {
        const text = itemInput.value.trim();
        const price = priceInput.value || 0;
        const category = categoryInput.value;

        if (text) {
            state.items.push({ text, price, category, checked: false });
            itemInput.value = '';
            priceInput.value = '';
            render();
        }
    }

    window.toggleItem = (index) => {
        state.items[index].checked = !state.items[index].checked;
        render();
    };

    window.deleteItem = (index) => {
        state.items.splice(index, 1);
        render();
    };

    // Eventos
    addBtn.addEventListener('click', addItem);
    storeInput.addEventListener('input', updateUrl);
    document.getElementById('clearBtn').addEventListener('click', () => {
        if(confirm("¿Borrar todo?")) { state.items = []; render(); }
    });

    // --- Lógica Compartir/Escanear ---
    document.getElementById('shareBtn').addEventListener('click', () => {
        updateUrl();
        const url = window.location.href;
        document.getElementById('shareLink').value = url;
        document.getElementById('qrcodeContainer').innerHTML = '';
        new QRCode(document.getElementById('qrcodeContainer'), { text: url, width: 200, height: 200 });
        document.getElementById('shareModal').style.display = 'block';
    });

    document.getElementById('scanBtn').addEventListener('click', () => {
        document.getElementById('scanModal').style.display = 'block';
        html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
        html5QrcodeScanner.render((text) => {
            html5QrcodeScanner.clear();
            window.location.href = text;
        });
    });

    // Cerrar Modales
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
            if(html5QrcodeScanner) html5QrcodeScanner.clear();
        };
    });

    init();
});
