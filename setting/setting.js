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
            this.config = config;
        },

        getConfig: function () {
            this.config.subHeading = this.subHeading.value;
            this.config.helpText = this.helpText.value;
            this.config.footer = this.footer.value;
            this.config.download_service = this.downloadService.value;

            return this.config;
        }

    });
});