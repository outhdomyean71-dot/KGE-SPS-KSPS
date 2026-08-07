import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { jsonrepair } from 'jsonrepair';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

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
    // Priority order of models: gemini-3.6-flash -> gemini-3.1-flash-lite
    const modelsToTry = ['gemini-3.6-flash', 'gemini-3.1-flash-lite'];
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      // Try up to 2 times per model if rate limited
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

          // Wait 2 seconds before retrying or switching models on 429
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

  // Helper function to normalize and validate 5-Step Lesson Plan structure
  const normalizeFiveStepPlan = (data: any, reqBody: any) => {
    const grade = data?.grade || reqBody?.grade || 'ថ្នាក់ទី១';
    const subject = data?.subject || reqBody?.subject || 'ភាសាខ្មែរ';
    const lessonTitle = data?.lessonTitle || data?.title || reqBody?.lessonTitle || 'មេរៀនទូទៅ';

    let teachingAidsArr: string[] = [];
    if (Array.isArray(data?.teachingAids)) {
      teachingAidsArr = data.teachingAids.map((item: any) => String(item));
    } else if (typeof data?.teachingAids === 'string') {
      teachingAidsArr = data.teachingAids.split(/[,;\n]/).map((s: string) => s.trim()).filter(Boolean);
    }
    if (teachingAidsArr.length === 0) {
      teachingAidsArr = ['សៀវភៅសិក្សាគោល', 'ក្តារខៀន និងដីស/ហ្វើដ', 'ប័ណ្ណរូបភាព/ប័ណ្ណពាក្យ', 'សម្ភារឧបទេសបង្ហាញ'];
    }

    const obj = data?.objectives || {};
    const objectives = {
      knowledge: typeof obj === 'object' && obj?.knowledge ? String(obj.knowledge) : (reqBody?.objectives?.knowledge || 'យល់ដឹងពីខ្លឹមសារមេរៀន និងប្រាប់បានត្រឹមត្រូវ'),
      skills: typeof obj === 'object' && obj?.skills ? String(obj.skills) : (reqBody?.objectives?.skills || 'អាន សរសេរ និងអនុវត្តដោះស្រាយលំហាត់បានត្រឹមត្រូវ'),
      attitudes: typeof obj === 'object' && (obj?.attitudes || obj?.attitude) ? String(obj.attitudes || obj.attitude) : (reqBody?.objectives?.attitudes || reqBody?.objectives?.attitude || 'មានស្មារតីប្រុងប្រយ័ត្ន ចូលរួមសហការ និងស្រឡាញ់ការសិក្សា'),
    };

    const defaultSteps = [
      {
        stepNumber: 1,
        title: 'ជំហានទី១៖ រដ្ឋបាលថ្នាក់ (Class Administration)',
        duration: '៣-៥ នាទី',
        teacherActivities: '• ពិនិត្យវត្តមានសិស្ស និងពិនិត្យសណ្ដាប់ធ្នាប់ អនាម័យក្នុងថ្នាក់រៀន\n• ពង្រឹងការយកចិត្តទុកដាក់ និងបង្កើតបរិយាកាសរីករាយមុនចាប់ផ្ដើមមេរៀន',
        studentActivities: '• ប្រធានថ្នាក់ឡើងរាយការណ៍វត្តមានសិស្សមកគ្រូបង្រៀន\n• សិស្សទាំងអស់រៀបចំសៀវភៅ ប៊ិច និងសម្ភារសិក្សាលើតុ',
      },
      {
        stepNumber: 2,
        title: 'ជំហានទី២៖ រំលឹកមេរៀនចាស់ ឬ ពិនិត្យកិច្ចការផ្ទះ (Review)',
        duration: '៥ នាទី',
        teacherActivities: '• សួរសំណួររំលឹកមេរៀនមុន ឬហៅសិស្សឡើងកែប្រែកិច្ចការផ្ទះលើក្តារខៀន\n• កែតម្រូវ និងផ្តល់ការសរសើរចំពោះសិស្សដែលធ្វើបានល្អ',
        studentActivities: '• លើកដៃឡើងឆ្លើយសំណួររំលឹកមេរៀនចាស់ ឬឡើងធ្វើកិច្ចការផ្ទះលើក្តារខៀន\n• សិស្សផ្សេងទៀតផ្ទៀងផ្ទាត់ និងកត់ត្រាក្នុងសៀវភៅ',
      },
      {
        stepNumber: 3,
        title: `ជំហានទី៣៖ មេរៀនថ្មី «${lessonTitle}» (New Lesson Content)`,
        duration: '២០-២៥ នាទី',
        teacherActivities: `• បង្ហាញសម្ភារឧបទេស/ប័ណ្ណរូបភាព និងចោទសំណួរដាស់ស្មារតីសិស្ស\n• ពន្យល់ខ្លឹមសារគន្លឹះ និងណែនាំសកម្មភាពអនុវត្តសម្រាប់មេរៀន «${lessonTitle}»\n• ដឹកនាំសិស្សធ្វើសកម្មភាពបុគ្គល ឬជាក្រុមតូចៗ`,
        studentActivities: `• សង្កេតរូបភាព/សម្ភារឧបទេស និងស្ដាប់ការពន្យល់របស់គ្រូដោយយកចិត្តទុកដាក់\n• ចូលរួមពិភាក្សាក្នុងក្រុម អាន និពន្ធ ឬដោះស្រាយលំហាត់គំរូ`,
      },
      {
        stepNumber: 4,
        title: 'ជំហានទី៤៖ ពង្រឹងចំណេះដឹង (Consolidation/Practice)',
        duration: '៥ នាទី',
        teacherActivities: `• ដាក់លំហាត់ពង្រឹង ឬសំណួរស្ទង់សមត្ថភាពសិស្សលើមេរៀន «${lessonTitle}»\n• សម្របសម្រួល និងវាយតម្លៃលទ្ធផលការសិក្សារបស់សិស្ស`,
        studentActivities: '• ធ្វើលំហាត់ពង្រឹងសមត្ថភាពដោយខ្លួនឯង ឬឡើងរាយការណ៍ចម្លើយ\n• ចូលរួមស្ដាប់ការបូកសរុប និងកែតម្រូវចំណុចខ្វះខាត',
      },
      {
        stepNumber: 5,
        title: 'ជំហានទី៥៖ បណ្តាំ និងកិច្ចការផ្ទះ (Homework & Assessment)',
        duration: '៣ នាទី',
        teacherActivities: '• ដាក់កិច្ចការផ្ទះសម្រាប់ឱ្យសិស្សស្វ័យសិក្សានៅផ្ទះ\n• អប់រំសីលធម៌ សុខភាព និងផ្ដាំផ្ញើឱ្យសិស្សខិតខំរៀនសូត្រ',
        studentActivities: '• កត់ត្រាកិច្ចការផ្ទះចូលក្នុងសៀវភៅសរសេរ\n• គោរពជម្រាបលា និងអរគុណគ្រូបង្រៀន',
      },
    ];

    let rawSteps = Array.isArray(data?.steps) && data.steps.length > 0 ? data.steps : defaultSteps;
    const steps = rawSteps.map((s: any, idx: number) => ({
      stepNumber: Number(s?.stepNumber || idx + 1),
      title: String(s?.title || defaultSteps[idx]?.title || `ជំហានទី${idx + 1}`),
      duration: String(s?.duration || defaultSteps[idx]?.duration || '៥ នាទី'),
      teacherActivities: String(s?.teacherActivities || defaultSteps[idx]?.teacherActivities || ''),
      studentActivities: String(s?.studentActivities || defaultSteps[idx]?.studentActivities || ''),
    }));

    const encodedPrompt = encodeURIComponent(`Cambodian primary school children learning ${subject} ${lessonTitle}, bright educational illustration`);
    const defaultImgUrl = `https://pollinations.ai/prompt/${encodedPrompt}?width=800&height=450&seed=${Math.floor(Math.random() * 100000)}&nologo=true`;

    return {
      title: data?.title || `កិច្ចតែងការបង្រៀន (៥ជំហាន) — ${lessonTitle}`,
      grade,
      subject,
      duration: data?.duration || '២ ម៉ោង (៨០ នាទី)',
      teachingAids: teachingAidsArr,
      objectives,
      steps,
      pedagogicalAdvice: data?.pedagogicalAdvice || 'ផ្តល់ការលើកទឹកចិត្តដល់សិស្សទាំងអស់ សម្របសម្រួលសកម្មភាពក្រុម និងជួយជ្រោមជ្រែងសិស្សដែលរៀនយឺត។',
      activityImageUrl: data?.activityImageUrl || defaultImgUrl,
    };
  };

  // API Endpoint: Generate MoEYS Standard 5-Step Lesson Plan (កិច្ចតែងការបង្រៀន ៥ជំហាន)
  app.post('/api/gemini/generate-lesson-plan', async (req, res) => {
    try {
      const { grade, subject, lessonTitle, month, objectives, promptText, teachingStyle } = req.body;

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

      let rawResult: any = {};
      try {
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
        rawResult = parseAIJsonResponse(jsonText);
      } catch (geminiErr: any) {
        console.warn('Gemini API call warning in generate-lesson-plan, using structured template fallback:', geminiErr?.message || geminiErr);
      }

      const result = normalizeFiveStepPlan(rawResult, req.body);

      // Generate visual activity illustration image for the lesson plan
      try {
        const imagePrompt = `A high quality, bright educational illustration of young Cambodian primary school students (${grade || 'Grade 1'}) actively participating in a ${subject || 'General'} classroom lesson about "${lessonTitle || 'Interactive Learning'}". Asian children sitting at school desks, friendly teacher explaining at whiteboard, warm cheerful classroom atmosphere, clean colorful vector digital art style, high resolution.`;
        
        try {
          const imgResponse = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: imagePrompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
            },
          });
          const bytes = imgResponse.generatedImages?.[0]?.image?.imageBytes;
          if (bytes) {
            result.activityImageUrl = `data:image/jpeg;base64,${bytes}`;
          }
        } catch (e) {
          // Keep default pollinations URL from normalizeFiveStepPlan
        }
      } catch (imgErr) {
        console.warn('Could not attach image to lesson plan:', imgErr);
      }

      res.json({ success: true, lessonPlan: result });
    } catch (error: any) {
      console.error('Error generating lesson plan:', error);
      // Even on severe error, return normalized fallback lesson plan so UI works smoothly
      const fallbackPlan = normalizeFiveStepPlan(null, req.body);
      res.json({
        success: true,
        lessonPlan: fallbackPlan,
      });
    }
  });

  // API Endpoint: Generate Student Worksheet or Quiz (សន្លឹកកិច្ចការសិស្ស ឬ កម្រងសំណួរ)
  app.post('/api/gemini/generate-worksheet', async (req, res) => {
    try {
      const { grade, subject, lessonTitle, type, teachingStyle, promptText: customPrompt } = req.body; // type: 'worksheet' | 'quiz'

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          success: false,
          error: 'GEMINI_API_KEY environment variable is missing on the server.',
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
- កម្រិតថ្នាក់៖ ${grade}
- មុខវិជ្ជា៖ ${subject}
- មេរៀន/ជំពូក៖ ${lessonTitle}
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
  });

  // API Endpoint: Generate Classroom Activity Illustration Image
  app.post('/api/gemini/generate-activity-image', async (req, res) => {
    try {
      const { lessonTitle, subject, grade, customPrompt } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          success: false,
          error: 'GEMINI_API_KEY environment variable is missing on the server.',
        });
      }

      const prompt = customPrompt || 
        `A high quality, bright educational illustration of young Cambodian primary school students (${grade || 'Grade 1'}) actively participating in a ${subject || 'General'} classroom lesson about "${lessonTitle || 'Interactive Learning'}". Asian children sitting at school desks, friendly Cambodian teacher explaining at the whiteboard, warm cheerful classroom atmosphere, clean colorful vector digital art style, high resolution.`;

      try {
        const response = await ai.models.generateImages({
          model: 'imagen-3.0-generate-002',
          prompt: prompt,
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '16:9',
          },
        });

        const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
        if (imageBytes) {
          const imageUrl = `data:image/jpeg;base64,${imageBytes}`;
          return res.json({ success: true, imageUrl, prompt });
        }
      } catch (imagenErr: any) {
        console.warn('Imagen generateImages error, falling back to pollinations AI image stream:', imagenErr?.message || imagenErr);
      }

      // Fallback AI image generator stream if Imagen rate-limited or unavailable
      const fallbackPrompt = encodeURIComponent(`Cambodian primary school children in classroom learning ${subject || 'general'} ${lessonTitle || 'lesson'}, vibrant educational vector illustration, high quality`);
      const fallbackUrl = `https://pollinations.ai/prompt/${fallbackPrompt}?width=800&height=450&seed=${Math.floor(Math.random() * 100000)}&nologo=true`;

      res.json({ success: true, imageUrl: fallbackUrl, prompt });
    } catch (error: any) {
      console.error('Error generating activity image:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'មិនអាចបង្កើតរូបភាពសកម្មភាពបានទេ',
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
