import PptxGenJS from 'pptxgenjs';
import { FiveStepLessonPlan, StudentWorksheet, LessonPlan } from '../types';

/**
 * Clean helper to trigger file download in browser
 */
function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export Lesson Plan or Worksheet to JSON file
 */
export function exportToJSON(
  title: string,
  type: 'plan' | 'worksheet',
  planData?: FiveStepLessonPlan | null,
  worksheetData?: StudentWorksheet | null
) {
  const safeTitle = title.replace(/[^\w\s\u1780-\u17FF]/g, '_') || 'Lesson';
  const payload =
    type === 'plan'
      ? { type: 'fiveStepPlan', fiveStepPlan: planData }
      : { type: 'worksheet', worksheet: worksheetData };

  const jsonStr = JSON.stringify(payload, null, 2);
  downloadFile(`${safeTitle}_${type === 'plan' ? 'កិច្ចតែងការ' : 'សន្លឹកកិច្ចការ'}.json`, jsonStr, 'application/json');
}

/**
 * Export Lesson Plan or Worksheet to a self-contained, styled HTML file
 */
export function exportToHTML(
  title: string,
  type: 'plan' | 'worksheet',
  planData?: FiveStepLessonPlan | null,
  worksheetData?: StudentWorksheet | null,
  lessonInfo?: LessonPlan | null,
  showAnswers: boolean = true
) {
  const safeTitle = title.replace(/[^\w\s\u1780-\u17FF]/g, '_') || 'Lesson_Plan';
  const fileName = `${safeTitle}_${type === 'plan' ? 'កិច្ចតែងការ' : 'សន្លឹកកិច្ចការ'}.html`;

  let bodyContent = '';

  if (type === 'plan' && planData) {
    bodyContent = `
      <div class="header-box">
        <div class="moeys-header">
          <div style="text-align: left;">
            <p style="font-family: 'Moul', serif; font-size: 11px; margin: 0; color: #0f172a;">ក្រសួងអប់រំ យុវជន និងកីឡា</p>
            <p style="font-weight: bold; font-size: 11px; margin: 2px 0 0 0; color: #334155;">មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្តកំពង់ស្ពឺ</p>
            <p style="font-weight: bold; font-size: 11px; margin: 2px 0 0 0; color: #92400e;">សាលារៀនសុវណ្ណភូមិទីតាំងកំពង់ស្ពឺ</p>
          </div>
          <div style="text-align: center;">
            <p style="font-family: 'Moul', serif; font-size: 11px; margin: 0; color: #0f172a;">ព្រះរាជាណាចក្រកម្ពុជា</p>
            <p style="font-family: 'Moul', serif; font-size: 11px; margin: 2px 0 0 0; color: #0f172a;">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
            <p style="margin: 2px 0 0 0; color: #0f172a; font-size: 11px;">═════ ❖ ═════</p>
          </div>
        </div>
        <h1>${planData.title}</h1>
        <div class="meta-grid">
          <div><strong>កម្រិតថ្នាក់៖</strong> ${planData.grade}</div>
          <div><strong>មុខវិជ្ជា៖</strong> ${planData.subject}</div>
          <div><strong>រយៈពេល៖</strong> ${planData.duration}</div>
          <div><strong>ខែសិក្សា៖</strong> ${lessonInfo?.monthName || '-'}</div>
        </div>
      </div>

      <div class="section-box">
        <h2>វត្ថុបំណងនៃមេរៀន (Objectives)</h2>
        <div class="objectives-grid">
          <div class="obj-card">
            <strong style="color: #1e3a8a;">១. ចំណេះដឹង៖</strong>
            <p>${planData.objectives.knowledge}</p>
          </div>
          <div class="obj-card">
            <strong style="color: #065f46;">២. បំណិន៖</strong>
            <p>${planData.objectives.skills}</p>
          </div>
          <div class="obj-card">
            <strong style="color: #92400e;">៣. ឥរិយាបថ៖</strong>
            <p>${planData.objectives.attitudes}</p>
          </div>
        </div>
        <p style="margin-top: 12px;"><strong>សម្ភារឧបទេស៖</strong> ${planData.teachingAids.join(', ')}</p>
      </div>

      <div class="section-box">
        <h2>សកម្មភាពបង្រៀន ៥ ជំហាន (5-Step Pedagogical Process)</h2>
        ${planData.steps
          .map(
            (step) => `
          <div class="step-card">
            <div class="step-header">
              <span>${step.title}</span>
              <span class="badge">${step.duration}</span>
            </div>
            <div class="step-body">
              <div class="activity-box teacher">
                <strong>សកម្មភាពគ្រូ (Teacher Activities)៖</strong>
                <p>${step.teacherActivities.replace(/\n/g, '<br/>')}</p>
              </div>
              <div class="activity-box student">
                <strong>សកម្មភាពសិស្ស (Student Activities)៖</strong>
                <p>${step.studentActivities.replace(/\n/g, '<br/>')}</p>
              </div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>

      ${
        planData.pedagogicalAdvice
          ? `
        <div class="advice-box">
          <strong>💡 ការណែនាំគរុកោសល្យបន្ថែម៖</strong>
          <p>${planData.pedagogicalAdvice}</p>
        </div>
      `
          : ''
      }

      <div class="signature-block">
        <div>
          <p>បានឃើញ និងឯកភាព</p>
          <p><strong>នាយកសាលាបឋមសិក្សា</strong></p>
          <br/><br/>
          <p>...................................................</p>
        </div>
        <div>
          <p>ថ្ងៃ................. ខែ........... ឆ្នាំ២០២៦</p>
          <p><strong>គ្រូបន្ទុកថ្នាក់</strong></p>
          <br/><br/>
          <p>...................................................</p>
        </div>
      </div>
    `;
  } else if (type === 'worksheet' && worksheetData) {
    bodyContent = `
      <div class="header-box">
        <div class="moeys-header">
          <div style="text-align: left;">
            <p style="font-family: 'Moul', serif; font-size: 11px; margin: 0; color: #0f172a;">ក្រសួងអប់រំ យុវជន និងកីឡា</p>
            <p style="font-weight: bold; font-size: 11px; margin: 2px 0 0 0; color: #334155;">មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្តកំពង់ស្ពឺ</p>
            <p style="font-weight: bold; font-size: 11px; margin: 2px 0 0 0; color: #92400e;">សាលារៀនសុវណ្ណភូមិទីតាំងកំពង់ស្ពឺ</p>
          </div>
          <div style="text-align: center;">
            <p style="font-family: 'Moul', serif; font-size: 11px; margin: 0; color: #0f172a;">ព្រះរាជាណាចក្រកម្ពុជា</p>
            <p style="font-family: 'Moul', serif; font-size: 11px; margin: 2px 0 0 0; color: #0f172a;">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
            <p style="margin: 2px 0 0 0; color: #0f172a; font-size: 11px;">═════ ❖ ═════</p>
          </div>
        </div>
        <h1>${worksheetData.title}</h1>
        <p><strong>ការណែនាំ៖</strong> ${worksheetData.instructions}</p>
        <div class="meta-grid">
          <div><strong>រយៈពេលធ្វើ៖</strong> ${worksheetData.timeAllowed}</div>
          <div><strong>ពិន្ទុសរុប៖</strong> ${worksheetData.totalPoints} ពិន្ទុ</div>
        </div>
      </div>

      <div class="section-box">
        <h2>សំណួរ និងលំហាត់សិស្ស</h2>
        ${worksheetData.questions
          .map(
            (q, idx) => `
          <div class="question-card">
            <div class="q-header">
              <strong>${idx + 1}. ${q.question}</strong>
              <span class="badge">${q.points} ពិន្ទុ</span>
            </div>
            ${
              q.options
                ? `
              <div class="options-grid">
                ${q.options.map((opt) => `<div class="option-item">${opt}</div>`).join('')}
              </div>
            `
                : ''
            }
            ${
              showAnswers
                ? `<div class="answer-box">
                    <strong>ចម្លើយត្រឹមត្រូវ និងការបកស្រាយ៖</strong> ${q.answerKey}
                   </div>`
                : `<div style="margin-top: 12px; color: #94a3b8; font-size: 12px; font-weight: 500;">
                    ចម្លើយសិស្ស៖ ............................................................................................................................
                   </div>`
            }
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  const htmlDocument = `<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&family=Moul&display=swap');
    body {
      font-family: 'Kantumruy Pro', 'Khmer OS Battambang', sans-serif;
      line-height: 1.6;
      color: #1e293b;
      background-color: #f8fafc;
      margin: 0;
      padding: 30px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border: 1px solid #e2e8f0;
    }
    .header-box {
      text-align: center;
      border-bottom: 3px double #0284c7;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .logo-title {
      font-family: 'Moul', serif;
      font-size: 16px;
      color: #b91c1c;
      margin-bottom: 8px;
    }
    h1 {
      font-size: 22px;
      color: #0f172a;
      margin: 8px 0;
    }
    .meta-grid {
      display: flex;
      justify-content: center;
      gap: 20px;
      font-size: 13px;
      color: #475569;
      margin-top: 10px;
    }
    .section-box {
      margin-bottom: 28px;
    }
    h2 {
      font-size: 16px;
      color: #1e1b4b;
      border-bottom: 2px solid #6366f1;
      padding-bottom: 6px;
      margin-bottom: 16px;
    }
    .objectives-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 12px;
    }
    .obj-card {
      background: #f1f5f9;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      font-size: 13px;
    }
    .step-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      margin-bottom: 16px;
      overflow: hidden;
    }
    .step-header {
      background: #e0e7ff;
      padding: 10px 16px;
      font-weight: bold;
      font-size: 14px;
      color: #3730a3;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .badge {
      background: #fef3c7;
      color: #92400e;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      border: 1px solid #fcd34d;
    }
    .step-body {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      padding: 16px;
    }
    .activity-box {
      padding: 12px;
      border-radius: 8px;
      font-size: 13px;
    }
    .activity-box.teacher {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
    }
    .activity-box.student {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
    }
    .advice-box {
      background: #f0fdf4;
      border: 1px solid #86efac;
      padding: 16px;
      border-radius: 8px;
      font-size: 13px;
      color: #166534;
      margin-top: 20px;
    }
    .question-card {
      border: 1px solid #e2e8f0;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 14px;
      background: #fafafa;
    }
    .q-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin: 10px 0;
    }
    .option-item {
      background: #ffffff;
      padding: 8px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 13px;
    }
    .answer-box {
      background: #f0fdf4;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      color: #15803d;
      margin-top: 8px;
    }
    .signature-block {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #cbd5e1;
      text-align: center;
      font-size: 13px;
    }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; border: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    ${bodyContent}
  </div>
</body>
</html>`;

  downloadFile(fileName, htmlDocument, 'text/html;charset=utf-8');
}

/**
 * Export Lesson Plan or Worksheet to PowerPoint (.pptx)
 */
export async function exportToPowerPoint(
  title: string,
  type: 'plan' | 'worksheet',
  planData?: FiveStepLessonPlan | null,
  worksheetData?: StudentWorksheet | null,
  showAnswers: boolean = true
) {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';

  const safeTitle = title.replace(/[^\w\s\u1780-\u17FF]/g, '_') || 'Lesson_Presentation';

  if (type === 'plan' && planData) {
    // Slide 1: Title Slide
    const slide1 = pptx.addSlide();
    slide1.background = { color: '1e1b4b' }; // Dark Indigo

    slide1.addText('សាលារៀនសុវណ្ណភូមិទីតាំងកំពង់ស្ពឺ', {
      x: 0.8,
      y: 0.8,
      w: 8.4,
      h: 0.6,
      fontSize: 18,
      color: 'FCD34D',
      bold: true,
      align: 'center',
    });

    slide1.addText(planData.title, {
      x: 0.8,
      y: 1.8,
      w: 8.4,
      h: 1.5,
      fontSize: 28,
      color: 'FFFFFF',
      bold: true,
      align: 'center',
    });

    slide1.addText(`កម្រិតថ្នាក់៖ ${planData.grade}  |  មុខវិជ្ជា៖ ${planData.subject}\nរយៈពេល៖ ${planData.duration}`, {
      x: 0.8,
      y: 3.8,
      w: 8.4,
      h: 1.0,
      fontSize: 16,
      color: 'E0E7FF',
      align: 'center',
    });

    // Slide 2: Objectives & Teaching Aids
    const slide2 = pptx.addSlide();
    slide2.addText('១. វត្ថុបំណងនៃមេរៀន & សម្ភារឧបទេស', {
      x: 0.6,
      y: 0.5,
      w: 8.8,
      h: 0.6,
      fontSize: 20,
      color: '1E3A8A',
      bold: true,
    });

    // Box 1: Knowledge
    slide2.addShape(pptx.ShapeType.rect, {
      x: 0.6,
      y: 1.3,
      w: 2.8,
      h: 3.2,
      fill: { color: 'EFF6FF' },
      line: { color: '93C5FD', width: 1 },
    });
    slide2.addText(`ចំណេះដឹង (Knowledge)\n\n${planData.objectives.knowledge}`, {
      x: 0.7,
      y: 1.4,
      w: 2.6,
      h: 3.0,
      fontSize: 13,
      color: '1E3A8A',
    });

    // Box 2: Skills
    slide2.addShape(pptx.ShapeType.rect, {
      x: 3.6,
      y: 1.3,
      w: 2.8,
      h: 3.2,
      fill: { color: 'ECFDF5' },
      line: { color: '6EE7B7', width: 1 },
    });
    slide2.addText(`បំណិន (Skills)\n\n${planData.objectives.skills}`, {
      x: 3.7,
      y: 1.4,
      w: 2.6,
      h: 3.0,
      fontSize: 13,
      color: '065F46',
    });

    // Box 3: Attitude
    slide2.addShape(pptx.ShapeType.rect, {
      x: 6.6,
      y: 1.3,
      w: 2.8,
      h: 3.2,
      fill: { color: 'FEF3C7' },
      line: { color: 'FCD34D', width: 1 },
    });
    slide2.addText(`ឥរិយាបថ (Attitude)\n\n${planData.objectives.attitudes}`, {
      x: 6.7,
      y: 1.4,
      w: 2.6,
      h: 3.0,
      fontSize: 13,
      color: '92400E',
    });

    // Slide 3-7: The 5 Steps
    planData.steps.forEach((step) => {
      const slideStep = pptx.addSlide();

      // Step Header
      slideStep.addShape(pptx.ShapeType.rect, {
        x: 0.5,
        y: 0.4,
        w: 9.0,
        h: 0.7,
        fill: { color: '3730A3' },
      });
      slideStep.addText(`${step.title} (${step.duration})`, {
        x: 0.7,
        y: 0.4,
        w: 8.6,
        h: 0.7,
        fontSize: 18,
        color: 'FFFFFF',
        bold: true,
      });

      // Left Column: Teacher Activities
      slideStep.addShape(pptx.ShapeType.rect, {
        x: 0.5,
        y: 1.3,
        w: 4.3,
        h: 3.8,
        fill: { color: 'F0F9FF' },
        line: { color: 'BAE6FD', width: 1 },
      });
      slideStep.addText(`សកម្មភាពគ្រូ (Teacher Activities)\n\n${step.teacherActivities}`, {
        x: 0.7,
        y: 1.5,
        w: 3.9,
        h: 3.4,
        fontSize: 13,
        color: '0369A1',
      });

      // Right Column: Student Activities
      slideStep.addShape(pptx.ShapeType.rect, {
        x: 5.2,
        y: 1.3,
        w: 4.3,
        h: 3.8,
        fill: { color: 'F0FDF4' },
        line: { color: 'BBF7D0', width: 1 },
      });
      slideStep.addText(`សកម្មភាពសិស្ស (Student Activities)\n\n${step.studentActivities}`, {
        x: 5.4,
        y: 1.5,
        w: 3.9,
        h: 3.4,
        fontSize: 13,
        color: '15803D',
      });
    });

    // Save PPTX
    await pptx.writeFile({ fileName: `${safeTitle}_កិច្ចតែងការ.pptx` });
  } else if (type === 'worksheet' && worksheetData) {
    // Worksheet Slide 1
    const slide1 = pptx.addSlide();
    slide1.background = { color: '065f46' };

    slide1.addText(worksheetData.title, {
      x: 0.8,
      y: 1.5,
      w: 8.4,
      h: 1.5,
      fontSize: 28,
      color: 'FFFFFF',
      bold: true,
      align: 'center',
    });

    slide1.addText(
      `ការណែនាំ៖ ${worksheetData.instructions}\nរយៈពេល៖ ${worksheetData.timeAllowed} | ពិន្ទុសរុប៖ ${worksheetData.totalPoints}`,
      {
        x: 0.8,
        y: 3.2,
        w: 8.4,
        h: 1.2,
        fontSize: 16,
        color: 'A7F3D0',
        align: 'center',
      }
    );

    // Questions Slides
    worksheetData.questions.forEach((q, idx) => {
      const slideQ = pptx.addSlide();
      slideQ.addText(`សំណួរទី ${idx + 1} (${q.points} ពិន្ទុ)`, {
        x: 0.6,
        y: 0.5,
        w: 8.8,
        h: 0.6,
        fontSize: 20,
        color: '065F46',
        bold: true,
      });

      slideQ.addText(q.question, {
        x: 0.6,
        y: 1.3,
        w: 8.8,
        h: 1.2,
        fontSize: 18,
        color: '111827',
        bold: true,
      });

      if (q.options) {
        slideQ.addText(`ជម្រើសចម្លើយ៖\n` + q.options.join('\n'), {
          x: 0.8,
          y: 2.6,
          w: 8.4,
          h: 2.0,
          fontSize: 15,
          color: '374151',
        });
      }

      if (showAnswers) {
        slideQ.addText(`ចម្លើយត្រឹមត្រូវ៖ ${q.answerKey}`, {
          x: 0.6,
          y: 4.8,
          w: 8.8,
          h: 0.5,
          fontSize: 14,
          color: '047857',
          bold: true,
        });
      } else {
        slideQ.addText(`ចម្លើយសិស្ស៖ ................................................................................`, {
          x: 0.6,
          y: 4.8,
          w: 8.8,
          h: 0.5,
          fontSize: 14,
          color: '9CA3AF',
        });
      }
    });

    await pptx.writeFile({ fileName: `${safeTitle}_សន្លឹកកិច្ចការ.pptx` });
  }
}

/**
 * Helper to convert all <img> elements inside clonedContent to Base64 Data URLs or absolute URLs
 * ensuring images (like school logo) render reliably in standalone HTML files or print windows.
 */
function processElementImagesForExport(contentEl: HTMLElement, clonedContent: HTMLElement) {
  const liveImages = Array.from(contentEl.querySelectorAll('img'));
  const clonedImages = Array.from(clonedContent.querySelectorAll('img'));

  clonedImages.forEach((clonedImg, idx) => {
    const liveImg = liveImages[idx];
    if (!liveImg) return;

    // Try converting loaded live image to Data URL via canvas
    if (liveImg.complete && liveImg.naturalWidth > 0) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = liveImg.naturalWidth;
        canvas.height = liveImg.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(liveImg, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          if (dataUrl && dataUrl.length > 50 && dataUrl.startsWith('data:image')) {
            clonedImg.setAttribute('src', dataUrl);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not convert image to dataUrl via canvas:', err);
      }
    }

    // Fallback: convert relative path to full absolute URL
    const rawSrc = liveImg.getAttribute('src') || liveImg.src;
    if (rawSrc) {
      try {
        const absoluteUrl = new URL(rawSrc, window.location.href).href;
        clonedImg.setAttribute('src', absoluteUrl);
      } catch (e) {
        clonedImg.setAttribute('src', rawSrc);
      }
    }
  });
}

/**
 * Clean Print Action: Opens dedicated print window formatted cleanly for paper print or Save as PDF
 * Supports orientation: 'portrait' | 'landscape' (default 'portrait')
 */
export function printDocument(elementId: string, docTitle: string, orientation: 'portrait' | 'landscape' = 'portrait') {
  const contentEl = document.getElementById(elementId);
  if (!contentEl) {
    window.print();
    return;
  }

  // Create a clean clone of the content element to remove interactive elements like buttons before printing
  const clonedContent = contentEl.cloneNode(true) as HTMLElement;
  const buttonsAndControls = clonedContent.querySelectorAll('button, input, select, .no-print');
  buttonsAndControls.forEach((el) => el.remove());

  // Ensure logo and images are converted to base64 or absolute URLs
  processElementImagesForExport(contentEl, clonedContent);

  const printWindow = window.open('', '_blank', 'width=1000,height=1100');
  if (!printWindow) {
    // Fallback if popup blocker active
    window.print();
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="km">
    <head>
      <meta charset="UTF-8">
      <title>${docTitle}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Moul&display=swap');

        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        body {
          font-family: 'Kantumruy Pro', 'Khmer OS Battambang', system-ui, -apple-system, sans-serif;
          color: #0f172a;
          background: #ffffff;
          margin: 0;
          padding: 20px;
          line-height: 1.6;
          font-size: 12.5px;
        }

        .print-container {
          max-width: 100%;
          margin: 0 auto;
        }

        .no-print, button, input, select {
          display: none !important;
        }

        /* Typography */
        h1, h2, h3, h4, h5, h6 {
          color: #0f172a;
          margin-top: 0;
          line-height: 1.3;
        }

        .khmer-moul, .font-moul {
          font-family: 'Moul', 'Khmer OS Muol Light', serif !important;
        }

        /* Prevent ugly page breaks across tables & cards */
        .step-card, .question-card, tr, .avoid-break, .signature-block, .section-box {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        /* Table formatting */
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 12px 0;
        }

        thead {
          display: table-header-group;
        }

        th, td {
          border: 1px solid #1e293b;
          padding: 6px 8px;
          text-align: left;
          vertical-align: top;
          font-size: 11.5px;
        }

        th {
          background-color: #f1f5f9 !important;
          color: #0f172a;
          font-weight: 700;
        }

        /* MoEYS Kingdom Header Alignment */
        .moeys-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid #0f172a;
        }

        /* Card and Grid Helpers */
        .grid { display: grid; }
        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .gap-2 { gap: 8px; }
        .gap-3 { gap: 12px; }
        .gap-4 { gap: 16px; }

        .p-2 { padding: 8px; }
        .p-3 { padding: 12px; }
        .p-4 { padding: 16px; }
        .rounded-lg { border-radius: 8px; }
        .rounded-xl { border-radius: 12px; }
        .border { border: 1px solid #cbd5e1; }
        .bg-amber-50 { background-color: #fffbeb !important; }
        .bg-blue-50 { background-color: #eff6ff !important; }
        .bg-emerald-50 { background-color: #ecfdf5 !important; }
        .bg-purple-50 { background-color: #faf5ff !important; }
        .bg-slate-50 { background-color: #f8fafc !important; }
        .bg-slate-100 { background-color: #f1f5f9 !important; }

        @page {
          size: A4 ${orientation};
          margin: 10mm 12mm 12mm 12mm;
        }

        @media print {
          body {
            padding: 0;
            background: #ffffff;
          }
          .print-container {
            width: 100%;
          }
        }
      </style>
      <link rel="stylesheet" href="/src/index.css">
    </head>
    <body>
      <div class="print-container">
        ${clonedContent.innerHTML}
      </div>
      <script>
        // Wait for fonts to load before printing
        document.fonts.ready.then(() => {
          setTimeout(() => {
            window.print();
            window.close();
          }, 350);
        });
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * Export any HTML element (e.g. Printable Annual Planner) as a standalone downloadable HTML file
 */
export function downloadElementAsHTML(elementId: string, docTitle: string) {
  const contentEl = document.getElementById(elementId);
  if (!contentEl) return;

  const clonedContent = contentEl.cloneNode(true) as HTMLElement;
  const buttonsAndControls = clonedContent.querySelectorAll('button, input, select, .no-print');
  buttonsAndControls.forEach((el) => el.remove());

  // Convert all images (including Sovannaphumi School Logo) to self-contained Base64 Data URLs
  processElementImagesForExport(contentEl, clonedContent);

  const safeTitle = docTitle.replace(/[^\w\s\u1780-\u17FF]/g, '_') || 'Planner';
  const fileName = `${safeTitle}.html`;

  const htmlContent = `<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${docTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Moul&display=swap');

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Kantumruy Pro', 'Khmer OS Battambang', system-ui, -apple-system, sans-serif;
      color: #0f172a;
      background: #f8fafc;
      margin: 0;
      padding: 24px;
      line-height: 1.6;
      font-size: 13px;
    }

    .print-container {
      max-width: 1000px;
      margin: 0 auto;
      background: #ffffff;
      padding: 32px;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .no-print, button, input, select {
      display: none !important;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
    }

    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      text-align: left;
      vertical-align: top;
    }

    th {
      background-color: #f1f5f9 !important;
      color: #0f172a;
      font-weight: 700;
    }

    .signature-block, tr, .avoid-break {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    @media print {
      body { padding: 0; background: #ffffff; }
      .print-container { box-shadow: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="print-container">
    ${clonedContent.innerHTML}
  </div>
</body>
</html>`;

  downloadFile(fileName, htmlContent, 'text/html');
}

