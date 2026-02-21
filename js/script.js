let currentId = null;
let data = { categories: [] };

const defaultCats = ["Lácteos", "Panadería", "Bebidas", "Fruta y Verdura", "Carne y Pescado", "Snacks", "Despensa", "Otros"];

function generateId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for (let i = 0; i < 5; i++) id += chars[Math.floor(Math.random() * chars.length)];
    return id;
}

function getDefaultData() {
    return { categories: defaultCats.map(name => ({ name, items: [] })) };
}

function saveData() {
    if (currentId) localStorage.setItem(`shoplist_${currentId}`, JSON.stringify(data));
}

function loadData(id) {
    currentId = id;
    const saved = localStorage.getItem(`shoplist_${id}`);
    data = saved ? JSON.parse(saved) : getDefaultData();
    saveData();
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
    data.categories.forEach(cat => cat.items.forEach(item => { if (!item.checked) total += item.price * item.qty; }));
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
    document.getElementById("share-code").textContent = currentId;
    
    // Generar URL con datos
    const encoded = btoa(JSON.stringify(data));
    const shareUrl = window.location.origin + window.location.pathname + "#data=" + encoded;
    
    // Generar el QR
    const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + encodeURIComponent(shareUrl);
    document.getElementById("qr-code-img").src = qrUrl;
}

function hideShareModal() {
    document.getElementById("share-modal").classList.add("hidden");
}

function copyShareableLink() {
    const encoded = btoa(JSON.stringify(data));
    const shareUrl = window.location.origin + window.location.pathname + "#data=" + encoded;
    navigator.clipboard.writeText(shareUrl).then(() => alert("✅ ¡Enlace copiado! Pégalo en WhatsApp."));
}

function loadFromHash() {
    const hash = window.location.hash;
    if (hash.startsWith("#data=")) {
        try {
            const json = atob(hash.slice(6));
            data = JSON.parse(json);
            currentId = generateId();
            saveData();
            showMainScreen();
            history.replaceState(null, null, window.location.pathname);
        } catch(e) { console.error("Error cargando datos", e); }
    }
}

function createNewList() {
    currentId = generateId();
    loadData(currentId);
    showMainScreen();
}

function connectList() {
    let id = document.getElementById("connect-id").value.trim().toUpperCase();
    if (!id) return alert("Pon un código");
    loadData(id);
    showMainScreen();
}

function showMainScreen() {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("main-app").classList.remove("hidden");
    document.getElementById("current-id").textContent = currentId;
    renderCategories();
}

function logout() {
    if (confirm("¿Salir de esta lista?")) {
        location.reload();
    }
}

window.onload = function() {
    loadFromHash();
};
