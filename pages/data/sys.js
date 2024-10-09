        document.addEventListener('DOMContentLoaded', function() {
            const storedEmail = localStorage.getItem('email');
            const storedUsername = localStorage.getItem('username');
            const storedProfilePic = localStorage.getItem('profilePic');

            if (storedUsername && storedProfilePic && storedEmail) {
                showProfilePage(storedUsername, storedProfilePic, storedEmail);
            }

        });

        function login(event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const profilePic = document.getElementById('profilePic').files[0];

            if (email && username && password && profilePic) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const profilePicURL = event.target.result;

                    localStorage.setItem('email', email);
                    localStorage.setItem('username', username);
                    localStorage.setItem('profilePic', profilePicURL);

                    showProfilePage(username, profilePicURL, email);
                };
                reader.readAsDataURL(profilePic);
            }
        }

        function showProfilePage(username, profilePicURL, email) {
            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('profileContainer').style.display = 'block';

            document.getElementById('displayUsername').textContent = username;
            document.getElementById('displayProfilePic').src = profilePicURL;
            document.getElementById('displayEmail').textContent = email;
        }

        function logout() {
            localStorage.removeItem('email');
            localStorage.removeItem('username');
            localStorage.removeItem('profilePic');
            document.getElementById('loginContainer').style.display = 'block';
            document.getElementById('profileContainer').style.display = 'none';
        }