/* Local activity inbox; no simulated incoming events. */
(()=>{
const key='stageone-notifications-v1';
const read=()=>{try{return JSON.parse(accountStorage.getItem(key)||'[]')}catch{return []}};
function write(items){try{accountStorage.setItem(key,JSON.stringify(items.slice(0,100)));update();return true}catch{return false}}
function update(){const b=document.getElementById('notificationCount');const n=read().filter(x=>!x.read).length;b.hidden=!n;b.textContent=n>99?'99+':n;document.getElementById('notificationButton').setAttribute('aria-label',`Notificaciones: ${n} sin leer`)}
function add(title,detail,page,postId){if(!window.stageSession)return;write([{id:crypto.randomUUID(),title,detail,page,postId,created:Date.now(),read:false},...read()]);}
window.openNotification58=id=>{const items=read(),n=items.find(x=>x.id===id);if(!n)return;n.read=true;write(items);if(n.postId){show('inicio');const p=posts.find(x=>x.id===n.postId);if(p){const cards=[...screen.querySelectorAll('.y2k-post')];const visible=posts.filter(x=>x.visibility!=='private'||ownsPost(x));cards[visible.indexOf(p)]?.scrollIntoView({block:'center'});}}else show(n.page||'inicio')};
window.markNotifications58=()=>{write(read().map(x=>({...x,read:true})));render()};
function render(){const items=read();screen.innerHTML=`<section class="glass notifications58"><div class="notification-head58"><button onclick="show('inicio')" aria-label="Volver">‹</button><h2>Notificaciones</h2><button onclick="markNotifications58()">Marcar leídas</button></div><p class="notification-note58">Actividad de esta cuenta en este dispositivo. Los avisos de otros usuarios se habilitarán con la sincronización en la nube.</p>${items.length?items.map(n=>`<button class="notification-row58 ${n.read?'':'unread58'}" data-id="${esc(n.id)}" onclick="openNotification58(this.dataset.id)"><span class="notification-icon58">♫</span><span><b>${esc(n.title)}</b><small>${esc(n.detail)}</small><small>${esc(new Date(n.created).toLocaleString('es-MX'))}</small></span>${n.read?'':'<i aria-label="Sin leer"></i>'}</button>`).join(''):'<p class="notification-empty58">No tienes notificaciones todavía.</p>'}</section>`;update()}
const originalShow=show;show=function(page){if(page==='notificaciones'&&window.stageSession){currentPage=page;window.scrollTo(0,0);document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));render();return}const result=originalShow.apply(this,arguments);update();return result};
const originalSave=savePosts;let known=null;savePosts=async function(){const before=known;const result=await originalSave.apply(this,arguments);const ids=new Set(posts.map(p=>p.id));if(before)for(const p of posts)if(!before.has(p.id)&&ownsPost(p))add('Publicación guardada',p.title||'Nueva publicación','inicio',p.id);known=ids;return result};
const originalInit=initPosts;initPosts=async function(){const result=await originalInit.apply(this,arguments);known=new Set(posts.map(p=>p.id));update();return result};
const originalSend=sendLocal;sendLocal=function(to,text,story){const result=originalSend.apply(this,arguments);if(result)add('Mensaje guardado localmente',`Para ${to}`,'mensajes');return result};
update();
})();
