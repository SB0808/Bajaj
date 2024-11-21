const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Function to check if a number is prime
const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

// POST endpoint
app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;

    // Process the data
    const numbers = [];
    const alphabets = [];
    let highestLowercase = null;

    data.forEach((item) => {
        if (!isNaN(item)) {
            numbers.push(item);
        } else if (/^[a-zA-Z]$/.test(item)) {
            alphabets.push(item);
            if (item === item.toLowerCase() && (!highestLowercase || item > highestLowercase)) {
                highestLowercase = item;
            }
        }
    });

    // Check for primes
    const primeExists = numbers.some((num) => isPrime(Number(num)));

    // File validation
    let fileValid = false;
    let fileMimeType = null;
    let fileSizeKB = 0;

    if (file_b64) {
        try {
            const fileBuffer = Buffer.from(file_b64, 'base64');
            fileSizeKB = (fileBuffer.length / 1024).toFixed(2);

            const fileType = require('file-type');
            const fileInfo = fileType(fileBuffer);

            if (fileInfo) {
                fileMimeType = fileInfo.mime;
                fileValid = true;
            }
        } catch (err) {
            console.log('File validation failed:', err);
        }
    }

    // Response
    res.status(200).json({
        is_success: true,
        user_id: 'your_name_ddmmyyyy', // Replace with dynamic input or hardcode for testing
        email: 'your_email@college.com',
        roll_number: 'YOUR_ROLL_NUMBER',
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
        is_prime_found: primeExists,
        file_valid: fileValid,
        file_mime_type: fileMimeType,
        file_size_kb: fileSizeKB,
    });
});

// GET endpoint
app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1,
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
