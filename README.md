# Muslim Day

A beautiful, minimalist Islamic companion app that displays daily Quranic verses, prayer times, and Islamic calendar dates. Features random Quran ayahs with translations, automatic location-based prayer times, and a clean, aesthetic interface.

## Features

- **Random Quran Verses**: Display random Quranic verses in Arabic with English translations
- **Copy to Clipboard**: Share verses easily with one click
- **Prayer Times**: Automatic prayer time calculation based on user location
- **Dual Calendar**: Display both Hijri and Gregorian dates
- **Live Clock**: Real-time digital clock display
- **Bilingual Support**: Toggle between Arabic and English text
- **Location-Based**: Uses geolocation for accurate prayer times
- **Smooth Animations**: Elegant UI transitions with Motion (Framer Motion)
- **Responsive Design**: Works beautifully on all devices
- **Tested**: Includes unit tests with Vitest

## Tech Stack

- **Frontend**: React 19 with Vite
- **Routing**: React Router DOM v7
- **Styling**: Bootstrap 5 + Custom CSS
- **Animations**: Motion (Framer Motion)
- **Icons**: React Icons
- **Testing**: Vitest + React Testing Library
- **Loading States**: React Spinners
- **APIs**:
  - Aladhan API (Prayer times)
  - Local Quran JSON (Verses)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Modern browser with geolocation support

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd muslim-day
```

2. Install dependencies:
```bash
npm install
```

3. Ensure you have the required static assets:
   - `/public/API/quran_en.json` - Quran verses data
   - `/public/img/bg-big.jpg` - Desktop background
   - `/public/img/bg-small.jpg` - Mobile background
   - `/public/img/icons8-*.png` - Prayer time icons
   - `/public/fonts/` - Custom fonts (Ubuntu, Amiri)

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── RenderComponents/
│   │   ├── CurrentTime.jsx         # Live clock component
│   │   ├── Date.jsx                # Hijri and Gregorian dates
│   │   ├── PrayersTimes.jsx        # Prayer times display
│   │   ├── Quran.jsx               # Random Quran verse with actions
│   │   └── Quran.test.jsx          # Unit tests for Quran component
│   ├── pages/
│   │   └── Home.jsx                # Main page with all components
│   └── reusableComponents/
│       └── LoadingSpinner.jsx      # Loading state component
├── App.jsx                         # Main app with routing
├── App.css                         # Global styles
├── fonts.css                       # Custom font definitions
├── main.jsx                        # App entry point
└── setUpTests.js                   # Test configuration
```

## Data Structure

### Quran JSON Format

The `quran_en.json` file should follow this structure:

```json
[
  {
    "id": 1,
    "name": "الفاتحة",
    "transliteration": "Al-Fatihah",
    "verses": [
      {
        "id": 1,
        "text": "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ",
        "translation": "In the name of Allah, the Entirely Merciful, the Especially Merciful"
      }
    ]
  }
]
```

### Prayer Times API Response

The Aladhan API returns:
```json
{
  "data": {
    "timings": {
      "Fajr": "04:30",
      "Sunrise": "05:50",
      "Dhuhr": "12:15",
      "Asr": "15:45",
      "Maghrib": "18:30",
      "Isha": "20:00"
    },
    "date": {
      "hijri": {
        "day": "15",
        "month": { "en": "Ramadan" },
        "year": "1446"
      },
      "gregorian": {
        "day": "10",
        "month": { "en": "October" },
        "year": "2025"
      }
    }
  }
}
```

## Key Features Explained

### Geolocation-Based Prayer Times

The app automatically detects user location and fetches accurate prayer times:

```javascript
navigator.geolocation.getCurrentPosition(
  (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    getPrayerData(lat, lon);
  },
  () => {
    // Fallback to Cairo coordinates
    getPrayerData(30.0444, 31.2357);
  }
);
```

**Fallback**: If location access is denied, defaults to Cairo, Egypt coordinates.

### Random Quran Verse Selection

Randomly selects a verse from the entire Quran:

```javascript
const randomSurahIndex = Math.floor(Math.random() * data.length);
const randomSurah = data[randomSurahIndex];
const randomVerseIndex = Math.floor(Math.random() * randomSurah.verses.length);
const randomVerse = randomSurah.verses[randomVerseIndex];
```

### Prayer Time Formatting

Converts 24-hour format to 12-hour AM/PM format:

```javascript
const formatPrayerTime = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  const numHours = parseInt(hours);
  const AmPm = numHours >= 12 ? "PM" : "AM";
  const formattedHours = numHours % 12 || 12;
  return `${formattedHours}:${minutes} ${AmPm}`;
};
```

### Live Clock

Updates every second with real-time display:

```javascript
useEffect(() => {
  const timer = setInterval(() => {
    const now = new Date();
    setCurrentTime(
      now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    );
  }, 1000);
  return () => clearInterval(timer);
}, []);
```

### Translation Toggle

Switch between Arabic and English text:
- Arabic: Shows original Quranic text with Surah name
- English: Shows translation with transliterated Surah name

### Copy to Clipboard

Share verses with visual feedback:
- Copies current verse (Arabic or English)
- Shows notification for 3 seconds
- Smooth animation with Motion

## Testing

The app includes unit tests using Vitest and React Testing Library.

### Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test -- --coverage
```

### Test Coverage

The `Quran.test.jsx` file tests:
1. **Random Verse Generation**: Ensures clicking refresh changes the verse
2. **Translation Toggle**: Verifies translation appears when clicked
3. **Copy Functionality**: Confirms clipboard API is called and notification shows

Example test:

```javascript
test("assure verse changes", async () => {
  render(<Quran />);
  await waitFor(() => {
    expect(screen.getByTestId("randomAyahBtn")).toBeInTheDocument();
  });
  
  const randomAyahBtn = screen.getByTestId("randomAyahBtn");
  const AyahText = screen.getByRole("heading", { level: 4 });
  const initialText = AyahText.textContent;
  
  await userEvent.click(randomAyahBtn);
  
  await waitFor(() => {
    expect(AyahText.textContent).not.toBe(initialText);
  });
});
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests with Vitest

## API Integration

### Aladhan Prayer Times API

**Endpoint**: `https://api.aladhan.com/v1/timings`

**Parameters**:
- `latitude`: User's latitude
- `longitude`: User's longitude
- `method`: Calculation method (5 = Egyptian General Authority of Survey)

**Usage**:
```javascript
const response = await fetch(
  `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=5`
);
```

**Available Calculation Methods**:
- 0: Shia Ithna-Ashari
- 1: University of Islamic Sciences, Karachi
- 2: Islamic Society of North America
- 3: Muslim World League
- 4: Umm Al-Qura University, Makkah
- 5: Egyptian General Authority of Survey
- 7: Institute of Geophysics, University of Tehran

## Customization

### Background Images

Replace images in `/public/img/`:
- `bg-big.jpg` - Desktop background (1920x1080 recommended)
- `bg-small.jpg` - Mobile background (1080x1920 recommended)

### Prayer Time Icons

Replace icons in `/public/img/`:
- `icons8-dawn-16.png` - Fajr
- `icons8-sunrise-16.png` - Sunrise
- `icons8-midday-16.png` - Dhuhr
- `icons8-afternoon-16.png` - Asr
- `icons8-sunset-16.png` - Maghrib
- `icons8-night-16.png` - Isha

### Calculation Method

Change the prayer time calculation method in `Home.jsx`:

```javascript
// Change method parameter (0-7)
const url = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=5`;
```

### Fallback Location

Update the default coordinates in `Home.jsx`:

```javascript
// Change to your preferred city
await getPrayerData(30.0444, 31.2357); // Cairo
```

## Styling

The app uses CSS custom properties and glassmorphism effects:

```css
.quranCard {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(3px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
}
```

Modify `App.css` to adjust:
- Card transparency
- Blur effects
- Border colors
- Border radius
- Font sizes

## Browser Support

Modern browsers with:
- Geolocation API support
- ES6+ JavaScript
- CSS backdrop-filter support

Tested on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Known Limitations

- Requires geolocation permission for accurate prayer times
- Quran data must be loaded locally (no online API)
- Prayer times API requires internet connection
- No offline mode for prayer times
- Limited to Egyptian calculation method by default

## Future Enhancements

- [ ] Offline mode with cached prayer times
- [ ] Prayer notifications/alerts
- [ ] Qibla direction compass
- [ ] Daily hadith display
- [ ] Tasbih counter
- [ ] Multiple calculation methods selection
- [ ] Custom location manual input
- [ ] Bookmark favorite verses
- [ ] Share verse as image
- [ ] Audio recitation of verses
- [ ] Prayer time reminders
- [ ] Next prayer countdown
- [ ] Dark/Light theme toggle
- [ ] Multiple language support

## Privacy

- **Geolocation**: Only used for prayer time calculation, not stored
- **No Tracking**: No analytics or tracking scripts
- **No User Data**: No personal information collected
- **Local Storage**: Only used for temporary data if needed

## Troubleshooting

### Prayer Times Not Loading
- Check internet connection
- Allow location access in browser
- Verify Aladhan API is accessible
- Falls back to Cairo times if location denied

### Quran Verses Not Showing
- Ensure `quran_en.json` is in `/public/API/`
- Check JSON file formatting
- Verify fetch path is correct
- Check browser console for errors

### Background Not Displaying
- Verify image files exist in `/public/img/`
- Check file names match CSS references
- Ensure correct image format (jpg, webp)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Commit your changes
6. Push to the branch
7. Open a pull request

## Testing Guidelines

When adding new features:
1. Write unit tests with Vitest
2. Use React Testing Library
3. Mock external APIs
4. Test user interactions
5. Aim for >80% code coverage

## License

This project is open source and available under the MIT License.

## Acknowledgments

- [Aladhan API](https://aladhan.com/prayer-times-api) for prayer times
- [Icons8](https://icons8.com) for prayer time icons
- Motion (Framer Motion) for smooth animations
- Bootstrap for responsive layout
- React Testing Library for testing utilities
- Vitest for fast unit testing
- The Quran data providers

## Islamic Resources

For more Islamic resources:
- [Quran.com](https://quran.com) - Complete Quran with translations
- [Sunnah.com](https://sunnah.com) - Hadith collections
- [IslamicFinder](https://islamicfinder.org) - Prayer times worldwide

---

**Note**: This app is designed for personal use and Islamic learning. Please verify prayer times with local mosque for accuracy, especially during Ramadan and for Eid prayers.
