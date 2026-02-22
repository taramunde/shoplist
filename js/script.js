let currentId = "mi_lista"; // Ya no necesitamos un ID aleatorio visible
let data = { categories: [] };

const defaultCats = ["Lácteos", "Panadería", "Bebidas", "Fruta y Verdura", "Carne y Pescado", "Snacks", "Despensa", "Otros"];

function getDefaultData() {
    return { categories: defaultCats.map(name => ({ name, items: [] })) };
}

function saveData() {
    localStorage.setItem('shoplist_data', JSON.stringify(data));
}

function loadLocalData() {
    const saved = localStorage.getItem('shoplist_data');
    data = saved ? JSON.parse(saved) : getDefaultData();
}

function encodeData(obj) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
}

function decodeData(str) {
    return JSON.parse(decodeURIComponent(escape(atob(str))));
}

function getShareUrl() {
    const base = window.location.origin + window.location.pathname;
    // CRÍTICO: encodeURIComponent previene que el símbolo '+' se transforme en espacios
    return base + "?lista=" + encodeURIComponent(encodeData(data));
}

function renderCategories() {
    const container = document.getElementById("categories-list");
    container.innerHTML = "";
    data.categories.forEach((cat, catIdx) => {
        let html = `
            <div class="category-header">
                <div class="flex items-center justify-between bg-zinc-950 py-3">
                    <div class="flex items-center gap-x-3">
                        <span class="text-2xl">📦</span>
                        <h3 class="text-xl font-semibold">${cat.name}</h3>
                    </div>
                    <button onclick="openAddModal(${catIdx})" class="px-4 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-2xl">+ item</button>
                </div>
            </div>
            <div class="space-y-px">
        `;
        if (cat.items.length === 0) {
            html += `<div class="text-zinc-600 text-sm py-4 text-center italic">vacío</div>`;
        } else {
            cat.items.forEach((item, itemIdx) => {
                const subtotal = (item.price * item.qty).toFixed(2);
                html += `
                    <div class="item-row flex items-center gap-x-4 bg-zinc-900 px-5 py-4 rounded-3xl group mb-2">
                        <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleCheck(${catIdx}, ${itemIdx}, this.checked)" class="w-6 h-6 accent-emerald-500">
                        <div class="flex-1 min-w-0">
                            <div class="font-medium leading-tight ${item.checked ? 'line-through text-zinc-500' : ''}">${item.name}</div>
                            <div class="text-xs text-zinc-400">${item.qty} × $${parseFloat(item.price).toFixed(2)}</div>
                        </div>
                        <div class="text-right font-mono text-lg font-medium tabular-nums">$${subtotal}</div>
                        <button onclick="deleteItem(${catIdx}, ${itemIdx})" class="text-red-400 w-8 h-8 flex items-center justify-center text-2xl ml-2">×</button>
                    </div>
                `;
            });
        }
        html += `</div>`;
        container.innerHTML += html;
    });
    updateGrandTotal();
}

function updateGrandTotal() {
    let total = 0;
    data.categories.forEach(cat => cat.items.forEach(item => {
        if (!item.checked) total += item.price * item.qty;
    }));
    document.getElementById("grand-total").textContent = "$" + total.toFixed(2);
}

function toggleCheck(catIdx, itemIdx, checked) {
    data.categories[catIdx].items[itemIdx].checked = checked;
    saveData();
    renderCategories();
}

function deleteItem(catIdx, itemIdx) {
    data.categories[catIdx].items.splice(itemIdx, 1);
    saveData();
    renderCategories();
}

function openAddModal(catIdx = 0) {
    document.getElementById("item-modal").classList.remove("hidden");
    const select = document.getElementById("modal-category");
    select.innerHTML = "";
    data.categories.forEach((cat, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = cat.name;
        if (i === catIdx) opt.selected = true;
        select.appendChild(opt);
    });
    document.getElementById("modal-name").value = "";
    document.getElementById("modal-price").value = "";
    document.getElementById("modal-qty").value = "1";
}

function hideItemModal() {
    document.getElementById("item-modal").classList.add("hidden");
}

function saveModalItem() {
    const catIdx = parseInt(document.getElementById("modal-category").value);
    const name = document.getElementById("modal-name").value.trim();
    const price = parseFloat(document.getElementById("modal-price").value) || 0;
    const qty = parseInt(document.getElementById("modal-qty").value) || 1;
    if (!name) return alert("Ponle un nombre");
    data.categories[catIdx].items.push({ name, price, qty, checked: false });
    saveData();
    hideItemModal();
    renderCategories();
}

function addItemGlobal() { openAddModal(0); }

function addCategory() {
    const name = prompt("Nombre de la nueva categoría:");
    if (name) {
        data.categories.push({ name: name.trim(), items: [] });
        saveData();
        renderCategories();
    }
}

function showShare() {
    document.getElementById("share-modal").classList.remove("hidden");
    const shareUrl = getShareUrl();
    const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + encodeURIComponent(shareUrl);
    document.getElementById("qr-code-img").src = qrUrl;
}

function hideShareModal() {
    document.getElementById("share-modal").classList.add("hidden");
}

function copyShareableLink() {
    const shareUrl = getShareUrl();
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(shareUrl)
            .then(() => alert("✅ ¡Enlace copiado! Pégalo en WhatsApp."))
            .catch(() => prompt("Copia este enlace manualmente:", shareUrl));
    } else {
        // Fallback para navegadores antiguos o sin https
        prompt("Tu navegador requiere que copies este enlace manualmente:", shareUrl);
    }
}

function loadFromQueryParam() {
    const params = new URLSearchParams(window.location.search);
    const lista = params.get("lista");
    if (lista) {
        try {
            data = decodeData(lista);
            saveData();
            // Limpiamos la URL sin recargar para que quede limpia
            history.replaceState(null, null, window.location.pathname);
            showMainScreen();
            return true;
        } catch (e) {
            console.error("Error al cargar la lista compartida:", e);
            alert("El enlace escaneado no es válido o está incompleto.");
        }
    }
    return false;
}

function createNewList() {
    loadLocalData();
    showMainScreen();
}

function showMainScreen() {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("main-app").classList.remove("hidden");
    renderCategories();
}

function logout() {
    if (confirm("¿Limpiar tu pantalla y volver al inicio? (Tus datos seguirán guardados)")) {
        document.getElementById("main-app").classList.add("hidden");
        document.getElementById("login-screen").classList.remove("hidden");
    }
}

window.onload = function () {
    // Si viene de un escaneo de QR/Link, lo carga. Si no, espera en la pantalla de inicio.
    if(!loadFromQueryParam()){
        // Opcional: Si ya hay datos previos, podemos saltar directo a la app
        if(localStorage.getItem('shoplist_data')) {
            createNewList();
        }
    }
};
