const cards = document.querySelectorAll(".card, .projeto");

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

});

cards.forEach(card => {

    card.classList.add("hidden");

    observer.observe(card);

});

function abrirPhoenix() {
    document.getElementById("phoenixModal").style.display = "flex";
}

function fecharPhoenix() {
    document.getElementById("phoenixModal").style.display = "none";
}

window.onclick = function (event) {
    const modal = document.getElementById("phoenixModal");

    if (event.target === modal) {
        modal.style.display = "none";
    }
};