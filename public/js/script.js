import { $, $_ } from "../aan/js/main.js";

let header = $("header"),
  headerTitle = $(".header-title"),
  ul = $("nav ul"),
  navToggle = $(".navbar-toggle");

addEventListener("scroll", () => {
  scrollY > 200
    ? (header.style.height = "80px")
    : (header.style.height = "114px");
});

headerTitle.addEventListener("click", () => {
  location.href = `${location.origin}${lang == "en" ? "?lang=en" : ""}`;
});

navToggle.addEventListener("click", () => {
  navToggle.classList.contains("fa-bars")
    ? ((ul.style.display = `unset`), (ul.style.opacity = `1`))
    : ((ul.style.opacity = `0`), (ul.style.display = `none`)),
    navToggle.classList.toggle("fa-times"),
    navToggle.classList.toggle("fa-bars");
});

$("#langSelect").addEventListener("change", () => {
  location.href = `${location.origin}${location.pathname}?lang=${
    $("#langSelect").value
  }`;
});

if (lang == "en") {
  $("#azkar a").textContent = "Azkar";
  $("#posts a").textContent = "Posts";
  $("#doua a").textContent = "Doa";
  $("#dhuha a").textContent = "Dhuha & Elaastkara";

  if (location.search == "?lang=en") {
    let aes = $_("a");

    aes.forEach((a) => {
      if (a.href.includes("?lang=en") == false) {
        a.href = `${a.href}${location.search}`;
      }
    });
  }
}

// Alert

let alertContainer = $(".alert-container"),
  closeAlert = $("#close-alert");

closeAlert.addEventListener("click", () => {
  alertContainer.style.display = "none";
});

// moreOption
let moreOption = (btn, selectBoxes) => {
  let moreOptionBtn = $_(btn),
    moreOptionData = $(selectBoxes);

  moreOptionBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      moreOptionData.classList.contains("activeOption")
        ? (moreOptionData.style.display = "none")
        : (moreOptionData.style.display = "flex");

      moreOptionData.classList.toggle("activeOption");
    });
  });
};

moreOption(".more-option-btn", ".more-option-data");

// Bottom
let embedContainer = $(".embed-container"),
  method = $_(".method"),
  school = $_(".school"),
  timeformat = $_(".timeformat");

method.forEach((me) => {
  me.addEventListener("change", () => {
    let codeArea = me.parentNode.parentNode.lastElementChild.lastElementChild,
      select = me.lastElementChild.value;

    codeArea.textContent = `<iframe src="${location.origin}/widget/${
      $(".method-select").value
    }/${$(".school-select").value}/${$(".timeformat-select").value}/${
      userData.cityName
    }/${userData.countryName}${
      lang == "en" ? "?lang=en" : ""
    }" frameborder="0" scroll="none" width="270" height="${
      codeArea.dataset.height
    }" ></iframe>`;
  });
});

school.forEach((me) => {
  me.addEventListener("change", () => {
    let codeArea = me.parentNode.parentNode.lastElementChild.lastElementChild,
      select = me.lastElementChild.value;

    codeArea.textContent = `   <iframe
                src="${location.origin}/widget/${$(".method-select").value}/${
      $(".school-select").value
    }/${$(".timeformat-select").value}/${userData.cityName}/${
      userData.countryName
    }${lang == "en" ? "?lang=en" : ""}"
                frameborder="0"
                scroll="none"
                width="270"
                height="${codeArea.dataset.height}"
              ></iframe>`;
  });
});

timeformat.forEach((me) => {
  me.addEventListener("change", () => {
    let codeArea = me.parentNode.parentNode.lastElementChild.lastElementChild,
      select = me.lastElementChild.value;

    codeArea.textContent = `   <iframe
                src="${location.origin}/widget-long/${
      $(".method-select").value
    }/${$(".school-select").value}/${$(".timeformat-select").value}/${
      userData.cityName
    }/${userData.countryName}${lang == "en" ? "?lang=en" : ""}"
                frameborder="0"
                scroll="none"
                width="270"
                height="${codeArea.dataset.height}"
              ></iframe>`;
  });
});
