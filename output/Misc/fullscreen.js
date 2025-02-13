let imgElement = null;
// Εικόνα και λεζάντα από το get του url
document.addEventListener("DOMContentLoaded", () => {
        const params = new URLSearchParams(window.location.search);
        const imageUrl = params.get("img");
        const captionText = params.get("caption");
        // στοιχεία εικόνας και λεζάντας της σελίδας
        imgElement = document.getElementById("fullscreenImg");
        const captionElement = document.getElementById("caption");
        // θέτει την εικόνα (και την λεζάντα)
        if (imageUrl) {
            imgElement.src = imageUrl;
            captionElement.textContent = captionText || "";
            // 50ms καθυστέρηση εμφάνισης
            setTimeout(() => {
                imgElement.classList.add("show");
                captionElement.classList.add("show");
            }, 50);
        } else {
            document.body.innerHTML = "<p style='color:white; text-align:center;'>Η εικόνα δεν βρέθηκε!</p>";
        }
        
    });
// 500ms καθυστέρησης back (την έβγαλα την λειτουργικότητα)
    function closeImage() {
        imgElement.classList.remove("show");
        captionElement.classList.remove("show");
        setTimeout(() => history.back(), 500);
    }

    // --- ZOOM FUNCTIONALITY ---
    let scale = 1;
    let startX = 0, startY = 0;
    let originX = 0, originY = 0;
    let isDragging = false;
    

    // Zoom με τροχό ποντικιού
    imgElement.addEventListener("wheel", (e) => {
        e.preventDefault();
        const zoomFactor = 0.1;
        const delta = e.deltaY > 0 ? -zoomFactor : zoomFactor;
        scale = Math.min(Math.max(1, scale + delta), 5);
        setTransform();
    });

    // Drag για μετακίνηση εικόνας
    imgElement.addEventListener("mousedown", (e) => {
        e.preventDefault();
        startX = e.clientX;
        startY = e.clientY;
        isDragging = true;
        function move(e) {
            if (isDragging) {
                originX += (e.clientX - startX) / scale;
                originY += (e.clientY - startY) / scale;
                startX = e.clientX;
                startY = e.clientY;
                setTransform();
            }
        }

        function stop() {
            isDragging = false;
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", stop);
        }

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", stop);
    });

    // Zoom με pinch (για κινητά)
    let initialDistance = null;

    imgElement.addEventListener("touchstart", (e) => {
        if (e.touches.length === 2) {
            initialDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        }
    });

    imgElement.addEventListener("touchmove", (e) => {
        if (e.touches.length === 2 && initialDistance) {
            e.preventDefault();
            let newDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            let zoomFactor = newDistance / initialDistance;
            scale = Math.min(Math.max(1, scale * zoomFactor), 5);
            initialDistance = newDistance;
            setTransform();
        }
    });
function setTransform() {
            imgElement.style.transform = `scale(${scale}) translate(${originX}px, ${originY}px)`;
        }

        // Zoom In
        function zoomIn() {
            scale = Math.min(scale + 0.1, 5);
            setTransform();
        }

        // Zoom Out
        function zoomOut() {
            scale = Math.max(scale - 0.1, 1);
            setTransform();
        }

        // Go Back
        function goBack() {
            history.back();
        }