document.addEventListener('DOMContentLoaded', function() {
    const fullNameInput = document.getElementById('fullName');
    const inputEmailTextarea = document.getElementById('inputEmail');
    const outputEmailTextarea = document.getElementById('outputEmail');
    const convertButton = document.getElementById('convertButton');
    const copyButton = document.getElementById('copyButton');

    convertButton.addEventListener('click', function() {
        const inputEmail = inputEmailTextarea.value;
        const fullName = fullNameInput.value || 'Oliver';
        
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
            // Extract the original sender's email (from the first From: line)
            const firstFromMatch = emailContent.match(/From: [^<]*<([^>]+)>/);
            if (!firstFromMatch) throw new Error("Couldn't find original sender email");
            const firstSenderEmail = firstFromMatch[1].trim();
            
            // Find the forwarded email section markers
            const parts = emailContent.split(/\n\s*\n/);
            let forwardedSection = '';
            
            for (let i = 1; i < parts.length; i++) {
                if (parts[i].trim().startsWith('From:')) {
                    forwardedSection = parts[i];
                    break;
                }
            }
            
            if (!forwardedSection) throw new Error("Couldn't find forwarded section");
            
            // Extract details from forwarded section
            const forwardedFromMatch = forwardedSection.match(/From:.*On Behalf Of ([^\r\n]+)/);
            let actualSender = '';
            
            if (forwardedFromMatch) {
                actualSender = forwardedFromMatch[1].trim();
            } else {
                const simpleFromMatch = forwardedSection.match(/From:.*?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
                if (simpleFromMatch) {
                    actualSender = simpleFromMatch[1].trim();
                }
            }
            
            // Extract sent date
            const sentMatch = forwardedSection.match(/Sent: ([^\r\n]+)/);
            if (!sentMatch) throw new Error("Couldn't find sent date");
            const sentDateTime = sentMatch[1].trim();
            
            // Extract original recipient
            const toMatch = forwardedSection.match(/To: ([^\r\n]+)/);
            if (!toMatch) throw new Error("Couldn't find original recipient");
            const originalRecipient = toMatch[1].trim();
            
            // Extract subject
            const subjectMatch = forwardedSection.match(/Subject: ([^\r\n]+)/);
            if (!subjectMatch) throw new Error("Couldn't find subject");
            let subject = subjectMatch[1].trim();
            subject = subject.replace(/^(FW:|RE:|FWD:)\s*/i, "");
            
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
            
            // Extract body content
            const bodyStartIndex = emailContent.indexOf("Dear ");
            if (bodyStartIndex === -1) throw new Error("Couldn't find email body");
            const bodyContent = emailContent.substring(bodyStartIndex);
            
            // Format the new email
            const reformattedEmail = 
`From: ${fullName} ${originalRecipient}
Sent: ${sentDateTime}
To: ${firstSenderEmail}
Subject: Fwd: ${subject}


---------- Forwarded message ---------
From: ${actualSender}
Date: ${formattedDate}
Subject: ${subject}
To: ${originalRecipient}

${bodyContent}`;

            return reformattedEmail;
        } catch (error) {
            console.error("Error reformatting email:", error);
            return "Error: Could not parse the email format. Please make sure you've pasted the entire email with headers.";
        }
    }
});
