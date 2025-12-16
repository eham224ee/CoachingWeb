document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('contactForm');
    const submitButton = form.querySelector('.submit-btn'); // Get the button reference

    form.addEventListener('submit', function(e){
        e.preventDefault();
        
        // --- 1. Client-Side Validation ---
        const name = document.getElementById('name').value.trim();
        // NOTE: The ID is 'exam', but the NAME attribute in HTML is 'class'
        const exam = document.getElementById('exam').value.trim(); 
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();

        if(!name || !exam || !phone){
            showMessage('Please fill all required fields.', false);
            return;
        }
        const phoneDigits = phone.replace(/[^0-9]/g, '');
        if(phoneDigits.length < 8){
            showMessage('Please enter a valid phone number (at least 8 digits).', false);
            return;
        }
        if(email){
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailPattern.test(email)){
                showMessage('Please enter a valid email address.', false);
                return;
            }
        }
        // --- End Validation ---

        
        // --- 2. Start Submission Process ---
        const originalButtonText = submitButton.innerText;
        submitButton.innerText = 'Sending...';
        submitButton.disabled = true;

        const formURL = form.action; // Retrieves the Apps Script URL from the HTML action attribute
        const formData = new FormData(form); // Gathers data using the input NAME attributes (name, class, mail, phn)

        fetch(formURL, {
            method: 'POST',
            body: formData 
        })
        .then(response => {
            if (!response.ok) {
                // If the HTTP status is not 200 (e.g., 404, 500), throw an error
                throw new Error('Server response not OK: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Check the JSON response from the Google Apps Script
            if (data.result === 'success') {
                showMessage('Thanks! We will call you within 24 hours.', true);
                form.reset(); 
            } else {
                // This means the fetch succeeded, but the script failed internally
                showMessage('Submission error: Please check your Apps Script for errors.', false);
            }
        })
        .catch(error => {
            // This catches network errors or the error thrown above
            console.error('Submission failed:', error);
            showMessage('Connection error: Failed to reach the server. Please try again.', false);
        })
        .finally(() => {
            // 3. Restore Button State
            submitButton.innerText = originalButtonText;
            submitButton.disabled = false;
        });

    });

    // --- Message Notification Function ---
    function showMessage(text, success=false){
        let el = document.querySelector('.toast');
        if(!el){
            el = document.createElement('div');
            el.className = 'toast';
            document.body.appendChild(el);
        }
        el.textContent = text;
        el.style.background = success ? 'var(--accent)' : '#ef4444';
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        requestAnimationFrame(()=>{
            el.style.opacity='1';
            el.style.pointerEvents='auto';
        });
        setTimeout(()=>{ el.style.opacity = '0'; }, 2600);
    }
});
