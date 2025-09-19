
const cropData = [{
    name: "Wheat",
    soil: ["loamy"],
    water: "medium",
    season: "rabi",
    profit: "High",
    image: "https://images.unsplash.com/photo-1501529309684-4f120b85d10f?auto=format&fit=crop&q=80&w=300",
    description: "Well-suited for loamy soil with medium water availability during Rabi season."
}, {
    name: "Rice",
    soil: ["clay"],
    water: "high",
    season: "kharif",
    profit: "Medium",
    image: "https://images.unsplash.com/photo-1586201375765-7963465eabf7?auto=format&fit=crop&q=80&w=300",
    description: "Requires clay soil with high water availability during Kharif season."
}, {
    name: "Cotton",
    soil: ["sandy", "loamy"],
    water: "medium",
    season: "kharif",
    profit: "High",
    image: "https://images.unsplash.com/photo-1611176279300-5d3aa0283f8b?auto=format&fit=crop&q=80&w=300",
    description: "Grows well in sandy or loamy soil with medium water during Kharif season."
}, {
    name: "Soybean",
    soil: ["loamy"],
    water: "medium",
    season: "kharif",
    profit: "Medium",
    image: "https://images.unsplash.com/photo-1592401013965-6cc7c2e0fdbe?auto=format&fit=crop&q=80&w=300",
    description: "Thrives in loamy soil with medium water during Kharif season."
}, {
    name: "Maize",
    soil: ["sandy", "loamy"],
    water: "medium",
    season: "kharif",
    profit: "Medium",
    image: "https://images.unsplash.com/photo-1626603726340-83199c6e9333?auto=format&fit=crop&q=80&w=300",
    description: "Suitable for sandy or loamy soil with medium water during Kharif season."
}, {
    name: "Pulses",
    soil: ["sandy", "loamy"],
    water: "low",
    season: "rabi",
    profit: "Medium",
    image: "https://images.unsplash.com/photo-1592417817096-5afb8cfc6c6a?auto=format&fit=crop&q=80&w=300",
    description: "Grows well in sandy or loamy soil with low water during Rabi season."
}];


const marketData = [{
    crop: "Wheat",
    price: "₹2,200",
    trend: "up",
    change: "+2.3%"
}, {
    crop: "Rice",
    price: "₹3,100",
    trend: "down",
    change: "-1.5%"
}, {
    crop: "Cotton",
    price: "₹6,500",
    trend: "up",
    change: "+4.2%"
}, {
    crop: "Soybean",
    price: "₹4,800",
    trend: "up",
    change: "+0.8%"
}, {
    crop: "Maize",
    price: "₹1,900",
    trend: "down",
    change: "-2.1%"
}, {
    crop: "Pulses",
    price: "₹7,200",
    trend: "up",
    change: "+3.7%"
}];


const pestData = [{
    name: "Aphids",
    treatment: "Neem oil spray or insecticidal soap",
    prevention: "Introduce beneficial insects like ladybugs, avoid over-fertilizing with nitrogen"
}, {
    name: "Bollworms",
    treatment: "Spinosad or Bacillus thuringiensis (Bt) spray",
    prevention: "Practice crop rotation, use pheromone traps"
}, {
    name: "Leaf Miners",
    treatment: "Remove affected leaves, use neem oil",
    prevention: "Use floating row covers, remove weed hosts"
}, {
    name: "Whiteflies",
    treatment: "Yellow sticky traps, insecticidal soap",
    prevention: "Use reflective mulch, encourage natural enemies"
}, {
    name: "Spider Mites",
    treatment: "Spray plants with water, use miticides if severe",
    prevention: "Maintain high humidity, avoid water stress"
}];

// Face login variables
let stream = null;
let currentUser = null;
let isRegisteringFace = false;

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('agrovisionLoggedIn');
    if (isLoggedIn === 'true') {
        showDashboard();
    }
}


