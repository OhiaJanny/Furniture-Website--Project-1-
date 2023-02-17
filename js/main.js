const Confirm = {
    open (options) {
        options = Object.assign({}, {
            title: '',
            message: '',
            okText: 'OK',
            cancelText: 'Cancel',
            onok: function () {},
            oncancel: function () {}
        }, options);
        
        const html = `
            <div class="confirm">
                <div class="confirm__window">
                    <div class="confirm__titlebar">
                        <span class="confirm__title">${options.title}</span>
                        <button class="confirm__close">&times;</button>
                    </div>
                    <div class="confirm__content">${options.message}</div>
                    <div class="confirm__buttons">
                        <button class="confirm__button confirm__button--ok confirm__button--fill">${options.okText}</button>
                        <button class="confirm__button confirm__button--cancel">${options.cancelText}</button>
                    </div>
                </div>
            </div>
        `;

        const template = document.createElement('template');
        template.innerHTML = html;

        // Elements
        const confirmEl = template.content.querySelector('.confirm');
        const btnClose = template.content.querySelector('.confirm__close');
        const btnOk = template.content.querySelector('.confirm__button--ok');
        const btnCancel = template.content.querySelector('.confirm__button--cancel');

        confirmEl.addEventListener('click', e => {
            if (e.target === confirmEl) {
                options.oncancel();
                this._close(confirmEl);
            }
        });

        btnOk.addEventListener('click', () => {
            options.onok();
            this._close(confirmEl);
        });

        [btnCancel, btnClose].forEach(el => {
            el.addEventListener('click', () => {
                options.oncancel();
                this._close(confirmEl);
            });
        });

        document.body.appendChild(template.content);
    },

    _close (confirmEl) {
        confirmEl.classList.add('confirm--close');

        confirmEl.addEventListener('animationend', () => {
            document.body.removeChild(confirmEl);
        });
    }
};

// Fetch All Products

const fetchAllProducts = async (location) => {
    console.log(location)
    let allFeaturedProducts = document.getElementById("all-featured-products");

    allFeaturedProducts.innerHTML = '';
    try{
        let res = await fetch("https://products-99930-default-rtdb.firebaseio.com/products.json")
        let products = await res.json()

        let productsArray;

        if(location){
            productsArray = products.product.filter(prod => prod.location === location)
        }else{
            productsArray = products.product
        }

        console.log(productsArray)
        productsArray.forEach(product =>{
            allFeaturedProducts.innerHTML += `
            <div class="col-10 mx-auto col-md-6 col-lg-4">
            <div class="featured-container p-5">
              <img src=${product.url} alt="" width="300" height="300">
              <a class="featured-store-link text-capitalize" onclick="addToCart('${product.id}')">add to cart</a>
            </div>
            <h6 class="text-capitalize text-center my-2">
              ${product.name}
            </h6>
            <h6 class="text-center">
              <span class="text-muted old-price mx-2">$200</span>
              <span>$100</span>
            </h6>
          </div>
            `
        })
        
    }catch(error){
        console.log(error)
    }
}

function addToCart(id){
    if(localStorage.getItem('cart')){
        let cart = JSON.parse(localStorage.getItem('cart'))
        
        let cartIndex = cart.indexOf(id)

        if(cartIndex === -1){
            cart.push(id)
            Confirm.open({
                title: 'Cart',
                message: 'Product added to Cart ',
              })
        }else{
            Confirm.open({
                title: 'Cart',
                message: 'Product already exist in the cart ',
              })
        }

        localStorage.setItem('cart', JSON.stringify(cart))
    }else{
        localStorage.setItem('cart', JSON.stringify([id]))
    }
}

fetchAllProducts()


document.querySelectorAll(".shop-by-location").forEach(location =>{
    location.addEventListener('click', (e)=>{
        let loc = e.target.textContent.trim()
        fetchAllProducts(loc)
    })
})