pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

let pdfText = null;

$(document).ready(function() {
$('#collegeSearch').select2({
    placeholder: "Search College/University",
    width: '90%',
    allowClear: true,
    ajax: {
        url: 'https://api.data.gov/ed/collegescorecard/v1/schools.json',
        dataType: 'json',
        data: function (params) {
            return {
                api_key: 'Bu6Pku0B3kW9OTGe9j4ONHhL807YTmKFghvC7IHc',
                'school.name': params.term,
                per_page: 20
            };
        },
        processResults: function (data) {
            if (!data.results) {
                console.error("API Response Error:", data);
                return { results: [] };
            }
            return {
                results: data.results.map(function(school) {
                    return { id: school.id, text: school.school.name };
                })
            };
        },
        cache: true
    },
    minimumInputLength: 3,
    templateSelection: function (state) {
        if (state && state.text && state.text.length > 30) {
            return "..." + state.text.substring(0, 27);
        }
        return state.text;
    }
});
});

function updateDifficultyPercentage() {
    let slider = document.getElementById("difficultySlider");
    let display = document.getElementById("difficultyValue");
    display.textContent = slider.value + "%";
}

document.getElementById("difficultySlider").addEventListener("input", updateDifficultyPercentage);
setInterval(updateDifficultyPercentage, 100);

document.getElementById("courseCatalog").addEventListener("change", function() {
        if (this.files.length > 0) {
            let fileName = this.files[0].name;
            
            const maxLength = 30;
            if (fileName.length > maxLength) {
                const extension = fileName.split('.').pop();
                fileName = fileName.substring(0, maxLength - extension.length - 3) + "... ." + extension;
            }
            
            document.getElementById("uploadText").textContent = fileName;
        }
    });

document.addEventListener("DOMContentLoaded", function () {
    const pdfInput = document.getElementById("courseCatalog");
    pdfInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = async function() {
                const typedarray = new Uint8Array(fileReader.result);
                try {
                    const pdf = await pdfjsLib.getDocument(typedarray).promise;
                    let extractedText = "";
                    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                        const page = await pdf.getPage(pageNum);
                        const content = await page.getTextContent();
                        extractedText += content.items.map(item => item.str).join(" ") + "\n";
                    }
                    pdfText = extractedText.trim();
                    console.log("Extracted PDF Text:", pdfText);
                } catch (error) {
                    console.error("Error extracting PDF text:", error);
                }
            };
            fileReader.readAsArrayBuffer(file);
        }
    });
});

async function gradeSelected(grade) {

if (!pdfText) {
    alert("Please upload a course catalog PDF.");
    document.getElementById('recommendation-loader').remove();
    return;
}

console.log("Fetching recommendations...");

const loader = document.createElement('div');
loader.className = 'loader';
loader.id = 'recommendation-loader';
document.getElementById('container').style.filter = 'blur(5px)';
document.body.appendChild(loader);

const interactiveElements = document.querySelectorAll('button, select, input, textarea, a');
interactiveElements.forEach(element => {
    element.disabled = true;
});

function enableInteractiveElements() {
    interactiveElements.forEach(element => {
        element.disabled = false;
    });
}

try {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const recommendations = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6"]
    console.log("Recommended Courses:", recommendations);
} catch (error) {
    console.error("Error getting recommendations:", error);
    alert("An error occurred while processing your request.");

} finally {
    const loaderElement = document.getElementById('recommendation-loader');
    if (loaderElement) {
        loaderElement.remove();
    }
    document.getElementById('container').style.filter = 'none';
    enableInteractiveElements();
}                           


const userInterest = document.getElementById("interest").value;
const userCollege = document.getElementById("collegeSearch").value;
const userMath = document.getElementById("mathClass").value;
const userDifficulty = document.getElementById("difficultySlider").value;

const systemPrompt = "You are an AI that recommends exactly six classes. If the user is in 12th grade, recommend 2 core classes and 4 electives. Otherwise, 4 core classes and 2 electives. Make sure that if you recommend a math class, it is one level of diffivulty above the user's most recent math class completed (e.g. Precalculus > AP Calculus AB or AP Calculus BC). Provide nothing else. ONLY A TOTAL OF 6 CLASSES SHOULD BE RECOMMENDED TOTAL NO MATTER WHAT";
const userPrompt = "Interest: " + userInterest +
"\nCollege: " + userCollege +
"\nGrade: " + grade +
"\nMath Completed: " + userMath +
"\nDifficulty: " + userDifficulty;

const body = {
providers: ["openai"],
messages: [
  {
    role: "system",
    content: [
      { type: "text", content: { text: systemPrompt } }
    ]
  },
  {
    role: "user",
    content: [
      { type: "text", content: { text: userPrompt } }
    ]
  }
]
};

if (pdfText) {
body.messages.push({
  role: "user",
  content: [
    { type: "text", content: { text: "Course Catalog Content: " + pdfText } }
  ]
});
}

body.messages.push({
role: "user",
content: [
  { type: "text", content: { text: "Please make sure that 1 English class is recommended. ONLY A TOTAL OF 6 CLASSES SHOULD BE RECOMMENDED TOTAL NO MATTER WHAT" } }
]
});

console.log("Request Body:", JSON.stringify(body, null, 2));

try {
const response = await fetch("https://api.edenai.run/v2/multimodal/chat", {
  method: "POST",
  headers: {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTk5Zjc3YjUtNmZhYi00MjAyLWE5NDgtNzU2MGQ3MjM5ZWFhIiwidHlwZSI6ImFwaV90b2tlbiJ9.hv0KELNJqCXcYS2_PnQ9yLsKiCJbPKLJoLbQwboEe0o",
    "Content-Type": "application/json"
  },
  body: JSON.stringify(body)
});

const responseData = await response.json();

if (!response.ok) {
  console.error("API Error:", responseData);
  alert("API request failed: " + JSON.stringify(responseData));
  return;
}

if (!responseData.openai || !responseData.openai.generated_text) {
  console.error("No recommendations returned from API");
  alert("No recommendations available.");
  return;
}

const recommendationsText = responseData.openai.generated_text.trim();
const recommendations = recommendationsText.split("\n").map(course => course.trim()).filter(course => course);

if (recommendations.length !== 6) {
  alert("Unexpected number of recommendations received: " + recommendations.length);
  return;
}

const courseElements = document.querySelectorAll("#section2 .courseDisplay");
courseElements.forEach((elem, index) => {
  elem.textContent = recommendations[index];
});
} catch (error) {
console.error("Error during recommendation request:", error);
alert("An error occurred while processing your request.");
}
}
