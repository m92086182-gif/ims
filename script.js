// بيانات التخزين
let numberRequests = JSON.parse(localStorage.getItem('numberRequests')) || [];
let userRequests = JSON.parse(localStorage.getItem('userRequests')) || [];
let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
let countries = JSON.parse(localStorage.getItem('countries')) || [
    { name: 'مصر', flag: 'https://flagcdn.com/w320/eg.png' },
    { name: 'السعودية', flag: 'https://flagcdn.com/w320/sa.png' },
    { name: 'الإمارات', flag: 'https://flagcdn.com/w320/ae.png' },
    { name: 'الكويت', flag: 'https://flagcdn.com/w320/kw.png' },
    { name: 'عمان', flag: 'https://flagcdn.com/w320/om.png' },
    { name: 'قطر', flag: 'https://flagcdn.com/w320/qa.png' },
    { name: 'البحرين', flag: 'https://flagcdn.com/w320/bh.png' },
    { name: 'الأردن', flag: 'https://flagcdn.com/w320/jo.png' }
];

// نظام إدارة الجلسات
class SessionManager {
    constructor() {
        this.sessionKey = 'ims_admin_session';
        this.sessionTimeout = 24 * 60 * 60 * 1000;
    }

    isLoggedIn() {
        try {
            const session = this.getSession();
            if (!session) return false;
            if (Date.now() - session.loginTime > this.sessionTimeout) {
                this.logout();
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    login(username, password) {
        const validCredentials = {
            username: 'Mohamed77ngq',
            password: 'Mohamed77ngq'
        };

        if (username === validCredentials.username && password === validCredentials.password) {
            const session = {
                loggedIn: true,
                username: username,
                loginTime: Date.now()
            };
            localStorage.setItem(this.sessionKey, JSON.stringify(session));
            return true;
        }
        return false;
    }

    logout() {
        localStorage.removeItem(this.sessionKey);
    }

    getSession() {
        try {
            return JSON.parse(localStorage.getItem(this.sessionKey));
        } catch (e) {
            return null;
        }
    }
}

const sessionManager = new SessionManager();

// تهيئة الموقع
document.addEventListener('DOMContentLoaded', function() {
    initializeSite();
    setupEventListeners();
    loadInitialData();
});

function initializeSite() {
    // تهيئة البيانات إذا لم تكن موجودة
    if (!localStorage.getItem('countries')) {
        localStorage.setItem('countries', JSON.stringify(countries));
    }
}

function setupEventListeners() {
    // القائمة المنزلقة للموبايل
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileCloseBtn = document.querySelector('.mobile-close-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // إغلاق القائمة عند النقر على رابط
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // النماذج
    const orderNumbersForm = document.getElementById('orderNumbersForm');
    const orderUserForm = document.getElementById('orderUserForm');

    if (orderNumbersForm) {
        orderNumbersForm.addEventListener('submit', handleNumberOrder);
    }

    if (orderUserForm) {
        orderUserForm.addEventListener('submit', handleUserOrder);
    }

    // التنقل السلس
    setupSmoothScrolling();
}

function loadInitialData() {
    updateCountrySelect();
    updateCountriesGrid();
    updateNotificationCount();
}

// تحديث قائمة الدول
function updateCountrySelect() {
    const countrySelect = document.getElementById('country');
    if (countrySelect) {
        countrySelect.innerHTML = '<option value="">اختر الدولة</option>';
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.name;
            option.textContent = country.name;
            countrySelect.appendChild(option);
        });
    }
}

// تحديث شبكة الدول
function updateCountriesGrid() {
    const countriesGrid = document.getElementById('countriesGrid');
    if (countriesGrid) {
        countriesGrid.innerHTML = '';
        countries.forEach(country => {
            const countryCard = document.createElement('div');
            countryCard.className = 'country-card';
            countryCard.innerHTML = `
                <div class="country-flag" style="background-image: url('${country.flag}')"></div>
                <div class="country-name">${country.name}</div>
            `;
            countriesGrid.appendChild(countryCard);
        });
    }
}

// معالجة طلب الأرقام
function handleNumberOrder(e) {
    e.preventDefault();
    
    const country = document.getElementById('country').value;
    const quantity = document.getElementById('quantity').value;
    const username = document.getElementById('username').value;
    const statusElement = document.getElementById('orderNumbersStatus');
    
    if (!country || !quantity || !username) {
        showStatus(statusElement, 'يرجى ملء جميع الحقول', false);
        return;
    }
    
    const request = {
        country,
        quantity,
        username,
        timestamp: new Date().toISOString(),
        status: 'قيد التنفيذ'
    };
    
    numberRequests.push(request);
    localStorage.setItem('numberRequests', JSON.stringify(numberRequests));
    
    showStatus(statusElement, 'تم تقديم طلبك وهو قيد التنفيذ', true);
    e.target.reset();
    
    // إضافة إشعار
    addNotification(`طلب جديد للأرقام: ${country} - ${quantity} رقم`, username);
}

// معالجة طلب المستخدم
function handleUserOrder(e) {
    e.preventDefault();
    
    const binaryName = document.getElementById('binaryName').value;
    const whatsappNumber = document.getElementById('whatsappNumber').value;
    const statusElement = document.getElementById('orderUserStatus');
    
    if (!binaryName || !whatsappNumber) {
        showStatus(statusElement, 'يرجى ملء جميع الحقول', false);
        return;
    }
    
    const request = {
        binaryName,
        whatsappNumber,
        timestamp: new Date().toISOString(),
        status: 'قيد التنفيذ'
    };
    
    userRequests.push(request);
    localStorage.setItem('userRequests', JSON.stringify(userRequests));
    
    showStatus(statusElement, 'تم تقديم طلبك وهو قيد التنفيذ', true);
    e.target.reset();
    
    // إضافة إشعار
    addNotification(`طلب حساب جديد: ${binaryName}`, whatsappNumber);
}

// إضافة إشعار
function addNotification(title, message) {
    const notification = {
        id: Date.now(),
        title,
        message,
        time: new Date().toLocaleString('ar-EG'),
        read: false
    };
    
    notifications.push(notification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    updateNotificationCount();
}

// تحديث عداد الإشعارات
function updateNotificationCount() {
    const notificationBadge = document.querySelector('.notification-badge');
    if (notificationBadge) {
        const unreadCount = notifications.filter(n => !n.read).length;
        notificationBadge.textContent = unreadCount;
        notificationBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

// إظهار رسالة حالة
function showStatus(element, message, isSuccess) {
    if (element) {
        element.textContent = message;
        element.className = `status-message ${isSuccess ? 'success' : 'error'}`;
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

// التنقل السلس
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// تحديث إحصائيات الهيرو
function updateHeroStats() {
    const totalOrders = numberRequests.length + userRequests.length;
    const completedOrders = [...numberRequests, ...userRequests].filter(req => req.status === 'مكتمل').length;
    
    // يمكنك تحديث الإحصائيات هنا إذا أردت
}

// تحسينات للأجهزة المحمولة
function setupMobileOptimizations() {
    // منع التكبير على حقول الإدخال في iOS
    document.addEventListener('touchstart', function() {}, {passive: true});
    
    // تحسين الأداء
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
}

// تهيئة تحسينات الموبايل
setupMobileOptimizations();
