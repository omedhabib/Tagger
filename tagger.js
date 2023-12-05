<script>
// Tagger.js - A script for capturing URL parameters and setting them as cookies.
// It then dynamically inserts these values, along with the user's IP address, into hidden fields in all forms on a webpage.

// Define the cookie expiration in days.
var cookieExpirationDays = 30;

// Define the mapping of specific URL parameters to custom cookie names.
var specificParameters = {
  'utm_medium': 'channel',
  'utm_source': 'program',
  'utm_campaign': 'campaign',
  'utm_content': 'strategy',  
  'utm_term': 'tactic',
  'ref': 'ref'
};

// Function to parse URL parameters and return them as an object.
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

// Function to set a cookie.
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get a cookie value.
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Capture URL parameters and set them as cookies with custom names.
var params = getURLParameters(window.location.href);
for (var key in specificParameters) {
  if (params[key]) {
    setCookie(specificParameters[key], params[key], cookieExpirationDays);
  }
}

// Function to dynamically insert hidden fields into all forms.
function insertHiddenFields() {
  var forms = document.getElementsByTagName('form');
  for (var i = 0; i < forms.length; i++) {
    var form = forms[i];
    for (var key in specificParameters) {
      var hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.name = specificParameters[key];
      hiddenInput.value = getCookie(specificParameters[key]); // Set value from cookie
      form.appendChild(hiddenInput);
    }
    
    // Insert a hidden field for the IP address.
    var ipInput = document.createElement('input');
    ipInput.type = 'hidden';
    ipInput.name = 'user_ip';
    form.appendChild(ipInput);
  }
}

// Function to make an AJAX call to retrieve the user's IP address.
function getUserIP() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var ip = JSON.parse(this.responseText).ip;
      // Populate the IP address in each form's hidden field.
      var forms = document.getElementsByTagName('form');
      for (var i = 0; i < forms.length; i++) {
        var form = forms[i];
        var ipField = form.querySelector('input[name="user_ip"]');
        if (ipField) {
          ipField.value = ip;
        }
      }
    }
  };
  xhr.open("GET", "https://api.ipify.org?format=json", true);
  xhr.send();
}

// Insert hidden fields and retrieve the user's IP when the page loads.
window.onload = function() {
  insertHiddenFields();
  getUserIP();
};

</script>
