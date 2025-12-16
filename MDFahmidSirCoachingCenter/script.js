document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');
    const toast = document.getElementById('toast');

    // 1. Handle Form Submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Start Loading State
        setLoading(true);

        const formData = new FormData(form);

        // 2. API Call to Google Apps Script
        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.result === 'success') {
                showToast("✅ Details added to EhamDB!");
                form.reset();
            } else {
                showToast("❌ Error: " + data.message, true);
            }
        })
        .catch(err => {
            showToast("❌ Connection failed. Try again.", true);
        })
        .finally(() => {
            setLoading(false);
        });
    });

    // Helper: Manage Button Loading State
    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 2v4m0 12v4M4.22 4.22l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.22 19.78l2.83-2.83m8.48-8.48l2.83-2.83"></path></svg>
                    Sending...
                </span>`;
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Send Details";
        }
    }

    // Helper: Show Professional Toast
    function showToast(message, isError = false) {
        toast.innerText = message;
        toast.style.background = isError ? "#e74c3c" : "#1a1a1a";
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
});

// Injection of Spinner Animation for the Button
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes spin { to { transform: rotate(360deg); } }
    .spinner { animation: spin 1s linear infinite; }
`;
document.head.appendChild(styleSheet);
