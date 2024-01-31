const cardsRestaurants = document.querySelector(".cards-restaurants");
const cardsMenu = document.querySelector(".cards-menu");
const menu = document.querySelector(".menu");
const sectionHeading = menu.querySelector(".section-heading");
const modalCart = document.querySelector(".modal-cart");
const buttonCart = document.querySelector(".button-cart");
const modalBody = document.querySelector(".modal-body");
const modalPricetag = document.querySelector(".modal-pricetag");
const sectionTitle = document.querySelector(".section-title");

const inputSearch = document.querySelector(".input-search");
const logoBtn = document.querySelector(".logo");
const offerBtn = document.querySelector("#offer-btn");
const clearBtn = document.querySelector(".clear-cart");
const modalForm = document.querySelector("#modal-form");
const modalBtn = document.querySelector(".modal-form-btn");

const modalName = modalForm.querySelector("#modal-name");
const modalAddress = modalForm.querySelector("#modal-address");
const modalNumber = modalForm.querySelector("#modal-number");
const modalBack = document.querySelector(".modal-back");
const order = document.querySelector("#offer-btn");
const sended = document.querySelector(".sended");
const cart = [];
const formData = new FormData();

const getData = async (url) => {
  const response = await fetch(url);
  try {
    return await response.json();
  } catch (err) {
    console.error("Ошибка", err, response.status);
  }
};

const createCardsRestaurant = ({
  name,
  stars,
  price,
  kitchen,
  image,
  products,
  time_of_delivery: timeOfDelivery,
}) => {
  const card = `
        <a class="card card-restaurant" data-products="${products}">
            <img src="${image}" alt="image" class="card-image"/>
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title">${name}</h3>
                    <span class="card-tag tag">${timeOfDelivery}</span>
                </div>
                <div class="card-info">
                    <div class="rating">${stars}</div>
                    <div class="price">От ${price} ТГ</div>
                    <div class="category">${kitchen}</div>
                </div>
            </div>
        </a>
    `;
  cardsRestaurants.insertAdjacentHTML("beforeend", card);
};

const createCardsGood = ({ id, name, description, price, image }) => {
  const card = `
        <div class="card">
            <img src="${image}" alt="image" class="card-image"/>
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title card-title-reg">${name}</h3>
                </div>
                <div class="card-info">
                    <div class="ingredients">${description}</div>
                </div>
                <div class="card-buttons">
                    <button class="button button-primary button-add-cart" id="${id}">
                        <span class="button-card-text">В корзину</span>
                        <img src="img/buy-img.png" class="buy-img">
                    </button>
                    <strong class="card-price-bold"> <span>${price}</span> ТГ </strong>
                </div>
            </div>
        </div>
    `;
  cardsMenu.insertAdjacentHTML("beforeend", card);
};

const showGoods = (e) => {
  const target = e.target;
  const restaurant = target.closest(".card-restaurant");

  const restaurantName = restaurant.querySelector(".card-title").textContent;
  const restaurantRating = restaurant.querySelector(".rating").textContent;
  const restaurantPrice = restaurant.querySelector(".price").textContent;
  const restaurantCategory = restaurant.querySelector(".category").textContent;

  const restaurantTitle = `
        <h2 class="section-title restaurant-title">${restaurantName}</h2>
        <div class="card-info">
            <div class="rating">
                ${restaurantRating}
            </div>
            <div class="price">${restaurantPrice}</div>
            <div class="category">${restaurantCategory}</div>
        </div>
    `;

  if (restaurant) {
    cardsRestaurants.style.display = "none";
    menu.classList.remove("hide");
    sectionHeading.style.display = "";
    sectionHeading.insertAdjacentHTML("beforeend", restaurantTitle);

    getData(`db/${restaurant.dataset.products}`).then((data) => {
      data.forEach(createCardsGood);
    });
  }
};

getData("db/partners.json").then((data) => {
  data.forEach(createCardsRestaurant);
});

