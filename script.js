const STORAGE_KEY = 'campus_navigator_items';

document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP Plugin
    gsap.registerPlugin(ScrollTrigger);

    if (document.getElementById('itemsGrid')) {
        renderItems();
        runEntranceAnimations();
    }

    if (document.getElementById('addForm')) {
        initFormLogic();
    }

    const searchInput = document.getElementById('searchBar');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => renderItems(e.target.value));
    }
});

// --- ENTRANCE ANIMATIONS ---
function runEntranceAnimations() {
    const tl = gsap.timeline();

    tl.from("nav", { y: -100, opacity: 0, duration: 1, ease: "expo.out" })
      .from("#heroText h1", { y: 60, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.5")
      .from("#heroText p", { y: 30, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.7")
      .from("#heroText div", { y: 20, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.8")
      .from("#heroVisual", { scale: 0.8, opacity: 0, duration: 1.5, ease: "expo.out" }, "-=1");

    // Floating animation for hero visual
    gsap.to("#heroVisual", {
        y: 20,
        repeat: -1,
        yoyo: true,
        duration: 3,
        ease: "sine.inOut"
    });

    // Animate Stats on Scroll
    gsap.from(".stat-card", {
        scrollTrigger: {
            trigger: ".stat-card",
            start: "top 90%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out"
    });
}

// --- CORE DATA LOGIC ---
function getLocalData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveLocalData(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function renderItems(search = '', filter = 'All') {
    const grid = document.getElementById('itemsGrid');
    if (!grid) return;

    let items = getLocalData();
    if (search) items = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    if (filter !== 'All') items = items.filter(i => i.type === filter);

    if (items.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-20 text-center opacity-40 font-medium">No items reported in this category.</div>`;
        return;
    }

    grid.innerHTML = items.map(item => `
        <div class="card flex flex-col">
            <div class="relative overflow-hidden h-52">
                <img src="${item.image || 'https://images.unsplash.com/photo-1521110604737-16d51347a4ff?q=80&w=1000'}" class="w-full h-full object-cover transition-transform duration-700 hover:scale-110">
                <div class="absolute top-4 left-4">
                    <span class="badge ${item.type === 'Lost' ? 'badge-lost' : 'badge-found'}">${item.type}</span>
                </div>
            </div>
            <div class="p-6 flex-grow">
                <h3 class="font-bold text-lg mb-2">${item.name}</h3>
                <p class="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">${item.description}</p>
                <div class="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span class="text-[10px] font-bold text-gray-300 uppercase tracking-widest">${item.date}</span>
                    <button class="text-red-400 text-[10px] font-bold uppercase tracking-widest hover:text-red-600 transition-colors" onclick="removeItem(${item.id})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');

    // Animate Cards as they appear
    gsap.from(".card", {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
    });
}

function handleFilter(type, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderItems('', type);
}

function removeItem(id) {
    if (confirm("Permanently remove this report?")) {
        let items = getLocalData();
        items = items.filter(i => i.id !== id);
        saveLocalData(items);
        renderItems();
    }
}

// --- FORM LOGIC (Compression for add.html) ---
function initFormLogic() {
    const form = document.getElementById('addForm');
    const fileInput = document.getElementById('itemFile');
    const previewImg = document.getElementById('filePreview');
    let compressedImageBase64 = null;

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                const tempImg = new Image();
                tempImg.src = event.target.result;
                tempImg.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 400;
                    let width = tempImg.width;
                    let height = tempImg.height;
                    if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                    canvas.width = width; canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(tempImg, 0, 0, width, height);
                    compressedImageBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    previewImg.src = compressedImageBase64;
                    previewImg.style.display = 'block';
                };
            };
            reader.readAsDataURL(file);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newItem = {
            id: Date.now(),
            name: document.getElementById('itemName').value,
            description: document.getElementById('itemDesc').value,
            type: document.getElementById('itemType').value,
            image: compressedImageBase64,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
        const currentItems = getLocalData();
        currentItems.unshift(newItem);
        saveLocalData(currentItems);
        window.location.href = 'index.html';
    });
}