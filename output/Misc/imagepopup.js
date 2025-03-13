class ImagePopup  extends Popup{
    static height = 300; // ύψος όπως έχει τεθεί με CSS
    constructor(title, imageUrl, caption) {
        super();
        this.isfixed = false;
        this.title = title;
        this.imageUrl = imageUrl; // URL της εικόνας
        this.caption = caption;  // Λεζάντα
        this.createPopupElement();
        document.body.appendChild(this.popupElement);
        this.popupElement.style.display="none";
        // Προσθήκη του popup στο DOM
        const sidebarRight = document.querySelector('.sidebar-right');
        sidebarRight.appendChild(this.popupElement);
    }

    // Δημιουργία DOM στοιχείου για το popup
    createPopupElement() {
        super.createPopupElement();
        this.popupElement.className = 'popup';
        
        this.popupHeader = document.createElement('div');
        this.popupHeader.className = 'popup-header';

        this.popupMenu = document.createElement('div');
        this.popupMenu.className = 'popup-menu';

        this.moveButton = document.createElement('button');
        this.moveButton.className = 'popup-center';
        this.moveButton.setAttribute('aria-label', 'Κέντρο');
        this.moveButton.innerHTML = '<i class="fa-solid fa-up-right-and-down-left-from-center"></i>';
        this.popupMenu.appendChild(this.moveButton);
        
        // Προσθήκη κουμπιού για την "fixed-unfixed" κατάσταση
        this.fixedButton = document.createElement('button');
        this.fixedButton.className = 'popup-unfixed';
        this.fixedButton.setAttribute('aria-label', 'Unfixed');
        // Εικονίδιο κλειστής κλειδαριάς
        this.fixedButton.innerHTML = '<i class="fa-solid fa-lock"></i>';  
        this.popupMenu.appendChild(this.fixedButton);
        
        // Δημιουργία κουμπιού κλεισίματος
        this.closeButton = document.createElement('button');
        this.closeButton.className = 'popup-close';
        this.closeButton.setAttribute('aria-label', 'Κλείσιμο');
        this.closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        this.popupMenu.appendChild(this.closeButton);

        this.popupTitle = document.createElement('h3');
        this.popupTitle.className = 'popup-title';
        this.popupTitle.textContent = this.title;

        // Προσθήκη menu και τίτλου στο header
        this.popupHeader.appendChild(this.popupMenu);
        this.popupHeader.appendChild(this.popupTitle);
        

        this.popupContent = document.createElement('div');
        this.popupContent.className = 'popup-content';


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

        this.popupContent.appendChild(this.imageDivElemet);
        this.popupContent.appendChild(this.captionElement);
        
        // Προσθήκη στοιχείων στο popup
        this.popupElement.appendChild(this.popupHeader);
        this.popupElement.appendChild(this.popupContent);
        this.addEventListeners(this.popupElement);
    }
    // Προσθήκη event listeners για τα κουμπιά
    addEventListeners() {
        super.addEventListeners();
        this.fixedButton.addEventListener('click', () => this.fixPopup());
    }
    fixPopup(){
        this.popupElement.style.transition = 'none';
        if (this.isfixed==false) {
            this.isfixed=true;
            const rect = this.popupElement.getBoundingClientRect();
            // Αλλαγή σε "unfixed" (absolute)
            this.popupElement.style.position = 'fixed';
            this.popupElement.style.top = `${rect.top}px`;
            this.fixedButton.innerHTML = '<i class="fa-solid fa-lock-open"></i>';
            
        } else {
            this.isfixed=false;
            // Αλλαγή σε "fixed"
            this.popupElement.style.position = 'absolute';
            this.popupElement.style.top = `${this.y}px`;
            this.fixedButton.innerHTML = '<i class="fa-solid fa-lock"></i>';
        }
    }
    
    
}
