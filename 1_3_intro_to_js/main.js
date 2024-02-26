

console.log('hello world');


const clickButton = document.getElementById('clickButton');
const clickCount = document.getElementById('clickCount');
let count = 0;

clickButton.onclick = function() {
  count++;
  clickCount.innerText = count;
};


const submitInfoButton = document.getElementById('submitInfoButton');
const nameInput = document.getElementById('nameInput');
const ageInput = document.getElementById('ageInput');

submitInfoButton.onclick = function() {
  const name = nameInput.value;
  const age = ageInput.value;

  const userInfo = { name, age };
  console.log(userInfo);

  alert(`People say age is just a number, buttttt I think it's awesome how, ${name}, you have lived on this planet for ${age} years! MUCH LOVE FELLOW HUMAN BEING~`);
};
