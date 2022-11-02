# validAccess


## What is Valid Access?

Valid Access is a JS library focused on validation and accessibility.

Valid Access aims to be an instrument for making better forms, suitable for any type of user and help the implementation for developers.

## Principles of this library

The creation of this piece of code follow the next principles:

- Validation starts after form submittion.
- If there are any error in the fields (empty required fields, mistypes of information or wrong format), a banner telling the user that there are issues to be solved will appear and inputs with a class chosen by the developer will be apply, plus an error message will appear.
- Inputs are handling the error messages via "aria-describedby" attributes.
- User can correct the errors and the form field will validate on input or change event.
- If the field is ok, error message will disappear. "Aria-describedby" attribute, if it was present in the field previous validation, it will be respected with the previous values, on the contrary it will be erased.
- On resubmitting the form, error banner will dissappear and a loading icon with a legend (visible or not) will appear so the user know that a sending process started.
- It is important to remark, that this library relays on native form components for its validations, any custom field are not supported. 
- From here two possible ways are expected:
    1. Success, form is hidden and reset and shows a success message.
    2. Error, form is hidden and a error message is shown.

If these principles do not align the experience your users are looking, please feel free of use another validation library.

## Initialization

Please include the library locally or from a cdn. Then in a script tag or file proceed as follows:

