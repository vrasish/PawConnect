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
        email: "info@barchouston.org",
        coords: [29.7604, -95.3698],
        capacity: 50
    },
    {
        id: 2,
        name: "Friends For Life",
        address: "107 E 22nd St, Houston, TX 77008",
        phone: "(713) 863-9835",
        email: "info@friendsforlife.org",
        coords: [29.7984, -95.4019],
        capacity: 30
    },
    {
        id: 3,
        name: "Houston Pets Alive",
        address: "2800 Antoine Dr, Houston, TX 77092",
        phone: "(713) 862-3863",
        email: "info@houstonpetsalive.org",
        coords: [29.8018, -95.4565],
        capacity: 25
    },
    {
        id: 4,
        name: "SPCA of Texas - Houston",
        address: "900 Portway Dr, Houston, TX 77024",
        phone: "(713) 869-7722",
        email: "houston@spca.org",
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
        description: "Friendly and energetic, loves playing fetch. Great with children and other pets.",
        image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face",
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
        description: "Calm and affectionate, perfect lap cat. Loves cuddles and quiet environments.",
        image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop&crop=face",
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
        description: "Playful puppy, great with kids. Needs training and lots of exercise.",
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=face",
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
        description: "Gentle senior cat, very calm. Perfect for quiet homes and senior citizens.",
        image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&h=300&fit=crop&crop=face",
        shelter: "SPCA of Texas - Houston",
        location: "Houston, TX"
    },
    {
        id: 5,
        name: "Daisy",
        species: "dog",
        breed: "Beagle Mix",
        age: "adult",
        gender: "Female",
        description: "Sweet and gentle, loves walks. Great family dog, house-trained.",
        image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop&crop=face",
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
        description: "Independent and curious. Loves to explore and play with toys.",
        image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=300&fit=crop&crop=face",
        shelter: "Friends For Life",
        location: "Houston, TX"
    },
    {
        id: 7,
        name: "Bella",
        species: "dog",
        breed: "Pit Bull Mix",
        age: "adult",
        gender: "Female",
        description: "Loving and loyal companion. Great with experienced dog owners.",
        image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face",
        shelter: "Houston Pets Alive",
        location: "Houston, TX"
    },
    {
        id: 8,
        name: "Mittens",
        species: "cat",
        breed: "Tabby Mix",
        age: "puppy",
        gender: "Female",
        description: "Adorable kitten, very playful and social. Needs a loving family.",
        image: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=400&h=300&fit=crop&crop=face",
        shelter: "SPCA of Texas - Houston",
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
        
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
        };
        
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
                showNotification('Location services enabled successfully!', 'success');
            },
            function(error) {
                let errorMessage = '❌ Unable to get location. ';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Please allow location access in your browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out.';
                        break;
                    default:
                        errorMessage += 'An unknown error occurred.';
                        break;
                }
                
                locationStatus.className = 'location-status error';
                locationText.innerHTML = errorMessage;
                
                // Show manual location input option
                locationText.innerHTML += '<br><button onclick="showManualLocationInput()" class="btn-secondary" style="margin-top: 10px;">Enter Location Manually</button>';
                
                console.error('Geolocation error:', error);
            },
            options
        );
    } else {
        locationStatus.className = 'location-status error';
        locationText.innerHTML = '❌ Geolocation not supported by this browser. <br><button onclick="showManualLocationInput()" class="btn-secondary" style="margin-top: 10px;">Enter Location Manually</button>';
    }
}

function showManualLocationInput() {
    const location = prompt('Please enter your location (e.g., "Houston, TX" or "29.7604, -95.3698"):');
    if (location) {
        // Try to parse as coordinates first
        const coords = location.split(',').map(c => parseFloat(c.trim()));
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
            userLocation = { lat: coords[0], lng: coords[1] };
        } else {
            // Use geocoding service (simplified - in real app, use proper geocoding API)
            userLocation = { lat: 29.7604, lng: -95.3698 }; // Default to Houston
        }
        
        map.setView([userLocation.lat, userLocation.lng], 13);
        document.getElementById('locationStatus').className = 'location-status success';
        document.getElementById('locationText').innerHTML = `✅ Location set: ${location}`;
        addStrayReportMarkers();
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
    
    // Send real contact information
    contactShelter(selectedShelter, newReport);
    
    showNotification(`Report submitted successfully to ${selectedShelter.name}! Check your email for confirmation.`, 'success');
    document.getElementById('reportForm').reset();
    document.getElementById('photoPreview').innerHTML = '';
    selectedShelter = null;
    validateReportForm();
}

