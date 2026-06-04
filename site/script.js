let catalog = [];

async function init() {
    try {
        const response = await fetch('../content/index.json');
        catalog = await response.json();

        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');

        if (slug) {
            showDetail(slug);
        } else {
            renderCatalog(catalog);
        }

        document.getElementById('search-input').addEventListener('input', handleSearch);
        document.getElementById('back-btn').addEventListener('click', () => {
            window.history.pushState({}, '', window.location.pathname);
            document.getElementById('detail-view').style.display = 'none';
            document.getElementById('catalog-view').style.display = 'block';
            renderCatalog(catalog);
        });

    } catch (e) {
        document.getElementById('lesson-list').innerHTML = '<p>Error loading catalog. Make sure you ran "npm run build" first.</p>';
    }
}

function renderCatalog(items) {
    const container = document.getElementById('lesson-list');
    container.innerHTML = '';

    if (items.length === 0) {
        container.innerHTML = '<p>No lessons found.</p>';
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'lesson-card';
        card.onclick = () => {
            window.history.pushState({}, '', `?slug=${item.slug}`);
            showDetail(item.slug);
        };

        const tagsHtml = item.tags.map(t => `<span class="tag">${t}</span>`).join('');

        card.innerHTML = `
            <h2>${item.title}</h2>
            <p>${item.summary}</p>
            <div style="font-size: 0.8rem; color: #666;">Level: ${item.level} | Updated: ${item.updated}</div>
            <div class="tags">${tagsHtml}</div>
        `;
        container.appendChild(card);
    });
}

function handleSearch(e) {
    const term = e.target.value.toLowerCase();
    const filtered = catalog.filter(item =>
        item.title.toLowerCase().includes(term) ||
        item.summary.toLowerCase().includes(term) ||
        item.tags.some(t => t.toLowerCase().includes(term))
    );
    renderCatalog(filtered);
}

async function showDetail(slug) {
    document.getElementById('catalog-view').style.display = 'none';
    const detailView = document.getElementById('detail-view');
    const contentContainer = document.getElementById('lesson-content');

    detailView.style.display = 'block';
    contentContainer.innerHTML = '<p>Loading...</p>';

    const lesson = catalog.find(l => l.slug === slug);
    if (!lesson) {
        contentContainer.innerHTML = '<p>Lesson not found.</p>';
        return;
    }

    try {
        const response = await fetch(`../content/${lesson.path}`);
        let markdown = await response.text();

        markdown = markdown.replace(/---\r?\n[\s\S]*?\n---/, '');

        contentContainer.innerHTML = marked.parse(markdown);
    } catch (e) {
        contentContainer.innerHTML = '<p>Error loading content.</p>';
    }
}

document.addEventListener('DOMContentLoaded', init);