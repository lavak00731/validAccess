function isformIdDefined() {    
    throw new Error('formId parameter is required');    
}
function validateFormId(formId){
    if(typeof formId !== 'string' || formId.trim() === ''){
        throw new Error('formId must be a string')
    }
    return formId;
}
function isParameterDefined(param) {
    throw new Error(`${param} parameter is required`);
}
async function validateErrorMsgSource(url) {
    const msgs = await fetch(url);
    const errorMsg = await msgs.json();
    if(errorMsg) {
        return errorMsg;
    } else {
        throw new Error('It is needed to have a json defined for error messages')
    }
    
}

class validAccess {
    constructor({
        formId = isformIdDefined(),
        url = isParameterDefined('url'),
        success = isParameterDefined('success'),
        error = isParameterDefined('error'),
        msgUrl = isParameterDefined('msgUrl'),
        bannerClass = 'alert-banner',
        loadingWrapper = 'loadingWrapper',
        isLoadingTextVisible = true,
        loadingImg = isParameterDefined('loadingImg'),
        fieldError = 'error',
        isMultistep = false
    } = {}) {       
        this.formId = validateFormId(formId);
        this.url = url;
        this.success = success;
        this.error = error;
        this.msgUrl = msgUrl;
        this.formBannerClass = bannerClass;
        this.loadingWrapper = loadingWrapper;
        this.loadingImg = loadingImg;
        this.isLoadingTextVisible = isLoadingTextVisible;
        this.formFieldError = fieldError;
        this.formIsMultistep = isMultistep;
        this.formElem = document.querySelector('#'+this.formId);
        this.formChildrenInput;
        //init function
        this.init();
    } 
   
