<c:set var="req" value="${pageContext.request}" />
<c:set var="urlBase" value="${req.scheme}://${req.serverName}:${req.localPort}${req.contextPath}" />
<script>
  var token  = '${bearer.getEncryptedToken()}'
  var IS_DEMO = false
  var IS_GUEST_VIEW = '${bearer.username}' === 'guest'
  var PICTURE_URL = '${pageContext.request.contextPath}/static/covid.jpg'
  var PHONE = '${bearer.attributes.telephoneNumber}'
  var ACCOUNT_TYPE = '${bearer.attributes.eduPersonPrimaryAffiliation}'
  var NAME = '${bearer.attributes.displayName}'
  var EMAIL = '${bearer.attributes.mail}'

  PHONE = PHONE ? PHONE.replace('[', '').replace(']', '') : ''
  EMAIL = EMAIL ? EMAIL.replace('[', '').replace(']', '') : ''
  NAME = NAME ? NAME.replace('[', '').replace(']', '') : ''
</script>
<div id="health-screening">
  An error occurred
</div>
<script src="${pageContext.request.contextPath}/js/main.js" type="text/javascript"></script>
