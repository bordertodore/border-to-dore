const WA="8801333162597";
const products=[
{id:1,name:"Minimalist Rosehip Oil + VC-IP 3%",category:"Skin Care",price:1250,oldPrice:1500,icon:"🧴",desc:"India থেকে সংগ্রহ করা জনপ্রিয় skincare product."},
{id:2,name:"Wild Stone Perfume Combo — Pack of 4",category:"Perfume",price:1999,oldPrice:2400,icon:"🌿",desc:"Edge, Forest Spice, Hydra Energy ও Ultra Sensual — 4টি fragrance."},
{id:3,name:"Carlton London Women Oud Gift Set",category:"Perfume",price:2999,oldPrice:3500,icon:"🌸",desc:"Premium women's fragrance gift set."},
{id:4,name:"Fastrack Woody Oud EDP — 100ml",category:"Perfume",price:1999,oldPrice:0,icon:"🖤",desc:"Woody Oud fragrance for men."},
{id:5,name:"Fino Premium Touch Hair Mask & Shampoo",category:"Hair Care",price:1899,oldPrice:2200,icon:"💆",desc:"Professional deep conditioning hair care."},
{id:6,name:"OGX Strength & Length Keratin Oil Shampoo",category:"Hair Care",price:1750,oldPrice:0,icon:"🧴",desc:"Keratin proteins and argan oil formula."},
{id:7,name:"WishCare Lip Balm",category:"Beauty",price:650,oldPrice:750,icon:"💄",desc:"Daily lip care."},
{id:8,name:"Medicube Niacinamide Cream",category:"Skin Care",price:1850,oldPrice:2100,icon:"✨",desc:"Korean skincare product sourced for you."},
{id:9,name:"Bravo Vibe Extrait De Parfum — 100ml",category:"Perfume",price:1850,oldPrice:2750,icon:"🌹",desc:"Vanilla, apple and tonka bean notes."},
{id:10,name:"MUUCHSTAC Ocean Face Wash",category:"Skin Care",price:850,oldPrice:1000,icon:"🫧",desc:"Anti acne & pimple, skin brightening face wash."},
{id:11,name:"Dot & Key Skincare Products",category:"Beauty",price:950,oldPrice:0,icon:"🧴",desc:"আপনার পছন্দের Dot & Key products."},
{id:12,name:"Wild Stone CODE Premium Perfume — 100ml",category:"Perfume",price:1450,oldPrice:1700,icon:"🕶️",desc:"Long lasting premium perfume for men."}
];
let cart=JSON.parse(localStorage.getItem("btdCart")||"[]");
const categories=[
["💄","Beauty"],["🧴","Skin Care"],["💆","Hair Care"],["🌸","Perfume"],["👕","Fashion"],["🧸","Toys"],["🛍️","Lifestyle"],["🇮🇳","Indian Products"]
];
function money(n){return "৳"+Number(n).toLocaleString("en-BD")}
function init(){
 document.getElementById("categoryGrid").innerHTML=categories.map(c=>`<div class="cat" onclick="selectCategory('${c[1]}')"><span class="cat-icon">${c[0]}</span><span>${c[1]}</span></div>`).join("");
 document.getElementById("categoryFilter").innerHTML='<option value="all">সব ক্যাটাগরি</option>'+[...new Set(products.map(p=>p.category))].map(c=>`<option>${c}</option>`).join("");
 renderProducts(products); updateCart();
}
function productCard(p){
let img=p.image?`<img src="${p.image}" alt="${p.name}">`:`<div class="placeholder">${p.icon}</div>`;
return `<article class="product"><div class="product-img" onclick="showProduct(${p.id})">${img}</div>${p.oldPrice?`<span class="discount">${Math.round((1-p.price/p.oldPrice)*100)}% OFF</span>`:""}<div class="product-info"><h3>${p.name}</h3><div><span class="old">${p.oldPrice?money(p.oldPrice):""}</span><span class="price">${money(p.price)}</span></div><div class="product-actions"><button onclick="addToCart(${p.id})">Add to Cart</button><button class="buy" onclick="buyNow(${p.id})">Order Now</button></div></div></article>`
}
function renderProducts(list){document.getElementById("productGrid").innerHTML=list.map(productCard).join("");document.getElementById("noProducts").hidden=list.length>0}
function selectCategory(cat){document.getElementById("categoryFilter").value=cat;filterCategory();document.getElementById("products").scrollIntoView()}
function filterCategory(){let c=document.getElementById("categoryFilter").value;document.getElementById("productTitle").textContent=c==="all"?"জনপ্রিয় পণ্য":c;renderProducts(c==="all"?products:products.filter(p=>p.category===c))}
function searchProducts(mobile=false){let value=(mobile?document.getElementById("mobileSearchInput").value:document.getElementById("searchInput").value).toLowerCase();if(document.getElementById("searchInput") && !mobile) document.getElementById("mobileSearchInput").value=value;renderProducts(products.filter(p=>(p.name+" "+p.category).toLowerCase().includes(value)));document.getElementById("products").scrollIntoView({behavior:"smooth"})}
function showProduct(id){let p=products.find(x=>x.id===id);let img=p.image?`<img src="${p.image}" alt="${p.name}">`:`<div class="product-img"><span class="placeholder">${p.icon}</span></div>`;document.getElementById("modalContent").innerHTML=`<div class="modal-product"><div>${img}</div><div><span class="eyebrow">${p.category}</span><h2>${p.name}</h2><p>${p.desc}</p><h2>${money(p.price)}</h2><button class="btn primary" onclick="addToCart(${p.id});hideProduct();openCart()">Add to Cart</button> <button class="btn" onclick="buyNow(${p.id})">Order Now</button></div></div>`;document.getElementById("productModal").classList.add("show")}
function hideProduct(){document.getElementById("productModal").classList.remove("show")}
function closeModal(e){if(e.target.id==="productModal")hideProduct()}
function addToCart(id){let item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart()}
function buyNow(id){let p=products.find(x=>x.id===id);let text=`Hello BORDER TO DORE,%0A%0AI want to order:%0A${encodeURIComponent(p.name)}%0APrice: ${money(p.price)}%0A%0AName:%0APhone:%0AAddress:`;window.open(`https://wa.me/${WA}?text=${text}`,"_blank")}
function saveCart(){localStorage.setItem("btdCart",JSON.stringify(cart));updateCart()}
function updateCart(){document.getElementById("cartCount").textContent=cart.reduce((a,b)=>a+b.qty,0);let el=document.getElementById("cartItems");if(!cart.length){el.innerHTML='<div class="empty">আপনার Cart খালি।</div>';document.getElementById("cartTotal").textContent="৳0";return}let total=0;el.innerHTML=cart.map(i=>{let p=products.find(x=>x.id===i.id);total+=p.price*i.qty;return `<div class="cart-item"><div class="placeholder">${p.icon}</div><div><h4>${p.name}</h4><b>${money(p.price*i.qty)}</b><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button> ${i.qty} <button onclick="changeQty(${p.id},1)">+</button></div></div></div>`}).join("");document.getElementById("cartTotal").textContent=money(total)}
function changeQty(id,n){let i=cart.find(x=>x.id===id);if(i)i.qty+=n;cart=cart.filter(x=>x.qty>0);saveCart()}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("overlay").classList.add("show")}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("overlay").classList.remove("show")}
function checkoutWhatsApp(){if(!cart.length)return;let total=0;let lines=cart.map(i=>{let p=products.find(x=>x.id===i.id);total+=p.price*i.qty;return `• ${p.name} x${i.qty} — ${money(p.price*i.qty)}`}).join("%0A");window.open(`https://wa.me/${WA}?text=Hello%20BORDER%20TO%20DORE%2C%0A%0AMy%20order:%0A${lines}%0A%0ATotal:%20${money(total)}%0A%0AName:%0APhone:%0AAddress:`,"_blank")}
function toggleMenu(){document.getElementById("menu").classList.toggle("open")}
function goHome(){window.scrollTo({top:0,behavior:"smooth"})}
init();
