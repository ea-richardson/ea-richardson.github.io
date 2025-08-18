const themeToggle = document.getElementById('themeToggle');
const body = document.body;

if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
} else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('darkMode', isDark);
});

const searchContainer = document.getElementById('search-container');

searchContainer.addEventListener('click', () => createSearchInput());
searchContainer.addEventListener('focus', () => createSearchInput());

function createSearchInput() {
    if (searchContainer.querySelector('input')) return;

    const input = document.createElement('input');
    input.type = 'search';
    input.className = 'search-input';
    input.placeholder = 'Type to search...';
    input.setAttribute('aria-label', 'Search content');
    searchContainer.innerHTML = '';
    searchContainer.appendChild(input);
    input.focus();

    input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
            input.classList.add('not-empty');
        } else {
            input.classList.remove('not-empty');
        }
        filterSections(input.value.trim());
    });

    input.addEventListener('blur', () => {
        setTimeout(() => {
            if (input.value.trim() === '') {
                searchContainer.innerHTML = '<span class="search-placeholder" id="search-placeholder">Discover...</span>';
                clearFilter();
            }
        }, 150);
    });
}

function filterSections(query) {
    const sections = document.querySelectorAll('section');
    const noResults = document.getElementById('noResults');
    const lowerQuery = query.toLowerCase();
    let anyMatch = false;

    sections.forEach(section => {
        const originalHTML = section.getAttribute('data-original') || section.innerHTML;

        // Store original content for reset
        if (!section.hasAttribute('data-original')) {
            section.setAttribute('data-original', section.innerHTML);
        } else {
            section.innerHTML = originalHTML;
        }

        let matchFound = false;

        // Find text nodes and highlight matches
        const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT, null, false);
        const nodes = [];

        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.nodeValue.toLowerCase().includes(lowerQuery)) {
                nodes.push(node);
            }
        }

        nodes.forEach(node => {
            const span = document.createElement('span');
            const regex = new RegExp(`(${query})`, 'gi');
            span.innerHTML = node.nodeValue.replace(regex, '<mark>$1</mark>');
            node.parentNode.replaceChild(span, node);
            matchFound = true;
        });

        section.style.display = matchFound ? '' : 'none';
        if (matchFound) anyMatch = true;
    });

    noResults.style.display = anyMatch ? 'none' : 'block';
}

function clearFilter() {
    const sections = document.querySelectorAll('section');
    const noResults = document.getElementById('noResults');
    noResults.style.display = 'none';

    sections.forEach(section => {
        if (section.hasAttribute('data-original')) {
            section.innerHTML = section.getAttribute('data-original');
            section.removeAttribute('data-original');
        }
        section.style.display = '';
    });
}

document.getElementById('back-to-top').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

const url =
    'https://script.google.com/macros/s/AKfycbxkgTsEKXZysePxGmW_HfRd43dh0tEqo2TkDHsedTjER-QaozIyMRkiM9u-jJiD55-Eww/exec';

document
    .getElementById('contactForm')
    .addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('Successful', data);

                // Show the thank you message
                document.getElementById('thank-you-message').style.display = 'block';

                // Optionally, hide the form
                document.getElementById('contact-form').style.display = 'none';

                // Reset the form after submission
                this.reset();
            })
            .catch((err) => console.log('err', err));
    });