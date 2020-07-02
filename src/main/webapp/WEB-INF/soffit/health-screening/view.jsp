<c:set var="req" value="${pageContext.request}" />
<c:set var="urlBase" value="${req.scheme}://${req.serverName}:${req.localPort}${req.contextPath}" />
<script>
  var token  = '${bearer.getEncryptedToken()}'
  var IS_DEMO = false
  var IS_GUEST_VIEW = '${bearer.username}' === 'guest'
  var PICTURE_URL = '${pageContext.request.contextPath}/static/covid.jpg'
  var PHONE = '${bearer.attributes.telephoneNumber}'
  var ACCOUNT_TYPE = '${bearer.attributes.eduPersonPrimaryAffiliation}'
</script>
<div id="health-screening">
  An error occurred
</div>
<script src="${pageContext.request.contextPath}/js/main.js" type="text/javascript"></script>
