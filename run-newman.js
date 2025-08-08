const newman = require('newman');
const xlsx = require('xlsx');
const ExcelJS = require('exceljs'); // for styling
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// 📅 Generate timestamp
const now = new Date();
const timestamp = now.toISOString().replace(/[:.]/g, '-');

// 1. Read Excel (input test cases)
const workbook = xlsx.readFile('./api_test_cases.xlsx');
const sheetName = workbook.SheetNames[0];
let testCases = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

let results = [];

// 2. Build Postman Collection from Excel
const collection = {
    info: {
        name: 'Excel-driven API Tests',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },
    item: testCases.map(tc => ({
        name: `${tc.API_Name} - ${tc.Test_Case}`,
        request: {
            method: tc.Method || 'GET',
            url: tc.URL
        },
        event: [
            {
                listen: 'test',
                script: {
                    exec: [
                        `pm.test("Status is ${tc.Expected_Status_Code}", function () {`,
                        `    pm.response.to.have.status(${tc.Expected_Status_Code});`,
                        `});`,
                        `pm.test("Response time < ${tc.Expected_Time_ms}ms", function () {`,
                        `    pm.expect(pm.response.responseTime).to.be.below(${tc.Expected_Time_ms});`,
                        `});`
                    ]
                }
            }
        ]
    }))
};

// Save temp collection
const tempCollectionPath = path.join(__dirname, `temp_collection_${timestamp}.json`);
fs.writeFileSync(tempCollectionPath, JSON.stringify(collection, null, 2));

// 📂 Create unique output directories
const htmlReportPath = `./reports/report_${timestamp}.html`;
const allureResultsDir = `./allure-results-${timestamp}`;
const allureReportDir = `./allure-report-${timestamp}`;
const excelOutputPath = `./reports/api_test_results_${timestamp}.xlsx`;

// 3. Run Newman with HTML + Allure + Capture Results
newman.run({
    collection: tempCollectionPath,
    reporters: ['cli', 'htmlextra', 'allure'],
    reporter: {
        htmlextra: {
            export: htmlReportPath,
            title: 'Excel-Driven API Test Report',
            browserTitle: 'API Testing',
            showEnvironmentData: true,
            showTestScript: true,
            showAssertions: true
        },
        allure: {
            export: allureResultsDir
        }
    }
})
.on('request', function (err, args) {
    if (err) return console.error(err);

    results.push({
        API_Name: args.item.name,
        URL: args.request.url.toString(),
        Actual_Status_Code: args.response.code,
        Actual_Response_Time: args.response.responseTime,
        Response_Snippet: args.response.stream.toString().substring(0, 150)
    });
})
.on('done', async function () {
    console.log(`✅ Collection run complete! HTML report saved at ${htmlReportPath}`);

    // Merge results with original test cases
    let updatedCases = testCases.map(tc => {
        const match = results.find(r => r.URL === tc.URL);
        if (match) {
            return {
                ...tc,
                Actual_Status_Code: match.Actual_Status_Code,
                Actual_Response_Time: match.Actual_Response_Time,
                Result:
                    tc.Expected_Status_Code == match.Actual_Status_Code &&
                    match.Actual_Response_Time < tc.Expected_Time_ms
                        ? 'PASS'
                        : 'FAIL',
                Response_Snippet: match.Response_Snippet
            };
        }
        return tc;
    });

    // Create styled Excel output
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet(sheetName);

    // Add headers
    const headers = Object.keys(updatedCases[0]);
    ws.addRow(headers);

    // Add data rows
    updatedCases.forEach(row => {
        const excelRow = ws.addRow(Object.values(row));

        // Style Result cell
        const resultCell = excelRow.getCell(headers.indexOf('Result') + 1);
        if (row.Result === 'PASS') {
            resultCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF00FF00' } }; // green
        } else if (row.Result === 'FAIL') {
            resultCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF0000' } }; // red
        }
    });

    // Save Excel
    await wb.xlsx.writeFile(excelOutputPath);
    console.log(`📊 Excel results saved at ${excelOutputPath}`);

    // Generate Allure report
    exec(`allure generate ${allureResultsDir} --clean -o ${allureReportDir}`, (err) => {
        if (!err) {
            console.log(`📈 Allure report generated at ${allureReportDir}`);
        } else {
            console.error('❌ Failed to generate Allure report:', err);
        }
    });
});