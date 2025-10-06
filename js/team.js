// js/team-admin.js
document.addEventListener('DOMContentLoaded', () => {
  // Initialize firebase app via your firebase-config.js (already included)
  const adminUid = "YOUR_ADMIN_UID"; // <- replace with your UID

  // references to DOM
  const adminPanel = document.getElementById('adminPanel');
  const memberForm = document.getElementById('memberForm');
  const membersList = document.getElementById('membersList');

  // Wait for auth state (you have auth-state.js included) - but we'll add listener here:
  firebase.auth().onAuthStateChanged((user) => {
    if (user && user.uid === adminUid) {
      adminPanel.style.display = 'block';
      loadMembers();
    } else {
      adminPanel.style.display = 'none';
    }
  });

  const dbRef = firebase.database().ref('members');

  // Save / create member
  memberForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const member = {
      name: memberForm.m_name.value,
      class: memberForm.m_class.value,
      section: memberForm.m_section.value,
      roll: memberForm.m_roll.value,
      instagram: memberForm.m_instagram.value,
      timestamp: Date.now()
    };
    const newRef = dbRef.push();
    newRef.set(member)
      .then(()=> {
        memberForm.reset();
      })
      .catch(err => alert('Save failed: ' + err.message));
  });

  // Load and render members
  function loadMembers() {
    dbRef.on('value', snapshot => {
      membersList.innerHTML = '';
      const data = snapshot.val() || {};
      Object.keys(data).forEach(key => {
        const m = data[key];
        const box = document.createElement('div');
        box.className = 'student-box';
        box.innerHTML = `
          <div class="student-header">
            <strong>${m.name}</strong>
            <span class="dots" data-key="${key}">⋮</span>
          </div>
          <p><strong>Class:</strong> ${m.class}</p>
          <p><strong>Section:</strong> ${m.section}</p>
          <p><strong>Roll:</strong> ${m.roll}</p>
          <p><strong>Instagram:</strong> <a target="_blank" href="https://instagram.com/${m.instagram}">@${m.instagram}</a></p>
          <div class="menu" style="display:none">
            <button class="editBtn" data-key="${key}">Edit</button>
            <button class="delBtn" data-key="${key}">Delete</button>
          </div>
        `;
        membersList.appendChild(box);
      });

      // attach events (delegation)
      document.querySelectorAll('.dots').forEach(el=>{
        el.addEventListener('click', (e) => {
          const key = e.target.dataset.key;
          const menu = e.target.parentElement.querySelector('.menu');
          menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
      });
      document.querySelectorAll('.editBtn').forEach(b=>{
        b.addEventListener('click', (e) => {
          const key = e.target.dataset.key;
          dbRef.child(key).once('value').then(snap => {
            const m = snap.val();
            memberForm.m_name.value = m.name;
            memberForm.m_class.value = m.class;
            memberForm.m_section.value = m.section;
            memberForm.m_roll.value = m.roll;
            memberForm.m_instagram.value = m.instagram;
            // remove record so submit creates a new one (or implement update)
            dbRef.child(key).remove();
          });
        });
      });
      document.querySelectorAll('.delBtn').forEach(b=>{
        b.addEventListener('click', (e) => {
          const key = e.target.dataset.key;
          if (confirm('Delete this member?')) {
            dbRef.child(key).remove();
          }
        });
      });
    });
  }
});
