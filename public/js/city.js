import { $, $_ } from "../aan/js/main.js";

// getUserLocation
// Some Code CopyRights To prayer-now.com
function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function to12(clock) {
  let result = `${clock.split(":")[0]}:${clock.split(":")[1]} AM`;

  if (parseInt(clock.split(":")[0]) > 12) {
    result = `${clock.split(":")[0] - 12}:${clock.split(":")[1]} PM`;
  } else if (parseInt(clock.split(":")[0]) == 0) {
    result = `12:${clock.split(":")[1]} AM`;
  }

  return result;
}

async function getPrayersTimes(method = "MWL", asr_method = 0, format = "12h") {
  fetch(`${location.origin}/glnglt/${userCityName}/${userCountryName}`)
    .then((res) => res.json())
    .then((json) => {
      let longitude = json[0].longitude || 21.3891,
        latitude = json[0].latitude || 39.8579;

      let fetchUrl = `${location.protocol}//api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${asr_method}`;

      fetch(fetchUrl)
        .then((data) => data.json())
        .then((pjson) => {
          let jdata = pjson.data,
            meta = jdata.meta,
            prayersData = jdata.timings;

          let data = {
            fajr: prayersData.Fajr,
            sunrise: prayersData.Sunrise,
            dhuhr: prayersData.Dhuhr,
            asr: prayersData.Asr,
            maghrib: prayersData.Maghrib,
            isha: prayersData.Isha,
          };

          if (format == "12h") {
            data = {
              fajr: to12(prayersData.Fajr),
              sunrise: to12(prayersData.Sunrise),
              dhuhr: to12(prayersData.Dhuhr),
              asr: to12(prayersData.Asr),
              maghrib: to12(prayersData.Maghrib),
              isha: to12(prayersData.Isha),
            };
          }

          function currentSecondsF() {
            var d = new Date(
              new Date().toLocaleString("en-us", {
                timeZone: `${meta.timezone}`,
              })
            );

            var h = d.getHours();
            var m = d.getMinutes();
            var seconds = d.getSeconds();
            var currentSeconds = h * 3600 + m * 60 + seconds;
            return currentSeconds;
          }

          function prayerSeconds() {
            var currentSeconds = currentSecondsF();

            var times = {
              fajr: prayersData.Fajr,
              sunrise: prayersData.Sunrise,
              dhuhr: prayersData.Dhuhr,
              asr: prayersData.Asr,
              maghrib: prayersData.Maghrib,
              isha: prayersData.Isha,
            };

            prayerSeconds = [];
            var holder = times.fajr.split(":");
            var holder_sec =
              parseInt(holder[0]) * 3600 + parseInt(holder[1]) * 60;
            prayerSeconds[0] = holder_sec;

            // prayerSeconds = [];
            var holder = times.sunrise.split(":");
            holder_sec = parseInt(holder[0]) * 3600 + parseInt(holder[1]) * 60;
            prayerSeconds[1] = holder_sec;

            // prayerSeconds = [];
            var holder = times.dhuhr.split(":");
            holder_sec = parseInt(holder[0]) * 3600 + parseInt(holder[1]) * 60;
            prayerSeconds[2] = holder_sec;

            // prayerSeconds = [];
            var holder = times.asr.split(":");
            holder_sec = parseInt(holder[0]) * 3600 + parseInt(holder[1]) * 60;
            prayerSeconds[3] = holder_sec;

            // prayerSeconds = [];
            var holder = times.maghrib.split(":");
            holder_sec = parseInt(holder[0]) * 3600 + parseInt(holder[1]) * 60;
            prayerSeconds[4] = holder_sec;

            // prayerSeconds = [];
            var holder = times.isha.split(":");
            holder_sec = parseInt(holder[0]) * 3600 + parseInt(holder[1]) * 60;
            prayerSeconds[5] = holder_sec;

            var index = checkCloserPrayer(currentSeconds, prayerSeconds);

            if (typeof index != "undefinded") {
              var remainig_str = "";
              var next_salah = "";


              if (index == 0) {
                //fajr
                // console.log("fajr");
                var remaing = 86400 - currentSeconds + prayerSeconds[0] ;
                // console.log(prayerSeconds[0], currentSeconds);
                var h = addZero(Math.floor(remaing / 3600));
                var m = addZero(Math.floor((remaing - h * 3600) / 60));
                var s = addZero(Math.floor(remaing - h * 3600 - m * 60));
                var pname = lang == "en" ? "Fajr" : "الفجر";
                next_salah = `<div class="pray-name"> ${pname} </div>`;
                if (h != 0) {
                  remainig_str = h + ":" + m + ":" + s;
                } else {
                  remainig_str = m + ":" + s;
                }
                if ($(".active-pray") != null) {
                  $(".active-pray").classList.remove("active-pray");
                }
                $(".faj").classList.add("active-pray");
              } else if (index == 1) {
                //sunrise
                // console.log("sunrise");
                var remaing = prayerSeconds[1] - currentSeconds;
                // console.log(remaing);
                var h = addZero(Math.floor(remaing / 3600));
                var m = addZero(Math.floor((remaing - h * 3600) / 60));
                var s = addZero(Math.floor(remaing - h * 3600 - m * 60));
                var pname = lang == "en" ? "Sunrise" : "الشروق";
                next_salah = `<div class="pray-name">  ${pname} </div>`;
                if (h != 0) {
                  remainig_str = h + ":" + m + ":" + s;
                } else {
                  remainig_str = m + ":" + s;
                }
                if ($(".active-pray") != null) {
                  $(".active-pray").classList.remove("active-pray");
                }
                $(".sun").classList.add("active-pray");
              } else if (index == 2) {
                //dhur
                // console.log("dh");
                var remaing = prayerSeconds[2] - currentSeconds;
                var h = addZero(Math.floor(remaing / 3600));
                var m = addZero(Math.floor((remaing - h * 3600) / 60));
                var s = addZero(Math.floor(remaing - h * 3600 - m * 60));
                var pname = lang == "en" ? "Duhr" : "الظهر";
                next_salah = `<div class="pray-name"> ${pname} </div>`;
                if (h != 0) {
                  remainig_str = h + ":" + m + ":" + s;
                } else {
                  remainig_str = m + ":" + s;
                }
                if ($(".active-pray") != null) {
                  $(".active-pray").classList.remove("active-pray");
                }
                $(".duh").classList.add("active-pray");
              } else if (index == 3) {
                //asr
                // console.log("asr");
                var remaing = prayerSeconds[3] - currentSeconds;
                // console.log(remaing);
                var h = addZero(Math.floor(remaing / 3600));
                var m = addZero(Math.floor((remaing - h * 3600) / 60));
                var s = addZero(Math.floor(remaing - h * 3600 - m * 60));
                var pname = lang == "en" ? "Asr" : "العصر";
                next_salah = `<div class="pray-name">  ${pname} </div>`;
                if (h != 0) {
                  remainig_str = h + ":" + m + ":" + s;
                } else {
                  remainig_str = m + ":" + s;
                }
                if ($(".active-pray") != null) {
                  $(".active-pray").classList.remove("active-pray");
                }
                $(".asr").classList.add("active-pray");
              } else if (index == 4) {
                //maghrib
                // console.log("maghrib");
                var remaing = prayerSeconds[4] - currentSeconds;
                // console.log(remaing);
                var h = addZero(Math.floor(remaing / 3600));
                var m = addZero(Math.floor((remaing - h * 3600) / 60));
                var s = addZero(Math.floor(remaing - h * 3600 - m * 60));
                var pname = lang == "en" ? "Maghrib" : "المغرب";
                next_salah = `<div class="pray-name">  ${pname} </div>`;
                if (h != 0) {
                  remainig_str = h + ":" + m + ":" + s;
                } else {
                  remainig_str = m + ":" + s;
                }
                if ($(".active-pray") != null) {
                  $(".active-pray").classList.remove("active-pray");
                }
                $(".mag").classList.add("active-pray");
              } else if (index == 5) {
                //isha
                // console.log("isha");
                var remaing = prayerSeconds[5] - currentSeconds;
                // console.log(remaing);
                var h = addZero(Math.floor(remaing / 3600));
                var m = addZero(Math.floor((remaing - h * 3600) / 60));
                var s = addZero(Math.floor(remaing - h * 3600 - m * 60));
                var pname = lang == "en" ? "Isha" : "العشاء";
                next_salah = `<div class="pray-name">  ${pname} </div>`;
                if (h != 0) {
                  remainig_str = h + ":" + m + ":" + s;
                } else {
                  remainig_str = m + ":" + s;
                }
                if ($(".active-pray") != null) {
                  $(".active-pray").classList.remove("active-pray");
                }
                $(".ish").classList.add("active-pray");
              }

              $(".active-pray").firstElementChild.innerHTML =
                next_salah +
                `<div class="pray-remain-time">${remainig_str}</div>`;
            }
          }

          function checkCloserPrayer(currentSeconds, prayerSeconds) {
            var remaing;
            // console.log(currentSeconds, prayerSeconds);
            if (currentSeconds >= prayerSeconds[5]) {
              // console.log(1);
              var remaingTime = [];
              remaing = 86400 - currentSeconds + prayerSeconds[0];
              remaingTime[2] = remaing / 3600; // hours
              remaing = remaing - remaingTime[2] * 3600;
              remaingTime[1] = remaing / 60; // minutes
              remaing = remaing - remaingTime[1] * 60;
              remaingTime[0] = remaing; // seconds
              
              return 0;
            } else if (currentSeconds <= prayerSeconds[0]) {
              // console.log(2);
              // console.log("here");
              var remaingTime = [];
              remaing = prayerSeconds[0] - currentSeconds;
              remaingTime[2] = remaing / 3600; // hours
              remaing = remaing - remaingTime[2] * 3600;
              remaingTime[1] = remaing / 60; // minutes
              remaing = remaing - remaingTime[1] * 60;
              remaingTime[0] = remaing; // seconds

              return 0;
            } else {
              // console.log(3);
              for (var i = 0; i < 6; i++) {
                if (
                  currentSeconds >= prayerSeconds[i] &&
                  currentSeconds < prayerSeconds[i + 1]
                ) {
                  var remaingTime = [];
                  remaing = prayerSeconds[i + 1] - currentSeconds;
                  remaingTime[2] = remaing / 3600;
                  remaing = remaing - remaingTime[2] * 3600;
                  remaingTime[1] = remaing / 60;
                  remaing = remaing - remaingTime[1] * 60;
                  remaingTime[0] = remaing;
                  return i + 1;
                  // return prayerSeconds[i+1];
                }
              }
              // console.log(prayerSeconds);
            }
          }

          prayerSeconds();

          // Set Active Pray
          function setActivePray() {
            let prayNames = {
                fajr: lang == "en" ? "Fajr" : "الفجر",
                sunrise: lang == "en" ? "Sunrise" : "الشروق",
                dhuhr: lang == "en" ? "Dhuhr" : "الظهر",
                asr: lang == "en" ? "Asr" : "العصر",
                maghrib: lang == "en" ? "Maghrib" : "المغرب",
                isha: lang == "en" ? "Isha" : "العشاء",
              },
              prayItems = $_(".pray-item");

            for (let i = 0; i < prayItems.length; i++) {
              let item = prayItems[i];

              let prayName = item.firstElementChild.firstElementChild,
                mainTime = item.lastElementChild;

              if (item.classList.contains("faj")) {
                prayName.textContent = prayNames.fajr;
                mainTime.textContent = data.fajr;
              } else if (item.classList.contains("sun")) {
                prayName.textContent = prayNames.sunrise;
                mainTime.textContent = data.sunrise;
              } else if (item.classList.contains("duh")) {
                prayName.textContent = prayNames.dhuhr;
                mainTime.textContent = data.dhuhr;
              } else if (item.classList.contains("asr")) {
                prayName.textContent = prayNames.asr;
                mainTime.textContent = data.asr;
              } else if (item.classList.contains("mag")) {
                prayName.textContent = prayNames.maghrib;
                mainTime.textContent = data.maghrib;
              } else if (item.classList.contains("ish")) {
                prayName.textContent = prayNames.isha;
                mainTime.textContent = data.isha;
              }
            }
          }
          setActivePray();

          // Set Next Active Pray Div
          function nextActivePrayDiv() {
            let activePray = $(".active-pray"),
              nextActivePray = $(".next-active-pray"),
              nextPrayName = nextActivePray.firstElementChild,
              nextRemainTime = nextActivePray.children[1],
              nextMainTime = nextActivePray.lastElementChild;
            // Set Data
            nextPrayName.textContent =
              activePray.firstElementChild.firstElementChild.textContent;
            nextRemainTime.textContent =
              activePray.firstElementChild.children[1].textContent;
            nextMainTime.textContent = activePray.lastElementChild.textContent;

            // Set Meta Data After Prayers Times
            function setMetaData() {
              let nextPrayTextDiv = $(".nextPrayText"),
                dateClock = $(".date-clock"),
                higriData = $(".higri-date"),
                goergianDate = $(".goergian-date"),
                nextPray = $(".next-pray"),
                timestampDiv = $(".timestamp-div"),
                facebookSite = $(".facebook-site"),
                twitterSite = $(".twitter-site"),
                monthPrayesBtn = $(".month-prayes-btn");

              monthPrayesBtn.setAttribute(
                "href",
                `/month/${userCountryName}/${userCityName}?method=${method}&asr_method=${asr_method}&format=${format}`
              );

              facebookSite.setAttribute(
                "href",
                `https://www.facebook.com/sharer/sharer.php?u=${
                  location.origin
                }/${userCountryName.replace(/ /g, "-")}/${userCityName.replace(
                  / /g,
                  "-"
                )}${location.search}`
              );

              twitterSite.setAttribute(
                "href",
                `https://twitter.com/share?url=${
                  location.origin
                }/${userCountryName.replace(/ /g, "-")}/${userCityName.replace(
                  / /g,
                  "-"
                )}${location.search}`
              );

              let date = new Date()
                  .toLocaleString("en-us", {
                    timeZone: `${meta.timezone}`,
                  })
                  .split(",")[1],
                higri = new Date()
                  .toLocaleString(lang == "en" ? "en-sa" : "ar-sa", {
                    timeZone: `${meta.timezone}`,
                  })
                  .split(" ")[0],
                goergian = new Date()
                  .toLocaleString("en-us", {
                    timeZone: `${meta.timezone}`,
                  })
                  .split(",")[0],
                nextPrayText =
                  $(".active-pray").firstElementChild.firstElementChild
                    .textContent;

              nextPrayTextDiv.textContent = nextPrayText;
              dateClock.lastChild.textContent = date;
              higriData.lastChild.textContent = higri;
              goergianDate.lastChild.textContent = goergian;
              nextPray.lastChild.textContent = nextPrayText;
              timestampDiv.lastChild.textContent = meta.timezone;

              $(".section-add-code").setAttribute(
                "href",
                `${location.origin}/embed/${userData.cityName}/${
                  userData.countryName
                }${lang == "en" ? "?lang=en" : ""}`
              );

              if (lang == "en") {
                dateClock.firstElementChild.textContent = "Clock:";
                dateClock.classList.remove("row-reverse");

                higriData.firstElementChild.textContent = "Higri:";
                nextPray.firstElementChild.textContent = "Next Pray:";
                goergianDate.firstElementChild.textContent = "Date:";
                nextPray.firstElementChild.textContent = "Next Pray:";
                timestampDiv.firstElementChild.textContent = ":Timestamp";

                // More Options

                $(".more-option-btn").textContent = "More Options";
                $(".section-add-code").textContent = "Embed to your Site";
                $(".month-prayes-btn").textContent = "Month Prayer Times";

                let allEnData = $_("option");
                allEnData.forEach((option) => {
                  if (option.getAttribute("data-en") != null) {
                    option.textContent = option.getAttribute("data-en");
                  }
                });

                $(
                  ".more-option-data"
                ).firstElementChild.firstElementChild.textContent =
                  "Calculation Method";
                $(
                  ".more-option-data"
                ).firstElementChild.nextElementSibling.firstElementChild.textContent =
                  "Asr Method";
                $(
                  ".more-option-data"
                ).lastElementChild.firstElementChild.textContent =
                  "Time Format";

                $(".share-tag").textContent = "Share";
              }
            }
            setMetaData();
          }
          nextActivePrayDiv();
        });
    });
}

getPrayersTimes();

setInterval(() => {
  let calcMethod = $(".calc-method"),
    asrMethod = $(".asr-method"),
    timeFormat = $(".time-format");

  getPrayersTimes(calcMethod.value, asrMethod.value, timeFormat.value);
}, 1000);
