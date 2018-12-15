$(document).ready(function () {

    var map = new MapmyIndia.Map("map", {center: [28.61, 77.23], zoomControl: true, hybrid: true});
    // var latitudeArr = [28.549948, 28.552232, 28.551748, 28.551738, 28.548602, 28.554603, 28.545639, 28.544339, 28.553196, 28.545842];
    // var longitudeArr = [77.268241, 77.268941, 77.269022, 77.270164, 77.271546, 77.268305, 77.26480, 77.26424, 77.265407, 77.264195];
    var mark = [];
    var randCluster = [];
    var singlemarker = null;
    var marker_remove = true;
    var markers_remove = true;
    var markerClusters;

    window.onload = function () {
        var test_num_markers = 100;

        map = new MapmyIndia.Map('map-container', {
            zoomControl: true,
            hybrid: true,
            zoom: 10
        });

        var test_num_markers = 100;
        //function to generate random markers//
        var generate_markers = function (num_markers) {
            var bounds = map.getBounds();
            var map_sw = bounds.getSouthWest();
            var map_ne = bounds.getNorthEast();
            var lng_span = map_ne.lng - map_sw.lng;
            var lat_span = map_ne.lat - map_sw.lat;
            var mark = []
            var markers = []
            // var randClusters = []
            markerClusters = L.markerClusterGroup({
                chunkedLoading: true,
                maxClusterRadius: 100,
                disableClusteringAtZoom: 26,
                singleMarkerMode: false,
                addRegionToolTips: false
            });
            /* by default the Cluster group some defaults:
            showCoverageOnHover: When you mouse over a cluster it shows the bounds of its markers.
            zoomToBoundsOnClick: When you click a cluster we zoom to its bounds.
            spiderfyOnMaxZoom: When you click a cluster at the bottom zoom level we spiderfy it so you can see all of its markers. (Note: the spiderfy occurs at the current zoom level if all items within the cluster are still clustered at the maximum zoom level or at zoom specified by disableClusteringAtZoom option)
            removeOutsideVisibleBounds: Clusters and markers too far from the viewport are removed from the map for performance.
            spiderLegPolylineOptions**/
            window.markers = [];

            $.get("http://104.211.202.3:3000/getClusters", (datarr) => {
                window.data = datarr;
                window.Markers = [];
                displayingClusters(datarr)
                displayingClusterOne(datarr)

            })

            function displayingClusters(clusterArray) {
                var event_div = document.getElementById("event-log");
                debugger
                for (var i = 0; i < 400; ++i) {
                    var pt = new L.LatLng(clusterArray[i].lat,clusterArray[i].lon);
                    var m = new L.marker(pt, {
                        draggable: true
                    });
                    m.bindPopup("marker clicked");
                    /*events on marker*/
                    m.on('click', function (a) {
                        event_div.innerHTML = 'marker is clicked';
                    });
                    markers.push(m);
                }
                markerClusters.addLayers(markers); //Bulk adding : addLayers is bulk methods for adding markers //
                map.addLayer(markerClusters); //add marker cluster to map//

                /*events on marker cluster: clusterclick,mouseover,mouseout*/
                markerClusters.on('clusterclick', function (a) {
                    event_div.innerHTML = 'This cluster contains ' + a.layer.getAllChildMarkers().length + ' markers';
                });
                /*getAllChildMarkers: Returns the array of total markers contained within that cluster.
                  getChildCount: Returns the total number of markers contained within that cluster.
                */
                markerClusters.on('clustermouseover', function (a) {
                    event_div.innerHTML = 'This cluster contains ' + a.layer.getAllChildMarkers().length + ' markers; click to view the markers';
                });
                return markers
            }
            // setTimeout(function () {
            //     displayingClusterOne(data)
            // }, 5000)
            // setTimeout(function () {
                displayRandCluster()
            // }, 5000)
            function displayingClusterOne(data) {

                var counter = 0;
                data.forEach(function (d) {
                    if (d.cluster == 1) {
                        mark[counter] = {zlat: Number(d.lat),lon:  Number(d.lon)}
                        counter++;
                    }
                })
                // displayingClusters(mark)
                displayRandCluster(mark)
            }

            function displayRandCluster(mark) {
                var arrSize = 15
                for (i = 0; i < 8; i++) {
                    randCluster[i] = mark[parseInt(Math.random() * 1000 % arrSize)]
                    debugger
                }
                window.randCluster = randCluster
                // displayingClusters(randCluster)

            }
        };


        markers = generate_markers(test_num_markers);


        var addMarker = function (pt) {
            return new L.marker(pt, {
                draggable: true,
            });
        }

        $(".mapmyindia_add_marker").click(function () {
            add_marker();

        });

        function add_marker() {
            /*Adding and removing Markers: addLayer, removeLayer and clearLayers are methods that allows the operation.
                Bulk adding and removing Markers: addLayers and removeLayers are bulk methods for adding and removing markers
                */
            if (marker_remove) {
                var pt = new L.LatLng(28.6099808, 77.2882724);
                singlemarker = addMarker(pt);
                markerClusters.addLayer(singlemarker);
            } else {
                markerClusters.removeLayer(singlemarker);
                singlemarker = null;
            }

            markerClusters.refreshClusters();
            var marker = document.getElementById("marker");
            marker.innerHTML = marker_remove ? "Remove Marker" : "Add Marker";
            marker_remove = marker_remove ? false : true;

        }

        $(".mapmyindia_add_markers").click(function () {
            add_markers();
        });

        function add_markers() {
            /*Adding and removing Markers: addLayer, removeLayer and clearLayers are methods that allows the operation.
                Bulk adding and removing Markers: addLayers and removeLayers are bulk methods for adding and removing markers
                */
            if (markers_remove) {
                for (var i = 0; i < latitudeArr.length; i++) {
                    var postion = new L.LatLng(latitudeArr[i], longitudeArr[i]);
                    /*WGS location object*/
                    mark.push(addMarker(postion));
                }
                markerClusters.addLayers(mark);
            } else {
                markerClusters.removeLayers(mark);
                delete mark;
                mark = [];
            }
            markerClusters.refreshClusters();
            var markers = document.getElementById("markers");
            markers.innerHTML = markers_remove ? "Remove Markers" : "Add Markers";
            markers_remove = markers_remove ? false : true;

        }

        $(".mapmyindia_clear_cluster").click(function () {
            clear_cluster();
        });

        function clear_cluster() {
            map.removeLayer(markerClusters);
            /*Removes all clusters from map however the markerclusters are retained*/
        }

        $(".mapmyindia_redraw_cluster").click(function () {
            redraw_cluster();
        });


        function redraw_cluster() {
            map.addLayer(markerClusters);
            /*add marker cluster to map*/
            markerClusters.refreshClusters();
            /*Redraws all cluster icons in the Marker Cluster Group to be re-drawn.*/
        }


    };
});