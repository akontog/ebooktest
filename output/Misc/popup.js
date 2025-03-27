class Popup{
    // αν, συνολικά τα popups θα φαίνονται ή όχι όπως έχει επιλεγεί από το toggle
    static togglevisible = true; 
    // αν συνολικά τα popups θα φαίνονται ή όχι σε σχέση με Pinned image
    static imagevisible = true;
    // ύψος όπως έχει τεθεί με CSS
	static height = 200; 
    // padding όπως έχει τεθεί με CSS
    static padding = 20; 
    // κεντραρισμένο popup, μπορεί να είναι μόνο ένα:
    static centeredPopup = null;
	constructor(){
		// Αν το συγκεκριμένο είναι επιλεγμένο να είναι ορατό
		this.isVisible = true;
        this.popupElement = document.createElement('div');
	}

	createPopupElement(){

	}
	// Προσθήκη event listeners για τα κουμπιά
    addEventListeners() {
    	this.closeButton.addEventListener('click', () => this.closePopup());
    	//this.moveButton.addEventListener('click', () => this.placePopup());
        //this.moveButton.addEventListener('click', () => this.openImagePage());
        this.expandButton.addEventListener('click', () => this.expand())
    }
	
    // Ενημέρωση της θέσης του popup
    setPosition(y) {
        this.y = y;
        this.popupElement.style.top = `${y}px`;
        
    }
	
	show() {
        this.popupElement.style.display = "block";
    }

    hide(){
        this.popupElement.style.display = "none";
    }
    // Θέτει την κατάσταση του popup
    toggle(){
        if (this.isVisible && Popup.togglevisible && Popup.imagevisible)
            this.show();
        else
            this.hide();
    }
    // Αν είναι ορατό ή όχι το popup
    isVisible() {
        return this.popupElement.style.display !== 'none';
    }
    closePopup(){
        
        this.isVisible = false;
        this.toggle();
    }
    expand(){
        console.log('expand popup')
    }
}