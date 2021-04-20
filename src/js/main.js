// тесты

const testAuto = document.querySelectorAll('.test-drive__text');
const testAutoDate = document.querySelectorAll('.test-drive__text--small');
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
  7: 'Оцените универсальность автомобиля в повседневных условиях',
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

  for (let i = 0; i < localStorage.length; i++) { // проверяем, есть ли в localStorage информация о пройденных тестах
    let key = localStorage.key(i);
    testAuto.forEach(auto => {
      if (auto.textContent === key) { // если уже тестировали автомобиль
        auto.nextElementSibling.textContent = localStorage.getItem(key); // добавляем дату прохождения

        auto.parentElement.classList.remove('test-drive__item--available'); // меняем отметку о прохождении
        auto.parentElement.classList.add('test-drive__item--completed');
        auto.removeAttribute('href');
      }
    })
  }
}

if (testConfirmAuto) { // проверяем находимся ли мы на странице test-confirm (подтверждение прохождения теста)
  testConfirmAuto.textContent = sessionStorage.getItem('testAuto'); // вставляем название авто
  testConfirmAutoSmall.textContent = sessionStorage.getItem('testAuto'); // вставляем название авто
}


if (testTitleCount) { // проверяем находимся ли мы на странице test (страница с тестами)
  let counter = sessionStorage.getItem('counter');
  const questionsCount = Object.keys(questions).length;
  testCounter.textContent = counter; // вставляем в счетчик вопросов номер
  question.textContent = `${questions[counter]}`; // берем из объекта вопрос
  testAutoName.textContent = sessionStorage.getItem('testAuto') // берем из хранилища название авто
  let rating;
  radio.forEach(item => {
    item.addEventListener('click', function () {
      rating = item.value
      button.removeAttribute('disabled')

      if (counter == Object.keys(questions).length) {
        button.textContent = 'Завершить';
      }
    })
  })

  button.addEventListener('click', function () {
    console.log(`Автомобиль ${sessionStorage.getItem('testAuto')} вопрос №${counter} оценка ${rating}`);
    button.setAttribute('disabled', 'true');
    radio.forEach(item => { // сбрасываем выбранные звезды
      item.checked = false;
    })

    if (counter == questionsCount) { // проверяем на количество вопросов, если все, то переходим на страницу подтверждения
      // сохраняем дату прохождения
      const date = new Date();
      let dd = date.getDate();
      let mm = date.getMonth() + 1;
      let yyyy = date.getFullYear();
      let hh = date.getHours();
      let min = date.getMinutes();
      if (dd < 10) {
        dd = '0' + dd
      }
      if (mm < 10) {
        mm = '0' + mm
      }
      const strDate = `Пройден ${dd}.${mm}.${yyyy} ${hh}:${min}`

      localStorage.setItem(`${sessionStorage.getItem('testAuto')}`, strDate) // пишем дату прохождения в localStorage

      window.location.href = "test-drive.html"
    } else {
      counter++;
      question.textContent = `${questions[counter]}`;
      testCounter.textContent = counter;
      testTitleCount.textContent = counter;
    }
  })
}


// qr scanner


const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const outputData = document.getElementById("outputData");
const qrWrong = document.querySelector(".qr__wrong");
const qrText = document.querySelector(".qr__text");

const urls = ['x6m', 'rsq8', 'range', 'gle63s', 'g63', 'dbx', 'cullinan', 'cayenne', 'bentayga'];

