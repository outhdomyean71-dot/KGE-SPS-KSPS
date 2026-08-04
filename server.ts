import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI client server-side
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // API Endpoint: Generate MoEYS Standard 5-Step Lesson Plan (កិច្ចតែងការបង្រៀន ៥ជំហាន)
  app.post('/api/gemini/generate-lesson-plan', async (req, res) => {
    try {
      const { grade, subject, lessonTitle, month, objectives, promptText } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY environment variable is missing on the server.',
        });
      }

      const systemInstruction = `អ្នកគឺជាអ្នកជំនាញគរុកោសល្យ និងជាគ្រូឧទ្ទេសបង្រៀនកម្រិតបឋមសិក្សាដ៏ឆ្នើម នៃក្រសួងអប់រំ យុវជន និងកីឡា នៃព្រះរាជាណាចក្រកម្ពុជា។ 
សូមរៀបចំកិច្ចតែងការបង្រៀនគំរូ ៥ជំហាន (MoEYS Standard 5-Step Lesson Plan) ជាភាសាខ្មែរផ្លូវការ ត្រឹមត្រូវតាមបច្ចេកទេសគរុកោសល្យ។`;

      const userPrompt = `
សូមបង្កើតកិច្ចតែងការបង្រៀនគំរូ ៥ជំហាន សម្រាប់៖
- កម្រិតថ្នាក់៖ ${grade || 'ថ្នាក់ទី១'}
- មុខវិជ្ជា៖ ${subject || 'ភាសាខ្មែរ'}
- មេរៀន/ជំពូក៖ ${lessonTitle || 'មេរៀនទូទៅ'}
- ខែសិក្សា៖ ${month || 'ខែទី១'}
- វត្ថុបំណងដើម៖
  + ចំណេះដឹង៖ ${objectives?.knowledge || 'យល់ដឹងពីខ្លឹមសារមេរៀន'}
  + បំណិន៖ ${objectives?.skills || 'អនុវត្ត និងដោះស្រាយលំហាត់បានត្រឹមត្រូវ'}
  + ឥរិយាបថ៖ ${objectives?.attitudes || 'មានស្មារតីប្រុងប្រយ័ត្ន និងស្រឡាញ់ការសិក្សា'}
${promptText ? `- សំណូមពរបន្ថែម៖ ${promptText}` : ''}

សូមផ្ដល់លទ្ធផលជាទម្រង់ JSON ដូចខាងក្រោម៖
{
  "title": "ចំណងជើងមេរៀន/កិច្ចតែងការ",
  "grade": "ថ្នាក់...",
  "subject": "មុខវិជ្ជា...",
  "duration": "រយៈពេល (ឧទាហរណ៍៖ ៤០នាទី)",
  "teachingAids": ["សម្ភារឧបទេសទី១", "សម្ភារឧបទេសទី២"],
  "objectives": {
    "knowledge": "ចំណេះដឹង...",
    "skills": "បំណិន...",
    "attitudes": "ឥរិយាបថ..."
  },
  "steps": [
    {
      "stepNumber": 1,
      "title": "ជំហានទី១៖ រដ្ឋបាលថ្នាក់ (Class Administration)",
      "duration": "៣-៥ នាទី",
      "teacherActivities": "សកម្មភាពគ្រូ...",
      "studentActivities": "សកម្មភាពសិស្ស..."
    },
    {
      "stepNumber": 2,
      "title": "ជំហានទី២៖ រំលឹកមេរៀនចាស់ ឬ ពិនិត្យកិច្ចការផ្ទះ (Review)",
      "duration": "៥ នាទី",
      "teacherActivities": "សកម្មភាពគ្រូ...",
      "studentActivities": "សកម្មភាពសិស្ស..."
    },
    {
      "stepNumber": 3,
      "title": "ជំហានទី៣៖ មេរៀនថ្មី (New Lesson Content)",
      "duration": "២០-២៥ នាទី",
      "teacherActivities": "សកម្មភាពគ្រូ (ពន្យល់ បង្ហាញ ណែនាំការងារក្រុម)...",
      "studentActivities": "សកម្មភាពសិស្ស (ស្ដាប់ អាន ពិភាក្សា ឆ្លើយសំណួរ)..."
    },
    {
      "stepNumber": 4,
      "title": "ជំហានទី៤៖ ពង្រឹងចំណេះដឹង (Consolidation/Practice)",
      "duration": "៥ នាទី",
      "teacherActivities": "សកម្មភាពគ្រូ (ដាក់លំហាត់ពង្រឹង)...",
      "studentActivities": "សកម្មភាពសិស្ស (ដោះស្រាយលំហាត់ ឡើងដោះស្រាយលើក្តារខៀន)..."
    },
    {
      "stepNumber": 5,
      "title": "ជំហានទី៥៖ បណ្តាំ និងកិច្ចការផ្ទះ (Homework & Assessment)",
      "duration": "៣ នាទី",
      "teacherActivities": "សកម្មភាពគ្រូ (ផ្ដាំផ្ញើ អប់រំសីលធម៌ ដាក់កិច្ចការផ្ទះ)...",
      "studentActivities": "សកម្មភាពសិស្ស (កត់ត្រាកិច្ចការផ្ទះ និងអរគុណគ្រូ)..."
    }
  ],
  "pedagogicalAdvice": "ការណែនាំគរុកោសល្យបន្ថែមសម្រាប់សិស្សរៀនយឺត និងសិស្សពូកែ..."
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const jsonText = response.text || '{}';
      const result = JSON.parse(jsonText);
      res.json({ success: true, lessonPlan: result });
    } catch (error: any) {
      console.error('Error generating lesson plan:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate lesson plan',
      });
    }
  });

  // API Endpoint: Generate Student Worksheet or Quiz (សន្លឹកកិច្ចការសិស្ស ឬ កម្រងសំណួរ)
  app.post('/api/gemini/generate-worksheet', async (req, res) => {
    try {
      const { grade, subject, lessonTitle, type } = req.body; // type: 'worksheet' | 'quiz'

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY environment variable is missing on the server.',
        });
      }

      const promptText = `
អ្នកជាគ្រូបង្រៀនបឋមសិក្សាដ៏មានបទពិសោធន៍។ សូមរៀបចំ ${type === 'quiz' ? 'កម្រងសំណួរប្រឡង/វាយតម្លៃ' : 'សន្លឹកកិច្ចការសិស្សអនុវត្ត'} សម្រាប់៖
- កម្រិតថ្នាក់៖ ${grade}
- មុខវិជ្ជា៖ ${subject}
- មេរៀន/ជំពូក៖ ${lessonTitle}

សូមផ្ដល់ជា JSON ដូចតទៅ៖
{
  "title": "ចំណងជើងសន្លឹកកិច្ចការ/កម្រងសំណួរ",
  "instructions": "ការណែនាំសម្រាប់សិស្ស...",
  "questions": [
    {
      "id": 1,
      "question": "សំណួរទី១...",
      "type": "multiple_choice / short_answer / fill_blank",
      "options": ["ជម្រើស A", "ជម្រើស B", "ជម្រើស C", "ជម្រើស D"],
      "answerKey": "ចម្លើយត្រឹមត្រូវ និងការបកស្រាយ...",
      "points": 2
    }
  ],
  "totalPoints": 10,
  "timeAllowed": "២០ នាទី"
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const jsonText = response.text || '{}';
      const result = JSON.parse(jsonText);
      res.json({ success: true, data: result });
    } catch (error: any) {
      console.error('Error generating worksheet:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate worksheet',
      });
    }
  });

  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MoEYS Curriculum Planner App running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
