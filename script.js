const cards = document.querySelectorAll(".card, .projeto");

const observer = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

});

cards.forEach(card=>{

card.classList.add("hidden");

observer.observe(card);

});

