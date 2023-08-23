<script>


/*
  Author: Omed Habib
  Email: omed@habib.io

  Summary:
  This script captures specific URL parameters (such as UTM parameters) and stores them as cookies, dynamically inserts hidden input fields into all forms on the webpage, and fills those fields with corresponding values from the cookies. It provides a powerful tool for marketers, sales teams, and affiliate partners to track and attribute user behavior originating from different campaigns and sources.

  Importance and Use Cases:
  - Attribution: By passing hidden input fields along every form, operations teams can capture these values to build proper attribution for campaigns that originate traffic or influence user behavior.
  - Affiliate Relationships: Ideal for building affiliate relationships, as the 'ref' token can be given to partners to ensure proper attribution for traffic they originate.
  - Sales Efforts: Outbounding sales teams (e.g., BDRs) can use this code to ensure they receive attribution for leads they generate.
  - Customizable Expiration: The default cookie expiration is set to one month, but this can be overridden depending on how long you're willing to allow attribution to affiliates.
  
  Considerations:
  - Data Reliability: This data is only captured if forms are submitted. If a user doesn't submit a form, the data is not collected. Additionally, a user could originate from one source, not fill out any form, then return from another source, overwriting the original source in the cookies. Therefore, this data should be used with discretion and taken with a grain of salt.
  - Affiliate Marketing: Great for anyone building affiliate relationships, ensuring proper attribution for traffic originating from partners.
  
  Overall, this script offers a versatile and valuable tool for various marketing and sales activities, enhancing tracking, attribution, and partnership efforts.
*/



  // Number of days before cookies expire
  var cookieExpirationDays = 30;

  // List of specific URL parameters to capture
  var specificParameters = ['utm_medium', 'utm_source', 'utm_campaign', 'utm_content', 'utm_term', 'ref'];

  // List of values to be ignored
  var blacklist = ['hs_automation', 'example232323', 'randomvalue23432'];

  // Function to check if a value is in the blacklist
  function isBlacklisted(value) {
    return blacklist.includes(value); // Check if value is in blacklist
  }

  // Function to dynamically insert hidden input fields into all forms
  function insertHiddenFields() {
    var forms = document.getElementsByTagName('form'); // Get all forms
    specificParameters.forEach(function(paramName) {
      for (var i = 0; i < forms.length; i++) {
        var hiddenInput = document.createElement('input'); // Create hidden input
        hiddenInput.type = 'hidden';
        hiddenInput.name = paramName; // Set name to match parameter
        forms[i].appendChild(hiddenInput); // Append to form
      }
    });
  }

  // Function to get URL parameters
  function getURLParameters(url) {
    var params = {};
    var parser = document.createElement('a'); // Create anchor element to parse URL
    parser.href = url;
    var query = parser.search.substring(1); // Get query string
    query.split('&').forEach(function(pair) {
      var [key, value] = pair.split('=');
      if (isBlacklisted(decodeURIComponent(value))) {
        params = {}; // Ignore all if blacklisted
        return params;
      }
      if (specificParameters.includes(key)) {
        params[key] = decodeURIComponent(value); // Add to params if in specificParameters
      }
    });
    return params;
  }

  // Function to set a cookie
  function setCookie(name, value, days) {
    var expires = days ? "; expires=" + new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString() : "";
    document.cookie = name + "=" + (value || "") + expires + "; path=/"; // Set cookie
  }

  // Function to get a cookie by name
  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i].trim();
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length); // Return value if found
    }
    return null; // Return null if not found
  }

  // Function to fill hidden fields with corresponding values from cookies
  function fillHiddenFields() {
    var forms = document.getElementsByTagName('form'); // Get all forms
    specificParameters.forEach(function(paramName) {
      var cookieValue = getCookie(paramName); // Get cookie value
      if (cookieValue) {
        for (var i = 0; i < forms.length; i++) {
          var field = forms[i].querySelector('input[type="hidden"][name="' + paramName + '"]');
          if (field) field.value = cookieValue; // Fill hidden field if found
        }
      }
    });
  }

  // Main execution
  insertHiddenFields(); // Insert hidden fields
  var params = getURLParameters(window.location.href); // Get URL parameters
  specificParameters.forEach(function(param) {
    if (params[param]) setCookie(param, params[param], cookieExpirationDays); // Set cookies
  });
  fillHiddenFields(); // Fill hidden fields
</script>
