/**
 * FAHMID SHEHAB COACHING - Professional Lead Capture Script
 * Features: Ajax Submission, Toast Notifications, and Button State Handling
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');

    // 1. FORM SUBMISSION HANDLER
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Start Loading State
        setLoading(true);

        // Prepare Data
        const formData = new FormData(form);

        // 2. SEND DATA TO GOOGLE APPS SCRIPT
        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (data.result === 'success') {
                // Success Scenario
                showToast("✅ Details sent successfully!");
                form.reset();
            } else {
                // Script error scenario
                showToast("❌ Error: " + (data.message || "Submission failed"), true);
            }
        })
        .catch(error => {
            // Connection/Network error scenario
            console.error('Error:', error);
            showToast("❌ Connection error. Please try again.", true);
        })
        .finally(() => {
            // Stop Loading State
            setLoading(false);
        });
    });

    /**
     * Helper: Manages the visual state of the submit button
     */
    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.7";
            submitBtn.innerHTML = `
                <span style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="animation: spin 1s linear infinite;">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="white" stroke-width="4" stroke-dasharray="31.4" opacity="0.3"></circle>
                        <path d="M12 2a10 10 0 0 1 10 10" fill="none" stroke="white" stroke-width="4" stroke-linecap="round"></path>
                    </svg>
                    Sending...
                </span>
            `;
        } else {
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
            submitBtn.innerHTML = "Send Details";
        }
    }

    /**
     * Helper: Triggers the Premium Toast Notification (matches CSS section 7)
     */
    function showToast(message, isError = false) {
        // Create toast element if it doesn't exist
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }

        // Set content and style
        toast.textContent = message;
        toast.style.background = isError ? "#e74c3c" : "#1a1a1a";
        
        // Trigger CSS animation (defined in your style.css as .toast.show)
        toast.classList.add('show');

        // Remove toast after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
});

// Adding the missing spinner animation keyframes via JS for convenience
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
