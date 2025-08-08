# API-Automator-XLS

API-Automator-XLS is a Node.js-based framework that automates API testing from an Excel file.  
It executes tests using [Newman](https://www.npmjs.com/package/newman), generates **HTML reports**, **Allure reports**, and an **Excel output with Pass/Fail coloring**.

---
## 🚀 Features
- **Excel-driven** – Write your test cases in an Excel sheet.
- **Automatic Execution** – Runs all APIs without touching Postman manually.
- **Detailed Reporting**:
  - 📊 **HTML** (htmlextra) report
  - 📈 **Allure** interactive dashboard
  - 📗 **Excel** output with colored Pass/Fail results
- **Time-stamped Reports** – Every run is saved in a new file/folder.

---

## 📂 Project Structure
📦 API-Automator-XLS
┣ 📜 run_api_tests.js # Main runner script
┣ 📜 api_test_cases.xlsx # Your test cases
┣ 📂 reports/ # Generated HTML & Excel reports
┣ 📂 allure-results-* # Allure raw results
┣ 📂 allure-report-* # Allure HTML reports
┣ 📜 package.json
┗ 📜 README.md

---

## **📌 What You Should Include in Repo**
- **Code**: `run_api_tests.js`
- **Sample Excel**: `api_test_cases.xlsx`
- **Docs Folder**: `docs/` with screenshots of HTML, Allure, and Excel outputs
- **README.md**: as above
- **package.json** with dependencies

---
1️⃣ Installation & Setup

## 🛠 Installation & Setup

### Prerequisites
- Node.js (v14+ recommended)
- npm (comes with Node.js)
- Allure Commandline (`npm install -g allure-commandline --save-dev` or [download](https://docs.qameta.io/allure/))

### Install Dependencies
```bash
npm install

---

#2️⃣ How to Run
Explain the command to run tests:
node run_api_tests.js

#What happens:
Reads api_test_cases.xlsx
Builds a Postman collection dynamically
Executes via Newman
Generates:
HTML Report → reports/report_<timestamp>.html
Allure Report → allure-report-<timestamp>/
Excel Output → reports/api_test_results_<timestamp>.xlsx
---
#3️⃣ Excel Format Guide
People need to know **how to write test cases**:
```markdown
## 📝 Excel Test Case Format

| API_Name         | Method | URL                                      | Expected_Status_Code | Expected_Time_ms |
|------------------|--------|------------------------------------------|----------------------|------------------|
| Get Posts        | GET    | https://jsonplaceholder.typicode.com/posts | 200                  | 1000             |
| Get Weather      | GET    | https://api.open-meteo.com/v1/forecast?... | 200                  | 2000             |

#Columns:

API_Name – Name for reporting
Method – GET / POST / PUT / DELETE
URL – Full endpoint URL
Expected_Status_Code – Expected HTTP status code
Expected_Time_ms – Max allowed response time (in milliseconds)

##4️⃣ Reports Preview

## 📸 Sample Reports

**HTML Report**
![HTML Report](./reports/report_2025-08-08T06-46-14-326Z.html)

**Allure Report**
![Allure Report](./allure-report-2025-08-08T06-46-14-326Z)

**Excel Output**
![Excel Output](./reports/api_test_results_2025-08-08T06-46-14-326Z.xlsx)

##5️⃣ Contribution & License

## 🤝 Contribution
PRs welcome! Please fork and submit pull requests with clear commit messages.

## 📄 License
MIT License
