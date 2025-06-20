document.addEventListener('DOMContentLoaded', function() {
    // Automatic slider logic for index.html
    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
      const images = [document.getElementById('bg1'), document.getElementById('bg2'), document.getElementById('bg3')];
      const dots = [document.getElementById('dot1'), document.getElementById('dot2'), document.getElementById('dot3')];
      let current = 0;
      let intervalId;

      function showSlide(index) {
        images.forEach((img, i) => {
          img.style.opacity = i === index ? '0.9' : '0';
          dots[i].classList.toggle('bg-orange-500', i === index);
          dots[i].classList.toggle('bg-gray-400', i !== index);
        });
        current = index;
      }

      function nextSlide() {
        let next = (current + 1) % images.length;
        showSlide(next);
      }

      // Start automatic sliding every 10 seconds
      intervalId = setInterval(nextSlide, 3000);

      // Optional: Pause on hover, resume on mouse leave
      heroSection.addEventListener('mouseenter', () => {
        clearInterval(intervalId);
      });
      heroSection.addEventListener('mouseleave', () => {
        intervalId = setInterval(nextSlide, 3000);
      });

      // Initialize first slide
      showSlide(0);
    }

    // Mobile menu toggle logic (used in all pages)
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }

    // User page login/signup/profile logic

    // Toggle login/signup/profile forms
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const authSection = document.getElementById('auth-section');
    const profileSection = document.getElementById('profile-section');
    const profileName = document.getElementById('profile-name');
    const signoutBtn = document.getElementById('signout-btn');

    // Helper: Save login state
    function setLoggedIn(name) {
      localStorage.setItem('lc_logged_in', '1');
      if (name) localStorage.setItem('lc_profile_name', name);
    }
    function setLoggedOut() {
      localStorage.removeItem('lc_logged_in');
      localStorage.removeItem('lc_profile_name');
    }
    function getProfileName() {
      return localStorage.getItem('lc_profile_name') || 'User';
    }

    // Save multiple users for login (array of user objects in localStorage)
    function saveUser(user) {
      let users = JSON.parse(localStorage.getItem('lc_users') || '[]');
      users.push(user);
      localStorage.setItem('lc_users', JSON.stringify(users));
    }

    function findUserByEmailOrPhone(identifier) {
      let users = JSON.parse(localStorage.getItem('lc_users') || '[]');
      const trimmed = identifier.trim();
      // Try to match as email (case-insensitive) or phone (ignore spaces, leading zeros)
      return users.find(u => {
        // Email match (case-insensitive, trimmed)
        if (u.email && u.email.trim().toLowerCase() === trimmed.toLowerCase()) return true;
        // Phone match (ignore spaces, leading zeros)
        if (u.phone) {
          const inputPhone = trimmed.replace(/\s+/g, '').replace(/^0+/, '');
          const userPhone = u.phone.trim().replace(/\s+/g, '').replace(/^0+/, '');
          if (inputPhone === userPhone) return true;
        }
        return false;
      });
    }

    // Show sign up form
    if (showSignup && showLogin && loginForm && signupForm) {
      showSignup.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        document.getElementById('main-title').textContent = 'Sign Up';
      });
      showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        document.getElementById('main-title').textContent = 'Login';
      });
    }

    // Show profile section after sign up
    if (signupForm) {
      signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Password match check
        const password = signupForm.querySelector('input[placeholder="Password"]').value;
        const confirmPassword = signupForm.querySelector('input[placeholder="Confirm password"]').value;
        if (password !== confirmPassword) {
          let error = signupForm.querySelector('.signup-error');
          if (!error) {
            error = document.createElement('div');
            error.className = 'signup-error text-red-500 text-sm w-full text-center mt-2';
            signupForm.appendChild(error);
          }
          error.textContent = "Passwords do not match.";
          return;
        } else {
          let error = signupForm.querySelector('.signup-error');
          if (error) error.textContent = "";
        }

        if (authSection && profileSection) {
          authSection.classList.add('hidden');
          profileSection.classList.remove('hidden');
        }
        // Get values from sign up form
        const firstName = signupForm.querySelector('input[placeholder="First name"]').value;
        const lastName = signupForm.querySelector('input[placeholder="Last name"]').value;
        const fullName = (firstName + ' ' + lastName).trim();
        const phone = signupForm.querySelector('input[placeholder="Phone number"]').value;
        const email = signupForm.querySelector('input[placeholder="Email"]').value;
        const city = signupForm.querySelector('#city-select') ? signupForm.querySelector('#city-select').value : '';
        const street = signupForm.querySelector('#street-input') ? signupForm.querySelector('#street-input').value : '';
        const location = signupForm.querySelector('#location-input') ? signupForm.querySelector('#location-input').value : '';

        if (profileName) profileName.textContent = fullName;
        setLoggedIn(fullName);

        // Save extra info to localStorage (for profile display)
        localStorage.setItem('lc_profile_phone', phone);
        localStorage.setItem('lc_profile_email', email);
        localStorage.setItem('lc_profile_password', password);
        localStorage.setItem('lc_profile_location', location);
        localStorage.setItem('lc_profile_city', city);
        localStorage.setItem('lc_profile_street', street);

        // Save user for login (array)
        saveUser({
          name: fullName,
          phone,
          email,
          password,
          city,
          street,
          location
        });
        updateProfileHeaderAddress && updateProfileHeaderAddress();
      });
    }

    // Show profile section after login
    if (loginForm) {
      // Add or get error message element
      let loginError = loginForm.querySelector('.login-error');
      if (!loginError) {
        loginError = document.createElement('div');
        loginError.className = 'login-error text-red-500 text-sm w-full text-center mt-2';
        loginForm.appendChild(loginError);
      }

      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Get login values
        const userInput = loginForm.querySelector('input[type="text"]').value;
        const passwordInput = loginForm.querySelector('input[type="password"]').value;
        const user = findUserByEmailOrPhone(userInput);

        if (user && user.password === passwordInput) {
          loginError.textContent = '';
          if (authSection && profileSection) {
            authSection.classList.add('hidden');
            profileSection.classList.remove('hidden');
          }
          if (profileName) profileName.textContent = user.name;
          setLoggedIn(user.name);

          // Update profile info for display
          localStorage.setItem('lc_profile_phone', user.phone);
          localStorage.setItem('lc_profile_email', user.email);
          localStorage.setItem('lc_profile_password', user.password);
          localStorage.setItem('lc_profile_location', user.location);
          localStorage.setItem('lc_profile_city', user.city);
          localStorage.setItem('lc_profile_street', user.street || '');
        } else {
          loginError.textContent = 'Invalid email/phone number or password.';
        }
      });
    }

    // Sign out returns to login
    if (signoutBtn) {
      signoutBtn.addEventListener('click', function() {
        if (profileSection && authSection && loginForm && signupForm) {
          profileSection.classList.add('hidden');
          authSection.classList.remove('hidden');
          loginForm.classList.remove('hidden');
          signupForm.classList.add('hidden');
          document.getElementById('main-title').textContent = 'Login';
          setLoggedOut();
        }
      });
    }

    // On page load, check login state
    if (authSection && profileSection && profileName) {
      if (localStorage.getItem('lc_logged_in') === '1') {
        authSection.classList.add('hidden');
        profileSection.classList.remove('hidden');
        profileName.textContent = getProfileName();
      }
    }


    // Simple Security list logic
    const securityMenuItem = document.getElementById('security-menu-item');
    const securitySimpleList = document.getElementById('security-simple-list');
    const profileMenuList = document.getElementById('profile-menu-list');
    const closeSecuritySimple = document.getElementById('close-security-simple');
    const backArrow = document.getElementById('back-arrow');

    if (securityMenuItem && securitySimpleList && profileMenuList) {
      securityMenuItem.addEventListener('click', function() {
        profileMenuList.classList.add('hidden');
        securitySimpleList.classList.remove('hidden');
      });
    }
    if (closeSecuritySimple && securitySimpleList && profileMenuList) {
      closeSecuritySimple.addEventListener('click', function() {
        securitySimpleList.classList.add('hidden');
        profileMenuList.classList.remove('hidden');
      });
    }

    // Profile details logic
    const profileDetailArrow = document.getElementById('profile-detail-arrow');
    const profileDetails = document.getElementById('profile-details');
    const profileMenuSection = document.getElementById('profile-menu-section');
    const detailFullname = document.getElementById('detail-fullname');
    const detailPhone = document.getElementById('detail-phone');
    const detailEmail = document.getElementById('detail-email');
    const detailCity = document.getElementById('detail-city');
    const detailStreet = document.getElementById('detail-street');
    const detailLocation = document.getElementById('detail-location');
    const detailPayment = document.getElementById('detail-payment');

    if (profileDetailArrow && profileDetails && profileMenuSection) {
      profileDetailArrow.addEventListener('click', function() {
        profileMenuSection.classList.add('hidden');
        profileDetails.classList.remove('hidden');
        // Update details from storage
        if (detailFullname) detailFullname.textContent = localStorage.getItem('lc_profile_name') || '';
        if (detailPhone) detailPhone.textContent = localStorage.getItem('lc_profile_phone') || '';
        if (detailEmail) detailEmail.textContent = localStorage.getItem('lc_profile_email') || '';
        if (detailCity) detailCity.textContent = localStorage.getItem('lc_profile_city') || '';
        if (detailStreet) detailStreet.textContent = localStorage.getItem('lc_profile_street') || '';
        if (detailLocation) detailLocation.textContent = localStorage.getItem('lc_profile_location') || '';
        if (detailPayment) detailPayment.textContent = localStorage.getItem('lc_profile_payment') || 'Visa **** 1234';
      });
    }

    // Back arrow context-aware logic for all pages
    if (backArrow) {
      backArrow.addEventListener('click', function(e) {
        // If security menu is open, just go back to profile menu
        if (securitySimpleList && profileMenuList && !securitySimpleList.classList.contains('hidden')) {
          securitySimpleList.classList.add('hidden');
          profileMenuList.classList.remove('hidden');
        }
        // If profile details is open, go back to profile menu
        else if (profileDetails && profileMenuSection && !profileDetails.classList.contains('hidden')) {
          profileDetails.classList.add('hidden');
          profileMenuSection.classList.remove('hidden');
        }
        // Otherwise, go back in browser history
        else {
          window.history.back();
        }
      });
    }
    // Leaflet map for manual location selection
    const mapSelectDiv = document.getElementById('map-select');
    const locationInput = document.getElementById('location-input');
    const citySelect = document.getElementById('city-select');
    let leafletMap, leafletMarker;

    // City coordinates for Cambodia's provinces/cities
    const cityCoords = {
      "Phnom Penh": [11.562108, 104.888535],
      "Banteay Meanchey": [13.5850, 102.9731],
      "Battambang": [13.0957, 103.2022],
      "Kampong Cham": [12.0000, 105.4500],
      "Kampong Chhnang": [12.2500, 104.6667],
      "Kampong Speu": [11.4500, 104.5200],
      "Kampong Thom": [12.7111, 104.8886],
      "Kampot": [10.6106, 104.1810],
      "Kandal": [11.4833, 104.9500],
      "Kep": [10.4820, 104.3167],
      "Koh Kong": [11.6150, 102.9836],
      "Kratie": [12.4881, 106.0187],
      "Mondulkiri": [12.7876, 107.1012],
      "Oddar Meanchey": [14.1600, 103.5000],
      "Pailin": [12.8500, 102.7500],
      "Preah Vihear": [13.8000, 104.9833],
      "Prey Veng": [11.4833, 105.3250],
      "Pursat": [12.5333, 103.9167],
      "Ratanakiri": [13.7367, 106.9872],
      "Siem Reap": [13.3622, 103.8597],
      "Preah Sihanouk": [10.6278, 103.5221],
      "Stung Treng": [13.5259, 105.9683],
      "Svay Rieng": [11.0872, 105.7994],
      "Takeo": [10.9908, 104.7850],
      "Tboung Khmum": [12.1226, 105.4507]
    };

    if (mapSelectDiv && locationInput) {
      // Only initialize map when sign up form is shown
      let mapInitialized = false;
      function initMap(center) {
        if (!mapInitialized) {
          leafletMap = L.map(mapSelectDiv).setView(center, 14);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(leafletMap);

          leafletMarker = null;

          leafletMap.on('click', function(e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            locationInput.value = lat + ', ' + lng;
            if (leafletMarker) {
              leafletMarker.setLatLng([lat, lng]);
            } else {
              leafletMarker = L.marker([lat, lng]).addTo(leafletMap);
            }
          });
          mapInitialized = true;
        } else {
          leafletMap.setView(center, 14);
          if (leafletMarker) {
            leafletMarker.setLatLng(center);
          }
        }
      }

      // When sign up form is shown, initialize map to Phnom Penh
      if (showSignup) {
        showSignup.addEventListener('click', function() {
          setTimeout(function() {
            initMap(cityCoords["Phnom Penh"]);
          }, 200);
        });
      }

      // When city is selected, move map to that city
      if (citySelect) {
        citySelect.addEventListener('change', function() {
          const city = citySelect.value;
          if (cityCoords[city]) {
            initMap(cityCoords[city]);
          }
        });
      }
    }

    // Update city and street in profile header on profile show
    function updateProfileHeaderAddress() {
      const city = localStorage.getItem('lc_profile_city') || '';
      const street = localStorage.getItem('lc_profile_street') || '';
      const el = document.getElementById('profile-city-street');
      if (el) {
        if (city || street) {
          el.textContent = [street, city].filter(Boolean).join(', ');
        } else {
          el.textContent = ' No address provided';
        }
      }
    }

    // Call updateProfileHeaderAddress when profile section is shown
    if (authSection && profileSection) {
      // On login
      if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
          // ...existing code...
          if (user && user.password === passwordInput) {
            // ...existing code...
            updateProfileHeaderAddress();
          }
          // ...existing code...
        });
      }
      // On signup
      if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
          // ...existing code...
          updateProfileHeaderAddress();
        });
      }
      // On page load if already logged in
      if (localStorage.getItem('lc_logged_in') === '1') {
        updateProfileHeaderAddress();
      }
    }

    // Change phone, password, email logic
    const changePhoneItem = document.getElementById('change-phone-item');
    const changePhoneModal = document.getElementById('change-phone-modal');
    const newPhoneInput = document.getElementById('new-phone-input');
    const savePhoneBtn = document.getElementById('save-phone-btn');
    const cancelPhoneBtn = document.getElementById('cancel-phone-btn');
    const phoneError = document.getElementById('phone-error');

    const changePasswordItem = document.getElementById('change-password-item');
    const changePasswordModal = document.getElementById('change-password-modal');
    const oldPasswordInput = document.getElementById('old-password-input');
    const newPasswordInput = document.getElementById('new-password-input');
    const confirmPasswordInput = document.getElementById('confirm-password-input');
    const savePasswordBtn = document.getElementById('save-password-btn');
    const cancelPasswordBtn = document.getElementById('cancel-password-btn');
    const passwordError = document.getElementById('password-error');

    const changeEmailItem = document.getElementById('change-email-item');
    const changeEmailModal = document.getElementById('change-email-modal');
    const newEmailInput = document.getElementById('new-email-input');
    const saveEmailBtn = document.getElementById('save-email-btn');
    const cancelEmailBtn = document.getElementById('cancel-email-btn');
    const emailError = document.getElementById('email-error');

    // Change address logic
    const changeAddressItem = document.getElementById('change-address-item');
    const changeAddressModal = document.getElementById('change-address-modal');
    const modalCitySelect = document.getElementById('modal-city-select');
    const modalStreetInput = document.getElementById('modal-street-input');
    const modalLocationInput = document.getElementById('modal-location-input');
    const modalMapSelect = document.getElementById('modal-map-select');
    const saveAddressBtn = document.getElementById('save-address-btn');
    const cancelAddressBtn = document.getElementById('cancel-address-btn');
    const addressError = document.getElementById('address-error');
    let modalLeafletMap, modalLeafletMarker;

    // City coordinates for modal map (reuse cityCoords)
    // ...cityCoords already defined above...

    if (changeAddressItem && changeAddressModal) {
      changeAddressItem.addEventListener('click', function() {
        changeAddressModal.classList.remove('hidden');
        addressError.textContent = '';
        modalCitySelect.value = localStorage.getItem('lc_profile_city') || '';
        modalStreetInput.value = localStorage.getItem('lc_profile_street') || '';
        modalLocationInput.value = localStorage.getItem('lc_profile_location') || '';
        setTimeout(function() {
          // Initialize or reset modal map
          let center = cityCoords[modalCitySelect.value] || cityCoords["Phnom Penh"];
          if (!modalLeafletMap) {
            modalLeafletMap = L.map(modalMapSelect).setView(center, 14);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap contributors'
            }).addTo(modalLeafletMap);
            modalLeafletMap.on('click', function(e) {
              const lat = e.latlng.lat;
              const lng = e.latlng.lng;
              modalLocationInput.value = lat + ', ' + lng;
              if (modalLeafletMarker) {
                modalLeafletMarker.setLatLng([lat, lng]);
              } else {
                modalLeafletMarker = L.marker([lat, lng]).addTo(modalLeafletMap);
              }
            });
          }
          modalLeafletMap.setView(center, 14);
          if (modalLeafletMarker) {
            modalLeafletMarker.setLatLng(center);
          }
        }, 200);
      });

      if (modalCitySelect) {
        modalCitySelect.addEventListener('change', function() {
          const city = modalCitySelect.value;
          if (cityCoords[city] && modalLeafletMap) {
            modalLeafletMap.setView(cityCoords[city], 14);
            if (modalLeafletMarker) {
              modalLeafletMarker.setLatLng(cityCoords[city]);
            }
          }
        });
      }

      cancelAddressBtn.addEventListener('click', function() {
        changeAddressModal.classList.add('hidden');
      });

      saveAddressBtn.addEventListener('click', function() {
        const city = modalCitySelect.value;
        const street = modalStreetInput.value.trim();
        const location = modalLocationInput.value.trim();
        if (!city || !street || !location) {
          addressError.textContent = 'All fields are required.';
          return;
        }
        // Update user in lc_users
        updateCurrentUserField('city', city);
        updateCurrentUserField('street', street);
        updateCurrentUserField('location', location);
        addressError.textContent = '';
        changeAddressModal.classList.add('hidden');
        updateProfileHeaderAddress && updateProfileHeaderAddress();
      });
    }

    // Utility: update user in lc_users array
    function updateCurrentUserField(field, value) {
      let users = JSON.parse(localStorage.getItem('lc_users') || '[]');
      const currentEmail = localStorage.getItem('lc_profile_email');
      const currentPhone = localStorage.getItem('lc_profile_phone');
      let user = users.find(u =>
        (u.email && u.email.trim().toLowerCase() === currentEmail?.trim().toLowerCase()) ||
        (u.phone && u.phone.trim() === currentPhone?.trim())
      );
      if (user) {
        user[field] = value;
        localStorage.setItem('lc_users', JSON.stringify(users));
      }
      // Also update localStorage for profile display
      if (field === 'phone') localStorage.setItem('lc_profile_phone', value);
      if (field === 'email') localStorage.setItem('lc_profile_email', value);
      if (field === 'password') localStorage.setItem('lc_profile_password', value);
    }

    // Change phone
    if (changePhoneItem && changePhoneModal) {
      changePhoneItem.addEventListener('click', function() {
        changePhoneModal.classList.remove('hidden');
        phoneError.textContent = '';
        newPhoneInput.value = '';
      });
      cancelPhoneBtn.addEventListener('click', function() {
        changePhoneModal.classList.add('hidden');
      });
      savePhoneBtn.addEventListener('click', function() {
        const phone = newPhoneInput.value.trim();
        if (!phone) {
          phoneError.textContent = 'Phone number required.';
          return;
        }
        updateCurrentUserField('phone', phone);
        phoneError.textContent = '';
        changePhoneModal.classList.add('hidden');
        updateProfileHeaderAddress && updateProfileHeaderAddress();
      });
    }

    // Change password
    if (changePasswordItem && changePasswordModal) {
      changePasswordItem.addEventListener('click', function() {
        changePasswordModal.classList.remove('hidden');
        passwordError.textContent = '';
        oldPasswordInput.value = '';
        newPasswordInput.value = '';
        confirmPasswordInput.value = '';
      });
      cancelPasswordBtn.addEventListener('click', function() {
        changePasswordModal.classList.add('hidden');
      });
      savePasswordBtn.addEventListener('click', function() {
        const oldPass = oldPasswordInput.value;
        const newPass = newPasswordInput.value;
        const confirmPass = confirmPasswordInput.value;
        const currentPass = localStorage.getItem('lc_profile_password') || '';
        if (!oldPass || !newPass || !confirmPass) {
          passwordError.textContent = 'All fields required.';
          return;
        }
        if (oldPass !== currentPass) {
          passwordError.textContent = 'Current password is incorrect.';
          return;
        }
        if (newPass !== confirmPass) {
          passwordError.textContent = 'New passwords do not match.';
          return;
        }
        updateCurrentUserField('password', newPass);
        passwordError.textContent = '';
        changePasswordModal.classList.add('hidden');
      });
    }

    // Change email
    if (changeEmailItem && changeEmailModal) {
      changeEmailItem.addEventListener('click', function() {
        changeEmailModal.classList.remove('hidden');
        emailError.textContent = '';
        newEmailInput.value = '';
      });
      cancelEmailBtn.addEventListener('click', function() {
        changeEmailModal.classList.add('hidden');
      });
      saveEmailBtn.addEventListener('click', function() {
        const email = newEmailInput.value.trim();
        if (!email) {
          emailError.textContent = 'Email required.';
          return;
        }
        // Simple email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          emailError.textContent = 'Invalid email format.';
          return;
        }
        updateCurrentUserField('email', email);
        emailError.textContent = '';
        changeEmailModal.classList.add('hidden');
      });
    }

    // --- Animated Header Search Bar Logic (icon slides left, shared for all pages) ---
    (function() {
      const searchBtn = document.getElementById('search-btn');
      const searchBar = document.getElementById('header-search-bar');
      const searchInput = document.getElementById('header-search-input');
      const headerSearchContainer = document.getElementById('header-search-container');

      if (searchBtn && searchBar && searchInput && headerSearchContainer) {
        // Menu items data (add more as needed)
        const menuItems = [
          // Pizza items (examples, add more as needed)
          { name: "Chicken Caldo", link: "pizza.html#Classic-pizza-section" },
          { name: "Double Cheese", link: "pizza.html#Classic-pizza-section" },
          { name: "Double Pepperoni", link: "pizza.html#Classic-pizza-section" },
          { name: "Ham & Mushroom", link: "pizza.html#Classic-pizza-section" },
          { name: "Cheesy Roasted Garlic & Spinach", link: "pizza.html#Classic-pizza-section" },
          { name: "Classic Mushroom & Tomato", link: "pizza.html#Classic-pizza-section" },
          { name: "Super Deluxe", link: "pizza.html#Deluxe-pizza-section" },
          { name: "Hawaiian", link: "pizza.html#Deluxe-pizza-section" },
          { name: "Canadian Bacon", link: "pizza.html#Deluxe-pizza-section" },
          { name: "BBQ Chicken Deluxe", link: "pizza.html#Deluxe-pizza-section" },
          { name: "Meat Deluxe", link: "pizza.html#Deluxe-pizza-section" },
          { name: "Italain Deluxe", link: "pizza.html#Deluxe-pizza-section" },
          { name: "BBQ Pork Deluxe", link: "pizza.html#Deluxe-pizza-section" },
          { name: "Seafood Deluxe", link: "pizza.html#Seafood-deluxe-section" },
          { name: "Shrimp Cocktail", link: "pizza.html#Seafood-deluxe-section" },
          { name: "Prawn & Ham", link: "pizza.html#Seafood-deluxe-section" },
          { name: "Seafood Cocktail", link: "pizza.html#Seafood-deluxe-section" },
          { name: "Tom Yum Kung", link: "pizza.html#Seafood-deluxe-section" },
          { name: "Tropical Seafood", link: "pizza.html#Seafood-deluxe-section" }
        ];

        // Create dropdown for results (black background)
        let resultDropdown = document.createElement('ul');
        resultDropdown.id = "header-search-results";
        resultDropdown.className = "absolute left-0 top-full mt-1 w-full bg-black rounded shadow-lg z-50 border border-gray-700 max-h-64 overflow-y-auto divide-y divide-gray-800 text-white hidden";
        searchBar.appendChild(resultDropdown);

        let searchActive = false;

        function showSearchBar() {
          searchBtn.style.display = 'none';
          searchBar.classList.remove('w-0', 'overflow-hidden');
          searchBar.classList.add('w-96', 'pr-12');
          setTimeout(() => {
            searchInput.classList.remove('opacity-0', 'w-0', 'px-0');
            searchInput.classList.add('opacity-100', 'w-full', 'px-4');
            searchInput.value = '';
            resultDropdown.innerHTML = '';
            resultDropdown.classList.add('hidden');
            searchInput.focus();
            searchActive = true;
          }, 200);
        }
        function hideSearchBar() {
          searchBar.classList.remove('w-96', 'pr-12');
          searchBar.classList.add('w-0', 'overflow-hidden');
          searchInput.classList.add('opacity-0', 'w-0', 'px-0');
          searchInput.classList.remove('opacity-100', 'w-full', 'px-4');
          resultDropdown.classList.add('hidden');
          searchActive = false;
          setTimeout(() => {
            searchBtn.style.display = '';
          }, 300);
        }

        searchBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          if (!searchActive) {
            showSearchBar();
          } else {
            hideSearchBar();
          }
        });

        // Hide search bar if click outside
        document.addEventListener('mousedown', function(e) {
          if (searchBar && !searchBar.contains(e.target) && e.target !== searchBtn) {
            hideSearchBar();
          }
        });

        // Search logic (case-insensitive)
        searchInput.addEventListener('input', function() {
          const q = searchInput.value.trim().toLowerCase();
          resultDropdown.innerHTML = '';
          if (!q) {
            resultDropdown.classList.add('hidden');
            return;
          }
          const found = menuItems.filter(item => item.name.toLowerCase().includes(q));
          if (found.length === 0) {
            resultDropdown.innerHTML = '<li class="py-2 text-gray-400 text-center">No results found.</li>';
          } else {
            found.forEach(item => {
              const li = document.createElement('li');
              li.className = "py-2 px-2 hover:bg-orange-500 hover:text-white cursor-pointer";
              li.innerHTML = `<a href="${item.link}" class="block w-full">${item.name}</a>`;
              resultDropdown.appendChild(li);
            });
          }
          resultDropdown.classList.remove('hidden');
        });

        // Optional: Enter key on input selects first result
        searchInput.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
            const first = resultDropdown.querySelector('a');
            if (first) {
              window.location.href = first.getAttribute('href');
            }
          }
        });
      }
    })();

    // --- Cart logic and fly-to-cart animation (global, reusable) ---

    window.addToCart = function(item, imgElem) {
      // Use lcCart global object if available, else fallback to localStorage
      if (window.lcCart && typeof window.lcCart.addItem === "function") {
        window.lcCart.addItem(item, imgElem);
      } else {
        let cart = [];
        try {
          cart = JSON.parse(localStorage.getItem('lcCart')) || [];
        } catch (e) {}
        let found = false;
        for (let i = 0; i < cart.length; i++) {
          if (cart[i].name === item.name) {
            cart[i].qty += 1;
            found = true;
            break;
          }
        }
        if (!found) cart.push(item);
        localStorage.setItem('lcCart', JSON.stringify(cart));
      }
      if (imgElem) {
        window.animateFlyToCart(imgElem);
      }
    };

    window.animateFlyToCart = function(imgElem) {
      // Find the cart icon in header (desktop)
      var cartIcon = document.querySelector('a[href="cart.html"] i.fas.fa-shopping-cart');
      if (!cartIcon) return;

      // Get bounding rectangles
      var imgRect = imgElem.getBoundingClientRect();
      var cartRect = cartIcon.getBoundingClientRect();

      // Create a clone image
      var clone = imgElem.cloneNode(true);
      clone.style.position = 'fixed';
      clone.style.left = imgRect.left + 'px';
      clone.style.top = imgRect.top + 'px';
      clone.style.width = imgRect.width + 'px';
      clone.style.height = imgRect.height + 'px';
      clone.style.zIndex = 9999;
      clone.style.pointerEvents = 'none';
      clone.style.transition = 'all 0.8s cubic-bezier(.4,2,.6,1)';
      document.body.appendChild(clone);

      // Force reflow
      void clone.offsetWidth;

      // Animate to cart
      clone.style.left = (cartRect.left + cartRect.width/2 - imgRect.width/4) + 'px';
      clone.style.top = (cartRect.top + cartRect.height/2 - imgRect.height/4) + 'px';
      clone.style.width = imgRect.width/2 + 'px';
      clone.style.height = imgRect.height/2 + 'px';
      clone.style.opacity = '0.5';

      setTimeout(function() {
        clone.remove();
      }, 900);
    };

    // --- Mobile Search Dropdown Logic (shared for all pages) ---
    (function() {
      // Example menu items (add more as needed)
      var menuItems = [
        { name: "Chicken Caldo", link: "pizza.html#Classic-pizza-section" },
        { name: "Double Cheese", link: "pizza.html#Classic-pizza-section" },
        { name: "Double Pepperoni", link: "pizza.html#Classic-pizza-section" },
        { name: "Ham & Mushroom", link: "pizza.html#Classic-pizza-section" },
        { name: "Cheeses Burger", link: "burger.html#beef-burger-section" },
        { name: "Super Set burger", link: "#" },
        // ...add more items as needed...
      ];

      function setupMobileSearchDropdown() {
        var searchBtnMobile = document.getElementById('search-btn-mobile');
        var mobileSearchDropdown = document.getElementById('mobile-search-dropdown');
        var mobileSearchInput = document.getElementById('mobile-search-input');
        var mobileSearchResults = document.getElementById('mobile-search-results');

        if (searchBtnMobile && mobileSearchDropdown && mobileSearchInput && mobileSearchResults) {
          searchBtnMobile.addEventListener('click', function(e) {
            e.preventDefault();
            mobileSearchDropdown.classList.toggle('hidden');
            mobileSearchInput.value = '';
            mobileSearchResults.innerHTML = '';
            mobileSearchResults.classList.add('hidden');
            mobileSearchInput.focus();
          });

          // Hide dropdown if click outside
          document.addEventListener('mousedown', function(e) {
            if (!mobileSearchDropdown.contains(e.target) && e.target !== searchBtnMobile) {
              mobileSearchDropdown.classList.add('hidden');
            }
          });

          // Search logic
          mobileSearchInput.addEventListener('input', function() {
            var q = mobileSearchInput.value.trim().toLowerCase();
            mobileSearchResults.innerHTML = '';
            if (!q) {
              mobileSearchResults.classList.add('hidden');
              return;
            }
            var found = menuItems.filter(item => item.name.toLowerCase().includes(q));
            if (found.length === 0) {
              mobileSearchResults.innerHTML = '<li class="py-2 text-gray-400 text-center">No results found.</li>';
            } else {
              found.forEach(item => {
                var li = document.createElement('li');
                li.className = "py-2 px-2 hover:bg-orange-500 hover:text-white cursor-pointer";
                li.innerHTML = `<a href="${item.link}" class="block w-full">${item.name}</a>`;
                mobileSearchResults.appendChild(li);
              });
            }
            mobileSearchResults.classList.remove('hidden');
          });

          // Enter key selects first result
          mobileSearchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
              var first = mobileSearchResults.querySelector('a');
              if (first) {
                window.location.href = first.getAttribute('href');
              }
            }
          });
        }
      }
      if (document.readyState === "loading") {
        document.addEventListener('DOMContentLoaded', setupMobileSearchDropdown);
      } else {
        setupMobileSearchDropdown();
      }
    })();
  });