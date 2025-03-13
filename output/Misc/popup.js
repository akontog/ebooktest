class Popup{
	static height = 200; // ύψος όπως έχει τεθεί με CSS
    static padding = 20; // padding όπως έχει τεθεί με CSS
    // κεντραρισμένο popup, μπορεί να είναι μόνο ένα:
    static centeredPopup = null;
	constructor(){
		// Αν ήταν ορατό πριν κρυφτεί για να εμφανιστεί κάποιο image
		this.wasVisible = true;
        this.popupElement = document.createElement('div');
	}

	createPopupElement(){

	}
	// Προσθήκη event listeners για τα κουμπιά
    addEventListeners() {
    	this.closeButton.addEventListener('click', () => this.closePopup());
    	//this.moveButton.addEventListener('click', () => this.placePopup());
        //this.moveButton.addEventListener('click', () => this.openImagePage());
    }
	
    // Ενημέρωση της θέσης του popup
    setPosition(y) {
        this.y = y;
        this.popupElement.style.position = 'absolute';
        this.popupElement.style.top = `${y}px`;
        this.popupElement.style.display = 'block';
    }
	

	show() {
        this.popupElement.style.display = "block";
    }

    hide() {
        this.popupElement.style.display = "none";
    }
    
    // Κλείσιμο του popup
    closePopup() {
        this.wasVisible = false;
        this.popupElement.style.display = 'none';
    }

    // Αν είναι ορατό ή όχι το popup
    isVisible() {
        return this.popupElement.style.display !== 'none';
    }
}