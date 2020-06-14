// SAVE INPUT AS VARIABLES
const slider = document.querySelector('#age');
const ageValue = document.querySelector('#ageValue');

// CHANGE INTEGER INPUT INTO RANGE / SLIDER WHEN JAVASCRIPT LOADED AND SET MIN, MAX, CURRENT VALUE AND VISIBILITY
slider.type = 'range';
slider.min = '16';
slider.max = '60';
slider.value = '18';
ageValue.style.display = 'block';
slider.classList.add('slider');

ageValue.innerHTML = 'Leeftijd: ' + slider.value;

slider.oninput = () => {
  ageValue.innerHTML = 'Leeftijd: ' + slider.value;
}