function showAuth(isLogin = false) {
    document.getElementById('main-website').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('auth-section').style.display = 'block';

    if (isLogin) {
        document.getElementById('auth-title').textContent = 'Login to your account';
        document.getElementById('signup-form').querySelector('button[type="submit"]').textContent = 'Login';
        document.getElementById('show-login-link').textContent = 'Create an account';
        document.getElementById('farm-size-container').style.display = 'none';
        document.querySelectorAll('#signup-form > div:not(:last-child)').forEach(el => {
            if (el.id !== 'password' && el.id !== 'email' && !el.querySelector('input[type="password"]')) {
                el.style.display = 'none';
            }
        });
    } else {
        document.getElementById('auth-title').textContent = 'Create your account';
        document.getElementById('signup-form').querySelector('button[type="submit"]').textContent = 'Create Account';
        document.getElementById('show-login-link').textContent = 'Sign in';
        document.querySelectorAll('#signup-form > div').forEach(el => {
            el.style.display = 'block';
        });
      
        if (document.getElementById('user-type').value !== 'farmer') {
            document.getElementById('farm-size-container').style.display = 'none';
        }
    }
}


function showDashboard() {
    document.getElementById('main-website').style.display = 'none';
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';

   
    const userData = localStorage.getItem('agrovisionUser');
    if (userData) {
        const user = JSON.parse(userData);
        document.getElementById('dashboard-username').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('welcome-username').textContent = user.firstName;
    }
}


function initFaceLogin() {
    const faceLoginModal = document.getElementById('face-login-modal');
    const showFaceLoginBtn = document.getElementById('show-face-login');
    const closeFaceLoginBtn = document.getElementById('close-face-login');
    const captureBtn = document.getElementById('capture-btn');
    const retryBtn = document.getElementById('retry-face-login');
    const registerFaceBtn = document.getElementById('register-face');
    const video = document.getElementById('video');

    
    showFaceLoginBtn.addEventListener('click', () => {
        faceLoginModal.classList.remove('hidden');
        startCamera();
    });

  
    closeFaceLoginBtn.addEventListener('click', () => {
        stopCamera();
        faceLoginModal.classList.add('hidden');
        resetFaceLoginUI();
    });

    
    captureBtn.addEventListener('click', () => {
        captureFace();
    });

   
    retryBtn.addEventListener('click', () => {
        resetFaceLoginUI();
        startCamera();
    });

    
    registerFaceBtn.addEventListener('click', () => {
        registerUserFace();
    });
}


async function startCamera() {
    try {
        resetFaceLoginUI();

        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: 300,
                height: 300,
                facingMode: 'user'
            }
        });

        const video = document.getElementById('video');
        video.srcObject = stream;

        document.getElementById('capture-btn').style.display = 'block';
    } catch (err) {
        console.error('Error accessing camera:', err);
        showFaceResult('Error accessing camera. Please check permissions.', false);
    }
}


function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
}


function captureFace() {
    const video = document.getElementById('video');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Stop camera after capture
    stopCamera();

    // Show processing UI
    document.getElementById('capture-btn').style.display = 'none';
    document.getElementById('face-processing').style.display = 'block';

    // Simulate face recognition processing
    setTimeout(() => {
        processFaceRecognition(canvas.toDataURL('image/png'));
    }, 2000);
}

// Process face recognition (simulated)
function processFaceRecognition(imageData) {
   

    document.getElementById('face-processing').style.display = 'none';

   
    if (isRegisteringFace) {
      
        const users = JSON.parse(localStorage.getItem('agrovisionUsers') || '[]');
        const currentUserIndex = users.findIndex(u => u.email === currentUser.email);

        if (currentUserIndex !== -1) {
            users[currentUserIndex].faceData = imageData;
            localStorage.setItem('agrovisionUsers', JSON.stringify(users));

            showFaceResult('Face registered successfully! You can now login with your face.', true);

           
            setTimeout(() => {
                localStorage.setItem('agrovisionLoggedIn', 'true');
                localStorage.setItem('agrovisionUser', JSON.stringify(currentUser));
                document.getElementById('face-login-modal').classList.add('hidden');
                showDashboard();
            }, 1500);
        }

        isRegisteringFace = false;
        return;
    }

   
    const users = JSON.parse(localStorage.getItem('agrovisionUsers') || '[]');
    const userWithFace = users.find(u => u.faceData);

    if (userWithFace) {
        
        showFaceResult('Face recognized! Logging you in...', true);

        // Log the user in
        setTimeout(() => {
            localStorage.setItem('agrovisionLoggedIn', 'true');
            localStorage.setItem('agrovisionUser', JSON.stringify(userWithFace));
            document.getElementById('face-login-modal').classList.add('hidden');
            showDashboard();
        }, 1500);
    } else {
        showFaceResult('No face registered. Please sign up first.', false);
        document.getElementById('retry-face-login').classList.remove('hidden');
    }
}


