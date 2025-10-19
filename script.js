// Global variables
let map;
let userLocation = null;
let selectedShelter = null;
let strayReports = [];
let currentSection = 'home';

// Sample data
const shelters = [
    {
        id: 1,
        name: "BARC Houston",
        address: "3200 Carr St, Houston, TX 77026",
        phone: "(713) 229-7300",
        coords: [29.7604, -95.3698],
        capacity: 50
    },
    {
        id: 2,
        name: "Friends For Life",
        address: "107 E 22nd St, Houston, TX 77008",
        phone: "(713) 863-9835",
        coords: [29.7984, -95.4019],
        capacity: 30
    },
    {
        id: 3,
        name: "Houston Pets Alive",
        address: "2800 Antoine Dr, Houston, TX 77092",
        phone: "(713) 862-3863",
        coords: [29.8018, -95.4565],
        capacity: 25
    },
    {
        id: 4,
        name: "SPCA of Texas - Houston",
        address: "900 Portway Dr, Houston, TX 77024",
        phone: "(713) 869-7722",
        coords: [29.7849, -95.4565],
        capacity: 40
    }
];

const samplePets = [
    {
        id: 1,
        name: "Buddy",
        species: "dog",
        breed: "Golden Retriever",
        age: "adult",
        gender: "Male",
        description: "Friendly and energetic, loves playing fetch",
        image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop",
        shelter: "BARC Houston",
        location: "Houston, TX"
    },
    {
        id: 2,
        name: "Luna",
        species: "cat",
        breed: "Siamese Mix",
        age: "adult",
        gender: "Female",
        description: "Calm and affectionate, perfect lap cat",
        image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=200&fit=crop",
        shelter: "Friends For Life",
        location: "Houston, TX"
    },
    {
        id: 3,
        name: "Max",
        species: "dog",
        breed: "Labrador Mix",
        age: "puppy",
        gender: "Male",
        description: "Playful puppy, great with kids",
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=200&fit=crop",
        shelter: "Houston Pets Alive",
        location: "Houston, TX"
    },
    {
        id: 4,
        name: "Whiskers",
        species: "cat",
        breed: "Maine Coon",
        age: "senior",
        gender: "Male",
        description: "Gentle senior cat, very calm",
        image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=300&h=200&fit=crop",
        shelter: "SPCA of Texas",
        location: "Houston, TX"
    },
    {
        id: 5,
        name: "Daisy",
        species: "dog",
        breed: "Beagle Mix",
        age: "adult",
        gender: "Female",
        description: "Sweet and gentle, loves walks",
        image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&h=200&fit=crop",
        shelter: "BARC Houston",
        location: "Houston, TX"
    },
    {
        id: 6,
        name: "Shadow",
        species: "cat",
        breed: "Black Domestic",
        age: "adult",
        gender: "Male",
        description: "Independent and curious",
        image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=300&h=200&fit=crop",
        shelter: "Friends For Life",
        location: "Houston, TX"
    }
];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    initializeMap();
    getCurrentLocation();
    setupEventListeners();
    loadStrayReports();
    displayPets();
    setupNotifications();
}

// Navigation functions
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const actionCards = document.querySelectorAll('.action-card');

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');
            showSection(targetSection);
            updateActiveNav(link);
        });
    });

    // Handle action card clicks
    actionCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetSection = card.getAttribute('data-section');
            showSection(targetSection);
            updateActiveNav(document.querySelector(`[data-section="${targetSection}"]`));
        });
    });
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;

        // Initialize section-specific features
        if (sectionId === 'report') {
            loadNearbyShelters();
        } else if (sectionId === 'adopt') {
            displayPets();
        }
    }
}

