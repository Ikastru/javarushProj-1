document.addEventListener('DOMContentLoaded', function () {
    const passengerInput = document.querySelector('.passengers-and-class');
    const dropdown = document.getElementById('passengersDropdown');
    let totalPassengers = 1;

    passengerInput.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Обработчики счетчиков
    document.querySelectorAll('.counter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const counter = this.closest('.counter');
            const countElement = counter.querySelector('.count');
            let count = parseInt(countElement.textContent);

            if (this.classList.contains('plus')) {
                if (totalPassengers < 9) {
                    count++;
                    totalPassengers++;
                }
            } else {
                if (count > 0) {
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
        option.addEventListener('click', function () {
            document.querySelectorAll('.class-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            updatePassengerInput();
        });
    });

    // Закрытие при клике вне блока
    document.addEventListener('click', function (e) {
        if (!dropdown.contains(e.target) && e.target !== passengerInput) {
            dropdown.style.display = 'none';
        }
    });

    function updatePassengerInput() {
        const adults = document.querySelector('.passenger-type:nth-child(2) .count').textContent;
        const children = document.querySelector('.passenger-type:nth-child(3) .count').textContent;
        const infants = document.querySelector('.passenger-type:nth-child(4) .count').textContent;
        const selectedClass = document.querySelector('.class-option.active').textContent;

        passengerInput.value = `${parseInt(adults) + parseInt(children)} пассажир${parseInt(adults) + parseInt(children) > 1 ? 'ов' : ''}, ${selectedClass.toLowerCase()}`;
    }

    // Календарь ***************************************************************
    const monthTemplate = document
        .querySelector("#calendar-template")
        .content
        .querySelector(".calendar-month");

    const monthContainer = document.querySelector(".calendar-dates");

    const ClassName = {
        DATE: "calendar-month-dates-day",
        PAST_DATE: "calendar-month-dates-day-past",
        TODAY: "calendar-month-dates-day-today",
    };

    // Находим элементы календаря
    const calendarContainer = document.querySelector('.calendar-container');
    const dateFromInput = document.querySelector('.date-fromDate');
    const dateToInput = document.querySelector('.date-toDate');

    // Показываем календарь при клике на поле "Туда"
    dateFromInput.addEventListener('click', function (e) {
        e.stopPropagation();

        // Позиционируем календарь под полем ввода
        const rect = dateFromInput.getBoundingClientRect();
        calendarContainer.style.top = `${rect.bottom + window.scrollY + 5}px`;
        calendarContainer.style.left = `${rect.left + window.scrollX}px`;

        // Показываем календарь
        let isCalendarOpen = false;

        const selectedDates = {
            FROM: null,
            TO: null,
        };

        if (isCalendarOpen) {
            return;
        }

        showCalendarDialog();
        renderCalendarMonth(monthContainer, new Date().getMonth());
        renderCalendarMonth(monthContainer, new Date().getMonth() + 1);

        monthContainer.addEventListener('click', function (evt) {
            const isSelectableDateClicked = (
                evt.target.classList.contains(ClassName.DATE) &&
                !evt.target.classList.contains(ClassName.PAST_DATE)
            );
    
            if (!isSelectableDateClicked) {
                return;
            }
    
            const selectedDate = new Date(evt.target.dataset.date);
    
            // 1. Если не выбрана никакая дата, первая нажатая дата становится from
            // 2. Если дата выбрана, вторая нажатая дата становится 
            //   2.1. Если вторая нажатая дата больше или равна выбранной, она становится to
            //   2.2. Если вторая нажатая дата меньше выбранной, она становится from, а
            //        выбранная дата становится to
            if (selectedDates.FROM === null) {
                selectedDates.FROM = selectedDate;
            } else {
                if (selectedDate > selectedDates.FROM) {
                    selectedDates.TO = selectedDate;
                } else {
                    selectedDates.TO = selectedDates.FROM;
                    selectedDates.FROM = selectedDate;
                }
            }
    
            if (selectedDates.FROM !== null && selectedDates.TO !== null) {
                dateFromElement.value = selectedDates.FROM.toLocaleString("ru-RU");
                dateToElement.value = selectedDates.TO.toLocaleString("ru-RU");
    
                hideCalendarDialog();
                isCalendarOpen = false;
            }
        });

        isCalendarOpen = true;
    });

    // Показываем календарь при клике на поле "Обратно"
    dateToInput.addEventListener('click', function (e) {
        e.stopPropagation();

        // Позиционируем календарь под полем ввода
        const rect = dateToInput.getBoundingClientRect();
        calendarContainer.style.top = `${rect.bottom + window.scrollY + 5}px`;
        calendarContainer.style.left = `${rect.left + window.scrollX}px`;

        // Показываем календарь
        showCalendarDialog();
        renderCalendarMonth(monthContainer, new Date().getMonth());
        renderCalendarMonth(monthContainer, new Date().getMonth() + 1);
    });

    // Обработчик для закрытия календаря
    document.addEventListener('click', function (e) {
        if (!calendarContainer.contains(e.target) && e.target !== dateFromInput && e.target !== dateToInput) {
            hideCalendarDialog();
        }
    });

    function getMonth(idx) {
        const objDate = new Date();
        objDate.setDate(1);
        objDate.setMonth(idx);

        const month = objDate.toLocaleString("ru-RU", {
            month: "long",
        });

        return month;
    }

    function getDaysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }

    function renderCalendarMonth(
        container,
        monthNumber = new Date().getMonth(),
        yearNumber = new Date().getFullYear(),
    ) {
        const monthElement = monthTemplate.cloneNode(true);
        // Все изменения в DOM мы производим до отрисовки элемента на страницу
        // чтобы не вызывать слишком много повторных рендерингов

        const monthNameElement = monthElement.querySelector(".calendar-month-name");
        monthNameElement.textContent = `${getMonth(monthNumber)} ${yearNumber}`;

        // 1. Взять первый день месяца
        // 2. Определить день недели этого дня
        let firstDayInMonth = new Date(yearNumber, monthNumber, 1).getDay();
        if (firstDayInMonth === 0) {
            firstDayInMonth = 7;
        }

        const daysContainer = monthElement.querySelector(".calendar-month-dates-days");

        // 3. До этого дня заполнить контейнер филлерами (пустыми элементами)
        let daysLeft = firstDayInMonth;
        while (--daysLeft) {
            const fillerDate = document.createElement("li");
            daysContainer.appendChild(fillerDate);
        }

        // 4. Определить количество дней в месяце
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const daysInMonth = getDaysInMonth(monthNumber, yearNumber);
        // 5. В цикле заполнить контейнер блоками под дни по их количеству
        // 6. Попутно отмечая прошедние дни и текущий день
        for (let day = 1; day <= daysInMonth; day++) {
            const date = document.createElement("li");
            const renderedDate = new Date(yearNumber, monthNumber, day, 0, 0, 0, 0);

            date.textContent = day;

            date.classList.add(ClassName.DATE);
            date.classList.toggle(ClassName.PAST_DATE, renderedDate - today < 0);
            date.classList.toggle(ClassName.TODAY, renderedDate - today === 0);

            date.dataset.date = renderedDate.toISOString();

            daysContainer.appendChild(date);
        }

        container.appendChild(monthElement);
    }

    function clearCalendarMonths() {
        monthContainer.innerHTML = "";
    }

    // Функции показа/скрытия календаря
    function showCalendarDialog() {
        calendarContainer.style.display = 'block';
        calendarContainer.setAttribute('open', 'true');
    }

    function hideCalendarDialog() {
        calendarContainer.style.display = 'none';
        calendarContainer.removeAttribute('open');
        clearCalendarMonths();
    }
});