function showFaceResult(message, isSuccess) {
    const resultElement = document.getElementById('face-result');
    const resultMessage = document.getElementById('face-result-message');

    resultMessage.textContent = message;
    resultElement.classList.add(isSuccess ? 'success' : 'error');
    resultElement.classList.remove(isSuccess ? 'error' : 'success');
    resultElement.style.display = 'block';

    if (!isSuccess) {
        document.getElementById('retry-face-login').classList.remove('hidden');
    }
}


function resetFaceLoginUI() {
    document.getElementById('capture-btn').style.display = 'block';
    document.getElementById('face-processing').style.display = 'none';
    document.getElementById('face-result').style.display = 'none';
    document.getElementById('retry-face-login').classList.add('hidden');
    document.getElementById('register-face').classList.add('hidden');

    const resultElement = document.getElementById('face-result');
    resultElement.classList.remove('success', 'error');
}


function registerUserFace() {
   
    const userData = localStorage.getItem('agrovisionUser');

    if (userData) {
        currentUser = JSON.parse(userData);
        isRegisteringFace = true;
        startCamera();
    } else {
        showFaceResult('Please create an account first.', false);
        document.getElementById('retry-face-login').classList.remove('hidden');
    }
}

// Event listeners
document.getElementById('show-signup').addEventListener('click', function(e) {
    e.preventDefault();
    showAuth(false);
});

document.getElementById('show-login').addEventListener('click', function(e) {
    e.preventDefault();
    showAuth(true);
});

document.getElementById('show-login-link').addEventListener('click', function(e) {
    e.preventDefault();
    const isLogin = this.textContent === 'Sign in';
    showAuth(isLogin);
});

document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('agrovisionLoggedIn');
    localStorage.removeItem('agrovisionUser');
    document.getElementById('main-website').style.display = 'block';
    document.getElementById('dashboard-section').style.display = 'none';
});

document.getElementById('sidebar-logout').addEventListener('click', function() {
    localStorage.removeItem('agrovisionLoggedIn');
    localStorage.removeItem('agrovisionUser');
    document.getElementById('main-website').style.display = 'block';
    document.getElementById('dashboard-section').style.display = 'none';
});


document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const isLogin = document.getElementById('auth-title').textContent === 'Login to your account';

    if (isLogin) {
       
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        
        const users = JSON.parse(localStorage.getItem('agrovisionUsers') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('agrovisionLoggedIn', 'true');
            localStorage.setItem('agrovisionUser', JSON.stringify(user));
            showDashboard();
        } else {
            alert('Invalid email or password');
        }
    } else {
      
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const terms = document.getElementById('terms').checked;

        
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            alert('Please fill in all required fields');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (!terms) {
            alert('You must agree to the terms and conditions');
            return;
        }

       
        const userData = {
            firstName,
            lastName,
            email,
            password,
            userType: document.getElementById('user-type').value,
            location: document.getElementById('location').value,
            farmSize: document.getElementById('farm-size').value || null
        };

        let users = JSON.parse(localStorage.getItem('agrovisionUsers') || '[]');

        // Check if email already exists
        if (users.some(user => user.email === email)) {
            alert('Email already registered. Please login instead.');
            showAuth(true);
            return;
        }

        users.push(userData);
        localStorage.setItem('agrovisionUsers', JSON.stringify(users));
        localStorage.setItem('agrovisionLoggedIn', 'true');
        localStorage.setItem('agrovisionUser', JSON.stringify(userData));

        showDashboard();
    }
});

