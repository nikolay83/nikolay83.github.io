'use strict';

var appControllers = angular.module('MomAndPop.controllers', []);

// Header controller
appControllers.controller('header', ['$scope', function ($scope) {
    $scope.global.menuOpened = false;
}]);


// Main menu controller
appControllers.controller('menu', ['$scope', '$http', function ($scope, $http) {
    function calculateGauge(percent) {
        if (percent >= 100) {
            percent = 99;
        }
        $scope.gauge = {
            x: 32 + 29 * Math.sin(2 * Math.PI * percent / 100),
            y: 32 - 29 * Math.cos(2 * Math.PI * percent / 100),
            largeFlag: percent >= 50 ? 1 : 0
        };
    }

    function changeUser(data) {
        $scope.user = data;
        if (data) {
            calculateGauge(data.redeemed);
            var menu = 'menuChampion.json';
            if (data.kind === 'employee') {
                menu = 'menuEmployee.json';
            }

            $http.get('data/' + menu).success(function (data) {
                $scope.menu = data;
            });
        }
    }

    $scope.menuClicked = function () {
        $scope.global.menuOpened = false;
    };
    $scope.$watch('global.user', changeUser, true);
}]);


// Home page controller
appControllers.controller('homePage', ['$scope', '$http', function ($scope, $http) {
    $scope.resetGlobal();
    $scope.global.title = 'HomeChampion-NoCards';

    $http.get('data/businesses.json').success(function (data) {
        $scope.businesses = data.businesses;
    });

    $scope.setOrder = function (order) {
        $scope.order = order;
        var field, orderMore = 1;
        switch (order.type) {
            case 'name-asc':
                field = 'name';
                break;
            case 'name-desc':
                field = 'name';
                orderMore = -1;
                break;
            case 'amount':
                field = 'amount';
                break;
        }
        $scope.businesses.sort(function (b1, b2) {
            if (b1[field] < b2[field]) { return -orderMore; }
            if (b1[field] > b2[field]) { return orderMore; }
            return '';
        });
    };
}]);

// Search controller
appControllers.controller('search', ['$scope', '$location', function ($scope, $location) {
    $scope.mode = 'order';
    $scope.orders = [
        {
            "type": "name-asc",
            "title": "A-Z"
        },
        {
            "type": "name-desc",
            "title": "Z-A"
        },
        {
            "type": "amount",
            "title": "Amount"
        }
    ];

    $scope.setMode = function(mode) {
        $scope.mode = mode;
        $scope.search = '';
        if (mode === 'searching') {
            setTimeout(function () {
                $('.search .input').focus();
            }, 0);
        }
    };

    $scope.checkEnter = function($event) {
        if ($event.keyCode === 13) {
            $scope.doSearch();
        }
    };

    $scope.doSearch = function () {
        if ($scope.search) {
            $location.path('/search/' + $scope.search);
        }
    };
}]);


// Home page controller
appControllers.controller('searchPage', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.resetGlobal();
    $scope.global.title = 'Search Results';
    $scope.global.back = 'home';

    $scope.query = $routeParams.query;

    $http.get('data/businesses.json').success(function (data) {
        var query = ($scope.query || '').toLowerCase();
        $scope.businesses = data.businesses.filter(function (business) {
            return business.name.toLowerCase().indexOf(query) >= 0;
        });
    });
}]);



// Details page controller
appControllers.controller('detailsPage', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.resetGlobal();

    function initMaps() {
        // Check google maps api already loaded
        if ($('#google-maps-script').length) {
            loadMap();
            return;
        }

        // Map api load callback
        window.initializeGoogleMaps = function () {
            delete window.initializeGoogleMaps;
            loadMap();
        };

        // Load google maps api
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = 'google-maps-script';
        script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=initializeGoogleMaps';
        document.body.appendChild(script);
    }

    function loadMap () {
        var lat = 0,
            lng = 0;

        if ($scope.business && $scope.business.address.position) {
            lat = $scope.business.address.position.lat;
            lng = $scope.business.address.position.lng;
        }

        var mapPosition = new google.maps.LatLng(lat, lng);
        var mapCanvas = $('.map-canvas').get(0);
        var mapOptions = {
            center: mapPosition,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(mapCanvas, mapOptions);
        var marker = new google.maps.Marker({
            position: mapPosition,
            icon: 'i/marker.png',
            map: map
        });
    }

    $scope.global.title = 'Details';
    $scope.global.back = 'home';

    $http.get('data/businesses.json').success(function (data) {
        data.businesses.some(function (business) {
            if (business.id.toString() === $routeParams.id) {
                $scope.business = business;
                return true;
            }
        });

        initMaps();
    });
}]);


// Redeem page controller
appControllers.controller('redeemPage', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.resetGlobal();
    $scope.global.title = 'Display QR';
    $scope.global.back = 'home';

    $http.get('data/businesses.json').success(function (data) {
        data.businesses.some(function (business) {
            if (business.id.toString() === $routeParams.id) {
                $scope.business = business;
                $scope.redeem = business.redeem[$routeParams.redeemId] || business.redeem[0];
                return true;
            }
        });
    });
}]);


