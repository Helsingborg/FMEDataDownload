define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/dom',
    "dojo/on",
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidgetSetting',
    './commonmark'
], function(declare, lang, dom, on, _WidgetsInTemplateMixin, BaseWidgetSetting, commonmark) {

    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
        baseClass: 'jimu-widget-streetsmartwidget-setting',

        postCreate:function() {
            this.inherited(arguments);

            if(this.config) {
                this.setConfig(this.config);
            } else {
                this.getConfig();
            }
            
        },
        startup: function() {

        },

        setConfig:function(config) {
            console.log("setconfig", config);
 
            this.config = config;

            if(this.config.locale){
            	this.selectCyclomediaLocation.set("value", this.config.locale);
            }
            if(this.config.uName){
            	this.uNameCyclomedia.value = this.config.uName;
            }
            if(this.config.uPwd){
            	this.uPwdCyclomedia.value = this.config.uPwd;
            }
            if(this.config.agreement){
                this.agreementCheck.value = this.config.agreement;
            }

            

        },

        getConfig: function () {
            this.config.subHeading = this.subHeading.value;
            this.config.helpText = this.helpText.value;
            this.config.footer = this.footer.value;

            return this.config;
        }

    });
});