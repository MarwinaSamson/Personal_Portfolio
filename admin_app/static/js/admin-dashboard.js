

/* ── SHARED UTILITIES ─────────────────────────────────────── */
function getCookieGlobal(name) {
  let v = null;
  if (document.cookie) {
    document.cookie.split(';').forEach(c => {
      c = c.trim();
      if (c.startsWith(name + '=')) v = decodeURIComponent(c.slice(name.length + 1));
    });
  }
  return v;
}

/* ── PAGE NAVIGATION ──────────────────────────────────────── */
const PAGE_TITLES = {
  dashboard: ['Dashboard',      '/ Overview'],
  profile:   ['Profile & Hero', '/ Manage your info'],
  projects:  ['Projects',       '/ Manage projects'],
  skills:    ['Skills',         '/ Manage skills'],
  about:     ['About Section',  '/ Manage about content'],
  messages:  ['Messages',       '/ Your inbox'],
  settings:  ['Settings',       '/ Configuration'],
};

function navigate(page, navEl) {
  // hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // show target page
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');

  // update sidebar active state
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (navEl) navEl.classList.add('active');

  // update topbar title
  const t = PAGE_TITLES[page] || [page, ''];
  document.getElementById('topbarTitle').innerHTML =
    t[0] + ' <span>' + t[1] + '</span>';

  // close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');

  // load messages from DB when navigating to inbox
  if (page === 'messages') loadMessages();
}


/* ── MOBILE SIDEBAR TOGGLE ─────────────────────────────────── */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}


/* ── TAB SWITCHING ──────────────────────────────────────────── */
function switchTab(tabEl, contentId) {
  // deactivate all tabs in this tab-bar
  const bar = tabEl.closest('.tab-bar');
  bar.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  tabEl.classList.add('active');

  // find all tab content siblings and hide them
  const panel = bar.closest('.panel-body') || bar.parentElement;
  panel.querySelectorAll('[id^="tab-"]').forEach(c => c.style.display = 'none');

  // show the target content
  const target = document.getElementById(contentId);
  if (target) target.style.display = 'block';
}


