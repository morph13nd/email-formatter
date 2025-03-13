function reformatEmail(emailContent, fullName) {
    try {
        // We'll start by splitting the email into sections
        const lines = emailContent.split('\n');
        
        // First section (original email headers)
        let firstFromLine = '';
        let firstSentLine = '';
        let firstToLine = '';
        let firstSubjectLine = '';
        
        // Extract the first section headers
        for (let i = 0; i < lines.length && i < 10; i++) {
            const line = lines[i].trim();
            if (line.startsWith('From:') && !firstFromLine) {
                firstFromLine = line;
                // Extract the email from the From line
                const emailMatch = line.match(/<([^>]+)>/);
                if (emailMatch) {
                    firstSenderEmail = emailMatch[1].trim();
                }
            } else if (line.startsWith('Sent:') && !firstSentLine) {
                firstSentLine = line;
            } else if (line.startsWith('To:') && !firstToLine) {
                firstToLine = line;
            } else if (line.startsWith('Subject:') && !firstSubjectLine) {
                firstSubjectLine = line;
            }
        }
        
        // Find the second section (after the blank line)
        let secondSectionStartIndex = -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() === '' && i + 1 < lines.length && lines[i+1].trim().startsWith('From:')) {
                secondSectionStartIndex = i + 1;
                break;
            }
        }
        
        if (secondSectionStartIndex === -1) throw new Error("Couldn't find second section");
        
        // Extract the second section headers
        let secondFromLine = lines[secondSectionStartIndex];
        let secondSentLine = '';
        let secondToLine = '';
        let secondSubjectLine = '';
        let origSenderEmail = '';
        let recipientEmail = '';
        
        // Extract the real sender email from "On Behalf Of" pattern
        if (secondFromLine.includes('On Behalf Of')) {
            const onBehalfMatch = secondFromLine.match(/On Behalf Of ([^\s\n\r]+)/);
            if (onBehalfMatch) {
                origSenderEmail = onBehalfMatch[1].trim();
            }
        } else {
            // Try standard email extraction
            const emailMatch = secondFromLine.match(/<([^>]+)>/);
            if (emailMatch) {
                origSenderEmail = emailMatch[1].trim();
            }
        }
        
        // Find the other second section headers
        for (let i = secondSectionStartIndex + 1; i < lines.length && i < secondSectionStartIndex + 10; i++) {
            const line = lines[i].trim();
            if (line.startsWith('Sent:')) {
                secondSentLine = line;
                // Extract the sent date/time
                const sentMatch = line.match(/Sent: (.*)/);
                if (sentMatch) {
                    secondSentDateTime = sentMatch[1].trim();
                }
            } else if (line.startsWith('To:')) {
                secondToLine = line;
                // Extract the recipient email
                const toMatch = line.match(/To: (.*)/);
                if (toMatch) {
                    recipientEmail = toMatch[1].trim();
                }
            } else if (line.startsWith('Subject:')) {
                secondSubjectLine = line;
                // Extract subject without any prefixes
                const subjectMatch = line.match(/Subject: (.*)/);
                if (subjectMatch) {
                    cleanSubject = subjectMatch[1].trim();
                }
            }
        }
        
        // Extract first section email addresses
        const firstSenderMatch = firstFromLine.match(/<([^>]+)>/);
        let firstSenderEmail = '';
        if (firstSenderMatch) {
            firstSenderEmail = firstSenderMatch[1].trim();
        }
        
        // Format date for forwarded message
        const dateParts = secondSentDateTime ? secondSentDateTime.match(/([A-Za-z]+), ([A-Za-z]+) (\d+), (\d+) (\d+):(\d+) ([AP]M)/) : null;
        let formattedDate = secondSentDateTime || '';
        
        if (dateParts) {
            const dayOfWeek = dateParts[1].substring(0, 3);
            const month = dateParts[2].substring(0, 3);
            const day = dateParts[3];
            const year = dateParts[4];
            const time = `${dateParts[5]}:${dateParts[6]} ${dateParts[7]}`;
            formattedDate = `${dayOfWeek}, ${month} ${day}, ${year} at ${time}`;
        }
        
        // Find where the body content starts
        let bodyStartIndex = -1;
        for (let i = secondSectionStartIndex; i < lines.length; i++) {
            if (lines[i].trim().startsWith('Dear ')) {
                bodyStartIndex = i;
                break;
            }
        }
        
        if (bodyStartIndex === -1) {
            // If "Dear " not found, use a different approach - anything after subject line
            for (let i = secondSectionStartIndex; i < lines.length; i++) {
                if (lines[i].trim().startsWith('Subject:')) {
                    bodyStartIndex = i + 2; // Skip the subject line and a blank line
                    break;
                }
            }
        }
        
        // Default to end of headers if still not found
        if (bodyStartIndex === -1) {
            for (let i = secondSectionStartIndex; i < lines.length; i++) {
                if (lines[i].trim() === '' && i + 1 < lines.length && !lines[i+1].trim().startsWith('From:') && 
                   !lines[i+1].trim().startsWith('To:') && !lines[i+1].trim().startsWith('Subject:') && 
                   !lines[i+1].trim().startsWith('Sent:')) {
                    bodyStartIndex = i + 1;
                    break;
                }
            }
        }
        
        // Extract body content
        const bodyContent = bodyStartIndex !== -1 ? lines.slice(bodyStartIndex).join('\n') : '';
        
        // Clean subject (remove FW:, etc.)
        let cleanSubject = secondSubjectLine.replace(/^Subject: /, '').replace(/^(FW:|RE:|FWD:)\s*/i, "").trim();
        
        // Format the new email preserving the original headers
        let reformattedEmail = 
`${firstFromLine}
${firstSentLine}
${firstToLine}
${firstSubjectLine}


From: ${fullName} ${recipientEmail}
Sent: ${secondSentDateTime}
To: ${firstSenderEmail}
Subject: Fwd: ${cleanSubject}

---------- Forwarded message ---------
From: ${origSenderEmail}
Date: ${formattedDate}
Subject: ${cleanSubject}
To: ${recipientEmail}

${bodyContent}`;

        return reformattedEmail;
    } catch (error) {
        console.error("Error reformatting email:", error);
        return "Error: Could not parse the email format. Please make sure you've pasted the entire email with headers.";
    }
}