// Password visibility toggle
document.getElementById('toggle-password').addEventListener('click', function() {
    const passwordField = document.getElementById('password');
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    this.querySelector('i').classList.toggle('fa-eye');
    this.querySelector('i').classList.toggle('fa-eye-slash');
});

document.getElementById('toggle-confirm-password').addEventListener('click', function() {
    const confirmPasswordField = document.getElementById('confirm-password');
    const type = confirmPasswordField.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPasswordField.setAttribute('type', type);
    this.querySelector('i').classList.toggle('fa-eye');
    this.querySelector('i').classList.toggle('fa-eye-slash');
});


document.getElementById('user-type').addEventListener('change', function() {
    if (this.value === 'farmer') {
        document.getElementById('farm-size-container').style.display = 'block';
    } else {
        document.getElementById('farm-size-container').style.display = 'none';
    }
});


document.querySelectorAll('a[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');

        
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        link.classList.add('active');

        
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');

        // If market prices section, render chart
        if (sectionId === 'market-prices') {
            renderMarketChart();
            renderPriceTable();
        }
    });
});


document.getElementById('crop-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const soilType = document.getElementById('soil-type').value;
    const waterAvailability = document.getElementById('water-availability').value;
    const season = document.getElementById('season').value;

    if (!soilType || !waterAvailability || !season) {
        alert('Please fill all fields');
        return;
    }

    // Find matching crops
    const matchedCrops = cropData.filter(crop =>
        crop.soil.includes(soilType) &&
        crop.water === waterAvailability &&
        crop.season === season
    );

    const resultsContainer = document.getElementById('recommendation-results');
    const cropsList = document.getElementById('crops-list');

    // Clear previous results
    cropsList.innerHTML = '';

    if (matchedCrops.length === 0) {
        cropsList.innerHTML = '<p class="text-center col-span-2 py-4">No crops match your criteria. Please try different parameters.</p>';
    } else {
        matchedCrops.forEach(crop => {
            const cropCard = document.createElement('div');
            cropCard.className = 'bg-gray-50 p-4 rounded-lg';
            cropCard.innerHTML = `
                        <img src="${crop.image}" alt="${crop.name}" class="w-full h-32 object-cover rounded-lg mb-2 crop-image">
                        <h4 class="font-bold text-lg">${crop.name}</h4>
                        <p class="text-sm text-gray-600 mb-2">Profit Potential: <span class="font-semibold">${crop.profit}</span></p>
                        <p class="text-sm">${crop.description}</p>
                    `;
            cropsList.appendChild(cropCard);
        });
    }

    resultsContainer.classList.remove('hidden');

    // Store results for PDF generation
    localStorage.setItem('cropRecommendations', JSON.stringify({
        soilType,
        waterAvailability,
        season,
        crops: matchedCrops
    }));
});


document.getElementById('analyze-pest').addEventListener('click', () => {
    const fileInput = document.getElementById('pest-image');

    if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please select an image first');
        return;
    }

  
    const randomPest = pestData[Math.floor(Math.random() * pestData.length)];
    const randomConfidence = (85 + Math.floor(Math.random() * 10)) + '%';

    document.getElementById('pest-name').textContent = randomPest.name;
    document.getElementById('pest-confidence').textContent = randomConfidence;
    document.getElementById('pest-treatment').textContent = randomPest.treatment;
    document.getElementById('pest-prevention').textContent = randomPest.prevention;

    document.getElementById('pest-results').classList.remove('hidden');
});


