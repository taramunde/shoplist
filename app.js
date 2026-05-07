const productosPorDefecto = {
  "Frutas y Verduras": ["Plátanos", "Manzanas", "Tomates", "Lechuga", "Cebollas", "Patatas", "Pimientos"],
  "Panadería": ["Barra de pan", "Pan integral", "Pan de molde", "Croissants", "Bollería"],
  "Lácteos": ["Leche", "Yogur natural", "Queso curado", "Mantequilla", "Huevos", "Nata"],
  "Carnicería": ["Pechuga de pollo", "Carne picada", "Jamón york", "Pavo", "Salchichas"],
  "Pescadería": ["Merluza", "Salmón", "Gambas", "Atún en lata", "Sardinas"],
  "Despensa": ["Arroz", "Pasta", "Aceite de oliva", "Sal", "Azúcar", "Lentejas", "Garbanzos", "Tomate frito"],
  "Bebidas": ["Agua 6x1.5L", "Coca-Cola", "Cerveza", "Zumo de naranja", "Vino tinto"],
  "Limpieza": ["Detergente ropa", "Lavavajillas", "Lejía", "Papel higiénico", "Limpiacristales"],
  "Hogar": ["Bolsas basura", "Papel cocina", "Aluminio", "Film transparente", "Pilas AA"],
  "Otros": []
};

function crearProducto(nombre){
  return { id: Date.now() + Math.random(), nombre, cantidad: 1, precio: '', comprado: false };
}

let data = {
  establecimiento: "",
  categorias: Object.entries(productosPorDefecto).map(([nombre, prods]) => ({
    nombre,
    productos: prods.map(crearProducto),
    abierta: true
  })),
  anotaciones: "",
  ubicacion: { lat: null, lon: null, direccion: "" },
  fotoParking: null,
  version: 2
};

function save(){ localStorage.setItem('listaPro', JSON.stringify(data)); updateTotal(); }
function load(){ 
  const saved = localStorage.getItem('listaPro');
  if(saved) {
    const parsed = JSON.parse(saved);
    // migrar si es versión antigua sin productos
    if(parsed.version < 2 || !parsed.categorias[0].productos.length){
      data = {...data, ...parsed, categorias: data.categorias};
    } else {
      data = parsed;
    }
  }
  if(location.hash.includes('lista=')){
    try{
      const encoded = location.hash.split('lista=')[1];
      const json = decodeURIComponent(escape(atob(encoded)));
      const imported = JSON.parse(json);
      if(confirm('¿Cargar lista compartida y reemplazar la actual?')){
        data = {...data, ...imported, fotoParking: data.fotoParking};
        save();
      }
      history.replaceState(null,'',location.pathname);
    }catch(e){ alert('Enlace inválido'); }
  }
  document.getElementById('establecimiento').value = data.establecimiento||'';
  document.getElementById('anotaciones').value = data.anotaciones||'';
  document.getElementById('direccion').value = data.ubicacion.direccion||'';
  if(data.ubicacion.lat) document.getElementById('coords').textContent = `${data.ubicacion.lat.toFixed(5)}, ${data.ubicacion.lon.toFixed(5)}`;
  if(data.fotoParking){ showPhoto(data.fotoParking); }
  render();
  updateTotal();
}

function render(){
  const cont = document.getElementById('categorias');
  cont.innerHTML = '';
  data.categorias.forEach((cat, ci)=>{
    const div = document.createElement('div');
    div.className='category';
    div.innerHTML = `
      <div class="cat-header" onclick="toggleCat(${ci})">
        <span class="cat-title">${cat.nombre}</span>
        <span class="small">${cat.productos.filter(p=>!p.comprado).length}/${cat.productos.length}</span>
      </div>
      <div id="cat-${ci}" style="display:${cat.abierta?'block':'none'}">
        <div id="prods-${ci}"></div>
        <button class="ghost" style="margin-top:6px" onclick="addProduct(${ci})">+ Añadir producto</button>
      </div>
    `;
    cont.appendChild(div);
    const prods = document.getElementById(`prods-${ci}`);
    cat.productos.forEach((p, pi)=>{
      const row = document.createElement('div');
      row.className = 'product'+(p.comprado?' comprado':'');
      row.innerHTML = `
        <input type="checkbox" ${p.comprado?'checked':''} onchange="toggleComprado(${ci},${pi},this.checked)">
        <input class="p-name" value="${p.nombre}" placeholder="Producto" oninput="updateProd(${ci},${pi},'nombre',this.value)">
        <input class="p-qty" type="number" min="1" value="${p.cantidad||1}" oninput="updateProd(${ci},${pi},'cantidad',this.value)">
        <input class="p-price" type="number" step="0.01" placeholder="€" value="${p.precio||''}" oninput="updateProd(${ci},${pi},'precio',this.value)">
        <button class="icon-btn" onclick="delProd(${ci},${pi})" title="Eliminar">✕</button>
      `;
      prods.appendChild(row);
    });
  });
}