/* ── EDIT PANEL TEMPLATES ───────────────────────────────────── */
const EDIT_TEMPLATES = {

  'new-project': {
    title: 'New Project',
    html: `
      <div class="form-grid cols-1" style="gap:14px">
        <div class="form-field">
          <label>Project Title</label>
          <input id="new-project-title" type="text" placeholder="My Awesome Project"/>
        </div>
        <div class="form-field">
          <label>Description</label>
          <textarea id="new-project-description" placeholder="What does this project do?"></textarea>
        </div>
        <div class="form-field">
          <label>Tech Stack (comma separated)</label>
          <input id="new-project-stack" type="text" placeholder="Django, PostgreSQL, HTML/CSS"/>
        </div>
        <div class="form-field">
          <label>GitHub URL</label>
          <input id="new-project-github" type="url" placeholder="https://github.com/..."/>
        </div>
        <div class="form-field">
          <label>Live Demo URL</label>
          <input id="new-project-live" type="url" placeholder="https://..."/>
        </div>
        <div class="form-field">
          <label>Status</label>
          <select id="new-project-status">
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="concept">Concept</option>
          </select>
        </div>
        <div class="form-field">
          <div class="toggle-wrap">
            <label class="toggle">
              <input id="new-project-featured" type="checkbox"/>
              <span class="toggle-slider"></span>
            </label>
            <span class="toggle-label">Mark as Featured</span>
          </div>
        </div>
        <div class="form-field">
          <label>Project Thumbnail</label>
          <div class="img-upload-zone">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                 style="width:28px;height:28px;margin-bottom:6px">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p><strong>Upload thumbnail</strong></p>
            <p>16:9 ratio recommended</p>
          </div>
          <input id="new-project-thumbnail" type="file" accept="image/*" />
          <div class="thumb-preview">[ Preview ]</div>
        </div>
      </div>
    `
  },

  'edit-project': {
    title: 'Edit Project',
    html: `
      <div class="form-grid cols-1" style="gap:14px">
        <input type="hidden" id="edit-project-id" value=""/>
        <div class="form-field">
          <label>Project Title</label>
          <input id="edit-project-title" type="text" value=""/>
        </div>
        <div class="form-field">
          <label>Description</label>
          <textarea id="edit-project-description"></textarea>
        </div>
        <div class="form-field">
          <label>Tech Stack (comma separated)</label>
          <input id="edit-project-stack" type="text" value=""/>
        </div>
        <div class="form-field">
          <label>GitHub URL</label>
          <input id="edit-project-github" type="url" value=""/>
        </div>
        <div class="form-field">
          <label>Live Demo URL</label>
          <input id="edit-project-live" type="url" value=""/>
        </div>
        <div class="form-field">
          <label>Status</label>
          <select id="edit-project-status">
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="concept">Concept</option>
          </select>
        </div>
        <div class="form-field">
          <div class="toggle-wrap">
            <label class="toggle">
              <input id="edit-project-featured" type="checkbox"/>
              <span class="toggle-slider"></span>
            </label>
            <span class="toggle-label">Mark as Featured</span>
          </div>
        </div>
        <div class="form-field">
          <label>Thumbnail</label>
          <div class="thumb-preview"
               style="background:linear-gradient(135deg,var(--bg3),var(--bg2))">
            [ Current Thumbnail ]
          </div>
          <input id="edit-project-thumbnail" type="file" accept="image/*" style="margin-top:8px" />
          <button class="btn btn-ghost btn-sm" style="margin-top:8px" onclick="document.getElementById('edit-project-thumbnail').click();return false;">Replace Image</button>
        </div>
      </div>
    `
  },

  'new-skill': {
    title: 'New Skill',
    html: `
      <div class="form-grid cols-1" style="gap:14px">
        <div class="form-field">
          <label>Skill Name</label>
          <input id="new-skill-name" type="text" placeholder="e.g. React"/>
        </div>
        <div class="form-field">
          <label>Category</label>
          <select id="new-skill-category">
            <option>Languages</option>
            <option>Frameworks & Libraries</option>
            <option>Tools & Databases</option>
          </select>
        </div>
        <div class="form-field">
          <label>Devicon Class (optional)</label>
          <input id="new-skill-icon" type="text" placeholder="devicon-react-plain colored"/>
          <span class="field-hint">Find icons at <strong>devicon.dev</strong></span>
        </div>
        <div class="form-field">
          <label>Proficiency</label>
          <div class="range-wrap">
            <input id="new-skill-proficiency" type="range" min="0" max="100" value="75"
                   oninput="syncRangeBar(this)"/>
            <span class="range-val">75%</span>
          </div>
          <div class="skill-bar-preview" style="margin-top:8px">
            <div class="skill-bar-fill" style="width:75%" id="rangeBarPreview"></div>
          </div>
        </div>
      </div>
    `
  },

  'edit-skill': {
    title: 'Edit Skill',
    html: `
      <div class="form-grid cols-1" style="gap:14px">
        <input type="hidden" id="edit-skill-id" value=""/>
        <div class="form-field">
          <label>Skill Name</label>
          <input id="edit-skill-name" type="text" value=""/>
        </div>
        <div class="form-field">
          <label>Category</label>
          <select id="edit-skill-category">
            <option>Languages</option>
            <option>Frameworks & Libraries</option>
            <option>Tools & Databases</option>
          </select>
        </div>
        <div class="form-field">
          <label>Devicon Class</label>
          <input id="edit-skill-icon" type="text" value=""/>
        </div>
        <div class="form-field">
          <label>Proficiency</label>
          <div class="range-wrap">
            <input id="edit-skill-proficiency" type="range" min="0" max="100" value="80"
                   oninput="syncRangeBar(this)"/>
            <span class="range-val">80%</span>
          </div>
          <div class="skill-bar-preview" style="margin-top:8px">
            <div class="skill-bar-fill" style="width:80%" id="rangeBarPreview"></div>
          </div>
        </div>
      </div>
    `
  }
};

