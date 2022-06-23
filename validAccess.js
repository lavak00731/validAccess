function isformIdDefined() {    
    throw new Error('formId parameter is required');    
}
function validateFormId(formId){
    if(typeof formId !== 'string' || formId.trim() === ''){
        throw new Error('formId must be a string')
    }
    return formId;
}
function isErrorMsgDefined() {
    throw new Error('formErrorMsgs parameter is required');
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
        url = isErrorMsgDefined(),
        bannerClass = 'alert-banner',
        fieldError = 'error',
        errorIconClass = 'icon-error',
        isMultistep = false
    } = {}) {       
        this.formId = validateFormId(formId);
        this.msgUrl = url
        this.formBannerClass = bannerClass;
        this.formFieldError = fieldError;
        this.formErrorIconClass = errorIconClass;
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
            this.#validateForm(this.formElem);            
        });
    }
    //checks if the element is visible
    isVisibleElem(elemToValidate) {
        return elemToValidate.offsetParent !== null;
    }
    //
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
    //show error message
    showErrorMsg(field, validation) {
        if(field.dataset['valida'+validation]) {
            //get id for error message
            const valMsgId = field.dataset['valida'+validation];
            //set the template of error paragraph
            const errorMsgTemplate = `<p  id="${field.dataset['valida'+validation]}" class="${this.formFieldError}">${this.errorMsgs(`${field.dataset['valida'+validation]}`,validation)}</p>`;
            if(field.type === 'radio' || field.type === 'checkbox') {
               const fieldWrapper =  field.closest('fieldset');
               if(!this.formElem.querySelector('#'+field.dataset['valida'+validation])) {
                fieldWrapper.insertAdjacentHTML('beforeend', errorMsgTemplate)
               }
            } else {
                field.insertAdjacentHTML('afterend', errorMsgTemplate)
            }
        } else {
            throw new Error(`There is no validation message for ${validation} setted for form field #${field.id}`);
        }
    }
    //validates each form input
    validateInput(elemToValidate) {
        const validationStatus = elemToValidate.validity;
        if(this.isVisibleElem(elemToValidate)) {
            if (!validationStatus.valid) {
                for ( const validProp in validationStatus) {
                    if(validationStatus[validProp]) {
                        switch (validProp) {
                            case "valueMissing":
                                this.showErrorMsg(elemToValidate, 'Required');
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
    //starts the process for validation
    validateFormElems(e) {
        e.preventDefault();
        //checks if it is an input type submit or a type button
        if(e.target.getAttribute('type') === "submit" && !this.isMultistep) {
            this.formChildrenInput = this.formElem.querySelectorAll('input[type="tel"], input[type="text"], input[type="number"], input[type="email"], input[type="date"], input[type="datetime-local"], input[type="radio"], input[type="checkbox"], input[type="color"], select, textarea');
            this.formChildrenInput.forEach((inputElem)=>{ this.validateInput(inputElem) })
        }
    }
    //Sets the submit event
    submitHandler(form) {
        form.addEventListener('click', this.validateFormElems.bind(this));
    }
    //Starts the validation Process
    #validateForm(form) {
        if(form !== null) {
            //sets the main sub
            this.submitHandler(form);
        } else {
            throw new Error('The form you are trying to set up is not present in the DOM');
        }
    }
}