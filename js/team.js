document.addEventListener('DOMContentLoaded', () => {

  const adminPanel = document.getElementById('adminPanel');
  const memberForm = document.getElementById('memberForm');
  const membersList = document.getElementById('membersList');

  const dbRef = firebase.database().ref('members');
  const adminsRef = firebase.database().ref('admins');

  let isAdmin = false;


  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      isAdmin = false;
      adminPanel.style.display = 'none';
      loadMembers(false);
      return;
    }

    adminsRef.child(user.uid).once('value')
      .then(snapshot => {
        isAdmin = snapshot.val() === true;

        adminPanel.style.display = isAdmin ? 'block' : 'none';
        loadMembers(isAdmin);
      })
      .catch(() => {
        isAdmin = false;
        adminPanel.style.display = 'none';
        loadMembers(false);
      });
  });


  memberForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    const member = {
      name: memberForm.m_name.value,
      class: memberForm.m_class.value,
      section: memberForm.m_section.value,
      roll: memberForm.m_roll.value,
      instagram: memberForm.m_instagram.value,
      timestamp: Date.now()
    };

    dbRef.push(member)
      .then(() => memberForm.reset())
      .catch(err => alert('Save failed: ' + err.message));
  });


  function loadMembers(isAdmin) {
    dbRef.off();
    dbRef.on('value', snapshot => {
      membersList.innerHTML = '';
      const data = snapshot.val() || {};

      Object.keys(data).forEach(key => {
        const m = data[key];
        const box = document.createElement('div');
        box.className = 'student-box';

        const menuHtml = isAdmin ? `
          <span class="dots" data-key="${key}">⋮</span>
          <div class="menu" style="display:none">
            <button class="editBtn" data-key="${key}">Edit</button>
            <button class="delBtn" data-key="${key}">Delete</button>
          </div>
        ` : '';

        box.innerHTML = `
          <div class="student-header">
            <strong>${m.name}</strong>
            ${menuHtml}
          </div>
          <p><strong>Class:</strong> ${m.class}</p>
          <p><strong>Section:</strong> ${m.section}</p>
          <p><strong>Roll:</strong> ${m.roll}</p>
          <p><strong>Instagram:</strong>
            <a target="_blank" href="https://instagram.com/${m.instagram}">
              @${m.instagram}
            </a>
          </p>
        `;

        membersList.appendChild(box);
      });
    });
  }


  membersList.addEventListener('click', (e) => {
    if (!isAdmin) return;

    
    if (e.target.classList.contains('dots')) {
      const menu = e.target.nextElementSibling;
      document.querySelectorAll('.menu').forEach(m => {
        if (m !== menu) m.style.display = 'none';
      });
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }

    
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

        dbRef.child(key).remove();
      });
    }


    if (e.target.classList.contains('delBtn')) {
      const key = e.target.dataset.key;
      if (confirm('Delete this member?')) {
        dbRef.child(key).remove();
      }
    }
  });

});
