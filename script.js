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
            // Extract recipient email (To field in original email)
            const toMatch = emailContent.match(/To: ([^\n\r]+)/);
            if (!toMatch) throw new Error("Couldn't find 'To:' field");
            const recipientEmail = toMatch[1].trim();
            
            // Extract sent date and time
            const sentMatch = emailContent.match(/Sent: ([^\n\r]+)/);
            if (!sentMatch) throw new Error("Couldn't find 'Sent:' field");
            const sentDateTime = sentMatch[1].trim();
            
            // Extract subject
            const subjectMatch = emailContent.match(/Subject: ([^\n\r]+)/);
            if (!subjectMatch) throw new Error("Couldn't find 'Subject:' field");
            const subject = subjectMatch[1].trim();
            
            // Extract the actual sender email (from the original sender)
            let senderEmail = "unknown@example.com"; // Default fallback
            
            // Look for "On Behalf Of" format first
            if (emailContent.includes("On Behalf Of")) {
                const onBehalfMatch = emailContent.match(/On Behalf Of ([^\s\n\r]+)/);
                if (onBehalfMatch) {
                    senderEmail = onBehalfMatch[1].trim();
                }
            } else {
                // Try to extract from regular From field
                const fromMatch = emailContent.match(/From: ([^\n\r]+)/);
                if (fromMatch) {
                    const fromLine = fromMatch[1].trim();
                    const emailInBrackets = fromLine.match(/<([^>]+)>/);
                    if (emailInBrackets) {
                        senderEmail = emailInBrackets[1];
                    } else {
                        senderEmail = fromLine;
                    }
                }
            }
            
            // Format date for forwarded message
            const dateParts = sentDateTime.match(/([A-Za-z]+), ([A-Za-z]+) (\d+), (\d+) (\d+):(\d+) ([AP]M)/);
            let formattedDate = sentDateTime;
            
            if (dateParts) {
                const dayOfWeek = dateParts[1].substring(0, 3);
                const month = dateParts[2].substring(0, 3);
                const day = dateParts[3];
                const year = dateParts[4];
                const time = `${dateParts[5]}:${dateParts[6]} ${dateParts[7]}`;
                formattedDate = `${dayOfWeek}, ${month} ${day}, ${year} at ${time}`;
            }
            
            // Extract body content - everything after the subject line
            const bodyStartIndex = emailContent.indexOf(subject) + subject.length;
            let bodyContent = emailContent.substring(bodyStartIndex).trim();
            
            // Format the reformatted email
            const reformattedEmail = 
`From: ${fullName} <${recipientEmail}> 
Sent: ${sentDateTime}
To: ${recipientEmail}
Subject: Fwd: ${subject}


---------- Forwarded message ---------
From: <${senderEmail}>
Date: ${formattedDate}
Subject: ${subject}
To: <${recipientEmail}>

${bodyContent}`;

            return reformattedEmail;
        } catch (error) {
            console.error("Error reformatting email:", error);
            return "Error: Could not parse the email format. Please make sure you've pasted the entire email with headers.";
        }
    }
});
