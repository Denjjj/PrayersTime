window.addEventListener("load", () => {
  let smPostContainer = document.querySelector(".sm-post-container"),
    rowItem = document.querySelectorAll(".sm-post-container .row-item");

  fetch(`${origin}/json-sm-posts?lang=${lang}`)
    .then((data) => {
      return data.json();
    })
    .then((json) => {
      if (json.length < 2) {
        smPostContainer.remove();
      }

      let item1 = json[0],
        item2 = json[1];

      if (json.length > 2) {
        item1 = json[Math.floor(Math.random() * json.length)];
        item2 = json[Math.floor(Math.random() * json.length)];
      }

      let rowitemsayer1 =
          rowItem[0].firstElementChild.nextElementSibling.nextElementSibling,
        rowitemcontent1 =
          rowItem[0].firstElementChild.nextElementSibling.nextElementSibling
            .nextElementSibling,
        rowitemsayer2 =
          rowItem[1].firstElementChild.nextElementSibling.nextElementSibling,
        rowitemcontent2 =
          rowItem[1].firstElementChild.nextElementSibling.nextElementSibling
            .nextElementSibling;

      if (item1.icon == "") {
        rowItem[0].firstElementChild.remove();

        rowitemsayer1 = rowItem[0].firstElementChild.nextElementSibling;
        rowitemcontent1 =
          rowItem[0].firstElementChild.nextElementSibling.nextElementSibling;
      } else {
        rowItem[0].firstElementChild.textContent = item1.icon;
      }

      rowitemsayer1.textContent = item1.sayer;
      rowitemcontent1.textContent = item1.content;

      if (item2.icon == "") {
        rowItem[1].firstElementChild.remove();
        rowitemsayer2 = rowItem[1].firstElementChild.nextElementSibling;
        rowitemcontent2 =
          rowItem[1].firstElementChild.nextElementSibling.nextElementSibling;
      } else {
        rowItem[1].firstElementChild.textContent = item2.icon;
      }

      rowitemsayer2.textContent = item2.sayer;
      rowitemcontent2.textContent = item2.content;

      if (rowitemcontent2.textContent == rowitemcontent1.textContent) {
        let btn = rowitemcontent2.parentElement.firstElementChild;

        if (!btn.classList.contains("reload-sm-post-btn")) {
          btn =
            rowitemcontent2.parentElement.firstElementChild.nextElementSibling;
        }

        btn.click();
      }
    });
});

var shareBtns = document.querySelectorAll(".share-btn");

shareBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    let newEle = document.createElement("input");
    newEle.value = `${btn.previousElementSibling.previousElementSibling.textContent}\n${btn.previousElementSibling.textContent}`;
    document.body.append(newEle);
    let copyText = newEle;
    copyText.select();

    copyText.setSelectionRange(0, 99999);

    document.execCommand("copy");
    newEle.remove();
  });
});

var reloadBtns = document.querySelectorAll(".reload-sm-post-btn");
reloadBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    fetch(`${origin}/json-sm-posts?lang=${lang}`)
      .then((data) => data.json())
      .then((json) => {
        item = json[Math.floor(Math.random() * json.length)];

        if (
          btn.parentNode.firstElementChild.classList.contains(
            "top-icon-container"
          )
        ) {
          btn.parentNode.firstElementChild.nextElementSibling.nextElementSibling.textContent =
            item.sayer;
          btn.parentNode.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.textContent =
            item.content;
          if (item.icon != "") {
            btn.parentNode.firstElementChild.textContent = item.icon;
          } else {
            btn.parentNode.firstElementChild.remove();
          }
        } else {
          btn.parentNode.firstElementChild.nextElementSibling.textContent =
            item.sayer;
          btn.parentNode.firstElementChild.nextElementSibling.nextElementSibling.textContent =
            item.content;
        }
      });
  });
});