function renderMarketChart() {
    const ctx = document.getElementById('price-chart').getContext('2d');

    // Sample data for the chart
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Wheat (₹/qtl)',
            data: [2100, 2150, 2200, 2180, 2220, 2250],
            borderColor: '#16a34a',
            backgroundColor: 'rgba(22, 163, 74, 0.1)',
            fill: true,
            tension: 0.4
        }, {
            label: 'Rice (₹/qtl)',
            data: [3000, 3100, 3050, 3080, 3150, 3100],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Commodity Price Trends (Last 6 Months)'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Price (₹/Quintal)'
                    }
                }
            }
        }
    };

  
    if (window.priceChartInstance) {
        window.priceChartInstance.destroy();
    }

    window.priceChartInstance = new Chart(ctx, config);
}

// Market price table
function renderPriceTable() {
    const tableBody = document.getElementById('price-table');
    tableBody.innerHTML = '';

    marketData.forEach(item => {
        const row = document.createElement('tr');
        const trendIcon = item.trend === 'up' ? '↑' : '↓';
        const trendColor = item.trend === 'up' ? 'text-green-600' : 'text-red-600';

        row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">${item.crop}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${item.price}</td>
                    <td class="px-6 py-4 whitespace-nowrap ${trendColor}">${trendIcon}</td>
                    <td class="px-6 py-4 whitespace-nowrap ${trendColor}">${item.change}</td>
                `;

        tableBody.appendChild(row);
    });
}


document.getElementById('get-weather').addEventListener('click', () => {
    const location = document.getElementById('weather-location').value.trim();

    if (!location) {
        alert('Please enter a location');
        return;
    }

  

    const weatherData = {
        city: location,
        date: new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        temp: Math.floor(Math.random() * 15) + 25 + '°C', // Random temp between 25-40°C
        desc: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40) + 30 + '%', // 30-70%
        wind: (Math.random() * 10).toFixed(1) + ' km/h',
        rain: Math.floor(Math.random() * 30) + '%',
        pressure: (1000 + Math.floor(Math.random() * 20)) + ' hPa'
    };

    // Update weather display
    document.getElementById('weather-city').textContent = weatherData.city;
    document.getElementById('weather-date').textContent = weatherData.date;
    document.getElementById('weather-temp').textContent = weatherData.temp;
    document.getElementById('weather-desc').textContent = weatherData.desc;
    document.getElementById('weather-humidity').textContent = weatherData.humidity;
    document.getElementById('weather-wind').textContent = weatherData.wind;
    document.getElementById('weather-rain').textContent = weatherData.rain;
    document.getElementById('weather-pressure').textContent = weatherData.pressure;

    // Set appropriate weather icon
    const iconMap = {
        'Sunny': '01d',
        'Partly Cloudy': '02d',
        'Cloudy': '03d',
        'Light Rain': '10d'
    };

    const iconCode = iconMap[weatherData.desc] || '01d';
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Generate forecast
    const forecastContainer = document.getElementById('weather-forecast');
    forecastContainer.innerHTML = '';

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    days.forEach(day => {
        const forecastTemp = Math.floor(Math.random() * 15) + 20; // 20-35°C
        const forecastDesc = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)];
        const forecastIconCode = iconMap[forecastDesc] || '01d';

        const forecastItem = document.createElement('div');
        forecastItem.className = 'text-center bg-gray-50 p-3 rounded-lg';
        forecastItem.innerHTML = `
                    <p class="font-semibold">${day}</p>
                    <img src="https://openweathermap.org/img/wn/${forecastIconCode}.png" alt="${forecastDesc}" class="mx-auto my-2">
                    <p class="text-lg font-bold">${forecastTemp}°C</p>
                    <p class="text-sm text-gray-600">${forecastDesc}</p>
                `;

        forecastContainer.appendChild(forecastItem);
    });

    document.getElementById('weather-results').classList.remove('hidden');
});


document.getElementById('download-pdf').addEventListener('click', () => {
   
    alert('PDF report generation would be implemented here with jsPDF. This would include the crop recommendations and market price information.');

   
});


document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initFaceLogin();

    
    if (document.getElementById('user-type').value !== 'farmer') {
        document.getElementById('farm-size-container').style.display = 'none';
    }

  
    renderMarketChart();
    renderPriceTable();
});
