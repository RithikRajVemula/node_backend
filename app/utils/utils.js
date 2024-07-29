const OpenAi = require('openai');
require('dotenv').config();
const chatGptApiKey = process.env.CHATGPT_API_KEY || "";
const assistant_id = process.env.CHATGPT_ASSISTANT_ID || "";
const openAi = new OpenAi({
  apiKey: chatGptApiKey
})
const path = require('path');
const puppeteer = require('puppeteer'); 

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generatePDF = async (htmlContent, filePath) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    await page.pdf({ path: filePath, format: 'A4' });
    await browser.close();
  };


exports.generateResumeUsingLLM = async (resumeData) => {
    
    let prompt = `Generate a professional resume in HTML and CSS format using the following data:

${JSON.stringify(resumeData, null, 2)}

Please adhere to these guidelines:
1. Use the structure and design of the resume templates provided, adapting them to fit the given data.
2. Ensure the HTML is semantically correct and the CSS is clean and efficient.
3. Use font sizes as follows:
   - 12pt for main section headings (e.g., "Experience", "Education")
   - 10pt for sub-headings (e.g., job titles, degree names)
   - 8pt for body text and bullet points
4. Use a professional, easy-to-read font such as Arial, Helvetica, or Calibri.
5. Ensure adequate spacing between sections:
   - Add at least 20px of margin above and below each main section (e.g., between "Experience" and "Education").
   - Add 10px of margin above and below sub-headings (e.g., between job titles and their descriptions).
   - Use 5px of margin between bullet points for clarity.
6. Use black color for all text to maintain a clean and professional look.
7. Avoid any layout that could cause page breaks inappropriately. Ensure that sections are designed to fit well together without splitting across pages.
8. Make the design responsive to ensure it looks good when converted to PDF.
9. Include appropriate margins (e.g., 0.5 to 1 inch) to ensure the resume is printable.
10. Use bullet points for listing skills, job responsibilities, and achievements.
11. Highlight key information such as job titles, company names, and dates.
12. Ensure the overall layout is balanced and visually appealing.

Provide only the HTML and CSS code, starting from the <!DOCTYPE html> declaration and ending with the closing </html> tag. Do not include any explanations or additional text outside of the HTML/CSS code.

The final result should be a polished, professional-looking resume that accurately represents the provided data and is ready for PDF conversion.`;
    
    console.log("generate pdf prompt", prompt);
    try {
        const assistantId = "asst_9mTJdy9cKNHtHtpaFeyphi0v";
        const thread = await openAi.beta.threads.create();

        let run = await openAi.beta.threads.runs.createAndPoll(
            thread.id,
            { 
              assistant_id: assistantId,
              instructions: prompt,
            }
          );
        let responseOfAI = "";
        if (run.status === 'completed') {
            const messages = await openAi.beta.threads.messages.list(
                run.thread_id
            );
            for (const message of messages.data.reverse()) {
                console.log(`message : ${message.role} > ${message.content[0].text.value}`);
                responseOfAI = message.content[0].text.value
            }
        } else {
            console.log(run.status);
        }
        const randomInt = getRandomInt(1, 1000);
        const resumeContent = responseOfAI.trim().replace("```html","").replace("```","");
        console.log("resume content:",resumeContent)
        const pdfFilePath = path.join(__dirname, '../../pdfs', `resume_${randomInt}.pdf`);

        // // Generate and save PDF
        await generatePDF(resumeContent, pdfFilePath);

        console.log('PDF Generated:', pdfFilePath);
        return { filePath: `resume_${randomInt}.pdf` };

    } catch (error) {
        if (error.response) {
            console.error('Error generating resume:', {
                status: error.response.status,
                headers: error.response.headers,
                data: error.response.data
            });
            throw new Error(`Error generating resume: ${error.response.data.error.message}`);
        } else if (error.request) {
            console.error('Error generating resume:', {
                request: error.request
            });
            throw new Error('Error generating resume: No response received from the server.');
        } else {
            console.error('Error generating resume:', {
                message: error.message
            });
            throw new Error(`Error generating resume: ${error.message}`);
        }
    }
};