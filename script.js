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

// تحديث قائمة الدول في النموذج والعرض
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

// تحديث عرض الدول في الشبكة
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

// تحديث جداول الطلبات في لوحة الإدارة
function updateRequestsTables() {
    const numberRequestsTable = document.getElementById('numberRequestsTable');
    const userRequestsTable = document.getElementById('userRequestsTable');
    
    // تحديث جدول طلبات الأرقام
    if (numberRequestsTable) {
        numberRequestsTable.innerHTML = '';
        numberRequests.forEach((request, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${request.country}</td>
                <td>${request.quantity}</td>
                <td>${request.username}</td>
                <td>${new Date(request.timestamp).toLocaleDateString('ar-EG')}</td>
                <td>${request.status || 'قيد التنفيذ'}</td>
                <td>
                    ${request.status !== 'مكتمل' ? 
                        `<button class="action-btn" onclick="completeRequest('number', ${index})">تم التنفيذ</button>` : 
                        '<span class="success">مكتمل</span>'
                    }
                    <button class="delete-btn" onclick="deleteRequest('number', ${index})" style="margin-right: 5px;">حذف</button>
                </td>
            `;
            numberRequestsTable.appendChild(row);
        });
    }
    
    // تحديث جدول طلبات المستخدمين
    if (userRequestsTable) {
        userRequestsTable.innerHTML = '';
        userRequests.forEach((request, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${request.binaryName}</td>
                <td>${request.whatsappNumber}</td>
                <td>${new Date(request.timestamp).toLocaleDateString('ar-EG')}</td>
                <td>${request.status || 'قيد التنفيذ'}</td>
                <td>
                    ${request.status !== 'مكتمل' ? 
                        `<button class="action-btn" onclick="completeRequest('user', ${index})">تم التنفيذ</button>` : 
                        '<span class="success">مكتمل</span>'
                    }
                    <button class="delete-btn" onclick="deleteRequest('user', ${index})" style="margin-right: 5px;">حذف</button>
                </td>
            `;
            userRequestsTable.appendChild(row);
        });
    }
}

// حذف طلب
function deleteRequest(type, index) {
    if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
        if (type === 'number') {
            numberRequests.splice(index, 1);
            localStorage.setItem('numberRequests', JSON.stringify(numberRequests));
        } else {
            userRequests.splice(index, 1);
            localStorage.setItem('userRequests', JSON.stringify(userRequests));
        }
        
        updateRequestsTables();
        if (typeof updateAdminStats === 'function') {
            updateAdminStats();
        }
    }
}

// إكمال الطلب وإرسال إشعار
function completeRequest(type, index) {
    let request, message;
    
    if (type === 'number') {
        request = numberRequests[index];
        request.status = 'مكتمل';
        message = `تم تنفيذ طلبك للأرقام (${request.country} - ${request.quantity} رقم) بنجاح`;
        localStorage.setItem('numberRequests', JSON.stringify(numberRequests));
    } else {
        request = userRequests[index];
        request.status = 'مكتمل';
        message = `تم تنفيذ طلب حساب المستخدم (${request.binaryName}) بنجاح`;
        localStorage.setItem('userRequests', JSON.stringify(userRequests));
    }
    
    // إضافة إشعار
    const notification = {
        id: Date.now(),
        title: 'تم تنفيذ طلبك',
        message: message,
        time: new Date().toLocaleString('ar-EG'),
        read: false,
        recipient: type === 'number' ? request.username : request.binaryName
    };
    
    notifications.push(notification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // تحديث العداد والعرض
    updateNotificationCount();
    updateRequestsTables();
    if (typeof updateAdminStats === 'function') {
        updateAdminStats();
    }
    
    alert('تم تحديث حالة الطلب وإرسال الإشعار');
}

// تحديث عداد الإشعارات
function updateNotificationCount() {
    const notificationCount = document.getElementById('notificationCount');
    if (notificationCount) {
        const unreadCount = notifications.filter(n => !n.read).length;
        notificationCount.textContent = unreadCount;
    }
}

// تحديث لوحة الإشعارات
function updateNotificationsPanel() {
    const panel = document.getElementById('notificationsPanel');
    if (panel) {
        panel.innerHTML = '';
        
        if (notifications.length === 0) {
            panel.innerHTML = '<div class="notification-item">لا توجد إشعارات</div>';
            return;
        }
        
        // عرض أحدث الإشعارات أولاً
        const sortedNotifications = [...notifications].reverse();
        
        sortedNotifications.forEach(notification => {
            const item = document.createElement('div');
            item.className = `notification-item ${notification.read ? '' : 'unread'}`;
            item.innerHTML = `
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${notification.time}</div>
            `;
            item.addEventListener('click', () => {
                notification.read = true;
                localStorage.setItem('notifications', JSON.stringify(notifications));
                updateNotificationCount();
                updateNotificationsPanel();
            });
            panel.appendChild(item);
        });
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

// نموذج طلب الأرقام
const orderNumbersForm = document.getElementById('orderNumbersForm');
if (orderNumbersForm) {
    orderNumbersForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const country = document.getElementById('country').value;
        const quantity = document.getElementById('quantity').value;
        const username = document.getElementById('username').value;
        const statusElement = document.getElementById('orderNumbersStatus');
        
        if (!country || !quantity || !username) {
            showStatus(statusElement, 'يرجى ملء جميع الحقول', false);
            return;
        }
        
        // حفظ الطلب
        const request = {
            country,
            quantity,
            username,
            timestamp: new Date().toISOString()
        };
        
        numberRequests.push(request);
        localStorage.setItem('numberRequests', JSON.stringify(numberRequests));
        
        showStatus(statusElement, 'تم تقديم طلبك وهو قيد التنفيذ', true);
        this.reset();
        
        // تحديث الإحصائيات في لوحة التحكم إذا كانت مفتوحة
        if (typeof updateAdminStats === 'function') {
            updateAdminStats();
        }
    });
}

// نموذج طلب المستخدم
const orderUserForm = document.getElementById('orderUserForm');
if (orderUserForm) {
    orderUserForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const binaryName = document.getElementById('binaryName').value;
        const whatsappNumber = document.getElementById('whatsappNumber').value;
        const statusElement = document.getElementById('orderUserStatus');
        
        if (!binaryName || !whatsappNumber) {
            showStatus(statusElement, 'يرجى ملء جميع الحقول', false);
            return;
        }
        
        // حفظ الطلب
        const request = {
            binaryName,
            whatsappNumber,
            timestamp: new Date().toISOString()
        };
        
        userRequests.push(request);
        localStorage.setItem('userRequests', JSON.stringify(userRequests));
        
        showStatus(statusElement, 'تم تقديم طلبك وهو قيد التنفيذ', true);
        this.reset();
        
        // تحديث الإحصائيات في لوحة التحكم إذا كانت مفتوحة
        if (typeof updateAdminStats === 'function') {
            updateAdminStats();
        }
    });
}

