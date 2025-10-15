# 🎭 Demo Mode - Testing Without Backend

App sekarang sudah dilengkapi dengan **Demo Mode** yang memungkinkan testing UI tanpa perlu menjalankan backend server.

## 🔄 Cara Kerja

Ketika backend server tidak tersedia (`http://localhost:3000`), app akan otomatis:

1. **Menggunakan Mock Data** - Data dummy yang realistis untuk testing UI
2. **Menampilkan Status "Demo Mode"** - Badge kuning di header menunjukkan sedang menggunakan data demo
3. **Tetap Fungsional** - Semua komponen UI tetap dapat digunakan dan dilihat

## 📊 Fitur Demo Mode

### Home Page (index.tsx)

- ✅ Menampilkan data battery dummy (78%, 11.84V)
- ✅ Chart dengan 10 data point dummy
- ✅ Status badge menunjukkan "Demo Mode" (kuning)
- ✅ Semua animasi dan UI tetap berfungsi

### Log Page (explore.tsx)

- ✅ Statistik dummy (720 records, avg 11.7V, 76.5%)
- ✅ Tombol download CSV tetap ada (akan memberi info jika backend offline)
- ✅ UI lengkap dapat dipreview

## 🔴 Status Indicator

| Color     | Status    | Keterangan                               |
| --------- | --------- | ---------------------------------------- |
| 🟢 Green  | Live Data | Terhubung dengan backend, data real-time |
| 🟡 Yellow | Demo Mode | Backend offline, menggunakan mock data   |
| 🔴 Red    | Offline   | Tidak ada koneksi sama sekali            |

## 🚀 Cara Mengaktifkan Live Data

Untuk menggunakan data real-time dari backend:

1. **Start Backend Server:**

   ```bash
   # Pastikan backend server berjalan di http://localhost:3000
   cd path/to/backend
   npm start
   ```

2. **Restart Expo App:**

   ```bash
   # Tekan 'r' di Metro Bundler untuk reload
   ```

3. **Check Status Badge:**
   - Jika backend sudah jalan: Status akan berubah menjadi "Live Data" 🟢
   - App akan otomatis fetch data dari API
   - WebSocket akan connect untuk real-time updates

## 📱 Testing di Physical Device

Jika test di physical device (bukan emulator):

1. Update `config/api.config.ts`:

   ```typescript
   export const API_CONFIG = {
     BASE_URL: "http://YOUR_COMPUTER_IP:3000", // Ganti dengan IP komputer
   };
   ```

2. Find your computer's IP:

   ```bash
   # Windows
   ipconfig

   # Look for "IPv4 Address" under your active network adapter
   # Example: 192.168.1.100
   ```

3. Make sure your phone and computer are on the **same WiFi network**

## ⚠️ Console Logs

Saat demo mode aktif, akan muncul log di console:

```
📱 Using mock data for development
📱 Using mock stats for development
```

Ini normal dan menunjukkan fallback data sedang digunakan.

## 💡 Tips

- **Development:** Demo mode berguna untuk UI testing tanpa perlu setup backend
- **Testing:** Gunakan demo mode untuk show UI ke client/team
- **Production:** Pastikan backend sudah running sebelum deploy ke production
- **Debugging:** Check console logs untuk tahu apakah menggunakan real data atau mock data

## 🔧 Troubleshooting

**Q: Status masih "Demo Mode" padahal backend sudah jalan?**

- Reload app dengan tekan 'r' di Metro Bundler
- Check backend server benar-benar accessible di `http://localhost:3000/api/battery/latest`
- Test dengan browser: buka `http://localhost:3000/api/battery/latest`

**Q: Error "Network Error" terus muncul?**

- Normal jika backend belum jalan - app akan otomatis pakai demo mode
- Untuk disable error logs, comment out `console.error()` di services/api.ts

**Q: WebSocket error di console?**

- Normal jika backend belum jalan
- WebSocket akan auto-reconnect ketika backend ready
- Maximum 3 retry attempts dengan exponential backoff

---

✨ **Sekarang app bisa ditest kapan saja tanpa perlu backend!** ✨
