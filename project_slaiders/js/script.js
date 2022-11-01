'use strict';

// Константы стилей
const FIRST = getComputedStyle(document.querySelector('.slaid_cont > .first'));
const CENTER = getComputedStyle(document.querySelector('.slaid_cont > .second'));
const FIRST_TEXT = getComputedStyle(document.querySelector('.slaid_cont > .first_header'));
const CENTER_TEXT = getComputedStyle(document.querySelector('.slaid_cont > .second_header'));
const DIV_COLOR = document.querySelector('.slaid_cont > .color');
const DIV_BLOCK_DESCR = document.querySelector('.descr');
// Константы для перемещения слайдов
const POSITION_LEFT = parseFloat(FIRST.left), POSITION_CENTER = parseFloat(CENTER.left);
const POSITION_RIGHT = 100 - POSITION_LEFT;
const OPACITY = parseFloat(FIRST.opacity);
const WIDTH_LEFT_RIGHT = parseFloat(FIRST.width), WIDTH_CENTER = parseFloat(CENTER.width);
const LEFT_TEXT_TOP = parseFloat(FIRST_TEXT.top), CENTER_TEXT_TOP = parseFloat(CENTER_TEXT.top);
const FZ_LEFT_RIGHT = parseFloat(FIRST_TEXT['font-size']), FZ_CENTER = parseFloat(CENTER_TEXT['font-size']);
const LH_LEFT_RIGHT = parseFloat(FIRST_TEXT['line-height']), LH_CENTER = parseFloat(CENTER_TEXT['line-height']);
const colors = {css: 'blue', html: 'red', js: 'yellow'};
const colorText = {css: [0, 153, 192], html: [222, 23, 60], js: [255, 215, 0]};
const colorBlock = {css: [0, 89, 148], html: [159, 0, 0], js: [102, 85, 0]};


// События slaiders

function click(direction){
    divRight.onclick = () => {};
    divLeft.onclick = () => {};
    divRight.onclick();
    Animator.arrImg = document.querySelectorAll('.slaid_cont > img');
    Animator.arrText = document.querySelectorAll('.first_header, .second_header, .third_header');
    Animator.active = Array.from(Animator.arrText).indexOf(document.querySelector('.slaid_cont > .active'));
    Animator.createLeft();
    Animator.createRight();
    Animator.changeClass(direction);
    Animator.changeStyle(direction);
    Animator.animation(direction);
    setTimeout(() => {divRight.onclick = ()  => click('right');}, duration + (duration/10));
    setTimeout(() => {divLeft.onclick = ()  => click('left');}, duration + (duration/10));
}


