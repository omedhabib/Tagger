<script>
  
/*
  Created by Omed Habib
  Email: omed@habib.io
  Project: https://github.com/omedhabib/Tagger

  Tagger is designed to capture specific URL parameters like 'utm_medium', 'utm_source', etc., and store them as cookies with custom names. These values are then dynamically inserted into hidden input fields in all forms on a webpage. This enables marketers, sales teams, and affiliate partners to track and attribute user behavior from different campaigns and sources.

  Example use cases include proper attribution for campaigns, affiliate relationships, sales efforts, and more. The default cookie expiration is set to one month but can be customized as needed.

  Note: This data is captured through form submissions, and original sources may be overwritten in cookies if users return from different sources. Use this data with discretion.
*/

// Cookie expiration in days
var cookieExpirationDays = 30;

// Mapping of URL parameters to custom cookie names
var specificParameters = {
  'utm_medium': 'channel',
  'utm_source': 'program',
  'utm_campaign': 'campaign',
  'utm_content': 'tactic',
  'utm_term': 'term',
  'ref': 'ref'
};

// Function to get URL parameters and return them as an object
function getURLParameters(url) {
  var params = {};
  var parser = document.createElement('a');
  parser.href = url;
  var query = parser.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (specificParameters[pair[0]]) {
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
  }
  return params;
}

// Function to set a cookie
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Capture URL parameters and set them as cookies with custom names
var params = getURLParameters(window.location.href);
for (var key in specificParameters) {
  if (params[key]) {
    setCookie(specificParameters[key], params[key], cookieExpirationDays);
  }
}

// Function to dynamically insert hidden input fields into all forms
function insertHiddenFields() {
  var forms = document.getElementsByTagName('form');
  for (var i = 0; i < forms.length; i++) {
    var form = forms[i];
    for (var key in specificParameters) {
      var hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.name = specificParameters[key]; // Using the custom cookie name as the input name
      form.appendChild(hiddenInput);
    }
  }
}

// Call the function to insert hidden fields
insertHiddenFields();

// Function to get a cookie by name
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Function to fill hidden fields with corresponding cookie values
function fillHiddenFields() {
  var forms = document.getElementsByTagName('form');
  for (var i = 0; i < forms.length; i++) {
    var form = forms[i];
    var hiddenFields = form.querySelectorAll('input[type="hidden"]');
    for (var j = 0; j < hiddenFields.length; j++) {
      var field = hiddenFields[j];
      var cookieName = specificParameters[field.name];
      if (cookieName) {
        var cookieValue = getCookie(cookieName);
        if (cookieValue) {
          field.value = cookieValue;
        }
      }
    }
  }
}

// Call the function to fill hidden fields with cookie values
fillHiddenFields();
</script>  
