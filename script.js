// نظام إدارة الجلسات
class SessionManager {
    constructor() {
        this.sessionKey = 'ims_admin_session';
        this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 ساعة
    }

    isLoggedIn() {
        try {
            const session = this.getSession();
            if (!session) return false;

            // التحقق من انتهاء الجلسة
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
        // بيانات الدخول الثابتة
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

// تهيئة مدير الجلسات
const sessionManager = new SessionManager();

// باقي الكود يبقى كما هو مع إضافة التحقق من الجلسة
// ... (باقي الدوال تبقى كما هي)

// تحديث التهيئة الأولية
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة البيانات الأساسية
    initializeData();
    
    // تحديث الواجهة
    updateCountrySelect();
    updateCountriesGrid();
    updateNotificationCount();
    
    // إعداد مستمعي الأحداث للصفحة الرئيسية
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        setupMainPageEvents();
    }
});

function initializeData() {
    // تهيئة البيانات إذا لم تكن موجودة
    if (!localStorage.getItem('countries')) {
        const defaultCountries = [
            { name: 'مصر', flag: 'https://flagcdn.com/w320/eg.png' },
            { name: 'السعودية', flag: 'https://flagcdn.com/w320/sa.png' },
            { name: 'الإمارات', flag: 'https://flagcdn.com/w320/ae.png' },
            { name: 'الكويت', flag: 'https://flagcdn.com/w320/kw.png' },
            { name: 'عمان', flag: 'https://flagcdn.com/w320/om.png' },
            { name: 'قطر', flag: 'https://flagcdn.com/w320/qa.png' },
            { name: 'البحرين', flag: 'https://flagcdn.com/w320/bh.png' },
            { name: 'الأردن', flag: 'https://flagcdn.com/w320/jo.png' }
        ];
        localStorage.setItem('countries', JSON.stringify(defaultCountries));
    }
}

function setupMainPageEvents() {
    // نافذة تسجيل الدخول في الصفحة الرئيسية
    const loginModal = document.getElementById('loginModal');
    const adminLink = document.getElementById('adminLink');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const adminLoginForm = document.getElementById('adminLoginForm');

    if (adminLink && loginModal) {
        adminLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'flex';
        });
    }

    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', function() {
            loginModal.style.display = 'none';
        });
    }

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;
            const statusElement = document.getElementById('loginStatus');
            
            if (sessionManager.login(username, password)) {
                window.location.href = 'admin.html';
            } else {
                showStatus(statusElement, 'اسم المستخدم أو كلمة المرور غير صحيحة', false);
            }
        });
    }

    // إغلاق النافذة عند النقر خارجها
    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    }
}
