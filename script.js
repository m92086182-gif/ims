// إضافة هذا الكود لتحسين تجربة الموبايل
document.addEventListener('DOMContentLoaded', function() {
    // منع التكبير على حقول الإدخال في iOS
    document.addEventListener('touchstart', function() {}, {passive: true});
    
    // تحسين الأداء على الأجهزة المحمولة
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
    
    // إغلاق القوائم المنبثقة عند النقر خارجها
    document.addEventListener('click', function(e) {
        const notificationsPanel = document.getElementById('notificationsPanel');
        if (notificationsPanel && !e.target.closest('#notificationIcon') && !e.target.closest('#notificationsPanel')) {
            notificationsPanel.style.display = 'none';
        }
    });
});
