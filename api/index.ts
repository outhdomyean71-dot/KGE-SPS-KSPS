import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { jsonrepair } from 'jsonrepair';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
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

// Helper function to execute Gemini requests with model fallback and automatic retry backoff
const callGeminiWithFallback = async (params: { contents: any; config?: any }) => {
  const modelsToTry = ['gemini-3.6-flash', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: params.contents,
          config: params.config,
        });
        return response;
      } catch (err: any) {
        console.warn(`Gemini attempt ${attempt + 1} error with model "${modelName}":`, err?.message || err);
        lastError = err;
        const errStr = String(err?.message || err || '');
        const isRateLimit = err?.status === 429 || errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('quota');
        
        if (!isRateLimit) {
          throw err;
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }

  throw lastError;
};

// Helper to safely clean and parse JSON from AI response
const parseAIJsonResponse = (rawText: string) => {
  if (!rawText) return {};
  const cleaned = rawText
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch (err1) {
    try {
      const repaired = jsonrepair(cleaned);
      return JSON.parse(repaired);
    } catch (err2) {
      console.error('Failed to parse AI JSON response:', err2, 'Raw:', rawText);
      throw err1;
    }
  }
};

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Core Lesson Plan Generator Handler
const generateLessonPlanHandler = async (req: express.Request, res: express.Response) => {
  try {
    const { grade, subject, lessonTitle, month, objectives, promptText, teachingStyle } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'GEMINI_API_KEY មិនទាន់បានកំណត់នៅលើ Vercel Environment Variables ឡើយ។ សូមកំណត់ GEMINI_API_KEY ក្នុង Vercel Settings -> Environment Variables។',
      });
    }

    const styleDescriptions: Record<string, string> = {
      interactive: 'វិធីសាស្ត្របង្រៀនតាមបែបសកម្ម និងអន្តរកម្ម (Interactive & Student-Centered Learning) ដោយផ្តោតលើការសួរសំណួរដាស់ស្មារតី សកម្មភាពអនុវត្តផ្ទាល់ និងការចូលរួមពីសិស្សគ្រប់គ្នា',
      group: 'វិធីសាស្ត្របង្រៀនតាមបែបការងារក្រុម (Group Activity & Peer Collaboration) ដោយបែងចែកសិស្សជាក្រុមតូចៗ ពិភាក្សា ដោះស្រាយលំហាត់រួមគ្នា និងឡើងរាយការណ៍',
      lecture: 'វិធីសាស្ត្របង្រៀនតាមបែបពន្យល់ និងបង្ហាញផ្ទាល់ (Lecture & Direct Demonstration) ដោយគ្រូពន្យល់យ៉ាងច្បាស់លាស់ បង្ហាញឧទាហរណ៍លើក្តារខៀន និងណែនាំដំណាក់កាលនីមួយៗ',
      inquiry: 'វិធីសាស្ត្របង្រៀនតាមបែបស៊ើបសួរ (Inquiry-Based & Problem-Solving) ដោយចោទជាបញ្ហាឱ្យសិស្សឆ្ងល់ ស្វែងរកចម្លើយ ពិសោធន៍ ឬវិភាគរកហេតុផលដោយខ្លួនឯង',
      gamified: 'វិធីសាស្ត្របង្រៀនតាមបែបល្បែងសិក្សា (Gamified & Play-Based Learning) ដោយបញ្ចូលល្បែងអប់រំ ការប្រកួតប្រជែងជាក្រុម ឬការសម្ដែងតួរំលឹកចំណេះដឹង',
    };

    const selectedStyleText = styleDescriptions[teachingStyle] || teachingStyle || styleDescriptions['interactive'];

    const systemInstruction = `អ្នកគឺជាអ្នកជំនាញគរុកោសល្យ និងជាគ្រូឧទ្ទេសបង្រៀនកម្រិតបឋមសិក្សាដ៏ឆ្នើម នៃក្រសួងអប់រំ យុវជន និងកីឡា នៃព្រះរាជាណាចក្រកម្ពុជា (MoEYS Official Primary Curriculum Expert)។ 
សូមរៀបចំកិច្ចតែងការបង្រៀនគំរូ ៥ជំហាន (MoEYS Standard 5-Step Lesson Plan) ជាភាសាខ្មែរផ្លូវការ ត្រឹមត្រូវតាមបច្ចេកទេសគរុកោសល្យបឋមសិក្សា និងស្របតាមក្របខ័ណ្ឌកម្មវិធីសិក្សាជាតិ។`;

    const userPrompt = `
សូមបង្កើតកិច្ចតែងការបង្រៀនគំរូ ៥ជំហាន ឱ្យបានលម្អិត និងច្បាស់លាស់បំផុត សម្រាប់៖
- កម្រិតថ្នាក់៖ ${grade || 'ថ្នាក់ទី១'}
- មុខវិជ្ជា៖ ${subject || 'ភាសាខ្មែរ'}
- មេរៀន/ជំពូក៖ ${lessonTitle || 'មេរៀនទូទៅ'}
- ខែសិក្សា៖ ${month || 'ខែទី១'}
- រចនាប័ទ្ម/វិធីសាស្ត្របង្រៀន (Teaching Style Requirement)៖ ${selectedStyleText}
- វត្ថុបំណងដើម៖
  + ចំណេះដឹង៖ ${objectives?.knowledge || 'យល់ដឹងពីខ្លឹមសារមេរៀន'}
  + បំណិន៖ ${objectives?.skills || 'អនុវត្ត និងដោះស្រាយលំហាត់បានត្រឹមត្រូវ'}
  + ឥរិយាបថ៖ ${objectives?.attitudes || 'មានស្មារតីប្រុងប្រយ័ត្ន និងស្រឡាញ់ការសិក្សា'}
${promptText ? `- សំណូមពរបន្ថែមពីគ្រូបង្រៀន៖ ${promptText}` : ''}

សូមរៀបចំសកម្មភាពគ្រូ និងសកម្មភាពសិស្សក្នុងជំហានទាំង ៥ ឱ្យឆ្លុះបញ្ចាំងយ៉ាងច្បាស់ពី «${selectedStyleText}» និងប្រើប្រាស់ពាក្យពេចន៍គរុកោសល្យខ្មែរផ្លូវការ។

សូមផ្ដល់លទ្ធផលជាទម្រង់ JSON ដូចខាងក្រោម៖
{
  "title": "ចំណងជើងមេរៀន/កិច្ចតែងការ",
  "grade": "${grade || 'ថ្នាក់ទី១'}",
  "subject": "${subject || 'ភាសាខ្មែរ'}",
  "duration": "រយៈពេល (ឧទាហរណ៍៖ ៤០នាទី)",
  "teachingAids": ["សម្ភារឧបទេសទី១", "សម្ភារឧបទេសទី២", "ប័ណ្ណរូបភាព/ប័ណ្ណពាក្យ", "សៀវភៅសិក្សោគោល"],
  "objectives": {
    "knowledge": "ចំណេះដឹង៖ សិស្សប្រាប់/ពន្យល់/កំណត់បានត្រឹមត្រូវ...",
    "skills": "បំណិន៖ សិស្សអាន/សរសេរ/គណនា/អនុវត្តបានត្រឹមត្រូវ...",
    "attitudes": "ឥរិយាបថ៖ សិស្សមានស្មារតីប្រុងប្រយ័ត្ន ចូលរួមសហការ និងស្រឡាញ់ការសិក្សា..."
  },
  "steps": [
    {
      "stepNumber": 1,
      "title": "ជំហានទី១៖ រដ្ឋបាលថ្នាក់ (Class Administration)",
      "duration": "៣-៥ នាទី",
      "teacherActivities": "សកម្មភាពគ្រូ (ពិនិត្យវត្តមាន សណ្ដាប់ធ្នាប់ អនាម័យ និងពង្រឹងការយកចិត្តទុកដាក់)...",
      "studentActivities": "សកម្មភាពសិស្ស (ប្រធានថ្នាក់ឡើងរាយការណ៍វត្តមាន និងសិស្សទាំងអស់រៀបចំសម្ភារសិក្សា)..."
    },
    {
      "stepNumber": 2,
      "title": "ជំហានទី២៖ រំលឹកមេរៀនចាស់ ឬ ពិនិត្យកិច្ចការផ្ទះ (Review)",
      "duration": "៥ នាទី",
      "teacherActivities": "សកម្មភាពគ្រូ (សួរសំណួររំលឹក ឬឱ្យសិស្សឡើងកែប្រែកិច្ចការផ្ទះលើក្តារខៀន)...",
      "studentActivities": "សកម្មភាពសិស្ស (លើកដៃឆ្លើយសំណួរ ឬឡើងកែប្រែកិច្ចការផ្ទះ)..."
    },
    {
      "stepNumber": 3,
      "title": "ជំហានទី៣៖ មេរៀនថ្មី (New Lesson Content)",
      "duration": "២០-២៥ នាទី",
      "teacherActivities": "សកម្មភាពគ្រូ (បង្ហាញសម្ភារឧបទេស ពន្យល់ខ្លឹមសារ ណែនាំសកម្មភាព និងដឹកនាំការអនុវត្ត)...",
      "studentActivities": "សកម្មភាពសិស្ស (សង្កេត ស្ដាប់ ពិភាក្សាក្នុងក្រុម អាន ឬធ្វើលំហាត់គំរូ)..."
    },
    {
      "stepNumber": 4,
      "title": "ជំហានទី៤៖ ពង្រឹងចំណេះដឹង (Consolidation/Practice)",
      "duration": "៥ នាទី",
      "teacherActivities": "សកម្មភាពគ្រូ (ដាក់លំហាត់ពង្រឹង ឬសំណួរស្ទង់សមត្ថភាពសិស្ស)...",
      "studentActivities": "សកម្មភាពសិស្ស (ធ្វើលំហាត់បុគ្គល ឬក្នុងក្រុម និងឡើងរាយការណ៍ចម្លើយ)..."
    },
    {
      "stepNumber": 5,
      "title": "ជំហានទី៥៖ បណ្តាំ និងកិច្ចការផ្ទះ (Homework & Assessment)",
      "duration": "៣ នាទី",
      "teacherActivities": "សកម្មភាពគ្រូ (ផ្ដាំផ្ញើ អប់រំសីលធម៌/សុខភាព ដាក់កិច្ចការផ្ទះ និងណែនាំការស្វ័យសិក្សា)...",
      "studentActivities": "សកម្មភាពសិស្ស (កត់ត្រាកិច្ចការផ្ទះ និងអរគុណគ្រូបង្រៀន)..."
    }
  ],
  "pedagogicalAdvice": "ការណែនាំគរុកោសល្យបន្ថែមសម្រាប់ការជួយគាំទ្រសិស្សរៀនយឺត និងការលើកទឹកចិត្តសិស្សពូកែ..."
}
`;

    const response = await callGeminiWithFallback({
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    });

    const jsonText = response.text || '{}';
    const result = parseAIJsonResponse(jsonText);
    res.json({ success: true, lessonPlan: result });
  } catch (error: any) {
    console.error('Error generating lesson plan:', error);
    const errStr = String(error?.message || error || '');
    const isRateLimit = error?.status === 429 || errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('quota');

    if (isRateLimit) {
      return res.status(429).json({
        success: false,
        error: 'ចំនួនទាមទារប្រើប្រាស់ Gemini AI ឥតគិតថ្លៃប្រចាំនាទីបានឈានដល់កម្រិតកំណត់ (Quota / Rate Limit Exceeded)។ សូមរង់ចាំប្រមាណ ៣០-៦០ វិនាទី រួចចុច «បង្កើតកិច្ចតែងការឡើងវិញ»។',
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'មិនអាចបង្កើតកិច្ចតែងការបង្រៀនបានទេ សូមព្យាយាមម្ដងទៀត',
    });
  }
};

