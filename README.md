# 📍 Campus Navigator: Lost & Found Platform

**Campus Navigator** is a modern, responsive web application designed for university campuses to help students report and find lost items. It features a clean, minimalist UI inspired by premium design principles and utilizes high-end motion for a professional user experience.

---

## 🚀 Key Features

* **Real-time Feed:** View all lost and found reports in a dynamic, responsive grid.
* **Smart Filtering:** Instantly toggle between "All", "Lost", or "Found" categories.
* **Live Search:** Search for specific items by name with zero-latency results.
* **Persistent Storage:** Data survives page refreshes using the Browser's **LocalStorage API**.
* **Premium Motion:** Smooth micro-interactions and staggered card entries powered by **GSAP**.
* **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop views.
* **Item Management:** Users can add new reports and delete their own posts with a confirmation prompt.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Custom Design Tokens + Tailwind CSS Utilities)
* **Logic:** Vanilla JavaScript (ES6+)
* **Animations:** GSAP 3.12 (GreenSock Animation Platform)
* **Storage:** Window.localStorage (Client-side persistence)
* **Typography:** Inter (Apple/Stripe-style typography)

---

## 📂 Project Structure

```text
lost-found-project/
├── index.html    # Main dashboard & item feed
├── add.html      # Reporting form for new items
├── style.css     # Global styles & layout rules
├── script.js     # Logic: CRUD operations & motion engine
├── README.md     # Project documentation
├── assets/       # Folder for images & icons
└── data/         # Placeholder for JSON data