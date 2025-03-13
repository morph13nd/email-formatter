document.addEventListener('DOMContentLoaded', function() {
    const fullNameInput = document.getElementById('fullName');
    const inputEmailTextarea = document.getElementById('inputEmail');
    const outputEmailTextarea = document.getElementById('outputEmail');
    const convertButton = document.getElementById('convertButton');
    const copyButton = document.getElementById('copyButton');

    convertButton.addEventListener('click', function() {
        const inputEmail = inputEmailTextarea.value;
        const fullName = fullNameInput.value || 'Debrah Pavlich';
        
        if (!inputEmail.trim()) {
            alert('Please paste an email to format');
            return;
        }
        
        const formattedEmail = reformatEmail(inputEmail, fullName);
        outputEmailTextarea.value = formattedEmail;
    });

    copyButton.addEventListener('click', function() {
        outputEmailTextarea.select();
        document.execCommand('copy');
        
        // Change button text temporarily
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
            copyButton.textContent = originalText;
        }, 2000);
    });

    function reformatEmail(emailContent, fullName) {
        try {
            // Split email into lines for processing
            const lines = emailContent.split('\n');
            
            // Extract the first sender's email
            const firstFromMatch = emailContent.match(/From: [^<]*<([^>]+)>/);
            let firstSenderEmail = '';
            if (firstFromMatch) {
                firstSenderEmail = firstFromMatch[1].trim();
            }
            
            // Find where the original header ends and forwarded section begins
            let originalHeaderEnd = 0;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].trim() === '' && i + 1 < lines.length && lines[i+1].trim().startsWith('From:')) {
                    originalHeaderEnd = i;
                    break;
                }
            }
            
            // Keep original header intact
            const originalHeader = lines.slice(0, originalHeaderEnd + 1).join('\n');
            
            // Process the forwarded section
            let forwardedSectionStart = originalHeaderEnd + 1;
            let recipientEmail = '';
            let sentDateTime = '';
            let subject = '';
            let senderEmail = 'azm@votem.com'; // Default fallback
            
            // Extract details from forwarded section
            for (let i = forwardedSectionStart; i < forwardedSectionStart + 10 && i < lines.length; i++) {
                const line = lines[i].trim();
                
                if (line.startsWith('From:')) {
                    // Handle "On Behalf Of" pattern
                    if (line.includes('On Behalf Of')) {
                        const match = line.match(/On Behalf Of ([^\s\n\r]+)/);
                        if (match) {
                            senderEmail = match[1].trim();
                        }
                    }
                } else if (line.startsWith('Sent:')) {
                    const match = line.match(/Sent: (.*)/);
                    if (match) {
                        sentDateTime = match[1].trim();
                    }
                } else if (line.startsWith('To:')) {
                    const match = line.match(/To: (.*)/);
                    if (match) {
                        recipientEmail = match[1].trim();
                    }
                } else if (line.startsWith('Subject:')) {
                    const match = line.match(/Subject: (.*)/);
                    if (match) {
                        subject = match[1].trim().replace(/^(FW:|RE:|FWD:)\s*/i, "");
                    }
                }
            }
            
            // Format date for the forwarded message section
            let formattedDate = sentDateTime;
            const dateParts = sentDateTime.match(/([A-Za-z]+), ([A-Za-z]+) (\d+), (\d+) (\d+):(\d+) ([AP]M)/);
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
            for (let i = forwardedSectionStart; i < lines.length; i++) {
                if (lines[i].trim().startsWith('Dear ')) {
                    bodyStartIndex = i;
                    break;
                }
            }
            
            if (bodyStartIndex === -1) {
                // Try another approach to find the body
                for (let i = forwardedSectionStart; i < lines.length; i++) {
                    if (lines[i].trim() === '' && 
                        i + 1 < lines.length && 
                        !lines[i+1].trim().startsWith('From:') && 
                        !lines[i+1].trim().startsWith('To:') && 
                        !lines[i+1].trim().startsWith('Subject:') && 
                        !lines[i+1].trim().startsWith('Sent:')) {
                        bodyStartIndex = i + 1;
                        break;
                    }
                }
            }
            
            // Extract body content
            const bodyContent = bodyStartIndex !== -1 ? 
                lines.slice(bodyStartIndex).join('\n') : 
                "";
            
            // Construct the middle section
            const middleSection = 
`From: ${fullName} ${recipientEmail}
Sent: ${sentDateTime}
To: ${firstSenderEmail}
Subject: Fwd: ${subject}`;
            
            // Construct the forwarded message section
            const forwardedMessageSection = 
`---------- Forwarded message ---------
From: ${senderEmail}
Date: ${formattedDate}
Subject: ${subject}
To: ${recipientEmail}

${bodyContent}`;
            
            // Combine all sections
            const formattedEmail = 
`${originalHeader}
${middleSection}

${forwardedMessageSection}`;
            
            return formattedEmail;
            
        } catch (error) {
            console.error("Error reformatting email:", error);
            return "Error: Could not parse the email format. Please make sure you've pasted the entire email with headers.";
        }
    }
});
