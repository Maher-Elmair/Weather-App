import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import moment from "moment/min/moment-with-locales";
import "moment/min/locales";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { fetchWeather } from "./weatherApiSlice";

moment.locale("ar");

const theme = createTheme({
  typography: {
    fontFamily: ["IBM"],
  },
});

function App() {
  const dispatch = useDispatch();

  // 🎛️ قراءة حالة التحميل وبيانات الطقس من الـ Redux Store
  const isLoading = useSelector((state) => state.weather.isLoading);
  const temp = useSelector((state) => state.weather.weather);

  const { t, i18n } = useTranslation();

  // 🕰️ حالات التخزين للوقت واللغة
  const [dateAndTime, setDateAndTime] = useState("");
  const [locale, setLocale] = useState("ar");
  const direction = locale === "ar" ? "rtl" : "ltr";

  // 🔄 تغيير اللغة والتاريخ عند الضغط على الزر
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
    const dateAndTime = moment().format("MMMM Do YYYY");
    setDateAndTime(dateAndTime);
  }

  // ⚡ جلب بيانات الطقس عند تحميل المكون
  useEffect(() => {
    dispatch(fetchWeather());
    i18n.changeLanguage(locale);
  }, []);

  // ⏰ تحديث الوقت الحالي عند تحميل المكون
  useEffect(() => {
    const dateAndTime = moment().format("MMMM Do YYYY");
    setDateAndTime(dateAndTime);
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
                // width: "100%",
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
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
                    }}
                  >
                    {t("Riyadh")}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 200,
                      opacity: 0.9,
                      mx: 2,
                      fontSize: { xs: "0.9rem", sm: "1.2rem" },
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
                    flexWrap: "wrap",
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
                      {isLoading ? (
                        <CircularProgress style={{ color: "white" }} />
                      ) : (
                        ""
                      )}
                      <Typography
                        variant="h1"
                        sx={{
                          textAlign: "center",
                          fontSize: { xs: "2.8rem", sm: "4rem" },
                        }}
                      >
                        {temp.number}
                      </Typography>
                      <img src={temp.icon} alt="Weather icon" />
                    </div>

                    <Typography
                      variant="h6"
                      sx={{
                        mt: 1,
                        fontSize: { xs: "1rem", sm: "1.2rem" },
                      }}
                    >
                      {t(temp.description)}
                    </Typography>

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
                    sx={{
                      fontSize: { xs: 100, sm: 180, md: 200 },
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
                sx={{
                  color: "white",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
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
