const defaultProducts = {
  "Frutas y Verduras":["Plátanos","Manzanas","Tomates","Lechuga"],
  "Panadería":["Barra pan","Pan molde","Croissants"],
  "Lácteos":["Leche","Yogures","Queso","Huevos"],
  "Carnicería":["Pollo","Carne picada","Jamón"],
  "Pescadería":["Merluza","Salmón","Atún"],
  "Despensa":["Arroz","Pasta","Aceite","Sal"],
  "Bebidas":["Agua","Coca-Cola","Cerveza"],
  "Limpieza":["Detergente","Lejía","Papel higiénico"]
};
const crearProd = n=>({id:Math.random(),nombre:n,cantidad:1,precio:'',comprado:false});
let listas = JSON.parse(localStorage.getItem('go2market_listas')||'{}');
let listaActual = localStorage.getItem('go2market_actual')||'Compra semanal';
if(!listas[listaActual]){
  listas[listaActual]={establecimiento:'Alimerka',color:'#22c55e',categorias:Object.entries(defaultProducts).map(([k,v])=>({nombre:k,productos:v.map(crearProd),abierta:true})),ubicacion:{},foto:null};
}
let modoCompra=false;

function save(){localStorage.setItem('go2market_listas',JSON.stringify(listas));localStorage.setItem('go2market_actual',listaActual);updateTotal()}
function getData(){return listas[listaActual]}

function renderSelector(){
  const sel=document.getElementById('listaSelector');sel.innerHTML='';
  Object.keys(listas).forEach(n=>{const o=document.createElement('option');o.value=n;o.textContent=n;if(n===listaActual)o.selected=true;sel.appendChild(o)});
}
function cambiarLista(){listaActual=document.getElementById('listaSelector').value;loadLista();}

function loadLista(){
  const d=getData();
  document.getElementById('establecimiento').value=d.establecimiento;
  document.getElementById('colorPicker').value=d.color||'#22c55e';
  document.documentElement.style.setProperty('--accent',d.color);
  document.getElementById('direccion').value=d.ubicacion.direccion||'';
  document.getElementById('coords').textContent=d.ubicacion.lat?`${d.ubicacion.lat.toFixed(4)},${d.ubicacion.lon.toFixed(4)}`:'Sin coordenadas';
  if(d.foto){document.getElementById('fotoPreview').src=d.foto;document.getElementById('fotoPreview').style.display='block';document.getElementById('fotoPlaceholder').style.display='none'}
  render();
  updateTotal();
}
function render(){
  const d=getData();const cont=document.getElementById('categorias');cont.innerHTML='';
  d.categorias.forEach((cat,ci)=>{
    const div=document.createElement('div');div.className='category';
    div.innerHTML=`<div class="cat-header" onclick="toggleCat(${ci})"><span class="cat-title">${cat.nombre}</span><span class="small">${cat.productos.filter(p=>!p.comprado).length}/${cat.productos.length}</span></div><div id="c${ci}" style="display:${cat.abierta?'block':'none'}"><div id="p${ci}"></div>${!modoCompra?`<button class="ghost" style="margin-top:4px" onclick="addProd(${ci})">+ Añadir</button>`:''}</div>`;
    cont.appendChild(div);
    const ph=document.getElementById('p'+ci);
    cat.productos.forEach((p,pi)=>{
      const row=document.createElement('div');row.className='product'+(modoCompra?' compra':'')+(p.comprado?' comprado':'');
      if(modoCompra){
        row.innerHTML=`<input type="checkbox" class="checkbox" ${p.comprado?'checked':''} onchange="check(${ci},${pi},this.checked)"><input class="p-name" value="${p.nombre}" readonly><span class="badge">x${p.cantidad}</span>`;
      }else{
        row.innerHTML=`<input class="p-name" value="${p.nombre}" oninput="upd(${ci},${pi},'nombre',this.value)"><input class="p-qty" type="number" value="${p.cantidad}" oninput="upd(${ci},${pi},'cantidad',this.value)"><input class="p-price" type="number" step="0.01" placeholder="€" value="${p.precio}" oninput="upd(${ci},${pi},'precio',this.value)"><button class="icon-btn" onclick="del(${ci},${pi})">✕</button>`;
      }
      ph.appendChild(row);
    });
  });
  document.getElementById('modoLabel').textContent=modoCompra?'Compra':'Edición';
  document.getElementById('toggleModo').textContent=modoCompra?'Edición':'Compra';
}
function toggleCat(i){getData().categorias[i].abierta=!getData().categorias[i].abierta;save();render()}
function addProd(ci){const n=prompt('Producto:');if(n){getData().categorias[ci].productos.push(crearProd(n));save();render()}}
function addCategory(){const n=prompt('Tipo:');if(n){getData().categorias.push({nombre:n,productos:[],abierta:true});save();render()}}
function upd(ci,pi,k,v){getData().categorias[ci].productos[pi][k]=v;save()}
function check(ci,pi,v){getData().categorias[ci].productos[pi].comprado=v;save();render()}
function del(ci,pi){if(confirm('¿Eliminar?')){getData().categorias[ci].productos.splice(pi,1);save();render()}}
function toggleModo(){modoCompra=!modoCompra;render()}
function updateTotal(){let t=0;getData().categorias.forEach(c=>c.productos.forEach(p=>{if(p.precio)t+=parseFloat(p.precio)*(p.cantidad||1)}));document.getElementById('total').textContent=t.toLocaleString('es-ES',{minimumFractionDigits:2})+' €'}

