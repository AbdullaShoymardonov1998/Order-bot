const axios = require("axios");

const data = [
  {
    uz: "Sabzavot va mevalar",
    ru: "Овощи и фрукты",
    category: [
      {
        uz: "Sabzavotlar",
        ru: "Овощи",
      },
      {
        uz: "Meva",
        ru: "Фрукты",
      },
      {
        uz: "Ko'katlar",
        ru: "Зелень",
      },
      {
        uz: "Quritilgan mevalar",
        ru: "Сухофрукты",
      },
    ],
  },
  {
    uz: "Ichimliklar",
    ru: "Напитки",
    category: [
      {
        uz: "Kvas, Mors",
        ru: "Квас, Морс",
      },
      {
        uz: "Sharbatlar",
        ru: "Соки",
      },
      {
        uz: "Suv",
        ru: "Вода",
      },
      {
        uz: "Gazlangan ichimliklar",
        ru: "Газированные напитки",
      },
      {
        uz: "Salqin ichimliklar",
        ru: "Прохладительные напитки",
      },
      {
        uz: "Energetik ichimliklar",
        ru: "Энергетические напитки",
      },
    ],
  },
  {
    uz: "Sut va sut mahsulotlari",
    ru: "Молоко и молочные изделия",
    category: [
      {
        uz: "Sut",
        ru: "Молоко",
      },
      {
        uz: "Qatiq/Ryajenka/Ayron",
        ru: "Кефир/Ряженка/Айран",
      },
      {
        uz: "Yogurt",
        ru: "Йогурт",
      },
      {
        uz: "Qaymoq/Slivki",
        ru: "Каймак/Сливки",
      },
      {
        uz: "Smetana",
        ru: "Сметана",
      },
      {
        uz: "Tvorog",
        ru: "Творог",
      },
      {
        uz: "Siroklar",
        ru: "Сырки",
      },
      {
        uz: "Sariyog'",
        ru: "Масло сливочное",
      },
      {
        uz: "Pishloqlar",
        ru: "Сыры",
      },
      {
        uz: "Suluguni",
        ru: "Сулугуни",
      },
      {
        uz: "Brinza",
        ru: "Брынза",
      },
      {
        uz: "Tuxumlar",
        ru: "Яйца",
      },
    ],
  },
  {
    uz: "Go'sht va go'sht mahsulotlari",
    ru: "Мясо и мясные изделия",
    category: [
      {
        uz: "Mol go'shti",
        ru: "Говядина",
      },
      {
        uz: "Qo'y go'shti",
        ru: "Баранина",
      },
      {
        uz: "Parranda go'shti",
        ru: "Мясо птицы",
      },
      {
        uz: "Quyon go'shti",
        ru: "Крольчатина",
      },
      {
        uz: "Baliq",
        ru: "Свежая рыба",
      },
      {
        uz: "Baliq mahsulotlari",
        ru: "Рыбные изделия",
      },
      {
        uz: "Kolbasa mahsulotlari",
        ru: "Колбасные изделия",
      },
      {
        uz: "Sosiskalar",
        ru: "Сосиски",
      },
      {
        uz: "Go'shtli delikateslar",
        ru: "Мясные деликатесы",
      },
    ],
  },
  {
    uz: "Yuvish vositalari",
    ru: "Моющие средства",
    category: [
      {
        uz: "Kir yuvish kukunlari",
        ru: "Стиральные порошки",
      },
      {
        uz: "Kiyimni parvarish qilish uchun vositalar",
        ru: "Средства по уходу за бельем",
      },
      {
        uz: "Yuvish vositalari",
        ru: "Моющие средства",
      },
      {
        uz: "Gubkalar/Lattalar/Salfetkalar",
        ru: "Губки/Тряпки/Салфетки",
      },
    ],
  },
  {
    uz: "Baqqollik mahsulotlari",
    ru: "Бакалея",
    category: [
      {
        uz: "Yormalar qadoqda",
        ru: "Крупы в упаковке",
      },
      {
        uz: "Un",
        ru: "Мука",
      },
      {
        uz: "Shakar/Tuz",
        ru: "Сахар/Соль",
      },
      {
        uz: "Makaron mahsulotlari",
        ru: "Макаронные изделия",
      },
      {
        uz: "O'simlik yog'i",
        ru: "Масло",
      },
      {
        uz: "Asal/Murabbo",
        ru: "Мёд/Варенье",
      },
      {
        uz: "Margarin",
        ru: "Маргарин",
      },
      {
        uz: "Quruq nonushtalar",
        ru: "Сухие завтраки",
      },
      {
        uz: "Tez tayorlanadigan mahsulotlar",
        ru: "Продукты быстрого приготовления",
      },
      {
        uz: "Ketchuplar/Souslar, Mayonez,Sirop",
        ru: "Кетчупы/Соусы/Майонез/Сироп",
      },
      {
        uz: "Pishiriqlar uchun ziravorlar/aralashmalar",
        ru: "Приправы/Специи/Смеси для выпечки",
      },
      {
        uz: "Pista/Chipslar",
        ru: "Семечки/Чипсы",
      },
    ],
  },
  {
    uz: "Choy/Qahva",
    ru: "Чай/Кофе",
    category: [
      {
        uz: "Qora choy",
        ru: "Чай чёрный",
      },
      {
        uz: "Ko'k choy",
        ru: "Чай зеленый",
      },
      {
        uz: "Kofe/Qaymoq",
        ru: "Кофе/Сливки",
      },
    ],
  },
  {
    uz: "Non mahsulotlari",
    ru: "Хлебо-булочные изделия",
    category: [
      {
        uz: "Yangi pishiriqlar",
        ru: "Свежая выпечка",
      },
      {
        uz: "Batonlar/Obinonlar",
        ru: "Батоны/Лепешки",
      },
      {
        uz: "Kepakli non/pistali non",
        ru: "Хлеб с отрубями/с семечками",
      },
      {
        uz: "Sushkalar/suxariklar",
        ru: "Сушки/сухари",
      },
      {
        uz: "Lavash",
        ru: "Лаваш",
      },
    ],
  },
  {
    uz: "Tortlar va shirinliklar",
    ru: "Торты и сладости",
    category: [
      {
        uz: "Tortlar va pirojnoelar",
        ru: "Торты и пирожные",
      },
      {
        uz: "Pecheniye/Vafli/Pryaniklar",
        ru: "Печенье/Вафли/Пряники",
      },
      {
        uz: "Diabetik mahsulotlari",
        ru: "Диабетические продукты",
      },
      {
        uz: "Boshqa shirinliklar",
        ru: "Прочие сладости",
      },
      {
        uz: "Shokolad mahsulotlari",
        ru: "Шоколадные изделия",
      },
    ],
  },
  {
    uz: "Tayyor taomlar",
    ru: "Готовые блюда",
    category: [
      {
        uz: "Salatlar",
        ru: "Салаты",
      },
      {
        uz: "Sharqona shirinliklar",
        ru: "Восточные сладости",
      },
      {
        uz: "Sendvichlar",
        ru: "Сэндвичи",
      },
    ],
  },
  {
    uz: "Bolalar uchun",
    ru: "Для детей",
    category: [
      {
        uz: "Bolalar aksessuarlari",
        ru: "Детские аксессуары",
      },
      {
        uz: "Chaqaloq oziq-ovqati",
        ru: "Детское питание",
      },
      {
        uz: "Tagliklar",
        ru: "Подгузники",
      },
      {
        uz: "Gigiena va parvarish",
        ru: "Гигиена и уход",
      },
      {
        uz: "O'yinchoqlar",
        ru: "Игрушки",
      },
    ],
  },
  {
    uz: "Konserva mahsulotlari",
    ru: "Консервированная продукция",
    category: [
      {
        uz: "Baliqli/Go'shtli konservalar",
        ru: "Рыбные/Мясные консервы",
      },
      {
        uz: "Tomat pastasi/Andjika",
        ru: "Томатная паста/Аджика",
      },
      {
        uz: "Mevali/Sabzavotli konservalar",
        ru: "Фруктовые/Овощные консервы",
      },
    ],
  },
  {
    uz: "Maishiy mahsulotlar",
    ru: "Хозяйственные товары",
    category: [
      {
        uz: "Paketlar/Qog'ozlar/Plyonka/Zar qog'oz",
        ru: "Пакеты/Бумаги/Пленка/Фольга",
      },
      {
        uz: "Bir martalik idishlar",
        ru: "Посуда одноразовая",
      },
      {
        uz: "Havo tozalagichlar",
        ru: "Освежители",
      },
      {
        uz: "Shamlar/Gugurt",
        ru: "Свечи/Спички",
      },
      {
        uz: "Hasharotlarga qarshi vositalar",
        ru: "Средства от насекомых",
      },
      {
        uz: "Uy uchun",
        ru: "Для дома",
      },
      {
        uz: "Poyabzal uchun krem va sprey",
        ru: "Крем и спрей для обуви",
      },
      {
        uz: "Lampalar/Batareykalar",
        ru: "Лампочки/Батарейки",
      },
      {
        uz: "Oshxona uchun mahsulotlar",
        ru: "Все для кухни",
      },
      {
        uz: "Avtomobil aksessuarlari",
        ru: "Аксессуары для авто",
      },
    ],
  },
  {
    uz: "Gigiena",
    ru: "Гигиена",
    category: [
      {
        uz: "Oyoqlar uchun vositalar",
        ru: "Средства для ног",
      },
      {
        uz: "Salfetkalar",
        ru: "Салфетки",
      },
      {
        uz: "Hojatxona qog'ozi",
        ru: "Туалетная бумага",
      },
      {
        uz: "Ayollar gigiyenasi",
        ru: "Женская гигиена",
      },
      {
        uz: "Soqol olish uchun",
        ru: "Для бритья",
      },
      {
        uz: "Sochni parvarish qilish",
        ru: "Уход за волосами",
      },
      {
        uz: "Yuzni parvarish qilish",
        ru: "Уход за лицом",
      },
      {
        uz: "Badanni parvarish qilish",
        ru: "Уход за телом",
      },
      {
        uz: "Og'iz bo'shlig'ini parvarish qilish",
        ru: "Уход за полостью рта",
      },
      {
        uz: "Atirsovun",
        ru: "Мыло туалетное",
      },
      {
        uz: "Qo'llar va tirnoqlar uchun vositalar",
        ru: "Средства для рук и ногтей",
      },
      {
        uz: "Boshqalar",
        ru: "Прочие",
      },
    ],
  },
  {
    uz: "Uy hayvonlari uchun mahsulotlar",
    ru: "Товары для домашних животных",
    category: [
      {
        uz: "Mushuklar uchun",
        ru: "Для кошек",
      },
      {
        uz: "Itlar uchun",
        ru: "Для собак",
      },
    ],
  },
  {
    uz: "Muzlatilgan mahsulotlar",
    ru: "Замороженные продукты",
    category: [
      {
        uz: "Muzqaymoq",
        ru: "Мороженое",
      },
      {
        uz: "Yarim tayyor mahsulotlar",
        ru: "Полуфабрикаты",
      },
      {
        uz: "Dengiz mahsulotlari",
        ru: "Морепродукты",
      },
      {
        uz: "Pazandalik",
        ru: "Кулинария",
      },
    ],
  },
  {
    uz: "Kantselyariya mahsulotlari",
    ru: "Канцелярские товары",
    category: [
      {
        uz: "Kantselyariya mahsulotlari",
        ru: "Канцелярские товары",
      },
    ],
  },
  {
    uz: "To'qimachilik",
    ru: "Текстиль",
    category: [
      {
        uz: "Erkaklar uchun",
        ru: "Мужской",
      },
      {
        uz: "Xotin-qizlar",
        ru: "Женский",
      },
      {
        uz: "Bolalar",
        ru: "Детский",
      },
      {
        uz: "Boshqalar",
        ru: "Прочие",
      },
    ],
  },
];

const token = "Bearer x";

const url = "https://api.micromarket.uz/v1/dashboard/category";

// Function to send requests using Axios
async function sendRequest(UZ, RU, parent) {
  try {
    const response = await axios.post(
      url,
      {
        title: {
          UZ,
          RU,
        },
        parent,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(response.data.data._id); // Process the response here
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Function to delay execution for a given number of milliseconds
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Iterate over the data array
async function iterateData() {
  for (const item of data) {
    const response = await sendRequest(item.uz, item.ru, null); // Send the request and wait for the response
    //console.log(response.data._id);
    // Iterate over the category array of each item
    for (const categoryItem of item.category) {
      await sendRequest(categoryItem.uz, categoryItem.ru, response.data._id); // Send the request for each category and wait for the response

      await delay(1000); // Delay for 1 second
    }

    await delay(1000); // Delay for 1 second
  }
}

iterateData();
