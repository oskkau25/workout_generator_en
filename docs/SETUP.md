# 🚀 **Setup Guide - Workout Generator**

Complete setup instructions for the reorganized Workout Generator project with enhanced CI/CD pipeline.

## 📋 **Prerequisites**

### **Required Software**
- **Python 3.9+** - For CI/CD pipeline and testing
- **Git** - Version control
- **Modern Web Browser** - Chrome, Firefox, Safari, Edge
- **Text Editor/IDE** - VS Code, Sublime Text, or similar

### **System Requirements**
- **Operating System**: macOS, Linux, or Windows
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Storage**: 500MB free space
- **Network**: Internet connection for AI features and dependencies

## 🏗️ **Project Structure Overview**

```
workout_generator_en/
├── 📁 src/                    # Application source code
├── 📁 ci-cd/                  # CI/CD pipeline & automation
├── 📁 docs/                   # Documentation
├── 📁 .github/                # GitHub configuration
├── 📁 config/                 # Configuration files
├── 📁 reports/                # Generated reports
├── 📁 scripts/                # Utility scripts
└── 📁 assets/                 # Static assets
```

## 🚀 **Quick Setup (5 minutes)**

### **1. Clone Repository**
```bash
git clone https://github.com/your-username/workout_generator_en.git
cd workout_generator_en
```

### **2. Install Dependencies**
```bash
# Install Python dependencies
pip install -r ci-cd/requirements.txt

# Verify installation
python3 --version
pip --version
```

### **3. Start Application**
```bash
# Start local development server
python3 -m http.server 5173

# Open in browser: http://localhost:5173
```

### **4. Run Enhanced Pipeline**
```bash
# Test the enhanced CI/CD pipeline
python3 ci-cd/automated_test_pipeline.py --enhanced
```

## 🔧 **Detailed Setup Instructions**

### **Phase 1: Environment Setup**

#### **Python Environment**
```bash
# Check Python version
python3 --version

# If Python 3.9+ not available, install it:

# macOS (using Homebrew)
brew install python@3.11

# Ubuntu/Debian
sudo apt update
sudo apt install python3.11 python3-pip

# Windows (using Chocolatey)
choco install python311

# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### **Git Setup**
```bash
# Verify Git installation
git --version

# Configure Git (if first time)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Verify repository status
git status
```

### **Phase 2: Dependencies Installation**

#### **Python Dependencies**
```bash
# Install required packages
pip install -r ci-cd/requirements.txt

# Verify installations
python3 -c "import requests, json, pathlib; print('✅ Dependencies installed')"
```

#### **Node.js Dependencies (Optional)**
```bash
# If you want to use npm packages in the future
npm install
```

### **Phase 3: Configuration Setup**

#### **Pipeline Configuration**
```bash
# Check pipeline configuration
cat config/pipeline_config.json

# Verify app features
cat ci-cd/app_features.json
```

#### **Environment Variables**
```bash
# Create environment file (if needed)
cp .env.example .env

# Edit environment variables
nano .env
```

### **Phase 4: Development Tools Setup**

#### **Pre-commit Hooks**
```bash
# Install pre-commit hook
cp ci-cd/pre-commit-hook.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

# Verify installation
ls -la .git/hooks/pre-commit
```

#### **IDE Configuration**
```bash
# VS Code settings (create .vscode/settings.json)
mkdir -p .vscode
cat > .vscode/settings.json << EOF
{
    "python.defaultInterpreterPath": "./venv/bin/python",
    "python.linting.enabled": true,
    "python.formatting.provider": "black",
    "files.associations": {
        "*.py": "python",
        "*.js": "javascript",
        "*.html": "html"
    }
}
EOF
```

## 🧪 **Testing Your Setup**

### **1. Application Test**
```bash
# Start server
python3 -m http.server 5173

# In another terminal, test connectivity
curl http://localhost:5173

# Open browser and verify:
# ✅ Main page loads
# ✅ Workout form displays
# ✅ Equipment selection works
# ✅ Analytics dashboard accessible
```

### **2. Pipeline Test**
```bash
# Run enhanced pipeline
python3 ci-cd/automated_test_pipeline.py --enhanced

# Check results
cat reports/test_results/automated_test_results.json

# Verify expected output:
# ✅ Overall Status: PASSED or WARNING
# ✅ Success Rate: 85%+
# ✅ Security Score: 70+
```

### **3. Pre-commit Hook Test**
```bash
# Make a small change
echo "# Test comment" >> src/index.html

# Try to commit
git add src/index.html
git commit -m "Test commit"

# Should trigger pre-commit hook
# ✅ Pipeline runs automatically
# ✅ Quality checks pass
# ✅ Commit succeeds
```

## 🔍 **Troubleshooting Common Issues**

### **Python Issues**

#### **"Python3 command not found"**
```bash
# macOS
brew install python@3.11
ln -s /usr/local/bin/python3.11 /usr/local/bin/python3

# Linux
sudo apt install python3.11
sudo ln -s /usr/bin/python3.11 /usr/bin/python3

# Windows
# Download from python.org and add to PATH
```

#### **"pip command not found"**
```bash
# Install pip
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python3 get-pip.py

