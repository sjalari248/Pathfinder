# Pathfinder

## Overview

Pathfinder is a web-based application designed to help high school students select the most suitable courses based on their interests, academic background, and goals. The application utilizes a large language model to analyze available course options and generate personalized recommendations.

## Contributors

This project was developed by:

- **Suprathik Jalari**
- **Parth Verma**
- **Yifei Cheng**

## Features

- **PDF Upload:** Users can upload their high school course catalog in PDF format.
- **Interest-Based Recommendations:** The AI suggests courses based on the user's selected field of interest.
- **Grade-Level Consideration:** The recommendations are tailored to the student's current grade level.
- **Math Level Assessment:** The AI factors in the most recent math class completed by the student.
- **Customizable Difficulty Level:** Users can select the desired difficulty level for their courses.
- **Target College Selection:** Users can specify their target college for better recommendation alignment.

## Technologies Used

- **Frontend:** HTML, CSS (Tailwind CSS), JavaScript
- **PDF Processing:** PDF.js
- **AI Integration:** Eden AI API for ChatGPT
- **UI Enhancements:** Select2 for dropdown enhancements

## Installation & Usage

1. Clone this repository:
   ```sh
   git clone https://github.com/sjalari248/Pathfinder.git
   ```
2. Open `index.html` in a web browser.
3. Upload a PDF course catalog, select preferences, and generate recommendations.

## API Integration

Pathfinder utilizes Eden AI's API to process the course catalog and generate recommendations. The program includes a working API key as of April 30th, 2025. However, in the event that the key does not work and you want to run this locally, make sure you have a valid OpenAI API key and update the "[YOUR API KEY HERE]" in the JavaScript code. 

## License

This project is licensed under the MIT License. Feel free to modify and distribute it accordingly.

---

Developed by Suprathik Jalari, Parth Verma, and Yifei Cheng

