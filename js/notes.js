// Data Structure for Notes
const notesData = {
    class8: {
        hindi: {
            "Bharat Ki Khoj": ["Chapter 6 - Antim Daur I", "Chapter 7 - Antim Daur II", "Chapter 8 - Tanav"],
            "Hindi Pathmala": ["Whole Book"]
        },
        english: {
            "English Reader": ["Chapter 5 - Princess September", "Chapter 6 - The Fight", "Chapter 7 - Jalebis"],
            "English Literature": ["Chapter 11 - A Remarkable Rocket"]
        },
        socialScience: {
            "History": ["Chapter 6 - British and Education"],
            "Civics": ["Chapter 6 - Confronting Marginalisation", "Chapter 7 - Public Facilities and the Role of Government", "Chapter 8 - Law and Social Justice",],
            "Geography": ["Chapter 5 - Agriculture and Crops", "Chapter 7 - Human Resources"]
        },
        computer: {
            "Binary Folks": ["Chapter 6 - More on Visual Basic 2015", "Chapter 7 - Introduction to Java & BlueJ", "Chapter 8 - Multimedia", "Chapter 9 - Computer Ethics"]
        },
        science: {
            "Science": ["Chapter 9 - Force And Pressure", "Chapter 10 - Some Natural Phenomena", "Chapter 11 - Light", "Chapter 12 - Stars and The Solar System", "Chapter 13 - Pollution of Air and Water"]
        }
    },
    class9: {
        hindi: {
            "Kshitij": ["Chapter 1 - Do Bailo Ki Katha", "Chapter 2 - Lhasa Ki Or", "Chapter 3 - Upbhoktawad Ki Sanskriti", "Chapter 7 - Sakhiya Aur Sabad", "Chapter 9 - Sawaiye", "Chapter 10 - Kaidi Aur Kokila", "Chapter 11 - Gram Shree",],
            "Kritika": ["Chapter 1 - Iss Jal Pralay Mei",],
            "Vyakaran":["Chapter 1 - Upsarg",]
        },
        english: {
            "Moments": ["Chapter 1 - The Lost Child", "Chapter 2 - The Adventure of Toto", "Chapter 3 - Iswaran The Storyteller", "Chapter 4 - In the Kingdom of Fools", "Chapter 5 - The Happy Prince",],
            "Beehive": ["Chapter 1 - The Fun They Had", "Chapter 2 - The Sound of Music", "Chapter 3 - The Little Girl", "Chapter 4 - A Truly Beautiful Mind",]
        },
        socialScience: {
            "History": ["Chapter 1 - The French Revolution", "Chapter 2 - The Russian Revolution",],
            "Civics": ["Chapter 1 - What is Democracy. Why Democracy.", "Chapter 2 - Constitutional Design", "Chapter 3 - Electoral Politics",],
            "Geography": ["Chapter 1 - India-Size&Location", "Chapter 2 - Physical Features of India", "Chapter 3 - Drainage",],
            "Economics": ["Chapter 1 - The Story of Palampur","Chapter 2 - People as Resource",]
        },
        optionSubject: {
            "Information Technology": ["Coming Soon"],
            "Physical Education": ["Coming Soon"]
        },
        science: {
            "Biology": ["Coming Soon"],
            "Chemistry": ["Coming Soon"],
            "Physics": ["Coming Soon"]
        }
    }
};

