/**
 * Vaporwave-Themed Password Protection Script
 * For AM YISRAEL CHAI team use only
 */
(function() {
    // Create and inject the CSS
    const style = document.createElement('style');
    style.textContent = `
        /* Vaporwave color palette */
        :root {
            --primary-pink: #ff71ce;
            --primary-blue: #01cdfe;
            --primary-purple: #b967ff;
            --primary-yellow: #fffb96;
            --primary-cyan: #05ffa1;
            --dark-bg: #120458;
            --light-bg: #1a0933;
        }
        
        .password-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--dark-bg), var(--light-bg));
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            font-family: 'Helvetica', 'Arial', sans-serif;
        }
        
        .grid-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: linear-gradient(var(--primary-blue) 1px, transparent 1px),
                              linear-gradient(90deg, var(--primary-blue) 1px, transparent 1px);
            background-size: 40px 40px;
            background-position: -1px -1px;
            opacity: 0.1;
            z-index: -1;
        }
        
        .password-container {
            background-color: rgba(0, 0, 0, 0.4);
            padding: 2rem;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 0 20px var(--primary-blue), 0 0 40px var(--primary-purple);
            border: 1px solid var(--primary-blue);
            text-align: center;
            position: relative;
        }
        
        .password-container::before {
            content: "";
            position: absolute;
            top: -5px;
            left: -5px;
            right: -5px;
            bottom: -5px;
            border: 2px solid var(--primary-pink);
            border-radius: 12px;
            pointer-events: none;
        }
        
        .password-title {
            color: var(--primary-yellow);
            margin-bottom: 1rem;
            font-size: 2.5rem;
            text-shadow: 3px 3px 0 var(--primary-pink),
                         6px 6px 0 rgba(185, 103, 255, 0.5);
            letter-spacing: 2px;
        }
        
        .password-subtitle {
            color: var(--primary-cyan);
            margin-bottom: 2rem;
            font-size: 1.2rem;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .warning-box {
            background-color: rgba(255, 113, 206, 0.2);
            padding: 1rem;
            border-radius: 5px;
            margin-bottom: 2rem;
            color: white;
            font-size: 0.9rem;
            border-left: 4px solid var(--primary-pink);
        }
        
        .warning-box strong {
            color: var(--primary-yellow);
            display: block;
            margin-bottom: 0.5rem;
            font-size: 1.1rem;
        }
        
        .password-input {
            background-color: rgba(255, 255, 255, 0.1);
            border: 2px solid var(--primary-blue);
            color: white;
            padding: 0.8rem 1.5rem;
            margin-bottom: 1rem;
            border-radius: 5px;
            width: 80%;
            font-size: 1.1rem;
            text-align: center;
            outline: none;
            transition: all 0.3s ease;
        }
        
        .password-input:focus {
            border-color: var(--primary-cyan);
            box-shadow: 0 0 15px var(--primary-cyan);
        }
        
        .password-button {
            background: linear-gradient(90deg, var(--primary-blue), var(--primary-purple));
            color: white;
            border: none;
            padding: 0.8rem 2rem;
            border-radius: 5px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 0.5rem;
            font-weight: bold;
        }
        
        .password-button:hover {
            box-shadow: 0 0 15px var(--primary-blue);
            transform: translateY(-2px);
        }
        
        .error-message {
            color: var(--primary-pink);
            margin-top: 1rem;
            font-size: 0.9rem;
            min-height: 20px;
        }
        
        .hebrew-text {
            position: absolute;
            top: 20px;
            right: 20px;
            color: var(--primary-yellow);
            font-size: 1.5rem;
            opacity: 0.7;
        }
    `;
    document.head.appendChild(style);

    // Check if the user is already authenticated
    if (sessionStorage.getItem('authenticated') === 'true') {
        return; // Skip creating the password overlay
    }

    // Create the HTML elements
    const overlay = document.createElement('div');
    overlay.className = 'password-overlay';
    overlay.id = 'passwordOverlay';

    overlay.innerHTML = `
        <div class="grid-background"></div>
        <div class="hebrew-text">בסייעתא דשמיא</div>
        <div class="password-container">
            <h1 class="password-title">SECURE ACCESS</h1>
            <h2 class="password-subtitle">AM YISRAEL CHAI</h2>
            
            <div class="warning-box">
                <strong>AUTHORIZED PERSONNEL ONLY</strong>
                This tool is exclusively for Team Members of AM YISRAEL CHAI Slate program. 
                Unauthorized access is prohibited. All activity is tracked and monitored.
            </div>
            
            <input type="password" id="passwordInput" class="password-input" placeholder="Enter Password" autofocus>
            <button id="submitPassword" class="password-button">ENTER</button>
            <div class="error-message" id="errorMessage"></div>
        </div>
    `;

    // Append to body once DOM is loaded
    if (document.body) {
        document.body.appendChild(overlay);
        initializePasswordProtection();
    } else {
        window.addEventListener('DOMContentLoaded', function() {
            document.body.appendChild(overlay);
            initializePasswordProtection();
        });
    }

    // Initialize password protection functionality
    function initializePasswordProtection() {
        const passwordInput = document.getElementById('passwordInput');
        const submitButton = document.getElementById('submitPassword');
        const errorMessage = document.getElementById('errorMessage');
        
        
        const encodedCorrectPassword = "dGhlcm9hZHRvNTAwMA==";
        
        // Function to check password
        function checkPassword() {
            const enteredPassword = passwordInput.value;
            
            // Encode the input password to base64
            const encodedInput = btoa(enteredPassword);
            
            if (encodedInput === encodedCorrectPassword) {
                // Password is correct, remove the overlay
                overlay.style.transition = "opacity 0.5s ease";
                overlay.style.opacity = "0";
                setTimeout(() => {
                    overlay.style.display = "none";
                }, 500);
                
                // Save in session storage to remember that user is logged in
                sessionStorage.setItem('authenticated', 'true');
                
                // Dispatch event to signal authentication is complete
                const authEvent = new Event('passwordAuthenticated');
                document.dispatchEvent(authEvent);
                
                // Log successful access
                console.log("Access granted: " + new Date().toISOString());
            } else {
                // Password is incorrect, show error
                errorMessage.textContent = "Incorrect password. Please try again.";
                passwordInput.value = "";
                passwordInput.focus();
                
                // Log attempt
                console.log("Incorrect password attempt: " + new Date().toISOString());
            }
        }
        
        // Add event listeners
        submitButton.addEventListener('click', checkPassword);
        passwordInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                checkPassword();
            }
        });
    }
})();
