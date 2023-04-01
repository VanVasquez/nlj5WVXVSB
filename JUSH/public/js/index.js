document.addEventListener("DOMContentLoaded", function (event) {
  const errorTxt = document.querySelector("#error");
  const isbnInput = document.querySelector("#isbn");
  const submitBtn = document.querySelector("#submit");
  const cardsDiv = document.querySelector("#cards");
  isbnInput.addEventListener("keyup", async () => {
    const isbn = isbnInput.value;
    const init = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const response = await fetch(`/checkISBN?isbn=${isbn}`, init);
    if (response.status === 406) {
      isbnInput.style.backgroundColor = "#FFB4AB";
      errorTxt.textContent = `${isbn} already in database`;
      submitBtn.disabled = true;
    }
    if (response.status === 202) {
      isbnInput.style.backgroundColor = "#E3E3E3";
      errorTxt.textContent = "";
      submitBtn.disabled = false;
    }
  });

  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      errorTxt.textContent = "";
      const form = document.querySelector("#book_form");
      const formData = new FormData(form);
      let formValue = {};
      for (const [key, value] of formData) {
        if (!value) {
          errorTxt.textContent = "Fill up all fields";
          return;
        }
        formValue[key] = value;
      }
      const init = {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formValue),
      };
      const response = await fetch("/books", init);
      const data = await response.json();
      if (response.status === 201) {
        form.reset();
        cardsDiv.innerHTML += `
          <div class="card">
            <img src="/static/images/icon.webp" class="icon">
            <div class="info">
            <p class="text titleLbl">${data.book.title}</p>
            <p class="text">${data.book.author}</p>
            <p class="text isbnLbl">ISBN: ${data.book.ISBN}</p>
            </div>
            <button class="remove">X</button>
            </div>
            `;
      }
    } catch (error) {
      console.log(error);
    }
  });

  cardsDiv.addEventListener(
    "click",
    async (e) => {
      try {
        if (e.target.matches(".remove")) {
          const card = e.target.closest(".card");
          const isbnLbn = card.querySelector(".isbnLbl");
          const isbn = isbnLbn.textContent.split(": ")[1];
          const init = {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          };
          const response = await fetch(`/delete?isbn=${isbn}`, init);
          if (response.status === 200) {
            card.remove();
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    true
  );
});