function beautifySubjectName(subjectKey) {
    // Insert a space before all caps and capitalize first letter of every word
    const spaced = subjectKey.replace(/([A-Z])/g, ' $1');
    return spaced.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Function to update subjects based on selected class
function updateSubjects() {
    const classLevel = document.getElementById("class").value;
    const subjectDropdown = document.getElementById("subject");
    const bookDropdown = document.getElementById("book");
    const chapterDropdown = document.getElementById("chapter");

    subjectDropdown.innerHTML = '<option value="">--Select Subject--</option>';
    bookDropdown.innerHTML = '<option value="">--Select Book--</option>';
    chapterDropdown.innerHTML = '<option value="">--Select Chapter--</option>';

    document.getElementById("pdf-preview").style.display = "none";
    document.getElementById("download-link").style.display = "none";

    if (classLevel && notesData[classLevel]) {
        Object.keys(notesData[classLevel]).forEach(subject => {
            const option = document.createElement("option");
            option.value = subject;
            option.textContent = beautifySubjectName(subject);
            subjectDropdown.appendChild(option);
        });
        subjectDropdown.disabled = false;
        bookDropdown.disabled = true;
        chapterDropdown.disabled = true;
    } else {
        subjectDropdown.disabled = true;
        bookDropdown.disabled = true;
        chapterDropdown.disabled = true;
    }
}

// Function to update books based on selected subject
function updateBooks() {
    const classLevel = document.getElementById("class").value;
    const subject = document.getElementById("subject").value;
    const bookDropdown = document.getElementById("book");
    const chapterDropdown = document.getElementById("chapter");

    bookDropdown.innerHTML = '<option value="">--Select Book--</option>';
    chapterDropdown.innerHTML = '<option value="">--Select Chapter--</option>';
    document.getElementById("pdf-preview").style.display = "none";
    document.getElementById("download-link").style.display = "none";

    if (subject && notesData[classLevel] && notesData[classLevel][subject]) {
        Object.keys(notesData[classLevel][subject]).forEach(book => {
            const option = document.createElement("option");
            option.value = book;
            option.textContent = book;
            bookDropdown.appendChild(option);
        });
        bookDropdown.disabled = false;
        chapterDropdown.disabled = true;
    } else {
        bookDropdown.disabled = true;
        chapterDropdown.disabled = true;
    }
}

// Function to update chapters based on selected book
function updateChapters() {
    const classLevel = document.getElementById("class").value;
    const subject = document.getElementById("subject").value;
    const book = document.getElementById("book").value;
    const chapterDropdown = document.getElementById("chapter");

    chapterDropdown.innerHTML = '<option value="">--Select Chapter--</option>';
    document.getElementById("pdf-preview").style.display = "none";
    document.getElementById("download-link").style.display = "none";

    if (book && notesData[classLevel] && notesData[classLevel][subject] && notesData[classLevel][subject][book]) {
        notesData[classLevel][subject][book].forEach(chapter => {
            const option = document.createElement("option");
            option.value = chapter;
            option.textContent = chapter;
            chapterDropdown.appendChild(option);
        });
        chapterDropdown.disabled = false;
    } else {
        chapterDropdown.disabled = true;
    }
}

// Function to show PDF preview and download link
function showPreview() {
    const classLevel = document.getElementById("class").value;
    const subject = document.getElementById("subject").value;
    const book = document.getElementById("book").value;
    const chapter = document.getElementById("chapter").value;
    const pdfPreview = document.getElementById("pdf-preview");
    const downloadLink = document.getElementById("download-link");

    if (chapter) {
        const fileName = `${classLevel}_${subject}_${book}_${chapter}`.replace(/\s+/g, "_") + ".pdf";
        const pdfURL = `notes/PDF/${fileName}`;

        pdfPreview.src = pdfURL;
        pdfPreview.style.display = "block";

        downloadLink.href = pdfURL;
        downloadLink.setAttribute('download', fileName);
        downloadLink.style.display = "inline-block";
    } else {
        pdfPreview.style.display = "none";
        downloadLink.style.display = "none";
    }
}

// Download Animation + Sound Functionality
const downloadLink = document.getElementById("download-link");
const whooshSound = new Audio('js/Whoosh.mp3');

downloadLink.addEventListener('click', function(event) {
    event.preventDefault();

    const downloadText = downloadLink.querySelector('.download-text');
    const downloadedText = downloadLink.querySelector('.downloaded-text');

    downloadLink.classList.add('downloading');
    downloadText.style.display = 'none';
    downloadedText.style.display = 'inline';
    whooshSound.play();
    downloadLink.classList.add('clicked');

    setTimeout(() => {
        downloadLink.classList.add('show-downloaded');

        const href = downloadLink.getAttribute('href');
        const tempLink = document.createElement('a');
        tempLink.href = href;
        tempLink.setAttribute('download', downloadLink.getAttribute('download'));
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);

        setTimeout(() => {
            downloadLink.classList.remove('clicked', 'show-downloaded', 'downloading');
            downloadText.style.display = 'inline';
            downloadedText.style.display = 'none';

            document.getElementById("class").value = '';
            document.getElementById("subject").innerHTML = '<option value="">--Select Subject--</option>';
            document.getElementById("book").innerHTML = '<option value="">--Select Book--</option>';
            document.getElementById("chapter").innerHTML = '<option value="">--Select Chapter--</option>';
            document.getElementById("subject").disabled = true;
            document.getElementById("book").disabled = true;
            document.getElementById("chapter").disabled = true;
            document.getElementById("pdf-preview").style.display = "none";
            downloadLink.style.display = "none";
        }, 1700);

    }, 800);
});










