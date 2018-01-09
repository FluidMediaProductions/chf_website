/**
 * Created by benjamin on 27/08/17.
 */
var map;
var marker;

$(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
    Raven.captureMessage(thrownError || jqXHR.statusText, {
        level: "error",
        extra: {
            type: ajaxSettings.type,
            url: ajaxSettings.url,
            data: ajaxSettings.data,
            status: jqXHR.status,
            error: thrownError || jqXHR.statusText,
            response: jqXHR.responseText
        }
    });
    Raven.showReportDialog();
});

function initGoogleMaps() {
    $(".address-autofill").each(function () {
        console.log(this);
        let searchBox = new google.maps.places.SearchBox(this);
        searchBox.setBounds(
            new google.maps.LatLngBounds(
                {lng: -3.8776106640625585, lat: 51.09789643167155},
                {lng: -1.9550032421875585, lat: 52.12124375625608}
            )
        );
    });
    if (typeof initMap === "function") {
        initMap()
    }
}

$(function () {
    // Select all links with hashes
    $('a[href*="#"]')
    // Remove links that don't actually link to anything
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function (event) {
            // On-page links
            if (
                location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '')
                &&
                location.hostname === this.hostname
            ) {
                // Figure out element to scroll to
                let target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                // Does a scroll target exist?
                if (target.length) {
                    // Only prevent default if animation is actually gonna happen
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 1000, function () {
                        // Callback after animation
                        // Must change focus!
                        const $target = $(target);
                        $target.focus();
                        if ($target.is(":focus")) { // Checking if the target was focused
                            return false;
                        } else {
                            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                            $target.focus(); // Set focus again
                        }
                    });
                }
            }
        });

    $(".socials").find("a i").hover(function () {
        const $i = $(this);
        $i.data("old-colour", $i.css("color"));
        $i.css("color", $i.data("colour"));
    }, function () {
        const $i = $(this);
        $i.css("color", $i.data("old-colour"));
    });
});

function setupMainCarousel($mainCarousel, minHeight) {
    $mainCarousel.height(Math.max(window.innerHeight - $mainCarousel.offset().top, minHeight));
    $(window).on("resize", function () {
        $mainCarousel.height(Math.max(window.innerHeight - $mainCarousel.offset().top, minHeight));
    });
    $mainCarousel.find(".carousel-icon i").click(function () {
        $('html, body').animate({
            scrollTop: $(this).offset().top
        }, 1500);
    });
}

function loadFeaturedHouses($featuredHouses) {
    const $house = $(`
    <div class="col-sm-6 col-lg-3 mt-4">
        <div class="card">
            <div class="corner-ribbon-container">
                <img class="card-img-top" src="" alt="">
                <div class="corner-ribbon"><span></span></div>
            </div>
            <div class="card-body">
                <h4 class="card-title"></h4>
                <h5 class="card-subtitle mb-2 text-muted"></h5>
                <a href="#" class="btn btn-primary">View</a>
            </div>
        </div>
    </div>`);
    $.get({
        url: "http://api.chf.uk.com/properties",
        dataType: "text",
        success: function (d) {
            let data = d.replace(/\\r/g, "\\\\n");
            data = JSON.parse(data);
            if (data.status === "good") {
                for (let i = 0; i < 4 && i < data.properties.length; i++) {
                    const property = data.properties[i];
                    const house = $house.clone();
                    house.find("img").attr("src", property.photos[0]);
                    house.find("h4").text(property.name);
                    house.find("h5").text(property.address);
                    house.find("a").attr("href", "/properties/" + property.id);
                    if (property.sold === true) {
                        house.find(".corner-ribbon").addClass("sold").find("span").text("Sold STC")
                    } else {
                        house.find(".corner-ribbon span").text("For sale")
                    }
                    house.appendTo($featuredHouses);
                }
                $featuredHouses.find(".loader-box").hide();
            } else {
                Raven.captureMessage("Invalid response when getting featured houses", {
                    level: "error",
                    extra: {
                        response: d
                    }
                });
                Raven.showReportDialog();
            }
        },
        error: function () {
            $featuredHouses.html(
                $("<h2>")
                    .addClass("text-center")
                    .addClass("w-100")
                    .text("There was an error communicating with the server. Try again later.")
            );
        }
    });
}

