class ImagePopup  extends Popup{
    static height = 300; // ύψος όπως έχει τεθεί με CSS
    constructor(title, imageUrl, caption) {
        super();
        this.isfixed = false;
        this.title = title;
        this.imageUrl = imageUrl; // URL της εικόνας
        this.caption = caption;  // Λεζάντα
        this.popupElement = document.createElement('div');
        this.createPopupElement();
        document.body.appendChild(this.popupElement);
        this.popupElement.style.display="none";
    }

    // Δημιουργία DOM στοιχείου για το popup
    createPopupElement() {
        super.createPopupElement();
        this.popupElement.className = 'image-popup';
        
        this.popupHeader = document.createElement('div');
        this.popupHeader.className = 'popup-header';

        this.popupTitle = document.createElement('h3');
        this.popupTitle.className = 'popup-title';
        this.popupTitle.textContent = this.title;

        this.popupMenu = document.createElement('div');
        this.popupMenu.className = 'popup-menu';

        this.moveButton = document.createElement('button');
        this.moveButton.className = 'popup-center';
        this.moveButton.setAttribute('aria-label', 'Κέντρο');
        this.moveButton.innerHTML = '<i class="fa-solid fa-up-right-and-down-left-from-center"></i>';

        
        // Προσθήκη κουμπιού για την "fixed-unfixed" κατάσταση
        this.fixedButton = document.createElement('button');
        this.fixedButton.className = 'popup-unfixed';
        this.fixedButton.setAttribute('aria-label', 'Unfixed');
        // Εικονίδιο κλειστής κλειδαριάς
        this.fixedButton.innerHTML = '<i class="fa-solid fa-lock"></i>';  
        
        // Δημιουργία κουμπιού κλεισίματος
        this.closeButton = document.createElement('button');
        this.closeButton.className = 'popup-close';
        this.closeButton.setAttribute('aria-label', 'Κλείσιμο');
        this.closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        
        this.popupMenu.appendChild(this.moveButton);
        this.popupMenu.appendChild(this.fixedButton);
        this.popupMenu.appendChild(this.closeButton);

        // Προσθήκη τίτλου και menu στο header
        this.popupHeader.appendChild(this.popupTitle);
        this.popupHeader.appendChild(this.popupMenu);

        this.imageDivElemet = document.createElement('div');
        this.imageDivElemet.className = 'image-popup-image-wrapper';
        this.imageElement = document.createElement('img');
        this.imageElement.src = this.imageUrl;
        this.imageElement.alt = 'Image Popup';
        this.imageElement.className = 'image-popup-image';
        this.imageDivElemet.appendChild(this.imageElement);

        // Δημιουργία της λεζάντας
        this.captionElement = document.createElement('div');
        this.captionElement.className = 'image-popup-caption';
        this.captionElement.textContent = this.caption;


        // Προσθήκη στοιχείων στο popup
        this.popupElement.appendChild(this.popupHeader);
        this.popupElement.appendChild(this.imageDivElemet);
        this.popupElement.appendChild(this.captionElement);
        this.addEventListeners(this.popupElement);
    }
    // Προσθήκη event listeners για τα κουμπιά
    addEventListeners() {
        super.addEventListeners();
        this.fixedButton.addEventListener('click', () => this.fixPopup());

    }
    // Τοποθέτηση popup στη σωστή θέση
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.popupElement.style.display = 'block';
        this.popupElement.style.position = 'absolute';
        this.popupElement.style.left = `${x}px`;
        this.popupElement.style.top = `${y}px`;
    }
    fixPopup(){
        this.popupElement.style.transition = 'none';
        if (this.isfixed==false) {
            this.isfixed=true;
            const rect = this.popupElement.getBoundingClientRect();
            // Αλλαγή σε "unfixed" (absolute)
            this.popupElement.style.position = 'fixed';
            this.popupElement.style.left = `${rect.left}px`; // Οριζόντια θέση στην οθόνη
        this.popupElement.style.top = `${rect.top}px`;
            this.fixedButton.innerHTML = '<i class="fa-solid fa-lock-open"></i>';
            
        } else {
            this.isfixed=false;
            // Αλλαγή σε "fixed"
            this.popupElement.style.position = 'absolute';
            this.popupElement.style.left = `${this.x}px`;
            this.popupElement.style.top = `${this.y}px`;
            this.fixedButton.innerHTML = '<i class="fa-solid fa-lock"></i>';
        }
    }
    
    // Αν είναι ορατό ή όχι το popup
    isVisible() {
        return this.popupElement.style.display !== 'none';
    }

    
}
