// Data Structure for Notes
const notesData = {
    hindi: {
        "Bharat Ki Khoj": ["Coming soon"],
        "Hindi Pathmala": ["Whole Book"]
    },
    english: {
        "English Reader": ["Chapter 5 - Princess September"],
        "English Literature": ["Coming Soon"]
    },
    socialScience: {
        "History": ["Chapter 6 - British and Education"],
        "Civics": ["Chapter 6 - Confronting Marginalisation"],
        "Geography": ["Chapter 5 - Agriculture and Crops"]
    },
    computer: {
        "Binary Folks": ["Chapter 6 - More on Visual Basic 2015", "Chapter 9 - Computer Ethics", "Chapter 8 - Multimedia"],
    },
    science: {
        "Science": ["Coming Soon"],
    }
};

// Function to update the book list based on the selected subject
function updateBooks() {
    const subject = document.getElementById("subject").value;
    const bookDropdown = document.getElementById("book");
    const chapterDropdown = document.getElementById("chapter");
    bookDropdown.innerHTML = '<option value="">--Select Book--</option>';
    chapterDropdown.innerHTML = '<option value="">--Select Chapter--</option>';
    document.getElementById("pdf-preview").style.display = "none";
    document.getElementById("download-link").style.display = "none";

    if (subject && notesData[subject]) {
        Object.keys(notesData[subject]).forEach(book => {
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

// Function to update the chapter list based on the selected book
function updateChapters() {
    const subject = document.getElementById("subject").value;
    const book = document.getElementById("book").value;
    const chapterDropdown = document.getElementById("chapter");
    chapterDropdown.innerHTML = '<option value="">--Select Chapter--</option>';

    if (book && notesData[subject] && notesData[subject][book]) {
        notesData[subject][book].forEach(chapter => {
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
    const subject = document.getElementById("subject").value;
    const book = document.getElementById("book").value;
    const chapter = document.getElementById("chapter").value;
    const pdfPreview = document.getElementById("pdf-preview");
    const downloadLink = document.getElementById("download-link");

    if (chapter) {
        const fileName = `${subject}_${book}_${chapter}`.replace(/\s+/g, "_") + ".pdf";
        const filePath = `notes/${fileName}`; // Adjust the folder structure as per your setup

        pdfPreview.src = filePath;
        pdfPreview.style.display = "block";
        downloadLink.href = filePath;
        downloadLink.style.display = "inline-block";
    } else {
        pdfPreview.style.display = "none";
        downloadLink.style.display = "none";
    }
}