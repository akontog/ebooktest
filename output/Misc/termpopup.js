class TermPopup extends Popup{
    constructor(definition={}, index = null,ispinned=false) {
        super();

        this.index = index; // Μοναδικός δείκτης
        this.history = [definition]; // Ιστορικό όρων
        this.currentIndex = 0; // Τρέχον σημείο στο ιστορικό
        this.ispinned = ispinned;
        
        
        this.createPopupElement();
        // Προσθήκη περιεχομένου
        if (ispinned)
            this.updatePopupContent(definition);
        else
            this.popupElement.style.display="none";
        // Προσθήκη του popup στο DOM
        const sidebarRight = document.querySelector('.sidebar-right');
        sidebarRight.appendChild(this.popupElement);
        //document.body.appendChild(this.popupElement);
        this.updateNavigationButtons();
    }
    // Δημιουργία του popup DOM στοιχείου
    createPopupElement() {
        super.createPopupElement();
        this.popupElement.className = 'popup';
        if (this.ispinned){
            this.popupElement.classList.add('popup-pinned');
            this.popupElement.id = `popup-${this.history[this.currentIndex].term}`;
        }
        

        // Δημιουργία του header
        this.popupHeader = document.createElement('div');
        this.popupHeader.className = 'popup-header';

        
        this.popupMenu = document.createElement('div');
        this.popupMenu.className = 'popup-menu';

        this.homeButton = document.createElement('button');
        this.homeButton.className = 'popup-home';
        this.homeButton.setAttribute('aria-label', 'Αρχική');
        this.homeButton.innerHTML = '<i class="fa-solid fa-house"></i>';
        this.popupMenu.appendChild(this.homeButton);
        
        this.backButton = document.createElement('button');
        this.backButton.className = 'popup-back';
        this.backButton.setAttribute('aria-label', 'Πίσω');
        this.backButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
        this.popupMenu.appendChild(this.backButton);
        
        
        this.forwardButton = document.createElement('button');
        this.forwardButton.className = 'popup-forward';
        this.forwardButton.setAttribute('aria-label', 'Μπροστά');
        this.forwardButton.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
        this.popupMenu.appendChild(this.forwardButton);
        
        this.moveButton = document.createElement('button');
        this.moveButton.className = 'popup-center';
        this.moveButton.setAttribute('aria-label', 'Κέντρο');
        this.moveButton.innerHTML = '<i class="fa-solid fa-up-right-and-down-left-from-center"></i>';
        this.popupMenu.appendChild(this.moveButton);
        

        this.closeButton = document.createElement('button');
        this.closeButton.className = 'popup-close';
        this.closeButton.setAttribute('aria-label', 'Κλείσιμο');
        this.closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        this.popupMenu.appendChild(this.closeButton);
        

        this.popupTitle = document.createElement('h3');
        this.popupTitle.className = 'popup-title';


        this.popupCategory = document.createElement('div');
        this.popupCategory.className = 'popup-category';


        // Προσθήκη menu, title, category στο header
        this.popupHeader.appendChild(this.popupMenu);
        this.popupHeader.appendChild(this.popupTitle);
        this.popupHeader.appendChild(this.popupCategory);
        

        // Δημιουργία του περιεχομένου
        this.popupContent = document.createElement('div');
        this.popupContent.className = 'popup-content';

        
        this.popupDefinition = document.createElement('div');
        this.popupDefinition.className = 'popup-definition';

        
        this.popupSynonyms = document.createElement('div');
        this.popupSynonyms.className = 'popup-synonyms';
        //this.popupSynonyms.id = `popup-synonyms`;
        
        this.popupAntonyms = document.createElement('div');
        this.popupAntonyms.className = 'popup-antonyms';
        //this.popupAntonyms.id = `popup-antonyms`;


        this.imageDivElemet = document.createElement('div');
        this.imageDivElemet.className = 'image-popup-image-wrapper';
        // Αν ο όρος περιλαμβάνει και εικόνα
        if (this.history[this.currentIndex].data?.design || this.history[this.currentIndex].data?.photo){
            this.imageElement = document.createElement('img');
            this.imageElement.alt = 'Image Popup';
            this.imageElement.className = 'image-popup-image';
            this.imageDivElemet.appendChild(this.imageElement);
        
            this.imageElement.src = this.history[this.currentIndex].data?.path;
            this.imageUrl = this.history[this.currentIndex].data?.path;
            this.caption = this.history[this.currentIndex].term+':'+this.history[this.currentIndex].data?.definition;
            this.imageDivElemet.classList.remove('hidden');
            this.moveButton.classList.remove('hidden');
        }
        else{
            this.imageDivElemet.classList.add('hidden');
            this.moveButton.classList.add('hidden');
        }


        // Προσθήκη περιεχομένου στο content
        this.popupContent.appendChild(this.popupDefinition);
        this.popupContent.appendChild(this.popupSynonyms);
        this.popupContent.appendChild(this.popupAntonyms);

        // Δημιουργία container για το περιεχόμενο και τη δεξιά στήλη
        this.popupMainContent = document.createElement('div');
        this.popupMainContent.className = 'popup-main-content';
        this.popupMainContent.appendChild(this.popupContent);
        this.popupMainContent.appendChild(this.imageDivElemet);

        // Προσθήκη header, content, sidebar στο popup
        this.popupElement.appendChild(this.popupHeader);
        this.popupElement.appendChild(this.popupMainContent);

        this.addEventListeners();
    }

    // Προσθήκη event listeners για τα κουμπιά
    addEventListeners() {
        super.addEventListeners();
        this.homeButton.addEventListener('click', () => this.navigateHistory(0));
        this.backButton.addEventListener('click', () => this.navigateHistory(-1));
        this.forwardButton.addEventListener('click', () => this.navigateHistory(1));
        
    }

    // Πλοήγηση στο ιστορικό
    navigateHistory(direction) {
        if (direction==0){
            this.currentIndex = 0; // Τρέχον σημείο στο ιστορικό
            this.history = [this.history[this.currentIndex]];
            
            this.updatePopupContent(this.history[this.currentIndex]);
            return;
        }
        const newIndex = this.currentIndex + direction;
        if (newIndex >= 0 && newIndex < this.history.length) {
            this.currentIndex = newIndex;
            console.log({
                direction:direction,
                newIndex:newIndex,
                length:this.history.length,
                currentIndex:this.currentIndex
            })
            
            this.updatePopupContent(this.history[this.currentIndex]);
        }
    }
    // νέος όρος όταν πρόκειται για το μη pinned popup
    newTerm(definition){
        this.history = [definition]; // Ιστορικό όρων
        this.currentIndex = 0;
        this.updatePopupContent(definition);
        this.popupElement.style = "block";
    }
    // Επίσκεψη όρου
    visitTerm(definition){
        // Αφαίρεση όλων των στοιχείων μπροστά από το this.currentIndex
        this.history = this.history.slice(0, this.currentIndex + 1);
        this.history.push(definition);
        this.currentIndex = this.history.length - 1;
        this.updatePopupContent(definition);
    }
    // Ενημέρωση του περιεχομένου του popup
    updatePopupContent(definition) {
        this.popupTitle.textContent = this.history[this.currentIndex].term;
        this.popupDefinition.innerHTML  = this.history[this.currentIndex].data?.definition || 'Δεν υπάρχει ορισμός';
        this.popupCategory.textContent = this.history[this.currentIndex].data?.category || 'Χωρίς κατηγορία';
        if (this.history[this.currentIndex].data?.synonyms?.length > 0){
            this.setList(this.history[this.currentIndex].data?.synonyms,this.popupSynonyms,'Συνώνυμα: ');
            this.popupSynonyms.classList.remove('hidden');
        }
        else{
            this.popupSynonyms.classList.add('hidden');
        }
        if (this.history[this.currentIndex].data?.antonyms?.length > 0) {
            this.setList(this.history[this.currentIndex].data?.antonyms,this.popupAntonyms,'Αντίθετα: ');
            this.popupAntonyms.classList.remove('hidden');
        }
        else{
            this.popupAntonyms.classList.add('hidden');
        }
        if (this.history[this.currentIndex].data?.design || this.history[this.currentIndex].data?.photo){
            this.imageElement.src = this.history[this.currentIndex].data?.path;
            this.imageUrl = this.history[this.currentIndex].data?.path;
            this.caption = this.history[this.currentIndex].term+':'+this.history[this.currentIndex].data?.definition;
            
            this.imageDivElemet.classList.remove('hidden');
            this.moveButton.classList.remove('hidden');
        }
        else{
            this.imageDivElemet.classList.add('hidden');
            this.moveButton.classList.add('hidden');
        }
        this.updateNavigationButtons();
    }

    setList(list,popuplist,title){
        popuplist.innerHTML = title;
        list.forEach((element) => {
            const span = document.createElement('span');
            span.textContent = element;
            span.classList.add('glossary-term');
            //span.style.cursor = 'pointer';
            //span.addEventListener('click', () => {
            //    this.visitTerm(synonym);
            //});
            popuplist.appendChild(span);
            popuplist.appendChild(document.createTextNode(', '));
        });

        if (popuplist.lastChild) {
            popuplist.lastChild.remove(); // Αφαίρεση τελευταίου κόμματος
        }
    }
    // ενεργοποίηση/απενεργοποίηση κουμπιών για πλοήγηση στο ιστορικό όρων
    updateNavigationButtons() {
        this.homeButton.disabled = this.currentIndex == 0;
        this.backButton.disabled = this.currentIndex <= 0;
        this.forwardButton.disabled = this.currentIndex >= this.history.length - 1;

    }
}
