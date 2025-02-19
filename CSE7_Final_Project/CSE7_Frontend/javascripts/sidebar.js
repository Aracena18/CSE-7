document.addEventListener("DOMContentLoaded", function() {
    const navItems= document.querySelectorAll("nav ul li");

    const activeIndex= localStorage.getItem("activeIndex");

    if(activeIndex != null){
        navItems[activeIndex].classList.add("active");
    }

    navItems.forEach( (item,index) =>{
        item.addEventListener("click", function() {
            navItems.forEach(nav => nav.classList.remove("active"));
            this.classList.add("active");

            localStorage.setItem("activeIndex",index);
        });
    })
});