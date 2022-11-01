function loading(){
    let load = document.querySelector('.loading');
    let preload = document.querySelector('.preloader');
    return function(){
        let procent = parseInt(load.innerHTML);
        load.innerHTML = ++procent+'%';
        if (preload){preload.style.background = `rgba(0, 0, 0, ${0 + (procent/100)})`;}
        checkProcent(procent);
    };
}

function checkProcent(procent){
    if (procent === 40){
        document.querySelector('.loading').classList.add('active');
    } else if (procent === 100){
        setTimeout(removeTimeClass, 50);
    }    
}

function removeTimeClass(){
    clearTimeout(timeid);
    document.querySelector('.preloader').remove();
    document.querySelector('.none').classList.remove('none');

}


let procentAdd = loading();
let timeid = setTimeout(function run() {procentAdd(); setTimeout(run, 50);}, 50);