function updateActiveNav(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Map functions
function initializeMap() {
    map = L.map('map').setView([29.7604, -95.3698], 11);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    addShelterMarkers();
}

function addShelterMarkers() {
    shelters.forEach(shelter => {
        const shelterIcon = L.divIcon({
            className: 'shelter-marker',
            html: '🏥',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        L.marker(shelter.coords, { icon: shelterIcon })
            .addTo(map)
            .bindPopup(`
                <strong>${shelter.name}</strong><br>
                ${shelter.address}<br>
                📞 ${shelter.phone}<br>
                Capacity: ${shelter.capacity} animals
            `);
    });
}

function addStrayReportMarkers() {
    strayReports.forEach((report, index) => {
        const pawIcon = L.divIcon({
            className: 'paw-marker',
            html: '🐾',
            iconSize: [25, 25],
            iconAnchor: [12, 12]
        });
        
        L.marker([report.lat, report.lng], { icon: pawIcon })
            .addTo(map)
            .bindPopup(`
                <strong>Stray Animal Report</strong><br>
                ${report.description}<br>
                <small>Reported: ${new Date(report.timestamp).toLocaleDateString()}</small>
            `);
    });
}

// Location functions
function getCurrentLocation() {
    const locationStatus = document.getElementById('locationStatus');
    const locationText = document.getElementById('locationText');
    
    if (navigator.geolocation) {
        locationText.innerHTML = '<span class="loading-spinner"></span> Getting your location...';
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                map.setView([userLocation.lat, userLocation.lng], 13);
                
                const userIcon = L.divIcon({
                    className: 'user-marker',
                    html: '📍',
                    iconSize: [25, 25],
                    iconAnchor: [12, 12]
                });
                
                L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
                    .addTo(map)
                    .bindPopup('Your Location');
                
                locationStatus.className = 'location-status success';
                locationText.innerHTML = `✅ Location found: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`;
                
                addStrayReportMarkers();
            },
            function(error) {
                locationStatus.className = 'location-status error';
                locationText.innerHTML = '❌ Unable to get location. Please enable location services.';
                console.error('Geolocation error:', error);
            }
        );
    } else {
        locationStatus.className = 'location-status error';
        locationText.innerHTML = '❌ Geolocation not supported by this browser.';
    }
}

// Event listeners
function setupEventListeners() {
    // Report form
    document.getElementById('useLocationBtn').addEventListener('click', useCurrentLocation);
    document.getElementById('reportForm').addEventListener('submit', submitReport);
    document.getElementById('photoInput').addEventListener('change', handlePhotoPreview);
    document.getElementById('descriptionInput').addEventListener('input', validateReportForm);

    // Volunteer and donation modals
    document.getElementById('volunteerSignupBtn').addEventListener('click', () => openModal('volunteerModal'));
    document.getElementById('donateBtn').addEventListener('click', () => openModal('donationModal'));
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Pet filters
    document.getElementById('speciesFilter').addEventListener('change', filterPets);
    document.getElementById('ageFilter').addEventListener('change', filterPets);

    // Donation amount change
    document.getElementById('donationAmount').addEventListener('change', handleDonationAmountChange);

    // Form submissions
    document.getElementById('volunteerForm').addEventListener('submit', submitVolunteerApplication);
    document.getElementById('donationForm').addEventListener('submit', processDonation);

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
}

// Report functions
function loadNearbyShelters() {
    const shelterSelection = document.getElementById('shelterSelection');
    
    if (!userLocation) {
        shelterSelection.innerHTML = '<p>❌ Location required to find nearby shelters</p>';
        return;
    }
    
    shelterSelection.innerHTML = '<h4>Select a shelter to send this report to:</h4><div class="shelter-grid"></div>';
    const shelterGrid = shelterSelection.querySelector('.shelter-grid');
    
    shelters.forEach(shelter => {
        const distance = calculateDistance(userLocation.lat, userLocation.lng, shelter.coords[0], shelter.coords[1]);
        const shelterCard = document.createElement('div');
        shelterCard.className = 'shelter-card';
        shelterCard.innerHTML = `
            <h4>${shelter.name}</h4>
            <p>${shelter.address}</p>
            <p>📞 ${shelter.phone}</p>
            <p class="distance">📍 ${distance.toFixed(1)} miles away</p>
        `;
        
        shelterCard.addEventListener('click', () => selectShelter(shelter, shelterCard));
        shelterGrid.appendChild(shelterCard);
    });
}

function selectShelter(shelter, cardElement) {
    document.querySelectorAll('.shelter-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    cardElement.classList.add('selected');
    selectedShelter = shelter;
    validateReportForm();
}

function useCurrentLocation() {
    if (userLocation) {
        document.getElementById('locationInput').value = `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`;
        validateReportForm();
    } else {
        showNotification('Location not available. Please try again.', 'error');
    }
}

function handlePhotoPreview(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('photoPreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 10px;">`;
        };
        reader.readAsDataURL(file);
    }
    validateReportForm();
}

function validateReportForm() {
    const photo = document.getElementById('photoInput').files[0];
    const description = document.getElementById('descriptionInput').value.trim();
    const submitBtn = document.getElementById('submitReportBtn');
    
    if (photo && description && selectedShelter) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

function submitReport(e) {
    e.preventDefault();
    
    const photo = document.getElementById('photoInput').files[0];
    const description = document.getElementById('descriptionInput').value.trim();
    const location = document.getElementById('locationInput').value;
    
    if (!photo || !description || !selectedShelter) {
        showNotification('Please fill in all required fields and select a shelter.', 'error');
        return;
    }
    
    const newReport = {
        id: Date.now(),
        photo: URL.createObjectURL(photo),
        description: description,
        location: location,
        lat: userLocation.lat,
        lng: userLocation.lng,
        shelter: selectedShelter.name,
        timestamp: new Date().toISOString()
    };
    
    strayReports.unshift(newReport);
    addStrayReportMarkers();
    saveStrayReports();
    
    showNotification(`Report submitted successfully to ${selectedShelter.name}!`, 'success');
    document.getElementById('reportForm').reset();
    document.getElementById('photoPreview').innerHTML = '';
    selectedShelter = null;
    validateReportForm();
}

// Pet adoption functions
function displayPets() {
    const petsGrid = document.getElementById('petsGrid');
    const filteredPets = getFilteredPets();
    
    petsGrid.innerHTML = filteredPets.map(pet => `
        <div class="pet-card">
            <div class="pet-image">
                <img src="${pet.image}" alt="${pet.name}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            </div>
            <div class="pet-info">
                <h3>${pet.name}</h3>
                <p class="pet-breed">${pet.breed}</p>
                <p class="pet-details">${pet.age} • ${pet.gender}</p>
                <p class="pet-description">${pet.description}</p>
                <div class="pet-location">
                    <span>📍 ${pet.shelter}</span>
                </div>
                <button class="btn-primary adopt-btn" onclick="adoptPet(${pet.id})">
                    Adopt ${pet.name}
                </button>
            </div>
        </div>
    `).join('');
}

function getFilteredPets() {
    const speciesFilter = document.getElementById('speciesFilter').value;
    const ageFilter = document.getElementById('ageFilter').value;
    
    return samplePets.filter(pet => {
        const speciesMatch = !speciesFilter || pet.species === speciesFilter;
        const ageMatch = !ageFilter || pet.age === ageFilter;
        return speciesMatch && ageMatch;
    });
}

function filterPets() {
    displayPets();
}

function adoptPet(petId) {
    const pet = samplePets.find(p => p.id === petId);
    if (pet) {
        showNotification(`Thank you for your interest in adopting ${pet.name}! We'll contact you soon.`, 'success');
    }
}

// Volunteer and donation functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function handleDonationAmountChange() {
    const amount = document.getElementById('donationAmount').value;
    const customAmount = document.getElementById('customAmount');
    
    if (amount === 'custom') {
        customAmount.style.display = 'block';
        customAmount.required = true;
    } else {
        customAmount.style.display = 'none';
        customAmount.required = false;
    }
}

function submitVolunteerApplication(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    showNotification('Thank you for your volunteer application! We\'ll contact you soon.', 'success');
    closeAllModals();
    e.target.reset();
}

function processDonation(e) {
    e.preventDefault();
    
    const amount = document.getElementById('donationAmount').value;
    const customAmount = document.getElementById('customAmount').value;
    const shelter = document.getElementById('donationShelter').value;
    
    const donationAmount = amount === 'custom' ? customAmount : amount;
    
    showNotification(`Thank you for your $${donationAmount} donation!`, 'success');
    closeAllModals();
    e.target.reset();
}

// Notification system
function setupNotifications() {
    // Show a sample notification after 3 seconds
    setTimeout(() => {
        showNotification('Heavy rain expected — check local shelters for emergency needs!', 'warning');
    }, 3000);
}

function showNotification(message, type = 'info') {
    const banner = document.getElementById('notificationBanner');
    const text = document.getElementById('notificationText');
    
    banner.className = `notification-banner ${type}`;
    text.textContent = message;
    banner.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        banner.style.display = 'none';
    }, 5000);
}

// Utility functions
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function loadStrayReports() {
    const saved = localStorage.getItem('pawconnect-reports');
    if (saved) {
        strayReports = JSON.parse(saved);
    }
}

function saveStrayReports() {
    localStorage.setItem('pawconnect-reports', JSON.stringify(strayReports));
}

// Close notification
document.getElementById('closeNotification').addEventListener('click', () => {
    document.getElementById('notificationBanner').style.display = 'none';
});
