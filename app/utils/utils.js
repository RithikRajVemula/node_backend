const OpenAi = require('openai');
require('dotenv').config();
const chatGptApiKey = process.env.CHATGPT_API_KEY || "";
const assistant_id = process.env.CHATGPT_ASSISTANT_ID || "";
const openAi = new OpenAi({
  apiKey: chatGptApiKey
})
const path = require('path');
const puppeteer = require('puppeteer'); 
const fs = require('fs').promises;

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generatePDF = async (htmlContent) => {
    let browser;
    try {
      browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: 'new'
      });
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        // margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
      });
  
      return pdfBuffer;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  };


exports.generateResumeUsingLLM = async (resumeData) => {
    
  let prompt = `Generate a professional resume in HTML and CSS format that exactly matches the layout and design of Template${resumeData.type || 1}.pdf, using the following data:

  ${JSON.stringify(resumeData, null, 2)}
  
  Please adhere to these guidelines:
  1. Replicate the exact structure, layout, and design of Template${resumeData.type || 1}.html, adapting it to fit the given data.
  2. Use the same fonts, font sizes, colors, and styling as seen in Template${resumeData.type || 1}.html .
  3. Maintain the exact spacing, margins, and overall layout of Template${resumeData.type || 1}.html .
  4. Ensure the HTML is semantically correct and the CSS is clean and efficient.
  5. Use bullet points for listing skills, job responsibilities, and achievements, matching the style in Template${resumeData.type || 1}.html .
  6. Highlight key information such as job titles, company names, and dates in the same manner as Template${resumeData.type || 1}.html .
  7. Ensure that the overall layout is an exact match to Template${resumeData.type || 1}.html, while accurately representing the provided data.
  8. Make the design responsive to ensure it looks good when converted to PDF, but prioritize matching the layout of Template${resumeData.type || 1}.html .
  9. Include appropriate margins to ensure the resume is printable, matching those in Template${resumeData.type || 1}.html .
  
  Provide only the HTML and CSS code, starting from the <!DOCTYPE html> declaration and ending with the closing </html> tag. Do not include any explanations or additional text outside of the HTML/CSS code.
  
  The final result should be an exact replica of Template${resumeData.type || 1}.html in terms of design and layout, filled with the provided data, and ready for PDF conversion.`;
  
  console.log("generate pdf prompt", prompt);
    try {
        const assistantId = assistant_id;
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
        const pdfBuffer = await generatePDF(resumeContent);

        // Save the PDF file
        await fs.writeFile(pdfFilePath, pdfBuffer);

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