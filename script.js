// --- Menu déroulant ---
document.querySelectorAll('.dropdown-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const content = btn.nextElementSibling;
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });
});

// --- Copy + code selection + visual feedback ---
(function () {
    function showTooltip(tooltipEl) {
        if (!tooltipEl) return;
        tooltipEl.classList.add('show');
        setTimeout(() => tooltipEl.classList.remove('show'), 1400);
    }

    function selectCodeText(codeEl) {
        try {
            const range = document.createRange();
            range.selectNodeContents(codeEl);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } catch (e) { }
    }

    function copyText(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        } else {
            return new Promise((res, rej) => {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                try {
                    document.execCommand('copy');
                    document.body.removeChild(ta);
                    res();
                } catch (err) {
                    document.body.removeChild(ta);
                    rej(err);
                }
            });
        }
    }

    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('data-target');
            const codeEl = document.getElementById(targetId);
            if (!codeEl) return;
            const text = codeEl.innerText || codeEl.textContent;
            copyText(text).then(() => {
                const tooltip = btn.parentElement.querySelector('.copy-tooltip');
                showTooltip(tooltip);
            }).catch(() => selectCodeText(codeEl));

            const container = btn.closest('.code-container');
            if (container) {
                container.classList.add('active');
                setTimeout(() => container.classList.remove('active'), 1800);
            }
        });
    });

    document.querySelectorAll('.code-container').forEach(container => {
        container.addEventListener('click', (e) => {
            if (e.target.closest('.copy-btn')) return;
            const codeEl = container.querySelector('code');
            if (!codeEl) return;
            selectCodeText(codeEl);
            container.classList.add('active');
            clearTimeout(container._activeTimeout);
            container._activeTimeout = setTimeout(() => {
                container.classList.remove('active');
                const sel = window.getSelection();
                if (sel) sel.removeAllRanges();
            }, 2000);
        });
        container.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                container.click();
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.code-container') && !e.target.closest('.copy-btn')) {
            document.querySelectorAll('.code-container.active').forEach(c => {
                c.classList.remove('active');
            });
            const sel = window.getSelection();
            if (sel) sel.removeAllRanges();
        }
    });
})();
