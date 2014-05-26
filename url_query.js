
// Parse a URL query string into an object.
function parseQueryString(query) {
    var params = {};
    if (!query)
        return params;
    var vars = query.split("&");
    for (var i=0; i<vars.length; i++) {
        var pair = vars[i].split("=");
        var key = decodeURIComponent(pair[0]);
        params[key] = decodeURIComponent(pair[1]);
    }
    return params;
}


// Parse a URL query string for one parameter.
function getQueryParam(query, key) {
    var vars = query.split("&");
    for (var i=0; i<vars.length; i++) {
        var pair = vars[i].split("=");
        var key2 = decodeURIComponent(pair[0]);
        if (key2 == key)
            return decodeURIComponent(pair[1]);
    }
    return null;
}


// Set a parameter in a URL query string.
function setQueryParam(query, key, value) {
    var params = parseQueryString(query);
    params[key] = value;
    return formatQueryString(params);
}


// Set a parameter in a URL query string.
function deleteQueryParam(query, key) {
    var params = parseQueryString(query);
    delete params[key];
    return formatQueryString(params);
}


// encode URL query value except for colons.
function encodeParamValue(value) {
    var parts = value.split(":");
    for (var i in parts) {
        parts[i] = encodeURIComponent(parts[i]);
    }
    return parts.join(":");
}

// Format an object as a URL query string.
function formatQueryString(params) {
    var pairs = [];
    for (var key in params) {
        pairs.push(encodeURIComponent(key) + "=" +
                   encodeParamValue(params[key]));
    }
    return pairs.join("&");
}
