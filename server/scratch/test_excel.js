const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const filePath = 'c:\\xampp2\\htdocs\\AI-Agent\\server\\uploads\\1776345006880.xlsx';

try {
    const workbook = XLSX.readFile(filePath);
    const sheetNames = workbook.SheetNames;
    const content = sheetNames.map(name => {
        const sheet = workbook.Sheets[name];
        return XLSX.utils.sheet_to_txt(sheet);
    }).join('\n');
    console.log('--- CONTENT START ---');
    console.log(content);
    console.log('--- CONTENT END ---');
} catch (err) {
    console.error('Error reading file:', err);
}