const addToCart = (event) => {
  let target = event.target;
  const buyBtn = target.closest(".button-add-cart");

  if (buyBtn) {
    const card = target.closest(".card");
    const goodName = card.querySelector(".card-title-reg").textContent;
    const goodPrice = card.querySelector(".card-price-bold span").textContent;
    const goodId = buyBtn.id;

    const food = cart.find((item) => {
      if (item.goodName === goodName) {
        return item.goodName;
      }
    });
    if (food) {
      food.count += 1;
    } else {
      alert(`Товар ${goodName} добавлен в корзину`);

      cart.push({
        goodName: goodName,
        goodPrice: +goodPrice,
        count: 1,
      });
    }
    console.log(cart);
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

const renderCart = () => {
  const cartData = JSON.parse(localStorage.getItem("cart"));
  let totalPrice = 0;
  modalBody.innerHTML = "";
  if (cartData) {
    cartData.forEach((item) => {
      totalPrice += item.goodPrice * item.count;
      const foodRow = `
                <div class="food-row">
                    <span class="food-name">${item.goodName}</span>
                    <strong class="food-price"><span class="goodprice"> ${item.goodPrice} </span> <span> ТГ </span> </strong>
                    <div class="food-counter">
                        <button class="counter-button minus-btn">-</button>
                        <span class="counter">${item.count}</span>
                        <button class="counter-button plus-btn">+</button>
                    </div>
                </div>
            `;
      modalBody.insertAdjacentHTML("beforeend", foodRow);
      modalCart.classList.add("active");
    });
    modalPricetag.textContent = totalPrice + " ТГ";
  }
};

const showModalCart = () => {
  renderCart();

  if (modalBody.innerHTML == "") {
    alert("Корзина пуста");
  } else {
    const foodCounters = document.querySelectorAll(".food-counter");

    foodCounters.forEach((counter) => {
      counter.addEventListener("click", (e) => {
        const target = e.target;
        const count = counter.querySelector(".counter");
        let countValue = parseInt(count.textContent);
        let par = counter.closest(".food-row");
        let modalPrice = par.querySelector(".goodprice");
        let modalPriceValue = +modalPrice.textContent;
        if (target.classList.contains("plus-btn")) {
          countValue += 1;
          count.textContent = countValue;
          console.log(modalPriceValue);
        } else if (target.classList.contains("minus-btn")) {
          countValue = Math.max(0, countValue - 1);
          count.textContent = countValue;

          console.log(countValue);
        }
        modalPricetag.textContent = "";

        const foodRows = document.querySelectorAll(".food-row");
        cart.length = 0;
        foodRows.forEach((item) => {
          let goodPrice = +item.querySelector(".goodprice").textContent;
          let count = +item.querySelector(".counter").textContent;
          let totalPrice = +goodPrice * +count;
          modalPricetag.textContent = +modalPricetag.textContent + +totalPrice;
          let goodName = item.querySelector(".food-name").textContent;
          if (!count == 0) {
            cart.push({
              goodName: goodName,
              goodPrice: +goodPrice,
              count: +count,
            });
          }
          console.log(cart);
        });
        localStorage.setItem("cart", JSON.stringify(cart));
        modalPricetag.textContent = modalPricetag.textContent + " ТГ";
      });
    });
  }
};

const closeModalCart = (e) => {
  const target = e.target;
  const closeBtn = target.closest(".close");
  const modalContent = target.closest(".modal-dialog");
  if (closeBtn || !modalContent) {
    modalCart.classList.remove("active");
  }
};

const searchGoods = (e) => {
  const target = e.target;
  const value = target.value.toLowerCase();
  const goods = [];

  if (e.keyCode == 13) {
    if (value != "" && value.length >= 3) {
      inputSearch.value = "";
      getData("db/partners.json").then((data) => {
        const products = data.map((item) => item.products);
        products.forEach((restaurant) => {
          getData(`db/${restaurant}`)
            .then((data) => {
              goods.push(...data);
              const filteredGoods = goods.filter((item) =>
                item.name.toLowerCase().includes(value)
              );
              cardsMenu.textContent = "";
              cardsRestaurants.style.display = "none";
              sectionHeading.style.display = "none";
              menu.classList.remove("hide");
              sectionTitle.classList.add("hide");
              return filteredGoods;
            })
            .then((goods) => {
              goods.forEach(createCardsGood);
            });
        });
      });
    }
  }
};

const showHomePage = () => {
  cardsMenu.textContent = " ";
  sectionHeading.textContent = " ";
  cardsRestaurants.style.display = "flex";
  sectionTitle.classList.remove("hide");
};

const offerGoods = () => {
  const cartData = JSON.parse(localStorage.getItem("cart"));
  if (cartData.length != 0) {
    fetch("db/test.json", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-type": "application/json",
      },
      body: localStorage.getItem("cart"),
    });
  } else {
    alert("Корзина пуста");
  }
};

const formSending = () => {
  if (
    modalAddress.value == "" ||
    modalNumber.value == "" ||
    modalName.value == ""
  ) {
    alert("Введите данные");
  } else {
    toString(modalNumber.value);
    if (!modalNumber.length == 11 || !modalNumber.value.startsWith("87")) {
      alert("Неверный формат номера (87007777777)");
    } else {
      formData.append("address", modalAddress.value);
      formData.append("modalNumber", modalNumber.value);
      formData.append("name", modalName.value);
      formData.append("Order", cart);
      console.log(formData);
      fetch("https://jsonplaceholder.typicode.com/", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          modalBack.style.display = "none";
          return response.json();
        })
        .then((data) => {
          console.log("Данные отправлены");
          sended.style.display = "flex";
          setTimeout(() => {
            location.reload();
          }, 2500);
        })
        .catch((error) => console.log(error));
    }
  }
};
const sendingForm = (e) => {
  modalBack.style.display = "flex";
};
const cleaning = (e) => {
  e.preventDefault();

  if (!modalBody.innerHTML == "") {
    modalBody.innerHTML = "";
    modalPricetag.textContent = "0 ТГ";
    localStorage.clear();
    cart.length = 0;
  } else {
    alert("Корзина пуста");
  }
};

cardsRestaurants.addEventListener("click", showGoods);
cardsMenu.addEventListener("click", addToCart);
modalCart.addEventListener("click", closeModalCart);
buttonCart.addEventListener("click", showModalCart);

logoBtn.addEventListener("click", showHomePage);
inputSearch.addEventListener("keyup", searchGoods);
offerBtn.addEventListener("click", offerGoods);

modalBtn.addEventListener("click", formSending);
clearBtn.addEventListener("click", cleaning);
order.addEventListener("click", sendingForm);