function toggleCat(i){ data.categorias[i].abierta = !data.categorias[i].abierta; save(); render(); }
function addCategory(){ 
  const n = prompt('Nombre categoría'); 
  if(n){ 
    data.categorias.push({nombre:n, productos:[], abierta:true}); 
    save(); render(); 
  } 
}
function addProduct(ci){ 
  const nombre = prompt('Nombre del producto:');
  if(nombre){ 
    data.categorias[ci].productos.push(crearProducto(nombre)); 
    save(); render(); 
  } else {
    // si cancela, añade vacío como antes
    data.categorias[ci].productos.push(crearProducto(''));
    save(); render();
  }
}
function updateProd(ci,pi,k,v){ data.categorias[ci].productos[pi][k]=v; save(); }
function toggleComprado(ci,pi,val){ data.categorias[ci].productos[pi].comprado=val; save(); render(); }
function delProd(ci,pi){ if(confirm('¿Eliminar producto?')){ data.categorias[ci].productos.splice(pi,1); save(); render(); } }

function updateTotal(){
  let t=0;
  data.categorias.forEach(c=>c.productos.forEach(p=>{ if(p.precio) t += (parseFloat(p.precio)||0)*(parseInt(p.cantidad)||1); }));
  document.getElementById('total').textContent = t.toLocaleString('es-ES',{minimumFractionDigits:2})+' €';
}

document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('establecimiento').oninput = e=>{ data.establecimiento=e.target.value; save(); };
  document.getElementById('anotaciones').oninput = e=>{ data.anotaciones=e.target.value; save(); };
  document.getElementById('direccion').oninput = e=>{ data.ubicacion.direccion=e.target.value; save(); };
  document.getElementById('fotoInput').onchange = e=>{
    const f = e.target.files[0]; if(!f) return;
    const reader = new FileReader();
    reader.onload = ev=>{ data.fotoParking = ev.target.result; showPhoto(data.fotoParking); save(); };
    reader.readAsDataURL(f);
  };
  load();
});

function getLocation(){
  if(!navigator.geolocation){ alert('Geolocalización no disponible'); return; }
  navigator.geolocation.getCurrentPosition(async pos=>{
    const lat=pos.coords.latitude, lon=pos.coords.longitude;
    data.ubicacion.lat=lat; data.ubicacion.lon=lon;
    document.getElementById('coords').textContent = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
    try{
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=es`);
      const j = await r.json();
      data.ubicacion.direccion = j.display_name||'';
      document.getElementById('direccion').value = data.ubicacion.direccion;
    }catch{}
    save();
  }, err=>alert('No se pudo obtener ubicación'));
}

function showPhoto(src){
  const img=document.getElementById('fotoPreview');
  img.src=src; img.style.display='block';
  document.getElementById('fotoPlaceholder').style.display='none';
  img.onclick = e=>{ e.stopPropagation(); openModal(src); };
}
function clearPhoto(){ data.fotoParking=null; document.getElementById('fotoPreview').style.display='none'; document.getElementById('fotoPlaceholder').style.display='block'; save(); }

function openModal(src){
  const m=document.getElementById('modal'); const img=document.getElementById('modalImg');
  img.src=src; img.style.transform='scale(1)'; m.classList.add('show');
  let scale=1, startDist=0;
  img.onwheel = e=>{ e.preventDefault(); scale += e.deltaY*-0.001; scale=Math.min(Math.max(1,scale),4); img.style.transform=`scale(${scale})`; };
  img.ontouchstart = e=>{ if(e.touches.length===2){ startDist=Math.hypot(e.touches[0].pageX-e.touches[1].pageX, e.touches[0].pageY-e.touches[1].pageY); } };
  img.ontouchmove = e=>{ if(e.touches.length===2){ e.preventDefault(); const d=Math.hypot(e.touches[0].pageX-e.touches[1].pageX, e.touches[0].pageY-e.touches[1].pageY); scale=Math.min(Math.max(1, (d/startDist)),4); img.style.transform=`scale(${scale})`; } };
}
function closeModal(){ document.getElementById('modal').classList.remove('show'); }

function buildShareData(){
  const clone = JSON.parse(JSON.stringify(data));
  delete clone.fotoParking;
  return clone;
}
function generarEnlace(){
  const json = JSON.stringify(buildShareData());
  const encoded = btoa(unescape(encodeURIComponent(json)));
  const url = location.origin + location.pathname + '#lista=' + encoded;
  document.getElementById('shareUrl').value = url;
  return url;
}
function shareWhatsApp(){ const url=generarEnlace(); window.open(`https://wa.me/?text=${encodeURIComponent('🛒 Mi lista de la compra: '+url)}`); }
function shareTelegram(){ const url=generarEnlace(); window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent('Mi lista de la compra')}`); }
function copyLink(){ generarEnlace(); navigator.clipboard.writeText(document.getElementById('shareUrl').value).then(()=>alert('Enlace copiado')); }

function nuevaLista(){ 
  if(confirm('¿Borrar todo y volver a los productos por defecto?')){ 
    localStorage.removeItem('listaPro'); 
    location.reload(); 
  } 
}
function exportar(){
  const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='lista-compra.json'; a.click();
      }
