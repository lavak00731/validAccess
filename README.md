# validAccess


## What is Valid Access?

Valid Access is a JS library focused on validation and accessibility.

Valid Access aims to be an instrument for making better forms, suitable for any type of user and help the implementation for developers.

## Principles of this library

The creation of this piece of code follow the next principles:

- Validation starts after form submittion.
- If there are any error in the fields (empty required fields, mistypes of information or wrong format), a banner telling the user that there issues to be solve will appear and inputs with a class chosen by the developer will be apply, plus an error message will appear.
- Inputs are handling the error messages via "aria-describedby" attributes.
- User can correct the errors and the form field will validate on input or change event.
- If the field is ok, error message will disappear. "Aria-describedby" attribute, if it was present in the field previous validation, it will be respected with the previous values, on the contrary it will be erased.
- On the resubmitting the form, error banner will dissappear and a loading icon with a legend (visible or not) will appear so the user know that a sending process started. 
- From here two possible ways are expected:
    1. Success, form is hidden and reset and shows a hidden success message.
    2. Error, form is hidden and a error message is shown.

If these principles does not align the experience your users are looking, please feel free of use another validation library.

## Initialization

