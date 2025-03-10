// Добавьте в script.js
document.addEventListener('DOMContentLoaded', function() {
    const passengerInput = document.querySelector('.passengers-and-class');
    const dropdown = document.getElementById('passengersDropdown');
    let totalPassengers = 1;

    passengerInput.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Обработчики счетчиков
    document.querySelectorAll('.counter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const counter = this.closest('.counter');
            const countElement = counter.querySelector('.count');
            let count = parseInt(countElement.textContent);

            if(this.classList.contains('plus')) {
                if(totalPassengers < 9) {
                    count++;
                    totalPassengers++;
                }
            } else {
                if(count > 0) {
                    count--;
                    totalPassengers--;
                }
            }
            
            countElement.textContent = count;
            updatePassengerInput();
        });
    });

    // Обработчики выбора класса
    document.querySelectorAll('.class-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.class-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            updatePassengerInput();
        });
    });

    // Закрытие при клике вне блока
    document.addEventListener('click', function(e) {
        if(!dropdown.contains(e.target) && e.target !== passengerInput) {
            dropdown.style.display = 'none';
        }
    });

    function updatePassengerInput() {
        const adults = document.querySelector('.passenger-type:nth-child(2) .count').textContent;
        const children = document.querySelector('.passenger-type:nth-child(3) .count').textContent;
        const infants = document.querySelector('.passenger-type:nth-child(4) .count').textContent;
        const selectedClass = document.querySelector('.class-option.active').textContent;
        
        passengerInput.value = `${parseInt(adults) + parseInt(children)} пассажир${parseInt(adults)+parseInt(children) > 1 ? 'ов' : ''}, ${selectedClass.toLowerCase()}`;
    }
});