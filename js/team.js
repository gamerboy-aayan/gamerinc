document.addEventListener('DOMContentLoaded', () => {

  const adminUid = "LKV7zjfNJfeUhgZ7saRllX4G4ku2";

  const adminPanel = document.getElementById('adminPanel');
  const memberForm = document.getElementById('memberForm');
  const membersList = document.getElementById('membersList');

  const dbRef = firebase.database().ref('members');

  let isAdmin = false;

  firebase.auth().onAuthStateChanged((user) => {
    isAdmin = user && user.uid === adminUid;

    // Show admin panel if admin
    adminPanel.style.display = isAdmin ? 'block' : 'none';

    // Load members with proper permission
    loadMembers(isAdmin);
  });

  // Submit new member
  memberForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!isAdmin) return; // just a safety check

    const member = {
      name: memberForm.m_name.value,
      class: memberForm.m_class.value,
      section: memberForm.m_section.value,
      roll: memberForm.m_roll.value,
      instagram: memberForm.m_instagram.value,
      timestamp: Date.now()
    };

    dbRef.push().set(member)
      .then(() => memberForm.reset())
      .catch(err => alert('Save failed: ' + err.message));
  });

  function loadMembers(isAdmin) {
    dbRef.on('value', snapshot => {
      membersList.innerHTML = '';
      const data = snapshot.val() || {};

      Object.keys(data).forEach(key => {
        const m = data[key];
        const box = document.createElement('div');
        box.className = 'student-box';

        // Only show dots and menu if admin
        const menuHtml = isAdmin
          ? `<span class="dots" data-key="${key}">⋮</span>
             <div class="menu" style="display:none">
               <button class="editBtn" data-key="${key}">Edit</button>
               <button class="delBtn" data-key="${key}">Delete</button>
             </div>`
          : '';

        box.innerHTML = `
          <div class="student-header">
            <strong>${m.name}</strong>
            ${menuHtml}
          </div>
          <p><strong>Class:</strong> ${m.class}</p>
          <p><strong>Section:</strong> ${m.section}</p>
          <p><strong>Roll:</strong> ${m.roll}</p>
          <p><strong>Instagram:</strong> 
            <a target="_blank" href="https://instagram.com/${m.instagram}">@${m.instagram}</a>
          </p>
        `;

        membersList.appendChild(box);
      });
    });
  }

  // Handle clicks on dots/edit/delete
  membersList.addEventListener('click', (e) => {
    if (!isAdmin) return; // only admin can interact

    // Toggle menu
    if (e.target.classList.contains('dots')) {
      const menu = e.target.parentElement.querySelector('.menu');
      if (!menu) return;
      document.querySelectorAll('.menu').forEach(m => {
        if (m !== menu) m.style.display = 'none';
      });
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }

    // Edit button
    if (e.target.classList.contains('editBtn')) {
      const key = e.target.dataset.key;
      dbRef.child(key).once('value').then(snap => {
        const m = snap.val();
        if (!m) return;

        memberForm.m_name.value = m.name;
        memberForm.m_class.value = m.class;
        memberForm.m_section.value = m.section;
        memberForm.m_roll.value = m.roll;
        memberForm.m_instagram.value = m.instagram;

        // Remove old entry so new edit will overwrite
        dbRef.child(key).remove();
      });
    }

    // Delete button
    if (e.target.classList.contains('delBtn')) {
      const key = e.target.dataset.key;
      if (confirm('Delete this member?')) {
        dbRef.child(key).remove();
      }
    }
  });

});