function contactShelter(shelter, report) {
    // Create email content
    const subject = `Stray Animal Report - ${new Date().toLocaleDateString()}`;
    const body = `
Stray Animal Report Details:

Description: ${report.description}
Location: ${report.location}
Coordinates: ${report.lat}, ${report.lng}
Reported: ${new Date(report.timestamp).toLocaleString()}

Please contact the shelter directly:
📞 Phone: ${shelter.phone}
📍 Address: ${shelter.address}

Thank you for helping animals in need!
    `.trim();
    
    // Create mailto link
    const mailtoLink = `mailto:${shelter.email || 'info@' + shelter.name.toLowerCase().replace(/\s+/g, '') + '.org'}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.open(mailtoLink);
    
    // Also show contact info
    showNotification(`Contact ${shelter.name} at ${shelter.phone} or visit ${shelter.address}`, 'info');
}

// Pet adoption functions
function displayPets() {
    const petsGrid = document.getElementById('petsGrid');
    const filteredPets = getFilteredPets();
    
    petsGrid.innerHTML = filteredPets.map(pet => `
        <div class="pet-card">
            <div class="pet-image">
                <img src="${pet.image}" alt="${pet.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iNTAiIGZpbGw9IiNEOUQ5RDkiLz4KPHN2ZyB4PSIxNzUiIHk9IjEyNSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IiM5OTk5OTkiPgo8cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTQgMC0yLjIxLTEuNzktNC00LTQtMi4yMSAwLTQgMS43OS00IDQgMCAyLjIxIDEuNzkgNCA0IDR6bTAgMmMtMi42NyAwLTggMS4zNC04IDR2MmgxNnYtMmMwLTIuNjYtNS4zMy00LTgtNHoiLz4KPC9zdmc+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5OTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkltYWdlIENvbWluZyBTb29uPC90ZXh0Pgo8L3N2Zz4K'">
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
        // Find the shelter for this pet
        const shelter = shelters.find(s => s.name === pet.shelter);
        
        if (shelter) {
            // Create adoption inquiry email
            const subject = `Adoption Inquiry for ${pet.name}`;
            const body = `
Hello,

I am interested in adopting ${pet.name} (${pet.breed}, ${pet.age}, ${pet.gender}).

Pet Details:
- Name: ${pet.name}
- Breed: ${pet.breed}
- Age: ${pet.age}
- Gender: ${pet.gender}
- Description: ${pet.description}

Please contact me to discuss the adoption process.

Thank you!
            `.trim();
            
            // Create mailto link
            const mailtoLink = `mailto:${shelter.email || 'adoptions@' + shelter.name.toLowerCase().replace(/\s+/g, '') + '.org'}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Open email client
            window.open(mailtoLink);
            
            showNotification(`Contact ${shelter.name} at ${shelter.phone} for adoption details about ${pet.name}!`, 'success');
        } else {
            showNotification(`Thank you for your interest in adopting ${pet.name}! Contact the shelter directly.`, 'success');
        }
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
    
    // Create volunteer application email
    const subject = `Volunteer Application - ${data.volunteerName}`;
    const body = `
Volunteer Application Details:

Name: ${data.volunteerName}
Email: ${data.volunteerEmail}
Phone: ${data.volunteerPhone}
Interests: ${Array.from(data.volunteerInterests).join(', ')}

Please contact this volunteer to discuss opportunities.

Thank you!
    `.trim();
    
    // Send to general contact email
    const mailtoLink = `mailto:volunteers@pawconnect.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
    
    showNotification('Volunteer application sent! Check your email for next steps.', 'success');
    closeAllModals();
    e.target.reset();
}

function processDonation(e) {
    e.preventDefault();
    
    const amount = document.getElementById('donationAmount').value;
    const customAmount = document.getElementById('customAmount').value;
    const shelter = document.getElementById('donationShelter').value;
    
    const donationAmount = amount === 'custom' ? customAmount : amount;
    
    // Find shelter info
    const shelterInfo = shelters.find(s => s.name.toLowerCase().includes(shelter.toLowerCase())) || 
                       { name: 'General Fund', phone: '(713) 555-0123', address: 'Houston, TX' };
    
    // Create donation email
    const subject = `Donation Inquiry - $${donationAmount}`;
    const body = `
Donation Details:

Amount: $${donationAmount}
Designated to: ${shelterInfo.name}
Phone: ${shelterInfo.phone}
Address: ${shelterInfo.address}

Please contact me to process this donation.

Thank you for supporting animal rescue!
    `.trim();
    
    // Send to donation email
    const mailtoLink = `mailto:donations@pawconnect.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
    
    showNotification(`Donation inquiry sent! Contact ${shelterInfo.name} at ${shelterInfo.phone} to complete your $${donationAmount} donation.`, 'success');
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