if (canvasElement) {
  /////////////
  const {createClient} = supabase
  supabase = createClient(supabaseUrl, supabaseKey);

  let cars = [];

  const getQRData = async () => {
    try {
      return await supabase
        .from('qr_data')
        .select('*');
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  getQRData().then(res => {
    cars = res.data
    // console.log(res)
    // console.log(cars)
  });



  /////////////////

  const qrcode = window.qrcode;

  const canvas = canvasElement.getContext("2d");

  let scanning = false;



  qrcode.callback = res => {
    // let id = cars.filter(function(e) {
    //   return e.id === res
    // })
    // console.log(id)
    // console.log(res)
    // if (urls.indexOf(res.split('-')[0]) < 0) { // проверяем полученный результат на соответствие url
    if (!id) {
      scanning = false;
      video.srcObject.getTracks().forEach(track => {
        track.stop();
      });
      canvasElement.hidden = true;
      // если url неверный, показываем ошибку и скрываем текст
      qrWrong.classList.add('qr__wrong--visible');
      qrText.classList.add('qr__text--hidden');
      console.log(res)
      console.log(id)
    } else { // если url верный, переходим на соответствующую страницу
      scanning = false
      video.srcObject.getTracks().forEach(track => {
        track.stop();
      });
      canvasElement.hidden = true;
      console.log(res)
      console.log(id)
      // document.location.href = `${res}.html`
    }
  };

  navigator.mediaDevices
    .getUserMedia({video: {facingMode: "environment"}})
    .then(function (stream) {
      scanning = true;
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
    // canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    canvas.drawImage(video, 0, 0);

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

// окно с изображением карты

var modal = document.getElementById('myModal');

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById('myImg');
var modalImg = document.getElementById("img01");
// var captionText = document.getElementById("caption");

if (modal) {
  img.onclick = function () {
    modal.style.display = "block";
    modalImg.src = modalImg.getAttribute('src');
    // modalImg.src = "/img/hotel-map.jpg";
    // captionText.innerHTML = this.alt;
  }

// Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }
}


// кнопка назад в хедере

const headerLink = document.querySelector('.header__link');

if (headerLink) {
  headerLink.addEventListener('click', function (e) {
    const testDriveHeader = document.querySelector(".test-drive__header");
    const academyHeader = document.querySelector('.academy__header');
    const programHeader = document.querySelector('.program__header');
    const feedbackHeader = document.querySelector('.feedback-submit__header');

    if (headerLink.parentNode === testDriveHeader || headerLink.parentNode === academyHeader || headerLink.parentNode === programHeader || headerLink.parentNode === feedbackHeader) {
      return;
    } else {
      e.preventDefault();
      window.history.back();
    }

  })
}

// генерация аватарок

const academyItems = document.querySelectorAll('.academy__item');

if (academyItems) {
  academyItems.forEach(item => {
    const academy = item.querySelector('.academy__text').textContent;
    const img = item.querySelector('.academy__img');
    const imgText = img.querySelector('span');
    const matches = academy.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '')

    imgText.textContent = matches;
  })
}


// supabase

// форма регистрации
const regForm = document.querySelector('.registration__form');

if (regForm) {
  const {createClient} = supabase
  supabase = createClient(supabaseUrl, supabaseKey);

  const regName = document.querySelector('input[name="name"]');
  const regSurname = document.querySelector('input[name="surname"]');
  const regDCName = document.querySelector('input[name="dc name"]');
  const regPosition = document.querySelector('input[name="position"]');


  regForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const user = {
      'firstName': regName.value,
      'secondName': regSurname.value,
      'dealerCenter': regDCName.value,
      'position': regPosition.value
    }

    const createUser = async () => {
      try {
        let newUser = await supabase
          .from('registered_users')
          .insert([
            user
          ])

        return localStorage.setItem('userID', newUser.data[0].id)
      } catch (error) {
        console.log('Error: ', error)
      }
    }

    createUser().then(() => window.location.href = '/');
  })
}

// список участников

const participantsList = document.querySelector('.participants__list');

if (participantsList) {
  const {createClient} = supabase
  supabase = createClient(supabaseUrl, supabaseKey);

  let users = []

  const getUsers = async () => {
    try {
      let user = await supabase
        .from('registered_users')
        .select('*')

      return user;
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  getUsers().then(response => {
    users = response.data;

    for (let i = 0; i < users.length; i++) {
      const item = document.createElement('li');
      item.classList.add('participants__item');
      const itemImg = document.createElement('div')
      itemImg.classList.add('participants__img');
      item.append(itemImg);
      const itemImgSpan = document.createElement('span');
      itemImg.append(itemImgSpan);
      const itemTextContainer = document.createElement('div');
      itemTextContainer.classList.add('participants__text-container');
      item.append(itemTextContainer);
      const itemText = document.createElement('span');
      itemText.classList.add('participants__text');
      itemTextContainer.append(itemText)
      const itemTextSmall = document.createElement('span');
      itemTextSmall.classList.add('participants__text--small');
      itemTextContainer.append(itemTextSmall)

      itemText.textContent = `${users[i].firstName} ${users[i].secondName}`;

      itemTextSmall.textContent = `${users[i].dealerCenter}, ${users[i].position}`

      participantsList.append(item)

      // генерируем аватарки
      const participantsItems = document.querySelectorAll('.participants__item');

      participantsItems.forEach(item => {
        const participant = item.querySelector('.participants__text').textContent;
        const img = item.querySelector('.participants__img');
        const imgText = img.querySelector('span');
        const matches = participant.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '')

        imgText.textContent = matches;
      })
    }
  })
}

// обратная связь

const feedbackForm = document.querySelector('.feedback__form');

if (feedbackForm) {
  const {createClient} = supabase
  supabase = createClient(supabaseUrl, supabaseKey);

  // меняем кнопку отправить при вводе текста
  const textarea = document.getElementById('feedback');
  const button = document.getElementById('feedback-btn');
  textarea.addEventListener('input', function () {
    button.disabled = this.value.trim().length === 0;
  })

  feedbackForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const newMessage = {
      'userId': localStorage.getItem('userID'),
      'feedback': textarea.value
    }

    const createMessage = async () => {
      try {
        return await supabase
          .from('users_feedback')
          .insert([
            newMessage
          ])
      } catch (error) {
        console.log('Error: ', error)
      }
    }

    createMessage().then(() => window.location.href = 'feedback-submit.html');
  })
}
