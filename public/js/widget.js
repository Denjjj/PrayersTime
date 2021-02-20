import { $, $_ } from "../aan/js/main.js";

// getUserLocation

let getUserLocation = new Promise((resolve) => {
  resolve(userData);
});

getUserLocation.then((res) => {
  let prayesData = {},
    getPrayData = (school = 4, juristic = 0, timeformat = 0, city, country) => {
      return new Promise((resolve) => {
        (() => {
          let url = `https://api.aladhan.com/v1/calendarByCity?city=${city}&country=${country}&method=${juristic}&school=${school}`;

          fetch(url)
            .then((res) => res.json())
            .then((json) => {
              prayesData = { ...json };
              resolve(prayesData);
            });
        })();
      });
    };

  let secondAction = false;

  let prayInnerFunc = (res, timeformat) => {
    let getThePrayes = () => {
      let resultCityName = userData.cityName,
        resultCountryName = userData.countryName,
        todayNum = new Date().getDate() - 1,
        prayesTime = res.data[todayNum].timings;

      prayesTime = Object.entries(prayesTime);
      prayesTime.pop(), prayesTime.splice(7, 2), prayesTime.splice(4, 1);

      if (timeformat == 1) {
        for (let i = 0; i < prayesTime.length; i++) {
          let time = prayesTime[i][1];
          prayesTime[i][1] =
            parseInt(prayesTime[i][1].split(" ")[0]) > 12
              ? `${prayesTime[i][1].split(" ")[0].split(":")[0] - 12}:${
                  prayesTime[i][1].split(" ")[0].split(":")[1]
                } PM`
              : `${prayesTime[i][1].split(" ")[0].split(":")[0]}:${
                  prayesTime[i][1].split(" ")[0].split(":")[1]
                } AM`;
        }
      } else {
        for (let i = 0; i < prayesTime.length; i++) {
          let time = prayesTime[i][1];
          prayesTime[i][1] = `${prayesTime[i][1].split(" ")[0].split(":")[0]}:${
            prayesTime[i][1].split(" ")[0].split(":")[1]
          }`;
        }
      }

      let timeStamp = res.data[todayNum].date.timestamp;

      timeStamp =
        new Date(new Date().getTime() - timeStamp).getHours() -
        new Date(new Date().getTime() - timeStamp).getUTCHours();

      let timezone = res.data[todayNum].meta.timezone;

      let resultsTime = new Date(
        `${new Date().toLocaleString("en-us", {
          timeZone: `${timezone}`,
        })}`
      );

      // Praye Name In Arabic
      let prayesNamesAr = {
        sunrise: `الشروق`,
        fajr: `الفجر`,
        dhuhr: `الظهر`,
        asr: `العصر`,
        maghrib: `المغرب`,
        isha: `العشاء`,
      };
      if (userData.lang == "ar") {
        // Replace English Prayes Names With Arabic One
        for (let i = 0; i < prayesTime.length; i++) {
          let prayNameAr = prayesTime[i][0].toLowerCase();

          prayNameAr = prayNameAr.replace(
            `${prayNameAr}`,
            `${prayesNamesAr[prayNameAr]}`
          );
        }
      }
      let date = new Date(
        `${new Date().toLocaleString("en-us", {
          timeZone: `${timezone}`,
        })}`
      );

      let hr =
          date.getHours().toString().length == 1
            ? parseInt(`0${date.getHours()}`)
            : date.getHours(),
        min =
          date.getMinutes().toString().length == 1
            ? parseInt(`0${date.getMinutes()}`)
            : date.getMinutes(),
        hrMin24 = `${hr}:${min}`,
        hrMin12 = date.toLocaleDateString("en-US", {
          hour12: true,
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

      // Add Prayes Data

      let addPrayes = () => {
        let prayItem = $_(".pray-item"),
          prayName = $_(".pray-name");

        // Add Name And Time To Pray Items
        for (let i = 0; i < prayesTime.length; i++) {
          let prayNameAr = prayesTime[i][0].toLowerCase(),
            prayTime = prayesTime[i][1];
          if (userData.lang == "ar") {
            prayNameAr = prayNameAr.replace(
              `${prayNameAr}`,
              `${prayesNamesAr[prayNameAr]}`
            );
          }

          let idValue =
            timeformat == 1
              ? prayTime.split(" ").length == 2 &&
                prayTime.split(" ")[1].toLowerCase() == "pm"
                ? `${parseInt(prayTime.split(" ")[0].split(":")[0]) + 12}:${
                    prayTime.split(" ")[0].split(":")[1]
                  }`
                : `${parseInt(prayTime.split(" ")[0].split(":")[0])}:${
                    prayTime.split(" ")[0].split(":")[1]
                  }`
              : `${parseInt(prayTime.split(" ")[0].split(":")[0])}:${
                  prayTime.split(" ")[0].split(":")[1]
                }`;

          prayItem[i].setAttribute("id", `${idValue}`);
          prayItem[i].firstElementChild.textContent = prayNameAr;

          /* Set Main Pray Time */
          prayItem[i].lastElementChild.textContent = `${
            prayTime.split(":")[0]
          }:${prayTime.split(":")[1]}`;
        }
      };
      addPrayes();

      // Know The Next Pray
      let getNextPray = () => {
        let prayItem = $_(".pray-item");

        // Get The Time From Id
        let timeArray = [],
          remainedHoursArray = [],
          remainedMinsArray = [],
          remainedTimeArray = [];

        // Get The Hours & Minutes
        for (let i = 0; i < prayItem.length; i++) {
          timeArray[i] = prayItem[i].getAttribute("id");
          remainedHoursArray[i] = prayItem[i].getAttribute("id").split(":")[0];
          remainedMinsArray[i] = prayItem[i].getAttribute("id").split(":")[1];

          remainedTimeArray[i] = `${
            prayItem[i].getAttribute("id").split(":")[0]
          }:${prayItem[i].getAttribute("id").split(":")[1]}:00`;
        }

        function diffdownTimer(mainDate) {
          var today = new Date(
            `${new Date().toLocaleString("en-us", {
              timeZone: `${timezone}`,
            })}`
          );

          var date =
            today.getFullYear() +
            "-" +
            (today.getMonth() + 1) +
            "-" +
            today.getDate();

          var dateTime = date + " " + mainDate;

          let difference = new Date(dateTime) - today;
          let remaining = "حان الان موعد الاذان";

          if (difference > 0) {
            const parts = {
              hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
              minutes: Math.floor((difference / 1000 / 60) % 60),
              seconds: Math.floor((difference / 1000) % 60),
            };

            remaining = Object.keys(parts)
              .map((part) => {
                return `${parts[part]} ${part}`;
              })
              .join(" ");
          } else {
            const parts = {
              hours: `${Math.floor(
                ((difference / (1000 * 60 * 60)) % 24) + 24
              )}:`,
              minutes: `${Math.floor((difference / 1000 / 60) % 60) + 60}:`,
              seconds: Math.floor((difference / 1000) % 60) + 60,
            };

            remaining = Object.keys(parts)
              .map((part) => {
                return `${parts[part]}`;
              })
              .join("");
          }

          return difference;
        }
        // Get The Diffrence Between Them
        let remainingTimeArray = [];

        for (let i = 0; i < remainedTimeArray.length; i++) {
          let time = remainedTimeArray[i];

          diffdownTimer(time) < 0
            ? (remainingTimeArray[i] = Infinity)
            : (remainingTimeArray[i] = diffdownTimer(time));
        }

        let everyIsInfinity = remainingTimeArray.every((time) => {
          return time == Infinity;
        });

        function countdownTimer(nextItem = null, mainDate) {
          var today = new Date(
            `${new Date().toLocaleString("en-us", {
              timeZone: `${timezone}`,
            })}`
          );
          var date =
            today.getFullYear() +
            "-" +
            (today.getMonth() + 1) +
            "-" +
            today.getDate();
          var dateTime = date + " " + mainDate;

          let difference = new Date(dateTime) - today;
          let remaining = "موعد الاذان",
            remainingText =
              lang == "en"
                ? (remaining = "Azan Time")
                : (remaining = "موعد الاذان");
          remainingText = remaining;

          if (difference >= 0 && everyIsInfinity == false) {
            const parts = {
              hours: `${Math.floor((difference / (1000 * 60 * 60)) % 24)}:`,
              minutes: `${Math.floor((difference / 1000 / 60) % 60)}:`,
              seconds: Math.floor((difference / 1000) % 60),
            };

            remaining = Object.keys(parts)
              .map((part) => {
                return `${parts[part]}`;
              })
              .join("");

            nextItem.firstElementChild.nextElementSibling.innerHTML = remaining;

            if (
              nextItem.firstElementChild.nextElementSibling.innerHTML ==
              remainingText
            ) {
              location.href = location.href;
            }
          } else if (everyIsInfinity == true || difference < 0) {
            const parts = {
              hours: `${Math.floor(
                ((difference / (1000 * 60 * 60)) % 24) + 24
              )}:`,
              minutes: `${Math.floor((difference / 1000 / 60) % 60) + 60}:`,
              seconds: Math.floor((difference / 1000) % 60) + 60,
            };

            remaining = Object.keys(parts)
              .map((part) => {
                return `${parts[part]}`;
              })
              .join("");

            nextItem.firstElementChild.nextElementSibling.innerHTML = remaining;
          }
        }

        let nextPrayTime = Math.min(...remainingTimeArray),
          nextPrayIndex = remainingTimeArray.findIndex(
            (i) => i == nextPrayTime
          );

        // Set Next Pray Item
        let nextPrayItem = prayItem[nextPrayIndex];
        nextPrayItem.classList.add("active-pray");
        nextPrayTime = nextPrayItem.getAttribute("id");

        countdownTimer(nextPrayItem, nextPrayTime);

        nextPrayItem.firstElementChild.nextElementSibling.innerHTML ==
        "موعد الاذان"
          ? getNextPray()
          : "";

        secondAction == false
          ? setInterval(() => {
              countdownTimer(nextPrayItem, nextPrayTime);
            }, 1000)
          : "";
      };
      getNextPray();

      // Passing Data To Website
      let sectionHeading = $(".section-heading");

      // Set SectionHead Text
      sectionHeading.textContent = `${resultCityName.replace(/-/g, " ")}`;

      // Set Date Section Data
      let clock =
          timeformat == 0
            ? resultsTime.toLocaleDateString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : resultsTime.toLocaleDateString("en-US", {
                hour12: true,
                hour: "2-digit",
                minute: "2-digit",
              }),
        higri = resultsTime.toLocaleDateString("ar-SA", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        goergian = resultsTime.toLocaleDateString("ar-EG", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        dateClock = $(".date-clock") != null ? $(".date-clock").lastChild : "",
        higriDate = $(".higri-date") != null ? $(".higri-date").lastChild : "",
        goergianDate =
          $(".goergian-date") != null ? $(".goergian-date").lastChild : "";
    };
    getThePrayes();

    // Get getCountryCities
  };

  // Get Pray Data
  getPrayData(
    userData.school,
    userData.juristic,
    userData.timeformat,
    userData.cityName,
    userData.countryName
  ).then((json) => {
    prayInnerFunc(json, userData.timeformat);
  });

  let manualDetect = $(".manual-detect"),
    manualLocationBtn = $(".manual-location-btn"),
    manualLocationCountry = $(".manual-location-country"),
    manualLocationCity = $(".manual-location-city");

  manualLocationBtn.addEventListener("click", () => {
    let alertContainer = $(".alert-container"),
      alertText = $(".alert-text");
    alertContainer.style.display = "unset";

    let getCountryCities = () => {
      // Fetch Countries
      let countries = new Promise((resolve) => {
        fetch(`${location.origin}/json/countries-ar.json`)
          .then((res) => res.json())
          .then((json) => resolve(json));
      });

      countries.then((json) => {
        let countries = json;

        for (let country in countries) {
          let countryArr = countries[country];

          manualLocationCountry.innerHTML += `<option value="${countryArr.en_name}">${countryArr.en_name}</option>`;
        }

        // Get Cities By Country
        manualLocationCountry.addEventListener("change", () => {
          let country = manualLocationCountry.value;
          // Fetch Cities
          let cities = new Promise((resolve) => {
            fetch(`${location.origin}/json/cities.json`)
              .then((res) => res.json())
              .then((json) => resolve(json));
          }).catch(() => {
            manualLocationCity.innerHTML =
              "<option>لا توجد بيانات خاصة بهذه الدولة</option>";
          });

          cities.then((citiesJson) => {
            // Add Cities To Cities Section
            let cities = citiesJson[country];
            manualLocationCity.innerHTML = "";

            let getCities = cities.forEach((city) => {
              manualLocationCity.innerHTML += `<option value="${city}">${city}</option>`;
            });
            getCities;

            !getCities ? console.log("NO") : getCities;
          });
        });
      });
    };
    getCountryCities();
  });

  manualDetect.addEventListener("click", () => {
    location.href = `${location.origin}/widget/${userData.school}/${
      userData.juristic
    }/${userData.timeformat}/${manualLocationCity.value.replace(
      " ",
      "-"
    )}/${manualLocationCountry.value.replace(" ", "-")}`;
  });
});

$("#close-alert").addEventListener("click", () => {
  $(".alert-container").style.display = "none";
});