// إضافة دولة جديدة
const addCountryForm = document.getElementById('addCountryForm');
if (addCountryForm) {
    addCountryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newCountry = document.getElementById('newCountry').value.trim();
        const newCountryFlag = document.getElementById('newCountryFlag').value.trim();
        
        if (!newCountry || !newCountryFlag) {
            alert('يرجى إدخال اسم الدولة ورابط العلم');
            return;
        }
        
        if (countries.some(c => c.name === newCountry)) {
            alert('هذه الدولة موجودة بالفعل');
            return;
        }
        
        countries.push({ name: newCountry, flag: newCountryFlag });
        localStorage.setItem('countries', JSON.stringify(countries));
        updateCountrySelect();
        updateCountriesGrid();
        this.reset();
        
        alert(`تم إضافة دولة ${newCountry} بنجاح`);
    });
}

// إظهار/إخفاء لوحة الإشعارات
const notificationIcon = document.getElementById('notificationIcon');
if (notificationIcon) {
    notificationIcon.addEventListener('click', function(e) {
        e.preventDefault();
        const panel = document.getElementById('notificationsPanel');
        if (panel.style.display === 'block') {
            panel.style.display = 'none';
        } else {
            updateNotificationsPanel();
            panel.style.display = 'block';
        }
    });
}

// إغلاق لوحة الإشعارات عند النقر خارجها
document.addEventListener('click', function(e) {
    const notificationIcon = document.getElementById('notificationIcon');
    const notificationsPanel = document.getElementById('notificationsPanel');
    
    if (notificationIcon && notificationsPanel) {
        if (!e.target.closest('#notificationIcon') && !e.target.closest('#notificationsPanel')) {
            notificationsPanel.style.display = 'none';
        }
    }
});

// التهيئة الأولية
document.addEventListener('DOMContentLoaded', function() {
    updateCountrySelect();
    updateCountriesGrid();
    updateNotificationCount();
    
    // إذا كنا في صفحة لوحة التحكم، نقوم بتحميل البيانات
    if (window.location.pathname.includes('admin.html')) {
        // التحقق من تسجيل الدخول
        const isLoggedIn = localStorage.getItem('adminLoggedIn');
        if (!isLoggedIn) {
            // عرض نموذج تسجيل الدخول
            showLoginModal();
        } else {
            // تحميل بيانات لوحة التحكم
            if (typeof loadAdminData === 'function') {
                loadAdminData();
            }
            if (typeof setupEventListeners === 'function') {
                setupEventListeners();
            }
        }
    }
});

// عرض نموذج تسجيل الدخول
function showLoginModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    modal.innerHTML = `
        <div class="login-form">
            <h2>تسجيل الدخول للمسؤول</h2>
            <form id="adminLoginFormModal">
                <div class="form-group">
                    <label for="adminUsername">اسم المستخدم</label>
                    <input type="text" id="adminUsername" required>
                </div>
                <div class="form-group">
                    <label for="adminPassword">كلمة المرور</label>
                    <input type="password" id="adminPassword" required>
                </div>
                <button type="submit" class="btn" style="width: 100%;">دخول</button>
            </form>
            <div id="loginStatus" class="status-message"></div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // معالجة تسجيل الدخول
    document.getElementById('adminLoginFormModal').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        const statusElement = document.getElementById('loginStatus');
        
        if (username === 'Mohamed77ngq' && password === 'Mohamed77ngq') {
            localStorage.setItem('adminLoggedIn', 'true');
            modal.remove();
            location.reload();
        } else {
            showStatus(statusElement, 'اسم المستخدم أو كلمة المرور غير صحيحة', false);
        }
    });
}