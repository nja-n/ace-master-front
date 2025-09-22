import { terms } from "../components/methods";

const TermsPage = () => {
    return (
        <div style={{ width: "100%", height: "100vh", margin: 0, padding: 0 }}>
            <iframe
                src={terms}
                width="100%"
                height="100%"
                style={{ border: "none" }}
                title="Terms and Conditions"
            />
        </div>
    );
};

export default TermsPage;

export const TermsReact = () => {
  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "900px",
        margin: "auto",
        backgroundColor: "rgba(0, 0, 0, 0.6)", // semi-transparent dark overlay
        color: "#f5f5f5", // light text for contrast
        borderRadius: "12px",
        lineHeight: 1.8,
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2em", marginBottom: "20px", textAlign: "center" }}>
        Terms of Service (ToS)
      </h1>
      <p style={{ fontWeight: "bold", fontSize: "1em", marginBottom: "20px" }}>
        Effective Date: September 01, 2025
      </p>

      <hr style={{ border: "1px solid #555", margin: "20px 0" }} />

      <h2 style={{ fontSize: "1.4em", marginTop: "20px" }}>1. Use of the App</h2>
      <p>By using this app, you agree to the terms outlined below. If you do not agree, please do not use the app.</p>

      <hr style={{ border: "1px solid #555", margin: "20px 0" }} />

      <h2 style={{ fontSize: "1.4em", marginTop: "20px" }}>2. Acceptable Use</h2>
      <ul>
        <li>Not to misuse the app in any unlawful way</li>
        <li>Not to attempt unauthorized access or reverse-engineer the app</li>
        <li>To provide accurate information when prompted</li>
        <li>Not to harass, abuse, or cheat other players in multiplayer sessions</li>
      </ul>

      <hr style={{ border: "1px solid #555", margin: "20px 0" }} />

      <h2 style={{ fontSize: "1.4em", marginTop: "20px" }}>3. Age Restrictions</h2>
      <ul>
        <li>Users must be 13 years or older to use this app</li>
        <li>Users under 18 should use the app under parental supervision</li>
      </ul>

      <hr style={{ border: "1px solid #555", margin: "20px 0" }} />

      <h2 style={{ fontSize: "1.4em", marginTop: "20px" }}>4. User Accounts & Multiplayer</h2>
      <ul>
        <li>Creating an account is required to play multiplayer games.</li>
        <li>Keep your account credentials confidential; you are responsible for all activity on your account.</li>
        <li>Multiplayer features may include emojis, chat, and in the future, voice chat.</li>
        <li>Abuse or exploitation of multiplayer features may result in suspension or termination.</li>
      </ul>

      <hr style={{ border: "1px solid #555", margin: "20px 0" }} />

      <h2 style={{ fontSize: "1.4em", marginTop: "20px" }}>5. Virtual Coins & In-App Purchases</h2>
      <ul>
        <li>The app includes virtual coins for gameplay.</li>
        <li>In-app purchases may be added in future releases.</li>
        <li>Virtual coins have no real-world cash value and cannot be exchanged for real money.</li>
        <li>Refunds for purchases are subject to the platform’s policies.</li>
      </ul>

      <hr style={{ border: "1px solid #555", margin: "20px 0" }} />

      <h2 style={{ fontSize: "1.4em", marginTop: "20px" }}>6. Ads</h2>
      <p>This app may display advertisements on various screens. By using the app, you consent to viewing these ads.</p>

      <hr style={{ border: "1px solid #555", margin: "20px 0" }} />

      <h2 style={{ fontSize: "1.4em", marginTop: "20px" }}>7. User-Generated Content (Blogs)</h2>
      <ul>
        <li>Users may post content on the app’s blog section for other users to view.</li>
        <li>Do not post offensive, illegal, or copyrighted content.</li>
        <li>The app reserves the right to remove any content violating these terms.</li>
      </ul>

      <hr style={{ border: "1px solid #555", margin: "20px 0" }} />

      <h2 style={{ fontSize: "1.4em", marginTop: "20px" }}>8. Intellectual Property</h2>
      <ul>
        <li>All game content, graphics, code, and design are the intellectual property of Aeither Developers.</li>
        <li>You may not reuse or redistribute any content without permission.</li>
      </ul>

      <hr style={{ border: "1px solid #555", margin: "20px 0" }} />

      <h2 style={{ fontSize: "1.4em", marginTop: "20px" }}>9. Limitation of Liability</h2>
      <p>We are not liable for any direct or indirect damages resulting from the use of the app. Use at your own risk.</p>

      <hr style={{ border: "1px solid #555", margin: "20px 0" }} />

      <h2 style={{ fontSize: "1.4em", marginTop: "20px" }}>10. Changes to Terms</h2>
      <p>We reserve the right to update these terms. Continued use of the app indicates your acceptance of the new terms.</p>
    </div>
  );
};

