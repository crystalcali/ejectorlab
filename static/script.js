// static/script.js

// Функция для открытия вкладок
function openTab(tabName, event) {
    // Скрыть все вкладки
    const tabs = document.getElementsByClassName('tab-content');
    for (let tab of tabs) {
        tab.classList.remove('active');
    }

    // Убрать активный класс с всех табов
    const tabButtons = document.getElementsByClassName('tab');
    for (let btn of tabButtons) {
        btn.classList.remove('active');
    }

    // Показать выбранную вкладку и сделать её активной
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Функция для смены полей выбора в водовоздушном эжекторе
function toggleChoiceFields() {
    const choice = document.getElementById('choice').value;
    const uoGroup = document.getElementById('uo-group');
    const PcGroup = document.getElementById('Pc-group');

    if (choice === 'uo') {
        uoGroup.style.display = 'flex';
        PcGroup.style.display = 'none';
    } else if (choice === 'Pc') {
        uoGroup.style.display = 'none';
        PcGroup.style.display = 'flex';
    } else {
        uoGroup.style.display = 'none';
        PcGroup.style.display = 'none';
    }
}

// Получаем элемент изображения
const gasImage = document.getElementById('gasImage');

// Функция для смены темы и изображения
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        document.querySelector('.theme-switcher').innerText = '🌙';
        gasImage.src = "../static/res/draw_gas_ejector.png"; // Светлая тема
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.querySelector('.theme-switcher').innerText = '☀️';
        gasImage.src = "../static/res/draw_gas_ejector_dark.png"; // Тёмная тема
    }
}

// Функции для управления спиннером
function showGlobalSpinner() {
    document.getElementById('global-spinner').style.display = 'flex';
}

function hideGlobalSpinner() {
    document.getElementById('global-spinner').style.display = 'none';
}

// Обработчик отправки формы водовоздушного эжектора
document.getElementById('water-air-form').addEventListener('submit', function(e) {
    e.preventDefault();

        // Показываем спиннер
    showGlobalSpinner();
    document.getElementById('water-air-output').innerHTML = ''; // Очистить предыдущие результаты
    
    
    const choice = document.getElementById('choice').value;
    const uo = document.getElementById('uo').value;
    const Pc = document.getElementById('Pc').value;
    const G_air = document.getElementById('G_air').value;
    const P_water = document.getElementById('P_water').value;
    const P_air = document.getElementById('P_air').value;
    const T_water = document.getElementById('T_water').value;
    const T_air = document.getElementById('T_air').value;

    fetch('/calculate_water_air', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            G_air: G_air,
            P_water: P_water,
            P_air: P_air,
            T_water: T_water,
            T_air: T_air,
            choice: choice,
            uo: uo,
            Pc: Pc
        })
    })
    .then(response => response.json())
    .then(data => {
        hideGlobalSpinner();

        if(data.status === 'success') {
            let output = '';
            for (const [key, value] of Object.entries(data.results)) {
                output += `<p><strong>${key}:</strong> ${value}</p>`;
            }
            document.getElementById('water-air-output').innerHTML = output;
        } else {
            document.getElementById('water-air-output').innerHTML = `<p style="color:red;">Ошибка: ${data.message}</p>`;
        }
    })
    .catch(error => {
        hideGlobalSpinner();
        document.getElementById('water-air-output').innerHTML = `<p style="color:red;">Ошибка: ${error}</p>`;
    });
});

