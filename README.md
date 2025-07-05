Immersive Moments Booking Software
This repository contains the front-end application for "Immersive Moments," a comprehensive online booking and management solution for 360 Camera & Magazine Gallery Photo Booth Rental services. It's designed to streamline the process of managing client inquiries, contracts, payments, and scheduling, ensuring a smooth workflow for your business.

✨ Features
Client Inquiry Form: A user-friendly form for potential clients to submit service inquiries with essential event details.

Dashboard Overview:

Inquiry Management: Track new inquiries, mark them as "Responded," and convert them into confirmed bookings.

Booking Management: Oversee all confirmed bookings, update payment statuses, and track the completion of service agreements and liability waivers.

Service Agreement Display: Dedicated section to present your service agreement terms.

Liability Waiver Display: Dedicated section to present your liability waiver terms.

Firebase Integration: Utilizes Google Firebase (Firestore for database, Authentication for user management) for robust and scalable backend services.

Responsive Design: Built with Tailwind CSS for optimal viewing and usability across various devices (mobile, tablet, desktop).

🚀 Technologies Used
Frontend:

React - A JavaScript library for building user interfaces.

Vite - A fast build tool for modern web projects.

Tailwind CSS - A utility-first CSS framework for rapid UI development.

Lucide React - A collection of beautiful and customizable open-source icons.

Backend & Database:

Firebase Firestore - NoSQL cloud database for storing inquiries and bookings.

Firebase Authentication - For user authentication (anonymous sign-in used by default in this setup).

Deployment:

Firebase Hosting - For deploying the web application.

GitHub Actions - For automated continuous integration and deployment.

⚙️ Setup & Installation
Follow these steps to get the project up and running on your local machine.

Prerequisites
Node.js (LTS version recommended) & npm (comes with Node.js)

Git

A Google account for Firebase

1. Clone the Repository (If starting fresh or for another machine)
If you haven't already, clone this repository to your local machine:

git clone https://github.com/your-github-username/immersive-moments-app.git
cd immersive-moments-app

2. Install Dependencies
Navigate into the project directory and install the required npm packages:

npm install
npm install firebase lucide-react

3. Firebase Project Setup
This application relies on Firebase for its backend. You need to set up your own Firebase project and configure this application to use it.

Create a Firebase Project:

Go to the Firebase Console.

Click "Add project" and follow the prompts to create a new project (e.g., immersive-moments-booking).

Add a Web App:

In your new Firebase project, click the "Web" icon (</>) to add a web app.

Give it an "App nickname" (e.g., Immersive Moments Booking App).

Copy the firebaseConfig object provided by Firebase. It will look like this:

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

Update src/App.jsx:

Open src/App.jsx in your code editor.

Locate the firebaseConfig object within the useEffect hook's initFirebase function.

Replace the placeholder firebaseConfig with the actual firebaseConfig you copied from the Firebase Console.

Ensure the appId constant is set using firebaseConfig.appId.

The authentication method is set to signInAnonymously(firebaseAuth); for simplicity in this setup.

Set Up Firestore Security Rules:

In the Firebase Console, navigate to Firestore Database -> Rules tab.

Replace the default rules with the following, then Publish them. This allows authenticated users (including anonymous ones) to read and write to your public data collections.

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/public/data/{collection}/{document} {
      allow read, write: if request.auth != null;
    }
    // Optional: If you add user-specific private data later, use this pattern:
    // match /artifacts/{appId}/users/{userId}/{collection}/{document} {
    //   allow read, write: if request.auth != null && request.auth.uid == userId;
    // }
  }
}

Initialize Firebase CLI for Hosting & Firestore:

If you haven't already, install the Firebase CLI globally:

npm install -g firebase-tools

Log in to Firebase via the CLI:

firebase login

(Follow the browser prompts to authenticate.)

Initialize Firebase in your project directory:

firebase init

When prompted for features, select Firestore and Hosting (use Spacebar to select, Enter to confirm).

Select "Use an existing project" and choose your immersive-moments-booking project from the list.

Accept default file names for Firestore rules (firestore.rules) and indexes (firestore.indexes.json).

For the public directory, type dist and press Enter.

Configure as a single-page app: Yes (Y).

Set up automatic builds and deploys with GitHub: Yes (Y).

For the GitHub repository, enter your-github-username/immersive-moments-app (e.g., julianfakeye/immersive-moments-app).

For the build script, accept the default npm ci && npm run build.

4. Push to GitHub to Trigger Deployment
After firebase init completes, new files (firebase.json, .firebaserc, .github/workflows/) are created. You need to commit and push these to your GitHub repository to trigger the automated deployment.

git init # If not already initialized
git add .
git commit -m "Initial project setup with Firebase and GitHub Actions"
# If your remote is not set up, follow GitHub's instructions to add remote
# Example: git remote add origin https://github.com/your-github-username/immersive-moments-app.git
# Example: git branch -M main
git pull origin main --rebase # Crucial to sync with remote GitHub Actions files
git push -u origin main

Important: If git pull origin main --rebase encounters a conflict (e.g., in README.md), resolve it in your editor, git add <conflicted_file>, then git rebase --continue.

You might be prompted to authenticate with GitHub during git push. Use a Personal Access Token (PAT) instead of your password.

Once pushed, go to the "Actions" tab in your GitHub repository to monitor the deployment progress. Your app will be live on a Firebase Hosting URL!

🚀 Usage
Submit Inquiries: Navigate to the "New Inquiry" section to submit client details and event requests.

Manage Dashboard: Visit the "Dashboard" to:

Track the status of inquiries (New, Responded, Converted).

Convert inquiries into full bookings.

Update booking statuses (Payment, Contract Signed, Waiver Signed).

Review Agreements: Use the "Agreement" and "Waiver" tabs to view the terms. In a full production system, clients would digitally sign these.

🤝 Contributing
Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

📄 License
This project is open-source and available under the MIT License.