export const PrivacyReact = () => {
  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "900px",
        margin: "auto",
        backgroundColor: "rgba(0, 0, 0, 0.6)", // semi-transparent dark overlay
        color: "#f5f5f5", // light text
        borderRadius: "12px",
        lineHeight: 1.8,
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2em", marginBottom: "20px", textAlign: "center" }}>
        Privacy Policy
      </h1>

      <p style={{ fontWeight: "bold", fontSize: "1em", marginBottom: "10px" }}>
        Effective Date: May 01, 2025
      </p>
      <p style={{ fontWeight: "bold", fontSize: "1em", marginBottom: "20px" }}>
        Last Updated: September 1, 2025 | Effective Up To: March 2026
      </p>

      <p style={{ fontWeight: "bold" }}>App Name: Ace Master</p>
      <p style={{ fontWeight: "bold" }}>Website: <a href="https://ace-master.onrender.com/aeither" target="_blank" style={{ color: "#4FC3F7" }}>ace-master.onrender.com/aeither</a></p>
      <p style={{ fontWeight: "bold", marginBottom: "20px" }}>Developer: Aeither</p>

      <hr style={{ border: "1px solid #555", margin: "20px 0" }} />

      <h2 style={{ fontSize: "1.4em", marginTop: "20px" }}>1. Information We Collect</h2>
      <ul>
        <li>Name (entered by the user)</li>
        <li>Client system details (browser type, device type, IP address, technical data)</li>
        <li>Login credentials (email address, username)</li>
        <li>Gameplay and usage data</li>
      </ul>

      <hr style={{ border: "1px solid #555", margin: "20px 0" }} />

      <h2 style={{ fontSize: "1.4em", marginTop: "20px" }}>2. Why We Collect This Data</h2>
      <ul>
        <li>To personalize your gaming experience</li>
        <li>To improve game performance and fix technical issues</li>
        <li>To analyze user behavior for feature improvement</li>
      </ul>

      <hr style={{ border: "1px solid #555", margin: "20px 0" }} />

      <h2 style={{ fontSize: "1.4em", marginTop: "20px" }}>3. How We Store and Protect Your Data</h2>
      <ul>
        <li>All user data is securely stored using industry-standard methods</li>
        <li>Reasonable precautions are taken to protect data from loss, misuse, and unauthorized access</li>
        <li>No sensitive financial or personal identification numbers are stored</li>
      </ul>

      <hr style={{ border: "1px solid #555", margin: "20px 0" }} />

      <h2 style={{ fontSize: "1.4em", marginTop: "20px" }}>4. Data Sharing</h2>
      <ul>
        <li>We do not sell or trade your personal information</li>
        <li>Some data may be shared with trusted third parties (like Google Ads or Firebase Analytics) strictly for functionality and analytics purposes</li>
      </ul>

      <hr style={{ border: "1px solid #555", margin: "20px 0" }} />

      <h2 style={{ fontSize: "1.4em", marginTop: "20px" }}>5. User Rights</h2>
      <ul>
        <li>You can request to view, update, or delete your data by contacting us at: <a href="mailto:aeither.dev@hotmail.com" style={{ color: "#4FC3F7" }}>aeither.dev@hotmail.com</a></li>
        <li>If you are under 18, please seek parental consent before using the game</li>
      </ul>

      <hr style={{ border: "1px solid #555", margin: "20px 0" }} />

      <h2 style={{ fontSize: "1.4em", marginTop: "20px" }}>6. Updates to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. The updated version will always be posted on this page.</p>

      <hr style={{ border: "1px solid #555", margin: "20px 0" }} />

      <p style={{ fontStyle: "italic", marginTop: "20px" }}>
        By using Ace Master, you consent to this Privacy Policy. For questions or concerns, contact us at <a href="mailto:aeither.dev@hotmail.com" style={{ color: "#4FC3F7" }}>aeither.dev@hotmail.com</a>.
      </p>
    </div>
  );
};