/* ── RANGE SLIDER SYNC ──────────────────────────────────────── */
function syncRangeBar(input) {
  // update the adjacent percentage label
  const label = input.nextElementSibling;
  if (label && label.classList.contains('range-val')) {
    label.textContent = input.value + '%';
  }
  // update the preview bar
  const bar = document.getElementById('rangeBarPreview');
  if (bar) bar.style.width = input.value + '%';
}


/* ── EDIT PANEL OPEN / CLOSE / SAVE ────────────────────────── */
function openEditPanel(type) {
  const tpl = EDIT_TEMPLATES[type];
  if (!tpl) return;

  document.getElementById('editPanelTitle').textContent = tpl.title;
  document.getElementById('editPanelBody').innerHTML    = tpl.html;
  document.getElementById('editOverlay').classList.add('open');
  document.getElementById('editPanel').classList.add('open');
}

function closeEditPanel() {
  document.getElementById('editOverlay').classList.remove('open');
  document.getElementById('editPanel').classList.remove('open');
}

function saveEditPanel() {

  // ── SKILL save ──────────────────────────────────────
  if (document.getElementById('new-skill-name') || document.getElementById('edit-skill-name')) {
    const isEditSkill = !!document.getElementById('edit-skill-id');

    const skillId    = isEditSkill ? document.getElementById('edit-skill-id')?.value : null;
    const name       = (document.getElementById('new-skill-name') || document.getElementById('edit-skill-name'))?.value.trim();
    const category   = (document.getElementById('new-skill-category') || document.getElementById('edit-skill-category'))?.value.trim();
    const icon       = (document.getElementById('new-skill-icon') || document.getElementById('edit-skill-icon'))?.value.trim();
    const proficiency = (document.getElementById('new-skill-proficiency') || document.getElementById('edit-skill-proficiency'))?.value || 75;

    if (!name) { showToast('Skill name is required', 'error'); return; }

    const payload = { name, category, icon, proficiency: parseInt(proficiency) };
    if (skillId) payload.id = skillId;

    fetch('/admin/api/save-skill/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookieGlobal('csrftoken')
      },
      body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        closeEditPanel();
        showToast('Skill saved!', 'success');
        location.reload();
      } else {
        showToast('Save failed: ' + (data.error || 'unknown'), 'error');
      }
    })
    .catch(err => showToast('Save failed: ' + err.message, 'error'));
    return;
  }

  // ── PROJECT save ─────────────────────────────────────
  const isEdit = !!document.getElementById('edit-project-id');
  let projId = null, title = '', description = '', tech_stack = '', github_url = '', live_url = '', status = 'completed', is_featured = false;
  if (isEdit && document.getElementById('edit-project-id')) {
    projId = document.getElementById('edit-project-id').value || null;
    title = document.getElementById('edit-project-title').value;
    description = document.getElementById('edit-project-description').value;
    tech_stack = document.getElementById('edit-project-stack').value;
    github_url = document.getElementById('edit-project-github').value;
    live_url = document.getElementById('edit-project-live').value;
    status = document.getElementById('edit-project-status').value;
    is_featured = document.getElementById('edit-project-featured').checked;
  } else if (document.getElementById('new-project-title')) {
    projId = null;
    title = document.getElementById('new-project-title').value;
    description = document.getElementById('new-project-description').value;
    tech_stack = document.getElementById('new-project-stack').value;
    github_url = document.getElementById('new-project-github').value;
    live_url = document.getElementById('new-project-live').value;
    status = document.getElementById('new-project-status').value || 'completed';
    is_featured = document.getElementById('new-project-featured')?.checked || false;
  }

  const fd = new FormData();
  if (projId) fd.append('id', projId);
  fd.append('title', title);
  fd.append('description', description);
  fd.append('tech_stack', tech_stack);
  fd.append('github_url', github_url);
  fd.append('live_url', live_url);
  fd.append('status', status);
  fd.append('is_featured', is_featured ? 'true' : 'false');

  const fileInput = document.getElementById('edit-project-thumbnail') || document.getElementById('new-project-thumbnail');
  if (fileInput && fileInput.files && fileInput.files[0]) {
    fd.append('thumbnail', fileInput.files[0]);
  }

  fetch('/admin/api/save-project/', {
    method: 'POST',
    headers: { 'X-CSRFToken': getCookieGlobal('csrftoken') },
    body: fd
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) {
      closeEditPanel();
      showToast('Project saved successfully!', 'success');
      location.reload();
    } else {
      showToast('Save failed: ' + (data.error || 'unknown'), 'error');
    }
  })
  .catch(err => showToast('Save failed: ' + err.message, 'error'));
}

