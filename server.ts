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

  // Helper function to build detailed prompts for Cambodian educational image generation
  const buildEducationalImagePrompt = (
    grade?: string,
    subject?: string,
    lessonTitle?: string,
    activitiesText?: string,
    questionsText?: string,
    customPrompt?: string
  ) => {
    let subjectEn = 'General Primary Education';
    const subLower = (subject || '').toLowerCase();
    if (subLower.includes('គណិត') || subLower.includes('math')) {
      subjectEn = 'Mathematics, learning numbers, counting blocks, geometry shapes and arithmetic equations on whiteboard';
    } else if (subLower.includes('ភាសាខ្មែរ') || subLower.includes('ខ្មែរ') || subLower.includes('khmer')) {
      subjectEn = 'Khmer Language, learning alphabet cards, reading Khmer storybooks, handwriting exercises and literature';
    } else if (subLower.includes('វិទ្យាសាស្ត្រ') || subLower.includes('science')) {
      subjectEn = 'Science, nature exploration, magnifying glass, plants, animals, simple physics and chemistry experiments';
    } else if (subLower.includes('សិក្សាសង្គម') || subLower.includes('social')) {
      subjectEn = 'Social Studies, map of Cambodia, community culture, history, geography and civic traditions';
    } else if (subLower.includes('អង់គ្លេស') || subLower.includes('english')) {
      subjectEn = 'English Language, ABC flashcards, vocabulary charts and conversational dialogue';
    } else if (subLower.includes('សិល្បៈ') || subLower.includes('art')) {
      subjectEn = 'Art and Crafts, drawing, color painting and creative paper crafts';
    } else if (subLower.includes('កាយវិទ្យា') || subLower.includes('sport') || subLower.includes('កីឡា')) {
      subjectEn = 'Physical Education, sports games, fitness exercises and outdoor playground games';
    }

    let gradeEn = 'Primary School';
    if (grade) {
      if (grade.includes('១') || grade.includes('1')) gradeEn = 'Grade 1 (age 6-7)';
      else if (grade.includes('២') || grade.includes('2')) gradeEn = 'Grade 2 (age 7-8)';
      else if (grade.includes('៣') || grade.includes('3')) gradeEn = 'Grade 3 (age 8-9)';
      else if (grade.includes('៤') || grade.includes('4')) gradeEn = 'Grade 4 (age 9-10)';
      else if (grade.includes('៥') || grade.includes('5')) gradeEn = 'Grade 5 (age 10-11)';
      else if (grade.includes('៦') || grade.includes('6')) gradeEn = 'Grade 6 (age 11-12)';
    }

    let details = '';
    if (activitiesText && activitiesText.trim()) {
      details += ` Classroom activity depicted: ${activitiesText.trim().slice(0, 300)}.`;
    }
    if (questionsText && questionsText.trim()) {
      details += ` Lesson questions and topics covered: ${questionsText.trim().slice(0, 200)}.`;
    }

    if (customPrompt && customPrompt.trim()) {
      return `${customPrompt.trim()}. Cambodian primary school classroom, grade ${gradeEn}, subject ${subjectEn}, lesson "${lessonTitle || ''}". Bright high quality educational artwork.`;
    }

    return `A high quality, vibrant and cheerful educational illustration of young Cambodian primary school students (${gradeEn}) actively learning in a Cambodian classroom. Lesson topic: "${lessonTitle || 'Interactive Lesson'}" in subject ${subjectEn}.${details} Asian boys and girls wearing neat Cambodian school uniforms sitting at wooden desks with open textbooks and pens, friendly Cambodian teacher explaining at the whiteboard, warm cheerful lighting, colorful educational posters on the classroom wall, high resolution digital artwork, clean vector storybook style.`;
  };

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
        const step3Activity = result.steps?.find((s: any) => s.stepNumber === 3)?.teacherActivities || '';
        const imagePrompt = buildEducationalImagePrompt(
          grade,
          subject,
          lessonTitle,
          step3Activity || result.objectives?.knowledge,
          '',
          promptText
        );
        
        let attached = false;
        if (process.env.GEMINI_API_KEY) {
          for (const modelName of ['imagen-3.0-fast-generate-001', 'imagen-3.0-generate-002']) {
            try {
              const imgResponse = await ai.models.generateImages({
                model: modelName,
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
                attached = true;
                break;
              }
            } catch (e) {
              // try next or fallback
            }
          }
        }
        if (!attached) {
          const encoded = encodeURIComponent(imagePrompt.slice(0, 1000));
          result.activityImageUrl = `https://pollinations.ai/prompt/${encoded}?width=800&height=450&seed=${Math.floor(Math.random() * 100000)}&nologo=true`;
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

      let rawResult: any = {};
      try {
        const response = await callGeminiWithFallback({
          contents: promptText,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.7,
            maxOutputTokens: 8192,
          },
        });

        const jsonText = response.text || '{}';
        rawResult = parseAIJsonResponse(jsonText);
      } catch (geminiErr: any) {
        console.warn('Gemini API call warning in generate-worksheet, using structured fallback:', geminiErr?.message || geminiErr);
      }

      // Fallback normalize for worksheet
      const worksheetResult = {
        title: rawResult?.title || (type === 'quiz' ? `កម្រងសំណួរវាយតម្លៃ — ${lessonTitle || 'មេរៀន'}` : `សន្លឹកកិច្ចការសិស្សអនុវត្ត — ${lessonTitle || 'មេរៀន'}`),
        instructions: rawResult?.instructions || 'សូមអានសំណួរនីមួយៗឱ្យបានច្បាស់លាស់ និងឆ្លើយចម្លើយដែលត្រឹមត្រូវបំផុតចូលក្នុងសន្លឹកកិច្ចការ។',
        questions: Array.isArray(rawResult?.questions) && rawResult.questions.length > 0 ? rawResult.questions : [
          {
            id: 1,
            question: `តើខ្លឹមសារសំខាន់នៃមេរៀន «${lessonTitle || 'មេរៀន'}» និយាយអំពីអ្វី?`,
            type: 'short_answer',
            options: [],
            answerKey: 'សិស្សឆ្លើយតាមខ្លឹមសារមេរៀនដែលបានរៀនក្នុងថ្នាក់',
            points: 2,
          },
          {
            id: 2,
            question: 'សូមជ្រើសរើសចម្លើយដែលត្រឹមត្រូវបំផុតខាងក្រោម៖',
            type: 'multiple_choice',
            options: ['ចម្លើយ ក', 'ចម្លើយ ខ (ត្រឹមត្រូវ)', 'ចម្លើយ គ', 'ចម្លើយ ឃ'],
            answerKey: 'ចម្លើយ ខ (ត្រឹមត្រូវ)',
            points: 2,
          },
          {
            id: 3,
            question: 'សូមបំពេញចន្លោះក្នុងល្បះខាងក្រោមឱ្យបានត្រឹមត្រូវតាមមេរៀន៖',
            type: 'fill_blank',
            options: [],
            answerKey: 'បំពេញពាក្យគន្លឹះនៃមេរៀន',
            points: 2,
          },
          {
            id: 4,
            question: 'តើការអនុវត្តមេរៀននេះផ្តល់ប្រយោជន៍អ្វីខ្លះដល់ជីវភាពរស់នៅប្រចាំថ្ងៃ?',
            type: 'short_answer',
            options: [],
            answerKey: 'ជួយបង្កើនចំណេះដឹង និងបំណិនអនុវត្តផ្ទាល់',
            points: 4,
          }
        ],
        totalPoints: rawResult?.totalPoints || 10,
        timeAllowed: rawResult?.timeAllowed || '២០ នាទី',
      };

      res.json({ success: true, data: worksheetResult });
    } catch (error: any) {
      console.error('Error generating worksheet:', error);
      res.json({
        success: true,
        data: {
          title: `សន្លឹកកិច្ចការសិស្សអនុវត្ត — ${req.body?.lessonTitle || 'មេរៀន'}`,
          instructions: 'សូមអានសំណួរ និងឆ្លើយចម្លើយឱ្យបានត្រឹមត្រូវ។',
          questions: [
            {
              id: 1,
              question: `តើខ្លឹមសារសំខាន់នៃមេរៀន «${req.body?.lessonTitle || 'មេរៀន'}» និយាយអំពីអ្វី?`,
              type: 'short_answer',
              options: [],
              answerKey: 'ឆ្លើយតាមខ្លឹមសារមេរៀន',
              points: 5,
            },
            {
              id: 2,
              question: 'តើសិស្សទទួលបានបំណិនអ្វីខ្លះបន្ទាប់ពីរៀនមេរៀននេះចប់?',
              type: 'short_answer',
              options: [],
              answerKey: 'បំណិនអនុវត្ត និងការដោះស្រាយលំហាត់',
              points: 5,
            }
          ],
          totalPoints: 10,
          timeAllowed: '២០ នាទី',
        }
      });
    }
  });

  // API Endpoint: Generate Classroom Activity Illustration Image
  app.post('/api/gemini/generate-activity-image', async (req, res) => {
    try {
      const { lessonTitle, subject, grade, customPrompt, activitiesText, questionsText } = req.body;

      const prompt = buildEducationalImagePrompt(
        grade,
        subject,
        lessonTitle,
        activitiesText,
        questionsText,
        customPrompt
      );

      if (process.env.GEMINI_API_KEY) {
        // Try Imagen models safely if enabled
        for (const modelName of ['imagen-3.0-fast-generate-001', 'imagen-3.0-generate-002']) {
          try {
            const response = await ai.models.generateImages({
              model: modelName,
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
            // Silently fallback if model not found on API key
          }
        }
      }

      // Dynamic AI image stream with full prompt details
      const encodedPrompt = encodeURIComponent(prompt.slice(0, 1000));
      const fallbackUrl = `https://pollinations.ai/prompt/${encodedPrompt}?width=800&height=450&seed=${Math.floor(Math.random() * 100000)}&nologo=true`;

      res.json({ success: true, imageUrl: fallbackUrl, prompt });
    } catch (error: any) {
      console.error('Error generating activity image:', error);
      const encodedPrompt = encodeURIComponent(`Cambodian primary school children in classroom learning ${req.body?.subject || ''} ${req.body?.lessonTitle || ''}, high quality educational illustration`);
      const fallbackUrl = `https://pollinations.ai/prompt/${encodedPrompt}?width=800&height=450&seed=${Math.floor(Math.random() * 100000)}&nologo=true`;
      res.json({
        success: true,
        imageUrl: fallbackUrl,
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
