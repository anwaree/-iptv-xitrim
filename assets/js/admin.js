/* admin.js - handles database (localStorage), login, tabs, servers, extreme, mods, ads */

const LS_KEY = 'ix_database_v1'; // single DB key

// default database structure
const DEFAULT_DB = {
  servers: [
    { name: "Sample-Server-01", type: "premium", url: "https://example.com/sample1.m3u", channels: 1500, created: "2025-01-01" },
    { name: "Sample-Server-02", type: "basic", url: "https://example.com/sample2.m3u", channels: 800, created: "2025-02-01" }
  ],
  extremes: [], // extreme accounts saved
  mods: [],
  ads: '',
  admins: [{ username: "admin", password: "admin123" }]
};

function loadDB() {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) {
    localStorage.setItem(LS_KEY, JSON.stringify(DEFAULT_DB));
    return JSON.parse(JSON.stringify(DEFAULT_DB));
  }
  try { return JSON.parse(raw); } catch(e) { localStorage.setItem(LS_KEY, JSON.stringify(DEFAULT_DB)); return JSON.parse(JSON.stringify(DEFAULT_DB)); }
}

function saveDB(db) { localStorage.setItem(LS_KEY, JSON.stringify(db)); }

// LOGIN
const loginArea = document.getElementById('loginArea');
const dashboardArea = document.getElementById('dashboardArea');
const logoutBtn = document.getElementById('logoutBtn');
const loginMsg = document.getElementById('loginMsg');

function showLoginError(msg) {
  loginMsg.textContent = msg; loginMsg.classList.remove('hidden');
  setTimeout(()=>loginMsg.classList.add('hidden'),3000);
}

function checkSession() {
  const s = sessionStorage.getItem('ix_logged');
  return !!s;
}

function requireAuth() {
  if (!checkSession()) {
    loginArea.classList.remove('hidden'); dashboardArea.classList.add('hidden'); logoutBtn.classList.add('hidden');
  } else {
    loginArea.classList.add('hidden'); dashboardArea.classList.remove('hidden'); logoutBtn.classList.remove('hidden');
  }
}

document.getElementById('loginBtn').addEventListener('click', ()=>{
  const user = document.getElementById('adminUser').value.trim();
  const pass = document.getElementById('adminPass').value;
  const db = loadDB();
  const found = db.admins.find(a=>a.username===user && a.password===pass);
  if (found) {
    sessionStorage.setItem('ix_logged', JSON.stringify(found));
    requireAuth();
    renderAll();
  } else showLoginError('اسم المستخدم أو كلمة المرور غير صحيحة');
});

document.getElementById('showAdminPassBtn').addEventListener('click', ()=>{
  const db = loadDB();
  alert('حسابات الأدمن (تجريبي):\\n' + db.admins.map(a=>a.username + ' : ' + a.password).join('\\n'));
});

logoutBtn.addEventListener('click', ()=>{
  sessionStorage.removeItem('ix_logged'); requireAuth();
});

// TAB handling
document.querySelectorAll('.tabBtn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tabBtn').forEach(b=>b.classList.remove('bg-blue-600'));
    document.querySelectorAll('.tabPanel').forEach(p=>p.classList.add('hidden'));
    btn.classList.add('bg-blue-600');
    document.getElementById(btn.dataset.tab).classList.remove('hidden');
  });
});

// Servers management
document.getElementById('addServerBtn').addEventListener('click', ()=>{
  const name = document.getElementById('s_name').value.trim();
  const url = document.getElementById('s_url').value.trim();
  const type = document.getElementById('s_type').value;
  if (!name || !url) { alert('أدخل اسم ورابط السيرفر'); return; }
  const db = loadDB();
  db.servers.unshift({ name, type, url, channels: 0, created: new Date().toISOString().split('T')[0] });
  saveDB(db); renderServersTable(); renderStats(); document.getElementById('s_name').value=''; document.getElementById('s_url').value='';
});

