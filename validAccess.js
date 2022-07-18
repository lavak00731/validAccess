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
        msgUrl = isParameterDefined('msgUrl'),
        bannerClass = 'alert-banner',
        fieldError = 'error',
        loadingWrapper = 'loading-container',
        isMultistep = false
    } = {}) {       
        this.formId = validateFormId(formId);
        this.url = url;
        this.msgUrl = msgUrl;
        this.formBannerClass = bannerClass;
        this.formFieldError = fieldError;
        this.loadingWrapper = this.loadingWrapper;
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
            if(!this.formErrorMsgs) {
                this.formErrorMsgs = await validateErrorMsgSource(this.msgUrl); 
            }
            //add the custom class to the banner
            this.formElem.querySelector('[role="banner"]').classList.add(this.formBannerClass);
            //waiting for user to make a click on submit button
            //using click event since Submit does not aloud show custom messages           
            this.formElem.querySelector('[type="submit"]').addEventListener('click', this.#validateForm.bind(this));
        });
    }
    //checks if the element is visible
    isVisibleElem(elemToValidate) {
        return elemToValidate.offsetParent !== null;
    }
    //error msg
    errorMsgs(validationTargetId, validation) {
        const language = document.documentElement.lang;
        let msg; 
        this.formErrorMsgs[language][validationTargetId].forEach((element) => { 
            if (element) {
               if(element[validation]) {
                return msg = element[validation];
               }            
           } else {
            console.log('no message')
           }
        });        
        return msg
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
    //show error message
    showErrorMsg(field, validation) {
        if(field.dataset['valida'+validation]) {
            //set field as aria-invalid true
            field.setAttribute('aria-invalid', true);
            //get id for error message
            const valMsgId = field.dataset['valida'+validation];
            //set the template of error paragraph
            const errorMsgTemplate = `<p  id="${field.dataset['valida'+validation]}" class="${this.formFieldError}">${this.errorMsgs(`${field.dataset['valida'+validation]}`,validation)}</p>`;
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
        if(!elem.dataset.validaAriaDescribed && elem.getAttribute('aria-describedby')) {
           elem.dataset.validaAriaDescribed = elem.getAttribute('aria-describedby');
        }
    }
    //shows and hide banner
    showHideBanner () {
        //if there are field with aria-invalid, error banner must be shown
        if(this.formElem.querySelector('[aria-invalid="true"]') && !this.isVisibleElem(this.formElem.querySelector('.'+this.formBannerClass))) {
            this.formElem.querySelector('.'+this.formBannerClass).removeAttribute('hidden');
            this.formElem.querySelector('.'+this.formBannerClass).focus();
        } else {
            this.formElem.querySelector('.'+this.formBannerClass).setAttribute('hidden', true);
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
                                this.eventGiver(elemToValidate);
                                break;
                            case "typeMismatch":
                            
                                break;
                            case "tooShort":
                        
                                break;
                            case "tooLong":
                            
                                break;
                            case "stepMismatch":
                            
                                break;
                            case "rangeUnderFlow":
                        
                                break;
                            case "rangeOverFlow":
                            
                                break;
                            case "patternMismatch":
                            
                                break;
                            case "badInput":
                        
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        }
    }
    //check for complete valid form
    isValidForm() {

    }
    //Starts the validation Process
    #validateForm(e) {
        if(!!e.currentTarget) {
            e.preventDefault();
            //checks if it is an multistep
            if(!this.isMultistep) {
                this.formChildrenInput = this.formElem.querySelectorAll('input[type="tel"], input[type="text"], input[type="number"], input[type="email"], input[type="date"], input[type="datetime-local"], input[type="radio"], input[type="checkbox"], input[type="color"], select, textarea');
                this.formChildrenInput.forEach((inputElem)=>{ this.validateInput(inputElem) });
                this.showHideBanner(); 
            }
            //checks for the form fields to not have aria-invalid="true"
            if(this.isValidForm()) {

            }
        } else {
            throw new Error('The form you are trying to set up is not present in the DOM');
        }
    }
}