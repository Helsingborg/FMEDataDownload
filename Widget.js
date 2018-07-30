define([
    'dojo/_base/declare',
    'jimu/BaseWidget',
    "esri/toolbars/draw",
    "esri/map",
    "dojo/on",
    "dojo/dom",
    "esri/Color",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    'esri/geometry/webMercatorUtils',
    'esri/graphic',
    //"jimu/loaderplugins/jquery-loader!https://code.jquery.com/jquery-git1.min.js",
    "jimu/loaderplugins/jquery-loader!https://code.jquery.com/jquery-git.min.js"
],
function(declare, BaseWidget, Draw, Map, on, dom, Color, SimpleFillSymbol, SimpleLineSymbol, webMercatorUtils, Graphic, $) {
    return declare([BaseWidget], {
        startup: function() {
            this.toolbar = new Draw(this.map);
            dojo.connect(this.toolbar, "onDrawEnd", this.addToMap.bind(this));
            on(dom.byId("draw"), "click", this.drawPolygon.bind(this));
            on(dom.byId("reset"), "click", this.drawReset.bind(this));
            on(dom.byId("download"), "click", this.download.bind(this));
        },
        baseClass: 'jimu-widget-mywidget',

		addToMap: function ( geometry ) {
			var symbol = new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_DASHDOT,
                    new Color( [ 255, 0, 0 ] ), 2
                ),
                new Color( [ 255, 255, 0, 0.25 ] )
            );
			geometry = webMercatorUtils.webMercatorToGeographic( geometry );
			var graphic = new Graphic( geometry, symbol );
			this.map.graphics.clear();
			this.map.graphics.add( graphic );
			this.toolbar.deactivate( Draw.POLYGON );
            this.clippingGeometry = geometry.rings[0];
		},

		drawPolygon: function () {
            this.drawReset();
			this.toolbar.activate( Draw.POLYGON );
		},

		drawReset: function () {
			this.toolbar.deactivate( Draw.POLYGON );
			this.map.graphics.clear();
        },

        bindEvents: function() {
            dojo.connect(this.toolbar, "onDrawEnd", this.addToMap);
            on(dom.byId("draw"), "click", this.drawPolygon);
            on(dom.byId("reset"), "click", this.drawReset);
        },

        validateEmail: function(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        },

        download: function() {
            if(typeof this.clippingGeometry == 'undefined') {
                alert("Vänligen kontrollera att du ritat ut ditt intresseomräde.");
                return;
            }

            if(!this.validateEmail($('#email').val())) {
                alert("Vänligen kontrollera att du angivit en korrekt epostadress.");
                return;
            }

            // Process the clippingGeometry into a WKT Polygon string
            var geometry = "POLYGON((";

            for( var i = 0; i < this.clippingGeometry.length; i++ ) {
                var lat = this.clippingGeometry[i][1];
                var lng = this.clippingGeometry[i][0];
                geometry += lng+" "+lat+",";
            }

            // Remove trailing , from string
            geometry = geometry.substr( 0, geometry.length - 1 );
            geometry += "))";
            $.ajax({
                url:"https://kartor.helsingborg.se/fme-proxy/fme/" + this.config.download_service + "/datadownload",
                type: "post",
                data: {
                        "geom" : geometry,
                        "email": $('#email').val()
                },
                dataType: "json",
                success:function(data) {
                    var results = $('#status').append('<div id="' + data.serviceResponse.jobID + '"></div>')
                    this.updateJobStatus(data.serviceResponse.jobID);
                }.bind(this),
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log("Status: " + textStatus);
                }
            });
        },

        updateJobStatus: function(id) {
            $.ajax({
                url:"https://kartor.helsingborg.se/fme-proxy/fme/jobs/" + id,
                type: "get",
                success:function(data) {
                    data = JSON.parse(data);
                    $("#" + data.id ).html(this.statusSymbol(data.status) + this.statusMessage(data) );

                    if(data.status != "SUCCESS" && data.status != "FAILED") {
                        setTimeout(function() {
                            this.updateJobStatus(id);
                        }.bind(this), 10000);
                    }
                    console.log(data);
                }.bind(this),
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log("Status: " + textStatus);
                }
            });
        },

        statusSymbol(status) {
            return '<div class="statusSymbol ' + this.statusSymbols[status] + '" style="float: left" />';
        },

        statusMessage(data) {
            return '<p class="statusMessage">' + this.statusMessages[data.status].replace("_ID_", data.id) + '</p>';
        },

        statusMessages: {
            QUEUED: "Din beställning med id=_ID_ är placerad i kö",
            PULLED: "Din beställning med id=_ID_ behandlas nu",
            SUCCESS: "Din beställning med id=_ID_ har levererats!",
            FAILED: "Någonting gick fel med id=_ID_...",
        },

        statusSymbols: {
            QUEUED: "loader",
            PULLED: "loader",
            SUCCESS: "success",
            FAILED: "failed"
        },
    });
});
