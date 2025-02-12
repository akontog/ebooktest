class Popup{
	// κεντραρισμένο popup, μπορεί να είναι μόνο ένα:
    static centeredPopup = null;
	constructor(){
		// Αν ήταν ορατό πριν κρυφτεί για να εμφανιστεί κάποιο image
		this.wasVisible = true;
		

	}
	createPopupElement(){

	}

	// Προσθήκη event listeners για τα κουμπιά
    addEventListeners() {
    	this.closeButton.addEventListener('click', () => this.closePopup());
    	//this.moveButton.addEventListener('click', () => this.placePopup());
        this.moveButton.addEventListener('click', () => this.openImagePage());
    }
	

	

	show() {
        this.popupElement.style.display = "block";
    }

    hide() {
        this.popupElement.style.display = "none";
    }
    openImagePage() {
        window.location.href = `fullscreen-image.xhtml?img=${this.imageUrl}&caption=${this.caption}`;
    }

        // Κλείσιμο του popup
    closePopup() {
        this.wasVisible = false;
        this.popupElement.style.display = 'none';
    }
}