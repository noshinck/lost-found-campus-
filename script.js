// --- Data Management ---
const STORAGE_KEY = 'campus_navigator_items';

// Initial data to ensure the feed looks active on first load
const SEED_DATA = [
    { 
        id: 1, 
        name: "iPhone 13 Pro", 
        description: "Found in Library Wing B. It has a blue case and a small scratch on the corner.", 
        type: "Found", 
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800", 
        date: "Apr 7, 2026" 
    },
    { 
        id: 2, 
        name: "Mechanical Pencil", 
        description: "GraphGear 1000 lost near the C-Block cafeteria area.", 
        type: "Lost", 
        image: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=800", 
        date: "Apr 7, 2026" 
    }
];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Local Storage
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    }

    renderItems();
    initHeroAnimations();
    initInteractiveHowWorks();
    initBackgroundMovement();
});

// --- 1. Interactive "Simple 3-Step Recovery" Logic ---
// Replaces static images with dynamic transitions
function initInteractiveHowWorks() {
    const triggers = document.querySelectorAll('.step-trigger');
    let currentStep = 1;

    triggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', () => {
            const stepNum = parseInt(trigger.getAttribute('data-step'));
            if (stepNum === currentStep) return;

            // Update Trigger Styles
            triggers.forEach(t => t.classList.remove('active'));
            trigger.classList.add('active');

            // Animate Old Visual Out
            gsap.to(`.step-visual[data-for="${currentStep}"]`, {
                opacity: 0,
                y: stepNum > currentStep ? -30 : 30,
                scale: 0.9,
                duration: 0.4,
                ease: "power2.inOut"
            });

            // Animate New Visual In
            gsap.fromTo(`.step-visual[data-for="${stepNum}"]`, 
                { opacity: 0, y: stepNum > currentStep ? 30 : -30, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "expo.out", delay: 0.1 }
            );

            currentStep = stepNum;
        });
    });
}

// --- 2. Live Feed & Search Logic ---
function getLocalData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function renderItems(filter = 'All', search = '') {
    const grid = document.getElementById('itemsGrid');
    if (!grid) return;

    let items = getLocalData();

    // Apply Filter (All/Lost/Found)
    if (filter !== 'All') items = items.filter(i => i.type === filter);

    // Apply Search
    if (search) {
        const query = search.toLowerCase();
        items = items.filter(i => 
            i.name.toLowerCase().includes(query) || 
            i.description.toLowerCase().includes(query)
        );
    }

    // Generate HTML
    grid.innerHTML = items.map(item => `
        <div class="item-card bg-white/70 backdrop-blur-md rounded-[32px] border border-white/80 p-5 shadow-sm hover:shadow-xl transition-all duration-500 group">
            <div class="h-44 overflow-hidden rounded-2xl mb-5 bg-gray-50">
                <img src="${item.image}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onerror="this.src='https://placehold.co/600x400?text=No+Image'">
            </div>
            <div class="px-1">
                <span class="inline-block px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest mb-3 ${item.type === 'Lost' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}">
                    ${item.type}
                </span>
                <h3 class="font-bold text-lg text-gray-900 mb-1">${item.name}</h3>
                <p class="text-sm text-gray-400 font-medium leading-relaxed mb-6 line-clamp-2">${item.description}</p>
                <div class="flex justify-between items-center pt-4 border-t border-gray-50">
                    <span class="text-[10px] font-bold text-gray-300 uppercase tracking-widest">${item.date}</span>
                    <button onclick="removeItem(${item.id})" class="text-[10px] font-bold text-red-300 hover:text-red-500 transition-colors uppercase">Remove</button>
                </div>
            </div>
        </div>
    `).join('');

    // Animate grid entry
    gsap.from(".item-card", { 
        opacity: 0, 
        y: 20, 
        stagger: 0.08, 
        duration: 0.6, 
        ease: "power2.out" 
    });
}

// --- 3. UI Interaction Handlers ---
function handleFilter(type, btn) {
    // UI update for filter buttons
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active', 'bg-black', 'text-white'));
    btn.classList.add('active', 'bg-black', 'text-white');
    
    renderItems(type, document.getElementById('searchInput').value);
}

function handleSearch() {
    const activeBtn = document.querySelector('.filter-btn.active');
    const filter = activeBtn ? activeBtn.innerText : 'All';
    renderItems(filter, document.getElementById('searchInput').value);
}

function removeItem(id) {
    if (confirm("Remove this item from the public feed?")) {
        const items = getLocalData().filter(i => i.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        renderItems();
    }
}

// --- 4. Background & Entrance Effects ---
function initHeroAnimations() {
    const tl = gsap.timeline();
    tl.from("#hero-pill", { opacity: 0, y: 20, duration: 0.8 })
      .from("#hero-title", { opacity: 0, y: 40, duration: 1, ease: "power4.out" }, "-=0.4")
      .from("#hero-sub", { opacity: 0, y: 20, duration: 1 }, "-=0.6")
      .from("#hero-btns", { opacity: 0, scale: 0.9, duration: 0.8 }, "-=0.8");
}

function initBackgroundMovement() {
    // Subtle parallax effect on the background mesh
    document.addEventListener('mousemove', (e) => {
        const xPos = (e.clientX / window.innerWidth - 0.5) * 40;
        const yPos = (e.clientY / window.innerHeight - 0.5) * 40;
        
        gsap.to("#bgAnimate", {
            duration: 2.5,
            x: xPos,
            y: yPos,
            ease: "power2.out"
        });
    });
}