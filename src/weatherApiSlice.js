import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 🎯 إنشاء Async Thunk لجلب بيانات الطقس من API خارجي
const fetchWeather = createAsyncThunk("myThunkFunction", async () => {
  console.log("calling fetch weather");

  const response = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather?lat=42.7&lon=46.5&appid=d007be9936701288587b77f1f867b83d"
  );

  // 🔥 تحويل درجات الحرارة من كلفن إلى مئوية وتنسيق البيانات
  const responseTemp = Math.round(response.data.main.temp - 272.15);
  const min = Math.round(response.data.main.temp_min - 272.15);
  const max = Math.round(response.data.main.temp_max - 272.15);
  const description = response.data.weather[0].description;
  const responseIcon = response.data.weather[0].icon;

  console.log(response);

  // 📦 إرجاع البيانات بالشكل المناسب للحالة (state)
  return {
    number: responseTemp,
    description,
    min,
    max,
    icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`,
  };
});

// 🛠️ إنشاء Slice لإدارة حالة الطقس وحالة التحميل
const weatherApiSlice = createSlice({
  name: "weatherApi",
  initialState: {
    result: "empty",
    weather: {},
    isLoading: false,
  },
  reducers: {
    changeResult: (state) => {
      state.result = "changed";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        console.log("fetchWeather pending");
        state.isLoading = true;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.isLoading = false;
        state.weather = action.payload;
      })
      .addCase(fetchWeather.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { changeResult } = weatherApiSlice.actions;
export { fetchWeather };
export default weatherApiSlice.reducer;