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
            // Extract the original sender's email (from first From: line)
            const originalSenderMatch = emailContent.match(/^From: [^<]*<([^>]+)>/m);
            if (!originalSenderMatch) throw new Error("Couldn't find original sender email");
            const originalSenderEmail = originalSenderMatch[1].trim();
            
            // Find the forwarded email section (the inner email)
            const innerEmailMatch = emailContent.match(/From: [^\n]+On Behalf Of ([^\n\r]+)\r?\nSent: ([^\n\r]+)\r?\nTo: ([^\n\r]+)\r?\nSubject: ([^\n\r]+)/);
            
            if (!innerEmailMatch) throw new Error("Couldn't parse the forwarded email");
            
            const actualSender = innerEmailMatch[1].trim();
            const sentDateTime = innerEmailMatch[2].trim();
            const recipientEmail = innerEmailMatch[3].trim();
            const subject = innerEmailMatch[4].trim();
            
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
            const bodyStartIndex = emailContent.indexOf("Dear Debrah,");
            if (bodyStartIndex === -1) throw new Error("Couldn't find email body");
            const bodyContent = emailContent.substring(bodyStartIndex);
            
            // Format the new email
            const reformattedEmail = 
`From: ${fullName} ${recipientEmail} 
Sent: ${sentDateTime}
To: ${originalSenderEmail}
Subject: Fwd: ${subject}


---------- Forwarded message ---------
From: ${actualSender}
Date: ${formattedDate}
Subject: ${subject}
To: ${recipientEmail}

${bodyContent}`;

            return reformattedEmail;
        } catch (error) {
            console.error("Error reformatting email:", error);
            return "Error: Could not parse the email format. Please make sure you've pasted the entire email with headers.";
        }
    }
});
