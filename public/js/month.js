import { $, $_ } from "../aan/js/main.js";

// getUserLocation

let getUserLocation = new Promise((resolve) => {
  let locationApiKey = `20b96dca8b9a5d37b0355e9461c66e76eed30a2274422fa6213d9de6ffb2b34e`;
  userData.cityName != undefined || userData.countryName != undefined
    ? resolve(userData)
    : fetch(
        `${location.protocol}//api.ipinfodb.com/v3/ip-city/?key=${locationApiKey}&format=json`
      )
        .then((res) => res.json())
        .then((json) => {
          userData = { ...json };
          resolve(userData);
        })
        .catch(() => {
          let alertContainer = document.querySelector(".alert-container"),
            alertText = document.querySelector(".alert-container .alert-text");

          alertText.textContent =
            "حدث خطأ في تحديد موقعك لعرض مواقيت الصلاة، برجاء تحديد الموقع يدويا";
          alertContainer.style.display = "unset";
        });
});

getUserLocation.then((res) => {
  let prayesData = {},
    getPrayData = (
      school = 0,
      juristic = 4,
      format = "12h",
      city = null,
      country = null
    ) => {
      return new Promise((resolve) => {
        (async () => {
          let userLocInfKey = `037e8a09bd12404c82361f76572d7363`;

          let fetchLatLong = fetch(
            `${location.protocol}//api.opencagedata.com/geocode/v1/json?q=${city}+${country}&key=${userLocInfKey}`
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
              `${location.protocol}//api.opencagedata.com/geocode/v1/json?q=${city}+${country}&key=${newKey}`
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

          let url = `${location.protocol}//api.aladhan.com/v1/calendar?latitude=${fetchlat}&longitude=${fetchlng}&method=${school}&school=${juristic}`;

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

  let prayInnerFunc = (res, format) => {
    let getThePrayes = () => {
      let resultCityName = userData.cityName,
        todayNum = new Date().getDate() - 1,
        prayesData = res.data,
        prayesTime = res.data;

      prayesTime.forEach((prayTime) => {
        prayesTime = prayTime.timings;
        prayesTime = Object.entries(prayesTime);
        prayesTime.pop(), prayesTime.splice(7, 2), prayesTime.splice(4, 1);
      });

      if (format == "12h") {
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

      // Add Prayes Data

      // Set Names
      let headTitle = $(".heading-title");

      lang == "en"
        ? (headTitle.textContent = `Month Prayer Times in ${resultCityName.replace(
            "-",
            " "
          )}`)
        : (headTitle.textContent = `مواقيت الصلاة في ${resultCityName.replace(
            "-",
            " "
          )} لهذا الشهر`);

      let addPrayes = () => {
        let tbody = $("tbody"),
          thead = $("thead");
        tbody.innerHTML = "";

        for (let i = 0; i < prayesData.length; i++) {
          let pray = prayesTime[i],
            prayDataPiece = prayesData[i],
            prayDate = prayDataPiece.date.gregorian.date,
            prayHigri = prayDataPiece.date.hijri.date,
            prayArDay = prayDataPiece.date.hijri.weekday.ar,
            prayEnDay = prayDataPiece.date.gregorian.weekday.en,
            finalDayName;

          let timings = prayDataPiece.timings;

          if (lang == "en") {
            finalDayName = prayEnDay;
          } else {
            finalDayName = prayArDay;
          }

          tbody.innerHTML += ` 
          <tr>
                <td class="active">${prayDate}</td>
                <td class="active">${prayHigri}</td>
                <td class="active">${finalDayName}</td>
                <td>${timings.Fajr.split(" ")[0]}</td>
                <td>${timings.Sunrise.split(" ")[0]}</td>
                <td>${timings.Dhuhr.split(" ")[0]}</td>
                <td>${timings.Asr.split(" ")[0]}</td>
                <td>${timings.Maghrib.split(" ")[0]}</td>
                <td>${timings.Isha.split(" ")[0]}</td>
              </tr>`;
        }
      };
      addPrayes();
    };
    getThePrayes();
  };
  // Get Pray Data
  getPrayData(
    location.search.split("&")[0].split("=")[1],
    location.search.split("&")[1].split("=")[1],
    location.search.split("&")[2].split("=")[1],
    userData.cityName,
    userData.countryName,
    userData.latitude,
    userData.longitude
  ).then((json) => {
    prayInnerFunc(json, 1);
  });
});