// Core Worksheet Generator Handler
const generateWorksheetHandler = async (req: express.Request, res: express.Response) => {
  try {
    const { grade, subject, lessonTitle, type, teachingStyle, promptText: customPrompt } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'GEMINI_API_KEY មិនទាន់បានកំណត់នៅលើ Vercel Environment Variables ឡើយ។',
      });
    }

    const styleDescriptions: Record<string, string> = {
      interactive: 'វិធីសាស្ត្របង្រៀនតាមបែបសកម្ម និងអន្តរកម្ម (Interactive & Student-Centered Learning)',
      group: 'វិធីសាស្ត្របង្រៀនតាមបែបការងារក្រុម (Group Activity & Peer Collaboration)',
      lecture: 'វិធីសាស្ត្របង្រៀនតាមបែបពន្យល់ និងបង្ហាញផ្ទាល់ (Lecture & Direct Demonstration)',
      inquiry: 'វិធីសាស្ត្របង្រៀនតាមបែបស៊ើបសួរ (Inquiry-Based & Problem-Solving)',
      gamified: 'វិធីសាស្ត្របង្រៀនតាមបែបល្បែងសិក្សា (Gamified & Play-Based Learning)',
    };

    const selectedStyleText = styleDescriptions[teachingStyle] || teachingStyle || '';

    const promptText = `
អ្នកជាគ្រូបង្រៀនបឋមសិក្សាដ៏មានបទពិសោធន៍។ សូមរៀបចំ ${type === 'quiz' ? 'កម្រងសំណួរប្រឡង/វាយតម្លៃ' : 'សន្លឹកកិច្ចការសិស្សអនុវត្ត'} សម្រាប់៖
- កម្រិតថ្នាក់៖ ${grade || 'ថ្នាក់ទី១'}
- មុខវិជ្ជា៖ ${subject || 'ភាសាខ្មែរ'}
- មេរៀន/ជំពូក៖ ${lessonTitle || 'មេរៀនទូទៅ'}
${selectedStyleText ? `- រចនាប័ទ្ម/វិធីសាស្ត្របង្រៀន៖ ${selectedStyleText}` : ''}
${customPrompt ? `- សំណូមពរបន្ថែមពីគ្រូបង្រៀន៖ ${customPrompt}` : ''}

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

    const response = await callGeminiWithFallback({
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    });

    const jsonText = response.text || '{}';
    const result = parseAIJsonResponse(jsonText);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error generating worksheet:', error);
    const errStr = String(error?.message || error || '');
    const isRateLimit = error?.status === 429 || errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('quota');

    if (isRateLimit) {
      return res.status(429).json({
        success: false,
        error: 'ចំនួនទាមទារប្រើប្រាស់ Gemini AI ឥតគិតថ្លៃប្រចាំនាទីបានឈានដល់កម្រិតកំណត់ (Quota / Rate Limit Exceeded)។ សូមរង់ចាំប្រមាណ ៣០-៦០ វិនាទី រួចចុច «បង្កើតឡើងវិញ»។',
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'មិនអាចបង្កើតសន្លឹកកិច្ចការបានទេ សូមព្យាយាមម្ដងទៀត',
    });
  }
};

// Register routes for both Vercel & local server paths
app.post('/api/gemini/generate-lesson-plan', generateLessonPlanHandler);
app.post('/api/generate-lesson', generateLessonPlanHandler);

app.post('/api/gemini/generate-worksheet', generateWorksheetHandler);
app.post('/api/generate-worksheet', generateWorksheetHandler);

export default app;
