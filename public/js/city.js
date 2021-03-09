import { $, $_ } from "../aan/js/main.js";

// getUserLocation

window.addEventListener("load", () => {
  let getUserLocation = new Promise((resolve) => {
    let locationApiKey = `20b96dca8b9a5d37b0355e9461c66e76eed30a2274422fa6213d9de6ffb2b34e`;
    userData.cityName != undefined || userData.countryName != undefined
      ? resolve(userData)
      : fetch(
          `https://api.ipinfodb.com/v3/ip-city/?key=${locationApiKey}&format=json`
        )
          .then((res) => res.json())
          .then((json) => {
            userData = { ...json };
            resolve(userData);
          })
          .catch(() => {
            let alertContainer = document.querySelector(".alert-container"),
              alertText = document.querySelector(
                ".alert-container .alert-text"
              );

            if (lang == "en") {
              alertText.textContent =
                "An Error Occurred in Fetching The Data. Please Disable AdBlocker and Reload The Page";
              alertContainer.style.display = "unset";
            } else {
              alertText.textContent =
                "حدث خطأ في تحديد البيانات برجاء اغلاق مانع الاعلان واعادة تحميل الصفحة";
              alertContainer.style.display = "unset";
            }
          });
  });

  getUserLocation.then((res) => {
    let prayesData = {},
      getPrayData = (
        school = 4,
        juristic = 0,
        timeformat = 0,
        city = null,
        country = null,
        latitude = null,
        longitude = null
      ) => {
        return new Promise((resolve) => {
          (async () => {
            let userLocInfKey = `037e8a09bd12404c82361f76572d7363`;

            let fetchLatLong = fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${city}+${country}&key=${userLocInfKey}`
            );
            fetchLatLong = await fetchLatLong.then((result) => result.json());
            let fetchlat, fetchlng;

            if (
              fetchLatLong.status.code == 400 ||
              fetchLatLong.status.code == 402 ||
              (await fetchLatLong).status == undefined
            ) {
              let newKey = `a60de551c8a14d2dba7bf42c6e8ed311`;

              fetchLatLong = fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${city}+${country}&key=${newKey}`
              );
              fetchLatLong = await fetchLatLong.then((result) => result.json());

              userData.countryCode = await fetchLatLong.results[0].components.country_code
                .toString()
                .toUpperCase();

              (fetchlat = fetchLatLong.results[0].geometry.lat),
                (fetchlng = fetchLatLong.results[0].geometry.lng);
            } else {
              if (fetchLatLong.results[0] == undefined) {
                location.href = `${location.origin}/404`;
              }

              let countryCode = await fetchLatLong.results[0].components.country_code
                .toString()
                .toUpperCase();
              userData.countryCode = countryCode;

              fetchLatLong = fetchLatLong.results[0].geometry;
              (fetchlat = fetchLatLong.lat), (fetchlng = fetchLatLong.lng);
            }

            let url = `https://api.aladhan.com/v1/calendar?latitude=${fetchlat}&longitude=${fetchlng}&method=${school}&school=${juristic}`;

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
          prayesTime = res.data[todayNum].timings,
          facebookSite = $(".facebook-site"),
          twitterSite = $(".twitter-site");

        $(".section-add-code").setAttribute(
          "href",
          `${location.origin}/embed/${userData.cityName}/${
            userData.countryName
          }${lang == "en" ? "?lang=en" : ""}`
        );

        facebookSite.setAttribute(
          "href",
          `https://www.facebook.com/sharer/sharer.php?u=${
            location.origin
          }/${resultCountryName.replace(/ /g, "-")}/${resultCityName.replace(
            / /g,
            "-"
          )}${location.hash}`
        );

        twitterSite.setAttribute(
          "href",
          `https://twitter.com/share?url=${
            location.origin
          }/${resultCountryName.replace(/ /g, "-")}/${resultCityName.replace(
            / /g,
            "-"
          )}${location.hash}`
        );
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
            prayesTime[i][1] = `${
              prayesTime[i][1].split(" ")[0].split(":")[0]
            }:${prayesTime[i][1].split(" ")[0].split(":")[1]}`;
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

        let prayesNamesAr = {
          sunrise: `الشروق`,
          fajr: `الفجر`,
          dhuhr: `الظهر`,
          asr: `العصر`,
          maghrib: `المغرب`,
          isha: `العشاء`,
        };

        if (lang == "en") {
          prayesNamesAr = {
            sunrise: `sunrise`,
            fajr: `fajr`,
            dhuhr: `dhuhr`,
            asr: `asr`,
            maghrib: `maghrib`,
            isha: `isha`,
          };
        }

        // Replace English Prayes Names With Arabic One
        for (let i = 0; i < prayesTime.length; i++) {
          let prayNameAr = prayesTime[i][0].toLowerCase();

          prayNameAr = prayNameAr.replace(
            `${prayNameAr}`,
            `${prayesNamesAr[prayNameAr]}`
          );
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

            prayNameAr = prayNameAr.replace(
              `${prayNameAr}`,
              `${prayesNamesAr[prayNameAr]}`
            );
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
            remainedTimeArray = [],
            remainedTimeCheck = [];

          // Get The Hours & Minutes
          for (let i = 0; i < prayItem.length; i++) {
            timeArray[i] = prayItem[i].getAttribute("id");
            remainedHoursArray[i] = prayItem[i]
              .getAttribute("id")
              .split(":")[0];
            remainedMinsArray[i] = prayItem[i].getAttribute("id").split(":")[1];

            remainedTimeArray[i] = `${
              prayItem[i].getAttribute("id").split(":")[0]
            }:${prayItem[i].getAttribute("id").split(":")[1]}:00`;

            let hrPlusMin = date.getHours() + date.getMinutes(),
              time =
                parseInt(remainedHoursArray[i]) +
                parseInt(remainedMinsArray[i]);

            remainedTimeCheck[i] = time - hrPlusMin;
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
                  : (remaining = "موعد الاذان"),
              nextActivePray = $(".next-active-pray");
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
              nextActivePray.firstElementChild.innerHTML =
                nextItem.firstElementChild.innerHTML;
              nextActivePray.lastElementChild.innerHTML =
                nextItem.lastElementChild.innerHTML;
              nextActivePray.firstElementChild.nextElementSibling.innerHTML = remaining;
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
              nextActivePray.firstElementChild.innerHTML =
                nextItem.firstElementChild.innerHTML;
              nextActivePray.lastElementChild.innerHTML =
                nextItem.lastElementChild.innerHTML;
              nextActivePray.firstElementChild.nextElementSibling.innerHTML = remaining;
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

          let nextPrayText = $(".nextPrayText");

          console.log(nextPrayItem);

          nextPrayText.textContent = nextPrayItem.firstElementChild.textContent;

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
          dateClockText = $(".date-clock").firstElementChild,
          dateClock = $(".date-clock").lastChild,
          higriDate = $(".higri-date").lastChild,
          goergianDate = $(".goergian-date").lastChild,
          nextPrayElement = $(".active-pray"),
          nextPrayMeta = $(".next-pray"),
          timestampDiv = $(".timestamp-div");

        if (lang == "en") {
          dateClockText.textContent = "Clock:";
          $(".higri-date").firstElementChild.textContent = "Higri:";
          $(".next-pray").firstElementChild.textContent = "Next Pray:";
          $(".goergian-date").firstElementChild.textContent = "Date:";
          nextPrayMeta.firstElementChild.textContent = "Next Pray:";
          timestampDiv.firstElementChild.textContent = ":Timestamp";
          $(".date-clock").classList.remove("row-reverse");
          $(".date-clock").classList.add("row");

          higri = res.data[todayNum].date.hijri.date;
          goergian = resultsTime.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          dateClock.textContent = clock.split(",")[1];
          higriDate.textContent = higri;
          goergianDate.textContent = goergian;

          $(".more-option-btn").textContent = "More Options";
          $(".share-tag").textContent = "Share";
          $(".month-prayes-btn").textContent = "Month Prayer Times";

          $(
            ".more-option-data"
          ).firstElementChild.firstElementChild.textContent =
            "Calculation Method";
          $(
            ".more-option-data"
          ).firstElementChild.nextElementSibling.firstElementChild.textContent =
            "School";
          $(
            ".more-option-data"
          ).lastElementChild.firstElementChild.textContent = "Time Format";

          let allEnData = $_("option");
          allEnData.forEach((option) => {
            if (option.getAttribute("data-en") != null) {
              option.textContent = option.getAttribute("data-en");
            }
          });

          $(".section-add-code").textContent = "Embed to your Site";
        } else {
          dateClock.textContent = clock.split(",")[1];
          higriDate.textContent = higri.split("،")[1];
          goergianDate.textContent = goergian.split("،")[1];
        }

        nextPrayMeta.lastChild.textContent =
          nextPrayElement.firstElementChild.textContent;

        timestampDiv.lastChild.textContent = timezone;
      };
      getThePrayes();
    };
    // Get Pray Data
    getPrayData(
      4,
      0,
      1,
      userData.cityName,
      userData.countryName,
      userData.latitude,
      userData.longitude
    ).then((json) => {
      prayInnerFunc(json, 1);
    });

    // Apply More Options
    let headerTitle = $(".header-title h1"),
      footerMail = $(".footer-mail"),
      siteCopyrights = $(".site-copyrights"),
      alertText = $(".alert-text"),
      countryLabel = $(".alert-text").nextElementSibling.firstElementChild,
      cityLabel = $(".alert-text").nextElementSibling.lastElementChild
        .previousElementSibling,
      praySchool = $(".pray-school"),
      prayJuristic = $(".pray-juristic"),
      prayTimeFormat = $(".pray-time-format"),
      manualDetect = $(".manual-detect"),
      manualLocationCity = $(".manual-location-city");

    document.title = title;
    headerTitle.textContent = title;
    footerMail.textContent = email;

    lang == "en"
      ? ((siteCopyrights.textContent = `All Rights Reserved to ${title}`),
        (countryLabel.textContent = "Country"),
        (cityLabel.textContent = "City"))
      : (siteCopyrights.textContent = `جميع الحقوق محفوظة لدي موقع ${title}`);

    lang == "en"
      ? (alertText.textContent =
          "Please enable GPS access to display prayer times automatically")
      : (alertText.textContent =
          "برجاء تفعيل امكانية الوصول للموقع GPS لعرض مواقيت الصلاة اوتوماتيكيا");

    manualDetect.addEventListener("click", () => {
      location.href = `${location.origin}/${$(".country-search")
        .getAttribute("value")
        .replace(" ", "-")}/${manualLocationCity.value.replace(" ", "-")}`;
    });

    praySchool.addEventListener("change", () => {
      secondAction = true;

      // Get Pray Data
      getPrayData(
        praySchool.value,
        0,
        1,
        userData.cityName,
        userData.countryName,
        userData.latitude,
        userData.longitude
      ).then((json) => {
        prayInnerFunc(json, 1);
      });
    });

    prayJuristic.addEventListener("change", () => {
      secondAction = true;
      // Get Pray Data
      getPrayData(
        praySchool.value,
        prayJuristic.value,
        1,
        userData.cityName,
        userData.countryName,
        userData.latitude,
        userData.longitude
      ).then((json) => {
        prayInnerFunc(json, 1);
      });
    });

    prayTimeFormat.addEventListener("change", () => {
      // Get Pray Data
      getPrayData(
        praySchool.value,
        prayJuristic.value,
        prayTimeFormat.value,
        userData.cityName,
        userData.countryName,
        userData.latitude,
        userData.longitude
      ).then((json) => {
        prayInnerFunc(json, prayTimeFormat.value);
      });
    });
  });
});
