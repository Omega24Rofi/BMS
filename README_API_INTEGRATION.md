# Battery Monitoring System - Frontend

React Native / Expo application untuk monitoring baterai secara real-time.

## 🎭 Demo Mode Available!

**App sekarang bisa dijalankan tanpa backend!**

Jika backend tidak tersedia, app akan otomatis masuk ke **Demo Mode** dengan mock data. Perfect untuk:

- 🎨 UI/UX Testing
- � Client Presentation
- 🧪 Development tanpa backend

👉 **[Lihat DEMO_MODE.md untuk detail](./DEMO_MODE.md)**

---

## �🚀 Features

### 1. **Real-Time Monitoring**

- ✅ WebSocket connection untuk data real-time
- ✅ Auto-reconnect saat koneksi terputus
- ✅ Live indicator status
- ✅ **Demo Mode** - Fallback ke mock data jika backend offline

### 2. **Dashboard (Home Page)**

- 📊 Battery level dengan visual indicator
- ⚡ Voltage monitoring dengan status
- 📈 Real-time voltage chart (last 10 data points)
- 🔋 Dynamic color coding berdasarkan level baterai
- ⏰ Last update timestamp
- 🎭 Status badge (Live Data / Demo Mode / Offline)

### 3. **Data Export (Log Page)**

- 📥 Download CSV file
- 📊 Statistics summary (avg voltage, avg battery, total records)
- ⏱️ Last export timestamp
- 🎭 Mock statistics saat demo mode

## 📡 API Integration

### Backend Requirements

Backend server harus berjalan di:

```
http://localhost:3000
```

Atau update di `config/api.config.ts` untuk IP address lain.

### Endpoints Used

- `GET /api/battery/latest` - Latest battery data
- `GET /api/battery/last-month` - Historical data (30 days)
- `GET /api/battery/export-csv` - Export CSV
- `GET /api/battery/status` - System status
- `WebSocket` - Real-time updates

## 🛠️ Setup & Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API URL

Edit `config/api.config.ts`:

```typescript
export const API_CONFIG = {
  // Untuk testing di emulator
  BASE_URL: "http://localhost:3000",

  // Untuk testing di device fisik, ganti dengan IP computer Anda
  // BASE_URL: 'http://192.168.1.100:3000',
};
```

### 3. Start Development Server

```bash
npx expo start
```

### 4. Run on Device/Emulator

- Press `a` untuk Android
- Press `i` untuk iOS
- Scan QR code dengan Expo Go app

## 📱 Testing

### Testing di Android Emulator

```bash
npx expo start --android
```

### Testing di iOS Simulator

```bash
npx expo start --ios
```

### Testing di Physical Device

1. Install Expo Go app dari App Store/Play Store
2. Pastikan device dan computer di network yang sama
3. Update `API_CONFIG.BASE_URL` dengan IP address computer Anda
4. Scan QR code dari terminal

## 🔧 Configuration

### API Configuration (`config/api.config.ts`)

```typescript
export const API_CONFIG = {
  BASE_URL: "http://localhost:3000", // Backend URL
  TIMEOUT: 10000, // Request timeout (ms)
  WS_RECONNECT_DELAY: 1000, // WebSocket reconnect delay
  WS_MAX_RECONNECT_ATTEMPTS: 5, // Max reconnect attempts
};
```

### Find Your IP Address

**Windows:**

```cmd
ipconfig
```

Look for "IPv4 Address"

**macOS/Linux:**

```bash
ifconfig
```

Look for "inet" address

## 📂 Project Structure

```
app/
  (tabs)/
    index.tsx       # Home page (Dashboard)
    explore.tsx     # Log page (Data export)
    profile.tsx     # Profile page
    _layout.tsx     # Tabs layout
config/
  api.config.ts     # API configuration
services/
  api.ts            # REST API service
  websocket.ts      # WebSocket service
styles/
  homeStyles.ts     # Home page styles
```

## 🎨 UI Components

### Home Page

- **Header**: Welcome message + connection status
- **Battery Card**: Level percentage + estimated time
- **Voltage Card**: Current voltage + status + progress bar
- **Chart Card**: Real-time voltage monitoring

### Log Page

- **Export Card**: Download CSV button
- **Summary Card**: Statistics (records, avg voltage, avg battery)

## 🐛 Troubleshooting

### Cannot connect to backend

1. Check if backend server is running
2. Check `API_CONFIG.BASE_URL` is correct
3. For physical device, use computer's IP address (not localhost)
4. Check firewall settings

### WebSocket not connecting

1. Ensure backend WebSocket server is running
2. Check console for connection errors
3. Try manual reconnect by restarting app

### CSV Download not working

1. Check backend `/api/battery/export-csv` endpoint
2. Check browser/device permissions
3. Check network connection

## 📊 Data Flow

```
Backend Server (Port 3000)
    ↓
WebSocket Connection (Real-time)
    ↓
React Native App
    ↓
Display Data
```

## 🔐 Security Notes

- Pastikan backend sudah configure CORS dengan benar
- Jangan expose API ke public tanpa authentication
- Update `BASE_URL` untuk production deployment

## 📝 Notes

- Data chart menampilkan 10 data point terakhir
- WebSocket auto-reconnect dengan exponential backoff
- CSV download menggunakan browser default download
- Semua timestamps dalam format ISO 8601

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License