function editSkill(id, name, category, icon, proficiency) {
  openEditPanel('edit-skill');
  document.getElementById('edit-skill-id').value        = id;
  document.getElementById('edit-skill-name').value      = name;
  document.getElementById('edit-skill-icon').value      = icon;
  document.getElementById('edit-skill-proficiency').value = proficiency;
  document.querySelector('#rangeBarPreview').style.width  = proficiency + '%';
  const rangeVal = document.querySelector('.range-val');
  if (rangeVal) rangeVal.textContent = proficiency + '%';

  // select the right category option
  const sel = document.getElementById('edit-skill-category');
  for (let opt of sel.options) {
    if (opt.value === category || opt.text === category) {
      opt.selected = true;
      break;
    }
  }
}

/* ── PROJECT EDIT / DELETE UI ──────────────────────────────────── */
function editProject(projectId) {
  fetch(`/admin/api/project/${projectId}/`)
    .then(r => r.json())
    .then(proj => {
      openEditPanel('edit-project');
      document.getElementById('edit-project-id').value = proj.id || '';
      document.getElementById('edit-project-title').value = proj.title || '';
      document.getElementById('edit-project-description').value = proj.description || '';
      document.getElementById('edit-project-stack').value = proj.tech_stack || '';
      document.getElementById('edit-project-github').value = proj.github_url || '';
      document.getElementById('edit-project-live').value = proj.live_url || '';
      document.getElementById('edit-project-status').value = proj.status || 'completed';
      document.getElementById('edit-project-featured').checked = proj.is_featured || false;
    })
    .catch(err => {
      console.error('Failed to fetch project:', err);
      showToast('Failed to load project', 'error');
    });
}

function deleteProjectUI(projectId) {
  if (!confirm('Are you sure you want to delete this project?')) return;
  
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const csrftoken = getCookie('csrftoken');
  
  fetch(`/admin/api/delete-project/${projectId}/`, {
    method: 'DELETE',
    headers: {
      'X-CSRFToken': csrftoken
    }
  })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        showToast('Project deleted', 'success');
        document.querySelector(`tr[data-id="${projectId}"]`)?.remove();
      } else {
        showToast('Delete failed: ' + (data.error || 'unknown'), 'error');
      }
    })
    .catch(err => {
      showToast('Delete failed: ' + err.message, 'error');
    });
}


/* ── MESSAGE DATA ───────────────────────────────────────────── */
let MESSAGES = [];

function loadMessages() {
  fetch('/admin/api/messages/')
    .then(r => r.json())
    .then(data => {
      MESSAGES = data.messages || [];
      renderInbox();
    })
    .catch(err => console.error('Failed to load messages', err));
}

