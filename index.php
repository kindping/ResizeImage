<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="author" content="LIN CHENG YEN"> 
	<meta name="keywords" content="resize, niceinfos, tool, image, download">
	<meta name="description" content="just resize image">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Just Resize Image</title>
	<link rel="stylesheet" href="css/sweetalert.css">
	<link rel="stylesheet" href="css/bootstrap.min.css">
	<link rel="stylesheet" href="css/just_resize_image.css">
	<script src="js/jquery.js"></script>
	<script src="js/sweetalert.js"></script>
	<script src="js/PATH.js"></script>
	<script src="js/Common.js"></script>
	<script>
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
	  ga('create', 'UA-76684955-1', 'auto');
	  ga('send', 'pageview');
	</script>
</head>
<body>
	<header id="header">
		<div>
			<h1>Just Resize Image</h1>
			<span id="author">Author : Lin Cheng Yen &lt;kindping@gmail.com&gt;</span>
		</div>
	</header>
	<main class="container-fluid">
		<div class="row">
			<div class="col-xs-12 col-sm-8 col-sm-offset-2">
				<h3 class="text-center title"></h3>
				<div class="image-area">
					<input type="file" class="image-file" value="">
					<img src="images/no-image.png" alt="" class="image">
					<div class="description">
						<span>Drop image to here!</span>
					</div>
					<div class="fn">Resize Now !</div>
				</div>
			</div>
		</div>
	</main>
	<div id="block-resized">
		<div>
			<img src="images/no-image.png" alt="" id="resized-image">
		</div>
		<h4>On image click mouse right save image.</h4>
	</div>
	<script src="js/JustResizeImage.js"></script>
</body>
</html>