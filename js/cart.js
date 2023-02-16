
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




const fetchCartProducts = async () =>{
    let allCartProducts = document.getElementById('all-cart-products')
    allCartProducts.innerHTML = ''
    try{
        let res = await fetch("https://products-99930-default-rtdb.firebaseio.com/products.json")
        let products = await res.json()
        
        let filteredProducts = products.product.filter(prod => JSON.parse(localStorage.getItem('cart').includes(prod.id)))
        filteredProducts.forEach(product =>{
            allCartProducts.innerHTML += `
            <div class="container">
            <div class="row mb-5">
              <div class="col">
                <img src=${product.url} alt="" class="img-fluid">
              </div>
              <div class="col">
                <p class="text-uppercase">
                  100.00$
                </p>
              </div>
              <div class="col">
                <span class="material-icons" onclick="deleteHandler('${product.id}')"> delete </span>
              </div>
            </div>
          </div>
            `
        })
        
    }catch(error){
        console.log(error)
    }
}
fetchCartProducts()

function deleteHandler(id){
    Confirm.open({
        title: 'Cart Product',
        message: 'Are you sure you want to delete the cart product?',
        onok: () => {
          
            let cart = JSON.parse(localStorage.getItem('cart'))

            let cartIndex = cart.indexOf(id)
            cart.splice(cartIndex, 1)
            localStorage.setItem('cart', JSON.stringify(cart))
            fetchCartProducts()
        }
      })
}

const subscribeform = document.getElementById("subscribe--form")
const subscribeforminput = document.querySelector("#subscribe--form input")

subscribeform.onsubmit = (e) =>{
    e.preventDefault()
    let email = subscribeforminput.value.trim().toLowerCase()
    console.log(email)
    
    fetch("https://newsletter-plne.onrender.com/subscribe", {
        method:'post',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({email:email})
    })
    .then(res => res.json())
    .then(data =>{
        if(data.success){
            Confirm.open({
                title: 'Success',
                message: data.success,
              })
              
        }else{
            Confirm.open({
                title: 'Error',
                message: data.error
              })
        }
    })
    .catch(error => console.log(error))
    subscribeforminput.value = ''
}