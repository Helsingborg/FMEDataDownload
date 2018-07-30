# FMEDataDownload
A widget for ArcGIS portal to download data transformed by FME Server

## Installation
* Configure your arcgis portal to enable custom widgets.
* Configure CORS on FME Server to enable requests from portal.
* Update config.js with your FME Server url.
* Update config.js with a valid fme server token. (Note - all clients can see this token. If you are running a public portal consider using a proxy)
* Publish a workspace as a download service. In the workspace you may use a parameter 'GEOM' to access the users AOI (WGS84 WKT) 