// Обработчик отправки формы газоструйного эжектора
document.getElementById('gas-form').addEventListener('submit', function(e) {
    e.preventDefault();

    showGlobalSpinner();
    document.getElementById('gas-output').innerHTML = ''; // Очистить предыдущие результаты

    const Gr = document.getElementById('Gr').value;
    const Gi = document.getElementById('Gi').value;
    const Pr = document.getElementById('Pr').value;
    const Pi = document.getElementById('Pi').value;
    const Tr = document.getElementById('Tr').value;
    const Ti = document.getElementById('Ti').value;
    const Rr = document.getElementById('Rr').value;
    const Ri = document.getElementById('Ri').value;
    const kr = document.getElementById('kr').value;
    const ki = document.getElementById('ki').value;
    const state_model_r = document.getElementById('state_model_r').value;
    const state_model_i = document.getElementById('state_model_i').value;

    fetch('/calculate_gas_ejector', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Gr: Gr,
            Gi: Gi,
            Pr: Pr,
            Pi: Pi,
            Tr: Tr,
            Ti: Ti,
            Rr: Rr,
            Ri: Ri,
            kr: kr,
            ki: ki,
            state_model_r: state_model_r,
            state_model_i: state_model_i
        })
    })
    .then(response => response.json())
    .then(data => {
        hideGlobalSpinner();

        if(data.status === 'success') {
            let output = '';
            for (const [key, value] of Object.entries(data.results)) {
                output += `<p><strong>${key}:</strong> ${value}</p>`;
            }
            document.getElementById('gas-output').innerHTML = output;
        } else {
            document.getElementById('gas-output').innerHTML = `<p style="color:red;">Ошибка: ${data.message}</p>`;
        }
    })
    .catch(error => {
        hideGlobalSpinner();
        document.getElementById('gas-output').innerHTML = `<p style="color:red;">Ошибка: ${error}</p>`;
    });
});

// Функция для пересчета значений к стандартным единицам
// Функция для пересчета и отображения значений в выбранной единице
function updateDisplayedValue(inputId, unitId) {
    const inputField = document.getElementById(inputId);
    const unitField = document.getElementById(unitId);
    let value = parseFloat(inputField.value);
    
    if (isNaN(value)) return;

    switch (unitField.value) {
        case "кг/ч":
            inputField.value = (value * 3600).toFixed(4); // Перевод кг/с в кг/ч для отображения
            break;
        case "кг/с":
            inputField.value = (value / 3600).toFixed(4); // Перевод кг/ч в кг/с для отображения
            break;
        case "МПа":
            inputField.value = (value / 1000000).toFixed(2); // Перевод Па в МПа для отображения
            break;
        case "атм":
            inputField.value = (value / 101325).toFixed(2); // Перевод Па в атм для отображения
            break;
        case "Па":
            // Па – стандартная единица для отображения, нет преобразования
            break;
        case "C":
            inputField.value = (value - 273.15).toFixed(1); // Перевод K в °C для отображения
            break;
        case "K":
            inputField.value = (value + 273.15).toFixed(1); // Перевод °C в K для отображения
            break;
    }
}

// Функция для конвертации значений в стандартные единицы перед передачей
function convertToStandardValue(inputId, unit) {
    let value = parseFloat(document.getElementById(inputId).value);

    if (isNaN(value)) return value; // Возвращаем значение как есть, если оно не число

    switch (unit) {
        case "кг/ч":
            return value / 3600; // Перевод в кг/с
        case "МПа":
            return value * 1000000; // Перевод в Па
        case "атм":
            return value * 101325; // Перевод в Па
        case "C":
            return value + 273.15; // Перевод в K
        default:
            return value; // Стандартные единицы (кг/с, Па, K) не требуют преобразования
    }
}

const fields = ["Gr", "Gi", "Pr", "Pi", "Tr", "Ti"];

// Функция для обновления стандартного значения при изменении ввода
function updateStandardValue(inputId, unitId) {
    const inputField = document.getElementById(inputId);
    const unitField = document.getElementById(unitId);
    let displayedValue = parseFloat(inputField.value.replace(',', '.'));

    if (isNaN(displayedValue)) {
        inputField.dataset.standardValue = '';
        return;
    }

    let standardValue;

    switch (unitField.value) {
        case "кг/ч":
            standardValue = displayedValue / 3600; // Перевод в кг/с
            break;
        case "кг/с":
            standardValue = displayedValue; // кг/с – стандартная единица
            break;
        case "МПа":
            standardValue = displayedValue * 1e6; // Перевод в Па
            break;
        case "атм":
            standardValue = displayedValue * 101325; // Перевод в Па
            break;
        case "Па":
            standardValue = displayedValue; // Па – стандартная единица
            break;
        case "C":
            standardValue = displayedValue + 273.15; // Перевод в K
            break;
        case "K":
            standardValue = displayedValue; // K – стандартная единица
            break;
        default:
            standardValue = displayedValue; // По умолчанию принимаем введённое значение
            break;
    }

    inputField.dataset.standardValue = standardValue;
}

