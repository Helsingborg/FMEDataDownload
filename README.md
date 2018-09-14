# FMEDataDownload
A widget for ArcGIS portal to download data transformed by FME Server

## Installation
* clone or download repository
* copy ```config.example.json``` to ```config.json``` and specify your fme server api token (Note - all clients can see this token. If you are running a public portal consider using a proxy)

## Configuration
* Configure your arcgis portal to enable custom widgets.
* Configure CORS on FME Server to enable requests from portal.
* Update config.js with your FME Server url.
* Publish a workspace as a download service. In the workspace you may use a parameter 'GEOM' to access the users AOI (WGS84 WKT)