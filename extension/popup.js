// popup.js
const API_BASE_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', async () => {
    // Views
    const loginView = document.getElementById('login-view');
    const mainView = document.getElementById('main-view');
    
    // Auth Elements
    const authTitle = document.getElementById('auth-title');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const loginBtn = document.getElementById('login-btn');
    const toggleAuth = document.getElementById('toggle-auth');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Dashboard Elements
    const displayUsername = document.getElementById('display-username');
    const selectedTextEl = document.getElementById('selected-text');
    const sourceUrlEl = document.getElementById('source-url');
    const pageTitleEl = document.getElementById('page-title');
    const projectDropdown = document.getElementById('project-dropdown');
    const saveBtn = document.getElementById('save-btn');
    const dashboardBtnTop = document.getElementById('dashboard-btn-top');
    const dashboardLinkBtn = document.getElementById('dashboard-link-btn');
    const aiResultArea = document.getElementById('ai-result-area');
    const aiResultText = document.getElementById('ai-result-text');
    const researchScan = document.getElementById('research-scan');
    const statusMsg = document.getElementById('status-msg');
    const loader = document.getElementById('loader');

    let isRegisterMode = false;

    // --- Auth Logic ---

    const checkAuth = () => {
        chrome.storage.local.get(['token', 'userEmail'], (result) => {
            if (result.token) {
                showView('main');
                displayUsername.textContent = result.userEmail.split('@')[0];
                fetchProjects();
                autoFillContent();
            } else {
                showView('login');
            }
        });
    };

    const showView = (view) => {
        if (view === 'main') {
            mainView.classList.remove('hidden');
            loginView.classList.add('hidden');
        } else {
            mainView.classList.add('hidden');
            loginView.classList.remove('hidden');
        }
    };

    toggleAuth.addEventListener('click', () => {
        isRegisterMode = !isRegisterMode;
        authTitle.textContent = isRegisterMode ? 'Create Account' : 'Welcome Back';
        loginBtn.textContent = isRegisterMode ? 'Sign Up' : 'Login';
        toggleAuth.textContent = isRegisterMode ? 'Login' : 'Sign Up';
    });

    loginBtn.addEventListener('click', async () => {
        const email = loginEmail.value.trim();
        const password = loginPassword.value.trim();

        if (!email || !password) {
            showStatus('Email and password required', 'error');
            return;
        }

        setLoading(true);
        const endpoint = isRegisterMode ? '/auth/register' : '/auth/login';

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                chrome.storage.local.set({ token: data.token, userEmail: data.user.email }, () => {
                    showStatus(isRegisterMode ? 'Account created!' : 'Logged in!', 'success');
                    checkAuth();
                });
            } else {
                showStatus(data.message || 'Auth failed', 'error');
            }
        } catch (err) {
            showStatus('Server error', 'error');
        } finally {
            setLoading(false);
        }
    });

    logoutBtn.addEventListener('click', () => {
        chrome.storage.local.remove(['token', 'userEmail'], () => {
            showStatus('Logged out', 'success');
            checkAuth();
        });
    });

    // --- Dashboard Logic ---

    const autoFillContent = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab) {
                sourceUrlEl.value = activeTab.url || '';
                pageTitleEl.value = activeTab.title || '';
            }

            chrome.storage.local.get(['selectedText', 'sourceUrl', 'pageTitle'], (result) => {
                if (result.selectedText) selectedTextEl.value = result.selectedText;
                if (result.sourceUrl) sourceUrlEl.value = result.sourceUrl;
                if (result.pageTitle) pageTitleEl.value = result.pageTitle;
                updateValidation();
            });
        });
    };

    const fetchProjects = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/projects`);
            const projects = await response.json();

            projectDropdown.innerHTML = '<option value="" disabled selected>Select a project</option>';
            if (projects.length === 0) {
                projectDropdown.innerHTML = '<option value="" disabled>No projects found</option>';
            } else {
                projects.forEach(project => {
                    const option = document.createElement('option');
                    option.value = project._id;
                    option.textContent = project.name;
                    projectDropdown.appendChild(option);
                });
            }
        } catch (error) {
            projectDropdown.innerHTML = '<option value="" disabled>Error loading projects</option>';
        } finally {
            updateValidation();
        }
    };

    const updateValidation = () => {
        const text = selectedTextEl.value.trim();
        const projectId = projectDropdown.value;
        saveBtn.disabled = !text || !projectId;
        saveBtn.style.opacity = (!text || !projectId) ? '0.5' : '1';
    };

    selectedTextEl.addEventListener('input', updateValidation);
    projectDropdown.addEventListener('change', updateValidation);

    saveBtn.addEventListener('click', async () => {
        const text = selectedTextEl.value.trim();
        const projectId = projectDropdown.value;
        const sourceUrl = sourceUrlEl.value;
        const pageTitle = pageTitleEl.value;

        if (!text || !projectId) return;

        setLoading(true);
        aiResultArea.classList.add('hidden');
        researchScan.classList.remove('hidden');

        try {
            const response = await fetch(`${API_BASE_URL}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, projectId, sourceUrl, pageTitle })
            });

            const data = await response.json();

            if (data.success) {
                setTimeout(() => {
                    researchScan.classList.add('hidden');
                    showStatus('Research complete!', 'success');
                    
                    let resultHtml = `<strong>${data.result || 'New feature ✅'}</strong>`;
                    if (data.matchedContext) {
                        resultHtml += `<div style="font-size: 0.75rem; margin-top: 8px; color: #94a3b8; font-style: italic; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px;">
                            Matched Context: "${data.matchedContext.substring(0, 120)}..."
                        </div>`;
                    }
                    aiResultText.innerHTML = resultHtml;
                    aiResultArea.classList.remove('hidden');
                    
                    chrome.storage.local.remove(['selectedText', 'sourceUrl', 'pageTitle']);
                    updateValidation();
                }, 1500);
            } else {
                researchScan.classList.add('hidden');
                showStatus(data.message || 'Failed to save', 'error');
            }
        } catch (err) {
            researchScan.classList.add('hidden');
            showStatus('Server error', 'error');
        } finally {
            setLoading(false);
        }
    });

    const openDashboard = () => {
        chrome.tabs.create({ url: 'http://localhost:5173/messages' });
    };

    dashboardBtnTop.addEventListener('click', openDashboard);
    dashboardLinkBtn.addEventListener('click', openDashboard);

    function showStatus(msg, type) {
        statusMsg.textContent = msg;
        statusMsg.style.color = type === 'success' ? '#10b981' : '#ef4444';
        setTimeout(() => { statusMsg.textContent = ''; }, 3000);
    }

    function setLoading(isLoading) {
        if (isLoading) {
            loader.classList.remove('hidden');
            if (mainView.classList.contains('hidden')) loginBtn.disabled = true;
            else saveBtn.disabled = true;
        } else {
            loader.classList.add('hidden');
            loginBtn.disabled = false;
            updateValidation();
        }
    }

    // Initialize
    checkAuth();
});
