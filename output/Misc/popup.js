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
	addZoomButtons() {
	    // Δημιουργία κουμπιού zoom in
	    const zoomInButton = document.createElement('button');
	    zoomInButton.innerHTML = '&#x2795;';
	    zoomInButton.classList.add('zoom-button');
	    zoomInButton.onclick = () => this.zoomIn();

	    // Δημιουργία κουμπιού zoom out
	    const zoomOutButton = document.createElement('button');
	    zoomOutButton.innerHTML = '&#x2796;';
	    zoomOutButton.classList.add('zoom-button');
	    zoomOutButton.onclick = () => this.zoomOut();

	    // Προσθήκη των κουμπιών στο popup
	    this.popupMenu.appendChild(zoomInButton);
	    this.popupMenu.appendChild(zoomOutButton);
	}

	removeZoomButtons() {
	    // Αφαίρεση των κουμπιών zoom in και zoom out
	    const zoomButtons = this.popupMenu.querySelectorAll('.zoom-button');
	    zoomButtons.forEach(button => button.remove());
	}

	zoomIn() {
	    let currentWidth = this.imageElement.offsetWidth;
	    //let currentHeight = this.imageElement.offsetHeight;

	    // Αύξηση του μεγέθους του popup
	    this.imageElement.style.width = `${currentWidth * 1.1}px`;
	    //this.imageElement.style.height = `${currentHeight * 1.1}px`;
	}

	zoomOut() {
	    let currentWidth = this.imageElement.offsetWidth;
	    //let currentHeight = this.imageElement.offsetHeight;

	    // Μείωση του μεγέθους του popup
	    this.imageElement.style.width = `${currentWidth * 0.9}px`;
	    //this.imageElement.style.height = `${currentHeight * 0.9}px`;
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