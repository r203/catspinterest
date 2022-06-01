const APIKey = 'e18d147e-1085-4104-b28b-ff159b131f07';
const catsList = document.querySelector('.cats-list');
const counts = 15;
const size = 'thumb';
let image_ids = [];

if(localStorage.wishlist) {
  image_ids = localStorage.wishlist.split(',')
}

const fetchData = async () => {
  let store = [];
  const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=${counts}&size=${size}`, {
    headers: {
      'X-Api-Key': APIKey
    },
  });
  const data = await response.json();

  if(Array.isArray(data)) {
    data.forEach(element => {
      store.push(element);
    });
  } else {
    store.push(data);
  }

  renderComponent(store);
}

if(location.pathname === '/wishlist.html') {
  image_ids.forEach(image_id => {
    fetchData(image_id);
  });
} else {
  fetchData();
}


function renderComponent(imagesArr) {
  imagesArr.forEach(image => {
    catsList.innerHTML +=
    `
      <li class="cat-item">
        <div class="cat-item__wrap"><img src="${image.url}" alt="cat" class="cat-item__image"></div>
        <button type="button" onclick="updateWishList('${image.id}')" class="cat-item__add-wishlist ${getEqualItem(image.id) ? 'checked' : ''}" data-id="${image.id}"></button>
      </li>
    `
  });
}

function updateWishList(id) {
  if(location.pathname === '/wishlist.html') {
    image_ids = image_ids.filter(filterefImage => filterefImage != id);
    localStorage.setItem('wishlist', image_ids);
    const currentWishListBtn = document.querySelector(`[data-id="${id}"]`);
    let parentCurrentWishListBtn = currentWishListBtn.closest('.cat-item');
    parentCurrentWishListBtn.remove();
  } else {
    if(!image_ids.includes(id)) {
      image_ids.push(id);
      localStorage.setItem('wishlist', image_ids);
      const currentWishListBtn = document.querySelector(`[data-id="${id}"]`);
      currentWishListBtn.classList.add('checked');
    } else {
      image_ids = image_ids.filter(filterefImage => filterefImage != id);
      localStorage.setItem('wishlist', image_ids);
      const currentWishListBtn = document.querySelector(`[data-id="${id}"]`);
      currentWishListBtn.classList.remove('checked');
    }
  }
}

function getEqualItem(id) {
  let acc;
  image_ids.forEach(el => {
    if (el === id) {
      acc = true;
    }
  });
  return acc;
}

var load = false;
window.addEventListener("scroll", function(){

  var block = document.querySelector('.cats-list');
  var counter = 1;

  var contentHeight = block.offsetHeight;      // 1) высота блока контента вместе с границами
  var yOffset       = window.pageYOffset;      // 2) текущее положение скролбара
  var window_height = window.innerHeight;      // 3) высота внутренней области окна документа
  var y             = yOffset + window_height;

  console.log('y: ',y);
  console.log('contentHeight: ',contentHeight);
  // если пользователь достиг конца
  if(y >= contentHeight)
  {
      //загружаем новое содержимое в элемент
      console.log('loading...');
      // contentHeight = block.offsetHeight;

      if(load == false) {
        fetchData();
        load = true;
          setTimeout(function () {
            load = false;
          }, 3000);

      }
      
      
  }
});