document.getElementById('establecimiento').oninput=e=>{getData().establecimiento=e.target.value;save()};
document.getElementById('colorPicker').oninput=e=>{getData().color=e.target.value;document.documentElement.style.setProperty('--accent',e.target.value);save()};
document.getElementById('direccion').oninput=e=>{getData().ubicacion.direccion=e.target.value;save()};
document.getElementById('fotoInput').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{getData().foto=ev.target.result;save();loadLista()};r.readAsDataURL(f)};

function getLocation(){navigator.geolocation.getCurrentPosition(async p=>{const d=getData();d.ubicacion.lat=p.coords.latitude;d.ubicacion.lon=p.coords.longitude;document.getElementById('coords').textContent=`${d.ubicacion.lat.toFixed(4)},${d.ubicacion.lon.toFixed(4)}`;try{const r=await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${d.ubicacion.lat}&lon=${d.ubicacion.lon}&accept-language=es`);const j=await r.json();d.ubicacion.direccion=j.display_name;document.getElementById('direccion').value=d.ubicacion.direccion}catch{};save()})}

function nuevaLista(){const n=prompt('Nombre nueva lista:');if(n&&!listas[n]){listas[n]={establecimiento:'',color:'#22c55e',categorias:Object.entries(defaultProducts).map(([k,v])=>({nombre:k,productos:v.map(crearProd),abierta:true})),ubicacion:{},foto:null};listaActual=n;save();renderSelector();loadLista()}}

function generarEnlace(){const data=btoa(unescape(encodeURIComponent(JSON.stringify({lista:listaActual,data:getData()}))));const url=location.origin+location.pathname+'#go2='+data;document.getElementById('shareUrl').value=url;return url}
function shareWhatsApp(){window.open('https://wa.me/?text='+encodeURIComponent('🛒 Lista '+listaActual+': '+generarEnlace()))}
function shareTelegram(){window.open('https://t.me/share/url?url='+encodeURIComponent(generarEnlace()))}
function copyLink(){generarEnlace();navigator.clipboard.writeText(document.getElementById('shareUrl').value).then(()=>alert('Copiado'))}

// voz
function startVoice(){
  const status=document.getElementById('voiceStatus');status.style.display='block';status.textContent='Escuchando... di "pan y leche y huevos"';
  const Rec=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!Rec){alert('Voz no soportada');return}
  const rec=new Rec();rec.lang='es-ES';rec.onresult=e=>{const txt=e.results[0][0].transcript;status.textContent='Añadido: '+txt;txt.split(/ y |, /).forEach(p=>{const prod=p.trim();if(prod){getData().categorias[0].productos.push(crearProd(prod.charAt(0).toUpperCase()+prod.slice(1)))}});save();render();setTimeout(()=>status.style.display='none',2000)};rec.start();
}

// cargar compartida
if(location.hash.includes('go2=')){try{const imp=JSON.parse(decodeURIComponent(escape(atob(location.hash.split('go2=')[1]))));listas[imp.lista]=imp.data;listaActual=imp.lista;modoCompra=true;save();history.replaceState(null,'',location.pathname)}catch{}}
renderSelector();loadLista();
  