1. Include the library from cdn or locally.
2. Initialize the library:

        let form = new ValidAccess({ //configuration options })

### Initialization Options

 **Parameter Name**       | **Has Default Value?**    | **Is it Required?** | **Explanation about the parameter**                                                                                                                                                                          
:------------------------:|:-------------------------:|:-------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:
 **formId**               | No                        | Yes                 | Id attribute of the form element we want to validate                                                                                                                                                         
 **url**                  | No                        | Yes                 | url where we want to send the form information                                                                                                                                                               
 **success**              | No                        | Yes                 | Id attribute of the hidden element which will be shown when form sending is successful                                                                                                                       
 **error**                | No                        | Yes                 | Id attribute of the hidden element which will be shown when form sending is not successful                                                                                                                   
 **msgUrl**               | No                        | No                  | "a url for a json resource with the customized error messages, if it is not set default error messages will appear\. The idea to use a json resource is useful for custom messages and internationalization" 
 **loadingImg**           | No                        | Yes                 | url of the loading image or code base64\. it is used when the form is sending the information                                                                                                                
 **bannerClass**          | "Yes: ""alert\-banner"""  | No                  | css class which is attached to the error banner                                                                                                                                                              
 **loadingWrapper**       | "Yes: ""loadingWrapper""" | No                  | css class applied to the form sending message when the form is submitting the info                                                                                                                           
 **isLoadingTextVisible** | Yes: true                 | No                  | By Default a text is presented on form sending message when the form is submitting the info\. Set it to false the message will be visible only for screen readers users                                      
 **fieldError**           | "Yes: ""error"""          | No                  | css class applied to style error message paragraphs\.                                                                                                                                                        
 **isMultistep**          | Yes: false                | No                  | feature to prepare the form in several steps                                                                                                                                                                 

## Mark Up minimum 

Valid Access is a library planned to be easy to implement. Regarding the very minimum mark up is the following:

1. A form element with an id.
2. Please include a div with role banner with ***hidden***.
    -  Example:

            <div role="alert" tabIndex="-1" hidden>
                <span aria-hidden="true" class="error-icon"></span>
                Please look over the following form fields with errors
            </div>
3. Labels y form elements (inputs, selects, textareas, etc.) with name and id attributes.
4. Add attribute ***aria-invalid="false"*** as a starting point
5. Please add other attributes depending on the validation type you want to do perform:
    - [***required***](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required)
    - [***pattern***](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern)
    - [***minlength***](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength)
    - [***maxlength***](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength)
    - [***min***](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min)
    - [***max***](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max)

Some validations do not need any attribute such us:

- [***badInput***](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState/badInput)
- [***typeMismatch***](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState/badInput)

The rest will depend if it is needed some extra features below detailed.

If you are looking for a basic implementation, you have [our basic example](./examples/basic.html).

Any doubt regarding how to build an accessible form, follow [WCAG](https://www.w3.org/WAI/tutorials/forms/).

## Error Messages

Valid Access handle the error messages in two different ways:

1. If there is no json file with error messages, some default error messages will appear. The content will be the same as Html5 default messages.
2. If you want customized error messages, there is a parameter called **msgUrl** in the instantiation part, where a json file can be set in order to deliver customized messages per field. 

### Messages Json File Structure

            {
                //Language which appears on html lang attribute
                //This is going to be picked in order to select the right language
                "en": {
                    //Validation messages
                    "validation": {
                        //Field Name attribute
                        //Each field could support an Array of validations 
                        //The first part of the object is the type of validation, the second the message to be displayed
                        "name": [
                            //Required validation
                            {"type":"Required",
                            "msg":"This field is required"},

                            {"type":"Badinput",
                            "msg": "Please write a number"}

                            {"type": "Min",
                            "msg":"The minimum date must be 100 years ago"} 

                            {"type":"Typemismatch",
                            "msg":"This field is required"}

                            {"type": "Minlength",
                            "msg":"Please at least 10 characters are needed"}

                            {"type": "Patternmismatch",
                            "msg":"The password does not match the minimum requirements"}

                            {"type": "Stepmismatch",
                            "msg":"This field must be filled with a number based from 2 on"}

                            {"type": "Max",
                            "msg":"This field must be filled with a maximum number of 15 hours"}

                            //External Validation Function Name
                            {"type":"externalValidationFunctionName",
                            "msg": "Only Ezequiel is accepted as name"}

                            //Two fields with the same value
                            //Target is the type of validation
                            {"type": "Target",
                            "msg": "This value of this field does not match the previous one"}
                        ],                       
                    },
                    //Message to be displayed when the form is in the process of sending information
                    "sending": "Form is being sent...",
                    //Legend which will appear below a textearea with text count
                    //Variable is the maximum characters for that field, less the characters already written on it
                    "textcount": "{variable} characters left"       
                }
            }


## Special Features

### Regular Validation

This library relies in basic validation on [Html5 validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation). So the type of validations are:

   - valueMissing: A boolean value that is true if the element has a required attribute, but no value, or false otherwise. If true, the element matches the :invalid CSS pseudo-class.
   - [badInput](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState/badInput)
   - [patternMismatch](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState/patternMismatch)
   - [rangeOverflow](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState/rangeOverflow)
   - [rangeUnderflow](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState/rangeUnderflow)
   - [stepMismatch](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState/stepMismatch)
   - [tooLong](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState/tooLong)
   - [tooShort](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState/tooShort)
   - [typeMismatch](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState/typeMismatch)

   ### External Validations

   A custom validation can be used. The idea behind this is to have a function which test something and return ***true*** or ***false***. Returning ***true*** the error is present, on the contrary ***false***, that field has no errors.

   The function must be in [Global Scope](https://developer.mozilla.org/en-US/docs/Glossary/Global_scope).


   #### Example of External Validation

                function validName(name) {
                    if(name === 'Ezequiel') {
                        return false;
                    } else {
                        return true;
                    }
                }
    


### Two Identical Values in different inputs

When you need two identical values in two different fields, we use a built in functionality with a data attribute ***data-valida-target***, where the value expected is the ***id*** attribute of the other field to compare.



#### Example of Identical Values in different inputs validation

***data-valida-target="pass"***


                <div class="field-wrapper">
                    <label for="pass">Please, set a password</label>
                    <input type="password" name="pass" id="pass" required aria-invalid="false">
                </div>                    
                <div class="field-wrapper">
                    <label for="pass1">Please, repeat password</label>
                    <input type="password" name="pass1" id="pass1" required aria-invalid="false" data-valida-target="pass">        
                </div>