// Privacy page controller
appControllers.controller('privacyPage', ['$scope', function ($scope) {
    $scope.resetGlobal();

    $scope.global.title = 'Privacy Policy';
    $scope.source = 'partials/privacy.html';
}]);


// Terms page controller
appControllers.controller('termsPage', ['$scope', function ($scope) {
    $scope.resetGlobal();

    $scope.global.title = 'Terms & Conditions';
    $scope.source = 'partials/terms.html';
}]);


// Abuse page controller
appControllers.controller('abusePage', ['$scope', '$modal', '$location', function ($scope, $modal, $location) {
    $scope.resetGlobal();

    $scope.global.title = 'Report Abuse';
    $scope.sendIssue = function () {
        // post abuse issue to the backend
        var abuse = {
            issue: $scope.issue,
            description: $scope.issueDescription
        };

        var modalInstance = $modal.open({
            templateUrl: 'partials/modal.html',
            controller: 'modalCtrl',
            resolve: {
                text: function () { return 'Your report has been sent. \nYou\'ll be notified by email when this is solved.'; }
            }
        });

        modalInstance.result.then(function () {
            $location.path('/home');
        });
    };
}]);


// QR Scan page controller
appControllers.controller('qrScanPage', ['$scope', '$interval', '$http', '$location', function ($scope, $interval, $http, $location) {
    $scope.resetGlobal();

    $scope.global.userProfile = 'employee.json';
    $scope.global.title = 'Redeem Founder$hare';

    // Camera QR code capture routine
    function videoCapture() {
        // try to capture camera
        function startVideo(sourceId) {
            navigator.getUserMedia({video: {optional: [{sourceId: sourceId}]}, audio: true}, initVideoCapture, videoError);
        }

        // init video playback
        function initVideoCapture(stream) {
            try {
                localStream = stream;
                video.src = window.URL.createObjectURL(stream);
                video.play();

                // position video element in viewport
                setTimeout(function () {
                    $(video).css({'margin-top': (180 - $(video).height()) / 2});
                    timer = $interval(scan, 200);
                }, 100);

            } catch (e) {
                $scope.userMedia = false;
            }
        }

        // capture camera error
        function videoError() {
            $scope.userMedia = false;
        }

        // scan qr code
        function scan() {
            context.drawImage(video, 0, 0, 320, 360);
            try {
                qrcode.decode();
            } catch(e) {}
        }

        // qr scanned successfully
        function scanSuccess(res) {
            $interval.cancel(timer);
            $scope.scannedQR = res;
            localStream.stop();
            video.src = '';
        }

        qrcode.callback = scanSuccess;
        var video = document.getElementById('qr-reader-showcast');
        var canvas = document.getElementById('qr-canvas');
        var context = canvas.getContext('2d');
        var localStream;
        var timer;

        // use environment camera if possible
        if (typeof MediaStreamTrack !== 'undefined' && MediaStreamTrack.getSources) {
            MediaStreamTrack.getSources(function (sources) {
                var id = null;
                sources.forEach(function (sourceInfo) {
                    if (sourceInfo.kind === 'video') {
                        if (id === null) { id = sourceInfo.id; }
                        if (sourceInfo.facing === 'environment') { id = sourceInfo.id; }
                    }
                });
                startVideo(id);
            });
        } else {
            // use anything if camera selection not supported
            startVideo(null);
        }
    }

    // Post QR code to backend
    function postQRCode () {
        // The follow code is to post QR photo to backend. It is replaced fake code scan for a while.
        //var formData = new FormData(document.forms['qr-post-form']);
        //$http({
        //        method: 'POST',
        //        url: '/',
        //        data: formData,
        //        headers: { 'Content-Type': 'multipart/form-data' }
        //    })
        //    .success(function () {
        //
        //    });
        $scope.scannedQR = 'qr code';
        $scope.$apply();
    }

    // Check browser support getUserMedia function
    navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    $scope.userMedia = Boolean(navigator.getUserMedia);
    if ($scope.userMedia) {
        videoCapture();
    } else {
        $('#camera-input').on('change', function () {
            postQRCode();
        });
    }

    // Confirm QR code
    $scope.goConfirm = function () {
        if ($scope.scannedQR) {
            $location.path('/qr-confirm');
        }
    };
}]);


// Confirm page controller
appControllers.controller('confirmPage', ['$scope', '$modal', '$location', function ($scope, $modal, $location) {
    $scope.resetGlobal();

    $scope.global.userProfile = 'employee.json';
    $scope.global.title = 'Redeem Founder$hare';
    $scope.amount = -100;

    $scope.confirmed = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal.html',
            controller: 'modalCtrl',
            resolve: {
                text: function () { return 'The amount has been deducted successfully!'; }
            }
        });
        modalInstance.result.then(function () {
            $location.path('/home');
        });
    };
}]);


// Modal dialog controller
appControllers.controller('modalCtrl', function ($scope, $modalInstance, text) {
    $scope.text = text;
    $scope.ok = function () {
        $modalInstance.close();
    };
});


// Login page controller - shall be replaced after merge
appControllers.controller('loginPage', ['$scope', function ($scope) {
    $scope.resetGlobal();
    $scope.global.title = 'Login';
}]);
