require("dotenv").config();

async function checkModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("❌ לא נמצא GEMINI_API_KEY. וודא שאתה מריץ את זה מתוך תיקיית back ויש לך קובץ .env");
    return;
  }

  console.log("🔄 מתחבר לגוגל כדי לבדוק אילו מודלים פתוחים למפתח שלך...");
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();

    if (data.error) {
      console.error("❌ שגיאה מגוגל:", data.error.message);
      return;
    }

    console.log("\n✅ המודלים שזמינים לך לראייה וטקסט (חפש משהו עם flash או pro):");
    data.models.forEach(m => {
      // אנחנו מסננים רק את המודלים שיכולים לייצר תוכן (ולא מודלים של חיפוש או דיבוב)
      if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
        console.log(`  • ${m.name.replace('models/', '')}`);
      }
    });
    
    console.log("\n👉 קח את אחד השמות מכאן (עדיף flash) והדבק אותו ב-visionService.js!");

  } catch (err) {
    console.error("❌ שגיאה בחיבור:", err.message);
  }
}

checkModels();