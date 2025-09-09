document.addEventListener('DOMContentLoaded', function() {
    const reserveBtn = document.getElementById('reserveBtn');

    if (reserveBtn) {
        reserveBtn.addEventListener('click', function() {
            alert('예약 페이지로 이동합니다!');
            window.location.href = 'reserve.html';  
        });
    }

    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});
