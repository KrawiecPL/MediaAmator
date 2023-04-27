let currentProducts = products;
let categories = new Set();
const productsSection = document.querySelector("section");

let basketCount = 0;
const basketCountContainer = document.querySelector(
	"header .basket .basket-button .basket-content-count "
);

let basket = [];
let basketTotal = 0;

const searchBar = document.querySelector(".search-bar");

function updateBasketCounter() {
	basketCountContainer.innerHTML = basketCount;
	if (basketCount === 0) {
		basketCountContainer.classList.remove("active");
	} else {
		basketCountContainer.classList.add("active");
	}
}

function renderProducts(items) {
	productsSection.innerHTML = "";
	items.forEach((item) => {
		const newProduct = document.createElement("div");

		newProduct.className = `product-item ${item.sale ? "on-sale" : ""}`;
		newProduct.innerHTML = `
            <img src="${item.image}" alt="product-image">
            <div class="product-name">${item.name}</div>
            <div class="product-description">${item.description}</div>
            <div class="product-price">
                <span class="price">${item.price.toFixed(2)} zł</span>
                <span class="price-sale">${
									item.sale
										? (item.price - item.saleAmount).toFixed(2)
										: item.price.toFixed(2)
								} zł</span>	
            </div>
            <div data-id="${
							item.id
						}" class="product-addtobasket">Dodaj do koszyka</div>
            <div class="product-sale-info">Promocja</div>
        `;
		productsSection.appendChild(newProduct);

		const addToBasketButtons = document.querySelectorAll(
			".product-item .product-addtobasket"
		);
		addToBasketButtons.forEach((addBtn) => {
			addBtn.addEventListener("click", productAddToBasket);
		});
	});
}

let basketItemNumber = 0;

function productAddToBasket(e) {
	const addedProduct =
		currentProducts[
			currentProducts.findIndex((product) => product.id == e.target.dataset.id)
		];
	basket.push([basketItemNumber, addedProduct]);
	basketItemNumber++;
	// console.log(basket);
	// basket.forEach(basketProduct => {
	//     console.log(basketProduct.price - (basketProduct.sale ? basketProduct.saleAmount : 0));
	//     basketTotal += basketProduct.price - (basketProduct.sale ? basketProduct.saleAmount : 0);
	// });

	basketTotal +=
		addedProduct.price - (addedProduct.sale ? addedProduct.saleAmount : 0);
	const basketContainer = document.querySelector(
		".basket-container .basket-list"
	);
	basketContainer.innerHTML = "";
	basket.forEach((item) => {
		const newBasketItem = document.createElement("div");
		newBasketItem.className = "basket-item";
		newBasketItem.dataset.basketId = item[0];
		newBasketItem.dataset.itemId = item[1].id;
		newBasketItem.innerHTML = `
            <img src="${item[1].image}" alt="basket-item">
            <span class="item-name">${item[1].name}</span>
            <span class="item-price">${(item[1].sale
							? item[1].price - item[1].saleAmount
							: item[1].price
						).toFixed(2)} zł</span>
            <span data-id="" class="item-remove"><i class="fa-solid fa-trash"></i></span>
        `;
		basketContainer.appendChild(newBasketItem);
	});

	const totalAmountContainer = document.querySelector(
		".basket-container .basket-total-amount span"
	);

	totalAmountContainer.innerHTML = `${basketTotal.toFixed(2)} zł`;

	const basketItemRemoveBtn = document.querySelectorAll(
		".basket-container .basket-list .basket-item .item-remove"
	);

	basketItemRemoveBtn.forEach((removeBtn) => {
		removeBtn.addEventListener("click", removeBasketItem);
	});

	basketCount++;
	updateBasketCounter();
}

function removeBasketItem(e) {
	const productElement = e.target.parentElement.parentElement;
	const product =
		currentProducts[
			currentProducts.findIndex(
				(product) => product.id == productElement.dataset.itemId
			)
		];
	basketTotal -= product.price - (product.sale ? product.saleAmount : 0);
	for (let i = 0; i < basket.length; i++) {
		if (basket[i][0] == productElement.dataset.basketId) {
			basket.splice(i, 1);
			break;
		}
	}
	productElement.remove();
	const basketContainer = document.querySelector(
		".basket-container .basket-list"
	);
	if (basketContainer.innerHTML == "") {
		basketContainer.innerHTML = "Brak produktów w koszyku";
	}
	const totalAmountContainer = document.querySelector(
		".basket-container .basket-total-amount span"
	);

	totalAmountContainer.innerHTML = `${basketTotal.toFixed(2)} zł`;

	basketCount--;
	updateBasketCounter();
}

function renderCategories(items) {
	items.forEach((item) => {
		categories.add(item.category);
	});
	categories = ["wszystkie", ...categories];
	const categoriesSection = document.querySelector(
		"main aside .categories-buttons"
	);

	categories.forEach((category, index) => {
		const newCategory = document.createElement("button");

		newCategory.innerHTML = category;
		index == 0 ? newCategory.classList.add("active") : "";
		newCategory.dataset.category = category;
		categoriesSection.appendChild(newCategory);
	});
}

document.addEventListener("load", renderProducts(currentProducts));
document.addEventListener("load", renderCategories(currentProducts));
let categoryButtons = document.querySelectorAll(
	".categories-container .categories-buttons button"
);
categoryButtons.forEach((btn) => {
	btn.addEventListener("click", (e) => {
		const category = e.target.dataset.category;

		const selectCategoryProducts = currentProducts.filter((item) => {
			if (item.category === category || category === "wszystkie") {
				return item;
			}
		});
		renderProducts(selectCategoryProducts);

		let button = e.target;

		categoryButtons.forEach((btn2) => {
			btn2.classList.remove("active");
		});

		button.classList.add("active");
	});
});

searchBar.addEventListener("input", (e) => {
	const searchTerm = e.target.value;
	const foundProducts = currentProducts.filter((product) => {
		if (
			product.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
		) {
			return product;
		}
	});
	let button = document.querySelector(
		".categories-container .categories-buttons button[data-category=wszystkie]"
	);

	categoryButtons.forEach((btn2) => {
		btn2.classList.remove("active");
	});

	button.classList.add("active");
	renderProducts(foundProducts);
});
