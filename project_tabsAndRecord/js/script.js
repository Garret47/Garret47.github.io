window.addEventListener('DOMContentLoaded', () => {
    // TABS

    const tabContent = document.querySelectorAll('.tabcontent'),
          tabHeaderParent = document.querySelector('.tabheader__items'),
          tabHeaderItem = tabHeaderParent.querySelectorAll('.tabheader__item');
    let indexLastActive = null;
    tabContent.forEach(item => item.style.display = 'none');
    tabHeaderItem.forEach(item => item.classList.remove('tabheader__item_active'));

    function hideTab(i){
        tabContent[i].style.display = 'none';
        tabHeaderItem[i].classList.remove('tabheader__item_active');
    }


    function showTab(i = 0){
        tabContent[i].style.display = 'block';
        tabHeaderItem[i].classList.add('tabheader__item_active');
        indexLastActive = i;
    }

    showTab();

    tabHeaderParent.addEventListener('click', (event) => {
        const target = event.target;
        if (target && target.matches('.tabheader__item')){
            tabHeaderItem.forEach((item, i) => {
                if (target === item){
                    hideTab(indexLastActive);
                    showTab(i);
                }
            });
        }
    });

    // TIMER

    const deadline = '2022-11-17';

    function setZero(num){
        if (num < 10){
            return `0${num}`;
        } else {
            return num;
        }
    }

    function calculationTime(endtime){
        const t = Date.parse(endtime) - Date.parse(new Date());
        let days, hours, minutes, seconds;
        if (t <= 0){
            days = 0;
            hours =0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(t / (1000*60*60*24));
            hours = Math.floor((t / (1000*60*60)) % 24);
            minutes = Math.floor((t / (1000*60)) % 60);
            seconds = Math.floor((t / 1000) % 60);
        }   
        return {
            total: t,
            days,
            hours,
            minutes,
            seconds,
        };
    }

    function setClock(selector, endtime){
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds');
        
        let timeID = setTimeout(function run(){
            UpdateClock();
            timeID = setTimeout(run, 1000);
        }, 0);
        
        function UpdateClock(){
            const t = calculationTime(endtime);
            if (t.total < 0){
                clearTimeout(timeID);
            }
            days.innerHTML = setZero(t.days);
            hours.innerHTML = setZero(t.hours);
            minutes.innerHTML = setZero(t.minutes);
            seconds.innerHTML = setZero(t.seconds);
        }
    }

    setClock('.timer', deadline);

    //Modal

    const btns = document.querySelectorAll('button[data-model]'),
          modal = document.querySelector('.modal'),
          modalClose = modal.querySelector('div[data-close]'),
          timeID = setTimeout(clickButtonModal, 5000);

    function clickButtonModal(){
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        clearTimeout(timeID);
        
    }

    function clickModalClose(){
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    function showModalByScroll(){
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
            clickButtonModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    btns.forEach(item => item.addEventListener('click', clickButtonModal));
    modalClose.addEventListener('click', clickModalClose);
    modal.addEventListener('click', (event) => {
        if (event.target === modal){
            clickModalClose();
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape' && modal.style.display === 'block'){
            clickModalClose();
        }
    });

    window.addEventListener('scroll', showModalByScroll);

    // Menu

    class Menu{
        constructor(img, subtitle, description, price, classElem, alt){
            this.img = img;
            this.subtitle = subtitle;
            this.description = description;
            this.price = price;
            this.alt = alt;
            this.elemParent = document.querySelector('.menu__field > .container');
            this.object = document.createElement('div');
            this.object.classList.add(classElem);
            this.placeElement();
        }

        placeElement(){
            const imgElem = this.placeImg(),
                  hSubElem = this.placeSubtitleElem(),
                  descrElem = this.placeDescr(),
                  dividerElem = this.placeDivider(),
                  priceElem = this.placePrice();
            this.object.innerHTML = imgElem + hSubElem + descrElem + dividerElem + priceElem;
            this.elemParent.append(this.object);
        }

        placeImg(){
            return `<img src=${this.img} alt="${this.alt}">`;
        }

        placeSubtitleElem(){
            return `<h3 class="menu__item-subtitle">Меню "${this.subtitle}"</h3>`;
        }

        placeDescr(){
            return `<div class="menu__item-descr">${this.description}</div>`;
        }

        placeDivider(){
            return `<div class="menu__item-divider"></div>`;
        }

        placePrice(){
            return `
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>`;
        }
    }

    const menuItem = new Menu("img/tabs/post.jpg", "Постное", "Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.",
    430, "menu__item", "post");


    const form = document.querySelectorAll('form'),
          message = {
            loading: 'Загрузка',
            success: 'Спасибо, скоро мы с вами свяжемся',
            fail: 'Что-то пошло не так',
          };
    
    form.forEach(item => postData(item));

    function postData(form){
        form.addEventListener('submit', (event) =>{
            event.preventDefault();

            const messageStatus = document.createElement('div');
            messageStatus.classList.add('status');
            messageStatus.textContent = message.loading;
            form.append(messageStatus);

            const request = new XMLHttpRequest();
            request.open('POST', 'js/server.js');

            const formData = new FormData(form);
            console.log(formData);
            request.send(formData);

            request.addEventListener('load', () => {
                console.log('111');
                if (request.status === 200){
                    console.log(request.response);
                    messageStatus.textContent = message.success;
                } else {
                    messageStatus.textContent = message.fail;
                }
            });
        });
    }
});