const STORAGE_KEY = "b2d_products_v1";
const CART_KEY = "b2d_cart_v1";
const ADMIN_SESSION = "b2d_admin_session";
const WHATSAPP = "8801333162597";

const categories = ["All", "Beauty", "Fragrance", "Fashion", "Toys", "Grocery", "Other"];

const demoProducts = [
  {id:cryptoId(),name:"Wild Stone CODE Perfume 100ml",category:"Fragrance",image:"",regular:2500,sale:2200,description:"Premium long-lasting fragrance for men."},
  {id:cryptoId(),name:"Minimalist Rosehip Oil + VC-IP 3%",category:"Beauty",image:"",regular:1800,sale:1599,description:"A premium skincare product sourced from India."},
  {id:cryptoId(),name:"Carlton London Meadow Perfume 100ml",category:"Fragrance",image:"",regular:2850,sale:2550,description:"Elegant fragrance with a premium feel."},
  {id:cryptoId(),name:"Fino Premium Touch Hair Mask",category:"Beauty",image:"",regular:2200,sale:1999,description:"Deep conditioning hair treatment."}
];

let products = load(STORAGE_KEY, demoProducts);
let cart = load(CART_KEY, []);
let selectedCategory = "All";

function cryptoId(){
  return (crypto.randomUUID ? crypto.randomUUID() : Date.now()+"-"+Math.random().toString(16).slice(2));
}
function load(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  }catch(e){ return fallback; }
}
function save(key,value){ localStorage.setItem(key, JSON.stringify(value)); }
function money(n){ return "৳" + Number(n||0).toLocaleString("en-US"); }
function discountOf(p){
  if(Number(p.regular)>Number(p.sale) && Number(p.regular)>0) return Math.round((1-p.sale/p.regular)*100);
  return 0;
}
function esc(v){
  return String(v??"").replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
function imgTag(url, alt=""){
  return url ? `<img src="${esc(url)}" alt="${esc(alt)}" loading="lazy" onerror="this.style.display='none';this.parentElement.querySelector('.placeholder')?.classList.remove('hidden')">` : "";
}
function renderCategories(){
  const row = document.getElementById("categoryRow");
  row.innerHTML = categories.map(c=>`<button class="category-btn ${selectedCategory===c?"active":""}" data-category="${esc(c)}">${c==="All"?"✨ সব":c}</button>`).join("");
  row.querySelectorAll("[data-category]").forEach(btn=>btn.onclick=()=>{
    selectedCategory=btn.dataset.category; renderCategories(); renderProducts();
  });
}
function renderProducts(){
  const q = document.getElementById("searchInput").value.trim().toLowerCase();
  const list = products.filter(p=>
    (selectedCategory==="All" || p.category===selectedCategory) &&
    (!q || `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q))
  );
  const grid=document.getElementById("productGrid");
  document.getElementById("emptyProducts").classList.toggle("hidden", list.length!==0);
  grid.innerHTML=list.map(p=>{
    const d=discountOf(p);
    return `<article class="product-card">
      <div class="product-image">
        ${imgTag(p.image,p.name)}
        <span class="placeholder ${p.image?"hidden":""}">🛍️</span>
        ${d?`<span class="discount">${d}% OFF</span>`:""}
      </div>
      <div class="product-info">
        <div class="product-category">${esc(p.category)}</div>
        <div class="product-name">${esc(p.name)}</div>
        <div class="prices"><span class="sale">${money(p.sale)}</span>${Number(p.regular)>Number(p.sale)?`<span class="regular">${money(p.regular)}</span>`:""}</div>
        <div class="card-actions">
          <button class="small-btn" onclick="viewProduct('${p.id}')">Details</button>
          <button class="small-btn dark" onclick="addToCart('${p.id}')">Add to Cart</button>
        </div>
      </div>
    </article>`;
  }).join("");
}
function viewProduct(id){
  const p=products.find(x=>x.id===id); if(!p)return;
  const d=discountOf(p);
  document.getElementById("productDetails").innerHTML=`<div class="product-detail">
    <div class="detail-image">${imgTag(p.image,p.name)}<span class="placeholder ${p.image?"hidden":""}">🛍️</span></div>
    <div class="detail-content">
      <span class="section-kicker">${esc(p.category)}</span>
      <h2>${esc(p.name)}</h2>
      <div class="prices"><span class="sale">${money(p.sale)}</span>${Number(p.regular)>Number(p.sale)?`<span class="regular">${money(p.regular)}</span>`:""} ${d?`<span class="discount">${d}% OFF</span>`:""}</div>
      <p>${esc(p.description||"Original & authentic product sourced from India.")}</p>
      <button class="primary-btn full" onclick="addToCart('${p.id}');closeModal('productModal')">🛒 Add to Cart</button>
      <button class="outline-btn full" style="margin-top:8px" onclick="directOrder('${p.id}')">💬 Order Now</button>
    </div>
  </div>`;
  openModal("productModal");
}
function addToCart(id){
  const p=products.find(x=>x.id===id); if(!p)return;
  const item=cart.find(x=>x.id===id);
  if(item)item.qty++;
  else cart.push({id,qty:1});
  save(CART_KEY,cart); renderCart(); updateCartCount();
}
function updateCartCount(){ document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0); }
function renderCart(){
  const box=document.getElementById("cartItems");
  if(!cart.length){box.innerHTML=`<div class="empty-state">আপনার Cart এখনো খালি।</div>`;document.getElementById("cartTotal").textContent=money(0);return;}
  let total=0;
  box.innerHTML=cart.map(item=>{
    const p=products.find(x=>x.id===item.id); if(!p)return "";
    total+=Number(p.sale)*item.qty;
    return `<div class="cart-item">
      <div class="cart-thumb">${imgTag(p.image,p.name)}<span class="placeholder ${p.image?"hidden":""}">🛍️</span></div>
      <div><strong>${esc(p.name)}</strong><div class="qty"><button onclick="changeQty('${p.id}',-1)">−</button><span>${item.qty}</span><button onclick="changeQty('${p.id}',1)">+</button><button class="remove" onclick="removeCart('${p.id}')">Remove</button></div></div>
      <strong>${money(p.sale*item.qty)}</strong>
    </div>`;
  }).join("");
  document.getElementById("cartTotal").textContent=money(total);
}
function changeQty(id,n){
  const item=cart.find(x=>x.id===id); if(!item)return;
  item.qty+=n;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);
  save(CART_KEY,cart);renderCart();updateCartCount();
}
function removeCart(id){cart=cart.filter(x=>x.id!==id);save(CART_KEY,cart);renderCart();updateCartCount();}
function directOrder(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  const msg=`আসসালামু আলাইকুম, আমি BORDER TO DORE থেকে অর্ডার করতে চাই।%0A%0AProduct: ${encodeURIComponent(p.name)}%0APrice: ${encodeURIComponent(money(p.sale))}%0AQuantity: 1`;
  window.open(`https://wa.me/${WHATSAPP}?text=${msg}`,"_blank");
}
function cartOrder(){
  if(!cart.length)return;
  const lines=cart.map(item=>{const p=products.find(x=>x.id===item.id);return p?`• ${p.name} × ${item.qty} = ${money(p.sale*item.qty)}`:"";}).filter(Boolean);
  const total=cart.reduce((s,i)=>{const p=products.find(x=>x.id===i.id);return s+(p?p.sale*i.qty:0)},0);
  const msg=`আসসালামু আলাইকুম, BORDER TO DORE-এ আমার অর্ডার:%0A%0A${encodeURIComponent(lines.join("\n"))}%0A%0ATotal: ${encodeURIComponent(money(total))}%0A%0Aনাম:%0Aঠিকানা:%0Aমোবাইল:`;
  window.open(`https://wa.me/${WHATSAPP}?text=${msg}`,"_blank");
}
function openModal(id){document.getElementById(id).classList.remove("hidden")}
function closeModal(id){document.getElementById(id).classList.add("hidden")}

function populateCategorySelect(){
  document.getElementById("productCategory").innerHTML=categories.filter(x=>x!=="All").map(c=>`<option value="${c}">${c}</option>`).join("");
}
function adminOpen(){
  openModal("adminModal");
  if(sessionStorage.getItem(ADMIN_SESSION)==="1") showAdminPanel();
  else showAdminLogin();
}
function showAdminLogin(){document.getElementById("adminLogin").classList.remove("hidden");document.getElementById("adminPanel").classList.add("hidden")}
function showAdminPanel(){document.getElementById("adminLogin").classList.add("hidden");document.getElementById("adminPanel").classList.remove("hidden");renderAdminProducts();resetForm()}
function renderAdminProducts(){
  document.getElementById("adminProductCount").textContent=`(${products.length})`;
  document.getElementById("adminProductList").innerHTML=products.map(p=>`
    <div class="admin-product">
      <div class="admin-thumb">${imgTag(p.image,p.name)}<span class="placeholder ${p.image?"hidden":""}">🛍️</span></div>
      <div><h4>${esc(p.name)}</h4><p>${esc(p.category)} · ${money(p.sale)}</p></div>
      <div class="admin-actions"><button onclick="editProduct('${p.id}')">✏️ Edit</button><button onclick="deleteProduct('${p.id}')">🗑️ Delete</button></div>
    </div>`).join("");
}
function resetForm(){
  document.getElementById("productForm").reset();
  document.getElementById("productId").value="";
  document.getElementById("saveProductBtn").textContent="➕ Add Product";
  document.getElementById("cancelEditBtn").classList.add("hidden");
  document.getElementById("productCategory").value="Beauty";
}
function editProduct(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  document.getElementById("productId").value=p.id;
  document.getElementById("productName").value=p.name;
  document.getElementById("productCategory").value=p.category;
  document.getElementById("productImage").value=p.image||"";
  document.getElementById("regularPrice").value=p.regular;
  document.getElementById("salePrice").value=p.sale;
  document.getElementById("productDescription").value=p.description||"";
  document.getElementById("saveProductBtn").textContent="💾 Update Product";
  document.getElementById("cancelEditBtn").classList.remove("hidden");
  document.querySelector(".admin-card").scrollTop=0;
}
function deleteProduct(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  if(!confirm(`"${p.name}" delete করবেন?`))return;
  products=products.filter(x=>x.id!==id);save(STORAGE_KEY,products);renderProducts();renderAdminProducts();
}
document.getElementById("searchInput").addEventListener("input",renderProducts);
document.getElementById("cartOpenBtn").onclick=()=>{renderCart();openModal("cartModal")};
document.getElementById("cartWhatsAppBtn").onclick=cartOrder;
document.getElementById("adminOpenBtn").onclick=adminOpen;
document.getElementById("adminLoginBtn").onclick=()=>{
  if(document.getElementById("adminPin").value==="1234"){sessionStorage.setItem(ADMIN_SESSION,"1");showAdminPanel();}
  else alert("ভুল Admin PIN");
};
document.getElementById("adminLogoutBtn").onclick=()=>{sessionStorage.removeItem(ADMIN_SESSION);showAdminLogin()};
document.getElementById("cancelEditBtn").onclick=resetForm;
document.getElementById("resetProductsBtn").onclick=()=>{
  if(confirm("Demo products restore করবেন? আপনার বর্তমান products replace হবে।")){
    products=demoProducts.map(p=>({...p,id:cryptoId()}));save(STORAGE_KEY,products);renderProducts();renderAdminProducts();
  }
};
document.getElementById("productForm").addEventListener("submit",e=>{
  e.preventDefault();
  const id=document.getElementById("productId").value;
  const item={
    id:id||cryptoId(),
    name:document.getElementById("productName").value.trim(),
    category:document.getElementById("productCategory").value,
    image:document.getElementById("productImage").value.trim(),
    regular:Number(document.getElementById("regularPrice").value),
    sale:Number(document.getElementById("salePrice").value),
    description:document.getElementById("productDescription").value.trim()
  };
  if(item.sale>item.regular && item.regular>0) alert("Sale Price সাধারণত Regular Price-এর সমান বা কম হওয়া উচিত।");
  if(id) products=products.map(p=>p.id===id?item:p);
  else products.unshift(item);
  save(STORAGE_KEY,products);renderProducts();renderAdminProducts();resetForm();
  alert(id?"Product updated successfully!":"Product added successfully!");
});
document.querySelectorAll("[data-close]").forEach(btn=>btn.onclick=()=>closeModal(btn.dataset.close));
document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.add("hidden")}));
document.addEventListener("keydown",e=>{if(e.key==="Escape")document.querySelectorAll(".modal").forEach(m=>m.classList.add("hidden"))});

populateCategorySelect();renderCategories();renderProducts();renderCart();updateCartCount();document.getElementById("year").textContent=new Date().getFullYear();
