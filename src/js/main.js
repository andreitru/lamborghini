// тесты

const testAuto = document.querySelectorAll('.test-drive__text');
const testConfirmAuto = document.querySelector('.test-confirm__text');
const testConfirmAutoSmall = document.querySelector('.test-confirm__text--auto');
const testTitleCount = document.querySelector('.test__title--count');
const testCounter = document.querySelector('.test__counter--count');
const testAutoName = document.querySelector('.test__auto');
const radio = document.querySelectorAll('input[type="radio"]');
const button = document.querySelector('.test__btn');
const question = document.querySelector('.test__question');
const questions = {
  1: 'Оцените работу подвески',
  2: 'Оцените общий комфорт',
  3: 'Оцените комфорт задних пассажиров',
  4: 'Оцените оснащение и мультимедиа',
  5: 'Оцените управляемость и маневренность',
  6: 'Оцените эргономику автомобиля',
  7: 'Оцените универсальность в повседневных условиях',
  8: 'Оцените работу двигателя и КПП',
  9: 'Оцените ваши ощущения от динамики разгона'
}

if (testAuto) { // проверяем находимся ли мы на странице test-drive
  testAuto.forEach(auto => {
    auto.addEventListener('click', function () {
      sessionStorage.setItem('testAuto', auto.innerHTML)
      sessionStorage.setItem('counter', '1')
    })
  })
}

if (testConfirmAuto) { // проверяем находимся ли мы на странице test-confirm (подтверждение прохождения теста)
  testConfirmAuto.textContent = sessionStorage.getItem('testAuto'); // вставляем название авто
  testConfirmAutoSmall.textContent = sessionStorage.getItem('testAuto'); // вставляем название авто
}


if (testTitleCount) { // проверяем находимся ли мы на странице test (страница с тестами)
  let counter = sessionStorage.getItem('counter');
  testCounter.textContent = counter; // вставляем в счетчик вопросов номер
  question.textContent = `${questions[counter]}`; // берем из объекта вопрос
  testAutoName.textContent = sessionStorage.getItem('testAuto') // берем из хранилища название авто
  let rating;
  radio.forEach(item => {
    item.addEventListener('click', function () {
      rating = item.value
      button.removeAttribute('disabled')
    })
  })

  button.addEventListener('click', function () {
    console.log(`Автомобиль ${sessionStorage.getItem('testAuto')} вопрос №${counter} оценка ${rating}`);
    button.setAttribute('disabled', 'true');
    radio.forEach(item => { // сбрасываем выбранные звезды
      item.checked = false;
    })

    if (counter == Object.keys(questions).length) { // проверяем на количество вопросов, если все, то переходим на страницу подтверждения
      document.location.href = "test-submit.html"
    }

    counter++;
    question.textContent = `${questions[counter]}`;
    testCounter.textContent = counter;
    testTitleCount.textContent = counter;
  })
}


// qr scanner

const qrcode = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const outputData = document.getElementById("outputData");

if (canvasElement) {
  const canvas = canvasElement.getContext("2d");

  let scanning = false;

  qrcode.callback = res => {
    if (res) {
      scanning = false;
      video.srcObject.getTracks().forEach(track => {
        track.stop();
      });
      canvasElement.hidden = true;
      document.location.href = `${res}.html`
    }
  };

  navigator.mediaDevices
    .getUserMedia({video: {facingMode: "environment"}})
    .then(function (stream) {
      scanning = true;
      // qrResult.hidden = true;
      // btnScanQR.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });

  function tick() {
    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

    scanning && requestAnimationFrame(tick);
  }

  function scan() {
    try {
      qrcode.decode();
    } catch (e) {
      setTimeout(scan, 300);
    }
  }
}

