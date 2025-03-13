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
            // Extract recipient email (To field in original email - will be used as sender in forwarded email)
            const toMatch = emailContent.match(/To: ([^\n\r]+)/);
            if (!toMatch) throw new Error("Couldn't find 'To:' field");
            const originalRecipient = toMatch[1].trim();
            
            // Extract sender email (From field in original email - will be used in the forwarded message section)
            const fromMatch = emailContent.match(/From: ([^\n\r]+)/);
            if (!fromMatch) throw new Error("Couldn't find 'From:' field");
            let originalSender = fromMatch[1].trim();
            
            // Extract the actual sender email, handling complex "On Behalf Of" cases
            let senderEmail = "azm@votem.com"; // Default fallback
            if (originalSender.includes("On Behalf Of")) {
                const onBehalfMatch = originalSender.match(/On Behalf Of ([^\s]+)/);
                if (onBehalfMatch) {
                    senderEmail = onBehalfMatch[1].trim();
                }
            } else {
                const emailMatches = originalSender.match(/<([^>]+)>/g);
                if (emailMatches && emailMatches.length > 0) {
                    // Get the last email match and remove brackets
                    const lastEmail = emailMatches[emailMatches.length-1];
                    senderEmail = lastEmail.replace('<', '').replace('>', '');
                }
            }
            
            // Extract sent date and time
            const sentMatch = emailContent.match(/Sent: ([^\n\r]+)/);
            if (!sentMatch) throw new Error("Couldn't find 'Sent:' field");
            const sentDateTime = sentMatch[1].trim();
            
            // Extract subject
            const subjectMatch = emailContent.match(/Subject: ([^\n\r]+)/);
            if (!subjectMatch) throw new Error("Couldn't find 'Subject:' field");
            const subject = subjectMatch[1].trim();
            
            // Format date for forwarded message
            const dateParts = sentDateTime.match(/([A-Za-z]+), ([A-Za-z]+) (\d+), (\d+) (\d+):(\d+) ([AP]M)/);
            let formattedDate = sentDateTime;
            
            if (dateParts) {
                const month = dateParts[2].substring(0, 3);
                const day = dateParts[3];
                const year = dateParts[4];
                const time = `${dateParts[5]}:${dateParts[6]} ${dateParts[7]}`;
                formattedDate = `${dateParts[1].substring(0, 3)}, ${month} ${day}, ${year} at ${time}`;
            }
            
            // Extract body content - everything after the subject line
            const bodyStartIndex = emailContent.indexOf(subject) + subject.length;
            let bodyContent = emailContent.substring(bodyStartIndex).trim();
            
            // Format the reformatted email with a placeholder for new recipient
            // In a real application, you'd have a field for the user to enter this
            const reformattedEmail = 
`From: ${fullName} <${originalRecipient}> 
Sent: ${sentDateTime}
To: [ENTER_RECIPIENT_EMAIL]
Subject: Fwd: ${subject}


---------- Forwarded message ---------
From: <${senderEmail}>
Date: ${formattedDate}
Subject: ${subject}
To: <${originalRecipient}>

${bodyContent}`;

            return reformattedEmail;
        } catch (error) {
            console.error("Error reformatting email:", error);
            return "Error: Could not parse the email format. Please make sure you've pasted the entire email with headers.";
        }
    }
});
