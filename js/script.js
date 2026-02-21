let currentId = null;
let data = { categories: [] };

const defaultCats = ["Dairy & Eggs", "Bread & Bakery", "Beverages", "Produce", "Meat & Fish", "Snacks", "Pantry", "Other"];

function generateId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
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
                <div class="flex items-center justify-between bg-zinc-900 px-1 py-3">
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
            html += `<div class="text-zinc-500 text-sm py-8 text-center italic">no items yet</div>`;
        } else {
            cat.items.forEach((item, itemIdx) => {
                const subtotal = (item.price * item.qty).toFixed(2);
                html += `
                    <div class="item-row flex items-center gap-x-4 bg-zinc-900 px-5 py-4 rounded-3xl group">
                        <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleCheck(${catIdx}, ${itemIdx}, this.checked)" class="w-6 h-6 accent-emerald-500">
                        <div class="flex-1 min-w-0">
                            <div class="font-medium leading-tight ${item.checked ? 'line-through text-zinc-500' : ''}">${item.name}</div>
                            <div class="text-xs text-zinc-400">${item.qty} × $${parseFloat(item.price).toFixed(2)}</div>
                        </div>
                        <div class="text-right font-mono text-lg font-medium tabular-nums">$${subtotal}</div>
                        <button onclick="deleteItem(${catIdx}, ${itemIdx}); event.stopImmediatePropagation()" class="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 w-8 h-8 flex items-center justify-center text-xl">×</button>
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
    if (confirm("Delete this item?")) {
        data.categories[catIdx].items.splice(itemIdx, 1);
        saveData();
        renderCategories();
    }
}

function openAddModal(catIdx = 0) {
    document.getElementById("item-modal").classList.remove("hidden");
    document.getElementById("modal-title").textContent = "New item";
    document.getElementById("modal-item-index").value = -1;
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
    if (!name) return alert("Please enter item name");
    const item = { name, price, qty, checked: false };
    data.categories[catIdx].items.push(item);
    saveData();
    hideItemModal();
    renderCategories();
}

function addItemGlobal() { openAddModal(0); }

function addCategory() {
    const name = prompt("New category name:");
    if (name && name.trim()) {
        data.categories.push({ name: name.trim(), items: [] });
        saveData();
        renderCategories();
    }
}

function showShare() {
    document.getElementById("share-modal").classList.remove("hidden");
    document.getElementById("share-code").textContent = currentId;
}

function hideShareModal() {
    document.getElementById("share-modal").classList.add("hidden");
}

function copyCodeAndClose() {
    navigator.clipboard.writeText(currentId).then(() => {
        const el = document.getElementById("share-code");
        const orig = el.textContent;
        el.textContent = "✅ COPIED";
        setTimeout(() => { el.textContent = orig; hideShareModal(); }, 1200);
    });
}

function exportList() {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => alert("✅ List copied to clipboard!\nSend this text to your partner."));
}

function importList() {
    const pasted = prompt("Paste the exported JSON here:");
    if (!pasted) return;
    try {
        const imported = JSON.parse(pasted);
        if (imported.categories) {
            data = imported;
            saveData();
            renderCategories();
            alert("✅ List imported!");
        }
    } catch(e) { alert("❌ Invalid data"); }
}

function copyShareableLink() {
    const encoded = btoa(JSON.stringify(data));
    const shareUrl = window.location.origin + window.location.pathname + "#data=" + encoded;
    navigator.clipboard.writeText(shareUrl).then(() => alert("✅ Shareable link copied!\nAnyone who opens it sees your current list instantly."));
}

function loadFromHash() {
    const hash = window.location.hash;
    if (hash.startsWith("#data=")) {
        try {
            const json = atob(hash.slice(6));
            const imported = JSON.parse(json);
            if (imported.categories) {
                data = imported;
                document.getElementById("login-screen").classList.add("hidden");
                document.getElementById("main-app").classList.remove("hidden");
                renderCategories();
                history.replaceState(null, null, window.location.pathname);
            }
        } catch(e) {}
    }
}

function createNewList() {
    currentId = generateId();
    loadData(currentId);
    showMainScreen();
    setTimeout(showShare, 800);
}

function connectList() {
    let id = document.getElementById("connect-id").value.trim().toUpperCase();
    if (!id) return alert("Enter a list password");
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
    if (confirm("Leave this list?")) {
        document.getElementById("main-app").classList.add("hidden");
        document.getElementById("login-screen").classList.remove("hidden");
        document.getElementById("connect-id").value = "";
        currentId = null;
    }
}

window.onload = function() {
    loadFromHash();
    const urlParams = new URLSearchParams(window.location.search);
    const urlId = urlParams.get("id");
    if (urlId) {
        document.getElementById("connect-id").value = urlId.toUpperCase();
        connectList();
    }
};
