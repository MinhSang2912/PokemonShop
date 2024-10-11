function UpperCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function changeColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
}

const pokemonTypes = [
  { type: "Grass", color: "#78C850" },
  { type: "Poison", color: "#A040A0" },
  { type: "Fire", color: "#F08030" },
  { type: "Flying", color: "#A890F0" },
  { type: "Water", color: "#6890F0" },
  { type: "Bug", color: "#A8B820" },
  { type: "Normal", color: "#A8A878" },
  { type: "Electric", color: "#F8D030" },
  { type: "Ground", color: "#E0C068" },
  { type: "Fairy", color: "#EE99AC" },
  { type: "Fighting", color: "#C03028" },
  { type: "Psychic", color: "#F85888" },
  { type: "Rock", color: "#B8A038" },
  { type: "Ice", color: "#98D8D8" },
  { type: "Dragon", color: "#7038F8" },
  { type: "Ghost", color: "#705898" },
  { type: "Steel", color: "#B8B8D0" },
];

// Shopping
document.addEventListener("DOMContentLoaded", function () {
  const Shopping = document.getElementById("Shopping-Card");
  let cart = [];
  const apiUrl = `http://localhost:3000/emojis`;
  const itemsPerPage = 20;
  let currentPage = 1;
  let totalItems = [];

  // Tạo Thẻ
  function createCard(item) {
    const div = document.createElement("div");
    div.classList.add("Setup-Card");

    // Name
    const span = document.createElement("span");
    span.classList.add("Name");
    span.textContent = UpperCase(item.name);
    span.style.color = changeColor();

    // Type
    const pType = document.createElement("p");
    pType.classList.add("intro");
    const typeData = pokemonTypes.find((t) =>
      item.type.some((type) => t.type === type)
    );
    pType.style.color = typeData.color;
    pType.textContent = `Hệ: ${item.type.join(", ")}`;

    // Money
    const value = document.createElement("p");
    value.classList.add("money");
    value.textContent = `${item.value}$`;

    // Info
    const intro = document.createElement("p");
    intro.classList.add("intro");
    intro.textContent = `Info: ${item.introduction}`;

    // Image
    const newImg = document.createElement("img");
    newImg.classList.add("img-Card");
    newImg.src = item.src;

    // Thêm sự kiện click cho Pokémon
    div.addEventListener("click", () => openModal(item));

    // Thêm các phần tử vào div
    div.append(newImg, span, pType, intro, value);

    return div;
  }

  // tạo trang
  function displayItems(page) {
    Shopping.innerHTML = "";
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToShow = totalItems.slice(startIndex, endIndex);

    itemsToShow.forEach((item) => {
      const card = createCard(item);
      Shopping.appendChild(card);
    });

    document.getElementById("pageNumber").textContent = `Page ${page}`;
  }

  // Tạo modal
  function openModal(item) {
    const modal = document.getElementById("modal-shop");
    const modalLeft = document.getElementById("modal-left");
    const modalRight = document.getElementById("modal-right");
    const exitButton = document.getElementById("exit");

    // Xóa nội dung cũ của modal
    modalLeft.innerHTML = "";
    modalRight.innerHTML = "";

    // Cập nhật nội dung modal bằng cách tạo card
    const modalCard = createCard(item);

    // img (left)
    const imgmodal = modalCard.querySelector("img");
    imgmodal.classList.add("img-modal");
    // Thêm các phần tử vào modalleft
    modalLeft.appendChild(imgmodal);

    // Tạo và thêm type (right)
    // name
    const spanElement = modalCard.querySelector(".Name");
    spanElement.classList.add("name-modal");
    // type
    const typeModal = document.createElement("p");
    typeModal.classList.add("intro-modal");
    const typeData = pokemonTypes.find((t) =>
      item.type.some((type) => t.type === type)
    );
    typeModal.style.color = typeData.color;
    typeModal.textContent = `Type: ${item.type.join(", ")}`;

    //  value
    const valueModal = document.createElement("p");
    valueModal.classList.add("money-modal");
    valueModal.textContent = `Value: ${item.value}$`;

    // introduction
    const introModal = document.createElement("p");
    introModal.classList.add("intro-modal");
    introModal.textContent = `Info: ${item.introduction}`;

    // quantity
    const quantityModal = document.createElement("p");
    quantityModal.classList.add("money-modal");
    quantityModal.textContent = `Số lượng: ${item.quantity || 0}`;

    // Thêm nút "Hủy" và "Thêm Vào Giỏ Hàng"
    const div = document.createElement("div");
    div.classList.add("modal-footer-right");
    const exitModal = document.createElement("span");
    exitModal.classList.add("exit");
    exitModal.textContent = "Hủy";
    const buyModal = document.createElement("span");
    buyModal.classList.add("Buy");
    buyModal.textContent = "Thêm Vào Giỏ Hàng";

    // Số lượng mua
    const divCount = document.createElement("div");
    divCount.classList.add("divCount");
    let Count = 1;
    const minus = document.createElement("span");
    minus.classList.add("list-count");
    minus.textContent = "-";
    const QuantityCount = document.createElement("span");
    QuantityCount.textContent = `${Count}`;
    const plus = document.createElement("span");
    plus.classList.add("list-count");
    plus.textContent = "+";
    divCount.append(minus, QuantityCount, plus);

    // Hàm cập nhật trạng thái của nút
    function updateButtonStates() {
      minus.style.pointerEvents = Count <= 1 ? "none" : "auto";
      plus.style.pointerEvents = Count >= item.quantity ? "none" : "auto";
    }
    // Cộng
    plus.addEventListener("click", () => {
      if (Count < item.quantity) {
        Count++;
        QuantityCount.textContent = `${Count}`;
        updateButtonStates();
      }
    });
    // Trừ
    minus.addEventListener("click", () => {
      if (Count > 1) {
        Count--;
        QuantityCount.textContent = `${Count}`;
        updateButtonStates();
      }
    });
    updateButtonStates();

    // Thêm sản phẩm vào giỏ hàng
    buyModal.addEventListener("click", () => {
      addToCart(item, Count);
      modal.style.display = "none";
    });

    // Thêm các phần tử thông tin vào modalRight
    div.append(exitModal, buyModal);
    modalRight.append(
      spanElement,
      typeModal,
      valueModal,
      introModal,
      quantityModal,
      divCount,
      div
    );

    // Hiển thị modal
    modal.style.display = "flex";

    // Gắn sự kiện đóng modal
    exitModal.onclick = () => {
      modal.style.display = "none";
    };
  }

  // Thêm thẻ vào Order Shop
  function addToCart(item, quantity) {
    const existingItem = cart.find((cartItem) => cartItem.name === item.name);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...item, quantity });
    }

    CartShop(); // Cập nhật hiển thị giỏ hàng
  }

  // Order Shop
  function CartShop() {
    const Cart = document.getElementById("CartShopSection");
    Cart.innerHTML = ""; // Xóa nội dung cũ
    if (cart.length === 0) {
      const p = document.createElement("p");
      p.textContent = "Giỏ hàng của bạn đang trống.";
      Cart.appendChild(p);
      return;
    }

    // tạo thẻ
    cart.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("Cart-setup");
      const Cart = document.getElementById("CartShopSection");
      const CartRight = document.createElement("div");
      CartRight.classList.add("CartRight");
      const CartLeft = document.createElement("div");
      CartLeft.classList.add("CartLeft");
      const img = document.createElement("img");
      img.src = item.src;
      const name = document.createElement("span");
      name.classList.add("name-Cart");
      name.classList.add("Name");
      name.textContent = item.name;

      const quantity = document.createElement("p");
      quantity.classList.add("Qty");
      quantity.textContent = `Số lượng: ${item.quantity}`;

      const total = document.createElement("p");
      total.classList.add("Cart-total");
      total.textContent = `Tổng giá: ${item.value * item.quantity}$`;

      const Buy = document.createElement("p");
      Buy.classList.add("opc");
      Buy.textContent = "Buy";

      CartRight.append(name, quantity, total, Buy);
      CartLeft.append(img);
      div.append(CartLeft, CartRight);
      Cart.appendChild(div);
    });
  }

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      totalItems = data;
      displayItems(currentPage);
    })
    .catch((error) => {
      console.log("Lỗi API Pokémon!", error);
    });

  // Hiệu ứng + - số lượng pokemon
  document.getElementById("prevBtn").addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      displayItems(currentPage);
    }
  });

  document.getElementById("nextBtn").addEventListener("click", function () {
    if (currentPage * itemsPerPage < totalItems.length) {
      currentPage++;
      displayItems(currentPage);
    }
  });
});

