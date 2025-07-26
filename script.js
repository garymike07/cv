// CareerCraft AI Clone - JavaScript Functionality

class CareerCraftApp {
    constructor() {
        this.currentStep = 1;
        this.userData = {
            name: '',
            cvFile: null,
            jobDetails: {},
            progress: 0
        };
        
        this.init();
    }

    init() {
        this.updateTime();
        this.setupEventListeners();
        this.loadUserData();
        
        // Update time every second
        setInterval(() => this.updateTime(), 1000);
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: true,
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const timeDisplay = document.getElementById('timeDisplay');
        if (timeDisplay) {
            timeDisplay.textContent = timeString;
        }
    }

    setupEventListeners() {
        // Name confirmation
        const confirmNameBtn = document.getElementById('confirmNameBtn');
        const userNameInput = document.getElementById('userName');
        
        if (confirmNameBtn && userNameInput) {
            confirmNameBtn.addEventListener('click', () => this.confirmName());
            userNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.confirmName();
            });
        }

        // CV file upload
        const chooseCvBtn = document.getElementById('chooseCvBtn');
        const cvFileInput = document.getElementById('cvFileInput');
        const cvUploadArea = document.getElementById('cvUploadArea');
        
        if (chooseCvBtn && cvFileInput) {
            chooseCvBtn.addEventListener('click', () => cvFileInput.click());
            cvFileInput.addEventListener('change', (e) => this.handleCvUpload(e));
        }

        if (cvUploadArea) {
            cvUploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            cvUploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            cvUploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        }

        // Screenshot upload
        const addScreenshotsBtn = document.getElementById('addScreenshotsBtn');
        const screenshotFileInput = document.getElementById('screenshotFileInput');
        const screenshotUpload = document.getElementById('screenshotUpload');
        
        if (addScreenshotsBtn && screenshotFileInput) {
            addScreenshotsBtn.addEventListener('click', () => screenshotFileInput.click());
            screenshotFileInput.addEventListener('change', (e) => this.handleScreenshotUpload(e));
        }

        if (screenshotUpload) {
            screenshotUpload.addEventListener('dragover', (e) => this.handleDragOver(e));
            screenshotUpload.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            screenshotUpload.addEventListener('drop', (e) => this.handleScreenshotDrop(e));
        }

        // Job details choice buttons
        const chooseScreenshotBtn = document.getElementById("chooseScreenshot");
        const chooseManualBtn = document.getElementById("chooseManual");

        if (chooseScreenshotBtn) {
            chooseScreenshotBtn.addEventListener("click", () => this.showScreenshotUploadSection());
        }

        if (chooseManualBtn) {
            chooseManualBtn.addEventListener("click", () => this.showJobForm());
        }

        // Form actions
        const confirmContinueBtn = document.getElementById("confirmContinue");
        const backToChoiceBtn = document.getElementById("backToChoice");
            confirmContinueBtn.addEventListener('click', () => this.proceedToGenerate());
        }
        
        if (backToChoiceBtn) {
            backToChoiceBtn.addEventListener('click', () => this.showStep(2));
        }

        // Upload different CV
        const uploadDifferentCv = document.getElementById('uploadDifferentCv');
        if (uploadDifferentCv) {
            uploadDifferentCv.addEventListener('click', () => this.resetCvUpload());
        }

        // Edit buttons
        const editStep1 = document.getElementById('editStep1');
        if (editStep1) {
            editStep1.addEventListener('click', () => this.editStep(1));
        }
    }

    confirmName() {
        const userNameInput = document.getElementById('userName');
        const name = userNameInput.value.trim();
        
        if (name) {
            this.userData.name = name;
            this.saveUserData();
            
            // Update greeting
            const personalGreeting = document.getElementById('personalGreeting');
            const timeOfDay = this.getTimeOfDay();
            if (personalGreeting) {
                personalGreeting.textContent = `Good ${timeOfDay}, ${name}!`;
            }
            
            // Hide welcome section and show app
            const welcomeSection = document.getElementById('welcomeSection');
            const appContainer = document.getElementById('appContainer');
            
            if (welcomeSection && appContainer) {
                welcomeSection.style.display = 'none';
                appContainer.style.display = 'block';
            }
            
            this.showNotification('Welcome! Let\'s get started with your CV.');
        }
    }

    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Morning';
        if (hour < 17) return 'Afternoon';
        return 'Evening';
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processCvFile(files[0]);
        }
    }

    handleScreenshotDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processScreenshotFiles(files);
        }
    }

    handleCvUpload(e) {
        const file = e.target.files[0];
        if (file) {
            this.processCvFile(file);
        }
    }

    handleScreenshotUpload(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.processScreenshotFiles(files);
        }
    }

    processCvFile(file) {
        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            this.showNotification('Please upload a PDF, DOC, or DOCX file.', 'error');
            return;
        }

        this.userData.cvFile = {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
        };

        // Simulate CV processing
        this.showNotification('Processing CV...', 'info');
        
        setTimeout(() => {
            this.showUploadedCv(file.name);
            this.completeStep(1);
            this.showStep(2);
            this.showNotification('CV Processed - Your CV details have been successfully extracted.', 'success');
        }, 2000);
    }

    processScreenshotFiles(files) {
        this.showNotification('Processing job description screenshots...', 'info');
        
        // Show processing status
        const processingStatus = document.getElementById('processingStatus');
        if (processingStatus) {
            processingStatus.style.display = 'block';
        }

        // Simulate analysis progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress > 100) progress = 100;
            
            const progressFill = document.getElementById('analysisProgress');
            const progressPercent = document.getElementById('progressPercent');
            
            if (progressFill) progressFill.style.width = `${progress}%`;
            if (progressPercent) progressPercent.textContent = `${Math.round(progress)}%`;
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                setTimeout(() => {
                    this.showJobForm();
                    this.autoFillJobForm();
                }, 1000);
            }
        }, 200);
    }

    showUploadedCv(fileName) {
        const cvUploadArea = document.getElementById('cvUploadArea');
        const uploadedCv = document.getElementById('uploadedCv');
        const cvFileName = document.getElementById('cvFileName');
        
        if (cvUploadArea && uploadedCv && cvFileName) {
            cvUploadArea.style.display = 'none';
            uploadedCv.style.display = 'block';
            cvFileName.textContent = fileName;
        }
    }

    showJobForm() {
        const processingStatus = document.getElementById('processingStatus');
        const jobForm = document.getElementById('jobForm');
        
        if (processingStatus) processingStatus.style.display = 'none';
        if (jobForm) jobForm.style.display = 'block';
    }

    autoFillJobForm() {
        // Simulate auto-filling form with extracted data
        const sampleData = {
            jobTitle: 'Senior Software Developer',
            company: 'Tech Corp',
            companyAddress: '123 Tech Street, San Francisco, CA 94105',
            experienceLevel: 'senior',
            jobType: 'full-time',
            location: 'San Francisco, CA',
            salaryRange: '$120,000 - $150,000',
            workArrangement: 'hybrid',
            requiredSkills: '5+ years of experience in software development, Proficiency with React and Node.js, Experience with Python',
            keyResponsibilities: 'Design, develop, and maintain scalable software solutions. Collaborate with cross-functional teams. Lead technical discussions and code reviews.',
            qualifications: 'Bachelor\'s degree in Computer Science or related field. Strong background in web application development. Experience with modern development frameworks.',
            additionalBenefits: 'Health insurance, 401k matching, flexible work arrangements, professional development opportunities'
        };

        // Fill form fields
        Object.keys(sampleData).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = sampleData[key];
                this.userData.jobDetails[key] = sampleData[key];
            }
        });

        this.showNotification('Job details extracted and form auto-filled!', 'success');
    }

    proceedToGenerate() {
        // Collect form data
        const formElements = document.querySelectorAll('#jobForm input, #jobForm select, #jobForm textarea');
        formElements.forEach(element => {
            if (element.value) {
                this.userData.jobDetails[element.id] = element.value;
            }
        });

        this.saveUserData();
        this.completeStep(2);
        this.showStep(3);
        
        // Simulate document generation
        setTimeout(() => {
            this.completeStep(3);
            this.showStep(4);
            this.showNotification('Documents generated successfully!', 'success');
        }, 3000);
    }

    showStep(stepNumber) {
        // Hide all steps
        for (let i = 1; i <= 4; i++) {
            const step = document.getElementById(`step${i}`);
            if (step) {
                step.style.display = i === stepNumber ? 'block' : 'none';
            }
        }
        
        this.currentStep = stepNumber;
        this.updateProgressDisplay();
    }

    completeStep(stepNumber) {
        const progressStep = document.getElementById(`progressStep${stepNumber}`);
        const stepTime = document.getElementById(`step${stepNumber}Time`);
        
        if (progressStep) {
            progressStep.classList.add('completed');
            progressStep.classList.remove('active');
        }
        
        if (stepTime) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour12: true,
                hour: 'numeric',
                minute: '2-digit'
            });
            stepTime.textContent = `Completed: ${timeString}`;
            stepTime.style.display = 'block';
        }
        
        // Update progress percentage
        this.userData.progress = stepNumber * 25;
        this.updateProgressDisplay();
        this.saveUserData();
    }

    updateProgressDisplay() {
        const overallProgress = document.getElementById('overallProgress');
        const mainProgressFill = document.getElementById('mainProgressFill');
        
        if (overallProgress) {
            overallProgress.textContent = `${this.userData.progress}%`;
        }
        
        if (mainProgressFill) {
            mainProgressFill.style.width = `${this.userData.progress}%`;
        }
        
        // Update step states
        for (let i = 1; i <= 4; i++) {
            const progressStep = document.getElementById(`progressStep${i}`);
            if (progressStep) {
                progressStep.classList.remove('active', 'completed');
                
                if (i < this.currentStep) {
                    progressStep.classList.add('completed');
                } else if (i === this.currentStep) {
                    progressStep.classList.add('active');
                }
            }
        }
    }

    resetCvUpload() {
        const cvUploadArea = document.getElementById('cvUploadArea');
        const uploadedCv = document.getElementById('uploadedCv');
        
        if (cvUploadArea && uploadedCv) {
            cvUploadArea.style.display = 'block';
            uploadedCv.style.display = 'none';
        }
        
        this.userData.cvFile = null;
        this.saveUserData();
    }

    editStep(stepNumber) {
        this.showStep(stepNumber);
    }

    showNotification(message, type = 'success') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Add type-specific styling
        if (type === 'error') {
            notification.style.background = 'rgba(239, 68, 68, 0.9)';
        } else if (type === 'info') {
            notification.style.background = 'rgba(59, 130, 246, 0.9)';
        }
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    saveUserData() {
        localStorage.setItem('careerCraftUserData', JSON.stringify(this.userData));
    }

    loadUserData() {
        const savedData = localStorage.getItem('careerCraftUserData');
        if (savedData) {
            this.userData = { ...this.userData, ...JSON.parse(savedData) };
            
            // Restore UI state if user data exists
            if (this.userData.name) {
                const personalGreeting = document.getElementById('personalGreeting');
                const timeOfDay = this.getTimeOfDay();
                if (personalGreeting) {
                    personalGreeting.textContent = `Good ${timeOfDay}, ${this.userData.name}!`;
                }
                
                // Show app container
                const welcomeSection = document.getElementById('welcomeSection');
                const appContainer = document.getElementById('appContainer');
                
                if (welcomeSection && appContainer) {
                    welcomeSection.style.display = 'none';
                    appContainer.style.display = 'block';
                }
                
                // Restore CV upload state
                if (this.userData.cvFile) {
                    this.showUploadedCv(this.userData.cvFile.name);
                }
                
                // Update progress display
                this.updateProgressDisplay();
            }
        }
    }

    // Simulate document download
    downloadDocument(type) {
        const fileName = type === 'cv' ? 'Enhanced_CV.pdf' : 'Cover_Letter.pdf';
        this.showNotification(`Downloading ${fileName}...`, 'info');
        
        // Create a dummy download
        const link = document.createElement('a');
        link.href = 'data:text/plain;charset=utf-8,Sample document content';
        link.download = fileName;
        link.click();
    }

    // Clear all data (for testing)
    clearData() {
        localStorage.removeItem('careerCraftUserData');
        location.reload();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.careerCraftApp = new CareerCraftApp();
    
    // Add download functionality to buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('download-btn')) {
            const documentType = e.target.closest('.document-item').textContent.includes('CV') ? 'cv' : 'cover-letter';
            window.careerCraftApp.downloadDocument(documentType);
        }
    });
    
    // Add global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+Shift+C to clear data (for testing)
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            if (confirm('Clear all data and restart?')) {
                window.careerCraftApp.clearData();
            }
        }
    });
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CareerCraftApp;
}



    showScreenshotUploadSection() {
        const jobChoiceSection = document.getElementById("jobChoiceSection");
        const screenshotUploadSection = document.getElementById("screenshotUploadSection");
        
        if (jobChoiceSection && screenshotUploadSection) {
            jobChoiceSection.style.display = "none";
            screenshotUploadSection.style.display = "block";
        }
    }


