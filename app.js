(() => {
  const STORAGE_KEY = 'todo-items-v1';
  const FILTER_KEY = 'todo-filter-v1';

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  const form = $('#new-todo-form');
  const input = $('#new-todo');
  const list = $('#list');
  const count = $('#count');
  const clearBtn = $('#clear-completed');
  const filterBtns = $$('.filter');

  let items = load();
  let filter = loadFilter();

  // Init
  setActiveFilter(filter);
  render();
  input.focus();

  // Events
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = input.value.trim();
    if (!title) return;
    items.unshift({ id: crypto.randomUUID(), title, completed: false, createdAt: Date.now() });
    input.value = '';
    persist();
    render();
  });

  list.addEventListener('click', (e) => {
    const itemEl = e.target.closest('.item');
    if (!itemEl) return;
    const id = itemEl.dataset.id;

    if (e.target.matches('input[type="checkbox"]')) {
      toggle(id);
    } else if (e.target.matches('[data-action="edit"]')) {
      startEdit(itemEl, id);
    } else if (e.target.matches('[data-action="delete"]')) {
      remove(id);
    }
  });

  // Enable enter/escape on inline input
  list.addEventListener('keydown', (e) => {
    const editor = e.target.closest('input.inline-editor');
    if (!editor) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      finishEdit(editor);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit(editor);
    }
  });

  clearBtn.addEventListener('click', () => {
    const hadCompleted = items.some((i) => i.completed);
    items = items.filter((i) => !i.completed);
    if (hadCompleted) {
      persist();
      render();
    }
  });

  filterBtns.forEach((btn) =>
    btn.addEventListener('click', () => {
      filter = btn.dataset.filter;
      setActiveFilter(filter);
      saveFilter(filter);
      render();
    })
  );

  // Functions
  function render() {
    const filtered = items.filter((i) =>
      filter === 'active' ? !i.completed : filter === 'completed' ? i.completed : true
    );

    list.innerHTML = '';
    for (const it of filtered) {
      list.appendChild(renderItem(it));
    }

    const activeCount = items.filter((i) => !i.completed).length;
    count.textContent = `${activeCount} 개`;
  }

  function renderItem(it) {
    const el = document.createElement('li');
    el.className = 'item';
    el.dataset.id = it.id;
    el.innerHTML = `
      <input type="checkbox" ${it.completed ? 'checked' : ''} aria-label="완료" />
      <div class="title ${it.completed ? 'completed' : ''}" data-role="title">${escapeHtml(it.title)}</div>
      <div class="actions">
        <button class="edit" data-action="edit">편집</button>
        <button class="danger" data-action="delete">삭제</button>
      </div>
    `;
    return el;
  }

  function toggle(id) {
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return;
    items[idx] = { ...items[idx], completed: !items[idx].completed };
    persist();
    render();
  }

  function remove(id) {
    items = items.filter((i) => i.id !== id);
    persist();
    render();
  }

  function startEdit(itemEl, id) {
    const it = items.find((i) => i.id === id);
    if (!it) return;
    const titleEl = $('[data-role="title"]', itemEl);
    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.value = it.title;
    inputEl.className = 'inline-editor';
    inputEl.setAttribute('aria-label', '제목 편집');
    inputEl.style.padding = '6px 8px';
    inputEl.style.borderRadius = '8px';
    inputEl.style.border = '1px solid var(--border)';
    titleEl.replaceWith(inputEl);
    inputEl.focus();
    inputEl.selectionStart = inputEl.selectionEnd = inputEl.value.length;

    // Blur commits
    inputEl.addEventListener('blur', () => finishEdit(inputEl));
  }

  function finishEdit(editor) {
    const itemEl = editor.closest('.item');
    const id = itemEl?.dataset.id;
    const val = editor.value.trim();
    if (!id) return;
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return;
    if (val) items[idx] = { ...items[idx], title: val };
    persist();
    // Re-render one item to avoid list flicker
    const newNode = renderItem(items[idx]);
    itemEl.replaceWith(newNode);
  }

  function cancelEdit(editor) {
    const itemEl = editor.closest('.item');
    const id = itemEl?.dataset.id;
    if (!id) return;
    const it = items.find((i) => i.id === id);
    if (!it) return;
    const newNode = renderItem(it);
    itemEl.replaceWith(newNode);
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      return arr.filter(Boolean);
    } catch (e) {
      return [];
    }
  }

  function saveFilter(f) {
    localStorage.setItem(FILTER_KEY, f);
  }

  function loadFilter() {
    const f = localStorage.getItem(FILTER_KEY);
    return f === 'active' || f === 'completed' ? f : 'all';
  }

  function setActiveFilter(f) {
    filterBtns.forEach((b) => {
      const active = b.dataset.filter === f;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', String(active));
    });
  }

  function escapeHtml(s) {
    return s
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
})();