# Or use package manager
# macOS: brew install python@3.11
# Linux: sudo apt install python3-pip
```

### **Dependency Issues**

#### **"Module not found" errors**
```bash
# Reinstall dependencies
pip uninstall -r ci-cd/requirements.txt -y
pip install -r ci-cd/requirements.txt

# Check Python path
python3 -c "import sys; print(sys.path)"
```

#### **Version conflicts**
```bash
# Create fresh virtual environment
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r ci-cd/requirements.txt
```

### **Pipeline Issues**

#### **"File not found" errors**
```bash
# Check file structure
find . -name "*.py" -o -name "*.json" -o -name "*.html" -o -name "*.js"

# Verify paths in pipeline
grep -n "project_root" ci-cd/automated_test_pipeline.py
```

#### **Permission errors**
```bash
# Fix file permissions
chmod +x ci-cd/pre-commit-hook.sh
chmod +x .git/hooks/pre-commit

# Check file ownership
ls -la ci-cd/
ls -la .git/hooks/
```

### **Git Issues**

#### **Pre-commit hook not running**
```bash
# Verify hook installation
ls -la .git/hooks/pre-commit

# Check hook permissions
chmod +x .git/hooks/pre-commit

# Test hook manually
.git/hooks/pre-commit
```

#### **Hook fails with path errors**
```bash
# Update paths in hook
sed -i 's|automated_test_pipeline.py|ci-cd/automated_test_pipeline.py|g' ci-cd/pre-commit-hook.sh

# Reinstall hook
cp ci-cd/pre-commit-hook.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

## 📊 **Verification Checklist**

### **✅ Environment Setup**
- [ ] Python 3.9+ installed and accessible
- [ ] Git configured and working
- [ ] Virtual environment created (optional but recommended)
- [ ] Dependencies installed successfully

### **✅ Project Structure**
- [ ] All directories created correctly
- [ ] Files moved to appropriate locations
- [ ] Path references updated in pipeline
- [ ] Configuration files accessible

### **✅ Application Functionality**
- [ ] Local server starts without errors
- [ ] Main page loads in browser
- [ ] Workout form displays correctly
- [ ] Analytics dashboard accessible
- [ ] User account system working

### **✅ CI/CD Pipeline**
- [ ] Enhanced pipeline runs successfully
- [ ] Tests execute and report results
- [ ] Reports generated in correct locations
- [ ] Pre-commit hook triggers on commits
- [ ] Quality gates enforce standards

### **✅ Development Workflow**
- [ ] Can make changes to source files
- [ ] Pipeline detects changes correctly
- [ ] Tests run automatically on commit
- [ ] Quality checks pass before commit
- [ ] GitHub Actions workflow configured

## 🚀 **Next Steps**

### **1. Explore the Application**
- [ ] Try generating different workout types
- [ ] Test user account registration/login
- [ ] Explore analytics dashboard
- [ ] Test accessibility features

### **2. Understand the Pipeline**
- [ ] Read [Enhanced Pipeline Guide](ENHANCED_PIPELINE_README.md)
- [ ] Review [Feature Maintenance](FEATURE_MAINTENANCE.md)
- [ ] Check [Pipeline Updates](PIPELINE_AUTO_UPDATE_GUIDE.md)

### **3. Start Development**
- [ ] Make small changes to test workflow
- [ ] Run pipeline manually to understand process
- [ ] Check generated reports and metrics
- [ ] Experiment with different test modes

### **4. Contribute to the Project**
- [ ] Fork the repository
- [ ] Create feature branch
- [ ] Make improvements
- [ ] Submit pull request

## 📞 **Getting Help**

### **Documentation Resources**
- **Main README**: Project overview and quick start
- **Setup Guide**: This file - detailed setup instructions
- **Enhanced Pipeline Guide**: Complete CI/CD documentation
- **Feature Maintenance**: Adding and updating features
- **Pipeline Updates**: Pipeline maintenance and configuration

### **Support Channels**
- **GitHub Issues**: [Create Issue](https://github.com/your-repo/issues)
- **Documentation**: Check `docs/` directory first
- **Pipeline Logs**: Review `reports/logs/test_pipeline.log`
- **Test Results**: Check `reports/test_results/automated_test_results.json`

### **Common Commands Reference**
```bash
# Development
python3 -m http.server 5173                    # Start local server
python3 ci-cd/automated_test_pipeline.py --enhanced  # Run enhanced pipeline

# Git workflow
git add .                                       # Stage changes
git commit -m "Message"                         # Commit (triggers pipeline)
git push origin main                           # Push to remote

# Pipeline management
python3 ci-cd/automated_test_pipeline.py --help  # Show pipeline options
cat reports/test_results/automated_test_results.json  # View test results
cat reports/logs/test_pipeline.log              # View pipeline logs
```

---

## 🎉 **Setup Complete!**

Congratulations! You now have a fully configured Workout Generator development environment with:

- ✅ **Professional file structure** for scalability
- ✅ **Enhanced CI/CD pipeline** for quality assurance
- ✅ **Automated testing** for reliability
- ✅ **Comprehensive documentation** for guidance
- ✅ **Development tools** for productivity

**Ready to build amazing workouts? Start developing! 🚀**

For questions or issues, check the troubleshooting section above or create a GitHub issue.
