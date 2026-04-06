// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Check which page we are on
    if (document.getElementById('itemsGrid')) {
        renderItems();
        animateEntrance();
    }

    if (document.getElementById('addForm')) {
        setupFormHandler();
        gsap.from("#formContainer", { opacity: 0, y: 30, duration: 0.8, ease: "power4.out" });
    }

    // Live search listener
    const searchInput = document.getElementById('searchBar');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderItems(e.target.value);
        });
    }
});

// --- CORE FUNCTIONS ---

function getItems() {
    const data = localStorage.getItem('campus_items');
    return data ? JSON.parse(data) : [];
}

function saveItem(item) {
    const items = getItems();
    items.unshift(item); // Add to the beginning of the list
    localStorage.setItem('campus_items', JSON.stringify(items));
}

function deleteItem(id) {
    if (confirm("Are you sure you want to remove this report?")) {
        let items = getItems();
        items = items.filter(item => item.id !== id);
        localStorage.setItem('campus_items', JSON.stringify(items));
        renderItems();
    }
}

// --- RENDERING ---

function renderItems(searchTerm = '', filterType = 'All') {
    const grid = document.getElementById('itemsGrid');
    if (!grid) return;

    let items = getItems();

    // Filter Logic
    if (searchTerm) {
        items = items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filterType !== 'All') {
        items = items.filter(i => i.type === filterType);
    }

    if (items.length === 0) {
        grid.innerHTML = `<div class="empty-state">No items found matching your criteria.</div>`;
        return;
    }

    grid.innerHTML = items.map(item => `
        <div class="card" data-type="${item.type}">
            <img src="${item.image || 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=1000&auto=format&fit=crop'}" class="card-img" alt="${item.name}">
            <div class="card-content">
                <span class="badge ${item.type === 'Lost' ? 'badge-lost' : 'badge-found'}">${item.type}</span>
                <h3 class="card-title">${item.name}</h3>
                <p class="card-desc">${item.description}</p>
                <p class="card-date">${item.date}</p>
                <button class="delete-btn" onclick="deleteItem(${item.id})">Remove Post</button>
            </div>
        </div>
    `).join('');
    
    // Smooth fade in for cards
    gsap.from(".card", { opacity: 0, y: 20, stagger: 0.05, duration: 0.5 });
}

// --- HANDLERS ---

function setupFormHandler() {
    const form = document.getElementById('addForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const newItem = {
            id: Date.now(),
            name: document.getElementById('itemName').value,
            description: document.getElementById('itemDesc').value,
            type: document.getElementById('itemType').value,
            image: document.getElementById('itemImg').value,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        saveItem(newItem);
        
        // Success animation then redirect
        gsap.to("#formContainer", { opacity: 0, scale: 0.95, duration: 0.4, onComplete: () => {
            window.location.href = 'index.html';
        }});
    });
}

function filterItems(type, btn) {
    // Update active UI
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    renderItems('', type);
}

function animateEntrance() {
    gsap.from("nav", { y: -60, duration: 1, ease: "expo.out" });
    gsap.from("header h1", { opacity: 0, x: -30, duration: 0.8, delay: 0.2 });
}