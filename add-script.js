document.addEventListener('DOMContentLoaded', () => {
    // 1. Entrance Animation for the Glass Card
    gsap.from("#form-card", { 
        opacity: 0, 
        y: 40, 
        duration: 1.2, 
        ease: "expo.out" 
    });

    // 2. Image Upload & Preview Logic
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('fileInput');
    const preview = document.getElementById('preview');
    const uploadPrompt = document.getElementById('upload-prompt');

    // Trigger file explorer when clicking the dashed box
    dropZone.onclick = () => fileInput.click();

    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                // Update UI to show the selected image
                preview.src = event.target.result;
                preview.classList.remove('hidden');
                uploadPrompt.classList.add('hidden');
                
                // Subtle zoom-in effect for the preview
                gsap.fromTo(preview, { scale: 1.1, opacity: 0 }, { 
                    scale: 1, 
                    opacity: 1, 
                    duration: 0.8, 
                    ease: "power2.out" 
                });
            };
            reader.readAsDataURL(file);
        }
    };

    // 3. Form Submission to LocalStorage
    const form = document.getElementById('reportForm');
    
    form.onsubmit = (e) => {
        e.preventDefault();

        // Collect form data matching your UI fields
        const newItem = {
            id: Date.now(), // Unique ID based on timestamp
            name: document.getElementById('itemName').value,
            date: document.getElementById('itemDate').value,
            description: document.getElementById('itemDesc').value,
            type: document.getElementById('itemType').value,
            // Fallback image if user doesn't upload one
            image: preview.classList.contains('hidden') ? 
                   "https://images.unsplash.com/photo-1586769852044-692d6e3703a0?q=80&w=800" : 
                   preview.src 
        };

        // Get existing items from storage or start fresh array
        const currentData = JSON.parse(localStorage.getItem('campus_navigator_items')) || [];
        
        // Add new item to the beginning of the list
        currentData.unshift(newItem);
        
        // Save back to localStorage
        localStorage.setItem('campus_navigator_items', JSON.stringify(currentData));

        // 4. UI Feedback & Redirect
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.innerHTML = `
            <span class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Syncing with Feed...
            </span>
        `;
        submitBtn.disabled = true;

        // Smooth exit animation before navigating
        gsap.to("#form-card", { 
            opacity: 0, 
            y: -20, 
            duration: 0.6, 
            ease: "power2.in",
            onComplete: () => {
                window.location.href = 'index.html';
            }
        });
    };
});

/**
 * Switcher logic for Lost/Found buttons
 * Updates the hidden input and visual button states
 */
function setMode(mode) {
    const btnLost = document.getElementById('btnLost');
    const btnFound = document.getElementById('btnFound');
    const typeInput = document.getElementById('itemType');

    typeInput.value = mode;

    if (mode === 'Lost') {
        btnLost.className = "flex-1 py-3 rounded-[18px] text-[11px] font-bold uppercase tracking-widest transition-all bg-white text-black shadow-sm";
        btnFound.className = "flex-1 py-3 rounded-[18px] text-[11px] font-bold uppercase tracking-widest transition-all text-gray-400 hover:text-gray-600";
    } else {
        btnFound.className = "flex-1 py-3 rounded-[18px] text-[11px] font-bold uppercase tracking-widest transition-all bg-white text-black shadow-sm";
        btnLost.className = "flex-1 py-3 rounded-[18px] text-[11px] font-bold uppercase tracking-widest transition-all text-gray-400 hover:text-gray-600";
    }
}
