// Elementra Labs — shared navigation and element directory behavior
document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('navLinks');
  if (toggle && nav) toggle.addEventListener('click', () => nav.classList.toggle('open'));

  const current = location.pathname.split('/').pop() || 'index.html';
  const navKey = current === 'index.html' ? 'home' :
    current === 'periodic-table.html' || current === 'element.html' ? 'table' :
    current === 'properties.html' ? 'properties' :
    current === 'compounds.html' ? 'compounds' :
    current === 'safety.html' ? 'safety' : 'about';
  document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === navKey));

  const grid = document.getElementById('periodicGrid');
  if (grid && window.ELEMENTS) {
    const search = document.getElementById('elementSearch');
    const family = document.getElementById('familyFilter');
    const noElements = document.getElementById('noElements');
    const classMap = {
      'Alkali metal':'alkali','Alkaline earth metal':'alkaline','Transition metal':'transition',
      'Post-transition metal':'post','Metalloid':'metalloid','Nonmetal':'nonmetal',
      'Halogen':'halogen','Noble gas':'noble','Lanthanide':'lanthanide','Actinide':'actinide','Unknown':'unknown'
    };
    const render = () => {
      const q = (search.value || '').trim().toLowerCase();
      const f = family.value;
      const matches = ELEMENTS.filter(e => {
        const haystack = `${e.number} ${e.symbol} ${e.name} ${e.category}`.toLowerCase();
        return (!q || haystack.includes(q)) && (f === 'all' || e.category === f);
      });
      grid.innerHTML = matches.map(e => `<a class="element-tile cat-${classMap[e.category] || 'unknown'}" href="element.html?symbol=${encodeURIComponent(e.symbol)}" title="${e.number} · ${e.name}"><span class="num">${e.number}</span><strong>${e.symbol}</strong><small>${e.name}</small></a>`).join('');
      noElements.classList.toggle('hidden', matches.length > 0);
    };
    search.addEventListener('input', render);
    family.addEventListener('change', render);
    render();
  }

  if (current === 'element.html' && window.ELEMENTS) {
    const params = new URLSearchParams(location.search);
    const requested = params.get('symbol') || 'Fe';
    let element = ELEMENTS.find(e => e.symbol.toLowerCase() === requested.toLowerCase());
    if (!element) element = ELEMENTS[25];
    const set = (id, value) => { const node = document.getElementById(id); if (node) node.textContent = value; };
    const period = element.number <= 2 ? 1 : element.number <= 10 ? 2 : element.number <= 18 ? 3 : element.number <= 36 ? 4 : element.number <= 54 ? 5 : element.number <= 86 ? 6 : 7;
    const groupGuess = element.category === 'Alkali metal' ? 1 : element.category === 'Alkaline earth metal' ? 2 :
      element.category === 'Halogen' ? 17 : element.category === 'Noble gas' ? 18 :
      element.category === 'Lanthanide' ? 'Lanthanide series' : element.category === 'Actinide' ? 'Actinide series' :
      element.category === 'Transition metal' ? '3–12' : 'Varies';
    const block = element.category === 'Lanthanide' ? 'f-block' : element.category === 'Actinide' ? 'f-block' :
      element.category === 'Transition metal' ? 'd-block' : ['Alkali metal','Alkaline earth metal'].includes(element.category) ? 's-block' : 'p-block';
    document.title = `${element.name} (${element.symbol}) — Elementra Labs`;
    set('profileTitle', `${element.name} (${element.symbol})`);
    set('pNumber', element.number); set('pSymbol', element.symbol); set('pMass', element.mass);
    set('pName', element.name); set('pCategory', element.category); set('pClass', element.category);
    set('pAtomic', element.number); set('pWeight', `${element.mass} u`);
    set('pState', element.state); set('pConfig', element.configuration);
    set('pPeriod', period); set('pGroup', groupGuess); set('pBlock', block); set('pFamily', element.category);
    set('pSummary', element.summary);
    set('pOverview', `${element.name} (${element.symbol}) is element ${element.number} in the periodic table. ${element.summary} The information shown here is a concise educational summary; detailed physical constants and chemical behavior should be checked against authoritative scientific references.`);
    const prev = ELEMENTS.find(e => e.number === element.number - 1) || ELEMENTS[ELEMENTS.length-1];
    const next = ELEMENTS.find(e => e.number === element.number + 1) || ELEMENTS[0];
    document.getElementById('prevElement').href = `element.html?symbol=${prev.symbol}`;
    document.getElementById('prevElement').textContent = `← ${prev.name}`;
    document.getElementById('nextElement').href = `element.html?symbol=${next.symbol}`;
    document.getElementById('nextElement').textContent = `${next.name} →`;
  }
});