// Создаём объект передвижения
const Move = {
    moveLeftInCenter(progress, arrImg, arrText, pos, header){
        let moveInPos = POSITION_LEFT + progress * (POSITION_CENTER-POSITION_LEFT);
        moveInPos = moveInPos > POSITION_CENTER ? POSITION_CENTER : moveInPos;
        this.changeActiveColor(arrText, progress, pos, header);
        this.LeftAndRight(progress, arrImg, arrText, pos, moveInPos);
        
    },
    moveCenterInRight(progress, arrImg, arrText, pos){
        let moveInPos = POSITION_CENTER + progress * (POSITION_RIGHT - POSITION_CENTER);
        moveInPos = moveInPos > POSITION_RIGHT ? POSITION_RIGHT : moveInPos;
        this.changeCenterColor(arrText, progress, pos);
        this.Center(progress, arrImg, arrText, pos, moveInPos);
    },
    moveRightInLeft(progress, arrImg, arrText, pos){
        let moveInPos = POSITION_RIGHT + progress * (100 + POSITION_LEFT - POSITION_RIGHT);
        moveInPos = moveInPos > 100 ? moveInPos - 100 : moveInPos;
        if (moveInPos < POSITION_CENTER){
            moveInPos = POSITION_LEFT - moveInPos < 0 ? POSITION_LEFT : moveInPos;
        }
        [arrImg[pos].style.left, arrText[pos].style.left] = [`${moveInPos}%`, `${moveInPos}%`];
    },
    moveRightInCenter(progress, arrImg, arrText, pos, header){
        let moveInPos = POSITION_RIGHT - progress * (POSITION_RIGHT - POSITION_CENTER);
        moveInPos = moveInPos < POSITION_CENTER ? POSITION_CENTER : moveInPos;
        this.changeActiveColor(arrText, progress, pos, header);
        this.LeftAndRight(progress, arrImg, arrText, pos, moveInPos);
    },
    moveCenterInLeft(progress, arrImg, arrText, pos){
        let moveInPos = POSITION_CENTER - progress * (POSITION_CENTER - POSITION_LEFT);
        moveInPos = moveInPos < POSITION_LEFT ? POSITION_LEFT : moveInPos;
        this.changeCenterColor(arrText, progress, pos);
        this.Center(progress, arrImg, arrText, pos, moveInPos);
    },
    moveLeftInRight(progress, arrImg, arrText, pos){
        let moveInPos = POSITION_LEFT - progress * (100 + POSITION_LEFT - POSITION_RIGHT);
        moveInPos = moveInPos < 0 ? moveInPos + 100 : moveInPos;
        if (moveInPos > POSITION_CENTER){
            moveInPos = POSITION_RIGHT - moveInPos > 0 ? POSITION_RIGHT : moveInPos;
        }
        [arrImg[pos].style.left, arrText[pos].style.left] = [`${moveInPos}%`, `${moveInPos}%`];
    },

    LeftAndRight(progress, arrImg, arrText, pos, moveInPos){
        const opacity = `${OPACITY + progress * (1-OPACITY)}`;
        [arrImg[pos].style.left, arrText[pos].style.left] = [`${moveInPos}%`, `${moveInPos}%`];
        [arrImg[pos].style.opacity, arrText[pos].style.opacity] = [opacity, opacity];
        arrImg[pos].style.width = `${WIDTH_LEFT_RIGHT + progress * (WIDTH_CENTER - WIDTH_LEFT_RIGHT)}%`;
        arrText[pos].style.fontSize = `${FZ_LEFT_RIGHT + progress * (FZ_CENTER - FZ_LEFT_RIGHT)}px`;
        arrText[pos].style.lineHeight = `${LH_LEFT_RIGHT + progress * (LH_CENTER - LH_LEFT_RIGHT)}px`;
        arrText[pos].style.top = `${LEFT_TEXT_TOP - progress * (LEFT_TEXT_TOP - CENTER_TEXT_TOP)}%`;
    },

    Center(progress, arrImg, arrText, pos, moveInPos){
        const opacity = `${1 - progress * (1-OPACITY)}`;
        [arrImg[pos].style.left, arrText[pos].style.left] = [`${moveInPos}%`, `${moveInPos}%`];
        [arrImg[pos].style.opacity, arrText[pos].style.opacity] = [opacity, opacity];
        arrImg[pos].style.width = `${WIDTH_CENTER - progress * (WIDTH_CENTER - WIDTH_LEFT_RIGHT)}%`;
        arrText[pos].style.fontSize = `${FZ_CENTER - progress * (FZ_CENTER - FZ_LEFT_RIGHT)}px`;
        arrText[pos].style.lineHeight = `${LH_CENTER - progress * (LH_CENTER - LH_LEFT_RIGHT)}px`;
        arrText[pos].style.top = `${CENTER_TEXT_TOP + progress * (LEFT_TEXT_TOP - CENTER_TEXT_TOP)}%`;
    },
    
    checkColor(arrText, pos, header = null){
        if (!header){
            const check = arrText[pos].classList[0];
            if (check === 'first_header'){
                return colorText.css;
            } else if (check === 'second_header'){
                return colorText.html;
            } else {
                return colorText.js;
            }
        } else {
            return colorText[header];
        }
    },

    changeCenterColor(arrText, progress, pos){
        const colorRGB = this.checkColor(arrText, pos);
        arrText[pos].style.color = `rgb(${colorRGB[0] + progress * (255 - colorRGB[0])}, 
        ${colorRGB[1] + progress * (255 - colorRGB[1])}, 
        ${colorRGB[2] + progress * (255 - colorRGB[2])})`;
    },

    changeActiveColor(arrText, progress, pos, header){
        const colorRGB = this.checkColor(arrText, pos, header);
        arrText[pos].style.color = `rgb(${255 - progress * (255 - colorRGB[0])},
        ${255 - progress * (255 - colorRGB[1])}, 
        ${255 - progress * (255 - colorRGB[2])})`;
    },

    changeColorBlock(progress, RightLeftColorBlock, CenterColorBlock){
        const arr = [];
        const changeColorBlock = [];
        for (let i = 0; i < RightLeftColorBlock.length; i++){
            if (RightLeftColorBlock[i] - CenterColorBlock[i] >= 0){
                arr.push(progress * (RightLeftColorBlock[i] - CenterColorBlock[i]));
            } else {
                arr.push(-progress * (RightLeftColorBlock[i] - CenterColorBlock[i]));
            }

            if (CenterColorBlock[i] >= RightLeftColorBlock[i]){
                changeColorBlock.push(CenterColorBlock[i] - arr[i]);
            } else {
                changeColorBlock.push(CenterColorBlock[i] + arr[i]);
            }
        }

        for (let i = 0; i<changeColorBlock.length; i++){
            if((changeColorBlock[i]>RightLeftColorBlock[i]||changeColorBlock[i]<RightLeftColorBlock[i])&&progress>0.95){
                changeColorBlock[i] = RightLeftColorBlock[i];
            }
        }
        DIV_BLOCK_DESCR.style.background = `linear-gradient(140deg, rgb(9, 2, 46), 
        rgb(${changeColorBlock[0]}, ${changeColorBlock[1]}, ${changeColorBlock[2]}))`;
    }
};