    init() {
        //DOM Ready
        document.addEventListener("DOMContentLoaded", async (event) => {
            event.preventDefault();
            if(!this.formMsgs) {
                this.formMsgs = await validateErrorMsgSource(this.msgUrl); 
            }
            //add the custom class to the banner
            this.formElem.querySelector('[role="banner"]').classList.add(this.formBannerClass);
            //waiting for user to make a click on submit button
            //using click event since Submit does not aloud show custom messages           
            this.formElem.querySelector('[type="submit"]').addEventListener('click', this.#validateForm.bind(this));
            //set dependency fields events
            this.formElem.querySelectorAll('[type="radio"], [type="checkbox"]').forEach((field)=>{
                field.addEventListener('change', this.showOrHIdeDependant.bind(this));
            })
        });
    }
    //checks if the element is visible
    isVisibleElem(elemToValidate) {
        return elemToValidate.offsetParent !== null;
    }
    //error msg
    errorMsgs(elemName, validation) {
        try {
            let msgObj = this.formMsgs[document.documentElement.lang]['validation'][elemName].filter((valid) => (valid.type === validation) ? valid.msg : false);      
            return msgObj[0].msg;
        } catch {
            throw new Error('no message set to element '+elemName+' in validation '+validation);
        }
        
    }
    //adding events per field after try submiting
    eventGiver(elem) {
        if(!elem.dataset.validaEventAdded) {
            elem.dataset.validaEventAdded = "";
            let that = this;
            switch (elem.nodeName) {
                case "TEXTAREA":
                    elem.addEventListener('input', function(){
                        that.validateInput(elem);
                    });
                    break;
                case "SELECT":
                    elem.addEventListener('change', function(){
                        that.validateInput(elem)
                    });
                    break;
                case "INPUT":
                    switch(elem.getAttribute('type')) {
                        case "text":
                        case "number":
                        case "tel":
                        case "email":
                        case "url":
                        case "password":
                            elem.addEventListener('input', function(){
                                that.validateInput(elem);
                            });
                            break;
                        case "date":
                        case "file":
                        case "datetime-local":
                        case "month":
                        case "range":
                        case "time":
                        case "week":
                        case "checkbox":
                        case "radio":
                        case "color":
                            elem.addEventListener('change', function(){
                                that.validateInput(elem)
                            });
                            break;
                    }
                    
                    break;                
                default:                    
                    break;
            }
        }        
    }
    
    //shows or hides dependant field
    showOrHIdeDependant(event) {
        //if the event target has the control of the dependant field
        if(event.target.hasAttribute('aria-controls')) {
            //get id of dependant field
            let target = event.target.getAttribute('aria-controls');
            //show dependant field
            this.formElem.querySelector('#'+target).removeAttribute('hidden');
        } else {
            //get the attribute name
            let nameAttr = event.target.getAttribute('name');
            //if the element with attribute name in the group has a dependant field 
            if(this.formElem.querySelector('[name="'+nameAttr+'"][aria-controls]')) {
                //select dependant field id
                const dependantID = this.formElem.querySelector('[name="'+nameAttr+'"][aria-controls]').getAttribute('aria-controls');
                //hide dependant field
                this.formElem.querySelector('#'+dependantID).setAttribute('hidden', true);
            }
        }
        
    }

    //show error message
    showErrorMsg(field, validation) {
        if(field.dataset['valida'+validation]) {
            //set field as aria-invalid true
            field.setAttribute('aria-invalid', true);
            //get id for error message
            const valMsgId = field.dataset['valida'+validation];
            //set the template of error paragraph
            const errorMsgTemplate = `<p  id="${field.dataset['valida'+validation]}" class="${this.formFieldError}">${this.errorMsgs(`${field.name}`,validation)}</p>`;
            //checks if the element with error msg is not already in place
            if(!this.formElem.querySelector('#'+field.dataset['valida'+validation])){
                //Radio Buttons and checkboxes error msg is placed at the fieldset bottom
                if(field.type === 'radio' || field.type === 'checkbox') {
                    const fieldWrapper =  field.closest('fieldset');
                    fieldWrapper.insertAdjacentHTML('beforeend', errorMsgTemplate);                                 
                 } else {
                    //other form fields, error msgs are inserted right after the element               
                     field.parentElement.insertAdjacentHTML('beforeend', errorMsgTemplate);                                
                 }
            }
            //add aria-describedby
            if(this.checkIfAriaDescribedby(field)) {
                //if there was already aria-describedby attribute, just add the saved value, plus the error
                field.setAttribute('aria-describedby', field.dataset.validaAriaDescribed +' '+ valMsgId);
            } else {
                //if not add just error one
                field.setAttribute('aria-describedby', valMsgId);
            }
        } else {
            throw new Error(`There is no validation message for ${validation} setted for form field #${field.id}`);
        }
    }
    checkIfAriaDescribedby(elem) {
        if(elem.dataset.validaAriaDescribed) {
            return true;
        } else {
            return false;
        }
    }
    //remove error msg
    removeErrorMessage(elem) {
        //set aria-invalid to false
        elem.setAttribute('aria-invalid', false);
        //all datasets in the element
        let elemErrorMsg = elem.dataset;
        //loop throught all datasets
        for (const errorKey in elemErrorMsg) {
            //capture each data
            let featureToRemove = elemErrorMsg[errorKey];
            //checks if the feature is not null or empty
            if(featureToRemove) {
                //if the element which is refered exists
                if(document.querySelector('#'+featureToRemove)) {
                    //check if that element has the error field class, then erase it
                    if(document.querySelector('#'+featureToRemove).classList.contains(this.formFieldError)) {
                        document.querySelector('#'+featureToRemove).parentElement.removeChild(document.querySelector('#'+featureToRemove));
                        //remove aria-describedby
                        elem.removeAttribute('aria-describedby')
                        //but if there was a helping text put it back
                        if(this.checkIfAriaDescribedby(elem)){
                            elem.setAttribute('aria-describedby', elem.dataset.validaAriaDescribed);
                        }
                    }
                }
            }
                        
        }
        //remove attribute aria-describedby from element
        elem.removeAttribute('aria-describedby');
        //in case form field has a help text
        //it is checked if it had one and then restore it
        if(this.checkIfAriaDescribedby(elem)) {
            elem.setAttribute('aria-describedby', elem.dataset.validaAriaDescribed)
        }
    }    
    //add data to element with aria-describedby
    backUpHelpText(elem) {
        if(!this.checkIfAriaDescribedby(elem)) {
            if(!elem.dataset.validaAriaDescribed && elem.getAttribute('aria-describedby') && !elem.hasAttribute('data-valida-event-added')) {
                elem.dataset.validaAriaDescribed = elem.getAttribute('aria-describedby');
            }
        }        
    }
    //shows and hide banner checking for a valid form
    isValidForm () {
        //if there are field with aria-invalid, error banner must be shown
        if(this.formElem.querySelectorAll('[aria-invalid="true"]').length > 0) {
            this.formElem.querySelector('.'+this.formBannerClass).removeAttribute('hidden');
            this.formElem.querySelector('.'+this.formBannerClass).focus();
            return false;
        } else {
            this.formElem.querySelector('.'+this.formBannerClass).setAttribute('hidden', true);
            return true;
        }
    }
    //validates each form input
    validateInput(elemToValidate) {
        const validationStatus = elemToValidate.validity;
        this.backUpHelpText(elemToValidate);
        this.removeErrorMessage(elemToValidate);
        //checks if the element is visible
        if(this.isVisibleElem(elemToValidate)) {
            if (!validationStatus.valid) {
                for ( const validProp in validationStatus) {
                    if(validationStatus[validProp]) {
                        switch (validProp) {
                            case "valueMissing":
                                this.showErrorMsg(elemToValidate, 'Required');                                
                                break;
                            case "typeMismatch":
                                this.showErrorMsg(elemToValidate, 'Email');
                                break;
                            case "tooShort":
                                this.showErrorMsg(elemToValidate, 'Minlength');
                                break;
                            case "tooLong":
                                //in some browsers ui it does not trigger since the characters amount is cut
                                this.showErrorMsg(elemToValidate, 'Maxlength');
                                break;
                            case "stepMismatch":
                                this.showErrorMsg(elemToValidate, 'Stepmismatch');
                                break;
                            case "rangeUnderflow":
                                this.showErrorMsg(elemToValidate, 'Min');
                                break;
                            case "rangeOverflow":
                                console.log('over flow')
                                this.showErrorMsg(elemToValidate, 'Max');
                                break;
                            case "patternMismatch":
                                this.showErrorMsg(elemToValidate, 'Pattern');
                                break;
                            case "badInput":
                                this.showErrorMsg(elemToValidate, 'Badinput');
                                break;
                            default:
                                break;
                        }
                        this.eventGiver(elemToValidate);
                    }
                }
            }
        }
    }
    styleInjector() {
        const styleTag = document.createElement('style');
        styleTag.dataset.validStyle = "true";
        const styleContent = `${"."}${this.loadingWrapper} { display: flex;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: rgba(0,0,0,0.3 );}`;
        styleTag.append(styleContent);
        document.head.append(styleTag)
    }
    //hide backdrop
    hideBckDrop() {
        document.querySelector('.'+this.loadingWrapper).parentElement.removeChild(document.querySelector('.'+this.loadingWrapper));
    }
    //show backdrop
    showBckDrop() {
        //backdrop wrapper
        const template = document.createElement('div');
        //loading img
        const loadImg = document.createElement('img');
        //img wrapper
        const imgWrapper = document.createElement('figure');
        //loading text wrapper
        const loadingText = document.createElement('p');
        //setting img url
        loadImg.setAttribute('src', this.loadingImg);
        //adding the class selected to the user to the template as CSS reference
        template.classList.add(this.loadingWrapper);
        //appending img to img wrapper
        imgWrapper.append(loadImg);
        //adding text to text wrapper
        loadingText.append(this.formMsgs[document.documentElement.lang]['sending']);
        //setting tabIndex, 
        loadingText.setAttribute('tabIndex', '-1');
        //inserting img and text to the template
        template.append(imgWrapper, loadingText);
        //checks if there is no a style tag with data valid style in place, if it will be inserted
        if(!document.querySelector('[data-valid-style="true"]')) {
            this.styleInjector();
        }
        //including template to the body element
        document.body.append(template);
        //focus text
        document.querySelector('.'+this.loadingWrapper+' [tabIndex="-1"]').focus();        
    }
    //final msg
    showFinalMsg(msg){
        this.formElem.setAttribute('hidden', true);
        document.querySelector('#'+msg).removeAttribute('hidden');
        //focus title or sentence to show final msg
        document.querySelector('#'+msg+' [tabIndex="-1"]');
    }
    //sending form
    sendingForm(formElem) {
        const formToSend = new FormData(formElem);
        this.showBckDrop();
        
        fetch(this.url, {
            method: 'POST', // or 'PUT'
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(formToSend),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            this.hideBckDrop();
            this.showFinalMsg(this.success);
        })
        .catch((error) => {
            this.hideBckDrop();
            this.showFinalMsg(this.error);
            console.error('Error:', error);
        });
    }
    //Starts the validation Process
    #validateForm(e) {
        if(!!e.currentTarget) {
            e.preventDefault();
            this.formChildrenInput = this.formElem.querySelectorAll('input[type="tel"], input[type="text"], input[type="number"], input[type="email"], input[type="date"], input[type="datetime-local"], input[type="radio"], input[type="checkbox"], input[type="color"], select, textarea');
            this.formChildrenInput.forEach((inputElem)=>{ this.validateInput(inputElem) });
            if(this.isValidForm()) {
                //checks if it is an multistep
                if(!this.isMultistep) {
                    this.sendingForm(this.formElem)
                } else {
                    //multistep process
                }
            }
            
            
        } else {
            throw new Error('The form you are trying to set up is not present in the DOM');
        }
    }
}