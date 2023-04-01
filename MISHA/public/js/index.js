document.addEventListener("DOMContentLoaded", function (event) {
  const errorTxt = document.querySelector("#error");
  /*
    TODO:   The code below attaches a `keyup` event to `#isbn` text field.
            The code checks if the current reference number entered by the user
            in the text field does not exist in the database.

            If the current reference number exists in the database:
            - `#isbn` text field background color turns to `#FFB4AB`
            - `#error` paragraph element displays an error message `ISBN already in
            the database`
            - `#submit` is disabled

            else if the current reference number does not exist in the
            database:
            - `#isbn` text field background color turns back to `#E3E3E3`
            - `#error` displays no error message
            - `#submit` is enabled
    */
  const isbnInput = document.querySelector("#isbn");
  isbnInput.addEventListener("keyup", function () {
    // your code here
    const isbn = isbnInput.value;
    fetch(`/checkISBN?isbn=${isbn}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        //if response status is ok
        if (response.status === 200) {
          response.json().then(() => {
            errorTxt.textContent = "";
            submitBtn.disabled = false;
            isbnInput.style.backgroundColor = "#E3E3E3";
          });
        }
        //if response status has conflict
        if (response.status === 409) {
          response.json().then((data) => {
            errorTxt.textContent = data?.message;
            submitBtn.disabled = true;
            isbnInput.style.backgroundColor = "#FFB4AB";
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

  /*
    TODO:   The code below attaches a `click` event to `#submit` button.
            The code checks if all text fields are not empty. The code
            should communicate asynchronously with the server to save
            the information in the database.

            If at least one field is empty, the `#error` paragraph displays
            the error message `Fill up all fields.`

            If there are no errors, the new book should be displayed
            immediately, and without refreshing the page, after the values
            are saved in the database.

            The title, author, and ISBN fields are reset to empty
            values.
    */
  const submitBtn = document.querySelector("#submit");

  submitBtn.addEventListener("click", function (e) {
    e.preventDefault();
    // your code here
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
    fetch("/books", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(formValue),
    })
      .then((response) => {
        //if response status is created
        if (response.status === 201) {
          response.json().then((data) => {
            form.reset();
            document.querySelector("#cards").innerHTML += `
              <div class="card">
                <img src="/static/images/icon.webp" class="icon">
                <div class="info">
                  <p class="text titleLbl">${data.book.title}</p>
                  <p class="text">${data.book.author}</p>
                  <p class="text isbnLbl">ISBN: ${data.book.isbn}</p>
                </div>
                <button class="remove">X</button>
              </div>
            `;
          });
        }
        //if response status has conflict
        if (response.status === 409) {
          response.json().then((data) => {
            errorTxt.textContent = data?.message;
          });
        }
        //if response has redirect
        if (response.redirected) {
          window.location.href = response.url;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });

  /*
    TODO:   The code below attaches a `click` event to `.remove` buttons
            inside the `<div>` `#cards`.
            The code deletes the specific book associated to the
            specific `.remove` button, then removes the its parent `<div>` of
            class `.card`.
    */
  const cardsDiv = document.querySelector("#cards");
  cardsDiv.addEventListener(
    "click",
    function (e) {
      if (e.target.matches(".remove")) {
        // your code here
        const card = e.target.closest(".card");
        const isbnLbl = card.querySelector(".isbnLbl");
        const isbn = isbnLbl.textContent.split(": ")[1];
        fetch(`/delete?isbn=${isbn}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        })
          .then((response) => {
            //if response status is ok
            if (response.status === 200) {
              card.remove();
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    true
  );
});