function renderServersTable() {
  const db = loadDB();
  const tbody = document.querySelector('#serversTable tbody');
  tbody.innerHTML = '';
  db.servers.forEach((s, idx)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="p-2 text-right">${s.name}</td><td class="p-2 text-right">${s.type}</td><td class="p-2 text-right"><a class="text-blue-300" href="${s.url}" target="_blank" rel="noopener">فتح</a></td><td class="p-2 text-right"><button onclick="deleteServer(${idx})" class="px-2 py-1 bg-red-600 rounded">حذف</button></td>`;
    tbody.appendChild(tr);
  });
}

function deleteServer(i) {
  if (!confirm('هل تريد حذف هذا السيرفر؟')) return;
  const db = loadDB(); db.servers.splice(i,1); saveDB(db); renderServersTable(); renderStats();
}

// Extreme accounts
document.getElementById('saveExtremeBtn').addEventListener('click', ()=>{
  const host = document.getElementById('ext_host').value.trim();
  const port = document.getElementById('ext_port').value.trim();
  const user = document.getElementById('ext_user').value.trim();
  const pass = document.getElementById('ext_pass').value;
  if (!host || !user || !pass) { alert('أكمل بيانات Extreme'); return; }
  const db = loadDB();
  db.extremes.unshift({ host, port, user, pass, created: new Date().toISOString().split('T')[0] });
  saveDB(db); renderExtremes();
  document.getElementById('ext_host').value=''; document.getElementById('ext_port').value=''; document.getElementById('ext_user').value=''; document.getElementById('ext_pass').value='';
});

document.getElementById('testExtremeBtn').addEventListener('click', ()=>{
  const host = document.getElementById('ext_host').value.trim();
  const user = document.getElementById('ext_user').value.trim();
  if (!host || !user) { alert('أكمل بيانات الاختبار'); return; }
  alert('اختبار اتصال وهمي إلى: ' + host + ' باسم المستخدم ' + user);
});

function renderExtremes() {
  const db = loadDB(); const area = document.getElementById('extList'); area.innerHTML='';
  db.extremes.forEach((e, idx)=>{
    const el = document.createElement('div'); el.className='bg-black/30 p-3 rounded mb-2 flex justify-between items-center';
    el.innerHTML = `<div><strong>${e.user}</strong><div class="text-sm text-gray-300">${e.host}:${e.port}</div></div><div class="flex gap-2"><button onclick="deleteExtreme(${idx})" class="px-2 py-1 bg-red-600 rounded">حذف</button><button onclick="showExtreme(${idx})" class="px-2 py-1 bg-yellow-600 rounded">عرض</button></div>`;
    area.appendChild(el);
  });
}

function deleteExtreme(i) { if(!confirm('حذف؟')) return; const db = loadDB(); db.extremes.splice(i,1); saveDB(db); renderExtremes(); renderStats(); }
function showExtreme(i) { const db = loadDB(); const e = db.extremes[i]; alert('Host: '+e.host+'\\nPort: '+e.port+'\\nUser: '+e.user+'\\nPass: '+e.pass); }

// Mods management
document.getElementById('addModBtn').addEventListener('click', ()=>{
  const u = document.getElementById('mod_user').value.trim();
  const p = document.getElementById('mod_pass').value;
  if (!u || !p) { alert('أكمل بيانات المشرف'); return; }
  const db = loadDB(); db.mods.unshift({ username: u, password: p }); saveDB(db); renderMods(); document.getElementById('mod_user').value=''; document.getElementById('mod_pass').value='';
});

function renderMods() {
  const db = loadDB(); const area = document.getElementById('modsList'); area.innerHTML='';
  db.mods.forEach((m, idx)=>{
    const el = document.createElement('div'); el.className='bg-black/30 p-3 rounded mb-2 flex justify-between items-center';
    el.innerHTML = `<div><strong>${m.username}</strong></div><div class="flex gap-2"><button onclick="deleteMod(${idx})" class="px-2 py-1 bg-red-600 rounded">حذف</button><button onclick="showModPass(${idx})" class="px-2 py-1 bg-yellow-600 rounded">عرض</button></div>`;
    area.appendChild(el);
  });
}
function deleteMod(i) { if(!confirm('حذف مشرف؟')) return; const db=loadDB(); db.mods.splice(i,1); saveDB(db); renderMods(); renderStats(); }
function showModPass(i) { const db = loadDB(); alert('كلمة مرور: ' + (db.mods[i] ? db.mods[i].password : 'غير متوفر')); }

// Ads handling
document.getElementById('saveAdsBtn').addEventListener('click', ()=>{
  const code = document.getElementById('adsCode').value;
  const db = loadDB(); db.ads = code; saveDB(db); alert('تم حفظ كود الإعلان'); renderStats();
});
document.getElementById('clearAdsBtn').addEventListener('click', ()=>{
  const db = loadDB(); db.ads = ''; saveDB(db); document.getElementById('adsCode').value=''; alert('تم إزالة الكود'); renderStats();
});

// render functions for dashboard
function renderStats() {
  const db = loadDB();
  document.getElementById('statServers').textContent = db.servers.length;
  document.getElementById('statMods').textContent = db.mods.length;
  document.getElementById('statAds').textContent = db.ads && db.ads.trim() ? 'نعم' : 'لا';
}

function renderAll() {
  renderServersTable(); renderExtremes(); renderMods(); renderStats();
  const db = loadDB();
  document.getElementById('adsCode').value = db.ads || '';
}

// init
requireAuth = function(){ if (sessionStorage.getItem('ix_logged')) { loginArea.classList.add('hidden'); dashboardArea.classList.remove('hidden'); logoutBtn.classList.remove('hidden'); renderAll(); } else { loginArea.classList.remove('hidden'); dashboardArea.classList.add('hidden'); logoutBtn.classList.add('hidden'); } }
requireAuth();
renderStats();
