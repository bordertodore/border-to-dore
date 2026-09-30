const menuBtn=document.getElementById('menuBtn');
    const navLinks=document.getElementById('navLinks');
    menuBtn.addEventListener('click',()=>navLinks.classList.toggle('open'));
    document.querySelectorAll('.navlinks a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')));
    document.getElementById('year').textContent=new Date().getFullYear();

    document.getElementById('orderForm').addEventListener('submit',function(e){
      e.preventDefault();
      const name=document.getElementById('name').value.trim();
      const phone=document.getElementById('phone').value.trim();
      const product=document.getElementById('product').value.trim();
      const message=document.getElementById('message').value.trim();
      const text=`Hello BORDER TO DORE,%0A%0Aনাম: ${encodeURIComponent(name)}%0Aফোন: ${encodeURIComponent(phone)}%0AProduct: ${encodeURIComponent(product)}%0A${message ? 'Message: '+encodeURIComponent(message) : ''}`;
      const url='https://wa.me/8801333162597?text='+text;
      document.getElementById('toast').classList.add('show');
      setTimeout(()=>{document.getElementById('toast').classList.remove('show');window.open(url,'_blank')},450);
    });
