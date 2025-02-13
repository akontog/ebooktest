window.onload = function () {
    // βελάκι στο navigation menu
    let arrowIcon = null;
    // Πλάτος οθόνης
    const screenWidth = window.innerWidth;

    // άδειο popup που θα εμφανιστεί αν γίνει click σε glossary-term
    termpopup = new TermPopup();
    // άδειο popup που θα εμφανιστεί αν γίνει click σε image
    imagepopup = new ImagePopup();
    // όλα τα popup που δημιουργούνται για κάθε first-glossary-term
    const termpopups = new Map();
    
    // Εντοπισμός όλων των στοιχείων <span class="first-glossary-term">
    const glossaryTerms = document.querySelectorAll('span.first-glossary-term');
    let lastPopupBottom = 0;
    glossaryTerms.forEach((termElement, index) => {
        termText = termElement.textContent;

        const definition = findDefinition(termText, glossary);
        // Δημιουργία αντικειμένου Popup
        const firsttermpopup = new TermPopup(definition, index, true);
        // Προσθήκη στο map
        termpopups.set(firsttermpopup.popupElement, firsttermpopup);
        
        
        const rect = termElement.getBoundingClientRect();
        const popupTop = Math.max(lastPopupBottom + 10, rect.top + window.scrollY);
        xpos = screenWidth * 0.75; // Δεξιά του όρου
        ypos = popupTop; // Στο ύψος του όρου
        firsttermpopup.setPosition(xpos,ypos);
        
        
        lastPopupBottom = popupTop + TermPopup.height;

    });
    
    //imagepopup = new ImagePopup("Εικόνα 2","../Images/chapter1/image2.jpeg","Τρισδιάστατη απεικόνιση ενός υδραίικου βαρκαλά, τοποθετημένου σε σύστημα συντεταγμένων x, y, z.");
    //y = findAvailableY(0,ImagePopup.height);
    //imagepopup.setPosition(screenWidth * 0.75,y);
    
    // Εμφάνιση popup για τον όρο
    function showPopupTerm(termText, clickX, clickY) {
        console.log({termText: termText});
        const definition = findDefinition(termText, glossary);

        // Αν δεν βρεθεί ο όρος, σταματάμε
        if (!definition.term) return;
        
        //popup = new Popup(definition);
        // θέση της λέξης στην οποία έγινε click
        //const termRect = term.getBoundingClientRect();
        //xcoord = termRect.x;
        //ycoord = termRect.top;
        xcoord = clickX;
        ycoord = clickY;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const windowScrollY = window.scrollY;
        
        let posY = windowScrollY+ycoord-20;
        termpopup.newTerm(definition);
        posY = findAvailableY(posY,TermPopup.height);
        termpopup.setPosition(screenWidth * 0.75,posY);
        
        //popup.style.display = 'block';

    }
    // Ψάχνει τον όρο στο λεξικό και επιστρέφει τα δεδομένα του, ορισμό, συνώνυμα κτλ.
    function findDefinition(termText, glossary) {
        let definition = { term: null, data: null };

        glossary.forEach((value, key) => {
            if (key.includes(termText) || termText.includes(key)) {
                definition.term = key;
                definition.data = value;
            }
        });

        return definition;
    }
    
    
    // Συνάρτηση για event listener
    function onBodyClick(event) {
        // Σε ποιο στοιχείο έγινε click
        const clickedElement = event.target;
        // το κεντρικό μενού
        const menu = document.querySelector('.nav-menu'); 
        console.log('onBodyClick: '+clickedElement.textContent.trim());
        if (clickedElement.id === "lightbox") {
            clickedElement.classList.remove("active");
        }
        // click σε όρο
        if (clickedElement.classList.contains('glossary-term')) {
            console.log('click σε glossary-term');
            termText = clickedElement.textContent.trim();
            definition = findDefinition(termText, glossary);
            let clickX = event.clientX;
            let clickY = event.clientY;
            const popupElement = clickedElement.closest('.popup');
            // Έλεγχος αν το clicked στοιχείο είναι μέσα σε popup
            if (!popupElement) {
                
                showPopupTerm(event.target.textContent.trim(), clickX, clickY);
                
            }
            else{
                const pp = termpopups.get(popupElement);
                if (pp){
                    pp.visitTerm(definition);
                }
                else{
                    termpopup.visitTerm(definition);
                }   
            }

            
        }
        // click σε πρωτοεμφανιζόμενο όρο
        else if (clickedElement.classList.contains('first-glossary-term')) {
            console.log('click σε first-glossary-term');
            termText = clickedElement.textContent.trim();
            definition = findDefinition(termText, glossary);
            popupElement = document.getElementById(`popup-${definition.term}`);
            //pp = termpopups.get(popupElement);
            clickedpopup = termpopups.get(popupElement);
            clickedpopup.isVisible = true;
            popupElement.style.display = 'block';
        }
        // click σε link εικόνας TODO
        else if (clickedElement.classList.contains('image-term')) {
            console.log("click in image link ");

        }
        // click για επέκταση εικόνας
        else if (clickedElement.classList.contains('fa-expand-arrows-alt')){
            console.log("fa-expand-arrows-alt");
            let button = clickedElement.closest(".fullscreen-button");
            let imgSrc = button.getAttribute("img-src");

            // Εμφανίζουμε το lightbox
            let lightbox = document.getElementById("lightbox");
            let lightboxImg = document.getElementById("lightbox-img");

            lightboxImg.src = imgSrc;
            lightbox.classList.add("active");
        }
        // click σε εικόνα
        else if (clickedElement.tagName == 'img' || clickedElement.classList.contains('fa-arrow-right')){
            console.log('click σε img');
            //  (στο αρχικό κείμενο και όχι μέσα σε popup)
            let figureElement = clickedElement.closest('figure');
            if (figureElement) {
                console.log("figureElement")
                //const imageId = clickedElement.id;
                //console.log(imageId);
                let imageElement = figureElement.querySelector('img');
                if (imageElement) {
                    const imageId = imageElement.id;
                    const imageData = imageMap.get(imageId);
                    if (imageData) {
                        console.log("Στοιχεία Εικόνας:", imageData);
                    } else {
                        console.log("Η εικόνα δεν βρέθηκε στο Map");
                    }
                    const captionParts = imageData.caption.split(":");
                    const beforeColon = captionParts[0].trim(); // Πριν το ":"
                    const afterColon = captionParts.slice(1).join(":").trim(); // Μετά το ":"
                    let clickY = event.clientY+ window.scrollY;
                    console.log("clickY:", clickY);
                    if (imagepopup!=null){
                        imagepopup.hide();
                    }
                    imagepopup = new ImagePopup(beforeColon,imageData.src,afterColon);
                    ypos = findAvailableY(clickY-50,ImagePopup.height);
                    console.log("ypos:", ypos);
                    
                    xpos = screenWidth * 0.75; // Δεξιά του όρου
                    // = popupTop; // Στο ύψος του όρου
                    imagepopup.setPosition(xpos,ypos);
                    termpopups.forEach((popup, key) => {
                        if (popup.wasVisible) {
                            popup.hide();
                        }
                    });
                }
            }
        }
        // click σε κλείσιμο εικόνας 
        else if (clickedElement.classList.contains('popup-close')) {
            const popupElement = clickedElement.closest('.image-popup');
            if (popupElement) {
                console.log('click σε popup-close εικόνας');
                popupElement.remove();
                imagepopup = null;
                termpopups.forEach((popup, key) => {
                    if (popup.wasVisible) {
                        popup.show();
                    }
                });

            }
        }
        // click στο κεντρικό μενού (αριστερά):
        else if (menu.contains(clickedElement)){
            console.log("click σε menu");
            if (clickedElement.tagName === 'a') {
                console.log("click σε a");
                // Βρίσκουμε το γονικό 'li' στοιχείο
                const parentLi = clickedElement.parentElement;
                const submenu = parentLi.querySelector('ul'); // Βρίσκουμε το υπομενού (αν υπάρχει)

                // Αν υπάρχει υπομενού
                if (submenu) {
                    console.log("υπάρχει υπομενού");
                   
                    // Αν το υπομενού είναι ανοιχτό, το κλείνουμε
                    if (parentLi.classList.contains('open')) {
                        parentLi.classList.remove('open');
                        arrowIcon = clickedElement.querySelector('i');
                        if (arrowIcon) {
                            arrowIcon.classList.remove('fa-angle-down');
                            arrowIcon.classList.add('fa-angle-right');
                        }
                    } else {

                        if (arrowIcon) {
                                console.log('arrow not null');
                                arrowIcon.classList.remove('fa-angle-down');
                                arrowIcon.classList.add('fa-angle-right');
                            }
                        // Κλείνουμε αν κάποιο άλλο είναι ανοιχτό
                        document.querySelectorAll('.nav-menu li.open').forEach(function(openItem) {
                            openItem.classList.remove('open');
                            
                        });
                        arrowIcon = clickedElement.querySelector('i');
                        // Ανοίγουμε το υπομενού
                        parentLi.classList.add('open');
                        if (arrowIcon) {
                            arrowIcon.classList.remove('fa-angle-right');
                            arrowIcon.classList.add('fa-angle-down'); // Βελάκι προς τα κάτω
                        }
                    }
                }
            }
        }
        // Να κλείνει το μη Pinned popup;;
        //else if (!popup.contains(event.target)) {closePopup();}
        
    }
    // Προσθήκη του listener
    document.body.addEventListener('click', onBodyClick);

    // Αν θέλω διαγραφή
    //document.body.removeEventListener('click', onBodyClick);



    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const content = document.querySelector(".content");

    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("open");
        // Εναλλαγή του κειμένου στο κουμπί
        menuToggle.textContent = navMenu.classList.contains("open") ? "◀" : "▶";
    });
    // Βρίσκει την πρώτη διαθέσιμη y συντεταγμένη 
    function findAvailableY(y, height) {
        let newY = y;

        // Ελέγχει όλα τα popups στο map
        for (const popup of termpopups.values()) {
            
            const popupRect = popup.popupElement.getBoundingClientRect();
            console.log({
            id: popup.popupElement.id,
            top: popupRect.top,
            bottom: popupRect.bottom,
            left: popupRect.left,
            right: popupRect.right,
            height: popupRect.height,
            width: popupRect.width,
            });
            // Αν υπάρχει επικάλυψη στο y
            if (
                newY < popupRect.bottom && // Το πάνω του νέου είναι πριν το κάτω του υπάρχοντος
                newY + height > popupRect.top // Το κάτω του νέου είναι μετά το πάνω του υπάρχοντος
            ) {
                
                // Αν υπάρχει επικάλυψη, τοποθετεί το νέο από κάτω
                newY = popupRect.bottom + 10; // Απόσταση 10px από το υπάρχον popup
            }
        }

        return newY;
    }
    const backToTopBtn = document.querySelector(".back-to-top");
    backToTopBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    // αν σκρολάρω
    window.addEventListener("scroll", () => {
        let scrollPosition = window.scrollY; // Παίρνει την κάθετη θέση του scroll
        //console.log("Scroll position:", scrollPosition);
         if (window.scrollY > 300) {
            backToTopBtn.style.display = "flex";
        } else {
            backToTopBtn.style.display = "none";
        }
        if (Popup.centeredPopup !=null){
            console.log("center");
           Popup.centeredPopup.placePopup();
        }
    });
    
    // Αλλαγή μεγέθους
    window.onresize = function() {
        console.log("resize");
    }
};