function renderInbox() {
  const container = document.getElementById('inboxBody');
  if (!container) return;
  container.innerHTML = MESSAGES.length ? '' : '<p style="padding:20px;color:var(--muted);font-family:var(--font-mono);font-size:.75rem;">No messages yet.</p>';
  MESSAGES.forEach((m, idx) => {
    const unread = !m.is_read;
    container.innerHTML += `
      <div class="msg-item ${unread ? 'msg-unread' : ''}" onclick="openMsg(${idx})">
        <div class="msg-avatar">${m.from[0]}</div>
        <div class="msg-body">
          <div class="msg-top">
            <span class="msg-name">${m.from}</span>
            ${unread ? '<span class="badge badge-warn" style="font-size:.55rem">Unread</span>' : ''}
            <span class="msg-time">${m.time}</span>
          </div>
          <div class="msg-subject">${m.subject}</div>
          <div class="msg-preview">${m.body.substring(0, 80)}...</div>
        </div>
      </div>`;
  });
}

function openMsg(idx) {
  const m = MESSAGES[idx];
  if (!m) return;

  // mark as read in DB
  if (!m.is_read) {
    fetch(`/admin/api/mark-message-read/${m.id}/`, {
      method: 'POST',
      headers: { 'X-CSRFToken': getCookieGlobal('csrftoken') }
    }).then(() => { m.is_read = true; });
  }

  document.getElementById('msgDetailBody').innerHTML = `
    <div style="margin-bottom:20px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
        <div class="msg-avatar" style="width:44px;height:44px;font-size:1rem">
          ${m.from[0]}
        </div>
        <div>
          <div style="font-size:.95rem;font-weight:600">${m.from}</div>
          <div style="font-family:var(--font-mono);font-size:.7rem;color:var(--muted)">${m.email}</div>
        </div>
        <div style="margin-left:auto;font-family:var(--font-mono);font-size:.68rem;color:var(--muted)">
          ${m.time}
        </div>
      </div>
      <div style="font-family:var(--font-head);font-size:1rem;font-weight:700;
                  color:var(--text);margin-bottom:12px">${m.subject}</div>
      <div style="font-size:.88rem;color:var(--muted);line-height:1.8;
                  background:var(--bg);border:1px solid var(--border);
                  border-radius:8px;padding:16px">${m.body}</div>
    </div>
    <div style="border-top:1px solid var(--border);padding-top:16px">
      <label>Reply</label>
      <textarea style="margin-top:8px;min-height:80px"
                placeholder="Type your reply..." id="replyText"></textarea>
      <div style="margin-top:10px;display:flex;gap:8px">
        <button class="btn btn-primary btn-sm"
                onclick="showToast('Reply sent!','success')">Send Reply</button>
        <button class="btn btn-danger btn-sm"
                onclick="deleteMsg(${m.id}, ${idx})">Delete</button>
      </div>
    </div>
  `;
}

function deleteMsg(msgId, idx) {
  fetch(`/admin/api/delete-message/${msgId}/`, {
    method: 'DELETE',
    headers: { 'X-CSRFToken': getCookieGlobal('csrftoken') }
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) {
      MESSAGES.splice(idx, 1);
      renderInbox();
      document.getElementById('msgDetailBody').innerHTML = '<div style="text-align:center;padding:40px 20px;font-family:var(--font-mono);font-size:.75rem;color:var(--muted);">Select a message to read</div>';
      showToast('Message deleted', 'success');
    }
  });
}

/* ── TOAST NOTIFICATION ─────────────────────────────────────── */
let toastTimeout;

function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  const icon  = document.getElementById('toastIcon');

  document.getElementById('toastMsg').textContent = msg;
  toast.className = 'toast ' + type + ' show';

  if (type === 'success') {
    icon.innerHTML = '<polyline points="20 6 9 17 4 12"/>';
  } else {
    icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"/>'
                   + '<line x1="6" y1="6" x2="18" y2="18"/>';
  }

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
}


