const inputSlider = document.querySelector('.slider');
const lengthDisplay = document.querySelector('[data-length-number]');

const passwordDisplay = document.querySelector('[ data-password-display]');
const copyBtn = document.querySelector('[data-copy]');
const copyMsg = document.querySelector('[data-copy-msg]');
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const indicator = document.querySelector('[strength-color]');
const generateBtn = document.querySelector('.generate-btn');
const allCheckBox = document.querySelectorAll('input[type=checkbox]');
const symbol = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


let password="";
let passwordLength=10;
let checkCount=0;
//  set strength circle color gray;

handelSlider();
 // set passwordLength acc. to slider
function handelSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    console.log(min);
    const max=inputSlider.max;
    console.log(max);
 
    inputSlider.style.backgroundSize = ( (passwordLength-min)*100/(max-min))+'% 100%' 


}
setIndicator('#ccc');
// set indicator
function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}

function getRandomInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}
function generateSymbol(){
    const rndNum = getRandomInteger(0,symbol.length);
    
    return symbol[rndNum];

}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNumber = true;
    if (symbolsCheck.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbol) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}


async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);

        copyMsg.innerText = "Copied "
    }
    catch (e) {
        // alert("Something went wrong in CopyContent");
        copyMsg.innerText = "Failed";
    }
    if(passwordLength>=1)
    copyMsg.classList.add('active');

    setTimeout(() => {
        copyMsg.classList.remove('active');
    }, 1500)
}
function handleCheckbox(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked) checkCount++;
    });

    if(checkCount>passwordLength){
    passwordLength = checkCount;
    handelSlider();
    }
}
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckbox);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handelSlider();
})

copyBtn.addEventListener('click',()=>{
    // if(length(passwordDisplay)>0)
    copyContent();
})

generateBtn.addEventListener('click',()=>{
        if(checkCount==0)
        return;
        if(passwordLength<checkCount){
            passwordLength=checkCount;
            handelSlider();
        }

        
        password="";

        
        let funcArr=[];
        if(uppercaseCheck.checked){
            funcArr.push(generateUpperCase);
        }

        if(lowercaseCheck.checked){
            funcArr.push(generateLowerCase);
        }
        if(numbersCheck.checked){
            funcArr.push(generateRandomNumber);
        }
        if(symbolsCheck.checked){
            funcArr.push(generateSymbol);
        }

        for(let i=0;i<funcArr.length;i++){
            password+=funcArr[i]();
        }
        for(let i=0;i<passwordLength-funcArr.length;i++){
            let randId = getRandomInteger(0,funcArr.length)
            password+=funcArr[randId]();
        }

        //shuffle password
        password = shufflePassword(Array.from(password));

        // show password
        passwordDisplay.value= password;
        calcStrength();


})

function shufflePassword(array){
    // using fisher yates algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}