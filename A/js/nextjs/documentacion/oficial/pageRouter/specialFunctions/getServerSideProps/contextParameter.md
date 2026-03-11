
## Context parameter

<details>
<summary>The context parameter is an object containing the following keys:</summary>


### params

If this page uses a dynamic route, params contains the route parameters. 
If the page name is [id].js, then params will look like { id: ... }.

### req

The HTTP IncomingMessage object
, with an additional cookies prop, which is an object with string keys mapping to string values of cookies.

### res	

The HTTP response object.

### query

An object representing the query string, including dynamic route parameters.

### preview	

(Deprecated for draftMode) preview is true if the page is in the Preview Mode and false otherwise.

### previewData	

(Deprecated for draftMode) The preview data set by setPreviewData.

### draftMode
draftMode is true if the page is in the Draft Mode and false otherwise.

### resolvedUrl	

A normalized version of the request URL that strips the _next/data prefix for client transitions and includes original query values.

### locale	

Contains the active locale (if enabled).

### locales	

Contains all supported locales (if enabled).

### defaultLocale

Contains the configured default locale (if enabled).

</details>


[getServerSideProps](./getServerSideProps.md)