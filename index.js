
// Capture JS errors from js files called using the $.getScript function
$.extend({
    getScript: function (url, callback) {
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.src = url;
        // Handle Script loading
        {
            var done = false;
            // Attach handlers for all browsers
            script.onload = script.onreadystatechange = function () {
                if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                    done = true;
                    if (callback) callback();
                    // Handle memory leak in IE
                    script.onload = script.onreadystatechange = null;
                }
            };
        }
        head.appendChild(script);
        // We handle everything using the script element injection
        return undefined;
    },
});

$.getScript('js/terminals.js');
$.getScript('js/wire.js');

load = function() {
    
    svg = d3.select("body").append("svg:svg").attr('id', 'svg');
    
    ic = new Wire();
    
};
