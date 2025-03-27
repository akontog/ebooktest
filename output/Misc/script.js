window.onload = function () {
    // βελάκι στο navigation menu
    let arrowIcon = null;
    // Πλάτος οθόνης
    const screenWidth = window.innerWidth;

    // map με όλα τα popup που δημιουργούνται για κάθε first-glossary-term
    const termpopups = new Map();
    // άδειο popup που θα εμφανιστεί αν γίνει click σε glossary-term
    termpopup = new TermPopup();
    //termpopup.popupElement.style.position = 'absolute';
    termpopup.popupElement.style.display = 'none';
    // άδειο popup που θα εμφανιστεί αν γίνει click σε image
    imagepopup = new ImagePopup(termpopups);
    
    
    // Εντοπισμός όλων των στοιχείων <span class="first-glossary-term">
    const glossaryTerms = document.querySelectorAll('span.first-glossary-term');
    let lastPopupBottom = 0;
    glossaryTerms.forEach((termElement, index) => {
        termText = termElement.textContent;

        const definition = findDefinition(termText, glossary);
        // Δημιουργία αντικειμένου Popup
        const firsttermpopup = new TermPopup(definition, index, true);
        // Προσθήκη στο map
        // κλειδί το στοιχείο popup
        termpopups.set(firsttermpopup.popupElement, firsttermpopup);
        // κλειδί το στοιχείο του όρου.
        //termpopups.set(termElement, firsttermpopup);
        
        const rect = termElement.getBoundingClientRect();
        console.log('rect.top:'+rect.top)
        const popupTop = Math.max(lastPopupBottom + 10, rect.top + window.scrollY-TermPopup.height); ///2);
        
        ypos = popupTop; // Στο ύψος του όρου
        firsttermpopup.setPosition(ypos);
        //firsttermpopup.popupElement.style.position = 'absolute';
        lastPopupBottom = popupTop + TermPopup.height+ TermPopup.padding*2;

    });
    
    // Εμφάνιση popup για τον όρο
    function showPopupTerm(termText,clickY) {
        //console.log({termText: termText});
        const definition = findDefinition(termText, glossary);

        // Αν δεν βρεθεί ο όρος, σταματάμε
        if (!definition.term) return;
        
        ycoord = clickY;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const windowScrollY = window.scrollY;
        
        let posY = windowScrollY+ycoord;
        termpopup.newTerm(definition);
        posY = findAvailableY(posY,TermPopup.height);
        termpopup.setPosition(posY);
        console.log('in showPopupTerm'+posY)
        
        termpopup.popupElement.style.display = 'flex';

    }
    
    
    // Συνάρτηση για event listener - click οπουδήποτε στο body
    function onBodyClick(event) {
        // Σε ποιο στοιχείο έγινε click
        const clickedElement = event.target;
        // το κεντρικό μενού
        const menu = document.querySelector('.nav-menu'); 
        //console.log('onBodyClick: '+clickedElement.textContent.trim());
        // click σε εικόνα που πιάνει όλη την οθόνη <- κλείσιμο εικόνας
        if (clickedElement.id === "lightbox") {
            console.log('click -> lightbox');
            clickedElement.classList.remove("active");
            // Επανεμφάνιση των κουμπιών
            document.querySelectorAll(".toggle").forEach(btn => btn.classList.remove("hidden"));
        }
        // click σε όρο <- εμφάνιση popup δεξιά
        if (clickedElement.classList.contains('glossary-term')) {
            console.log('click -> glossary-term');
            termText = clickedElement.textContent.trim();
            definition = findDefinition(termText, glossary);
            let clickY = event.clientY;
            const popupElement = clickedElement.closest('.popup');
            // Έλεγχος αν το clicked στοιχείο είναι μέσα σε popup
            if (!popupElement) {
                showPopupTerm(event.target.textContent.trim(), clickY-15);
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
        // click σε πρωτοεμφανιζόμενο όρο <-
        else if (clickedElement.classList.contains('first-glossary-term')) {
            console.log('click -> first-glossary-term');
            termText = clickedElement.textContent.trim();
            definition = findDefinition(termText, glossary);
            popupElement = document.getElementById(`popup-${definition.term}`);
            clickedpopup = termpopups.get(popupElement);
            clickedpopup.isVisible = !clickedpopup.isVisible;
            clickedpopup.toggle();
        }
        // click σε link για εικόνα  <- TODO
        else if (clickedElement.classList.contains('image-term')) {
            console.log("click -> image link ");
        }
        // click σε κουμπί expand εικόνας  <- εικόνα σε lightbox 
        else if (clickedElement.tagName == 'img' || clickedElement.classList.contains('fa-expand-arrows-alt')){
            console.log("click -> expand εικόνας");

            let imgSrc = "";
            let caption = "";
            // Ελέγχουμε αν το κλικ έγινε σε εικόνα που βρίσκεται μέσα σε figure
            let figure = clickedElement.closest("figure");
            if (figure) {
                imgSrc = figure.querySelector("img")?.src || "";
                caption = figure.querySelector("figcaption")?.innerHTML.trim() || "";
            }
            // Ελέγχουμε αν προέρχεται από κουμπί fullscreen-button
            let button = clickedElement.closest(".fullscreen-button");
            if (button) {
                imgSrc = button.getAttribute("img-src");

                // Βρίσκουμε το figcaption μέσα στο figure
                let figure = button.closest("figure");
                caption = figure ? figure.querySelector("figcaption")?.innerHTML.trim() : "";
            }

            // Ελέγχουμε αν προέρχεται από popup
            let popupButton = clickedElement.closest(".popup-expand, .popup-center");
            if (popupButton) {
                let popup = popupButton.closest(".popup");
                let imgElement = popup.querySelector(".image-popup-image");
                let captionElement = popup.querySelector(".image-popup-caption, .popup-title"); // Δοκιμάζουμε και popup-title

                imgSrc = imgElement ? imgElement.src : "";
                caption = captionElement ? captionElement.innerHTML.trim() : "";
            }

            // Ελέγχουμε αν προέρχεται από popup-pinned
            let pinnedPopup = clickedElement.closest(".popup-pinned");
            if (pinnedPopup) {
                let imgElement = pinnedPopup.querySelector(".image-popup-image");
                let titleElement = pinnedPopup.querySelector(".popup-title");

                imgSrc = imgElement ? imgElement.src : "";
                caption = titleElement ? titleElement.innerHTML.trim() : "";
            }

            // Αν δεν βρήκαμε εικόνα, δεν κάνουμε τίποτα
            if (!imgSrc) {
                console.warn("Δεν βρέθηκε εικόνα για προβολή στο lightbox.");
                return;
            }

            // Εμφανίζουμε το lightbox
            let lightbox = document.getElementById("lightbox");
            let lightboxImg = document.getElementById("lightbox-img");
            let lightboxCaption = document.getElementById("lightbox-caption");

            lightboxImg.src = imgSrc;
            lightboxCaption.innerHTML = caption;
            lightbox.classList.add("active");

            // Κρύβουμε τα toggle κουμπιά
            document.querySelectorAll(".toggle").forEach(btn => btn.classList.add("hidden"));
        }
        // click για παράθεση εικόνας δεξιά  <-
        else if (clickedElement.classList.contains('fa-arrow-right')){
            console.log('click - img');
            //  (στο αρχικό κείμενο και όχι μέσα σε popup)
            let figureElement = clickedElement.closest('figure');
            if (figureElement) {
                //console.log("figureElement")
                //const imageId = clickedElement.id;
                //console.log(imageId);
                let imageElement = figureElement.querySelector('img');
                //imageTop = imageElement.getBoundingClientRect().top + window.scrollY;
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
                    //let clickY = event.clientY+ window.scrollY-40;
                    //console.log("clickY:", clickY);
                    //if (imagepopup!=null){
                     //   imagepopup.hide();
                    //}
                    //imagepopup = new ImagePopup(beforeColon,imageData.src,afterColon);
                    imagepopup.setImageInfo(beforeColon,imageData.src,afterColon);
                    //ypos = findAvailableY(clickY-50,ImagePopup.height);
                    //console.log("ypos:", ypos);
                    //imagepopup.setPosition(imageTop);
                    Popup.imagevisible = false;
                    termpopups.forEach((popup, key) => {
                        popup.toggle();
                    });
                    imagepopup.show();

                    //imagepopup.fixPopup();
                }
            }
        }
        // click σε κλείσιμο εικόνας 
        else if (clickedElement.classList.contains('popup-close')) {
            console.log('click σε popup-close εικόνας');
            const popupElement = clickedElement.closest('.image-popup');
            if (popupElement) {
                
                popupElement.remove();
                imagepopup = null;
                Popup.imagevisible = false;
                termpopups.forEach((popup, key) => {
                    popup.toggle();
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
    
    // Βρίσκει την πρώτη διαθέσιμη y συντεταγμένη 
    function findAvailableY(y, height) {
        let newY = y;

        // Ελέγχει όλα τα popups στο map
        for (const popup of termpopups.values()) {
            
            const popupRect = popup.popupElement.getBoundingClientRect();
            
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

    /** Κουμπί εμφάνισης/απόκρυψης κεντρικού μενού στο πάνω μέρος της ιστοσελίδας **/
    const menuToggle = document.querySelector(".navmenutoggle");
    const navMenu = document.querySelector(".nav-menu");
    //const content = document.querySelector(".content");
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("open");
        // Εναλλαγή του κειμένου στο κουμπί
        //menuToggle.textContent = navMenu.classList.contains("open") ? "◀" : "▶";
    });

    /** Κουμπί εμφάνισης/απόκρυψης popups **/
    const popupToggle = document.querySelector(".popupstoggle");
    popupToggle.addEventListener("click", () => {
        console.log('open-close');
        //popupToggle.textContent = Popup.togglevisible ? "◀" : "▶";
        showPopups(!Popup.togglevisible);
    });

    /** Κουμπί επιστροφής στο πάνω μέρος της ιστοσελίδας **/
    const backToTopToggle = document.querySelector(".backtotoptoggle");
    backToTopToggle.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    /** Σκρολάρισμα οθόνης **/
    window.addEventListener("scroll", () => {
        let scrollPosition = window.scrollY; // Παίρνει την κάθετη θέση του scroll
        //console.log("Scroll position:", scrollPosition);
         if (window.scrollY > 300) {
            backToTopToggle.style.display = "flex";
        } else {
            backToTopToggle.style.display = "none";
        }
        // TODO: τι να κάνω με το popup - να το εξαφανίζω;
        //if (Popup.centeredPopup !=null){
        //    console.log("center");
        //   Popup.centeredPopup.placePopup();
        //}
        document.querySelectorAll("h1, h2").forEach((heading) => {

            if (scrollPosition >= heading.offsetTop && scrollPosition < heading.offsetTop + heading.offsetHeight) {
              document.querySelectorAll(".nav-menu a").forEach((link) => {
                console.log(heading.id);
                link.classList.toggle("active", link.getAttribute("href") === `#${heading.id}`);
              });
            }
          });
    });
    
    /** Αλλαγή μεγέθους οθόνης- TODO μήπως css **/
    window.onresize = function() {
        console.log("resize");
    }


    /** Ψάχνει τον όρο στο λεξικό όρων (glossary) και επιστρέφει τα δεδομένα του, ορισμό, συνώνυμα κτλ. **/
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
    /** Εμφάνιση, απόκρυψη popups **/
    function showPopups(show){
        Popup.togglevisible = show;
        termpopups.forEach((popup, key) => {
            if (Popup.togglevisible && popup.isVisible) {
                popup.show();
            }
            else{
                popup.hide();
            }
        });
    }
};