// Создаём объект анимации
const Animator = {
    arrImg: null,
    arrText: null,
    active: null,
    obj: Move,

    createLeft: function(){
        this.left = this.active - 1 >= 0 ? this.active - 1 : 2;
    },

    createRight: function(){
        this.right = this.active + 1 <= 2 ?  this.active + 1 : 0;
    },

    changeStyle: function(direction){
        const change = (posActive) => {
            const styleBack = this.arrText[posActive];
            this.RightLeftColorBlock = colorBlock[styleBack.innerHTML];
            this.CenterColorBlock = colorBlock[this.arrText[this.active].innerHTML];
            this.header = styleBack.innerHTML;
            DIV_COLOR.style.backgroundColor = colors[this.header];

        };
        change(direction === 'right' ? this.left : this.right);
    },

    changeClass: function(duration){
        this.arrText[this.active].classList.remove('active');
        document.querySelector(`.${this.arrText[this.active].innerHTML}_col`).classList.add('none');
        if (duration === 'right'){
            this.arrText[this.left].classList.add('active');
            document.querySelector(`.${this.arrText[this.left].innerHTML}_col`).classList.remove('none');
        } else {
            this.arrText[this.right].classList.add('active');
            document.querySelector(`.${this.arrText[this.right].innerHTML}_col`).classList.remove('none');
        }
    },

    draw: function(progress, direction){
        if (direction === 'right'){
            // Передвигаем левый элемент
            this.obj.moveLeftInCenter(progress, this.arrImg, this.arrText, this.left, this.header);
            // Передвигаем центровой элемент
            this.obj.moveCenterInRight(progress, this.arrImg, this.arrText, this.active);
            // Передвигаем правый элемент
            this.obj.moveRightInLeft(progress, this.arrImg, this.arrText, this.right);
        } else {
            // Передвигаем правый элемент
            this.obj.moveRightInCenter(progress, this.arrImg, this.arrText, this.right, this.header);
            // Передвигаем центровой элемент
            this.obj.moveCenterInLeft(progress, this.arrImg, this.arrText, this.active);
            // Передвигаем левый элемент
            this.obj.moveLeftInRight(progress, this.arrImg, this.arrText, this.left); 
        }
        // Меняем градиент блока
        this.obj.changeColorBlock(progress, this.RightLeftColorBlock, this.CenterColorBlock);
    },
    easyOn: function(x, timeFraction){
        return Math.pow(timeFraction, 2) * ((x + 1) * timeFraction - x);
    },

    animation: function(direction){
        let startAnimation = null;
        requestAnimationFrame(function animate(time){

            if (!startAnimation){
                startAnimation = time;
            }
            let progress = Animator.easyOn(2.5, (time - startAnimation) / duration);
            Animator.draw(progress, direction);
            if (progress < 1) {requestAnimationFrame(animate);}

        });
    }


};




const duration = 1000;
let divLeft = document.querySelector('.left');
let divRight = document.querySelector('.right');

divRight.onclick = ()  => click('right');
divLeft.onclick = () => click('left');