function loadProperty(id, map, marker) {
    const $loaderBox = $(".loader-box");
    let propertyLoc;
    const checkLoc = setInterval(function () {
        if (typeof propertyLoc === "object") {
            map.setCenter(propertyLoc);
            marker.setPosition(propertyLoc);
            clearInterval(checkLoc);
        }
    }, 500);
    $loaderBox.show().parent().css("min-height", window.innerHeight - $loaderBox.offset().top);
    $.get({
        url: "http://api.chf.uk.com/properties/" + id,
        dataType: "text",
        success: function (d) {
            let data = d.replace(/\\r/g, "\\\\n");
            data = JSON.parse(data);
            if (data.status === "good") {
                const property = data["property"];
                const $houseImageCarousel = $("#houseImageCarousel");
                $("#description").text(property.desc.replace(/\\n/g, "\n"));
                $("#house-name").text(property.name);
                $("#address").text(property.address);
                if (property.floorplan) {
                    $("#floorplan img").attr("src", property.floorplan);
                } else {
                    $("#floorplan").hide();
                }
                $("#price").text(property.price);
                propertyLoc = property.loc;
                if (property.sold === true) {
                    $houseImageCarousel.find(".corner-ribbon").addClass("sold").find("span").text("Sold STC")
                } else {
                    $houseImageCarousel.find(".corner-ribbon span").text("For sale")
                }
                for (let i = 0; i < property.features.length; i++) {
                    const feature = property.features[i];
                    $("#features").append($("<li>").text(feature));
                }
                for (let i = 0; i < property.photos.length; i++) {
                    const photo = property.photos[i];
                    const $photo = $('<div class="carousel-item"><img class="d-block w-100" src="" alt=""></div>');
                    const $indicator = $('<li data-target="#houseImageCarousel" data-slide-to="' + i + '" ><img src=""/></li>');
                    $photo.find("img").attr("src", photo);
                    $indicator.find("img").attr("src", photo);
                    $houseImageCarousel.find(".carousel-inner").append($photo);
                    $houseImageCarousel.find(".carousel-indicators").append($indicator);
                }
                $houseImageCarousel.find(".carousel-indicators li:first").addClass("active");
                $houseImageCarousel.find(".carousel-inner div:first").addClass("active");
            } else if (data.status === "error") {
                if (data.error === "id-not-found") {
                    $(".property-body").show().html($("<h1 class='my-4 text-center'>").text("House not found"));
                    $loaderBox.hide().parent().css("min-height", "0");
                    Raven.captureMessage("House not found", {
                        level: "warning",
                        extra: {
                            houseId: id
                        }
                    });
                    Raven.showReportDialog();
                }
            } else {
                Raven.captureMessage("Invalid response when getting house", {
                    level: "error",
                    extra: {
                        response: d,
                        houseId: id
                    }
                });
                Raven.showReportDialog();
            }
            $loaderBox.hide().parent().css("min-height", "0");
            $(".property-body").show();
        },
        error: function () {
            $(".property-body").show().html($("<h1 class='my-4 text-center'>").text("There was an error communicating with the server. Try again later."));
            $loaderBox.hide().parent().css("min-height", "0");
        }
    });
}

function doPropertySearch(location, price, distance, sold) {
    if (typeof price === "undefined") {
        price = [-1, -1];
    }
    if (typeof distance === "undefined") {
        distance = [0, -1];
    }
    if (typeof sold === "undefined") {
        sold = 0;
    }
    const $loaderBox = $(".loader-box");
    $loaderBox.show().parent().css("min-height", window.innerHeight - $loaderBox.offset().top);
    $(".results .house:not(:first)").remove();
    let url;
    if (location === "") {
        url = "/properties";
    } else {
        url = "/properties/search/" + encodeURIComponent(location) +
        "?pricemin=" + price[0].toString() + "&pricemax=" + price[1].toString() +
        "&distmin=" + distance[0].toString() + "&distmax=" + distance[1].toString() +
        "&sold=" + sold.toString();
    }
    $.get({
        url: "http://api.chf.uk.com" + url,
        dataType: "text",
        success: function (d) {
            let data = d.replace(/\\r/g, "\\\\n");
            data = JSON.parse(data);
            if (data.status === "good") {
                const $template = $(".results .house:first");
                if (data.properties.length === 0) {
                    if (location !== "") {
                        $("#results-header").text("No property results in " + location);
                    } else {
                        $("#results-header").text("No property results");
                    }
                } else {
                    if (location !== "") {
                        $("#results-header").text("Property results in " + location);
                    }
                    for (let i = 0; i < data.properties.length; i++) {
                        const property = data.properties[i];
                        const $house = $template.clone();
                        $house.find("h3").text(property.name);
                        $house.find("h5.card-subtitle").text(property.address);
                        $house.find("h4").text(property.price);
                        if (location !== "") {
                          const dist = Math.round(property.distance * 10) / 10;
                            $house.find("h5:not(:first)").text(dist + " miles from search location");
                        }
                        for (let j = 0; j < property.features.length; j++) {
                            const feature = property.features[j];
                            $house.find("ul").append($("<li>").text(feature));
                        }
                        $house.find("img").eq(0).attr("src", property.photos[0]);
                        $house.find("img").eq(1).attr("src", property.photos[1]);
                        if (property.sold === false) {
                            $house.find(".corner-ribbon span").text("For sale");
                        } else {
                            $house.find(".corner-ribbon").addClass("sold").find("span").text("Sold STC");
                        }
                        $house.data("house-id", property.id);
                        $house.show();
                        $house.appendTo(".results > div.container");
                    }
                }
            } else if (data.status === "error") {
                if (data.error === "loc-not-found") {
                    $("#results-header").text(location + " could not be found");
                    Raven.captureMessage("Location could not be found", {
                        level: "info",
                        extra: {
                            location: location
                        }
                    });
                }
            } else {
                Raven.captureMessage("Invalid response when getting featured houses", {
                    level: "error",
                    extra: {
                        response: d
                    }
                });
                Raven.showReportDialog();
            }
            $loaderBox.hide().parent().css("min-height", "0");
        },
        error: function () {
            $("#results-header").text("There was an error communicating with the server. Try again later.");
            $loaderBox.hide().parent().css("min-height", "0");
        }
    });
}