// Функция для пересчета и отображения значений в выбранной единице
function updateDisplayedValue(inputId, unitId) {
    const inputField = document.getElementById(inputId);
    const unitField = document.getElementById(unitId);
    let standardValue = parseFloat(inputField.dataset.standardValue);

    if (isNaN(standardValue)) return;

    let displayedValue;

    switch (unitField.value) {
        case "кг/ч":
            displayedValue = (standardValue * 3600).toFixed(4); // Перевод кг/с в кг/ч для отображения
            break;
        case "кг/с":
            displayedValue = standardValue.toFixed(4); // кг/с – стандартная единица
            break;
        case "МПа":
            displayedValue = (standardValue / 1e6).toFixed(2); // Перевод Па в МПа для отображения
            break;
        case "атм":
            displayedValue = (standardValue / 101325).toFixed(2); // Перевод Па в атм для отображения
            break;
        case "Па":
            displayedValue = standardValue.toFixed(0); // Па – стандартная единица
            break;
        case "C":
            displayedValue = (standardValue - 273.15).toFixed(1); // Перевод K в °C для отображения
            break;
        case "K":
            displayedValue = standardValue.toFixed(1); // K – стандартная единица
            break;
        default:
            displayedValue = standardValue.toFixed(2); // По умолчанию отображаем стандартное значение
            break;
    }

    inputField.value = displayedValue;
}

// Инициализация и привязка событий
fields.forEach(fieldId => {
    const inputField = document.getElementById(fieldId);
    const unitField = document.getElementById(fieldId + "_unit");

    // Инициализируем стандартное значение при загрузке
    updateStandardValue(fieldId, fieldId + "_unit");

    // При изменении значения обновляем стандартное значение и отображение
    inputField.addEventListener("input", function() {
        updateStandardValue(fieldId, fieldId + "_unit");
        updateDisplayedValue(fieldId, fieldId + "_unit");
    });

    // При изменении единицы обновляем отображаемое значение
    unitField.addEventListener("change", function() {
        updateDisplayedValue(fieldId, fieldId + "_unit");
    });
});

// Обработка отправки формы
document.getElementById('gas-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const data = {};

    fields.forEach(fieldId => {
        const inputField = document.getElementById(fieldId);
        let standardValue = parseFloat(inputField.dataset.standardValue);

        if (!isNaN(standardValue)) {
            data[fieldId] = standardValue;
        } else {
            data[fieldId] = null; // Или обработайте как требуется, если значение не число
        }
    });

    // Отправляем стандартные значения на сервер
    fetch('/calculate_gas_ejector', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if(data.status === 'success') {
            let output = '';
            for (const [key, value] of Object.entries(data.results)) {
                output += `<p><strong>${key}:</strong> ${value}</p>`;
            }
            document.getElementById('gas-output').innerHTML = output;
        } else {
            document.getElementById('gas-output').innerHTML = `<p style="color:red;">Ошибка: ${data.message}</p>`;
        }
    })
    .catch(error => {
        document.getElementById('gas-output').innerHTML = `<p style="color:red;">Ошибка: ${error}</p>`;
    });
});

// Устанавливаем изображение при загрузке страницы в соответствии с текущей темой
document.addEventListener('DOMContentLoaded', () => {
    let currentTheme = document.documentElement.getAttribute('data-theme');

    if (!currentTheme) { // Если тема ещё не установлена
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            gasImage.src = "../static/res/draw_gas_ejector_dark.png";
            document.querySelector('.theme-switcher').innerText = '☀️';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            gasImage.src = "../static/res/draw_gas_ejector.png";
            document.querySelector('.theme-switcher').innerText = '🌙';
        }
    } else {
        // Установите изображение согласно текущей теме
        if (currentTheme === 'dark') {
            gasImage.src = "../static/res/draw_gas_ejector_dark.png";
            document.querySelector('.theme-switcher').innerText = '☀️';
        } else {
            gasImage.src = "../static/res/draw_gas_ejector.png";
            document.querySelector('.theme-switcher').innerText = '🌙';
        }
    }
});
