document.addEventListener('DOMContentLoaded', function() {
    // Modal Functionality 
    const personalModal = document.getElementById('personalModal');
    const editPersonalBtn = document.getElementById('editPersonal');
    const closeButtons = document.getElementsByClassName('close');
    const cancelButtons = document.getElementsByClassName('cancel-btn');

    // Open Personal Modal
    editPersonalBtn.addEventListener('click', function() {
        personalModal.style.display = 'block';
    });

    // Close modals
    Array.from(closeButtons).forEach(button => {
        button.addEventListener('click', function() {
            personalModal.style.display = 'none';
            locationModal.style.display = 'none';
        });
    });

    Array.from(cancelButtons).forEach(button => {
        button.addEventListener('click', function() {
            personalModal.style.display = 'none';
            locationModal.style.display = 'none';
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target === personalModal) personalModal.style.display = 'none';
        if (event.target === locationModal) locationModal.style.display = 'none';
    });

    // Save Personal Info
    document.getElementById('personalForm').addEventListener('submit', function(e) {
        personalModal.style.display = 'none';
    });

    // Image Upload Functionality
    const editBtn = document.getElementById('editProfileBtn');
    const imgmodel = document.getElementById('imgmodel');
    const chooseBtn = document.getElementById('chooseImageBtn');
    const fileInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');
    const saveBtn = document.getElementById('saveImageBtn');
    const cancelBtn = document.getElementById('cancelUpload');
    const profileAvatar = document.getElementById('profileAvatar');
    const imageUploadForm = document.getElementById('imageUploadForm');

    // Open modal when plus icon is clicked
    editBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        imgmodel.style.display = 'flex';
    });

    // Trigger file selection
    chooseBtn.addEventListener('click', function() {
        fileInput.click();
    });

    // Preview selected image
    fileInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                imagePreview.src = event.target.result;
                imagePreview.style.display = 'block';
                saveBtn.disabled = false;
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Handle form submission
    imageUploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update profile avatar with the new Cloudinary URL
                profileAvatar.src = data.image_url;
                
                // Update the stored user object with the new image URL
                const updatedUser = {
                    ...storedUser,
                    profileImage: data.image_url
                };
                
                localStorage.setItem(currentUserKey, JSON.stringify(updatedUser));
                
                closeImageModal();
            } else {
                alert(data.error || 'Failed to upload image. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while uploading the image. Please try again.');
        });
    });

    // Close modal
    cancelBtn.addEventListener('click', closeImageModal);

    // Close when clicking outside
    imgmodel.addEventListener('click', function(e) {
        if (e.target === imgmodel) {
            closeImageModal();
        }
    });

    function closeImageModal() {
        imgmodel.style.display = 'none';
        imagePreview.style.display = 'none';
        fileInput.value = '';
        saveBtn.disabled = true;
    }

    // Load saved avatar if exists
    if (storedUser?.profileImage) {
        profileAvatar.src = storedUser.profileImage;
    }
});
