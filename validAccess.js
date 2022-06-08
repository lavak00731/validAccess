class validAccess {
    constructor(form, config = {}) {
        this.formId = form;
        this.formBannerClass = config.bannerClass || 'alert-banner';
        this.formFieldError = config.fieldError || 'error';
        this.formErrorIconClass = config.errorIconClass || 'icon-error';
        this.formIsMultistep = config.isMultistep || false;

        this.init();
    }
    init() {
        console.log('hola');
    }
}