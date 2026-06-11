// Campus locations
const places = [
  // 🏠 Hostels
  { name: "Amaravathi", category: "Hostel", desc: "Girls Hostel for VCEW Students", lat: 11.359229, lng: 77.943978 },
  { name: "Ganga", category: "Hostel", desc: "Girls Hostel near VCEW", lat: 11.361103, lng: 77.945171 },
  { name: "Kaveri", category: "Hostel", desc: "Girls Hostel close to VCEW campus", lat: 11.358611, lng: 77.941805 },
  { name: "Bhavani", category: "Hostel", desc: "Girls Hostel for Engineering Students", lat: 11.359266, lng: 77.943440 },
  { name: "Siruvani", category: "Hostel", desc: "Girls Hostel with mess and facilities", lat: 11.359142, lng: 77.944309 },

  // 🍽️ Canteens
  { name: "VCTW Canteen", category: "Canteen", desc: "Kaveri block", lat: 11.358482, lng: 77.951829 },
  { name: "VCEW Canteen", category: "Canteen", desc: "Main Canteen", lat: 11.359122, lng: 77.943972 },
  { name: "VICAS Canteen", category: "Canteen", desc: "Arts and Science College Canteen", lat: 11.361470, lng: 77.945208 },

  // 🧑‍🏫 Departments
  { name: "CSE Department", category: "Department", desc: "Computer Science and Engineering Department", lat: 11.357829, lng: 77.941849 },
  { name: "CST Department", category: "Department", desc: "Computer Science and Technology Department", lat: 11.358344, lng: 77.944998 },
  { name: "ECE Department", category: "Department", desc: "Electronics and Communication Engineering Department", lat: 11.357736, lng: 77.941098 },
  { name: "EEE Department", category: "Department", desc: "Electrical and Electronics Engineering Department", lat: 11.357813, lng: 77.941042 },
  { name: "CIVIL Department", category: "Department", desc: "Civil Engineering Department", lat: 11.358001, lng: 77.941428 },
  { name: "IT Department", category: "Department", desc: "Information Technology Department", lat: 11.357366, lng: 77.941881 },
  { name: "BME Department", category: "Department", desc: "Biomedical Engineering Department", lat: 11.358344, lng: 77.944998 },
  { name: "IDEA LAB", category: "Department", desc: "Innovation and Design Lab for projects", lat: 11.358344, lng: 77.944998 },
  { name: "BIOTECH Department", category: "Department", desc: "Biotechnology Department", lat: 11.358151, lng: 77.944787 },
  { name: "PT Room", category: "Department", desc: "Physical Training Room for Sports Students", lat: 11.358170, lng: 77.943164 },

  // 📚 Libraries
  { name: "VICAS Library", category: "Library", desc: "Central Library", lat: 11.358995, lng: 77.946042 },
  { name: "VCEW Library", category: "Library", desc: "Main Library", lat: 11.357490, lng: 77.943533 },

  // 🛍️ Shops
  { name: "VICAS XEROX SHOP", category: "Shop", desc: "Photocopy and printing services near VICAS", lat: 11.359296, lng: 77.944678 },
  { name: "PARLOUR", category: "Shop", desc: "Salon", lat: 11.361030, lng: 77.945158 },
  { name: "VCEW XEROX SHOP", category: "Shop", desc: "Xerox near VCEW", lat: 11.357940, lng: 77.943246 },
  { name: "Xerox shop", category: "Shop", desc: "Xerox shop near entrance", lat: 11.361570, lng: 77.946069 },

  // 🚻 Facilities
  { name: "Washroom", category: "Washroom", desc: "Common washroom near main block", lat: 11.359157, lng: 77.944411 },
  { name: "Transport office", category: "Transport", desc: "Transport Office for bus-related queries", lat: 11.359040, lng: 77.944816 },

  // 🏟️ Other Areas
  { name: "Indoor stadium", category: "Stadium", desc: "Indoor sports stadium", lat: 11.359188, lng: 77.943259 },
  { name: "Auditorium", category: "Auditorium", desc: "Main Auditorium for events", lat: 11.358552, lng: 77.943136 },
  { name: "Main seminar hall", category: "Hall", desc: "Seminar Hall for presentations and programs", lat: 11.357600, lng: 77.944381 },

  // 🎓 Colleges
  { name: "VCEW College", category: "College", desc: "Vivekanandha College of Engineering for Women", lat: 11.357470, lng: 77.943975 },
  { name: "VIMS College", category: "College", desc: "Vivekanandha Institute of Management Studies", lat: 11.357537, lng: 77.942500 },
  { name: "VICAS", category: "College", desc: "Vivekanandha College of Arts and Science for Women", lat: 11.359492, lng: 77.944796 }
];
let searchMarker = null;
let routingControl = null;
let userMarker = null;

// 🛰️ Initialize Leaflet map with satellite tiles
const map = L.map("map").setView([11.3593, 77.946], 17);

L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map);

// 📍 Render category-wise places
function renderCategory(cat) {
  const listDiv = document.querySelector(".place-list");
  listDiv.innerHTML = "";
  let filtered = cat === "All" ? places : places.filter(p => p.category.toLowerCase() === cat.toLowerCase());

  filtered.forEach(p => {
    const btn = document.createElement("button");
    btn.textContent = p.name;
    btn.onclick = () => highlightPlace(p);
    listDiv.appendChild(btn);
  });
}

// 📌 Highlight a selected place
function highlightPlace(p) {
  if (searchMarker) map.removeLayer(searchMarker);
  if (routingControl) map.removeControl(routingControl);

  searchMarker = L.circleMarker([p.lat, p.lng], {
    radius: 12,
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.6
  }).addTo(map);

  map.setView([p.lat, p.lng], 18);
  L.popup().setLatLng([p.lat, p.lng]).setContent(`<b>${p.name}</b><br>${p.desc}`).openOn(map);

  // 🧭 Draw route from live user to place (if user marker exists)
  if (userMarker) {
    routingControl = L.Routing.control({
      waypoints: [userMarker.getLatLng(), L.latLng(p.lat, p.lng)],
      createMarker: () => null,
      lineOptions: { styles: [{ color: "blue", weight: 5 }] },
      routeWhileDragging: false
    }).addTo(map);
  }
}

// 🧭 Handle category button clicks
document.querySelectorAll(".category-btn").forEach(btn => {
  btn.addEventListener("click", () => renderCategory(btn.dataset.category));
});

// 🔍 Search functionality
document.getElementById("searchBtn").addEventListener("click", () => {
  const q = document.getElementById("searchBox").value.toLowerCase();
  const found = places.find(p => p.name.toLowerCase().includes(q));
  if (found) highlightPlace(found);
  else alert("Place not found!");
});

// 📱 Live location tracking
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    if (userMarker) {
      userMarker.setLatLng([lat, lng]);
    } else {
      userMarker = L.marker([lat, lng], {
        icon: L.icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
          iconSize: [30, 30]
        })
      }).addTo(map).bindPopup("📍 You are here").openPopup();
    }
  }, 
  err => alert("Please enable location access to use live navigation."));
}

// 🏁 Initial render
renderCategory("All");

// 📱 Sidebar toggle (mobile view)
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebar = document.getElementById("sidebar");
sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("show");
});