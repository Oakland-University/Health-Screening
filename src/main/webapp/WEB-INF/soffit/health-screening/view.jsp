<c:set var="req" value="${pageContext.request}" />
<c:set var="urlBase" value="${req.scheme}://${req.serverName}:${req.localPort}${req.contextPath}" />
<script>
  var path = '${pageContext.request.contextPath}'
  var token  = '${bearer.getEncryptedToken()}'
</script>
<!--  <link href='//fonts.googleapis.com/css?family=Arimo' rel='stylesheet' type='text/css'> -->
<div id="health-screening">
  An error occurred
</div>
<script src="${pageContext.request.contextPath}/js/main.js" type="text/javascript"></script>
