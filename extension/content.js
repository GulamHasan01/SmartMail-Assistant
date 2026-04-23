const API_URL = "https://smartmail-backend-p35t.onrender.com/api/email/generate";

function createAIButton() {
    const button = document.createElement('div');
    button.innerText = 'AI Reply';
    button.className = 'ai-reply-button';

    button.style.marginLeft = '10px';
    button.style.padding = '6px 12px';
    button.style.backgroundColor = '#0b57d0';
    button.style.color = 'white';
    button.style.borderRadius = '18px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '13px';
    button.style.fontWeight = '500';
    button.style.display = 'inline-flex';
    button.style.alignItems = 'center';
    button.style.zIndex = '999';

    return button;
}

function getEmailContent() {
    const selectors = [
        '.a3s.aiL',
        '.h7',
        '.gmail_quote',
        '[role="presentation"]',
        '.ii.gt'
    ];

    for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el && el.innerText.trim()) {
            return el.innerText.trim();
        }
    }
    return '';
}

function findComposeToolbar() {
    const selectors = [
        '.btC',
        '.IZ',
        '[role="toolbar"]'
    ];

    for (const selector of selectors) {
        const toolbars = document.querySelectorAll(selector);
        if (toolbars.length > 0) {
            return toolbars[toolbars.length - 1];
        }
    }
    return null;
}

async function handleButtonClick(button) {
    try {
        const emailContent = getEmailContent();
        if (!emailContent) {
            alert("No email content found to reply to.");
            return;
        }

        button.innerText = 'Generating...';
        button.style.pointerEvents = 'none';
        button.style.opacity = '0.6';

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                emailContent: emailContent,
                tone: "professional"
            })
        });

        if (!response.ok) throw new Error("API failed");

        const result = await response.text();
        const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');

        if (composeBox) {
            composeBox.focus();
            document.execCommand('insertText', false, result);
        } else {
            alert("Could not find the typing area.");
        }

    } catch (err) {
        console.error(err);
        alert("Failed to generate reply.");
    } finally {
        button.innerText = 'AI Reply';
        button.style.pointerEvents = 'auto';
        button.style.opacity = '1';
    }
}

function injectButton() {
    const toolbar = findComposeToolbar();
    if (!toolbar || toolbar.querySelector('.ai-reply-button')) return;

    const button = createAIButton();
    button.addEventListener('click', () => handleButtonClick(button));

    const sendBtnContainer = toolbar.querySelector('.dC');
    if (sendBtnContainer) {
        sendBtnContainer.parentElement.appendChild(button);
    } else {
        toolbar.appendChild(button);
    }
}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
            injectButton();
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

injectButton();