/* ── SAVE ALL BUTTON ────────────────────────────────────────── */
function saveAll() {
  // collect profile fields and send to server
  const profilePayload = {
    name:            document.getElementById('profile-name')?.value          || '',
    email:           document.getElementById('profile-email')?.value         || '',
    location:        document.getElementById('profile-location')?.value      || '',
    degree:          document.getElementById('profile-degree')?.value        || '',
    about:           document.getElementById('profile-about')?.value         || '',
    typing_phrases:  document.getElementById('typingPhrases')?.value         || ''
  };

  // helper to read CSRF token from cookies
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const csrftoken = getCookie('csrftoken');

  fetch('/admin/api/save-profile/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken
    },
    body: JSON.stringify(profilePayload)
  })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        showToast('Profile saved', 'success');
      } else {
        showToast('Save failed: ' + (data.error || 'unknown'), 'error');
      }
    })
    .catch(err => {
      showToast('Save failed: ' + err.message, 'error');
    });


}

function saveSocialLinks() {
  function getCookie(name) {
    let v = null;
    if (document.cookie) {
      document.cookie.split(';').forEach(c => {
        c = c.trim();
        if (c.startsWith(name + '=')) v = decodeURIComponent(c.slice(name.length + 1));
      });
    }
    return v;
  }

  const payload = {
    github:   document.getElementById('profile-github')?.value   || '',
    linkedin: document.getElementById('profile-linkedin')?.value || '',
  };

  fetch('/admin/api/save-profile/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
    body: JSON.stringify(payload)
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) showToast('Links saved!', 'success');
    else showToast('Save failed: ' + (data.error || 'unknown'), 'error');
  })
  .catch(err => showToast('Save failed: ' + err.message, 'error'));
}

function previewProfileImage(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];

  // client-side size check — 5MB
  if (file.size > 5 * 1024 * 1024) {
    showToast('Image too large. Max 5MB.', 'error');
    input.value = '';
    return;
  }

  // show preview immediately
  const reader = new FileReader();
  reader.onload = function(e) {
    const wrap = document.getElementById('profileAvatarWrap');
    wrap.innerHTML = `<img src="${e.target.result}"
      style="width:100%;height:100%;object-fit:cover;border-radius:50%"/>`;
  };
  reader.readAsDataURL(file);

  // upload to server right away
  const fd = new FormData();
  fd.append('profile_image', file);

  fetch('/admin/api/save-profile-image/', {
    method: 'POST',
    headers: { 'X-CSRFToken': getCookieGlobal('csrftoken') },
    body: fd
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) showToast('Photo saved!', 'success');
    else showToast('Upload failed: ' + (data.error || 'unknown'), 'error');
  })
  .catch(err => showToast('Upload failed: ' + err.message, 'error'));
}

function saveAbout() {
  const payload = {
    p1: document.getElementById('about-p1')?.value || '',
    p2: document.getElementById('about-p2')?.value || '',
    p3: document.getElementById('about-p3')?.value || '',
  };

  fetch('/admin/api/save-about/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookieGlobal('csrftoken')
    },
    body: JSON.stringify(payload)
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) showToast('About section saved!', 'success');
    else showToast('Save failed: ' + (data.error || 'unknown'), 'error');
  })
  .catch(err => showToast('Save failed: ' + err.message, 'error'));
}

function deleteSkillUI(skillId, btn) {
  if (!confirm('Delete this skill?')) return;
  fetch(`/admin/api/delete-skill/${skillId}/`, {
    method: 'DELETE',
    headers: { 'X-CSRFToken': getCookieGlobal('csrftoken') }
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) {
      btn.closest('.skill-row').remove();
      showToast('Skill deleted', 'success');
    } else {
      showToast('Delete failed: ' + (data.error || 'unknown'), 'error');
    }
  })
  .catch(err => showToast('Delete failed: ' + err.message, 'error'));
}


function saveHero() {
  const payload = {
    typing_phrases: document.getElementById('typingPhrases')?.value || ''
  };

  fetch('/admin/api/save-profile/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookieGlobal('csrftoken')
    },
    body: JSON.stringify(payload)
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) showToast('Hero section saved!', 'success');
    else showToast('Save failed: ' + (data.error || 'unknown'), 'error');
  })
  .catch(err => showToast('Save failed: ' + err.message, 'error'));
}