// ChangPage
document.addEventListener("DOMContentLoaded", function () {
  // Đổi trang
  const changePage = document.querySelectorAll(".menu-header");
  let activeSection = document.querySelector(".setup.active");
  changePage.forEach((menuItem) => {
    menuItem.addEventListener("click", () => {
      if (activeSection) {
        activeSection.classList.remove("active");
        activeSection.style.display = "none";
      }
      const targetId = menuItem.id + "Section"; // CHO TARGETID LA ID CO DUOI LA SECTION
      const targetSection = document.getElementById(targetId); // lay  TARGETID
      if (targetSection) {
        targetSection.classList.add("active");
        targetSection.style.display = "block";
        activeSection = targetSection;
      }
    });
  });

  // Trang Mua hang
  const close = document.querySelector(".ti-close");
  const modalOder = document.getElementById("modal-Order");
  close.addEventListener("click", () => {
    modalOder.style.display = "none";
  });
  const Buyall = document.getElementById("Order-Right");
  Buyall.addEventListener("click", () => {
    modalOder.style.display = "flex";
  });

  // Trang Order
  const Click = document.querySelectorAll(".Click");
  let CartActive = document.querySelector(".activeShop");
  Click.forEach((item) => {
    item.addEventListener("click", () => {
      if (CartActive) {
        CartActive.classList.remove("activeShop");
        document.querySelector(".bgCl")?.classList.remove("bgCl");
      }
      const targetIdOrder = item.id + "Section";
      const targetSectionOrder = document.getElementById(targetIdOrder);
      if (targetSectionOrder) {
        targetSectionOrder.classList.add("activeShop");
        item.classList.add("bgCl");
        CartActive = targetSectionOrder;
      }
    });
  });
});
