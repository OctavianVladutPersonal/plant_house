# 🌿 PlantHouse

A web application to identify and manage your plant collection using AI-powered plant identification.

## Features

- 📷 **Plant Identification**: Take a photo or upload an image to identify plants
- 🗂️ **Plant Collection**: View all your plants in a beautiful grid layout
- 📝 **Detailed Information**: See plant names, care tips, and relevant photos
- 🔥 **Firebase Backend**: Cloud storage for your plant collection
- 🌐 **GitHub Pages Ready**: Deployable as a static website

## Setup Instructions

### 1. Get PlantNet API Key

1. Visit [PlantNet API](https://my.plantnet.org/)
2. Sign up for a free account
3. Go to "Your API Keys" and create a new key
4. Open `app.js` and replace `YOUR_PLANTNET_API_KEY` with your actual API key

```javascript
const PLANTNET_API_KEY = 'your_actual_api_key_here';
```

**Why PlantNet?** It's free for non-commercial use with **500 requests per day** (instead of only 100 total with Plant.id)!

### 2. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. Add a web app to your project:
   - Click on "Web" icon (</>) in project overview
   - Register your app
   - Copy the configuration object

4. Enable Firestore Database:
   - Go to "Firestore Database" in the left sidebar
   - Click "Create database"
   - Start in **production mode** (or test mode for development)
   - Choose a location close to you

5. Update Firebase Configuration:
   - Open `firebase-config.js`
   - Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### 3. Configure Firestore Security Rules

In Firebase Console, go to Firestore Database > Rules and update:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /plants/{plantId} {
      allow read, write: if true;
    }
  }
}
```

**Note**: These rules allow anyone to read/write. For production, implement authentication and proper security rules.

### 4. Deploy to GitHub Pages

1. Create a new repository on GitHub
2. Initialize git in your project folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

3. Enable GitHub Pages:
   - Go to repository Settings > Pages
   - Source: Deploy from branch
   - Branch: `main` / `root`
   - Click Save

4. Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

### 5. Test Locally

Simply open `index.html` in a web browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server
```

Then visit `http://localhost:8000` in your browser.

## How to Use

1. **Add a Plant**:
   - Click "Take/Upload Photo" button
   - **Take a clear, well-lit photo** (leaves visible, minimal background)
   - Click "Identify Plant" (⚠️ uses 1-2 credits per click)
   - Wait for AI identification
   - Review the results and click "Save to Collection"

2. **View Your Collection**:
   - Scroll down to see all saved plants
   - Each card shows the plant name, details, and a relevant photo

3. **Remove a Plant**:
   - Click the "Remove" button on any plant card

## Technologies Used

- HTML5, CSS3, JavaScript
- Firebase Firestore (Database)
- PlantNet API (Plant Identification)
- GitHub Pages (Hosting)

## Browser Compatibility

- Chrome, Edge, Firefox, Safari (latest versions)
- Mobile browsers supported
- Camera access requires HTTPS (works on localhost and GitHub Pages)

## Troubleshooting

**"Error identifying plant"**:
- Check your PlantNet API key is correct
- Ensure you haven't exceeded 500 requests today (resets daily)
- Try with a clearer plant photo showing leaves or flowers
- PlantNet works best with photos of: leaves, flowers, fruits, bark

**"Error loading plants"**:
- Verify Firebase configuration is correct
- Check Firestore security rules
- Open browser console for detailed errors

**Camera not working**:
- Grant camera permissions in your browser
- Use HTTPS (GitHub Pages provides this automatically)
- On mobile, ensure browser has camera access

## Free Tier Limits & Costs

- **PlantNet API**: **500 requests per day** (renews daily)
  - ✅ **Perfect for many plants!**
  - Free for non-commercial use
  - Community-driven scientific database
  - If you need more: Contact them for research/educational projects
- **Firebase**: 50,000 reads, 20,000 writes per day (free tier, renews daily)
- **GitHub Pages**: 100GB bandwidth per month (renews monthly)

### Why PlantNet Over Plant.id?

- **500/day vs 100 total**: Much more generous limits
- **Free forever** for personal use (vs paid plans after 100)
- **Scientific accuracy**: Used by botanists worldwide
- **Best for**: Large plant collections, frequent identification

## Future Enhancements

- User authentication
- Plant care reminders
- Search and filter plants
- Export plant collection
- Share plants with friends

## License

MIT License - Feel free to use and modify for your personal projects!
