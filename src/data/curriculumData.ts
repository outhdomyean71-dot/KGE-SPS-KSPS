import { LessonPlan, GradeLevel, SubjectType } from '../types';

export const INITIAL_CURRICULUM: LessonPlan[] = [
  // ==========================================
  // ថ្នាក់ទី១ (GRADE 1)
  // ==========================================
  // ឆមាសទី១ (Semester 1: Months 1-5)
  {
    id: 'g1-m1-kh',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ផ្នែកទី១៖ ព្យញ្ជនៈ និងស្រៈនិស្ស័យ',
    lessonTitle: 'មេរៀនទី១ ដល់ ទី៤៖ ព្យញ្ជនៈ ក ខ គ ឃ និងស្រៈនិស្ស័យ (អា អិ អី)',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សប្រាប់បានច្បាស់ពីឈ្មោះ រូបរាងព្យញ្ជនៈ ក ខ គ ឃ និងស្រៈនិស្ស័យ អា អិ អី បានត្រឹមត្រូវ។',
      skills: 'សិស្សអាចអាន ផ្សំផ្គុំ និងសរសេរព្យញ្ជនៈជាមួយស្រៈបានត្រឹមត្រូវតាមទិសដៅចលនាដៃ។',
      attitude: 'សិស្សមានជំនឿចិត្តក្នុងការអាន និងមានទម្លាប់ថែរក្សាសៀវភៅអានឱ្យបានស្អាតបាត។'
    },
    teachingActivities: [
      'បង្ហាញប័ណ្ណអក្សររូបភាព និងចម្រៀងព្យញ្ជនៈ',
      'អាននាំមុខដោយគ្រូ អានរួមគ្នា និងអានជាបុគ្គល',
      'សរសេរលើខ្យល់ លើក្តារឆ្នួន និងលើសៀវភៅសរសេរ'
    ],
    teachingAids: ['ប័ណ្ណព្យញ្ជនៈ', 'ប័ណ្ណរូបភាព', 'ក្តារឆ្នួន', 'សៀវភៅសិក្សោគោល'],
    assessmentMethods: ['ការសង្កេតការសរសេរ', 'ការសួរសំណួរអានអក្សរ', 'លំហាត់ភ្ជាប់ពាក្យនឹងរូបភាព']
  },
  {
    id: 'g1-m1-ma',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'គណិតវិទ្យា',
    chapterTitle: 'ជំពូកទី១៖ ចំនួន ០ ដល់ ១០',
    lessonTitle: 'មេរៀនទី១៖ ការរាប់ និងសរសេរចំនួន ០ ដល់ ៥',
    hoursAllocated: 20,
    objectives: {
      knowledge: 'សិស្សប្រាប់បានពីបរិមាណ និងតម្លៃលេខ ០ ដល់ ៥ តាមរយៈវត្ថុជាក់ស្តែង។',
      skills: 'សិស្សរាប់ ផ្គូផ្គង និងសរសេរលេខ ០, ១, ២, ៣, ៤, ៥ បានត្រឹមត្រូវ។',
      attitude: 'សិស្សមានភាពសកម្មក្នុងការចូលរួមលេងល្បែងគណិតវិទ្យាក្នុងថ្នាក់។'
    },
    teachingActivities: [
      'ប្រើប្រាស់ចង្កឹះ គ្រាប់ឃ្លី ឬដុំឈើ ដើម្បីរាប់បរិមាណ',
      'បង្ហាញប័ណ្ណលេខ និងរៀបវត្ថុឱ្យត្រូវនឹងចំនួនលេខ',
      'ល្បែងរាប់ចំនួន និងការសរសេរលេខលើក្តារឆ្នួន'
    ],
    teachingAids: ['ចង្កឹះរាប់', 'គ្រាប់រាប់', 'ប័ណ្ណលេខ', 'រូបភាពសត្វ/ផ្លែឈើ'],
    assessmentMethods: ['ការរាប់បង្ហាញផ្ទាល់', 'កិច្ចការផ្ទះសរសេរលេខ', 'ការសង្កេតការធ្វើសកម្មភាព']
  },
  {
    id: 'g1-m1-sc',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម',
    chapterTitle: 'ជំពូកទី១៖ រាងកាយរបស់យើង',
    lessonTitle: 'មេរៀនទី១៖ ផ្នែកផ្សេងៗនៃរាងកាយ និងវិញ្ញាណទាំង៥',
    hoursAllocated: 12,
    objectives: {
      knowledge: 'សិស្សរៀបរាប់បានពីឈ្មោះផ្នែកខាងក្រៅនៃរាងកាយ និងមុខងារវិញ្ញាណទាំង៥ (ភ្នែក ច្រមុះ ត្រចៀក អណ្តាត ស្បែក)។',
      skills: 'សិស្សចង្អុលបង្ហាញ និងប្រាប់ពីវិធីថែរក្សាអនាម័យរាងកាយបានត្រឹមត្រូវ។',
      attitude: 'សិស្សចូលចិត្តធ្វើអនាម័យខ្លួនប្រាណជាប្រចាំ និងស្រឡាញ់សុខភាព។'
    },
    teachingActivities: [
      'ចម្រៀង «ភ្នែកពីរ ត្រចៀកពីរ ច្រមុះមួយ...»',
      'ការសង្កេតខ្លួនឯង និងមិត្តភក្តិ',
      'ពិភាក្សាពីការលាងដៃ និងការដុសធ្មេញ'
    ],
    teachingAids: ['រូបភាពរាងកាយមនុស្ស', 'កញ្ចក់', 'ច្រាសដុសធ្មេញ/សាប៊ូ'],
    assessmentMethods: ['ការចង្អុលបង្ហាញផ្នែករាងកាយ', 'ការឆ្លើយសំណួរមាត់ទទេ។']
  },
  {
    id: 'g1-m1-mo',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'សីលធម៌ និងពលរដ្ឋវិជ្ជា',
    chapterTitle: 'ជំពូកទី១៖ សីលធម៌ក្នុងសាលារៀន',
    lessonTitle: 'មេរៀនទី១៖ ការគោរពទង់ជាតិ ការសំពះជម្រាបសួរ និងបទបញ្ជាផ្ទៃក្នុង',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីរបៀបសំពះជម្រាបសួរ ការគោរពទង់ជាតិ និងច្បាប់ក្នុងថ្នាក់រៀន។',
      skills: 'សិស្សអនុវត្តការសំពះបានត្រឹមត្រូវតាមវ័យ និងស្តាប់បង្គាប់គ្រូ។',
      attitude: 'សិស្សមានសុជីវធម៌ល្អ ស្លូតបូត និងបង្ហាញការគោរពចាស់ទុំ។'
    },
    teachingActivities: [
      'សម្តែងតួ៖ ការសំពះជម្រាបសួរគ្រូ និងឪពុកម្តាយ',
      'ការហាត់ឈរត្រង់ពេលគោរពទង់ជាតិ'
    ],
    teachingAids: ['រូបភាពទង់ជាតិ', 'វីដេអូ/រូបភាពគំរូនៃការសំពះ'],
    assessmentMethods: ['ការសង្កេតអាកប្បកិរិយាជាក់ស្តែង', 'ការសម្តែងតួ']
  },
  {
    id: 'g1-m1-en',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'ភាសាអង់គ្លេស',
    chapterTitle: 'Unit 1: Greetings & Alphabet A-D',
    lessonTitle: 'Lesson 1: Hello, Goodbye & Letters A, B, C, D',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'Students recognize basic English greetings (Hello, Hi, Bye) and letters A-D.',
      skills: 'Students can pronounce /æ/, /b/, /k/, /d/ sounds and trace upper/lowercase letters.',
      attitude: 'Students enjoy singing the English ABC song and interacting in class.'
    },
    teachingActivities: [
      'Singing Hello Song & ABC Song',
      'Flashcard matching games for Apple, Ball, Cat, Dog',
      'Air writing and letter tracing worksheets'
    ],
    teachingAids: ['Alphabet Flashcards', 'Audio Player', 'Tracing Sheets'],
    assessmentMethods: ['Oral repetition', 'Letter recognition check', 'Tracing correctness']
  },

  // Month 2 (Grade 1)
  {
    id: 'g1-m2-kh',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 2,
    monthName: 'ខែទី២ (ធ្នូ)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ផ្នែកទី១៖ ព្យញ្ជនៈ និងស្រៈនិស្ស័យ (បន្ត)',
    lessonTitle: 'មេរៀនទី៥ ដល់ ទី១០៖ ព្យញ្ជនៈ ង ច ឆ ជ ឈ ញ និងស្រៈ (អ៊ុ អ៊ូ អួ)',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សស្គាល់ព្យញ្ជនៈ ង ច ឆ ជ ឈ ញ និងការប្រកបជាមួយស្រៈនិស្ស័យផ្សេងៗ។',
      skills: 'សិស្សអានពាក្យសាមញ្ញ ងា ចា ឆា ជា និងសរសេរពាក្យបានត្រឹមត្រូវ។',
      attitude: 'សិស្សមានភាពអត់ធ្មត់ និងខិតខំព្យាយាមអានពាក្យថ្មីៗ។'
    },
    teachingActivities: ['ការផ្គុំអក្សរដោយប្រើកាតអក្សរ', 'ការសរសេរតាមអានពាក្យខ្លីៗ', 'ការអានប្រយោគគំរូ'],
    teachingAids: ['ប័ណ្ណអក្សរ', 'ក្តារខៀនតូច', 'សៀវភៅជំនួយការអាន'],
    assessmentMethods: ['ការសរសេរតាមអាន', 'ការអានបុគ្គល']
  },
  {
    id: 'g1-m2-ma',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 2,
    monthName: 'ខែទី២ (ធ្នូ)',
    subject: 'គណិតវិទ្យា',
    chapterTitle: 'ជំពូកទី១៖ ចំនួន ០ ដល់ ១០ (បន្ត)',
    lessonTitle: 'មេរៀនទី២៖ ការប្រៀបធៀប និងការបូកចំនួនក្នុងរង្វង់ ៥',
    hoursAllocated: 20,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីសញ្ញា «>», «<», «=» និងន័យនៃការបូក (ការរួមបញ្ចូលគ្នា)។',
      skills: 'សិស្សអាចប្រៀបធៀបចំនួន និងគណនាផលបូកក្នុងរង្វង់ ៥ បានត្រឹមត្រូវ។',
      attitude: 'សិស្សមានភាពជឿជាក់ក្នុងការដោះស្រាយលំហាត់បូកលេខ។'
    },
    teachingActivities: ['ប្រើប្រាស់ជញ្ជីងប្រៀបធៀបវត្ថុ', 'លំហាត់បូករូបភាពលើក្តារខៀន', 'ការធ្វើលំហាត់ក្នុងសៀវភៅ'],
    teachingAids: ['គ្រាប់រាប់', 'ប័ណ្ណសញ្ញា +, =, <, >', 'រូបភាពលំហាត់'],
    assessmentMethods: ['ការធ្វើលំហាត់លើក្តារឆ្នួន', 'សន្លឹកកិច្ចការ']
  },
  {
    id: 'g1-m2-sc',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 2,
    monthName: 'ខែទី២ (ធ្នូ)',
    subject: 'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម',
    chapterTitle: 'ជំពូកទី២៖ គ្រួសាររបស់ខ្ញុំ',
    lessonTitle: 'មេរៀនទី១៖ សមាជិកគ្រួសារ និងទំនាក់ទំនងក្នុងគ្រួសារ',
    hoursAllocated: 12,
    objectives: {
      knowledge: 'សិស្សរៀបរាប់បានពីឈ្មោះ និងតួនាទីសមាជិកក្នុងគ្រួសារ (ឱពុក ម្តាយ បង ប្អូន)។',
      skills: 'សិស្សបង្ហាញពីកិច្ចការសាមញ្ញដែលខ្លួនអាចជួយសម្រាលទុក្ខធុរៈឪពុកម្តាយ។',
      attitude: 'សិស្សមានក្តីស្រឡាញ់ និងដឹងគុណចំពោះឪពុកម្តាយ និងអាណាព្យាបាល។'
    },
    teachingActivities: ['គូររូបភាពគ្រួសាររបស់ខ្ញុំ', 'ការនិទានរឿងអំពីគ្រួសាររំភើប', 'ការពិភាក្សាអំពីកាតព្វកិច្ចកូន'],
    teachingAids: ['រូបថតគ្រួសារ', 'រូបភាពគំនូរគ្រួសារ'],
    assessmentMethods: ['ការបង្ហាញរូបគំនូរ និងរៀបរាប់', 'ការសួរដេញដោល']
  },
  {
    id: 'g1-m2-mo',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 2,
    monthName: 'ខែទី២ (ធ្នូ)',
    subject: 'សីលធម៌ និងពលរដ្ឋវិជ្ជា',
    chapterTitle: 'ជំពូកទី២៖ មិត្តភាព និងការចែករំលែក',
    lessonTitle: 'មេរៀនទី១៖ ការលេងជុំគ្នាដោយស្មោះត្រង់ និងការចែករំលែកសម្ភារ',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីតម្លៃនៃការចែករំលែក និងមិត្តភាពជាមួយមិត្តភក្តិក្នុងថ្នាក់។',
      skills: 'សិស្សចេះប្រើប្រាស់ពាក្យ «សូមទោស» «អរគុណ» និងចេះចែករំលែកនំចំណី/សម្ភារ។',
      attitude: 'សិស្សមិនលោភលន់ មិនវាយតប់គ្នា និងស្រឡាញ់មិត្តរួមថ្នាក់។'
    },
    teachingActivities: ['ល្បែងក្រុមចែករំលែកប្រដាប់ក្មេងលេង', 'ការមើលរូបភាពអប់រំសីលធម៌'],
    teachingAids: ['រូបភាពអប់រំ', 'សៀវភៅរឿងនិទានសីលធម៌'],
    assessmentMethods: ['ការសង្កេតការលេងជាមួយមិត្ត']
  },
  {
    id: 'g1-m2-en',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 2,
    monthName: 'ខែទី២ (ធ្នូ)',
    subject: 'ភាសាអង់គ្លេស',
    chapterTitle: 'Unit 2: Numbers 1-5 & Letters E-H',
    lessonTitle: 'Lesson 2: Counting 1 to 5 and Letters E, F, G, H',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'Students learn numbers 1 to 5 and words: Elephant, Fish, Girl, Hat.',
      skills: 'Students can count objects up to 5 and identify English initial sounds /e/, /f/, /g/, /h/.',
      attitude: 'Students build confidence in speaking short English words.'
    },
    teachingActivities: ['Finger counting song', 'Flashcard pop-up game', 'Tracing letters E-H'],
    teachingAids: ['Number cards 1-5', 'Letter flashcards E-H'],
    assessmentMethods: ['Counting oral check', 'Worksheet completion']
  },

  // Month 3, 4, 5 for Grade 1
  {
    id: 'g1-m3-kh',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 3,
    monthName: 'ខែទី៣ (មករា)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ផ្នែកទី១៖ ព្យញ្ជនៈ ស្រៈ និងការផ្សំសម្លេង',
    lessonTitle: 'មេរៀនទី១១ ដល់ ទី១៥៖ ព្យញ្ជនៈ ដ ឋ ឌ ឍ ណ ត ថ ទ ធ ន និងស្រៈពេញតួសាមញ្ញ',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សប្រាប់បានច្បាស់ពីសម្លេងអក្សរ ដ ដល់ ន និងស្រៈនិស្ស័យទាំងអស់។',
      skills: 'សិស្សអានពាក្យ២ព្យាង្គ និងសរសេរល្បះខ្លីៗបានត្រឹមត្រូវ។',
      attitude: 'សិស្សចូលចិត្តអានសៀវភៅរឿងរូបភាពខ្លីៗ។'
    },
    teachingActivities: ['អានអត្ថបទខ្លីៗ', 'ការប្រកួតប្រជែងអានលឿនត្រឹមត្រូវ', 'ការសរសេរតាមអាន'],
    teachingAids: ['ប័ណ្ណពាក្យ', 'សៀវភៅរឿងរូបភាព'],
    assessmentMethods: ['តេស្តអានប្រចាំខែ', 'ការសរសេរតាមអាន']
  },
  {
    id: 'g1-m3-ma',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 3,
    monthName: 'ខែទី៣ (មករា)',
    subject: 'គណិតវិទ្យា',
    chapterTitle: 'ជំពូកទី២៖ ចំនួន ៦ ដល់ ១០ និងការដក',
    lessonTitle: 'មេរៀនទី៣៖ ការរាប់ សរសេរ និងការដកចំនួនក្នុងរង្វង់ ៥ និង ១០',
    hoursAllocated: 20,
    objectives: {
      knowledge: 'សិស្សស្គាល់ចំនួន ៦ ដល់ ១០ និងយល់ពីន័យនៃការដក (ការយកចេញ)។',
      skills: 'សិស្សគណនាផលដកក្នុងរង្វង់ ៥ និងរាប់ចំនួនដល់ ១០ បានស្ទាត់ជំនាញ។',
      attitude: 'សិស្សសប្បាយរីករាយក្នុងការដោះស្រាយចំណោទសាមញ្ញ។'
    },
    teachingActivities: ['ប្រើប្រាស់រូបភាពយកចេញដើម្បីបង្ហាញការដក', 'លំហាត់បូកដកលាយគ្នា'],
    teachingAids: ['ដុំលោហៈ/ឈើរាប់', 'ប័ណ្ណសញ្ញាដក (-)'],
    assessmentMethods: ['ការធ្វើតេស្តសន្លឹកកិច្ចការ', 'ការដោះស្រាយលើក្តារខៀន']
  },
  {
    id: 'g1-m3-sc',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 3,
    monthName: 'ខែទី៣ (មករា)',
    subject: 'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម',
    chapterTitle: 'ជំពូកទី៣៖ ផ្ទះ និងសាលារៀនរបស់យើង',
    lessonTitle: 'មេរៀនទី១៖ ទីធ្លាសាលារៀន និងការថែរក្សាបរិស្ថានស្អាត',
    hoursAllocated: 12,
    objectives: {
      knowledge: 'សិស្សស្គាល់ទីតាំងផ្សេងៗក្នុងសាលារៀន និងយល់ពីប្រយោជន៍នៃអនាម័យសាលារៀន។',
      skills: 'សិស្សចេះបោះសំរាមក្នុងធុងសំរាម និងជួយបោសសម្អាតថ្នាក់រៀន។',
      attitude: 'សិស្សស្រឡាញ់សាលារៀន និងចូលរួមថែរក្សាទ្រព្យសម្បត្តិរួម។'
    },
    teachingActivities: ['ដើរទស្សនកិច្ចជុំវិញទីធ្លាសាលា', 'សកម្មភាពរើសសំរាមរួមគ្នា'],
    teachingAids: ['ធុងសំរាម', 'ប្រដាប់ប្រមូលសំរាម', 'រូបភាពសាលាស្អាត'],
    assessmentMethods: ['ការសង្កេតការចូលរួមសម្អាតថ្នាក់']
  },
  {
    id: 'g1-m3-mo',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 3,
    monthName: 'ខែទី៣ (មករា)',
    subject: 'សីលធម៌ និងពលរដ្ឋវិជ្ជា',
    chapterTitle: 'ជំពូកទី៣៖ សុវត្ថិភាពផ្ទាល់ខ្លួន',
    lessonTitle: 'មេរៀនទី១៖ ការប្រុងប្រយ័ត្នចំពោះគ្រោះថ្នាក់សាមញ្ញ និងការដើរតាមចើមថ្នល់',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីគ្រោះថ្នាក់នៃភ្លើង វត្ថុមុតស្រួច និងការឆ្លងថ្នល់។',
      skills: 'សិស្សចេះដើរលើចើមថ្នល់ខាងស្តាំដៃ និងមើលឆ្វេងស្តាំមុនឆ្លងថ្នល់។',
      attitude: 'សិស្សមានស្មារតីប្រុងប្រយ័ត្នខ្ពស់ជានិច្ចដើម្បីសុវត្ថិភាព។'
    },
    teachingActivities: ['ការអនុវត្តឆ្លងថ្នល់ក្លែងក្លាយក្នុងថ្នាក់', 'ការបង្ហាញរូបភាពគ្រោះថ្នាក់'],
    teachingAids: ['ផ្លាកសញ្ញាចរាចរណ៍សាមញ្ញ', 'រូបភាពការប្រុងប្រយ័ត្ន'],
    assessmentMethods: ['ការសួរសំណួរស្ថានភាព', 'ការអនុវត្តជាក់ស្តែង']
  },
  {
    id: 'g1-m3-en',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 3,
    monthName: 'ខែទី៣ (មករា)',
    subject: 'ភាសាអង់គ្លេស',
    chapterTitle: 'Unit 3: Colors & Letters I-L',
    lessonTitle: 'Lesson 3: Red, Blue, Yellow, Green & Letters I, J, K, L',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'Students identify primary colors and letters I, J, K, L.',
      skills: 'Students name colored objects (Red apple, Blue ball) and trace letters I-L.',
      attitude: 'Students enjoy coloring activities and team games.'
    },
    teachingActivities: ['Color matching games', 'Singing I can see Colors', 'Letter I-L flashcards'],
    teachingAids: ['Color pencils/crayons', 'Flashcards'],
    assessmentMethods: ['Color naming check', 'Worksheet']
  },

  // Month 4 (Grade 1)
  {
    id: 'g1-m4-kh',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 4,
    monthName: 'ខែទី៤ (កុម្ភៈ)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ផ្នែកទី១៖ ព្យញ្ជនៈប្រកប និងជើងអក្សរសាមញ្ញ',
    lessonTitle: 'មេរៀនទី១៦ ដល់ ទី២០៖ ព្យញ្ជនៈ ប ផ ព ភ ម យ រ ល វ ស ហ ឡ អ',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សស្គាល់គ្រប់ព្យញ្ជនៈទាំង ៣៣ តួ និងស្រៈនិស្ស័យទាំងអស់។',
      skills: 'សិស្សអាន និងសរសេរពាក្យផ្សំបានយ៉ាងស្ទាត់ជំនាញ។',
      attitude: 'សិស្សមានមោទនភាពចំពោះអក្សរសាស្ត្រជាតិ និងខិតខំអាន។'
    },
    teachingActivities: ['ការប្រកួតអានពាក្យលើក្តារខៀន', 'ការធ្វើលំហាត់បំពេញតួអក្សរខ្វះ'],
    teachingAids: ['តារាងព្យញ្ជនៈ ៣៣តួ', 'ប័ណ្ណពាក្យ'],
    assessmentMethods: ['ការពិនិត្យអក្ខរាវិរុទ្ធ', 'តេស្តអាន']
  },
  {
    id: 'g1-m4-ma',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 4,
    monthName: 'ខែទី៤ (កុម្ភៈ)',
    subject: 'គណិតវិទ្យា',
    chapterTitle: 'ជំពូកទី៣៖ ការបូក និងការដកក្នុងរង្វង់ ១០',
    lessonTitle: 'មេរៀនទី៤៖ វិធីបូក និងវិធីដកក្នុងរង្វង់ ១០ និងរូបធរណីមាត្រសាមញ្ញ',
    hoursAllocated: 20,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីការបូកនិងដកក្នុងរង្វង់ ១០ និងស្គាល់រូបរាងរង្វង់ ការេ ត្រីកោណ។',
      skills: 'សិស្សអាចដោះស្រាយលំហាត់បូកដក និងញែករូបធរណីមាត្រសាមញ្ញបាន។',
      attitude: 'សិស្សមានការគិតច្បាស់លាស់ និងចូលចិត្តមុខវិជ្ជាគណិតវិទ្យា។'
    },
    teachingActivities: ['ការផ្គុំរូបធរណីមាត្រ', 'ដោះស្រាយចំណោទរូបភាពបូកដកក្នុងរង្វង់ ១០'],
    teachingAids: ['ទម្រង់រូបធរណីមាត្រផ្លាស្ទិច', 'សន្លឹកលំហាត់'],
    assessmentMethods: ['តេស្តគណនាប្រចាំខែ']
  },
  {
    id: 'g1-m4-sc',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 4,
    monthName: 'ខែទី៤ (កុម្ភៈ)',
    subject: 'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម',
    chapterTitle: 'ជំពូកទី៤៖ រុក្ខជាតិ និងសត្វជុំវិញខ្លួន',
    lessonTitle: 'មេរៀនទី១៖ ផ្នែកផ្សេងៗនៃរុក្ខជាតិ និងសត្វចិញ្ចឹមសាមញ្ញ',
    hoursAllocated: 12,
    objectives: {
      knowledge: 'សិស្សរៀបរាប់បានពីផ្នែកធំៗនៃរុក្ខជាតិ (ឫស ដើម ស្លឹក ផ្កា) និងសត្វចិញ្ចឹម (ឆ្កែ ឆ្មា មាន់)។',
      skills: 'សិស្សចេះស្រោចទឹកដើមឈើ និងស្រឡាញ់សត្វចិញ្ចឹម។',
      attitude: 'សិស្សមានចិត្តមេត្តាចំពោះសត្វ និងចូលចិត្តដាំដើមឈើ។'
    },
    teachingActivities: ['ការសង្កេតរុក្ខជាតិពិតក្នុងទីធ្លាសាលា', 'ការគូររូបដើមឈើ និងសត្វ'],
    teachingAids: ['រុក្ខជាតិតូចៗក្នុងថូ', 'រូបភាពសត្វចិញ្ចឹម'],
    assessmentMethods: ['ការគូរ និងប្រាប់ឈ្មោះផ្នែករុក្ខជាតិ']
  },
  {
    id: 'g1-m4-mo',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 4,
    monthName: 'ខែទី៤ (កុម្ភៈ)',
    subject: 'សីលធម៌ និងពលរដ្ឋវិជ្ជា',
    chapterTitle: 'ជំពូកទី៤៖ ការនិយាយស្តី និងភាពស្មោះត្រង់',
    lessonTitle: 'មេរៀនទី១៖ ការមិនភូតភរ និងការសារភាពកំហុស',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីផលអាក្រក់នៃការភូតភរ និងតម្លៃនៃភាពស្មោះត្រង់។',
      skills: 'សិស្សហ៊ាននិយាយការពិត និងហ៊ានសុំទោសពេលធ្វើខុស។',
      attitude: 'សិស្សប្រកាន់ខ្ជាប់នូវភាពស្មោះត្រង់ជានិច្ច។'
    },
    teachingActivities: ['ការនិទានរឿង «ក្មេងឃ្វាលកពពែភូតភរ»', 'ពិភាក្សាអប់រំចិត្ត'],
    teachingAids: ['សៀវភៅរឿងនិទាន'],
    assessmentMethods: ['ការសង្កេតការអនុវត្តជាក់ស្តែង']
  },
  {
    id: 'g1-m4-en',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 4,
    monthName: 'ខែទី៤ (កុម្ភៈ)',
    subject: 'ភាសាអង់គ្លេស',
    chapterTitle: 'Unit 4: School Objects & Letters M-P',
    lessonTitle: 'Lesson 4: Pen, Pencil, Book, Bag & Letters M, N, O, P',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'Students know names of classroom objects and letters M-P.',
      skills: 'Students can point and say "This is a pen", "This is a book".',
      attitude: 'Students take good care of their school supplies.'
    },
    teachingActivities: ['Real object Show and Tell', 'Point to the object game'],
    teachingAids: ['Real Pen, Pencil, Book, Bag', 'Letters M-P cards'],
    assessmentMethods: ['Object recognition test']
  },

  // Month 5 (Grade 1 - Semester 1 Review & Exam)
  {
    id: 'g1-m5-kh',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 5,
    monthName: 'ខែទី៥ (មីនា - ប្រឡងឆមាសទី១)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ការរំលឹកឡើងវិញ និងការវាយតម្លៃឆមាសទី១',
    lessonTitle: 'ការរំលឹកព្យញ្ជនៈ ស្រៈ ការអានពាក្យ ឃ្លា និងការប្រឡងឆមាសទី១',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សចងចាំបានយ៉ាងរឹងមាំនូវព្យញ្ជនៈទាំង ៣៣តួ និងស្រៈនិស្ស័យទាំងអស់។',
      skills: 'សិស្សអាន និងសរសេរតាមអានពាក្យ/ល្បះក្នុងកម្រិតឆមាសទី១ បានយ៉ាងស្ទាត់ជំនាញ។',
      attitude: 'សិស្សមានស្មារតីប្រុងប្រយ័ត្ន និងជឿជាក់ក្នុងការប្រឡងឆមាសទី១។'
    },
    teachingActivities: ['លំហាត់រំលឹកឡើងវិញសរុប', 'ការធ្វើតេស្តសាកល្បង', 'ការប្រឡងឆមាសទី១'],
    teachingAids: ['ក្រដាសប្រឡង', 'កម្រងសំណួររំលឹក'],
    assessmentMethods: ['ពិន្ទុប្រឡងឆមាសទី១ (ការអាន និងការសរសេរ)']
  },
  {
    id: 'g1-m5-ma',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 5,
    monthName: 'ខែទី៥ (មីនា - ប្រឡងឆមាសទី១)',
    subject: 'គណិតវិទ្យា',
    chapterTitle: 'ការរំលឹកឡើងវិញ និងការវាយតម្លៃឆមាសទី១',
    lessonTitle: 'ការរំលឹកប្រមាណវិធីបូក ដក ក្នុងរង្វង់ ១០ និងប្រឡងឆមាសទី១',
    hoursAllocated: 20,
    objectives: {
      knowledge: 'សិស្សចងចាំរូបមន្ត និងប្រមាណវិធីបូកដកក្នុងរង្វង់ ១០។',
      skills: 'សិស្សដោះស្រាយលំហាត់ និងចំណោទសាមញ្ញបានលឿន និងត្រឹមត្រូវ។',
      attitude: 'សិស្សមានទំនួលខុសត្រូវខ្ពស់ក្នុងការប្រឡង។'
    },
    teachingActivities: ['ការធ្វើលំហាត់គំរូសរុប', 'ប្រឡងឆមាសទី១'],
    teachingAids: ['វិញ្ញាសាប្រឡងគណិតវិទ្យា'],
    assessmentMethods: ['ពិន្ទុវិញ្ញាសាប្រឡងឆមាសទី១']
  },
  {
    id: 'g1-m5-sc',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 5,
    monthName: 'ខែទី៥ (មីនា - ប្រឡងឆមាសទី១)',
    subject: 'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម',
    chapterTitle: 'ការរំលឹកឡើងវិញ និងការវាយតម្លៃឆមាសទី១',
    lessonTitle: 'ការរំលឹកមេរៀនរាងកាយ គ្រួសារ សាលារៀន និងការប្រឡងឆមាសទី១',
    hoursAllocated: 12,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងឡើងវិញនូវមេរៀនវិទ្យាសាស្ត្រ និងសិក្សាសង្គមដែលបានរៀន។',
      skills: 'សិស្សឆ្លើយសំណួរ និងភ្ជាប់រូបភាពបានត្រឹមត្រូវ។',
      attitude: 'សិស្សមានការយកចិត្តទុកដាក់ខ្ពស់។'
    },
    teachingActivities: ['ការសួរសំណួរចម្លើយរំលឹក', 'ការធ្វើតេស្តឆមាសទី១'],
    teachingAids: ['ក្រដាសសំណួរប្រឡង'],
    assessmentMethods: ['ពិន្ទុប្រឡងឆមាសទី១']
  },
  {
    id: 'g1-m5-mo',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 5,
    monthName: 'ខែទី៥ (មីនា - ប្រឡងឆមាសទី១)',
    subject: 'សីលធម៌ និងពលរដ្ឋវិជ្ជា',
    chapterTitle: 'ការរំលឹក និងការវាយតម្លៃអាកប្បកិរិយា',
    lessonTitle: 'ការប្រមូលផ្តុំការវាយតម្លៃសីលធម៌ សុជីវធម៌ និងការប្រឡងឆមាសទី១',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'សិស្សចងចាំច្បាប់សីលធម៌ សុវត្ថិភាព និងការគោរពចាស់ទុំ។',
      skills: 'សិស្សបង្ហាញអាកប្បកិរិយាល្អប្រសើរក្នុងសាលា និងនៅផ្ទះ។',
      attitude: 'សិស្សក្លាយជាកូនល្អ សិស្សល្អ និងមិត្តល្អ។'
    },
    teachingActivities: ['ការវាយតម្លៃអាកប្បកិរិយាឆមាសទី១', 'ការឆ្លើយសំណួរប្រឡង'],
    teachingAids: ['ក្រដាសវាយតម្លៃសីលធម៌'],
    assessmentMethods: ['ការវាយតម្លៃរួមឆមាសទី១']
  },
  {
    id: 'g1-m5-en',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី១',
    monthNumber: 5,
    monthName: 'ខែទី៥ (មីនា - ប្រឡងឆមាសទី១)',
    subject: 'ភាសាអង់គ្លេស',
    chapterTitle: 'Semester 1 Review & Assessment',
    lessonTitle: 'Review Units 1-4 & First Semester Exam',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'Students review letters A-P, numbers 1-5, colors, and school objects.',
      skills: 'Students complete written and oral English semester tests successfully.',
      attitude: 'Students feel proud of their early English achievements.'
    },
    teachingActivities: ['Interactive review game', 'Oral test & matching test'],
    teachingAids: ['Semester test paper'],
    assessmentMethods: ['Semester 1 English Score']
  },

  // ឆមាសទី២ (Semester 2: Months 6-10) Grade 1 Sample
  {
    id: 'g1-m6-kh',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 6,
    monthName: 'ខែទី៦ (មេសា)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ផ្នែកទី២៖ ជើងអក្សរ និងព្យញ្ជនៈផ្ញើជើង',
    lessonTitle: 'មេរៀនទី២១ ដល់ ទី២៥៖ ជើង ្ក ្ខ ្គ ្ឃ ្ង ្ច ឆ្ ្ជ',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សស្គាល់ទម្រង់ជើងអក្សរ ្ក ដល់ ្ជ និងរបៀបផ្សំជាមួយព្យញ្ជនៈដើម។',
      skills: 'សិស្សអាចអាន និងសរសេរពាក្យមានជើងអក្សរ (ក្ក, ខ្ន, ឆ្កែ, ថ្ម) បានត្រឹមត្រូវ។',
      attitude: 'សិស្សមានភាពសកម្មក្នុងការរៀនជើងអក្សរខ្មែរ។'
    },
    teachingActivities: ['ការបង្ហាញប័ណ្ណជើងអក្សរ', 'ការសរសេរជើងអក្សរក្រោមព្យញ្ជនៈដើម', 'ការអានពាក្យជើងអក្សរ'],
    teachingAids: ['ប័ណ្ណជើងអក្សរ', 'ក្តារខៀន', 'សៀវភៅជំនួយអាន'],
    assessmentMethods: ['ការសរសេរតាមអានពាក្យមានជើងអក្សរ', 'ការអានបុគ្គល']
  },
  {
    id: 'g1-m6-ma',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 6,
    monthName: 'ខែទី៦ (មេសា)',
    subject: 'គណិតវិទ្យា',
    chapterTitle: 'ជំពូកទី៤៖ ចំនួន ១១ ដល់ ២០',
    lessonTitle: 'មេរៀនទី៥៖ ការរាប់ សរសេរ និងតម្លៃខ្ទង់ (ខ្ទង់ដប់ និងខ្ទង់រាយ)',
    hoursAllocated: 20,
    objectives: {
      knowledge: 'សិស្សស្គាល់ចំនួន ១១ ដល់ ២០ និងយល់ដឹងពីតម្លៃខ្ទង់ដប់ និងខ្ទង់រាយ។',
      skills: 'សិស្សអាចបំបែកចំនួន (ឧ. ១៥ = ១០ + ៥) និងសរសេរចំនួនបានត្រឹមត្រូវ។',
      attitude: 'សិស្សចូលចិត្តរាប់ចំនួនធំជាងមុនដោយក្តីរីករាយ។'
    },
    teachingActivities: ['ការចងចង្កឹះជាបាច់ដប់', 'ការប្រើប្រាស់តារាងតម្លៃខ្ទង់'],
    teachingAids: ['ចង្កឹះចងបាច់ដប់', 'តារាងតម្លៃខ្ទង់'],
    assessmentMethods: ['លំហាត់បំបែកចំនួន', 'សន្លឹកកិច្ចការ']
  },
  {
    id: 'g1-m6-sc',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 6,
    monthName: 'ខែទី៦ (មេសា)',
    subject: 'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម',
    chapterTitle: 'ជំពូកទី៥៖ ធាតុអាកាស និងរដូវ',
    lessonTitle: 'មេរៀនទី១៖ កម្តៅថ្ងៃ ខ្យល់ ភ្លៀង និងការស្លៀកពាក់តាមធាតុអាកាស',
    hoursAllocated: 12,
    objectives: {
      knowledge: 'សិស្សរៀបរាប់បានពីលក្ខណៈធាតុអាកាស (ក្តៅ ត្រជាក់ ភ្លៀង) និងការការពារខ្លួន។',
      skills: 'សិស្សចេះជ្រើសរើសសម្លៀកបំពាក់ និងប្រើប្រាស់ឆត្រ/អាវភ្លៀងបានត្រឹមត្រូវ។',
      attitude: 'សិស្សចេះថែរក្សាសុខភាពក្នុងរដូវភ្លៀង និងរដូវក្តៅ។'
    },
    teachingActivities: ['ការសង្កេតធាតុអាកាសក្រៅថ្នាក់', 'ការជ្រើសរើសរូបភាពសម្លៀកបំពាក់ត្រូវតាមធាតុអាកាស'],
    teachingAids: ['រូបភាពធាតុអាកាស', 'ឆត្រ អាវភ្លៀង អាវរងារ'],
    assessmentMethods: ['ការសួរសំណួរអនុវត្តជាក់ស្តែង']
  },
  {
    id: 'g1-m6-mo',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 6,
    monthName: 'ខែទី៦ (មេសា)',
    subject: 'សីលធម៌ និងពលរដ្ឋវិជ្ជា',
    chapterTitle: 'ជំពូកទី៥៖ ប្រពៃណី និងពិធីបុណ្យជាតិ',
    lessonTitle: 'មេរៀនទី១៖ បុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិខ្មែរ និងការគោរពចាស់ព្រឹទ្ធាចារ្យ',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីអត្ថន័យនៃពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិខ្មែរ។',
      skills: 'សិស្សចេះជួយរៀបចំផ្ទះ និងសំពះជូនពរចាស់ទុំក្នុងគ្រួសារ។',
      attitude: 'សិស្សមានមោទនភាព និងស្រឡាញ់វប្បធម៌ប្រពៃណីជាតិខ្មែរ។'
    },
    teachingActivities: ['ការទស្សនាវីដេអូពិធីបុណ្យចូលឆ្នាំ', 'ការហាត់ជូនពរចាស់ទុំ'],
    teachingAids: ['រូបភាពពិធីបុណ្យចូលឆ្នាំខ្មែរ'],
    assessmentMethods: ['ការសម្តែងការជូនពរ']
  },
  {
    id: 'g1-m6-en',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 6,
    monthName: 'ខែទី៦ (មេសា)',
    subject: 'ភាសាអង់គ្លេស',
    chapterTitle: 'Unit 5: My Family & Letters Q-T',
    lessonTitle: 'Lesson 5: Father, Mother, Brother, Sister & Letters Q, R, S, T',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'Students learn words for family members and letters Q-T.',
      skills: 'Students can introduce family members: "This is my father", "This is my mother".',
      attitude: 'Students show love and respect for their family.'
    },
    teachingActivities: ['Family drawing & labeling', 'Flashcard repetition'],
    teachingAids: ['Family flashcards', 'Letter Q-T cards'],
    assessmentMethods: ['Oral introduction of family members']
  },

  // Month 7, 8, 9, 10 Grade 1
  {
    id: 'g1-m7-kh',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 7,
    monthName: 'ខែទី៧ (ឧសភា)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ផ្នែកទី២៖ ជើងអក្សរ (បន្ត)',
    lessonTitle: 'មេរៀនទី២៦ ដល់ ទី៣០៖ ជើង ្ដ ្ឋ ្ឌ ្ឍ ្ណ ្ត ្ថ ្ទ ធ្ ្ន',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សស្គាល់ជើងអក្សរ ដ ដល់ ន និងរបៀបអានពាក្យផ្សំជើងអក្សរ។',
      skills: 'សិស្សអាចអានអត្ថបទខ្លីៗដែលមានពាក្យផ្ញើជើង និងសរសេរតាមអានបានយ៉ាងត្រឹមត្រូវ។',
      attitude: 'សិស្សមានស្មារតីអានដោយយកចិត្តទុកដាក់។'
    },
    teachingActivities: ['ការអានអត្ថបទខ្លីៗក្នុងសៀវភៅសិក្សាគោល', 'ការប្រកួតប្រជែងសរសេរតាមអាន'],
    teachingAids: ['សៀវភៅសិក្សាគោល', 'ប័ណ្ណពាក្យ'],
    assessmentMethods: ['ការសរសេរតាមអាន', 'ការអានស្ទាត់']
  },
  {
    id: 'g1-m7-ma',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 7,
    monthName: 'ខែទី៧ (ឧសភា)',
    subject: 'គណិតវិទ្យា',
    chapterTitle: 'ជំពូកទី៥៖ ការបូក និងការដកក្នុងរង្វង់ ២០',
    lessonTitle: 'មេរៀនទី៦៖ ប្រមាណវិធីបូក និងដកចំនួនក្នុងរង្វង់ ២០ (គ្មានត្រដក និងមានត្រដក)',
    hoursAllocated: 20,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីក្បួនបូកដកចំនួនក្នុងរង្វង់ ២០។',
      skills: 'សិស្សគណនាបូកដកលេខ ២ខ្ទង់ ជាមួយ ១ខ្ទង់ បានត្រឹមត្រូវ។',
      attitude: 'សិស្សមានទំនុកចិត្តក្នុងការធ្វើលំហាត់លេខ។'
    },
    teachingActivities: ['ការប្រើបន្ទាត់ចំនួនរាប់បន្ថែម និងរាប់ថយក្រោយ', 'ការធ្វើលំហាត់ក្រុម'],
    teachingAids: ['បន្ទាត់ចំនួន', 'គ្រាប់រាប់'],
    assessmentMethods: ['តេស្តលំហាត់ប្រចាំខែ']
  },
  {
    id: 'g1-m7-sc',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 7,
    monthName: 'ខែទី៧ (ឧសភា)',
    subject: 'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម',
    chapterTitle: 'ជំពូកទី៦៖ វត្ថុជុំវិញខ្លួន និងថាមពលសាមញ្ញ',
    lessonTitle: 'មេរៀនទី១៖ វត្ថុរឹង វត្ថុរាវ និងប្រភពពន្លឺ (ព្រះអាទិត្យ ភ្លើងអគ្គិសនី)',
    hoursAllocated: 12,
    objectives: {
      knowledge: 'សិស្សស្គាល់ពីលក្ខណៈសាមញ្ញនៃទឹក និងវត្ថុរឹង ព្រមទាំងប្រភពពន្លឺ។',
      skills: 'សិស្សអាចចាត់ថ្នាក់វត្ថុរឹង និងរាវសាមញ្ញក្នុងជីវភាពរស់នៅ។',
      attitude: 'សិស្សចេះសន្សំសំចៃទឹក និងភ្លើងអគ្គិសនី។'
    },
    teachingActivities: ['ការពិសោធន៍សាមញ្ញចាក់ទឹកក្នុងកែវ', 'ការពិភាក្សាអំពីការបិទភ្លើងពេលមិនប្រើ'],
    teachingAids: ['កែវទឹក', 'ពិល', 'ដុំថ្ម'],
    assessmentMethods: ['ការចាត់ថ្នាក់វត្ថុ']
  },
  {
    id: 'g1-m7-mo',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 7,
    monthName: 'ខែទី៧ (ឧសភា)',
    subject: 'សីលធម៌ និងពលរដ្ឋវិជ្ជា',
    chapterTitle: 'ជំពូកទី៦៖ ការចូលរួមក្នុងសហគមន៍',
    lessonTitle: 'មេរៀនទី១៖ ការជួយអ្នកជិតខាង និងការមិនធ្វើឱ្យរំខានអ្នកដទៃ',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'សិស្សយល់ពីសារសំខាន់នៃទំនាក់ទំនងល្អជាមួយអ្នកជិតខាង។',
      skills: 'សិស្សចេះនិយាយរវាសរវៃ ជម្រាបសួរអ្នកជិតខាង និងមិនឡូឡារំខានគេ។',
      attitude: 'សិស្សមានរវាតសមរម្យ និងចិត្តសប្បុរស។'
    },
    teachingActivities: ['ការពិភាក្សាក្នុងថ្នាក់អំពីការរស់នៅជិតខាង', 'ការសម្តែងតួ'],
    teachingAids: ['រូបភាពសហគមន៍រស់នៅ'],
    assessmentMethods: ['ការសង្កេតអាកប្បកិរិយា']
  },
  {
    id: 'g1-m7-en',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 7,
    monthName: 'ខែទី៧ (ឧសភា)',
    subject: 'ភាសាអង់គ្លេស',
    chapterTitle: 'Unit 6: Animals & Letters U-Z',
    lessonTitle: 'Lesson 6: Dog, Cat, Bird, Fish & Letters U, V, W, X, Y, Z',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'Students know common animal names and complete alphabet A-Z.',
      skills: 'Students can recite the full English alphabet A-Z and name animals.',
      attitude: 'Students feel happy completing the English alphabet.'
    },
    teachingActivities: ['Alphabet completion game A-Z', 'Animal sound matching'],
    teachingAids: ['Full A-Z chart', 'Animal toys/flashcards'],
    assessmentMethods: ['Full Alphabet oral and written test']
  },

  // Months 8, 9, 10 Grade 1
  {
    id: 'g1-m8-kh',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 8,
    monthName: 'ខែទី៨ (មិថុនា)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ផ្នែកទី២៖ ជើងអក្សរ និងការអានអត្ថបទ',
    lessonTitle: 'មេរៀនទី៣១ ដល់ ទី៣៥៖ ជើង ្ប ្ផ ្ព ភ្ ្ម ្យ ្រ ្ល ្វ ្ស ្ហ ្អ',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សចេះជើងអក្សរទាំងអស់ និងច្បាប់ប្រកបជើងអក្សរ។',
      skills: 'សិស្សអានអត្ថបទខ្លីៗបានស្ទាត់ សរសេរតាមអានត្រឹមត្រូវ និងយល់ន័យអត្ថបទ។',
      attitude: 'សិស្សមានទម្លាប់អានសៀវភៅជារៀងរាល់ថ្ងៃ។'
    },
    teachingActivities: ['ការអានអត្ថបទកថាខណ្ឌខ្លីៗ', 'ការឆ្លើយសំណួរយល់ន័យអត្ថបទ'],
    teachingAids: ['សៀវភៅអានបន្ថែម', 'ប័ណ្ណពាក្យ'],
    assessmentMethods: ['តេស្តអានស្ទាត់ និងយល់ន័យ']
  },
  {
    id: 'g1-m8-ma',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 8,
    monthName: 'ខែទី៨ (មិថុនា)',
    subject: 'គណិតវិទ្យា',
    chapterTitle: 'ជំពូកទី៦៖ ចំនួនដល់ ១០០ និងរង្វាស់ប្រវែងសាមញ្ញ',
    lessonTitle: 'មេរៀនទី៧៖ ការរាប់រំលងដប់ ដល់ ១០០ និងការវាស់ប្រវែងដោយខ្នាតមិនខ្នាតគំរូ',
    hoursAllocated: 20,
    objectives: {
      knowledge: 'សិស្សស្គាល់ចំនួនដល់ ១០០ និងយល់ពីការវាស់ប្រវែងដោយប្រើអាញ់ (ជំហាន ស្រោមដៃ)។',
      skills: 'សិស្សរាប់ចំនួន ១០, ២០, ៣០... ដល់ ១០ sequence និងវាស់ប្រវែងតុ/ក្ដារខៀន។',
      attitude: 'សិស្សរីករាយក្នុងការធ្វើសកម្មភាពវាស់វែងជាក់ស្តែង។'
    },
    teachingActivities: ['ការវាស់ប្រវែងតុដោយប្រើចំអាមដៃ', 'ការរាប់គ្រាប់រាប់ជាដប់ៗ'],
    teachingAids: ['ចង្កឹះដប់ៗ', 'បន្ទាត់'],
    assessmentMethods: ['ការអនុវត្តវាស់ប្រវែងផ្ទាល់']
  },
  {
    id: 'g1-m8-sc',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 8,
    monthName: 'ខែទី៨ (មិថុនា)',
    subject: 'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម',
    chapterTitle: 'ជំពូកទី៧៖ ផែនដី និងមេឃ',
    lessonTitle: 'មេរៀនទី១៖ ថ្ងៃ និងយប់ ព្រះអាទិត្យ ព្រះច័ន្ទ និងផ្កាយ',
    hoursAllocated: 12,
    objectives: {
      knowledge: 'សិស្សប្រាប់បានពីភាពខុសគ្នារវាងពេលថ្ងៃ និងពេលយប់ ព្រមទាំងវត្ថុលើមេឃ។',
      skills: 'សិស្សរៀបរាប់ពីសកម្មភាពមនុស្សពេលថ្ងៃ (រៀន ធ្វើការ) និងពេលយប់ (សម្រាក)។',
      attitude: 'សិស្សចូលចិត្តសង្កេតធម្មជាតិជុំវិញខ្លួន។'
    },
    teachingActivities: ['ការគូររូបភាពមេឃពេលថ្ងៃ និងពេលយប់', 'ពិភាក្សាអំពីកាលវិភាគប្រចាំថ្ងៃ'],
    teachingAids: ['រូបភាពព្រះអាទិត្យ ព្រះច័ន្ទ', 'សៀវភៅរូបភាព'],
    assessmentMethods: ['ការគូរ និងការរៀបរាប់']
  },
  {
    id: 'g1-m8-mo',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 8,
    monthName: 'ខែទី៨ (មិថុនា)',
    subject: 'សីលធម៌ និងពលរដ្ឋវិជ្ជា',
    chapterTitle: 'ជំពូកទី៧៖ សេចក្តីក្លាហាន និងការការពារខ្លួន',
    lessonTitle: 'មេរៀនទី១៖ ការបដិសេធមិនទទួលយកនំ/សម្ភារពីជនមិនស្គាល់មុខ',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីគ្រោះថ្នាក់នៃការដើរតាម ឬទទួលយករបស់ពីជនแปลกមុខ។',
      skills: 'សិស្សចេះបដិសេធ «ទេ» យ៉ាងក្លាហាន និងរត់ប្រាប់គ្រូ ឬឪពុកម្តាយ។',
      attitude: 'សិស្សមានស្មារតីប្រុងប្រយ័ត្នខ្ពស់ដើម្បីសុវត្ថិភាពខ្លួនឯង។'
    },
    teachingActivities: ['ការអនុវត្តល្បែងសម្តែងតួ «បដិសេធជនមិនស្គាល់មុខ»', 'ការណែនាំពីសុវត្ថិភាពកុមារ'],
    teachingAids: ['វីដេអូ/រូបភាពអប់រំសុវត្ថិភាពកុមារ'],
    assessmentMethods: ['ការសម្តែងតួជាក់ស្តែង']
  },
  {
    id: 'g1-m8-en',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 8,
    monthName: 'ខែទី៨ (មិថុនា)',
    subject: 'ភាសាអង់គ្លេស',
    chapterTitle: 'Unit 7: Simple Actions & Numbers 6-10',
    lessonTitle: 'Lesson 7: Stand up, Sit down, Open, Close & Numbers 6-10',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'Students understand simple classroom commands and numbers 6 to 10.',
      skills: 'Students follow TPR commands (Simon Says: Stand up, Sit down, Open your book).',
      attitude: 'Students obey classroom rules politely in English.'
    },
    teachingActivities: ['Simon Says TPR game', 'Counting 6-10 with objects'],
    teachingAids: ['Action flashcards', 'Counting items'],
    assessmentMethods: ['Action response test']
  },

  // Months 9 & 10 Grade 1
  {
    id: 'g1-m9-kh',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 9,
    monthName: 'ខែទី៩ (កក្កដា)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ផ្នែកទី៣៖ ការរំលឹក និងការអានរឿងខ្លីៗ',
    lessonTitle: 'មេរៀនទី៣៦ ដល់ ទី៤០៖ ការអានអត្ថបទនិទានខ្លីៗ និងការសរសេរល្បះតាមគំរូ',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សយល់ន័យអត្ថបទនិទាន និងចេះបង្កើតល្បះខ្លីៗសាមញ្ញ។',
      skills: 'សិស្សអានស្ទាត់ យល់ន័យ ឆ្លើយសំណួរ និងសរសេរល្បះសាមញ្ញបានត្រឹមត្រូវ។',
      attitude: 'សិស្សមានក្តីសប្បាយរីករាយក្នុងការអានរឿងនិទាន។'
    },
    teachingActivities: ['ការអានរឿងនិទានជាក្រុម', 'ការឆ្លើយសំណួរការយល់ដឹង', 'ការសរសេរល្បះសាមញ្ញ'],
    teachingAids: ['សៀវភៅរឿងអានបន្ថែម'],
    assessmentMethods: ['តេស្តការយល់ដឹងពីការអាន']
  },
  {
    id: 'g1-m9-ma',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 9,
    monthName: 'ខែទី៩ (កក្កដា)',
    subject: 'គណិតវិទ្យា',
    chapterTitle: 'ជំពូកទី៧៖ ប្រមាណវិធីបូក និងដកក្នុងរង្វង់ ១០០ (គ្មានត្រដក)',
    lessonTitle: 'មេរៀនទី៨៖ វិធីបូក និងវិធីដកចំនួន ២ខ្ទង់ គ្មានត្រដក និងចំណោទ',
    hoursAllocated: 20,
    objectives: {
      knowledge: 'សិស្សយល់ពីរបៀបបូក និងដកចំនួន ២ខ្ទង់ គ្មានត្រដក (ឧ. ២៣ + ១៤, ៤៥ - ១២)។',
      skills: 'សិស្សរៀបតាមជួរឈរ និងគណនាផលបូក ផលដកបានត្រឹមត្រូវ។',
      attitude: 'សិស្សមានភាពប្រុងប្រយ័ត្នខ្ពស់ក្នុងការគណនា។'
    },
    teachingActivities: ['ការរៀបលេខតាមជួរឈរ (ខ្ទង់រាយ ខ្ទង់ដប់)', 'ការដោះស្រាយចំណោទសាមញ្ញ'],
    teachingAids: ['តារាងតម្លៃខ្ទង់', 'ក្តារឆ្នួន'],
    assessmentMethods: ['សន្លឹកកិច្ចការលំហាត់']
  },
  {
    id: 'g1-m9-sc',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 9,
    monthName: 'ខែទី៩ (កក្កដា)',
    subject: 'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម',
    chapterTitle: 'ជំពូកទី៨៖ សុខភាព និងសុវត្ថិភាពចំណីអាហារ',
    lessonTitle: 'មេរៀនទី១៖ ចំណីអាហារដែលមានផលល្អ និងផលអាក្រក់ចំពោះសុខភាព',
    hoursAllocated: 12,
    objectives: {
      knowledge: 'សិស្សស្គាល់អាហារដែលមានប្រយោជន៍ (បន្លែ ផ្លែឈើ ត្រី សាច់) និងអាហារមិនល្អ (នំផ្អែមខ្លាំង)។',
      skills: 'សិស្សចេះជ្រើសរើសបរិភោគអាហារមានអនាម័យ និងផឹកទឹកស្អាត។',
      attitude: 'សិស្សជៀសវាងការញ៉ាំនំចំណីគ្មានអនាម័យនៅមុខសាលា។'
    },
    teachingActivities: ['ការបង្ហាញរូបភាពអាហារល្អ និងមិនល្អ', 'ល្បែងញែករូបភាពអាហារ'],
    teachingAids: ['រូបភាពបន្លែ ផ្លែឈើ និងនំផ្អែម'],
    assessmentMethods: ['ការញែកប្រភេទអាហារ']
  },
  {
    id: 'g1-m9-mo',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 9,
    monthName: 'ខែទី៩ (កក្កដា)',
    subject: 'សីលធម៌ និងពលរដ្ឋវិជ្ជា',
    chapterTitle: 'ជំពូកទី៨៖ ការសន្សំសំចៃ',
    lessonTitle: 'មេរៀនទី១៖ ការថែរក្សាសៀវភៅ សម្ភារសិក្សា និងការសន្សំប្រាក់',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'សិស្សយល់ពីតម្លៃនៃសម្ភារសិក្សា និងប្រយោជន៍នៃការសន្សំសំចៃ។',
      skills: 'សិស្សចេះរៀបចំកាបូបរៀន រុំសៀវភៅ និងដាក់ប្រាក់ក្នុងកូនជ្រូកសន្សំ។',
      attitude: 'សិស្សមានទម្លាប់សន្សំសំចៃ និងមិនខ្ជះខ្ជាយ។'
    },
    teachingActivities: ['ការបង្ហាញសៀវភៅរុំស្អាត និងមិនរុំ', 'ការណែនាំពីការដាក់ប្រាក់ក្នុងជ្រូកសន្សំ'],
    teachingAids: ['កូនជ្រូកសន្សំប្រាក់', 'ក្រដាសរុំសៀវភៅ'],
    assessmentMethods: ['ការពិនិត្យសៀវភៅសិស្ស']
  },
  {
    id: 'g1-m9-en',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 9,
    monthName: 'ខែទី៩ (កក្កដា)',
    subject: 'ភាសាអង់គ្លេស',
    chapterTitle: 'Unit 8: Review & Everyday Expressions',
    lessonTitle: 'Lesson 8: How are you? I am fine & Numbers 1-10 Review',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'Students master simple daily conversation in English.',
      skills: 'Students can ask and answer "How are you? I am fine, thank you".',
      attitude: 'Students feel confident speaking basic English phrases.'
    },
    teachingActivities: ['Pair practice dialogs', 'Flashcard review games'],
    teachingAids: ['Conversation cards'],
    assessmentMethods: ['Pair speaking test']
  },

  // Month 10 Grade 1 (Final Review & Exam)
  {
    id: 'g1-m10-kh',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 10,
    monthName: 'ខែទី១០ (សីហា - ប្រឡងបញ្ចប់ឆ្នាំ)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ការរំលឹកឡើងវិញសរុប និងការប្រឡងបញ្ចប់ឆ្នាំ',
    lessonTitle: 'ការរំលឹកអាន សរសេរតាមអាន ការយល់ន័យ និងប្រឡងបញ្ចប់ឆ្នាំថ្នាក់ទី១',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សចេះអាន និងសរសេរភាសាខ្មែរកម្រិតថ្នាក់ទី១ ទាំងស្រុង។',
      skills: 'សិស្សទទួលបានសមត្ថភាពគ្រឹះក្នុងការអាន និងសរសេរដើម្បីឡើងទៅថ្នាក់ទី២។',
      attitude: 'សិស្សមានជំនឿចិត្តលើសមត្ថភាពខ្លួនឯង និងរំភើបចំពោះការឡើងថ្នាក់។'
    },
    teachingActivities: ['វិញ្ញាសារំលឹកសរុប', 'ការប្រឡងបញ្ចប់ឆ្នាំ'],
    teachingAids: ['ក្រដាសវិញ្ញាសាប្រឡង'],
    assessmentMethods: ['ពិន្ទុប្រឡងបញ្ចប់ឆ្នាំ (អាន និងសរសេរ)']
  },
  {
    id: 'g1-m10-ma',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 10,
    monthName: 'ខែទី១០ (សីហា - ប្រឡងបញ្ចប់ឆ្នាំ)',
    subject: 'គណិតវិទ្យា',
    chapterTitle: 'ការរំលឹកឡើងវិញសរុប និងការប្រឡងបញ្ចប់ឆ្នាំ',
    lessonTitle: 'ការរំលឹកគណិតវិទ្យាសរុប (ចំនួន ប្រមាណវិធី ធរណីមាត្រ) និងប្រឡងបញ្ចប់ឆ្នាំ',
    hoursAllocated: 20,
    objectives: {
      knowledge: 'សិស្សក្តោបក្តាប់បាននូវចំណេះដឹងគណិតវិទ្យាថ្នាក់ទី១ ទាំងអស់។',
      skills: 'សិស្សដោះស្រាយវិញ្ញាសាប្រឡងបញ្ចប់ឆ្នាំបានត្រឹមត្រូវ។',
      attitude: 'សិស្សមានស្មារតីទទួលខុសត្រូវខ្ពស់។'
    },
    teachingActivities: ['ការធ្វើវិញ្ញាសាគំរូ', 'ការប្រឡងបញ្ចប់ឆ្នាំ'],
    teachingAids: ['វិញ្ញាសាប្រឡងគណិតវិទ្យា'],
    assessmentMethods: ['ពិន្ទុវិញ្ញាសាប្រឡងបញ្ចប់ឆ្នាំ']
  },
  {
    id: 'g1-m10-sc',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 10,
    monthName: 'ខែទី១០ (សីហា - ប្រឡងបញ្ចប់ឆ្នាំ)',
    subject: 'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម',
    chapterTitle: 'ការរំលឹក និងការប្រឡងបញ្ចប់ឆ្នាំ',
    lessonTitle: 'ការរំលឹកមេរៀនវិទ្យាសាស្ត្រ សិក្សាសង្គម និងប្រឡងបញ្ចប់ឆ្នាំ',
    hoursAllocated: 12,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងឡើងវិញនូវគ្រប់មេរៀនវិទ្យាសាស្ត្រក្នុងឆ្នាំ។',
      skills: 'សិស្សឆ្លើយសំណួរប្រឡងបានត្រឹមត្រូវ។',
      attitude: 'សិស្សមានទំនុកចិត្ត។'
    },
    teachingActivities: ['ការប្រឡងបញ្ចប់ឆ្នាំ'],
    teachingAids: ['វិញ្ញាសាប្រឡង'],
    assessmentMethods: ['ពិន្ទុប្រឡងបញ្ចប់ឆ្នាំ']
  },
  {
    id: 'g1-m10-mo',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 10,
    monthName: 'ខែទី១០ (សីហា - ប្រឡងបញ្ចប់ឆ្នាំ)',
    subject: 'សីលធម៌ និងពលរដ្ឋវិជ្ជា',
    chapterTitle: 'ការវាយតម្លៃសីលធម៌ និងពលរដ្ឋវិជ្ជាប្រចាំឆ្នាំ',
    lessonTitle: 'ការបូកសរុបការវាយតម្លៃសីលធម៌ និងការប្រឡងបញ្ចប់ឆ្នាំ',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីសីលធម៌ និងសុជីវធម៌ក្នុងការរស់នៅ។',
      skills: 'សិស្សបង្ហាញអាកប្បកិរិយាជាសិស្សគំរូ។',
      attitude: 'សិស្សមានគុណធម៌ និងក្តីស្រឡាញ់។'
    },
    teachingActivities: ['ការប្រឡង និងបូកសរុបពិន្ទុ'],
    teachingAids: ['ក្រដាសវាយតម្លៃ'],
    assessmentMethods: ['ពិន្ទុបញ្ចប់ឆ្នាំ']
  },
  {
    id: 'g1-m10-en',
    grade: 'ថ្នាក់ទី១',
    semester: 'ឆមាសទី២',
    monthNumber: 10,
    monthName: 'ខែទី១០ (សីហា - ប្រឡងបញ្ចប់ឆ្នាំ)',
    subject: 'ភាសាអង់គ្លេស',
    chapterTitle: 'Final Assessment & Review',
    lessonTitle: 'Grade 1 Final English Examination',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'Students master Grade 1 English curriculum.',
      skills: 'Students complete Grade 1 Final English Exam.',
      attitude: 'Students feel motivated to continue learning English in Grade 2.'
    },
    teachingActivities: ['Final English Exam'],
    teachingAids: ['Exam sheets'],
    assessmentMethods: ['Final Grade 1 English Score']
  },

  // ==========================================
  // ថ្នាក់ទី២ (GRADE 2) SAMPLE CORE ITEMS
  // ==========================================
  {
    id: 'g2-m1-kh',
    grade: 'ថ្នាក់ទី២',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ជំពូកទី១៖ ការរំលឹកព្យញ្ជនៈ ស្រៈ និងជើងអក្សរ',
    lessonTitle: 'មេរៀនទី១ ដល់ ទី៤៖ ការអានពាក្យ ឃ្លា និងល្បះដែលមានជើងអក្សរ និងព្យញ្ជនៈផ្ញើជើង',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សចងចាំឡើងវិញនូវព្យញ្ជនៈ ស្រៈ និងជើងអក្សរទាំងអស់យ៉ាងស្ទាត់ជំនាញ។',
      skills: 'សិស្សអានអត្ថបទខ្លីៗបានត្រឹមត្រូវ និងសរសេរតាមអានពាក្យលំបាកៗសាមញ្ញ។',
      attitude: 'សិស្សមានចិត្តចូលចិត្តការអានអត្ថបទ និងការសរសេរអក្សរស្អាត។'
    },
    teachingActivities: ['ការអានអត្ថបទរំលឹកដើមឆ្នាំ', 'ការប្រកួតសរសេរអក្សរផ្ចង់', 'ការសរសេរតាមអាន'],
    teachingAids: ['សៀវភៅសិក្សាគោលថ្នាក់ទី២', 'តារាងជើងអក្សរ'],
    assessmentMethods: ['ការសរសេរតាមអាន', 'តេស្តអានល្បឿន']
  },
  {
    id: 'g2-m1-ma',
    grade: 'ថ្នាក់ទី២',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'គណិតវិទ្យា',
    chapterTitle: 'ជំពូកទី១៖ ចំនួន ០ ដល់ ១០០',
    lessonTitle: 'មេរៀនទី១៖ ការរាប់ ការអាន ការសរសេរ និងការប្រៀបធៀបចំនួនដល់ ១០០',
    hoursAllocated: 20,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីតម្លៃខ្ទង់ (ខ្ទង់រាយ ខ្ទង់ដប់) នៃចំនួនដល់ ១០០។',
      skills: 'សិស្សប្រៀបធៀប (<, >, =) និងរៀបលំដាប់ចំនួនពីតូចទៅធំ ធំទៅតូច។',
      attitude: 'សិស្សមានការប្រុងប្រយ័ត្នក្នុងការប្រៀបធៀបចំនួន។'
    },
    teachingActivities: ['ការប្រើតារាង ១ ដល់ ១០០', 'ល្បែងរៀបលំដាប់ប័ណ្ណលេខ'],
    teachingAids: ['តារាងចំនួន ១០០', 'ប័ណ្ណលេខ'],
    assessmentMethods: ['លំហាត់សន្លឹកកិច្ចការ', 'ការឡើងធ្វើលើក្តារខៀន']
  },
  {
    id: 'g2-m1-sc',
    grade: 'ថ្នាក់ទី២',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម',
    chapterTitle: 'ជំពូកទី១៖ ការថែរក្សាសុខភាព និងអនាម័យ',
    lessonTitle: 'មេរៀនទី១៖ អនាម័យចំណីអាហារ ទឹកស្អាត និងការលាងដៃជាមួយសាប៊ូ',
    hoursAllocated: 12,
    objectives: {
      knowledge: 'សិស្សយល់ពីប្រយោជន៍នៃទឹកស្អាត និងការលាងដៃតាម ៧ ជំហាន។',
      skills: 'សិស្សអនុវត្តការលាងដៃជាមួយសាប៊ូមុនញ៉ាំអាហារ និងក្រោយចូលបន្ទប់ទឹក។',
      attitude: 'សិស្សបង្កើតបានជាទម្លាប់រស់នៅស្អាត មានអនាម័យ។'
    },
    teachingActivities: ['ការបង្ហាញការលាងដៃ ៧ជំហានដោយគ្រូ', 'សិស្សអនុវត្តលាងដៃជាក់ស្តែង'],
    teachingAids: ['សាប៊ូ', 'ទឹកស្អាត', 'ផ្ទាំងរូបភាពលាងដៃ ៧ ជំហាន'],
    assessmentMethods: ['ការសង្កេតការអនុវត្តលាងដៃ']
  },
  {
    id: 'g2-m1-mo',
    grade: 'ថ្នាក់ទី២',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'សីលធម៌ និងពលរដ្ឋវិជ្ជា',
    chapterTitle: 'ជំពូកទី១៖ ការគោរព និងការគួរសម',
    lessonTitle: 'មេរៀនទី១៖ ការប្រើប្រាស់ពាក្យពេចន៍គួរសម និងការគោរពលោកគ្រូអ្នកគ្រូ',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'សិស្សយល់ពីពាក្យពេចន៍គួរសម (បាទ ចាស អរគុណ សូមទោស សូមអភ័យទោស)។',
      skills: 'សិស្សប្រើប្រាស់ពាក្យគួរសមក្នុងសាលារៀន និងក្នុងគ្រួសារយ៉ាងស្ទាត់ជំនាញ។',
      attitude: 'សិស្សមានសុជីវធម៌ខ្ពស់ និងរវាតសមរម្យ។'
    },
    teachingActivities: ['ការសម្តែងតួសន្ទនាក្នុងថ្នាក់', 'ការពិភាក្សាអាកប្បកិរិយា'],
    teachingAids: ['ផ្ទាំងរូបភាពសុជីវធម៌'],
    assessmentMethods: ['ការសង្កេតអាកប្បកិរិយាប្រចាំថ្ងៃ']
  },
  {
    id: 'g2-m1-en',
    grade: 'ថ្នាក់ទី២',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'ភាសាអង់គ្លេស',
    chapterTitle: 'Unit 1: Classroom Commands & Numbers 11-20',
    lessonTitle: 'Lesson 1: Listen, Look, Write, Read & Numbers 11-20',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'Students learn common teacher instructions and numbers 11-20.',
      skills: 'Students respond correctly to classroom verbal prompts in English.',
      attitude: 'Students actively participate in English lessons.'
    },
    teachingActivities: ['TPR command practice', 'Number flashcard drill 11-20'],
    teachingAids: ['Instruction cards', 'Number cards'],
    assessmentMethods: ['Verbal & movement assessment']
  },

  // Month 2 - 10 Grade 2 Items (Representative selections)
  {
    id: 'g2-m5-kh',
    grade: 'ថ្នាក់ទី២',
    semester: 'ឆមាសទី១',
    monthNumber: 5,
    monthName: 'ខែទី៥ (មីនា - ប្រឡងឆមាសទី១)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ការរំលឹក និងការវាយតម្លៃឆមាសទី១',
    lessonTitle: 'ការរំលឹកអត្ថបទអាន ការសរសេរតាមអាន និងការប្រឡងឆមាសទី១',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សចេះអាន និងសរសេរពាក្យ/ល្បះក្នុងឆមាសទី១ ថ្នាក់ទី២។',
      skills: 'សិស្សឆ្លើយសំណួរយល់ន័យអត្ថបទ និងសរសេរតាមអានត្រឹមត្រូវ។',
      attitude: 'សិស្សខិតខំប្រឹងប្រែងក្នុងការប្រឡង។'
    },
    teachingActivities: ['ការរំលឹកវិញ្ញាសា', 'ការប្រឡងឆមាសទី១'],
    teachingAids: ['វិញ្ញាសាប្រឡង'],
    assessmentMethods: ['ពិន្ទុប្រឡងឆមាសទី១']
  },
  {
    id: 'g2-m5-ma',
    grade: 'ថ្នាក់ទី២',
    semester: 'ឆមាសទី១',
    monthNumber: 5,
    monthName: 'ខែទី៥ (មីនា - ប្រឡងឆមាសទី១)',
    subject: 'គណិតវិទ្យា',
    chapterTitle: 'ការរំលឹក និងការវាយតម្លៃឆមាសទី១',
    lessonTitle: 'ប្រមាណវិធីបូក និងដក មានត្រដក ក្នុងរង្វង់ ១០០ និងប្រឡងឆមាសទី១',
    hoursAllocated: 20,
    objectives: {
      knowledge: 'សិស្សចេះវិធីបូក និងដកមានត្រដកយ៉ាងច្បាស់លាស់។',
      skills: 'សិស្សគណនាលំហាត់ និងដោះស្រាយចំណោទបានត្រឹមត្រូវ។',
      attitude: 'សិស្សមានស្មារតីប្រុងប្រយ័ត្ន។'
    },
    teachingActivities: ['ការប្រឡងឆមាសទី១'],
    teachingAids: ['វិញ្ញាសាប្រឡងគណិតវិទ្យា'],
    assessmentMethods: ['ពិន្ទុប្រឡងឆមាសទី១']
  },
  {
    id: 'g2-m10-kh',
    grade: 'ថ្នាក់ទី២',
    semester: 'ឆមាសទី២',
    monthNumber: 10,
    monthName: 'ខែទី១០ (សីហា - ប្រឡងបញ្ចប់ឆ្នាំ)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ការរំលឹកសរុប និងប្រឡងបញ្ចប់ឆ្នាំ',
    lessonTitle: 'អត្ថបទអាន ស្ដាប់ និយាយ សរសេរ និងប្រឡងបញ្ចប់ឆ្នាំថ្នាក់ទី២',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សចេះភាសាខ្មែរថ្នាក់ទី២ ទាំងស្រុង។',
      skills: 'សិស្សអានស្ទាត់ យល់ន័យ និងសរសេរត្រឹមត្រូវតាមអក្ខរាវិរុទ្ធ។',
      attitude: 'សិស្សស្រឡាញ់អក្សរសាស្ត្រជាតិ។'
    },
    teachingActivities: ['ការប្រឡងបញ្ចប់ឆ្នាំ'],
    teachingAids: ['វិញ្ញាសាប្រឡង'],
    assessmentMethods: ['ពិន្ទុបញ្ចប់ឆ្នាំ']
  },
  {
    id: 'g2-m10-ma',
    grade: 'ថ្នាក់ទី២',
    semester: 'ឆមាសទី២',
    monthNumber: 10,
    monthName: 'ខែទី១០ (សីហា - ប្រឡងបញ្ចប់ឆ្នាំ)',
    subject: 'គណិតវិទ្យា',
    chapterTitle: 'ការរំលឹកសរុប និងប្រឡងបញ្ចប់ឆ្នាំ',
    lessonTitle: 'វិធីគុណ វិធីចែកសាមញ្ញ ចំនួនដល់ ១០០០ និងប្រឡងបញ្ចប់ឆ្នាំ',
    hoursAllocated: 20,
    objectives: {
      knowledge: 'សិស្សស្គាល់មេគុណ ២, ៣, ៤, ៥ និងចំនួនដល់ ១០០០។',
      skills: 'សិស្សធ្វើប្រមាណវិធីគុណ ចែក និងដោះស្រាយចំណោទបានត្រឹមត្រូវ។',
      attitude: 'សិស្សមានទំនុកចិត្តខ្ពស់។'
    },
    teachingActivities: ['ការប្រឡងបញ្ចប់ឆ្នាំ'],
    teachingAids: ['វិញ្ញាសាប្រឡង'],
    assessmentMethods: ['ពិន្ទុបញ្ចប់ឆ្នាំ']
  },

  // ==========================================
  // ថ្នាក់ទី៣ (GRADE 3)
  // ==========================================
  {
    id: 'g3-m1-kh',
    grade: 'ថ្នាក់ទី៣',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ជំពូកទី១៖ សាលារៀន និងមិត្តភាព',
    lessonTitle: 'មេរៀនទី១៖ ការស្វាគមន៍បវេសនកាល និងការតាក់តែងល្បះសាមញ្ញ',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីន័យអត្ថបទ «ថ្ងៃបើកបវេសនកាល» និងស្គាល់នាម នាមអរូប។',
      skills: 'សិស្សអានអត្ថបទដោយបញ្ចេញសម្លេងច្បាស់លាស់ និងបង្កើតល្បះដែលមានប្រធាន កិរិយា និងកម្មបទ។',
      attitude: 'សិស្សរីករាយវិលត្រឡប់មកសិក្សាវិញដោយតស៊ូ។'
    },
    teachingActivities: ['ការអានជាដៃគូ', 'ការវិភាគកថាខណ្ឌ', 'លំហាត់វេយ្យាករណ៍បង្កើតល្បះ'],
    teachingAids: ['សៀវភៅសិក្សាគោលថ្នាក់ទី៣', 'ប័ណ្ណល្បះ'],
    assessmentMethods: ['ការអានខ្លាំងៗ', 'កិច្ចការផ្ទះបង្កើតល្បះ']
  },
  {
    id: 'g3-m1-ma',
    grade: 'ថ្នាក់ទី៣',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'គណិតវិទ្យា',
    chapterTitle: 'ជំពូកទី១៖ ចំនួនដល់ ១០ ០០០',
    lessonTitle: 'មេរៀនទី១៖ ការអាន សរសេរ និងតម្លៃខ្ទង់ (រាយ ដប់ រយ ពាន់)',
    hoursAllocated: 20,
    objectives: {
      knowledge: 'សិស្សស្គាល់ចំនួនដល់ ១០ ០០០ និងយល់ដឹងពីតម្លៃខ្ទង់នីមួយៗ។',
      skills: 'សិស្សសរសេរចំនួនជាទម្រង់ពង្រីក (ឧ. ៤៥៦៧ = ៤០០០ + ៥០០ + ៦០ + ៧) បានត្រឹមត្រូវ។',
      attitude: 'សិស្សមានភាពម៉ត់ចត់ក្នុងការសរសេរលេខខ្ទង់ធំ។'
    },
    teachingActivities: ['ការប្រើអាបាក់ (Abacus) ឬតារាងតម្លៃខ្ទង់', 'លំហាត់បំបែកចំនួន'],
    teachingAids: ['តារាងតម្លៃខ្ទង់ ៤ ខ្ទង់', 'អាបាក់'],
    assessmentMethods: ['សន្លឹកកិច្ចការលំហាត់']
  },
  {
    id: 'g3-m1-sc',
    grade: 'ថ្នាក់ទី៣',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម',
    chapterTitle: 'ជំពូកទី១៖ សរីរាង្គវិញ្ញាណ និងសុខភាព',
    lessonTitle: 'មេរៀនទី១៖ ភ្នែក ត្រចៀក និងការថែរក្សាការពារជំងឺភ្នែក/ត្រចៀក',
    hoursAllocated: 12,
    objectives: {
      knowledge: 'សិស្សរៀបរាប់បានពីសារសំខាន់នៃភ្នែក និងត្រចៀក ព្រមទាំងមូលហេតុនាំឱ្យខូចខាត។',
      skills: 'សិស្សអនុវត្តវិធីថែរក្សាភ្នែក (មិនមើលជិតពេក) និងត្រចៀក (មិនយកវត្ថុរឹងត្បារ)។',
      attitude: 'សិស្សមានស្មារតីប្រុងប្រយ័ត្នការពារសរីរាង្គវិញ្ញាណ។'
    },
    teachingActivities: ['ការទស្សនារូបភាពគំនូរសរីរាង្គ', 'ការពិភាក្សាក្រុមពីទម្លាប់ល្អ/អាក្រក់'],
    teachingAids: ['គំរូរូបភ្នែក និងត្រចៀក'],
    assessmentMethods: ['ការឆ្លើយសំណួរ និងការពិភាក្សា']
  },
  {
    id: 'g3-m1-mo',
    grade: 'ថ្នាក់ទី៣',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'សីលធម៌ និងពលរដ្ឋវិជ្ជា',
    chapterTitle: 'ជំពូកទី១៖ កាតព្វកិច្ចសិស្ស',
    lessonTitle: 'មេរៀនទី១៖ ការគោរពពេលវេលា ការធ្វើកិច្ចការផ្ទះ និងការថែរក្សាអនាម័យផ្ទាល់ខ្លួន',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីតម្លៃនៃការគោរពពេលវេលា និងការទទួលខុសត្រូវលើកិច្ចការសាលា។',
      skills: 'សិស្សរៀបចំកាលវិភាគសិក្សានៅផ្ទះ និងមកសាលារៀនទាន់ពេលវេលា។',
      attitude: 'សិស្សមានទំនួលខុសត្រូវ និងស្រឡាញ់ការរៀនសូត្រ។'
    },
    teachingActivities: ['ការធ្វើកាលវិភាគប្រចាំថ្ងៃផ្ទាល់ខ្លួន', 'ការពិភាក្សាអត្ថប្រយោជន៍នៃការគោរពពេល'],
    teachingAids: ['គំរូកាលវិភាគ'],
    assessmentMethods: ['ការពិនិត្យកាលវិភាគសិស្ស']
  },
  {
    id: 'g3-m1-en',
    grade: 'ថ្នាក់ទី៣',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'ភាសាអង់គ្លេស',
    chapterTitle: 'Unit 1: Self Introduction & Numbers 1-50',
    lessonTitle: 'Lesson 1: What is your name? I am... & Numbers up to 50',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'Students learn how to introduce themselves and count to 50.',
      skills: 'Students can say: "My name is...", "I am 8 years old", "I live in..."',
      attitude: 'Students feel enthusiastic speaking English with peers.'
    },
    teachingActivities: ['Ball toss introduction game', 'Number bingo game'],
    teachingAids: ['Flashcards', 'Bingo sheets'],
    assessmentMethods: ['Self-introduction speaking check']
  },

  // Grade 3 Semester 1 & 2 Key Milestones
  {
    id: 'g3-m5-kh',
    grade: 'ថ្នាក់ទី៣',
    semester: 'ឆមាសទី១',
    monthNumber: 5,
    monthName: 'ខែទី៥ (មីនា - ប្រឡងឆមាសទី១)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ការរំលឹក និងការវាយតម្លៃឆមាសទី១',
    lessonTitle: 'ការតែងសេចក្តីសាមញ្ញ ការសរសេរតាមអាន និងការប្រឡងឆមាសទី១',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីទម្រង់ល្បះ និងកថាខណ្ឌសាមញ្ញ។',
      skills: 'សិស្សតែងកថាខណ្ឌខ្លីៗ ៣-៥ ល្បះ និងសរសេរតាមអានបានត្រឹមត្រូវ។',
      attitude: 'សិស្សមានស្មារតីប្រុងប្រយ័ត្នក្នុងការប្រឡង។'
    },
    teachingActivities: ['ការប្រឡងឆមាសទី១'],
    teachingAids: ['វិញ្ញាសាប្រឡង'],
    assessmentMethods: ['ពិន្ទុប្រឡងឆមាសទី១']
  },
  {
    id: 'g3-m10-kh',
    grade: 'ថ្នាក់ទី៣',
    semester: 'ឆមាសទី២',
    monthNumber: 10,
    monthName: 'ខែទី១០ (សីហា - ប្រឡងបញ្ចប់ឆ្នាំ)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ការរំលឹកសរុប និងប្រឡងបញ្ចប់ឆ្នាំ',
    lessonTitle: 'ការអានយល់ន័យ ការសរសេរអត្ថបទពិពណ៌នាសាមញ្ញ និងប្រឡងបញ្ចប់ឆ្នាំថ្នាក់ទី៣',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សចេះភាសាខ្មែរថ្នាក់ទី៣ ទាំងស្រុង។',
      skills: 'សិស្សសរសេរអត្ថបទពិពណ៌នាសាមញ្ញ (ឧ. ពិពណ៌នាអំពីសត្វចិញ្ចឹម ឬសាលារៀន)។',
      attitude: 'សិស្សមានមោទនភាពលើសមត្ថភាពអក្សរសាស្ត្រខ្មែរ។'
    },
    teachingActivities: ['ការប្រឡងបញ្ចប់ឆ្នាំ'],
    teachingAids: ['វិញ្ញាសាប្រឡង'],
    assessmentMethods: ['ពិន្ទុបញ្ចប់ឆ្នាំ']
  },

  // ==========================================
  // ថ្នាក់ទី៤ (GRADE 4)
  // ==========================================
  {
    id: 'g4-m1-kh',
    grade: 'ថ្នាក់ទី៤',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ជំពូកទី១៖ ការអានអត្ថបទ និងវេយ្យាករណ៍',
    lessonTitle: 'មេរៀនទី១៖ អត្ថបទ «សាលារៀនខ្ញុំ» នាម និងគុណនាម',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីអត្ថន័យអត្ថបទ «សាលារៀនខ្ញុំ» ស្គាល់នាម និងគុណនាមក្នុងល្បះ។',
      skills: 'សិស្សអានស្ទាត់ ឆ្លើយសំណួរការយល់ដឹង និងចេះប្រើគុណនាមដើម្បីបង្កើតល្បះពិពណ៌នា។',
      attitude: 'សិស្សមានស្មារតីស្រឡាញ់ និងថែរក្សាសាលារៀន។'
    },
    teachingActivities: ['ការអានស្ងាត់ និងអានខ្លាំងៗ', 'ការស្រង់ពាក្យជានាម និងគុណនាម', 'ការធ្វើលំហាត់វេយ្យាករណ៍'],
    teachingAids: ['សៀវភៅសិក្សាគោលថ្នាក់ទី៤', 'ប័ណ្ណពាក្យវេយ្យាករណ៍'],
    assessmentMethods: ['តេស្តវេយ្យាករណ៍', 'ការឆ្លើយសំណួរយល់ន័យ']
  },
  {
    id: 'g4-m1-ma',
    grade: 'ថ្នាក់ទី៤',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'គណិតវិទ្យា',
    chapterTitle: 'ជំពូកទី១៖ ចំនួនដល់ ១ ០០០ ០០០',
    lessonTitle: 'មេរៀនទី១៖ ការអាន សរសេរ ប្រៀបធៀប និងការបូកដកចំនួនធំ',
    hoursAllocated: 20,
    objectives: {
      knowledge: 'សិស្សស្គាល់ថ្នាក់ចំនួន (ថ្នាក់រាយ ថ្នាក់ពាន់ ថ្នាក់លាន) និងតម្លៃខ្ទង់។',
      skills: 'សិស្សគណនាប្រមាណវិធីបូក និងដកចំនួនដល់ ១ ០០០ ០០០ និងដោះស្រាយចំណោទជីវភាព។',
      attitude: 'សិស្សមានទំនុកចិត្តក្នុងការគណនាច្បាស់លាស់។'
    },
    teachingActivities: ['ការប្រើតារាងថ្នាក់ចំនួន', 'ការដោះស្រាយចំណោទអនុវត្តជាក់ស្តែង'],
    teachingAids: ['តារាងថ្នាក់ចំនួន', 'សន្លឹកកិច្ចការចំណោទ'],
    assessmentMethods: ['ការធ្វើតេស្តប្រចាំខែ']
  },
  {
    id: 'g4-m1-sc',
    grade: 'ថ្នាក់ទី៤',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម',
    chapterTitle: 'ជំពូកទី១៖ ប្រព័ន្ធរំលាយអាហារ និងអាហាររូបត្ថម្ភ',
    lessonTitle: 'មេរៀនទី១៖ សរីរាង្គរំលាយអាហារ និងក្រុមអាហារទាំង៣ (ថាមពល លូតលាស់ ការពារ)',
    hoursAllocated: 12,
    objectives: {
      knowledge: 'សិស្សរៀបរាប់បានពីដំណើរបង្កើនថាមពលនៃប្រព័ន្ធរំលាយអាហារ និងក្រុមអាហារទាំង៣។',
      skills: 'សិស្សចេះរៀបចំរបបអាហារដែលមានតុល្យភាពសម្រាប់សុខភាព។',
      attitude: 'សិស្សជៀសវាងការបរិភោគអាហារដែលនាំឱ្យប៉ះពាល់ដល់ក្រពះពោះវៀន។'
    },
    teachingActivities: ['ការមើលផ្ទាំងរូបភាពប្រព័ន្ធរំលាយអាហារ', 'ការចាត់ថ្នាក់អាហារទាំង៣ក្រុម'],
    teachingAids: ['ផ្ទាំងគំនូរប្រព័ន្ធរំលាយអាហារ', 'រូបភាពអាហារ'],
    assessmentMethods: ['ការចាត់ថ្នាក់អាហារ', 'ការឆ្លើយសំណួរ']
  },
  {
    id: 'g4-m1-mo',
    grade: 'ថ្នាក់ទី៤',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'សីលធម៌ និងពលរដ្ឋវិជ្ជា',
    chapterTitle: 'ជំពូកទី១៖ សិទ្ធិកុមារ និងកាតព្វកិច្ច',
    lessonTitle: 'មេរៀនទី១៖ សិទ្ធិមូលដ្ឋានទាំង៤ របស់កុមារ (រស់រាន មានជីវិត អភិវឌ្ឍន៍ ការពារ និងចូលរួម)',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីសិទ្ធិទាំង៤ របស់កុមារ និងកាតព្វកិច្ចជាកូន និងជាសិស្ស។',
      skills: 'សិស្សចេះការពារខ្លួនពីការរំលោភបំពាន និងបំពេញកាតព្វកិច្ចរៀនសូត្រ។',
      attitude: 'សិស្សមានមោទនភាព និងចេះគោរពសិទ្ធិអ្នកដទៃ។'
    },
    teachingActivities: ['ការពិភាក្សាក្រុមអំពីសិទ្ធិកុមារ', 'ការទស្សនាវីដេអូខ្លី'],
    teachingAids: ['ផ្ទាំងអនុសញ្ញាសិទ្ធិកុមារ'],
    assessmentMethods: ['ការពិភាក្សា និងការឆ្លើយសំណួរ']
  },
  {
    id: 'g4-m1-en',
    grade: 'ថ្នាក់ទី៤',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'ភាសាអង់គ្លេស',
    chapterTitle: 'Unit 1: My Daily Routine & Present Simple',
    lessonTitle: 'Lesson 1: What time do you wake up? Daily actions & Present Simple Tense',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'Students learn daily routine verbs (wake up, brush teeth, go to school) and Present Simple.',
      skills: 'Students ask and answer time and daily habits in English.',
      attitude: 'Students value daily time management.'
    },
    teachingActivities: ['Daily routine matching', 'Pair Q&A about time'],
    teachingAids: ['Clock model', 'Action flashcards'],
    assessmentMethods: ['Speaking & writing test']
  },

  // Grade 4 Semester 1 & 2 Milestones
  {
    id: 'g4-m5-kh',
    grade: 'ថ្នាក់ទី៤',
    semester: 'ឆមាសទី១',
    monthNumber: 5,
    monthName: 'ខែទី៥ (មីនា - ប្រឡងឆមាសទី១)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ការរំលឹក និងការវាយតម្លៃឆមាសទី១',
    lessonTitle: 'ការតែងសេចក្តីពិពណ៌នាវត្ថុ/សត្វ ការសរសេរតាមអាន និងប្រឡងឆមាសទី១',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីទម្រង់តែងសេចក្តី (ផ្ដើមរឿង តួ រឿង បញ្ចប់រឿង)។',
      skills: 'សិស្សសរសេរតែងសេចក្តីពិពណ៌នាបានត្រឹមត្រូវតាមលំដាប់លំដោយ។',
      attitude: 'សិស្សមានស្មារតីខិតខំក្នុងការប្រឡង។'
    },
    teachingActivities: ['ការប្រឡងឆមាសទី១'],
    teachingAids: ['វិញ្ញាសាប្រឡង'],
    assessmentMethods: ['ពិន្ទុប្រឡងឆមាសទី១']
  },
  {
    id: 'g4-m10-kh',
    grade: 'ថ្នាក់ទី៤',
    semester: 'ឆមាសទី២',
    monthNumber: 10,
    monthName: 'ខែទី១០ (សីហា - ប្រឡងបញ្ចប់ឆ្នាំ)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ការរំលឹកសរុប និងប្រឡងបញ្ចប់ឆ្នាំ',
    lessonTitle: 'ការអានយល់ន័យ វេយ្យាករណ៍ តែងសេចក្តី និងប្រឡងបញ្ចប់ឆ្នាំថ្នាក់ទី៤',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សចេះភាសាខ្មែរថ្នាក់ទី៤ ទាំងស្រុង។',
      skills: 'សិស្សអានស្ទាត់ តែងសេចក្តី និងសរសេរអក្ខរាវិរុទ្ធបានត្រឹមត្រូវ។',
      attitude: 'សិស្សមានមោទនភាពចំពោះភាសាជាតិ។'
    },
    teachingActivities: ['ការប្រឡងបញ្ចប់ឆ្នាំ'],
    teachingAids: ['វិញ្ញាសាប្រឡង'],
    assessmentMethods: ['ពិន្ទុបញ្ចប់ឆ្នាំ']
  },

  // ==========================================
  // ថ្នាក់ទី៥ (GRADE 5)
  // ==========================================
  {
    id: 'g5-m1-kh',
    grade: 'ថ្នាក់ទី៥',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ជំពូកទី១៖ វប្បធម៌ និងមរតកជាតិ',
    lessonTitle: 'មេរៀនទី១៖ អត្ថបទ «ប្រាសាទអង្គរវត្ត» តែងសេចក្តីពិពណ៌នារូបភាព/ទីកន្លែង',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីប្រវត្តិសង្ខេប និងតម្លៃប្រាសាទអង្គរវត្ត ស្គាល់កិរិយាសព្ទ និងកិរិយាសព្ទជំនួយ។',
      skills: 'សិស្សតែងសេចក្តីពិពណ៌នាទីកន្លែង ឬប្រាសាទបុរាណដោយប្រើពាក្យពេចន៍លម្អិត។',
      attitude: 'សិស្សមានមោទនភាពជាតិ និងស្រឡាញ់ការពារបេតិកភណ្ឌវប្បធម៌។'
    },
    teachingActivities: ['ការវិភាគអត្ថបទអាន «ប្រាសាទអង្គរវត្ត»', 'ការណែនាំប្លង់តែងសេចក្តីពិពណ៌នាទីកន្លែង'],
    teachingAids: ['រូបថតប្រាសាទអង្គរវត្ត', 'សៀវភៅសិក្សាគោលថ្នាក់ទី៥'],
    assessmentMethods: ['កិច្ចការតែងសេចក្តី', 'តេស្តវេយ្យាករណ៍']
  },
  {
    id: 'g5-m1-ma',
    grade: 'ថ្នាក់ទី៥',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'គណិតវិទ្យា',
    chapterTitle: 'ជំពូកទី១៖ ប្រភាគ និងទសភាគ',
    lessonTitle: 'មេរៀនទី១៖ ការបូក ដក គុណ ចែក ប្រភាគដែលមានភាគបែងដូចគ្នា និងខុសគ្នា',
    hoursAllocated: 20,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីក្បួនតម្រូវភាគបែង និងប្រមាណវិធីលើប្រភាគ។',
      skills: 'សិស្សគណនាប្រមាណវិធីលើប្រភាគ និងសម្រួលប្រភាគឱ្យទៅជាប្រភាគសម្រួលរួច។',
      attitude: 'សិស្សមានភាពម៉ត់ចត់ និងច្បាស់លាស់ក្នុងការធ្វើប្រមាណវិធី។'
    },
    teachingActivities: ['ការប្រើប្រាស់រូបភាពកាត់នំ/ក្រដាសបង្ហាញប្រភាគ', 'ការធ្វើលំហាត់ក្រុម'],
    teachingAids: ['ទម្រង់ប្រភាគរង្វង់', 'សន្លឹកកិច្ចការ'],
    assessmentMethods: ['តេស្តលំហាត់ប្រភាគប្រចាំខែ']
  },
  {
    id: 'g5-m1-sc',
    grade: 'ថ្នាក់ទី៥',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម',
    chapterTitle: 'ជំពូកទី១៖ ប្រព័ន្ធដកដង្ហើម និងប្រព័ន្ធដឹកនាំក្នុងរាងកាយ',
    lessonTitle: 'មេរៀនទី១៖ សួត បេះដូង សរសៃឈាម និងការថែរក្សាសុខភាពបេះដូង',
    hoursAllocated: 12,
    objectives: {
      knowledge: 'សិស្សរៀបរាប់បានពីមុខងារសួត និងបេះដូងក្នុងការដឹកនាំអុកស៊ីសែន និងឈាម។',
      skills: 'សិស្សចេះវាស់ចង្វាក់បេះដូង និងយល់ពីប្រយោជន៍នៃការហាត់ប្រាណ។',
      attitude: 'សិស្សជៀសវាងការជក់បារី និងការដកដង្ហើមយកខ្យល់កខ្វក់។'
    },
    teachingActivities: ['ការវាស់ចង្វាក់បេះដូងមុន និងក្រោយរត់', 'មើលរូបភាពចលនាឈាមរត់'],
    teachingAids: ['គំរូបេះដូង និងសួត', 'នាឡិកាឈប់'],
    assessmentMethods: ['ការពិសោធន៍វាស់ចង្វាក់បេះដូង', 'សំណួរចម្លើយ']
  },
  {
    id: 'g5-m1-mo',
    grade: 'ថ្នាក់ទី៥',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'សីលធម៌ និងពលរដ្ឋវិជ្ជា',
    chapterTitle: 'ជំពូកទី១៖ ការគោរពច្បាប់ចរាចរណ៍ជើងគោក',
    lessonTitle: 'មេរៀនទី១៖ សញ្ញាចរាចរណ៍ ការពាក់មួកសុវត្ថិភាព និងការបើកបរដោយប្រុងប្រយ័ត្ន',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'សិស្សស្គាល់សញ្ញាចរាចរណ៍សំខាន់ៗ និងច្បាប់ពាក់មួកសុវត្ថិភាពលើម៉ូតូ/កង់។',
      skills: 'សិស្សអនុវត្តពាក់មួកសុវត្ថិភាពឱ្យបានត្រឹមត្រូវ និងជួយរំលឹកឪពុកម្តាយឱ្យគោរពច្បាប់។',
      attitude: 'សិស្សមានស្មារតីគោរពច្បាប់ចរាចរណ៍ដើម្បីសុវត្ថិភាពជីវិត។'
    },
    teachingActivities: ['ការបង្ហាញមួកសុវត្ថិភាពត្រឹមត្រូវ', 'ការទស្សនារូបភាពសញ្ញាចរាចរណ៍'],
    teachingAids: ['មួកសុវត្ថិភាព', 'រូបភាពផ្លាកសញ្ញាចរាចរណ៍'],
    assessmentMethods: ['តេស្តស្គាល់សញ្ញាចរាចរណ៍']
  },
  {
    id: 'g5-m1-en',
    grade: 'ថ្នាក់ទី៥',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'ភាសាអង់គ្លេស',
    chapterTitle: 'Unit 1: Hobbies & Past Simple Tense',
    lessonTitle: 'Lesson 1: What did you do last weekend? Hobbies & Regular Past Verbs',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'Students learn hobby vocabulary and Past Simple (played, visited, watched).',
      skills: 'Students talk and write short sentences about past weekend activities in English.',
      attitude: 'Students share personal experiences happily.'
    },
    teachingActivities: ['Past activity matching game', 'Pair sharing about weekend'],
    teachingAids: ['Past tense verb cards'],
    assessmentMethods: ['Short paragraph writing test']
  },

  // Grade 5 Semester Milestones
  {
    id: 'g5-m5-kh',
    grade: 'ថ្នាក់ទី៥',
    semester: 'ឆមាសទី១',
    monthNumber: 5,
    monthName: 'ខែទី៥ (មីនា - ប្រឡងឆមាសទី១)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ការរំលឹក និងការវាយតម្លៃឆមាសទី១',
    lessonTitle: 'តែងសេចក្តីពិពណ៌នាបុគ្គល/ទីកន្លែង អក្ខរាវិរុទ្ធ និងប្រឡងឆមាសទី១',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីទម្រង់តែងសេចក្តីពិពណ៌នា និងស្ទាត់ជំនាញវេយ្យាករណ៍។',
      skills: 'សិស្សសរសេរតែងសេចក្តី និងសរសេរតាមអានបានយ៉ាងត្រឹមត្រូវ។',
      attitude: 'សិស្សមានការខិតខំប្រឹងប្រែង។'
    },
    teachingActivities: ['ការប្រឡងឆមាសទី១'],
    teachingAids: ['វិញ្ញាសាប្រឡង'],
    assessmentMethods: ['ពិន្ទុប្រឡងឆមាសទី១']
  },
  {
    id: 'g5-m10-kh',
    grade: 'ថ្នាក់ទី៥',
    semester: 'ឆមាសទី២',
    monthNumber: 10,
    monthName: 'ខែទី១០ (សីហា - ប្រឡងបញ្ចប់ឆ្នាំ)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ការរំលឹកសរុប និងប្រឡងបញ្ចប់ឆ្នាំ',
    lessonTitle: 'អត្ថបទអាន ស្ដាប់ និយាយ តែងសេចក្តី និងប្រឡងបញ្ចប់ឆ្នាំថ្នាក់ទី៥',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សចេះភាសាខ្មែរថ្នាក់ទី៥ ទាំងស្រុង។',
      skills: 'សិស្សសរសេរតែងសេចក្តីបានល្អ និងអានស្ទាត់យល់ន័យ។',
      attitude: 'សិស្សមានមោទនភាពលើអក្សរសាស្ត្រជាតិ។'
    },
    teachingActivities: ['ការប្រឡងបញ្ចប់ឆ្នាំ'],
    teachingAids: ['វិញ្ញាសាប្រឡង'],
    assessmentMethods: ['ពិន្ទុបញ្ចប់ឆ្នាំ']
  },

  // ==========================================
  // ថ្នាក់ទី៦ (GRADE 6)
  // ==========================================
  {
    id: 'g6-m1-kh',
    grade: 'ថ្នាក់ទី៦',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ជំពូកទី១៖ ប្រវត្តិសាស្ត្រ និងអរិយធម៌ខ្មែរ',
    lessonTitle: 'មេរៀនទី១៖ អត្ថបទ «ព្រះរាជាណាចក្រកម្ពុជា» តែងសេចក្តីពន្យល់ និងវេយ្យាករណ៍ស្មុគស្មាញ',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីអរិយធម៌ខ្មែរ និងស្គាល់ទម្រង់តែងសេចក្តីពន្យល់ (Explanation Essay)។',
      skills: 'សិស្សអានអត្ថបទស្មុគស្មាញ ស្រង់គំនិតសំខាន់ និងតែងសេចក្តីពន្យល់តាមប្លង់ត្រឹមត្រូវ។',
      attitude: 'សិស្សមានមោទនភាពជាតិ និងស្មារតីអភិរក្សវប្បធម៌ខ្មែរ។'
    },
    teachingActivities: ['ការរៀបចំផែនទីគំនិត (Mind Map) នៃអត្ថបទ', 'ការណែនាំរចនាសម្ព័ន្ធតែងសេចក្តីពន្យល់'],
    teachingAids: ['សៀវភៅសិក្សាគោលថ្នាក់ទី៦', 'ផ្ទាំងគំនូរប្រវត្តិសាស្ត្រ'],
    assessmentMethods: ['កិច្ចការតែងសេចក្តីពន្យល់', 'ការតេស្តវេយ្យាករណ៍']
  },
  {
    id: 'g6-m1-ma',
    grade: 'ថ្នាក់ទី៦',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'គណិតវិទ្យា',
    chapterTitle: 'ជំពូកទី១៖ ភាគរយ និងផលធៀប',
    lessonTitle: 'មេរៀនទី១៖ ការគណនាភាគរយ ការបញ្ចុះតម្លៃ និងផលធៀបនៃពីរចំនួន',
    hoursAllocated: 20,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីទំនាក់ទំនងរវាងប្រភាគ ទសភាគ និងភាគរយ (%)។',
      skills: 'សិស្សគណនាប្រាក់ចំណេញ ប្រាក់ខាត ការបញ្ចុះតម្លៃ និងដោះស្រាយចំណោទពាណិជ្ជកម្មសាមញ្ញ។',
      attitude: 'សិស្សមានស្មារតីសន្សំសំចៃ និងយល់ដឹងពីការប្រើប្រាស់ប្រាក់ក្នុងជីវភាព។'
    },
    teachingActivities: ['ការដោះស្រាយចំណោទការទិញទំនិញបញ្ចុះតម្លៃ', 'ការធ្វើលំហាត់ប្រៀបធៀបផលធៀប'],
    teachingAids: ['ស្លាកថ្លៃទំនិញបញ្ចុះ %', 'សន្លឹកកិច្ចការចំណោទ'],
    assessmentMethods: ['តេស្តដោះស្រាយចំណោទភាគរយ']
  },
  {
    id: 'g6-m1-sc',
    grade: 'ថ្នាក់ទី៦',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'វិទ្យាសាស្ត្រ និងសិក្សាសង្គម',
    chapterTitle: 'ជំពូកទី១៖ បរិស្ថានវិទ្យា និងប្រព័ន្ធអេកូឡូស៊ី',
    lessonTitle: 'មេរៀនទី១៖ ខ្សែអាហារ បណ្តាញអាហារ និងការប្រែប្រួលអាកាសធាតុ',
    hoursAllocated: 12,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីទំនាក់ទំនងរវាងអ្នកផលិត អ្នកបរិភោគ និងអ្នកបំបែកធាតុក្នុងប្រព័ន្ធអេកូឡូស៊ី។',
      skills: 'សិស្សអាចសង់ដ្យាក្រាមខ្សែអាហារ និងបណ្តាញអាហារក្នុងធម្មជាតិបានត្រឹមត្រូវ។',
      attitude: 'សិស្សមានស្មារតីចូលរួមការពារបរិស្ថាន និងកាត់បន្ថយការប្រើប្រាស់ប្លាស្ទិក។'
    },
    teachingActivities: ['ការគូរដ្យាក្រាមខ្សែអាហារ', 'ការពិភាក្សាក្រុមអំពីការប្រែប្រួលអាកាសធាតុ'],
    teachingAids: ['ផ្ទាំងគំនូរប្រព័ន្ធអេកូឡូស៊ី', 'រូបភាពសត្វ/រុក្ខជាតិ'],
    assessmentMethods: ['ការសង់ដ្យាក្រាមខ្សែអាហារ', 'ការឆ្លើយសំណួរ']
  },
  {
    id: 'g6-m1-mo',
    grade: 'ថ្នាក់ទី៦',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'សីលធម៌ និងពលរដ្ឋវិជ្ជា',
    chapterTitle: 'ជំពូកទី១៖ វប្បធម៌សន្តិភាព និងការដោះស្រាយទំនាស់',
    lessonTitle: 'មេរៀនទី១៖ ការដោះស្រាយទំនាស់ដោយសន្តិវិធី និងការអត់ឱនអធ្យាស្រ័យ',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីមូលហេតុនៃទំនាស់ និងវិធីដោះស្រាយទំនាស់ដោយគ្មានអំពើហិង្សា។',
      skills: 'សិស្សចេះប្រើប្រាស់ការសម្រុះសម្រួល ការពិភាក្សា និងការអធ្យាស្រ័យគ្នាក្នុងសង្គម។',
      attitude: 'សិស្សស្រឡាញ់សន្តិភាព និងស្អប់ខ្ពើមអំពើហិង្សាគ្រប់រូបភាព។'
    },
    teachingActivities: ['ការលេងល្បែងសម្រុះសម្រួលទំនាស់', 'ការពិភាក្សាអំពីតម្លៃនៃសន្តិភាព'],
    teachingAids: ['រូបភាពអប់រំសន្តិភាព'],
    assessmentMethods: ['ការពិភាក្សា និងការសម្តែងតួ']
  },
  {
    id: 'g6-m1-en',
    grade: 'ថ្នាក់ទី៦',
    semester: 'ឆមាសទី១',
    monthNumber: 1,
    monthName: 'ខែទី១ (វិច្ឆិកា)',
    subject: 'ភាសាអង់គ្លេស',
    chapterTitle: 'Unit 1: Future Plans & Comparative/Superlative Adjectives',
    lessonTitle: 'Lesson 1: What are you going to do? Future with "Going to" & Comparisons',
    hoursAllocated: 8,
    objectives: {
      knowledge: 'Students learn "be going to" for future plans and comparative adjectives (bigger, faster).',
      skills: 'Students speak and write about future goals and compare objects/places in English.',
      attitude: 'Students set positive future learning targets.'
    },
    teachingActivities: ['Future plan interview in pairs', 'Comparison sentence building'],
    teachingAids: ['Grammar flashcards', 'Worksheets'],
    assessmentMethods: ['Interview performance & written test']
  },

  // Grade 6 Final Milestones (Months 5 & 10)
  {
    id: 'g6-m5-kh',
    grade: 'ថ្នាក់ទី៦',
    semester: 'ឆមាសទី១',
    monthNumber: 5,
    monthName: 'ខែទី៥ (មីនា - ប្រឡងឆមាសទី១)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ការរំលឹក និងការវាយតម្លៃឆមាសទី១',
    lessonTitle: 'ការតែងសេចក្តីពន្យល់ អក្ខរាវិរុទ្ធ ការយល់ន័យ និងប្រឡងឆមាសទី១',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងពីទម្រង់តែងសេចក្តី និងច្បាប់អក្ខរាវិរុទ្ធថ្នាក់ទី៦។',
      skills: 'សិស្សតែងសេចក្តីពន្យល់ និងសរសេរតាមអានបានត្រឹមត្រូវ។',
      attitude: 'សិស្សមានស្មារតីប្រុងប្រយ័ត្ន និងខិតខំ។'
    },
    teachingActivities: ['ការប្រឡងឆមាសទី១'],
    teachingAids: ['វិញ្ញាសាប្រឡង'],
    assessmentMethods: ['ពិន្ពុប្រឡងឆមាសទី១']
  },
  {
    id: 'g6-m10-kh',
    grade: 'ថ្នាក់ទី៦',
    semester: 'ឆមាសទី២',
    monthNumber: 10,
    monthName: 'ខែទី១០ (សីហា - ប្រឡងបញ្ចប់ឆ្នាំ / បញ្ចប់បឋមសិក្សា)',
    subject: 'ភាសាខ្មែរ',
    chapterTitle: 'ការរំលឹកសរុប និងប្រឡងបញ្ចប់កម្រិតបឋមសិក្សា',
    lessonTitle: 'ការតែងសេចក្តី ការអានយល់ន័យ អក្ខរាវិរុទ្ធ និងប្រឡងបញ្ចប់កម្រិតបឋមសិក្សា',
    hoursAllocated: 32,
    objectives: {
      knowledge: 'សិស្សទទួលបានចំណេះដឹងភាសាខ្មែរកម្រិតបឋមសិក្សាពេញលេញ ត្រៀមឡើងទៅអនុវិទ្យាល័យ។',
      skills: 'សិស្សតែងសេចក្តីបានស្ទាត់ អានយល់ន័យជម្រៅ និងសរសេរតាមអានបានត្រឹមត្រូវ។',
      attitude: 'សិស្សមានជំនឿចិត្ត និងមោទនភាពចំពោះការបញ្ចប់កម្រិតបឋមសិក្សា។'
    },
    teachingActivities: ['ការធ្វើវិញ្ញាសាគំរូប្រឡងបញ្ចប់បឋមសិក្សា', 'ការប្រឡងបញ្ចប់ឆ្នាំ'],
    teachingAids: ['វិញ្ញាសាប្រឡងបញ្ចប់បឋមសិក្សា'],
    assessmentMethods: ['ពិន្ទុវិញ្ញាសាប្រឡងបញ្ចប់កម្រិតបឋមសិក្សា']
  },
  {
    id: 'g6-m10-ma',
    grade: 'ថ្នាក់ទី៦',
    semester: 'ឆមាសទី២',
    monthNumber: 10,
    monthName: 'ខែទី១០ (សីហា - ប្រឡងបញ្ចប់ឆ្នាំ / បញ្ចប់បឋមសិក្សា)',
    subject: 'គណិតវិទ្យា',
    chapterTitle: 'ការរំលឹកសរុប និងប្រឡងបញ្ចប់កម្រិតបឋមសិក្សា',
    lessonTitle: 'គណិតវិទ្យាសរុប (ប្រមាណវិធី ភាគរយ ធរណីមាត្រ រង្វាស់រង្វាល់) និងប្រឡងបញ្ចប់ឆ្នាំ',
    hoursAllocated: 20,
    objectives: {
      knowledge: 'សិស្សយល់ដឹងស្ទាត់ជំនាញរាល់ក្បួន និងរូបមន្តគណិតវិទ្យាកម្រិតបឋមសិក្សា។',
      skills: 'សិស្សដោះស្រាយវិញ្ញាសាប្រឡងបញ្ចប់បឋមសិក្សាបានត្រឹមត្រូវ និងលឿន។',
      attitude: 'សិស្សមានទំនុកចិត្តខ្ពស់ក្នុងការបន្តការសិក្សាថ្នាក់ទី៧។'
    },
    teachingActivities: ['ការធ្វើវិញ្ញាសាគំរូប្រឡងបញ្ចប់បឋមសិក្សា', 'ការប្រឡងបញ្ចប់ឆ្នាំ'],
    teachingAids: ['វិញ្ញាសាប្រឡងគណិតវិទ្យាបញ្ចប់បឋម'],
    assessmentMethods: ['ពិន្ទុប្រឡងបញ្ចប់កម្រិតបឋមសិក្សា']
  }
];
