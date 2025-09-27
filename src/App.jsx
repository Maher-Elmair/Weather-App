// ✅ استيراد ملفات التنسيق والمكونات المحلية
import "./App.css";
// import Test from "./Test";

// ✅ استيراد إعدادات الثيم من مكتبة MUI
import { createTheme, ThemeProvider } from "@mui/material/styles";

// ✅ استيراد Hooks من React
import { useEffect, useState } from "react";

// ✅ استيراد مكونات جاهزة من MUI
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";

// ✅ استيراد مكتبات خارجية
import axios from "axios";
import moment from "moment/min/moment-with-locales";
import "moment/min/locales"; // لدعم التواريخ بلغات متعددة
import { useTranslation } from "react-i18next";

// ✅ إعداد اللغات المتاحة لـ moment
// import "moment/locale/ar";
moment.locale("ar");

// ✅ إنشاء الثيم المخصص باستخدام خط IBM
const theme = createTheme({
  typography: {
    fontFamily: ["IBM"], // يتم تعريف هذا الخط في ملف App.css
  },
});

// ✅ متغير عام لإلغاء الطلب في حال مغادرة المكون
let cancelAxios = null;

function App() {
  const { t, i18n } = useTranslation(); // 🔁 الترجمة الدولية

  //============================//
  // 🔵 تعريف الحالات (States)
  //============================//
  const [dateAndTime, setDateAndTime] = useState(""); // ⏰ لحفظ التاريخ والوقت الحالي
  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: null,
  }); // 🌡️ بيانات الطقس

  const [locale, setLocale] = useState("ar"); // 🌐 اللغة الحالية
  const direction = locale === "ar" ? "rtl" : "ltr"; // 🔄 اتجاه الصفحة

  //============================//
  // 🟢 تغيير اللغة عند الضغط
  //============================//
  function handleLanguageClick() {
    if (locale === "en") {
      setLocale("ar");
      i18n.changeLanguage("ar");
      moment.locale("ar");
    } else {
      setLocale("en");
      i18n.changeLanguage("en");
      moment.locale("en");
    }
    // تحديث التاريخ بعد تغيير اللغة
    const dateAndTime = moment().format("MMMM Do YYYY");
    setDateAndTime(dateAndTime);
  }

  //============================//
  // 🟡 ضبط اللغة عند تحميل التطبيق
  //============================//
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, []);

  //============================//
  // 🔴 جلب بيانات الطقس من API
  //============================//
  useEffect(() => {
    // ⏰ تنسيق الوقت حسب اللغة
    const dateAndTime = moment().format("MMMM Do YYYY");
    setDateAndTime(dateAndTime);

    // 📡 إرسال الطلب
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=42.7&lon=46.5&appid=d007be9936701288587b77f1f867b83d",
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        }
      )
      .then(function (response) {
        // ✅ استخراج البيانات من الاستجابة
        const responseTemp = Math.round(response.data.main.temp - 272.15); // تحويل من كلفن إلى مئوي
        const min = Math.round(response.data.main.temp_min - 272.15);
        const max = Math.round(response.data.main.temp_max - 272.15);
        const description = response.data.weather[0].description;
        const responseIcon = response.data.weather[0].icon;

        // 📥 حفظ البيانات في الحالة
        setTemp({
          number: responseTemp,
          description: description,
          min: min,
          max: max,
          icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`,
        });

        console.log(response);
      })
      .catch(function (error) {
        // ❌ في حال وجود خطأ
        console.log(error);
      });

    // 🧹 تنظيف الطلب عند الخروج
    return () => {
      console.log("canceling");
      cancelAxios();
    };
  }, []);

  //============================//
  // 🟢 واجهة العرض الرئيسية
  //============================//
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          {/* ✅ حاوية المحتوى الرئيسية */}
          <div
            style={{
              height: "100vh",
              display: "flex",
              alignItems: "end",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            {/* ✅ البطاقة (Card) */}
            <div
              style={{
                width: "100%",
                background: "rgb(28 29 91 / 36%)",
                color: "white",
                padding: "32px",
                borderRadius: "15px",
                boxShadow: "0px 11px 1px  rgb(0,0,0,0.05)",
              }}
              dir={direction}
            >
              {/* ✅ تفاصيل المدينة والطقس */}
              <div>
                {/* 🔷 المدينة والتاريخ */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "start",
                  }}
                  dir={direction}
                >
                  <Typography
                    variant="h2"
                    style={{
                      marginRight: "20px",
                      fontWeight: "600",
                    }}
                  >
                    {t("Riyadh")}
                  </Typography>
                  <Typography
                    variant="h5"
                    style={{
                      marginRight: "20px",
                      fontWeight: "200",
                      opacity: "0.9",
                    }}
                  >
                    {dateAndTime}
                  </Typography>
                </div>

                <hr />

                {/* 🔶 درجة الحرارة والوصف */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  {/* 🔸 البيانات النصية */}
                  <div>
                    {/* 🔹 الرقم والرمز */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="h1" style={{ textAlign: "right" }}>
                        {temp.number}
                      </Typography>
                      <img src={temp.icon} alt="Weather icon" />
                    </div>

                    <Typography variant="h6">{t(temp.description)}</Typography>

                    {/* 🔸 الحد الأدنى والأقصى */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <h5>
                        {t("min")}: {temp.min}
                      </h5>
                      <h5 style={{ margin: "0px 5px" }}>|</h5>
                      <h5>
                        {t("max")}: {temp.max}
                      </h5>
                    </div>
                  </div>

                  {/* 🔹 أيقونة سحاب */}
                  <CloudIcon
                    style={{
                      fontSize: "200px",
                      color: "white",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 🌐 زر تغيير اللغة */}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "end",
                marginTop: "20px",
              }}
              dir={direction}
            >
              <Button
                style={{ color: "white" }}
                variant="text"
                onClick={handleLanguageClick}
              >
                {locale === "en" ? "العربية" : "English"}
              </Button>
            </div>
          </div>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
