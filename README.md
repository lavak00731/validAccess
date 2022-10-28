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
- From here two possible ways are expected:
    1. Success, form is hidden and reset and shows a success message.
    2. Error, form is hidden and a error message is shown.

If these principles do not align the experience your users are looking, please feel free of use another validation library.

## Initialization

Please include the library locally or from a cdn. Then in a script tag or file proceed as follows:

    1. Include the library from cdn or locally.
    2. Initialize the library:

``let form = new ValidAccess({ //configuration options })``

### Initialization Options

``|Parameter Name      |Has Default Value?   |Is it Required?|Explanation about the parameter                                                                                                                                                                          |
|--------------------|---------------------|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|formId              |No                   |Yes            |Id attribute of the form element we want to validate                                                                                                                                                     |
|url                 |No                   |Yes            |url where we want to send the form information                                                                                                                                                           |
|success             |No                   |Yes            |Id attribute of the hidden element which will be shown when form sending is successful                                                                                                                   |
|error               |No                   |Yes            |Id attribute of the hidden element which will be shown when form sending is not successful                                                                                                               |
|msgUrl              |No                   |No             |a url for a json resource with the customized error messages, if it is not set default error messages will appear. The idea to use a json resource is useful for custom messages and internationalization|
|loadingImg          |No                   |Yes            | url of the loading image or code base64. it is used when the form is sending the information                                                                                                            |
|bannerClass         |Yes: "alert-banner"  |No             |css class which is attached to the error banner                                                                                                                                                          |
|loadingWrapper      |Yes: "loadingWrapper"|No             |css class applied to the form sending message when the form is submitting the info                                                                                                                       |
|isLoadingTextVisible|Yes: true            |No             |By Default a text is presented on form sending message when the form is submitting the info. Set it to false the message will be visible only for screen readers users                                   |
|fieldError          |Yes: "error"         |No             |css class applied to style error message paragraphs.                                                                                                                                                     |
|isMultistep         |Yes: false           |No             |feature to prepare the form in several steps                                                                                                                                                             |``
