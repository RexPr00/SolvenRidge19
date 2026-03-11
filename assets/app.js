const body = document.body;

function setupLanguageMenu(scope = document) {
  const wrap = scope.querySelector('.lang-wrap');
  if (!wrap) return;
  const btn = wrap.querySelector('.lang-toggle');
  btn.addEventListener('click', () => wrap.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) wrap.classList.remove('open');
  });
}

function trapFocus(container, closeFn) {
  const focusables = container.querySelectorAll('a,button,input,[tabindex]:not([tabindex="-1"])');
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  function onKey(e) {
    if (e.key === 'Escape') closeFn();
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
  container.addEventListener('keydown', onKey);
  return () => container.removeEventListener('keydown', onKey);
}

function setupDrawer() {
  const openBtn = document.querySelector('.burger');
  const closeBtn = document.querySelector('.drawer-close');
  const drawer = document.querySelector('.drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  if (!openBtn || !drawer) return;
  let removeTrap = null;

  const close = () => {
    body.classList.remove('menu-open');
    if (removeTrap) removeTrap();
    removeTrap = null;
    openBtn.focus();
  };
  const open = () => {
    body.classList.add('menu-open');
    removeTrap = trapFocus(drawer, close);
    const first = drawer.querySelector('button,a');
    if (first) first.focus();
  };

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && body.classList.contains('menu-open')) close();
  });
  setupLanguageMenu(drawer);
}

function setupFaq() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item) => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      items.forEach((x) => x.classList.remove('open'));
      item.classList.add('open');
    });
  });
}

function setupModal() {
  const open = document.querySelectorAll('[data-open-privacy]');
  const modal = document.querySelector('.modal');
  const closeBtns = modal ? modal.querySelectorAll('[data-close-modal]') : [];
  if (!modal) return;
  let removeTrap = null;

  const close = () => {
    modal.classList.remove('open');
    body.style.overflow = '';
    if (removeTrap) removeTrap();
  };
  open.forEach((btn) => btn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('open');
    body.style.overflow = 'hidden';
    removeTrap = trapFocus(modal.querySelector('.modal-card'), close);
    modal.querySelector('.icon-btn').focus();
  }));

  closeBtns.forEach((btn) => btn.addEventListener('click', close));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
}

function setupReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('in');
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

setupLanguageMenu(document);
setupDrawer();
setupFaq();
setupModal();
setupReveal();
