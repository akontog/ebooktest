class ImagePopup  extends Popup{
    static height = 300; // ύψος όπως έχει τεθεί με CSS
    constructor(termpopups) {
        super();
        this.termpopups = termpopups;
        this.createPopupElement();
        // Βρες το sidebar
        let sidebar = document.querySelector('.sidebar-right');

        
        // Υπολόγισε τη μέση του sidebar
        let sidebarRect = sidebar.getBoundingClientRect();
        let centerX = sidebarRect.left + sidebarRect.width / 2;

        // Ορισμός θέσης popup
        this.popupElement.style.display="none";
        this.popupElement.style.position = 'fixed';
        this.popupElement.style.top = '50%';
        this.popupElement.style.left = `${centerX}px`;
        this.popupElement.style.transform = 'translate(-50%, -50%)'; // Κεντράρει και στους 2 άξονες
        
        //this.y = (window.innerHeight - Popup.height) / 2 + window.scrollY-100;
        //this.popupElement.style.top = `${this.y}px`;
        // Προσθήκη του popup στο DOM
        const sidebarRight = document.querySelector('.sidebar-right');
        sidebarRight.appendChild(this.popupElement);
    }
    // Θέτει τις πληροφορίες της εικόνας
    setImageInfo(title, imageUrl, caption){
        this.title = title;
        this.imageUrl = imageUrl; // URL της εικόνας
        this.caption = caption;  // Λεζάντα
        this.popupTitle.textContent = this.title;
        this.imageElement.src = this.imageUrl;
        this.captionElement.textContent = this.caption;
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
        this.moveButton.innerHTML = '<i class="fa-solid fa-expand-arrows-alt"></i>';
        this.popupMenu.appendChild(this.moveButton);
        
        // Προσθήκη κουμπιού για την "fixed-unfixed" κατάσταση
        //this.fixedButton = document.createElement('button');
        //this.fixedButton.className = 'popup-unfixed';
        //this.fixedButton.setAttribute('aria-label', 'Unfixed');
        // Εικονίδιο κλειστής κλειδαριάς
        //this.fixedButton.innerHTML = '<i class="fa-solid fa-lock-open"></i>';  
        //this.popupMenu.appendChild(this.fixedButton);
        
        // Δημιουργία κουμπιού κλεισίματος
        this.closeButton = document.createElement('button');
        this.closeButton.className = 'popup-close';
        this.closeButton.setAttribute('aria-label', 'Κλείσιμο');
        this.closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        this.popupMenu.appendChild(this.closeButton);

        this.popupTitle = document.createElement('h3');
        this.popupTitle.className = 'popup-title';
        

        // Προσθήκη menu και τίτλου στο header
        this.popupHeader.appendChild(this.popupMenu);
        this.popupHeader.appendChild(this.popupTitle);
        

        this.popupContent = document.createElement('div');
        this.popupContent.className = 'popup-content';


        this.imageDivElemet = document.createElement('div');
        this.imageDivElemet.className = 'image-popup-image-wrapper';
        this.imageElement = document.createElement('img');
        
        this.imageElement.alt = 'Image Popup';
        this.imageElement.className = 'image-popup-image';
        this.imageDivElemet.appendChild(this.imageElement);

        // Δημιουργία της λεζάντας
        this.captionElement = document.createElement('div');
        this.captionElement.className = 'image-popup-caption';
        

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
        //this.fixedButton.addEventListener('click', () => this.fixPopup());
    }
    
    
    closePopup(){
        this.isVisible = false;
        Popup.imagevisible = true;
        this.termpopups.forEach((popup, key) => {
            popup.toggle();
        });
        this.toggle();
    }
}
