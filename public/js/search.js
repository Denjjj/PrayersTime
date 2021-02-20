let backTohomeBtn = document.querySelector(".backTohome");
if (backTohomeBtn != null) {
  backTohomeBtn.addEventListener("click", () => {
    location.href = location.origin;
  });
}

let searchBox = document.querySelector(".manual-location-btn"),
  searchFunc = (searchValue) => {
    let autoComleteSearch = document.querySelector(".autoComleteSearch");

    if (searchBox.value.replace(/ /g, "").length != 0) {
      fetch(
        `${location.origin}/cct/all?search=${searchValue}&lang=${
          lang == "en" ? "en" : "ar"
        }`
      )
        .then((results) => {
          return results.json();
        })
        .then((json) => {
          let data = json;

          autoComleteSearch.innerHTML = "";
          autoComleteSearch.style.boxShadow = "";

          if (data.length > 0) {
            autoComleteSearch.style.boxShadow =
              "0px 0px 0px 100vw rgba(0, 0, 0, 0.2)";

            autoComleteSearch.style.padding = "5px;";

            autoComleteSearch.innerHTML = "";

            for (let i = 0; i < 8; i++) {
              let city = Object.values(data)[i];

              fetch(`${location.origin}/ccd/${city.countryCode}`)
                .then((results) => {
                  return results.json();
                })
                .then((json) => {
                  let countryData = json;

                  countryData.forEach((country) => {
                    autoComleteSearch.innerHTML += `
                <div class="searchChoise">
                  <a href="/${country.en_name}/${city.en_name}">${city.ar_name}، ${country.ar_name}</a>
                  </div>`;
                  });
                });
            }
          } else {
            autoComleteSearch.style.boxShadow = "";
            autoComleteSearch.innerHTML = "";

            let interval = setInterval(() => {
              autoComleteSearch.style.boxShadow = "";
              autoComleteSearch.innerHTML = "";
            }, 500);
            interval;

            setTimeout(() => {
              clearInterval(interval);
            }, 3000);
          }
        });
    } else {
      autoComleteSearch.style.boxShadow = "";
      autoComleteSearch.innerHTML = "";

      let interval = setInterval(() => {
        autoComleteSearch.style.boxShadow = "";
        autoComleteSearch.innerHTML = "";
      }, 500);
      interval;

      setTimeout(() => {
        clearInterval(interval);
      }, 3000);
    }
  };

searchBox.addEventListener("input", () => {
  searchFunc(searchBox.value);
});
