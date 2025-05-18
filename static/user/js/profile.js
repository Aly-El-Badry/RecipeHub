document.addEventListener('DOMContentLoaded', function() {
    // Modal Functionality 
    const personalModal = document.getElementById('personalModal');
    const locationModal = document.getElementById('locationModal');
    const editPersonalBtn = document.getElementById('editPersonal');
    const editLocationBtn = document.getElementById('editLocationInfo');
    const closeButtons = document.getElementsByClassName('close');
    const cancelButtons = document.getElementsByClassName('cancel-btn');

    // Open Personal Modal
    editPersonalBtn.addEventListener('click', function() {
        personalModal.style.display = 'block';
    });

    // Open Location Modal
    editLocationBtn.addEventListener('click', function() {
        locationModal.style.display = 'block';
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

    // Save Location Info
    document.getElementById('locationForm').addEventListener('submit', function(e) {
        profileData.location.country = document.getElementById('editCountry').value;
        profileData.location.city = document.getElementById('editCity').value;
        profileData.location.address = document.getElementById('editAddress').value;
        
        // Update the stored user object
        const updatedUser = {
            ...storedUser,
            country: profileData.location.country,
            city: profileData.location.city,
            address: profileData.location.address
        };
                
        locationModal.style.display = 'none';
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

    // Open modal when plus icon is clicked
    editBtn.addEventListener('click', function(e) {
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

    // Save image
    saveBtn.addEventListener('click', function() {
        profileAvatar.src = imagePreview.src;
        
        // Update the stored user object with the image
        const updatedUser = {
            ...storedUser,
            profileImage: imagePreview.src
        };
        
        localStorage.setItem(currentUserKey, JSON.stringify(updatedUser));
        
        closeImageModal();
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

    if (document.querySelector('.search-input')) {
        console.log(document.querySelector('.search-input'));
        man.initializeSearch(document.querySelector('.search-input'));
    }
});
