// variables

const cartBtn=document.querySelector('.cart-btn');
const closeCartBtn=document.querySelector('.close-cart');
const clearCartBtn=document.querySelector('.clear-cart');
const checkCartBtn=document.querySelector('.check-cart');
const cartDOM=document.querySelector('.cart');
const cartOverlay=document.querySelector('.cart-overlay');
const cartItems=document.querySelector('.cart-items');
const cartTotal=document.querySelector('.cart-total');
const cartContent=document.querySelector('.cart-content');
const productsDOM=document.querySelector('.products-center');
const btns=document.querySelectorAll('.bag-btn');


//CART
let cart=[];
//buttons 
let buttonsDOM=[];

//Getting the product
class Products{
 async getProducts()
 {
    try
    {
     let result= await fetch('https://63f643b459c944921f70c150.mockapi.io/products')
     let data=await result.json();
     let products=data;
     console.log(products);
     products=products.map(data=>{
        const name=data.name;
        const id=data.id;
        const image=data.photo;
        const price=data.price;
        return{name,id,image,price}
     })
     return products;
    }
    catch(error)
    {
        console.log("failed to get products");
    }
  
 }
}

//render products
class UI{
 renderProduct(products){
 console.log(products);
 let result='';
 products.forEach(product=>{
    result +=`
    <!-- single product -->
            <article class="product">
                <div class="img-container">
                    <img src="${product.image}" alt="" class="product-img">
                    <button class="bag-btn" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> add to bag
                    </button>
                </div>
                <h3>${product.name}</h3>
                <h4>$${product.price}</h4>
            </article>
            <!-- end of single product -->
    `;
 });
 productsDOM.innerHTML=result;
 }
 getBagButton()
 {
    const buttons=[...document.querySelectorAll('.bag-btn')];
    buttonsDOM=buttons;
    buttons.forEach((button)=>{
        let id=button.dataset.id;
        let inCart=cart.find(item => item.id===id);
        if(inCart)
        {
          button.innerHTML="in Bag";
          button.disabled=true;
        }
        button.addEventListener("click",(event) =>{
               event.target.innerText="In Bag";
               event.target.disabled=true;
               //get product from products
               let cartItem={...Storage.getProduct(id),amount:1};
               //add product to the cart
               cart=[...cart,cartItem];
               //save cart in local storage
               Storage.saveCart(cart);
               // set cart value
               this.setCartValues(cart);
               //render cart
               this.addCartItem(cartItem)
               //show the cart
               this.showCart()
        })
    });
 }
 setCartValues(cart)
 {
    let tempTotal=0;
    let itemsTotal=0;
    cart.map(item=>{
        tempTotal+=item.price* item.amount;
        itemsTotal+=item.amount;
    })
    cartTotal.innerText=parseFloat(tempTotal.toFixed(2))
    cartItems.innerText=itemsTotal;
 }
addCartItem(item){
    const div=document.createElement('div');
    div.classList.add('cart-item')
    div.innerHTML=`<img src="${item.image}" alt="">
                        <div>
                            <h4>${item.name}</h4>
                            <h5>${item.price}$</h5>
                            <span class="remove-item" data-id=${item.id}>remove</span>
                        </div>
                        <div>
                            <i class="fas fa-chevron-up" data-id=${item.id}></i>
                            <p class="item-amount">${item.amount}</p>
                            <i class="fas fa-chevron-down" data-id=${item.id}></i>
                        </div>`
                        cartContent.appendChild(div);
}
showCart()
{
    cartOverlay.classList.add('transparentBcg');
    cartDOM.classList.add('showCart')
}
    setupAPP()
    {
       cart= Storage.getCart();
       this.setCartValues(cart);
       this.populateCart(cart);
       cartBtn.addEventListener('click', this.showCart)
       closeCartBtn.addEventListener('click', this.hideCart)
    }
populateCart(cart)
{
    cart.forEach(item=>this.addCartItem(item))

} 

hideCart()
{
    cartOverlay.classList.remove('transparentBcg');
    cartDOM.classList.remove('showCart')
}
cartLogic()
{
    //clear cart button
    clearCartBtn.addEventListener('click', ()=>{
      this.clearCart();  
    })
    checkCartBtn.addEventListener('click', ()=>{
      this.checkCart();  
    })
    //cart functionality
    cartContent.addEventListener("click", event=>{
        if(event.target.classList.contains('remove-item'))
        {
            let removeItem=event.target;
            let id=removeItem.dataset.id;
            cartContent.removeChild(removeItem.parentElement.parentElement);
            this.removeItem(id);
        }
        else if(event.target.classList.contains('fa-chevron-up'))
        {
            let addMount=event.target;
            let id=addMount.dataset.id;
            let tempItem=cart.find(item => item.id===id);
            tempItem.amount=tempItem.amount+1;
            Storage.saveCart(cart);
            this.setCartValues(cart);
            addMount.nextElementSibling.innerText=tempItem.amount;
        }
        else if(event.target.classList.contains('fa-chevron-down'))
        {
            let lowerAmount=event.target;
            let id=lowerAmount.dataset.id;
            let tempItem=cart.find(item => item.id===id);
            tempItem.amount=tempItem.amount-1;
            if(tempItem.amount>0)
            {
                Storage.saveCart(cart);
                this.setCartValues(cart);
                lowerAmount.previousElementSibling.innerText=tempItem.amount;
            }
            else
            {
                cartContent.removeChild(lowerAmount.parentElement.parentElement)
                this.removeItem(id);
            }
        }
    });
}
clearCart()
{
    let cartItems=cart.map(item=>item.id);
    cartItems.forEach(id=>this.removeItem(id));
    while(cartContent.children.length>0)
    {
        cartContent.removeChild(cartContent.children[0])
    }
    this.hideCart();
}
checkCart()
{
    let cartItems=cart.map(item=>item.id);
    cartItems.forEach(id=>this.removeItem(id));
    while(cartContent.children.length>0)
    {
        cartContent.removeChild(cartContent.children[0])
    }
    this.hideCart();
}
removeItem(id)
{
    cart=cart.filter(item=>item.id !==id)
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button=this.getSingleButton(id);
    button.disabled=false;
    button.innerHTML=`<i class="fas fa-shopping-cart"></i>add to bag`
}
getSingleButton(id)
{
    return buttonsDOM.find(button=>button.dataset.id===id)
}
}
//local Storage
class Storage{
static saveProducts(products)
{
    localStorage.setItem("products",JSON.stringify(products));
}
static getProduct(id){
    let products=JSON.parse(localStorage.getItem('products'))
    return products.find(products=>products.id===id)
}
static saveCart()
{
    localStorage.setItem('cart',JSON.stringify(cart));
}
static getCart()
{
    return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[]
}
}

document.addEventListener("DOMContentLoaded", ()=>{
    const ui=new UI();
    const products=new Products();

    //set up APP
    ui.setupAPP();
    //get all products
    products.getProducts().then(products=>{ui.renderProduct(products);
    Storage.saveProducts(products);}).then(()=>{
        ui.getBagButton();
        ui.cartLogic();
    });
});